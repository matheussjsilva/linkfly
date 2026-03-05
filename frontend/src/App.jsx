import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Link as LinkIcon, AlertCircle, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import './index.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      // Explicitly pass the user's current domain so the backend doesn't have to guess or use the Proxy host
      const clientDomain = window.location.origin;
      const response = await axios.post('/shorten', { 
        url,
        domain: clientDomain
      });
      setShortUrl(response.data.shortenedUrl);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao encurtar o link. Verifique a URL e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Primary AD Slot: Top Leaderboard */}
      <div className="ad-container ad-leaderboard">
        <span className="ad-label">Advertisement</span>
        <div className="ad-placeholder">Espaço Publicitário (728x90)</div>
      </div>

      <main className="container">
        <img
          src="/images/logo-png.png"
          alt="LinkFly - Encurtador de Links Simples e Rápido"
          className="logo"
        />
        
        <header>
          <h1>Encurtador de Links Grátis e Rápido - LinkFly</h1>
          <h2>Encurte seus links rapidamente</h2>
          <p className="description">
            Cole o link no campo abaixo e obtenha uma URL curta em segundos.
          </p>
        </header>

        <form onSubmit={handleSubmit} id="shorten-form">
          <div className="input-group">
            <LinkIcon className="input-icon" size={20} />
            <input
              type="url"
              id="url-input"
              placeholder="Cole seu link longo aqui (ex: https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
            {loading ? 'Encurtando...' : 'Encurtar Link'}
          </button>
        </form>

        {error && (
          <div className="error-toast" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {shortUrl && (
          <div id="shortened-link" className="success-container animate-fade-in">
            <div className="result-box">
              <span className="label">Seu Link Encurtado:</span>
              <a href={shortUrl} id="shortened-url" target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </div>
            
            <button
              onClick={handleCopy}
              id="copy-btn"
              className={copied ? 'copied' : ''}
              aria-label="Copiar link encurtado para a área de transferência"
            >
              <Copy size={18} style={{ marginRight: '8px' }} />
              {copied ? 'Copiado!' : 'Copiar Link'}
            </button>
          </div>
        )}
        
        {/* Secondary AD Slot: Rectangle (High Viewability After Shortening) */}
        <div className="ad-container ad-rectangle">
          <span className="ad-label">Advertisement</span>
          <div className="ad-placeholder">Espaço Publicitário (300x250)</div>
        </div>
      </main>

      {/* Sticky Mobile AD Slot (Anchored at the bottom) */}
      <div className="ad-container ad-mobile-sticky">
          <span className="ad-label">Advertisement</span>
          <div className="ad-placeholder">Visite Nossos Patrocinadores</div>
      </div>

      {/* --- SEO & Content Strategy Section --- */}
      {/* This section provides semantic value and word count for Google AdSense Approval */}
      <section className="seo-content">
        <div className="seo-container">
          
          <div className="seo-header">
            <h2>Por que usar o LinkFly para Encurtar seus Links?</h2>
            <p>
              O LinkFly não é apenas um encurtador de URLs comum. É uma ferramenta essencial 
              para profissionais de marketing, criadores de conteúdo e empresas que buscam 
              otimizar sua presença online. Ao reduzir links longos e complexos para URLs limpas 
              e amigáveis, você melhora a estética das suas postagens e a experiência do seu usuário final.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <Zap className="benefit-icon" />
              <h3>Rapidez e Eficiência</h3>
              <p>
                Nosso sistema foi arquitetado para ser ultra-rápido. Você cola sua URL comprida, 
                e em frações de segundo nosso algoritmo gera uma chave única e encurtada. Compartilhe 
                instantaneamente no WhatsApp, Instagram, LinkedIn ou Twitter sem ocupar preciosos 
                caracteres do seu limite de texto.
              </p>
            </div>
            <div className="benefit-card">
              <ShieldCheck className="benefit-icon" />
              <h3>Segurança e Confiabilidade</h3>
              <p>
                Todos os links gerados pelo LinkFly passam por rigorosos protocolos de 
                redirecionamento. Nossa infraestrutura garante que, quando o seu cliente clicar, 
                ele será enviado diretamente ao destino final sem atrasos ou redirecionamentos 
                suspeitos intermediários.
              </p>
            </div>
            <div className="benefit-card">
              <BarChart3 className="benefit-icon" />
              <h3>Mais Cliques (CTR)</h3>
              <p>
                Estudos mostram que links esteticamente agradáveis e curtos recebem até 34% mais 
                cliques do que URLs cheias de parâmetros UTM gigantescos. Use o LinkFly para 
                esconder a complexidade estrutural e atrair o clique de forma profissional e limpa.
              </p>
            </div>
          </div>

          <div className="faq-section">
            <h2>Perguntas Frequentes (FAQ) sobre Encurtadores de Link</h2>
            
            <div className="faq-item">
              <h3>O que é um encurtador de link ou URL?</h3>
              <p>
                De forma simples, um encurtador de URL é um serviço virtual que permite transformar 
                um endereço da web muito longo (aqueles cheios de letras, números e símbolos) em um 
                link consideravelmente menor. Este link curto redireciona de forma imperceptível 
                para a página original.
              </p>
            </div>

            <div className="faq-item">
              <h3>Os links curtos gerados no LinkFly expiram?</h3>
              <p>
                Não! Um dos grandes diferenciais do nosso serviço base é que os links encurtados aqui 
                são permanentes. Uma vez gerados, eles não possuem uma data de validade imposta pelo 
                sistema. Você pode espalhá-los pela internet com a garantia de que o seu tráfego será 
                preservado, salvo se houver violação dos nossos termos de uso (spam, phishing).
              </p>
            </div>

            <div className="faq-item">
              <h3>É seguro clicar em links curtos?</h3>
              <p>
                A filosofia do LinkFly é a transparência. Nosso sistema é projetado para encaminhar 
                tráfego orgânico seguro sem rastreamento invasivo do consumidor. Para o usuário final, 
                é o mesmo que clicar na URL direta. Como prática recomendada e padrão de higiene cibernética,
                você não deve encurtar links para malwares, e nós nos reservamos ao direito de banir 
                URLs maliciosas que comprometam a rede.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Posso encurtar links pro WhatsApp ou Instagram?</h3>
              <p>
                Sim! Essa é uma das principais razões para usar nossa ferramenta web gratuita. 
                As biografias de redes sociais geralmente têm um limite fixo para o perfil. 
                Pegar uma URL de vídeo pesado do YouTube, um convite de grupo fechado ou um 
                catálogo de vendas, passá-lo aqui e colocar o resultado lá, garante que 
                ele não fique quebrado e a conversão de seus clientes se mantenha alta!
              </p>
            </div>
          </div>

        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} LinkFly. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

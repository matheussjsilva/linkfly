import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Link as LinkIcon, AlertCircle } from 'lucide-react';
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

      <footer>
        <p>© {new Date().getFullYear()} LinkFly. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

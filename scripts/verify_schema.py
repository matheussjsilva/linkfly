import os
import sys
import psycopg2
from dotenv import load_dotenv

def main():
    # Load environment variables from the project root .env
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    load_dotenv(dotenv_path=env_path)

    # Supabase provides a direct PostgreSQL connection string in the dashboard
    # We expect the user to have DATABASE_URL defined in their .env
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("❌ ERRO: A variável 'DATABASE_URL' não foi encontrada no arquivo .env.")
        print("💡 DICA: Pegue a 'Transaction branch string' ou 'Session string' no painel do Supabase > Settings > Database.")
        sys.exit(1)

    schema_path = os.path.join(os.path.dirname(__file__), '..', 'schema.sql')
    
    if not os.path.exists(schema_path):
        print(f"❌ ERRO: Arquivo base de dados '{schema_path}' não encontrado.")
        sys.exit(1)

    print("🔄 Iniciando sincronização do Banco de Dados com schema.sql...")

    try:
        # Lê o conteúdo do arquivo SQL
        with open(schema_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()

        # Conecta diretamente à engine PostgreSQL do Supabase
        print("🔌 Conectando ao Supabase PostgreSQL...")
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()

        # Executa as instruções DDL (CREATE SCHEMA, CREATE TABLE, etc.)
        print("📦 Aplicando migrações estruturais e verificando MER...")
        cursor.execute(sql_script)

        cursor.close()
        conn.close()

        print("✅ SUCESSO! A estrutura do banco de dados está 100% sincronizada com o projeto local.")

    except psycopg2.Error as e:
        print(f"❌ FALHA NO BANCO DE DADOS: Ocorreu um erro ao aplicar o Schema SQL via psycopg2.")
        print(e)
        sys.exit(1)
    except Exception as e:
        print(f"❌ FALHA NA EXECUÇÃO: Um problema inesperado ocorreu no Script Python.")
        print(e)
        sys.exit(1)

if __name__ == "__main__":
    main()

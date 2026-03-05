import subprocess
import socket
import time
import os
import sys
import json

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def wait_for_port(port, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        if is_port_in_use(port):
            return True
        time.sleep(1)
    return False

def start_process(command, cwd):
    # No Windows, inicializar processos longos (como servidores Node) via subprocess.Popen
    # pode travar o script principal se eles compartilharem o console.
    # Usamos CREATE_NEW_CONSOLE para separá-los completamente e impedir o hang.
    flags = 0
    if os.name == 'nt':
         flags = subprocess.CREATE_NEW_CONSOLE
    
    return subprocess.Popen(
        command, 
        cwd=cwd, 
        shell=True, 
        creationflags=flags
    )

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("[1/3] Verificando e instalando dependências...")
    if not os.path.exists(os.path.join(root_dir, "node_modules")):
        subprocess.run(["npm", "install"], cwd=root_dir, shell=True)
        
    if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
        subprocess.run(["npm", "install"], cwd=frontend_dir, shell=True)

    print("[2/3] Verificando Backend (Express na porta 3000)...")
    backend_port = 3000
    if not is_port_in_use(backend_port):
        print("      -> Iniciando Backend...")
        start_process(["npm", "run", "dev"], cwd=root_dir)
        wait_for_port(backend_port)
    else:
        print("      -> Backend já ativo na porta 3000.")

    print("[3/3] Verificando Frontend (Vite/React na porta 5173 ou superior)...")
    frontend_port = 5173
    # Mapeando portas possíveis do Vite
    possible_ports = [5173, 5174, 5175, 5176]
    active_frontend_port = None

    for port in possible_ports:
        if is_port_in_use(port):
            active_frontend_port = port
            print(f"      -> Frontend já ativo na porta {active_frontend_port}.")
            break

    if not active_frontend_port:
        print("      -> Iniciando Frontend...")
        start_process(["npm", "run", "dev"], cwd=frontend_dir)
        # Espera o Vite subir na 5173 ou em uma das alternativas
        for _ in range(15):
            for port in possible_ports:
                if is_port_in_use(port):
                    active_frontend_port = port
                    break
            if active_frontend_port:
                break
            time.sleep(1)

    if not active_frontend_port:
         print("❌ Falha crítica: O frontend não subiu em nenhuma porta conhecida.")
         sys.exit(1)

    frontend_url = f"http://localhost:{active_frontend_port}"
    
    output = {
        "status": "online",
        "backend_url": f"http://localhost:{backend_port}",
        "frontend_url": frontend_url,
        "ai_instruction": f"SUBAGENTE: Utilize a URL '{frontend_url}' para acessar e testar a aplicação no browser."
    }
    
    print("\n" + "="*40)
    print("🚀 AMBIENTE ONLINE E PRONTO PARA TESTE")
    print("="*40)
    print(json.dumps(output, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()

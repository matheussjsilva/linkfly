import json
import sys
import re

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Por favor, informe a descrição da tarefa. (ex: python scripts/orchestrator.py 'alterar banco')",
            "recommended_rules": [],
            "recommended_skills": []
        }))
        sys.exit(1)

    task_description = sys.argv[1].lower()

    # Dicionários simples baseados em regex/keywords do negócio LinkFly
    rules_map = {
        r'(banco|database|postgres|supabase|sql|schema|\.env|tabela|persist|query)': [
            '.rules/03_supabase_connection.md'
        ],
        r'(cor|cores|design|css|layout|visual|tela|botão|interface|ux|ui|adsense)': [
            '.rules/01_palette_and_style.md'
        ],
        r'(seguro|token|vazamento|git|key|chave|erro|crash|log)': [
            '.rules/02_security_data_leaks.md',
            '.rules/05_error_monitoring.md'
        ]
    }

    skills_map = {
        r'(banco|database|postgres|supabase|sql|schema|\.env|tabela|persist|query)': [
            '.skills/08_supabase_integration.md',
            '.skills/01_database_expert.md'
        ],
        r'(cor|cores|design|css|layout|visual|tela|botão|interface|ux|ui|adsense)': [
            '.skills/ux_ui_specialist.md',
            '.skills/05_react_vite_specialist.md'
        ],
        r'(backend|api|express|node|rota|get|post|server)': [
            '.skills/02_software_architect.md',
            '.skills/04_fullstack_dev.md'
        ],
        r'(orquestr|manage|gerenciar|agente|automation)': [
            '.skills/09_orchestrator.md' # A nova skill de orquestração!
        ]
    }

    # As regras base de orquestração sempre são ativadas num nível macro
    found_rules = set(['.rules/04_agent_orchestration.md'])
    found_skills = set()

    for pattern, paths in rules_map.items():
        if re.search(pattern, task_description):
            for p in paths:
                found_rules.add(p)

    for pattern, paths in skills_map.items():
        if re.search(pattern, task_description):
            for p in paths:
                found_skills.add(p)

    output = {
        "status": "success",
        "task_analyzed": sys.argv[1],
        "orquestracao": {
            "recommended_rules_to_read": list(found_rules),
            "recommended_skills_to_use": list(found_skills)
        },
        "message": "Orquestrador LinkFly AI instrui: Leia os arquivos anexos antes de editar o sistema para se manter no domínio correto da tarefa."
    }

    # Print em formato JSON puro para facilitar que o Subagente/Agente leia via terminal e faça o parse.
    print(json.dumps(output, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()

# 💡 Light Control Hub

## Visão Geral
O Light Control Hub é uma plataforma IoT inovadora que permite controlar sistemas de iluminação remotamente através da web, integrando dispositivos Arduino R4 WiFi com tecnologias modernas de desenvolvimento. O projeto democratiza o controle inteligente de iluminação, oferecendo uma solução acessível para automação residencial com foco especial em acessibilidade para idosos.

## 🚀 Características Principais

### Controle de Iluminação
- ✅ Ligar/desligar luzes remotamente
- ✅ Interface visual intuitiva
- ✅ Sincronização instantânea
- ✅ Feedback de status em tempo real

### Sistema de Autenticação
- ✅ Registro seguro de usuários
- ✅ Login com verificação por email
- ✅ Tokens de sessão criptografados
- ✅ Recuperação de senha

### Dashboard Avançado
- ✅ Histórico detalhado das operações
- ✅ Estatísticas de uso completas
- ✅ Consumo energético (mensal/semanal)
- ✅ Horários de pico de utilização

### Acessibilidade para Idosos
- ✅ Botões grandes e fáceis de clicar (50px altura)
- ✅ Texto legível com fonte grande (16px+)
- ✅ Cores contrastantes para melhor visibilidade
- ✅ Ícones intuitivos e grandes (6em de tamanho)
- ✅ Interface minimalista

## 🔧 Stack Tecnológico

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Firebase SDK
- Design System próprio
- Responsive Design
- Acessibilidade WCAG

### Backend
- PHP (API REST)
- Firebase Realtime Database
- JWT Authentication
- CORS configurado

### IoT
- Arduino R4 WiFi (modelo específico)
- WiFi connectivity nativa
- Firebase integration
- Real-time communication
- LED control (pino 13)

## 📁 Estrutura do Projeto

```
Light Control Hub/
├── index.html          # Página principal
├── dashboard.html      # Dashboard de controle
├── styles.css          # Estilos principais
├── dashboard.css       # Estilos do dashboard
├── script.js           # JavaScript principal
├── dashboard.js        # JavaScript do dashboard
└── README.md          # Documentação
```

## 🚀 Como Usar

### 1. Instalação
1. Clone ou baixe os arquivos do projeto
2. Abra `index.html` em um navegador web
3. Não requer instalação de servidor local

### 2. Navegação
- **Página Principal**: Apresentação do projeto e recursos
- **Dashboard**: Controle das luzes (acesso via login)
- **Acessibilidade**: Interface especial para idosos

### 3. Funcionalidades do Dashboard
- **Controle Individual**: Clique nos botões LIGAR/DESLIGAR
- **Ações Rápidas**: Ligar/desligar todas as luzes
- **Modo Noturno**: Configuração automática para a noite
- **Programação**: Agendar luzes para horários específicos
- **Histórico**: Visualizar atividades passadas
- **Estatísticas**: Monitorar consumo e uso

## ⌨️ Atalhos do Teclado (Dashboard)
- `1-4`: Alternar luzes específicas
- `A`: Ligar todas as luzes
- `D`: Desligar todas as luzes
- `N`: Ativar modo noturno
- `T`: Abrir programação de timer
- `H`: Contato de emergência
- `ESC`: Fechar modais

## 🦽 Recursos de Acessibilidade

### Interface Amigável para Idosos
- Botões grandes com altura mínima de 50px
- Fonte grande (16px+) para melhor legibilidade
- Alto contraste entre cores
- Ícones intuitivos (💡 para luz, 🌙 para desligado)
- Feedback visual claro

### Benefícios Práticos
- **Segurança**: Controle remoto evita caminhar no escuro
- **Independência**: Não depende de terceiros
- **Monitoramento**: Família pode acompanhar via histórico
- **Simplicidade**: Interface web sem apps complicados

## 🔒 Segurança e Privacidade

### Medidas de Segurança
- Autenticação obrigatória
- Criptografia de dados
- Validação em múltiplas camadas
- Logs de auditoria

### Conformidade Legal
- LGPD (Lei Geral de Proteção de Dados)
- Termos de uso detalhados
- Política de privacidade
- Consentimento explícito

## 🎨 Design e UX

### Paleta de Cores
- Gradientes: #667eea → #764ba2
- Tipografia: Segoe UI, sans-serif
- Alto contraste para acessibilidade

### Experiência do Usuário
- Onboarding simplificado
- Feedback visual imediato
- Navegação intuitiva
- Responsividade completa

## 📊 Casos de Uso

### Residencial
- Controle de iluminação doméstica
- Automação de ambientes
- Economia de energia
- Segurança residencial

### Assistência a Idosos
- Controle sem sair da cama
- Prevenção de quedas
- Monitoramento familiar
- Interface simplificada

### Comercial
- Escritórios inteligentes
- Controle centralizado
- Relatórios de consumo

## 👥 Equipe de Desenvolvimento
- Alice Cristina Silva
- Anna Flávia Rosa Araújo
- André Borsato Pimenta
- André Filipe Gomes Vieira
- **Breno Sales Drumond** (DPO/Líder)
- Pedro Arthur Silva Senra

## 📞 Suporte e Contato

### Suporte Especializado
- **Email**: lightcontrolhub@gmail.com
- **Resposta**: Até 48h
- **Linguagem**: Simples e humanizada

### Contato de Emergência
- Suporte técnico disponível
- Contatos de emergência integrados
- Notificação familiar automática

## 🔮 Próximas Funcionalidades
- [ ] Controle por voz
- [ ] Integração com assistentes
- [ ] Sensores ambientais
- [ ] Machine Learning
- [ ] App mobile nativo
- [ ] Modo noturno automático

## 📈 Benefícios

### Para Todos os Usuários
- Controle fácil e intuitivo
- Segurança doméstica aumentada
- Economia de energia
- Interface moderna

### Especificamente para Idosos
- Independência preservada
- Prevenção de acidentes
- Monitoramento familiar
- Inclusão digital

## 🛠️ Desenvolvimento

### Padrões de Design Aplicados
- Arquitetura MVC (Model-View-Controller)
- Chain of Responsibility (sistema de filtros)
- Singleton Pattern (serviços)
- Repository Pattern (acesso a dados)

### Boas Práticas
- Código limpo e documentado
- Responsividade mobile-first
- Acessibilidade WCAG
- Performance otimizada

## 📝 Licença
Este projeto é desenvolvido para fins educacionais e de demonstração. Todos os direitos reservados à equipe de desenvolvimento.

## 🤝 Contribuição
Para contribuir com o projeto, entre em contato através do email: lightcontrolhub@gmail.com

---

**Light Control Hub** - Democratizando o controle inteligente de iluminação com foco em acessibilidade e inclusão digital. 💡✨

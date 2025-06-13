# 📝 Todo UNISUAM

Uma aplicação moderna de lista de tarefas desenvolvida para a UNISUAM, com interface elegante e funcionalidades avançadas de gerenciamento de tarefas.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15.3.1** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript 5** - Superset JavaScript com tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **React Hook Form 7.57.0** - Gerenciamento de formulários
- **Zod 3.25.57** - Validação de esquemas TypeScript
- **Heroicons 2.2.0** - Ícones SVG para React

### Backend
- **Next.js API Routes** - Endpoints serverless
- **MySQL 2** - Banco de dados relacional
- **AWS RDS** - Serviço de banco de dados na nuvem

### Ferramentas de Desenvolvimento
- **ESLint 9** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador CSS
- **Turbopack** - Bundler de alta performance

## 🎯 Funcionalidades

### ✨ Principais
- ✅ **Criar tarefas** - Adicione novas tarefas com validação
- ✏️ **Editar status** - Marque tarefas como concluídas/pendentes
- 🗑️ **Excluir tarefas** - Remova tarefas com confirmação
- 🔍 **Busca avançada** - Pesquise tarefas por texto
- 🎛️ **Filtros inteligentes** - Visualize todas, pendentes ou concluídas
- 📊 **Estatísticas em tempo real** - Acompanhe seu progresso

### 🔐 Autenticação
- 👤 **Sistema de login/registro** - Autenticação de usuários
- 🔒 **Sessões seguras** - Controle de acesso por usuário
- 🚪 **Logout** - Encerramento seguro de sessão

### 🎨 Interface e UX
- 📱 **Design responsivo** - Funciona em desktop e mobile
- 🌈 **Interface moderna** - Design glassmorphism com gradientes
- ⌨️ **Atalhos de teclado** - Navegação rápida
  - `Ctrl/Cmd + /` - Focar na busca
  - `Ctrl/Cmd + N` - Nova tarefa
  - `Escape` - Limpar busca
- 🎭 **Animações suaves** - Transições e feedback visual
- ♿ **Acessibilidade** - Labels ARIA e navegação por teclado

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                          # App Router do Next.js
│   ├── _components/              # Componentes globais
│   ├── _contexts/                # Contextos React
│   ├── _features/                # Features principais
│   │   └── Todos/                # Feature de tarefas
│   │       ├── index.tsx         # Componente principal
│   │       └── todoSchema.ts     # Validação Zod
│   ├── api/                      # API Routes
│   │   ├── login/route.ts        # Endpoint de login
│   │   ├── todo/route.ts         # CRUD de tarefas
│   │   └── user/route.ts         # Gerenciamento de usuários
│   ├── login/                    # Página de login
│   ├── register/                 # Página de registro
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── services/
│   └── connect.ts                # Conexão com MySQL
└── ...
```

## 🗄️ Banco de Dados

### Estrutura das Tabelas

#### Tabela `todo`
```sql
CREATE TABLE todo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userId VARCHAR(255) NOT NULL,
  INDEX idx_userId (userId)
);
```

#### Tabela `users` (implícita)
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Acesso ao banco MySQL (configurado no projeto)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/todo-unisuam.git
cd todo-unisuam
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento com Turbopack
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código com ESLint
```

## 🔧 Configuração

### Banco de Dados
A aplicação está configurada para usar um banco MySQL hospedado na AWS RDS. As configurações estão em `src/services/connect.ts`.

### Variáveis de Ambiente
O projeto utiliza configurações hardcoded para demonstração. Em produção, recomenda-se usar variáveis de ambiente:

```env
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=todos
```

## 📱 Funcionalidades Detalhadas

### Gerenciamento de Tarefas
- **Validação robusta**: Máximo 100 caracteres, não permite tarefas vazias
- **Persistência**: Dados salvos no MySQL com backup no localStorage
- **Feedback visual**: Loading states e confirmações
- **Ordenação**: Tarefas mais recentes primeiro

### Sistema de Busca e Filtros
- **Busca em tempo real**: Pesquisa instantânea conforme digita
- **Filtros múltiplos**: Todas, Pendentes, Concluídas
- **Combinação**: Busca + filtro funcionam juntos
- **Atalhos**: Navegação rápida por teclado

### Interface Responsiva
- **Mobile-first**: Otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para tablet e desktop
- **Touch-friendly**: Botões e áreas de toque adequadas
- **Estatísticas**: Layout adaptativo para diferentes telas

## 🎨 Design System

### Cores Principais
- **Primária**: Azul (#3B82F6) - Ações principais
- **Secundária**: Roxo (#8B5CF6) - Gradientes
- **Sucesso**: Verde (#10B981) - Tarefas concluídas
- **Perigo**: Vermelho (#EF4444) - Exclusões
- **Neutro**: Cinza - Textos e bordas

### Componentes
- **Glassmorphism**: Efeito de vidro com backdrop-blur
- **Gradientes**: Transições suaves de cor
- **Sombras**: Elevação e profundidade
- **Animações**: Transições de 200ms para suavidade

## 🔒 Segurança

- **Validação client-side**: Zod para validação de formulários
- **Validação server-side**: Validação dupla nas APIs
- **Sanitização**: Prevenção de XSS e SQL injection
- **Autenticação**: Controle de acesso por usuário
- **CORS**: Configuração adequada para produção

## 📈 Performance

- **Turbopack**: Bundler ultra-rápido para desenvolvimento
- **Code Splitting**: Carregamento otimizado de componentes
- **Lazy Loading**: Carregamento sob demanda
- **Otimização de imagens**: Next.js Image optimization
- **Caching**: Estratégias de cache para APIs

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Conecte seu repositório GitHub à Vercel
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### Outras Plataformas
- **Netlify**: Suporte completo ao Next.js
- **AWS Amplify**: Integração com outros serviços AWS
- **Railway**: Deploy simples com banco incluído

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais na UNISUAM.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para a UNISUAM

---

**UNISUAM - Centro Universitário Augusto Motta**  
*Organize suas atividades acadêmicas com eficiência!*

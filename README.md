# AutoStore 🏁

Loja de carros online com catálogo, ficha técnica, assistente de IA (RAG) e captura de leads — desenvolvido para o desafio técnico da Fluxomind.

## Stack

- **Backend**: Node.js + TypeScript + Express
- **Banco de dados**: PostgreSQL 17 + extensão pgvector (busca semântica)
- **IA**: Google Gemini (`gemini-embedding-001` para embeddings, `gemini-3.1-flash-lite` para geração de respostas)
- **Frontend**: HTML + CSS + JavaScript puro (sem framework)

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 17 instalado, com a extensão [pgvector](https://github.com/pgvector/pgvector) habilitada
- Uma chave de API do Google Gemini ([obtenha aqui](https://aistudio.google.com/))

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/danilobossolani/car-store-rag.git
cd car-store-rag
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o banco de dados

No PostgreSQL, crie um banco chamado `autostore`:

```sql
CREATE DATABASE autostore;
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senhadopostgres
DB_NAME=autostore
PORT=3000
GEMINI_API_KEY: CHAVE_API_GEMINI

### 5. Criar as tabelas e a extensão pgvector

Execute o script `src/config/schema.sql` no banco `autostore` (via psql, pgAdmin, ou qualquer cliente SQL).

### 6. Popular o banco com os 15 carros

```bash
npx tsx src/config/seed.ts
```

### 7. Gerar os embeddings dos carros (necessário para o chat de IA)

```bash
npx tsx src/config/generateEmbeddings.ts
```

⚠️ Esse passo faz chamadas reais à API do Gemini (uma por carro).

### 8. Subir o servidor

```bash
npm run dev
```

O servidor sobe em `http://localhost:3000`.

## Funcionalidades

- **Vitrine de carros** (`/`) — catálogo completo com filtros por categoria e montadora
- **Página de detalhe** (`/carro.html?id=X`) — ficha técnica completa, galeria de fotos, chat de IA e formulário de interesse
- **Nagata** (`/nagata.html`) — assistente de IA dedicado, com busca semântica (RAG) sobre os 15 carros do catálogo
- **Leads** (`/leads.html`) — listagem de todos os leads capturados

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/carros` | Lista carros (aceita `?categoria=`, `?montadora=`, `?precoMin=`, `?precoMax=`) |
| GET | `/carros/:id` | Busca um carro específico |
| POST | `/carros` | Cria um carro |
| PUT | `/carros/:id` | Atualiza um carro |
| DELETE | `/carros/:id` | Remove um carro |
| POST | `/leads` | Cria um lead |
| GET | `/leads` | Lista todos os leads |
| POST | `/chat` | Envia uma pergunta ao assistente Nagata (RAG) |

## Arquitetura

O RAG funciona assim:
1. Os textos técnicos de cada carro (`retrieval_text`) foram transformados em vetores numéricos (embeddings) usando `gemini-embedding-001` e salvos no PostgreSQL via pgvector
2. Quando o usuário faz uma pergunta, ela também é convertida em embedding
3. O sistema busca os 3 carros com embeddings mais próximos (similaridade de cosseno, usando o operador `<=>` do pgvector)
4. Os dados desses carros são enviados como contexto para o `gemini-3.1-flash-lite`, que gera a resposta final — evitando alucinação, já que o modelo responde apenas com base nos dados reais fornecidos

## Dataset

Os dados dos 15 veículos (Toyota, Volkswagen, Chevrolet, Hyundai, BYD) foram fornecidos pela organização do desafio, com preços e especificações de referência (mercado BR, 2026).
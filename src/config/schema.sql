CREATE TABLE carros (
  id SERIAL PRIMARY KEY,
  montadora VARCHAR(50) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  ano INTEGER,
  motor VARCHAR(200),
  potencia_cv VARCHAR(100),
  cambio VARCHAR(100),
  consumo VARCHAR(200),
  preco_a_partir_rs NUMERIC(12,2),
  preco_obs VARCHAR(200),
  cores VARCHAR(200),
  itens TEXT,
  descricao TEXT,
  imagem_principal VARCHAR(255),
  imagens TEXT[],
  criado_em TIMESTAMP DEFAULT NOW()
);
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefone VARCHAR(20),
  carro_id INTEGER REFERENCES carros(id),
  mensagem TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);
# Desafio Técnico Backend NodeJS

Este é um projeto de backend Node.js para importar boletos de um sistema financeiro externo e gerar relatórios em PDF. O sistema permite receber arquivos CSV contendo os dados dos boletos, PDF com os boletos, mapear as unidades dos boletos com os lotes internos do sistema da portaria e armazenar os boletos no banco de dados.

Além disso, é possível filtrar os boletos com base em diferentes critérios, como nome, valor e ID do lote. Também é possível gerar um relatório em PDF dos boletos, apresentando os dados em formato de tabela.

## Tecnologias Utilizadas

-   Node.js
-   Express.js (para criação do servidor)
-   Sequelize (ORM para interação com o banco de dados)
-   Multer (para upload de arquivos)
-   csv-parser (para leitura e extração de dados de arquivos CSV)
-   pdf-lib e pdf-parser (para manipulação de arquivos PDF)

## Configuração do Projeto

1.  Clone o repositório para sua máquina local.
2.  Instale as dependências do projeto utilizando o comando `npm install`.
3.  Certifique-se de ter um banco de dados compatível com o Sequelize (utilizei o PostgreSQL) e configure as credenciais de acesso no arquivo `config/database.js`.
4.  Com o banco conectado, na primeira execução do projeto as tabelas serão criadas automaticamente`.
5. Crie uma pasta chamada `boletos` na raiz do projeto (para salvar os boletos gerados pelo endpoint `/pdf`).

## Executando o Projeto

Para iniciar o servidor, utilize o comando `npm run dev`. O servidor estará disponível na porta 3000.

## Endpoints Disponíveis

-   `POST /import`: Endpoint para importação de boletos através de um arquivo CSV. Os boletos são mapeados com os lotes internos do sistema da portaria.
-   `POST /pdf`: Endpoint para receber um arquivo PDF contendo os boletos e distribuí-los em arquivos separados na pasta local, em ordem crescente de IDs.
-   `GET /boletos`: Endpoint para retornar todos os boletos existentes no sistema. Podem ser aplicados filtros opcionais para refinar a busca, como nome, valor e ID do lote. Os boletos são retornados em JSON. 
Também é possível retornar um relatório em PDF contendo os boletos em formato de tabela, basta adicionar `relatorio=1` como parâmetro da requisição.  O relatório é retornado em formato base64, e também cria um PDF na raiz do projeto.

## Observações

-   É necessário ter o Node.js e o banco de dados configurados corretamente para executar o projeto.
-   Certifique-se de ter as dependências necessárias instaladas.
-   Os caminhos dos arquivos e outras configurações podem ser ajustados de acordo com suas necessidades.
-   Utilizei o Insomnia para testar os endpoints e upload de arquivos.

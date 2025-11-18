<div align="center">
    <img height="150px" src="frontend/public/logo-farmalink.png" alt="Logo Farmalink"/>
</div>

<br>
Projeto desenvolvido para a matéria de Programação Web.
<br>

## Resumo do projeto

**Farmalink** é um sistema de marketplace de farmácias *Full Stack* que conecta clientes a uma variedade de medicamentos e produtos de saúde. A aplicação simula um ambiente de e-commerce real onde usuários podem pesquisar produtos, montar carrinhos de compras e acompanhar seus pedidos, enquanto administradores possuem controle total sobre o catálogo e as vendas.

O projeto foi construído com o objetivo de aplicar conceitos avançados de desenvolvimento web, integrando um frontend moderno em React com uma API robusta em Node.js.

## Funcionalidades Principais

* **Autenticação e Níveis de Acesso:**
    * Sistema de Login e Registro para clientes.
    * **Painel Administrativo** exclusivo para gestores, protegido por verificação de privilégios.
    * Criptografia de senhas utilizando `bcrypt` para segurança dos dados.
* **Experiência do Cliente:**
    * **Busca de Produtos:** Barra de pesquisa funcional para encontrar medicamentos por nome.
    * **Carrinho de Compras:** Adição de itens, cálculo automático de totais e gestão de quantidades.
    * **Checkout e Pedidos:** Fluxo completo de finalização de compra e página "Meus Pedidos" para acompanhar o status (Pendente, Enviado, etc.).
* **Painel de Administração (Dashboard):**
    * **Gestão de Pedidos:** Visualização de todas as vendas e atualização de status em tempo real (ex: de "Pendente" para "Aprovado").
    * **CRUD de Produtos:** Interface para adicionar, editar e remover produtos do catálogo.
    * **Gestão de Usuários:** Controle e remoção de usuários da plataforma.
* **Banco de Dados SQLite:** Persistência de dados leve e eficiente, sem necessidade de configuração de servidores externos complexos.

## Arquitetura e Tecnologia

O projeto utiliza uma arquitetura monorrepo com separação clara de responsabilidades:

### Backend (API)

* **Node.js** com **Express** para construção das rotas da API.
* **SQLite3** como banco de dados relacional (arquivo `.db`), ideal para prototipagem e portabilidade.
* **Bcrypt** para hashing e segurança de senhas.
* **CORS** configurado para permitir a comunicação segura entre o cliente e o servidor.

### Frontend (Interface)

* **React** (via **Vite**) para uma aplicação SPA (Single Page Application) de alta performance.
* **Tailwind CSS** para estilização utilitária, responsiva e moderna, seguindo uma identidade visual personalizada (Azul Farmalink).
* **Axios** para consumo da API e gerenciamento de estados assíncronos.
* **Lucide React** para ícones leves e vetoriais.

## Tecnologias Envolvidas

<div>
    <img height="40" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" title="React"/>
    <img height="40" src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fi5vke8fu8g8659hjvv22.jpeg"/>
    <img height="40" src="https://cdn.freebiesupply.com/logos/large/2x/nodejs-1-logo-png-transparent.png" alt="Node.js" title="Node.js"/>
    <img height="40" src="https://img.icons8.com/color/512/express-js.png" alt="Express" title="Express.js"/>
    <img height="40" src="https://upload.wikimedia.org/wikipedia/commons/3/38/SQLite370.svg" alt="SQLite" title="SQLite"/>
    <img height="40" src="https://vitejs.dev/logo.svg" alt="Vite" title="Vite"/>
    <img height="40" src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" title="JavaScript"/>
</div>
<br>

## Como Fazer para Rodar no Seu Sistema

Este projeto foi desenhado para ser simples de executar. Como utiliza SQLite, **não é necessário instalar um servidor de banco de dados (como MySQL)** separadamente. O banco é criado automaticamente.

### Pré-requisitos
* **Node.js (v18+):** [Baixe aqui](https://nodejs.org/)
* **Git:** [Baixe aqui](https://git-scm.com/)

### 1. Clonando o Repositório
```bash
# Clone o projeto
git clone [https://github.com/SEU-USUARIO/farmalink.git](https://github.com/SEU-USUARIO/farmalink.git)

# Entre na pasta
cd farmalink

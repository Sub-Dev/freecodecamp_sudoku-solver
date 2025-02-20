# 🧩 Sudoku Solver

Construção de um aplicativo Full Stack JavaScript para resolução e verificação de puzzles de Sudoku, funcionalmente similar a este: [Sudoku Solver](https://sudoku-solver.freecodecamp.rocks/).

## 📌 Tecnologias Utilizadas

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) **Node.js**
- ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) **Express.js**
- ![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white) **Chai.js**
- ![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white) **Mocha.js**

## 🚀 Como executar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/Sub-Dev/freecodecamp_sudoku-solver
cd freecodecamp_sudoku_solver
```

### 2️⃣ Instalar dependências

```bash
npm install

```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure:

```
PORT=3000
NODE_ENV=test
```

### 4️⃣ Rodar o servidor

```bash
npm start
```

### 5️⃣ Executar testes

```bash
npm run test
```

## 🛠️ Funcionalidades Implementadas

### ✨ Endpoints da API

`POST /api/solve`

- **Recebe um puzzle como uma string de 81 caracteres (usando dígitos 1-9 para células preenchidas e . para células vazias).**
- **Retorna a solução do puzzle ou mensagens de erro específicas se a entrada for inválida ou o puzzle for insolúvel.**

`POST /api/check`

- **Recebe um objeto contendo o puzzle, uma coordenada (ex.: "A1") e um valor (de 1 a 9).**
- **Retorna { valid: true } se o valor pode ser colocado na posição sem causar conflitos.**
- **Caso haja conflitos, retorna { valid: false, conflict: [ ... ] } onde o array indica se o conflito ocorre na "row", "column" e/ou "region".**
- **Se o valor já estiver na célula, retorna imediatamente { valid: true }.**

### ✅ Testes Implementados

#### /api/solve:

- Resolver um puzzle com string válida.
- Retornar erro se o puzzle estiver faltando.
- Retornar erro se o puzzle contiver caracteres inválidos.
- Retornar erro se o puzzle tiver comprimento diferente de 81.
- Retornar erro se o puzzle não puder ser resolvido.

#### /api/check:

- Verificar posicionamento com todos os campos fornecidos.
- Verificar posicionamento com conflito único.
- Verificar posicionamento com múltiplos conflitos.
- Verificar posicionamento com todos os conflitos possíveis.
- Retornar erro se faltar algum campo (puzzle, coordinate ou value).
- Retornar erro se o puzzle contiver caracteres inválidos.
- Retornar erro se o puzzle tiver comprimento diferente de 81.
- Retornar erro se a coordenada não apontar para uma célula existente.
- Retornar erro se o valor não estiver entre 1 e 9.

## 🔗 Links Importantes

- 📂 **Código-Fonte:** [GitHub Repo](https://github.com/Sub-Dev/freecodecamp_sudoku-solver)

---

## 👥 Autor

<table>
 <tr>
 <td alinhar="centro">
 <a href="https://github.com/Sub-Dev" target="_blank">
 <img src="https://avatars.githubusercontent.com/u/68450692?v=4" alt="Anthony-Marin" height="30" width="30"/>
 </a>
 </td>
 <td>
 <strong>Anthony Marin</strong> (Sub-Dev) - <a href="https://github.com/Sub-Dev">Perfil no GitHub</a>
 </td>
 </tr>
</table>

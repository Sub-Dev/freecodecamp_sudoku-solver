const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {

  // Testes para o endpoint /api/solve

  test("Resolve um quebra-cabeça com string válida de quebra-cabeça", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        assert.isString(res.body.solution);
        done();
      });
  });

  test("Resolve um quebra-cabeça com a falta de puzzle", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field missing" });
        done();
      });
  });

  test("Resolve um quebra-cabeça com caracteres inválidos", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..7X" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  test("Resolve um quebra-cabeça com comprimento incorreto", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419.." }) // Menos de 81 caracteres
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
        done();
      });
  });

  test("Resolve um quebra-cabeça que não pode ser resolvido", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "999999999999999999999999999999999999999999999999999999999999999999999999999999999" }) // Puzzle inválido
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
        done();
      });
  });

  // Testes para o endpoint /api/check

  test("Verifica um posicionamento de quebra-cabeça com todos os campos", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A2",
        value: "3"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça com conflito de posicionamento único", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A2",
        value: "5"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça com múltiplos conflitos", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A3",
        value: "3"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.isAtLeast(res.body.conflict.length, 2);
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça com todos os conflitos possíveis", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A2",
        value: "9"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.property(res.body, "conflict");
        assert.deepEqual(res.body.conflict, ["region"]);
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça sem coordenada", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        value: "3"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça com coordenada inválida", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "Z10",
        value: "3"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid coordinate" });
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça com valor inválido", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A2",
        value: "X"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid value" });
        done();
      });
  });


  test("Verifica um posicionamento de quebra-cabeça quando o valor já está na posição", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A1",
        value: "5"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "valid");
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test("Verifica um posicionamento de quebra-cabeça sem value", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: "53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79",
        coordinate: "A2"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });

});

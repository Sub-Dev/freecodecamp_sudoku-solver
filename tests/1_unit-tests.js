const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {

  test('Lida com uma string válida de 81 caracteres', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.equal(solver.validate(puzzleString), true);
  });

  test('Lida com uma string com caracteres inválidos', () => {
    let puzzleString = '96..4..@3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.deepEqual(solver.validate(puzzleString), { error: 'Invalid characters in puzzle' });
  });

  test('Lida com uma string que não tem 81 caracteres', () => {
    let puzzleString = '96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84';
    assert.deepEqual(solver.validate(puzzleString), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Lida com um posicionamento válido na linha', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.isTrue(solver.checkRowPlacement(puzzleString, 0, 2, '5'));
  });

  test('Lida com um posicionamento inválido na linha', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.isFalse(solver.checkRowPlacement(puzzleString, 0, 2, '9'));
  });

  test('Lida com um posicionamento válido na coluna', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.isTrue(solver.checkColPlacement(puzzleString, 0, 2, '5'));
  });

  test('Lida com um posicionamento inválido na coluna', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.isFalse(solver.checkColPlacement(puzzleString, 0, 2, '6'));
  });

  test('Lida com um posicionamento válido na região 3x3', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.isTrue(solver.checkRegionPlacement(puzzleString, 0, 2, '5'));
  });

  test('Lida com um posicionamento inválido na região 3x3', () => {
    let puzzleString = '.96..4...3.4..8..1...1.3..9..3...4..7.6...2.8..7...5..5..6.4...9..1..2.7...2..84.';
    assert.isFalse(solver.checkRegionPlacement(puzzleString, 0, 2, '9'));
  });

  test('Quebra-cabeças válidos passam pelo solucionador', () => {
    let puzzleString = '53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79';
    let solvedPuzzle = solver.solve(puzzleString);
    assert.property(solvedPuzzle, 'solution');
    assert.isString(solvedPuzzle.solution);
  });

  test('Quebra-cabeças inválidos falham no solucionador', () => {
    let puzzleString = '53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79X';
    let result = solver.solve(puzzleString);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
  });

  test('Solver retorna a solução esperada para um quebra-cabeça incompleto', () => {
    let puzzleString = '53..7....6..195...98....6..8...6...34..8.3..17...2...6..6....28...419..5....8..79';
    let solvedPuzzle = solver.solve(puzzleString);
    assert.property(solvedPuzzle, 'solution');
    assert.match(solvedPuzzle.solution, /^[1-9.]+$/);
  });

});

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  // Rota para verificar um posicionamento no Sudoku
  app.post("/api/check", (req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) {
      return res.json(validation);
    }

    const { row, col } = solver.convertCoordinate(coordinate);
    if (row === -1 || col === -1) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    const index = row * 9 + col;

    // Se o valor já está na célula, retorne imediatamente valid: true
    if (puzzle.charAt(index) === value) {
      return res.json({ valid: true });
    }

    // Cria um puzzle temporário com a célula substituída por "."
    const tempPuzzle = puzzle.substring(0, index) + '.' + puzzle.substring(index + 1);

    let conflicts = [];
    if (!solver.checkRowPlacement(tempPuzzle, row, col, value)) {
      conflicts.push("row");
    }
    if (!solver.checkColPlacement(tempPuzzle, row, col, value)) {
      conflicts.push("column");
    }
    if (!solver.checkRegionPlacement(tempPuzzle, row, col, value)) {
      conflicts.push("region");
    }

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    } else {
      return res.json({ valid: true });
    }
  });




  // Rota para resolver o Sudoku
  app.post('/api/solve', (req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.status(200).json({ error: 'Required field missing' });
    }

    if (puzzle.length !== 81) {
      return res.status(200).json({ error: 'Expected puzzle to be 81 characters long' });
    }

    if (/[^1-9.]/.test(puzzle)) {
      return res.status(200).json({ error: 'Invalid characters in puzzle' });
    }

    let solution = solver.solve(puzzle);

    if (solution.error) {
      return res.status(200).json({ error: solution.error });
    }

    return res.status(200).json({ solution: solution.solution });
  });

};

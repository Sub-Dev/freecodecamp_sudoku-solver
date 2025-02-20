class SudokuSolver {
  /**
   * Valida se a string do quebra-cabeça é válida (81 caracteres e apenas números de 1 a 9 ou ".")
   */
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    return true;
  }

  /**
   * Valida o estado inicial do puzzle, garantindo que não existam conflitos nas pistas fornecidas.
   */
  validateInitialState(puzzleString) {
    const grid = puzzleString.split('');
    for (let i = 0; i < 81; i++) {
      if (grid[i] !== '.') {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const value = grid[i];
        // Cria um puzzle temporário removendo o valor da célula para testar a validade
        const tempPuzzle = puzzleString.substring(0, i) + '.' + puzzleString.substring(i + 1);
        if (
          !this.checkRowPlacement(tempPuzzle, row, col, value) ||
          !this.checkColPlacement(tempPuzzle, row, col, value) ||
          !this.checkRegionPlacement(tempPuzzle, row, col, value)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Converte coordenadas de "A1" para índices de matriz (linha, coluna)
   */
  convertCoordinate(coordinate) {
    // Verifica se a coordenada tem exatamente dois caracteres e se corresponde ao padrão esperado
    const regex = /^[A-I][1-9]$/;
    if (!regex.test(coordinate)) {
      return { row: -1, col: -1 };
    }
    const rows = "ABCDEFGHI";
    let row = rows.indexOf(coordinate.charAt(0));
    let col = parseInt(coordinate.charAt(1), 10) - 1;
    return { row, col };
  }

  /**
   * Método auxiliar para garantir que o parâmetro puzzle possa ser utilizado
   * como array: se for string, faz o split; se já for array, o utiliza diretamente.
   */
  parsePuzzle(puzzle) {
    if (typeof puzzle === 'string') {
      return puzzle.split('');
    } else if (Array.isArray(puzzle)) {
      return puzzle;
    } else {
      throw new Error('Expected puzzle to be a string or array');
    }
  }

  /**
   * Verifica se um valor pode ser colocado na linha.
   */
  checkRowPlacement(puzzle, row, column, value) {
    const grid = this.parsePuzzle(puzzle);
    for (let col = 0; col < 9; col++) {
      if (grid[row * 9 + col] === value) return false;
    }
    return true;
  }

  /**
   * Verifica se um valor pode ser colocado na coluna.
   */
  checkColPlacement(puzzle, row, column, value) {
    const grid = this.parsePuzzle(puzzle);
    for (let r = 0; r < 9; r++) {
      if (grid[r * 9 + column] === value) return false;
    }
    return true;
  }

  /**
   * Verifica se um valor pode ser colocado na região 3x3.
   */
  checkRegionPlacement(puzzle, row, column, value) {
    const grid = this.parsePuzzle(puzzle);
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[(startRow + r) * 9 + (startCol + c)] === value) return false;
      }
    }
    return true;
  }

  /**
   * Resolve o Sudoku usando Backtracking Recursivo.
   */
  solve(puzzleString) {
    let validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    // Se o estado inicial contém conflitos, o puzzle é considerado inválido
    if (!this.validateInitialState(puzzleString)) {
      return { error: 'Puzzle cannot be solved' };
    }

    let grid = puzzleString.split('');

    const solveSudoku = () => {
      for (let i = 0; i < 81; i++) {
        if (grid[i] === '.') {
          let row = Math.floor(i / 9);
          let col = i % 9;
          for (let num = 1; num <= 9; num++) {
            // Converte o número para string para as comparações
            if (
              this.checkRowPlacement(grid, row, col, num.toString()) &&
              this.checkColPlacement(grid, row, col, num.toString()) &&
              this.checkRegionPlacement(grid, row, col, num.toString())
            ) {
              grid[i] = num.toString();
              let result = solveSudoku();
              if (result) return result;
              grid[i] = '.'; // Backtrack
            }
          }
          return false; // Backtrack
        }
      }
      return grid.join('');
    };

    let solvedPuzzle = solveSudoku();
    if (!solvedPuzzle) {
      return { error: 'Puzzle cannot be solved' };
    }

    return { solution: solvedPuzzle };
  }
}

module.exports = SudokuSolver;

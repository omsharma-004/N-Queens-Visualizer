document.getElementById('solveForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const N = parseInt(formData.get('N'));

    if (isNaN(N) || N <= 0) {
        alert('Please enter a positive integer for board size.');
        return;
    }

    solveNQueens(N);
});

const solveNQueens = async (N) => {
    const board = Array.from({ length: N }, () => Array(N).fill(0));
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = '';
    const solved = await solveNQueensHelper(board, 0, N);
    if (!solved) {
        resultMessage.textContent = 'No solution exists for the given board size.';
    }
};

const solveNQueensHelper = async (board, row, N) => {
    const solutionElement = document.getElementById('solution');
    solutionElement.innerHTML = '';

    if (row >= N) {
        displayBoard(board);
        document.getElementById('boardContainer').classList.add('board-container'); // Add green shadow effect
        return true;
    }

    for (let col = 0; col < N; col++) {
        board[row][col] = 1;
        displayBoard(board);

        await delay(500);

        if (isSafe(board, row, col) && await solveNQueensHelper(board, row + 1, N)) {
            markCorrectCell(row, col);
            await delay(500);
            return true;
        } else {
            if (!isSafe(board, row, col)) {
                blinkCell(row, col);
                await delay(500);
            }
        }

        board[row][col] = 0;
        displayBoard(board);
    }

    return false;
};

const isSafe = (board, row, col) => {
    const N = board.length;

    for (let i = 0; i < row; i++) {
        if (board[i][col]) return false;
        if (board[i][col - (row - i)] || board[i][col + (row - i)]) return false;
    }

    return true;
};

const displayBoard = (board) => {
    const solutionElement = document.getElementById('solution');
    solutionElement.innerHTML = '';

    board.forEach((row, i) => {
        const boardRow = document.createElement('div');
        boardRow.classList.add('board-row');
        row.forEach((cell, j) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.style.backgroundColor = (i + j) % 2 === 0 ? '#ffffff' : '#cccccc';
            if (cell) {
                cellElement.classList.add('queen');
                cellElement.textContent = 'Q';
            }
            boardRow.appendChild(cellElement);
        });
        solutionElement.appendChild(boardRow);
    });
};

const markCorrectCell = (row, col) => {
    const cells = document.querySelectorAll('.board-row')[row].querySelectorAll('.cell');
    const cell = cells[col];
    cell.style.backgroundColor = '#00ff00';
};

const blinkCell = (row, col) => {
    const cells = document.querySelectorAll('.board-row');

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i].children[col];
        if (cell.classList.contains('queen')) {
            cell.style.backgroundColor = '#ff0000';
        }
    }

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            if (i !== row && (j === col || Math.abs(row - i) === Math.abs(col - j))) {
                const cell = cells[i].children[j];
                if (cell.classList.contains('queen')) {
                    cell.style.backgroundColor = '#ff0000';
                }
            }
        }
    }

    setTimeout(() => {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i].children[col];
            if (cell.classList.contains('queen')) {
                cell.style.backgroundColor = (row + col) % 2 === 0 ? '#ffffff' : '#cccccc';
            }
        }

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells.length; j++) {
                if (i !== row && (j === col || Math.abs(row - i) === Math.abs(col - j))) {
                    const cell = cells[i].children[j];
                    if (cell.classList.contains('queen')) {
                        cell.style.backgroundColor = (i + j) % 2 === 0 ? '#ffffff' : '#cccccc';
                    }
                }
            }
        }
    }, 500);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

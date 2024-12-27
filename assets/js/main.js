document.addEventListener('DOMContentLoaded', () => {
    function GameBoard() {
        const board = [
            '', '', '',
            '', '', '',
            '', '', ''
        ];

        const getBoard = () => board;

        const placeMarker = (index, player) => {
            const value = board[index];

            switch (value) {
                case '':
                    board[index] = player;
                    break;

                case undefined:
                    console.log('Invalid cell');
                    break;
                default:
                    console.log('This cell has already been marker');
            }
        }

        const resetBoard = () => {
            board.forEach((_, index) => {
                board[index] = '';
            });
        }

        const checkWinner = () => {
            const lines = [
                // Rows
                [board[0], board[3], board[6]],
                [board[1], board[4], board[7]],
                [board[2], board[5], board[8]],

                // Columns
                [board[0], board[1], board[2]],
                [board[3], board[4], board[5]],
                [board[6], board[7], board[8]],

                // Diagonals
                [board[0], board[4], board[8]],
                [board[2], board[4], board[6]],
            ];

            for (const line of lines) {
                if (line.every(cell => cell === 'X')) return 'X';
                if (line.every(cell => cell === 'O')) return 'O';
            }

            return null; // There is no winner
        };

        const isFull = () => {
            return board.every(cell => cell !== '');
        };

        return {
            getBoard,
            placeMarker,
            resetBoard,
            checkWinner,
            isFull
        };
    }

    function Player(name, marker) {
        return {
            name,
            marker
        };
    }

    function ScoreController() {
        let score = 0;

        const getScore = () => score;
        const incrementScore = () => score++;
        const resetScore = () => score = 0;

        return {
            getScore,
            incrementScore,
            resetScore,
        };
    };

    function GameController(nameFirstPlayer = 'Player 1', nameSecondPlayer = 'Player 2') {
        const board = GameBoard();

        const player1 = Player(nameFirstPlayer, 'O');
        const player2 = Player(nameSecondPlayer, 'X');

        const players = [
            {
                name: player1.name,
                marker: player1.marker,
            },
            {
                name: player2.name,
                marker: player2.marker,
            },
        ];

        let activePlayer = players[0];

        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };

        const getActivePLayer = () => activePlayer;

        const playRound = (cell) => {
            board.placeMarker(cell, getActivePLayer().marker);

            const winner = board.checkWinner();
            const tie = board.isFull();

            if (winner || tie) return;

            switchPlayerTurn();
        };

        return {
            players,
            getActivePLayer,
            playRound,
            getBoard: board.getBoard,
            resetBoard: board.resetBoard,
            checkWinner: board.checkWinner,
            isFull: board.isFull,
        };
    }
});
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

    function GameController(firstPlayer = 'Player 1', secondPlayer = 'Player 2') {
        const board = GameBoard();
        let gameOver = true;

        const setGameOver = (status) => {
            gameOver = status;
        };

        const player1 = Player(firstPlayer, 'O');
        const player2 = Player(secondPlayer, 'X');

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
            if (gameOver) return;

            board.placeMarker(cell, getActivePLayer().marker);

            const winner = board.checkWinner();
            const tie = board.isFull();

            if (winner || tie) return;
    
            switchPlayerTurn();
        };

        return {
            players,
            setGameOver,
            getActivePLayer,
            playRound,
            getBoard: board.getBoard,
            resetBoard: board.resetBoard,
            checkWinner: board.checkWinner,
            isFull: board.isFull,
        };
    }

    function displayController() {
        const currentPlayer = document.querySelector('.turn');
        const containerBoard = document.querySelector('.board');
        const resetBoardButton = document.querySelector('.reset-board');
        const startGameButton = document.querySelector('.start-game');
        const resetGameButton = document.querySelector('.reset-game');
        const dialog = document.querySelector('dialog');
        const form = document.querySelector('form');
        const formInputs = document.querySelectorAll('.form__input');
        const showPlayerScore = document.querySelectorAll('.score__player');
        const showWinnerdiv = document.querySelector('.winner');
        const showWinnerText = document.querySelector('.winner b');
        const player1Score = ScoreController();
        const player2Score = ScoreController();
        let game = GameController();


        const updateBoard = () => {
            containerBoard.textContent = '';
            showPlayerScore[0].textContent = `${game.players[0].name}: ${player1Score.getScore()}`;
            showPlayerScore[1].textContent = `${game.players[1].name}: ${player2Score.getScore()}`;

            const board = game.getBoard();
            const activePlayer = game.getActivePLayer();
            const winner = game.checkWinner();
            const tie = game.isFull();

            currentPlayer.textContent = `${activePlayer.name}'s turn...`;

            board.forEach((cell, index) => {
                const buttonCell = document.createElement('button');
                buttonCell.dataset.column = index;
                buttonCell.classList.add('cell');
                buttonCell.textContent = cell;

                if (cell === 'O') {
                    buttonCell.classList.add('player-o');
                } else if (cell === 'X') {
                    buttonCell.classList.add('player-x');
                }

                containerBoard.appendChild(buttonCell);
            });

            if (winner) {
                showWinnerText.textContent = `${activePlayer.name} wins`;
                showWinnerdiv.classList.add('winner__opening');
                
                confetti({
                    particleCount: 700,
                    spread: 90,
                    origin: { y: 0.6 },
                });

                setTimeout(() => {
                    showWinnerdiv.classList.remove('winner__opening');
                }, 3000);

                if (winner === 'O') {
                    player1Score.incrementScore();
                }

                if (winner === 'X') {
                    player2Score.incrementScore();
                }

                currentPlayer.textContent = `${activePlayer.name} wins`;
            } else if (tie) {
                currentPlayer.textContent = `It's a tie`;
            }
        }

        const handlerClickCell = (event) => {
            const seletedCell = event.target.dataset.column;
            const textCell = event.target.textContent;
            const winner = game.checkWinner();
            const tie = game.isFull();

            if (!seletedCell) return;

            if (winner || tie) return;

            if (textCell !== '') return;

            game.playRound(seletedCell);
            updateBoard();
        };

        containerBoard.addEventListener('click', handlerClickCell);

        const cleanBoard = () => {
            game.resetBoard();
            updateBoard();
        };

        const resetGame = () => {
            game = GameController();
            player1Score.resetScore();
            player2Score.resetScore();
            
            showPlayerScore.forEach((playerScore) => playerScore.classList.remove('score__visible'));

            updateBoard();
        };

        resetBoardButton.addEventListener('click', cleanBoard);
        resetGameButton.addEventListener('click', resetGame);

        updateBoard();

        const btns = document.querySelectorAll('.btns');
        btns.forEach(btn => {
            const spans = [];
            for (let i = 0; i < 40; i++) {
                const span = document.createElement('span');
                span.style.top = `${i * 1}px`;
                spans.push(span);
                btn.appendChild(span);
                const randomDelay = (Math.random() * 0.75) + 0;
                span.style.transitionDelay = `${randomDelay}s`;
            }
        });

        const openDialog = () => {
            dialog.showModal();
            setTimeout(() => {
                dialog.classList.add('dialog__opening');
                formInputs[0].focus();
            }, 10);
        };
        
        const closeDialog = () => {
            game.setGameOver(false);
            dialog.classList.remove('dialog__opening');
            setTimeout(() => {
                dialog.close();
                startGameButton.focus();
            }, 500);
        };

        startGameButton.addEventListener('click', openDialog);

        dialog.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
            }
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const firstPlayer = document.querySelector('#player-1').value;
            const secondPlayer = document.querySelector('#player-2').value;

            if (firstPlayer || secondPlayer) {
                game = GameController(firstPlayer, secondPlayer);
            } else {
                game = GameController();
            }

            form.reset();

            closeDialog();

            showPlayerScore.forEach((playerScore) => playerScore.classList.add('score__visible'));

            updateBoard();
        });
    }

    displayController();
});
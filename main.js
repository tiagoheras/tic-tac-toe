const Gameboard = (function () {

    let gameboardArray = ["", "", "", "", "", "", "", "", ""];

    const getGameboard = () => {
        return gameboardArray;
    }

    const setField = (fieldIndex, sign) => {
        if (gameboardArray[fieldIndex] !== '') {
            return;
        } else {
            gameboardArray[fieldIndex] = sign;
        }
    }

    const getField = (fieldIndex) => {
        return gameboardArray[fieldIndex];
    }

    const restart = () => {
        gameboardArray = ["", "", "", "", "", "", "", "", ""];
    }

    return { setField, getField, getGameboard, restart }
})()

const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return sign;
    }

    return { getSign }
}

const DisplayController = (function () {
    const fields = document.querySelectorAll('div[class="field"]');
    const header = document.querySelector('h1');
    const restartBtn = document.querySelector('button');

    const updateHeader = (message) => {
        header.innerText = message;
    }

    const renderGameboard = () => {
        const gameboardArray = Gameboard.getGameboard();
        fields.forEach((field, index) => {
            field.textContent = gameboardArray[index];
        })
    }

    fields.forEach((field, index) => {
        field.addEventListener('click', () => {
            if (!Game.getIsOver() && field.textContent === '') {
                Game.playRound(index);
                renderGameboard();
            }
        })
    })

    restartBtn.addEventListener('click', () => {
        Game.reset()
        renderGameboard();
    })

    return { renderGameboard, updateHeader }

})()

const Game = (function () {
    const player1 = Player('X');
    const player2 = Player('O');

    let round = 0;
    let isOver = false;

    const getCurrentPlayerSign = () => {
        if (round % 2 === 1) {
            return player1.getSign();
        } else {
            return player2.getSign();
        }
    }

    const playRound = (fieldIndex) => {
        Gameboard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            DisplayController.updateHeader(`Player ${getCurrentPlayerSign()} is the winner!`);
            isOver = true;
            return;
        }
        if (round === 8) {
            DisplayController.updateHeader("It's a tie!");
            isOver = true;
            return;
        }
        round++
        DisplayController.updateHeader(`It's player's ${getCurrentPlayerSign()} turn!`)
    }

    const checkWinner = (fieldIndex) => {
        const winningPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        return winningPatterns.filter(combination => combination.includes(fieldIndex)).some(possibleCombination => possibleCombination.every(index => Gameboard.getField(index) === getCurrentPlayerSign()))
    }

    const getIsOver = () => {
        return isOver;
    }

    const reset = () => {
        Gameboard.restart();
        round = 0;
        isOver = false;
        DisplayController.updateHeader(`It's player's ${getCurrentPlayerSign()} turn!`);
    }

    return { playRound, getIsOver, getCurrentPlayerSign, reset }

})()

DisplayController.renderGameboard();
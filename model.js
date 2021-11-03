/**
 * Object that allow others to subscribe and unsubscrible to
 * an event also will emit when the event is being triggered
 */
const events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    },
};

/**
 * Object player that store its name and its mark
 * @param {*} name player's name
 * @param {*} mark player's mark
 * @returns getName, getMark
 */
const Player = (name, mark) => {
    this.name = name;
    this.mark = mark;

    const getName = () => {
        return name;
    }

    const getMark = () => {
        return mark;
    }

    return {getName, getMark};
}

/**
 * Object game board that run the game
 */
const gameBoard = (() => {
    // get board dom element
    const board = document.querySelector('.board');
    // store both player in a array
    let players = [Player('X', 'X'), Player('O', 'O')];
    // store the status of the board
    let currState = [];
    // where the game is finished or not
    let gameStat = true;
    
    // create a 3*3 board on html
    create(3);
    // subscribe to stepedOnce event then call makeMove function
    events.on('stepedOnce', _makeMove);

    /**
     * Method that create the game on html and create
     * 2D array for currState
     * @param {*} n number of square each side
     */
    function create(n) {
        _makeBoard(n);
        currState = _fillArray(n);
    };

    /**
     * Method that add player to the game
     * @param {*} player player object
     */
    function addPlayer(player) {
        if (player.getMark() == 'X'){
            players[0] = player;
        } else {
            players[1] = player;
        }
    }

    /**
     * Method that clear all game data and return it
     * to the start fo game
     */
    function clearAll() {
        for (let i = 0; i < currState.length; i++) {
            for (let j = 0; j < currState[i].length; j++) {
                currState[i][j] = "";
                const square = document.querySelector(`.s${i}_${j}`);
                if (square.classList.length > 2) {
                    square.classList.remove(square.classList[2]);
                }
            }
        }
        gameStat = true;
        players = [Player('Player 1', 'X'), Player('Player 2', 'O')];
        _render();
    }

    /**
     * Method that check whether there is an winner or not
     * and which player wins
     * @param {*} i position i on board (row)
     * @param {*} j position j on board (column)
     */
    function _checkWinner(i, j) {
        if (currState[0][0] == currState[0][1] && currState[0][1] == currState[0][2] && currState[0][0] != ""
                || currState[1][0] == currState[1][1] && currState[1][0] == currState[1][2] && currState[1][0] != ""
                || currState[2][0] == currState[2][1] && currState[2][0] == currState[2][2] && currState[2][0] != ""
                || currState[0][0] == currState[1][0] && currState[1][0] == currState[2][0] && currState[0][0] != ""
                || currState[1][1] == currState[0][1] && currState[1][1] == currState[2][1] && currState[1][1] != ""
                || currState[0][2] == currState[1][2] && currState[0][2] == currState[2][2] && currState[0][2] != ""
                || currState[0][0] == currState[1][1] && currState[1][1] == currState[2][2] && currState[0][0] != ""
                || currState[0][2] == currState[1][1] && currState[1][1] == currState[2][0] && currState[0][2] != ""){
            const showWinner = document.createElement('h2');
            let winner = "";
            players.forEach(player => {
                if (player.getMark() == currState[i][j])
                    winner = player.getName();
            });
            showWinner.textContent = winner + " wins";
            document.querySelector('.container').appendChild(showWinner);
            gameStat = false;
        } 
    }

    /**
     * Method that check if the game result is draw
     * @returns whether or not the game is drawn
     */
    function _checkDraw() {
        let isDraw = false;
        for (let i = 0; i < currState.length; i++) {
            for (let j = 0; j < currState[i].length; j++){
                if (currState[i][j] == "")
                    return false;
            }
        }
        console.log(currState);
        return true;
    }

    /**
     * Method that change status as a player maked
     * a movce
     * @param {*} info square's class lsit
     */
    function _makeMove(info) {
        let i = info[1].substring(1, 2);
        let j = info[1].substring(3);
        let mark = info[2];
        currState[i][j] = mark;
        _render();
        if (gameStat) {
            _checkWinner(i, j);
            if (_checkDraw()){
                const result = document.createElement('div');
                result.textContent = "This round is draw";
                document.querySelector('.container').appendChild(result);
                gameStat = false;
            }
        }
    }

    /**
     * Method that render the board
     */
    function _render() {
        for (let i = 0; i < currState.length; i++) {
            for (let j = 0; j < currState[i].length; j++){
                const square = document.querySelector(`.s${i}_${j}`);
                square.textContent = currState[i][j];
            }
        }
    };

    /**
     * Method that make the board in html
     * @param {*} n number of square each side
     */
    function _makeBoard(n) {
        for (let i = 0; i < n; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            row.classList.add(`${i}`);
            for (let j = 0; j < n; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add(`s${i}_${j}`);
                row.appendChild(square);
            }
            board.appendChild(row);
        }
    };

    /**
     * Method that fill the 2D array
     * @param {*} n number of square each side
     * @returns a 2D array that represent the board
     */
    function _fillArray(n) {
        let arr = []
        for (let i = 0; i < n; i++) {
            let row = []
            for (let j = 0; j < n; j++) {
                row.push("");
            }
            arr.push(row);
        }
        return arr;
    }

    // only these method are public
    return {create, clearAll, addPlayer};
})();

/**
 * Object that set up that the game
 */
(function() {
    /**
     * Create two default player and create html element that
     * ask user for name
     */
    let first = Player('Player 1', 'X');
    gameBoard.addPlayer(first);
    let second = Player('Player 2', 'O');
    gameBoard.addPlayer(second);
    const squares = document.querySelectorAll('.square');
    const p1 = document.querySelector('.p1');
    const p1_enter = document.querySelector('.p1_enter');
    const p2 = document.querySelector('.p2');
    const p2_enter = document.querySelector('.p2_enter');
    let moves = 0;    

    // event listener for new game the create new game
    document.querySelector('.new').addEventListener('click', () => {
        gameBoard.clearAll();
        p1.value = "";
        p2.value = "";
        let container = document.querySelector('.container')
        container.removeChild(container.lastChild);
        moves = 0;
    });

    // eventlistener that get userinput for player's name
    p1_enter.addEventListener('click', () => {
        gameBoard.addPlayer(Player(p1.value, 'X'));
    });
    p2_enter.addEventListener('click', () => {
        gameBoard.addPlayer(Player(p2.value, 'O'));
    });

    // add eventlistener to all squares that emit stpeedOnce event
    squares.forEach(square => {
        square.addEventListener('click', () => {
             if (square.classList[2] == undefined) {
                const palyer = _clickedIt(square);
                square.classList.add(`${palyer.getMark()}`);
                events.emit('stepedOnce', square.classList);
             }
        });
    });

    // Method that return which player clicked it
    function _clickedIt(square) {
        if (moves % 2 == 0){
            moves++;
            return first;
        } else {
            moves++;
            return second;
        }
    }
})();

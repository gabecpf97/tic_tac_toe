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

const gameBoard = (() => {
    const board = document.querySelector('.board');
    let currState = [];
    let gameStat = true;
    
    create(3);
    events.on('stepedOnce', _makeMove);

    function create(n) {
        _makeBoard(n);
        currState = _fillArray(n);
    };

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
        _render();
    }

    function _checkWinner(i, j) {
        if (currState[0][0] == currState[0][1] && currState[0][1] == currState[0][2] && currState[0][0] != ""
                || currState[1][0] == currState[1][1] && currState[1][0] == currState[1][2] && currState[1][0] != ""
                || currState[2][0] == currState[2][1] && currState[2][0] == currState[2][2] && currState[2][0] != ""
                || currState[0][0] == currState[1][0] && currState[1][0] == currState[2][0] && currState[0][0] != ""
                || currState[1][1] == currState[0][1] && currState[1][1] == currState[2][1] && currState[1][1] != ""
                || currState[0][2] == currState[1][2] && currState[0][2] == currState[2][2] && currState[0][2] != ""
                || currState[0][0] == currState[1][1] && currState[1][1] == currState[2][2] && currState[0][0] != ""
                || currState[0][2] == currState[1][1] && currState[1][1] == currState[2][0] && currState[0][2] != ""){
            const showWinner = document.createElement('div');
            showWinner.textContent = currState[i][j] + " wins";
            document.querySelector('.container').appendChild(showWinner);
            gameStat = false;
        } 
    }

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

    function _makeMove(info) {
        let i = info[1].substring(1, 2);
        let j = info[1].substring(3);
        let mark = info[2];
        currState[i][j] = mark;
        _render();
        if (gameStat)
            _checkWinner(i, j);
        if (_checkDraw()){
            const result = document.createElement('div');
            result.textContent = "This round is draw";
            document.querySelector('.container').appendChild(result);
            gameStat = false;
        }
    }

    function _render() {
        for (let i = 0; i < currState.length; i++) {
            for (let j = 0; j < currState[i].length; j++){
                const square = document.querySelector(`.s${i}_${j}`);
                square.textContent = currState[i][j];
            }
        }
    };

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

    return {create, clearAll};
})();

(function() {
    const first = Player('first', 'X');
    const second = Player('second', 'O');
    let moves = 0;    
    const squares = document.querySelectorAll('.square');
    
    squares.forEach(square => {
        square.addEventListener('click', () => {
             if (square.classList[2] == undefined) {
                const palyer = _clickedIt(square);
                square.classList.add(`${palyer.getMark()}`);
                events.emit('stepedOnce', square.classList);
             }
        });
    });

    document.querySelector('.new').addEventListener('click', () => {
        gameBoard.clearAll();
        moves = 0;
    });

    function _clickedIt(square) {
        if (moves % 2 == 0){
            moves++;
            return second;
        } else {
            moves++;
            return first;
        }
    }
})();

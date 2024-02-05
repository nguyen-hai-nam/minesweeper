document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector(".grid");
    const flagsLeft = document.querySelector("#flags-left");
    const result = document.querySelector("#result");
    const width = 10;
    const bombAmount = 1;
    const squares = [];
    let isGameOver = false;

    function createBoard() {
        flagsLeft.innerHTML = bombAmount;
        const bombArray = Array(bombAmount).fill("bomb");
        const emptyArray = Array(width * width - bombAmount).fill("valid");
        const gameArray = emptyArray.concat(bombArray).sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add(gameArray[i]);
            square.setAttribute("id", i);
            square.setAttribute("data", gameArray[i] === "valid" ? 0 : 1);
            grid.appendChild(square);
            squares.push(square);
            
            square.addEventListener("click", function(e) {
                console.log("Square clicked");
                click(square);
            });

            square.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                addFlag(square);
            });
        }

        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width - 1;

            if (squares[i].classList.contains("valid")) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
                if (i > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
                if (i > width && squares[i - width].classList.contains("bomb")) total++;
                if (i > width + 1 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;
                if (i < width * width - 2 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
                if (i < width * width - width && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
                if (i < width * width - 2 - width && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
                if (i < width * width - 1 - width && squares[i + width].classList.contains("bomb")) total++;
                squares[i].setAttribute("data", total);
            }
        }
    }
    createBoard();

    function click(square) {

        if (isGameOver || square.classList.contains("checked") || square.classList.contains("flag")) return;
        if (square.classList.contains("bomb")) {
            result.innerHTML = "YOU LOSE!";
            result.style.display = "block";
            gameOver()
        } else {
            let total = square.getAttribute("data");
            square.classList.add("checked");
            if (total !== "0") {
                if (total === "1") square.classList.add("one");
                if (total === "2") square.classList.add("two");
                if (total === "3") square.classList.add("three");
                if (total === "4") square.classList.add("four");
                if (total === "5") square.classList.add("five");
                if (total === "6") square.classList.add("six");
                if (total === "7") square.classList.add("seven");
                if (total === "8") square.classList.add("eight");
                square.innerHTML = total;
            }
            checkSquare(square);
        }
    }

    function checkSquare(square) {
        const isLeftEdge = square.id % width === 0;
        const isRightEdge = square.id % width === width - 1;
        if (square.id > 0 && !isLeftEdge) {
            const newId = squares[parseInt(square.id) - 1].id;
            const newSquare = document.getElementById(newId);
            if (newSquare.classList.contains("valid")) click(newSquare);
        }
        if (square.id > width) {
            const newId = squares[parseInt(square.id) - width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare.classList.contains("valid")) click(newSquare);
        }
        if (square.id < width * width - 1 && !isRightEdge) {
            const newId = squares[parseInt(square.id) + 1].id;
            const newSquare = document.getElementById(newId);
            if (newSquare.classList.contains("valid")) click(newSquare);
        }
        if (square.id < width * width - 1 - width) {
            const newId = squares[parseInt(square.id) + width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare.classList.contains("valid")) click(newSquare);
        }

    }

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains("checked")) {
            if (!square.classList.contains("flag") && parseInt(flagsLeft.innerHTML) > 0) {
                square.classList.add("flag");
                square.innerHTML = "🚩";
                flagsLeft.innerHTML--;
                checkForWin();
            } else if (square.classList.contains("flag")) {
                square.classList.remove("flag");
                square.innerHTML = "";
                flagsLeft.innerHTML++;
            }
        }
    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
                matches++;
            }
            if (matches === bombAmount) {
                result.innerHTML = "YOU WIN!";
                result.style.display = "block";
                gameOver()
            }
        }
    }

    function gameOver() {
        isGameOver = true;
        squares.forEach(square => {
            if (square.classList.contains("bomb")) {
                square.innerHTML = "💣";
            }
        });
    }
});

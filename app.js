document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  let width = 10;
  let bombsAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  // create Board
  function createBoard() {
    flagsLeft.innerHTML = bombsAmount;
    // get shuffled game array with random bombs;
    const bombsArray = Array(bombsAmount).fill("bomb");
    const emptyArray = Array(width * width - bombsAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      squares.push(square);

      // normal click
      square.addEventListener("click", function (e) {
        click(square);
      });

      //control and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };

      grid.appendChild(square);
    }

    for (let i = 0; i < squares.length; i++) {
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      let total = 0;
      if (squares[i].classList.contains("valid")) {
        //left box has a bomb
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        //top right has a bomb
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        //top has a bomb
        if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
        //top left
        if (
          i > 10 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        //right
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
          total++;
        //bottom left
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        //bottom right
        if (
          i < 89 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        //bottom
        if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
        squares[i].setAttribute("data", total);
      }
    }
  }

  createBoard();

  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;

    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      const total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  //check the neighbouring squares once the square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 99 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //add flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombsAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        flagsLeft.innerHTML = bombsAmount - flags;
        checkForwin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = bombsAmount - flags;
      }
    }
  }

  //game over
  function gameOver(square) {
    isGameOver = true;
    //show all the bomb locations
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }

  // game won function
  function checkForwin() {
    let matches = 0;

    squares.forEach((square) => {
      if (
        square.classList.contains("flag") &&
        square.classList.contains("bomb")
      ) {
        matches++;
      }
    });

    if (matches === bombsAmount) {
      console.log("YOU WON");
      isGameOver = true;
    }
  }
});

// Factory Function
const Gameboard = (()=>{
    //set switch for current player
    let currentPlayer;
    let player1;
    let player2
    
    //initialize game
    const startGame = (e) => {
        e.preventDefault()
        player1 = Player(setPlayerName("player1"), "xMarker", "playerOne")
        player2 = Player(setPlayerName("player2"), "oMarker", "playerTwo")
        // hide form, generate grid and display scoreboard
        const form = document.querySelector("form")
        form.classList.add("hidden")
        generateGrid()
        setScoreboard()
        currentPlayer = player1
        form.reset()
    }
    //get input data and set players name if none given set as playerx
    const setPlayerName = (player) => {
        const playerInput = document.querySelector(`#${player}`)
        const name = playerInput.value == "" ? `${player}` : playerInput.value;
        return name
    }

    // player constructor
    const Player = (name, marker, playerPosition) => {
        let moveCoords = []
        let gamesWon = 0
        // add to games won for a player
        wonGame = () => { gamesWon++ }
        // get won games info
        checkGamesWon = () => { return gamesWon }
        // reset moves list
        resetMoves = () => { moveCoords = [] }
        // add move to move list
        addMove = (move) => { moveCoords.push(move) }
        // check for win condition
        checkWin = () => {
            const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
            let alreadyWon = true
            winConditions.forEach(line => {
                let counter = 0
                line.forEach(position => {
                    moveCoords.includes(position) ? counter++ : "";
                    //catch to prevent making two line count as two wins
                    if (counter == 3 && alreadyWon == true) {
                        displayWinner()
                        alreadyWon = "yes"
                    }
                })
            })
            // check for tie and reset game
            if (moveCoords.length == 5 && alreadyWon) {
                generateGrid()
                player1.resetMoves()
                player2.resetMoves()
            }
    
        }
        
        return { name, marker, playerPosition, wonGame, addMove, resetMoves, checkGamesWon, checkWin}
    }

    //create tic tac toe gameboard 
    const generateGrid = () => {
        const gameboard = document.querySelector(".gameboard")
        gameboard.innerHTML = ""
        for (i = 0; i < 9; i++) {
            gameboard.innerHTML += `
                <div class="square" data-index="${i}"></div>
            `
        }
        listenForClicks();
    }

    // listen for clicks on each square 
    const listenForClicks = () => {
        const squares = document.querySelectorAll(".square")
        squares.forEach((square) => {
            square.addEventListener("click", () => makeMove(square))
        })
    }

    //set scoreboard 
    const setScoreboard = () => {
        const scoreboard = document.querySelector(".scoreboard")
        updateScoreboard(player1)
        updateScoreboard(player2)
        scoreboard.classList.remove("hidden")
    }
    // update Scoreboard
    const updateScoreboard = (player) => {
        console.log(player)
        const playerScore = document.querySelector(`.${player.playerPosition}Score`)
        playerScore.firstElementChild.innerText = `${player.name}`
        playerScore.lastElementChild.innerText = `${player.checkGamesWon()}`
    }

    // handle players move
    const makeMove = (square) => {
        // check if square is already taken
        if (square.classList.contains("xMarker")
            || square.classList.contains("oMarker")) {
            return
        }
        // place marker on square
        else { square.classList.add(currentPlayer.marker) }
        // update players move list, check for win and switch turns
        currentPlayer.addMove(parseInt(square.dataset.index))
        currentPlayer.checkWin()
        currentPlayer = currentPlayer == player1 ? player2 : player1;
    }

    // Display winner information
    const displayWinner = () => {
        const banner = document.querySelector(".winnerBanner")
        banner.firstChild.textContent = `Congratulations ${currentPlayer.name} you won!!!`
        banner.classList.add("displayBanner")
        // set all squares to winners marker
        const squares = document.querySelectorAll(".square")
        squares.forEach((square) => {
            square.classList = `square ${currentPlayer.marker}`
        })
        // add game win to totals
        currentPlayer.wonGame()
        updateScoreboard(currentPlayer)
    }

    // reset board and players moves' lists
    const playAgain = () => {
        const banner = document.querySelector(".winnerBanner")
        banner.classList.remove("displayBanner")
        generateGrid()
        player1.resetMoves()
        player2.resetMoves()
    }

    // listen for play and play again
    const playButton = document.querySelector("#play")
    const playAgainButton = document.querySelector("#playAgain")
    playButton.addEventListener("click", startGame)
    playAgainButton.addEventListener("click", playAgain)
})()
// Create Player Variables
let player1 = "player1";
let player2 = "player2";
// Player switch for whose turn
let currentPlayer;

const gameboard = document.querySelector(".gameboard")
const playButton = document.querySelector("#play")
const playComputerButton = document.querySelector("#playComputer")
const playAgain = document.querySelector("#playAgain")
const form = document.querySelector("form")

// Factory Function
function createPlayer(name, marker, playerPosition){
    // init player variables when created
    let gamesWon = 0
    let moveCoords=[]
    const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    // add to games won for a player
    wonGame=()=>{ gamesWon++ }
    // get won games info
    checkGamesWon=()=>{ return gamesWon }
    // reset moves list
    resetMoves=()=>{ moveCoords=[] }
    // add move to move list
    addMove=(move)=>{ moveCoords.push(move) }
    // check for win condition
    checkWin=()=>{
        let alreadyWon=true
        winConditions.forEach(line=>{
            let counter=0
            line.forEach(position=>{
                moveCoords.includes(position) ? counter ++ : "";
                if (counter == 3 && alreadyWon == false) {
                    ticTacToe.displayWinner()
                    alreadyWon="yes"
                }
            })
        })
        // check for tie and reset game
        if (moveCoords.length == 5 && alreadyWon){
            ticTacToe.generateGrid()
            player1.resetMoves()
            player2.resetMoves()
        }

    }
    // return functions list
    return {name, marker, playerPosition, wonGame, checkGamesWon, addMove, checkWin, resetMoves}
}
// Game Module
const ticTacToe = (() => {
    // display winner banner
    const displayWinner=()=>{
        const banner = document.querySelector(".winnerBanner")
        banner.firstChild.textContent = `Congratulations ${currentPlayer.name} you won!!!`
        banner.classList.add("displayBanner")
        // set all squares to winners marker
        const squares = document.querySelectorAll(".square")
        squares.forEach((square)=>{
            square.classList=`square ${currentPlayer.marker}`
        })
        // add game win to totals
        currentPlayer.wonGame()
        updateScoreboard(currentPlayer)
    }
    
    // listen for clicks on each square 
    const listenForClicks = () =>{
        const squares = document.querySelectorAll(".square")
        squares.forEach((square) => {
            square.addEventListener("click", ()=>makeMove(square))
        })
    }

    //create tic tac toe gameboard 
    const generateGrid = () => {
        gameboard.innerHTML = ""
        for (i = 0; i < 9; i++) {
            gameboard.innerHTML += `
                <div class="square" data-index="${i}"></div>
            `
        }
        listenForClicks();
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
    
    // set names and create players
    const setPlayerName=(player)=>{
        const playerInput = document.querySelector(`#${player}`)
        const name = playerInput.value == "" ? `${player}` : playerInput.value;
        
        if (playerInput.name == "player1") {
            player1 = createPlayer(name, "xMarker", "playerOne")
        }
        else { player2 = createPlayer(name, "oMarker", "playerTwo") }
    }
    
    // initialize game
    const startGame=(e)=>{
        e.preventDefault()
        setPlayerName(player1)
        setPlayerName(player2)
        form.classList.add("hidden")
        ticTacToe.generateGrid()
        setScoreboard()
        currentPlayer=player1
        form.reset()
    }
    // reset board and players moves' lists
    const playAgain=()=>{
        const banner = document.querySelector(".winnerBanner")
        banner.classList.remove("displayBanner")
        ticTacToe.generateGrid()
        player1.resetMoves()
        player2.resetMoves()
    }
    // update Scoreboard
    const updateScoreboard=(player)=>{
        const playerScore = document.querySelector(`.${player.playerPosition}Score`)
        playerScore.firstElementChild.innerText = `${player.name}`
        playerScore.lastElementChild.innerText = `${player.checkGamesWon()}`
        console.log(playerScore)
    }

    //set scoreboard 
    const setScoreboard = () =>{
        const scoreboard=document.querySelector(".scoreboard")
        updateScoreboard(player1)
        updateScoreboard(player2)
        scoreboard.classList.remove("hidden")
    }
    return {
        displayWinner, generateGrid, listenForClicks, makeMove, setPlayerName, startGame, playAgain

     };
})();

// listen for play and play again
playAgain.addEventListener("click", ticTacToe.playAgain)
playButton.addEventListener("click", ticTacToe.startGame)

// on start display scoreboard
// on win update scoreboard
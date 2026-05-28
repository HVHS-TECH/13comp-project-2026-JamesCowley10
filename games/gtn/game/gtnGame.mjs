/**************************************************************/
// gtnGame.mjs
// Main script for gtnGame.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gtnGame.mjs',
    'color: blue; background-color: white;');

const leaveGameButtonWaiting = document.getElementById('leaveGameButtonWaiting');
const leaveGameButtonGame = document.getElementById('leaveGameButtonGame');
const player1ProfileImgWaiting = document.getElementById('player1ProfileImgWaiting');
const player2ProfileImgWaiting = document.getElementById('player2ProfileImgWaiting');
const player1ProfileImgGame = document.getElementById('player1ProfileImgGame');
const player2ProfileImgGame = document.getElementById('player2ProfileImgGame');
const player1Name = document.getElementById('player1Name');
const player1NameGame = document.getElementById('player1NameGame');
const player2Name = document.getElementById('player2Name');
const player2NameGame = document.getElementById('player2NameGame');
const player1Status = document.getElementById('player1Status');
const player2Status = document.getElementById('player2Status');
const gtnLobbyURL = new URL('../lobby/gtnLobby.html', import.meta.url).href;
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
const waitingDiv = document.getElementById('waitingDiv');
const gameDiv = document.getElementById('gameDiv');
const mainTitleGame = document.getElementById('mainTitleGame');
const guessDiv = document.getElementById('guessDiv');
const guessNumber = document.getElementById('guessNumber');
const lowerGuessButton = document.getElementById('lowerGuessButton');
const higherGuessButton = document.getElementById('higherGuessButton');
const guessButton = document.getElementById('guessButton');
let playerNumber = sessionStorage.getItem("playerNumber");
let gameNumber = sessionStorage.getItem("gameNumber");
let gameData = {};
let players = {};
let gameStarted = false;
let otherPlayerLeft = false;

// Function to update a button's text, background colour, and disable it
function updateButton(button, text, backgroundColor) {
    button.disabled = true;
    button.innerText = text;
    button.style.backgroundColor = backgroundColor;
}

// Function to set player profile info on load
function setPlayerInfo() {
    if (playerNumber == 1) {
        player1ProfileImgWaiting.src = userDetails.photoURL;
        player1Name.innerText = userDetails.username;
    }
    else if (playerNumber == 2) {
        player2ProfileImgWaiting.src = userDetails.photoURL;
        player2Name.innerText = userDetails.username;
    }
}

// Function when player leaves game to show remaining player that other player has left game
function playerLeaves() {
    if (otherPlayerLeft) {
        return;
    }
    otherPlayerLeft = true;
    sessionStorage.removeItem("playerNumber");
    sessionStorage.removeItem("gameNumber");
    if (playerNumber == 1) {
        mainTitleGame.innerText = player2Name.innerText + " has left the game!";
    } else if (playerNumber == 2) {
        mainTitleGame.innerText = player1Name.innerText + " has left the game!";
    }
    player1Status.innerText = "";
    player2Status.innerText = "";
    guessButton.hidden = true;
    lowerGuessButton.hidden = true;
    higherGuessButton.hidden = true;
    guessNumber.hidden = true;
    gameNumber = null;
    playerNumber = null;
}

// Function to set up game html and start game when there are 2 players in game
async function startGame() {
    console.log("Game starting...");
    console.log("Player number: " + playerNumber);
    gameStarted = true;
    waitingDiv.hidden = true;
    gameDiv.hidden = false;

    await fb_get('liveGames/game' + gameNumber + '/game/').then((snapshot) => {
        gameData = snapshot;
    }).catch((error) => {
        console.error(error);
    });

    if (playerNumber == 1) {
        mainTitleGame.innerText = "Guess a number 1-100!";
        player1NameGame.innerText = userDetails.username;
        player1ProfileImgGame.src = userDetails.photoURL;
        player2ProfileImgGame.src = player2ProfileImgWaiting.src;
        player2NameGame.innerText = player2Name.innerText;
    } else if (playerNumber == 2) {
        mainTitleGame.innerText = player1Name.innerHTML + " is guessing...";
        player2NameGame.innerText = userDetails.username;
        player2ProfileImgGame.src = userDetails.photoURL;
        player1ProfileImgGame.src = player1ProfileImgWaiting.src;
        player1NameGame.innerText = player1Name.innerText;
        guessButton.hidden = true;
        lowerGuessButton.hidden = true;
        higherGuessButton.hidden = true;
        guessNumber.hidden = true;
    }
}

// Function to check if player's guess is the same as random number
async function checkGuess() {
    const playerGuess = guessNumber.innerHTML;
    if (playerNumber == 1) {
        console.log("Player 1 guessed: " + playerGuess);
        await fb_set('liveGames/game' + gameNumber + '/game/player1Guess', playerGuess);
    } else if (playerNumber == 2) {
        console.log("Player 2 guessed: " + playerGuess);
        await fb_set('liveGames/game' + gameNumber + '/game/player2Guess', playerGuess);
    }

    if (playerGuess == gameData.randomNumber) {
        console.log("Correct guess!");
        if (playerNumber == 1) {
            await fb_set('liveGames/game' + gameNumber + '/game/winner', "player1");
        } else if (playerNumber == 2) {
            await fb_set('liveGames/game' + gameNumber + '/game/winner', "player2");
        }
    } else {
        console.log("Wrong guess!");
        if (playerGuess < gameData.randomNumber) {
            console.log("Guess is too low!");
        } else if (playerGuess > gameData.randomNumber) {
            console.log("Guess is too high!");
        }
        setGuessingPlayer();
    }
}

// Function to change which player is guessing and update html 
function setGuessingPlayer() {
    console.log("Changing guessing player...");
    if (playerNumber == 1) {
        fb_set('liveGames/game' + gameNumber + '/game/playerTurn', 2);
    } else if (playerNumber == 2) {
        fb_set('liveGames/game' + gameNumber + '/game/playerTurn', 1);
    }
}

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set, fb_get, userDetails, fb_onValueChange, fb_onDisconnect }
    from '../../../main/index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_set = fb_set;
window.fb_get = fb_get;
window.fb_onValueChange = fb_onValueChange;
window.fb_onDisconnect = fb_onDisconnect;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

// If player disconnects from page, delete game from database and set html for other player to show other players has left
fb_onDisconnect('liveGames/game' + gameNumber, () => {
    console.log("Player disconnected, removing game from database...");
    playerLeaves();
});

/**************************************************************/
// gtnGame.html main code
/**************************************************************/

// Sets userDetails as items from sessionStorage
userDetails.uid = sessionStorage.getItem("uid");
userDetails.email = sessionStorage.getItem("email");
userDetails.photoURL = sessionStorage.getItem("photoURL");
userDetails.displayName = sessionStorage.getItem("displayName");
userDetails.username = sessionStorage.getItem("username");
userDetails.address = sessionStorage.getItem("address");
userDetails.age = sessionStorage.getItem("age");
userDetails.phoneNumber = sessionStorage.getItem("phoneNumber");
console.table(userDetails);

// Event listener for on click of leaveGameButton returns player to gtnLobby.html
leaveGameButtonWaiting.onclick = function () {
    // Removes player from the players section in database
    if (playerNumber == 1) {
        // Delete whole game from database
        fb_set('liveGames/game' + gameNumber, null);
    } else {
        // Delete player 2 from database
        fb_set('liveGames/game' + gameNumber + '/players/player' + playerNumber, null);
    }

    sessionStorage.removeItem("playerNumber");
    sessionStorage.removeItem("gameNumber");

    window.location.href = gtnLobbyURL;
    updateButton(leaveGameButtonWaiting, "Leaving game...", buttonSelectBackgroundColor);
}

// Event listener for on click of leaveGameButtonGame returns player to gtnLobby.html
leaveGameButtonGame.onclick = function () {
    // Delete whole game from database
    fb_set('liveGames/game' + gameNumber, null);

    sessionStorage.removeItem("playerNumber");
    sessionStorage.removeItem("gameNumber");

    window.location.href = gtnLobbyURL;
    updateButton(leaveGameButtonGame, "Leaving game...", buttonSelectBackgroundColor);
}

// Onload calls setPlayerInfo function to set player profile info
setPlayerInfo();

// On value change of players in game, if there are enough players start game, else fire playerLeaves function
fb_onValueChange('liveGames/game' + gameNumber + '/players/', (snapshot) => {
    players = snapshot.val();
    if (players == null || players.player1 == null || players.player2 == null) {
        if (gameStarted) {
            playerLeaves();
        }
        return;
    }

    if (!gameStarted) {
        if (playerNumber == 1) {
            // Set player 1 profile info to userDetails
            player1ProfileImgWaiting.src = userDetails.photoURL;
            player1Name.innerText = userDetails.username;
            // Set player 2 profile info to player2Info from database
            player2ProfileImgWaiting.src = players.player2.player2photoURL;
            player2Name.innerText = players.player2.player2username;
        } else if (playerNumber == 2) {
            // Set player 2 profile info to userDetails
            player2ProfileImgWaiting.src = userDetails.photoURL;
            player2Name.innerText = userDetails.username;
            // Set player 1 profile info to player1Info from database
            player1ProfileImgWaiting.src = players.player1.player1photoURL;
            player1Name.innerText = players.player1.player1username;
        }
        setPlayerInfo();
        // Call startGame function
        startGame();
    }
});

// On value change of game data, update html to show who is guessing
fb_onValueChange('liveGames/game' + gameNumber + '/game/', (snapshot) => {
    gameData = snapshot.val();
    if (gameData == null) {
        return;
    }
    if (gameData.playerTurn == 1) {
        if (Number(gameData.player2Guess) < gameData.randomNumber) {
            mainTitleGame.innerText = "Wrong! " + gameData.player2Guess + " is too low!";
        } else if (Number(gameData.player2Guess) > gameData.randomNumber) {
            mainTitleGame.innerText = "Wrong! " + gameData.player2Guess + " is too high!";
        }
        if (playerNumber == 1) {
            guessButton.hidden = false;
            lowerGuessButton.hidden = false;
            higherGuessButton.hidden = false;
            guessNumber.hidden = false;
            player1Status.innerText = "Guessing...";
            player2Status.innerText = "Waiting...";
        } else if (playerNumber == 2) {
            guessButton.hidden = true;
            lowerGuessButton.hidden = true;
            higherGuessButton.hidden = true;
            guessNumber.hidden = true;
            player2Status.innerText = "Waiting...";
            player1Status.innerText = "Guessing...";
        }
    } else if (gameData.playerTurn == 2) {
        if (Number(gameData.player1Guess) < gameData.randomNumber) {
            mainTitleGame.innerText = "Wrong! " + gameData.player1Guess + " is too low!";
        } else if (Number(gameData.player1Guess) > gameData.randomNumber) {
            mainTitleGame.innerText = "Wrong! " + gameData.player1Guess + " is too high!";
        }
        if (playerNumber == 1) {
            guessButton.hidden = true;
            lowerGuessButton.hidden = true;
            higherGuessButton.hidden = true;
            guessNumber.hidden = true;
            player1Status.innerText = "Waiting...";
            player2Status.innerText = "Guessing...";
        } else if (playerNumber == 2) {
            guessButton.hidden = false;
            lowerGuessButton.hidden = false;
            higherGuessButton.hidden = false;
            guessNumber.hidden = false;
            player2Status.innerText = "Guessing...";
            player1Status.innerText = "Waiting...";
        }
    }
});

// Event listener for on click of guessButton, calls checkGuess function
guessButton.onclick = function () {
    // Call checkGuess function
    checkGuess();
}

// Event listener for on click of lowerGuessButton
lowerGuessButton.onclick = function () {
    if (Number(guessNumber.innerHTML) > 1) {
        guessNumber.innerHTML = Number(guessNumber.innerHTML) - 1;
    }
}

// Event listener for on click of higherGuessButton
higherGuessButton.onclick = function () {
    if (Number(guessNumber.innerHTML) < 100) {
        guessNumber.innerHTML = Number(guessNumber.innerHTML) + 1;
    }
}

// Calls endGame when there is a winner in database and updates html to show winner
fb_onValueChange('liveGames/game' + gameNumber + '/game/winner', (snapshot) => {
    const winner = snapshot.val();
    if (winner == null) {
        return;
    }
    // Add 1 win to winning player's wins in database, userScores.gtn.uid.wins
    if (winner == "player1") {
        fb_get('userScores/gtn/' + players.player1.player1uid + '/wins').then((snapshot) => {
            const wins = snapshot
            if (wins != null) {
                fb_set('userScores/gtn/' + players.player1.player1uid + '/wins', wins + 1);
                fb_set('userScores/gtn/' + players.player1.player1uid + '/name', players.player1.player1username);
            } else {
                fb_set('userScores/gtn/' + players.player1.player1uid + '/wins', 1);
                fb_set('userScores/gtn/' + players.player1.player1uid + '/name', players.player1.player1username);
            }
            fb_set('liveGames/game' + gameNumber, null);
            mainTitleGame.innerText = player1Name.innerHTML + " wins!";
            guessButton.hidden = true;
            lowerGuessButton.hidden = true;
            higherGuessButton.hidden = true;
            guessNumber.hidden = true;
            player1Status.innerText = "Winner!";
            player2Status.innerText = "Loser!";
        });
    } else if (winner == "player2") {
        fb_get('userScores/gtn/' + players.player2.player2uid + '/wins').then((snapshot) => {
            const wins = snapshot
            if (wins != null) {
                fb_set('userScores/gtn/' + players.player2.player2uid + '/wins', wins + 1);
                fb_set('userScores/gtn/' + players.player2.player2uid + '/name', players.player2.player2username);
            } else {
                fb_set('userScores/gtn/' + players.player2.player2uid + '/wins', 1);
                fb_set('userScores/gtn/' + players.player2.player2uid + '/name', players.player2.player2username);
            }
            fb_set('liveGames/game' + gameNumber, null);
            mainTitleGame.innerText = player2Name.innerHTML + " wins!";
            guessButton.hidden = true;
            lowerGuessButton.hidden = true;
            higherGuessButton.hidden = true;
            guessNumber.hidden = true;
            player1Status.innerText = "Loser!";
            player2Status.innerText = "Winner!";
        });
    }
});

// Onload if sessionStorage.loggedIn is not y, then send user to last page
window.onload = function () {
    if (sessionStorage.getItem("loggedIn") != "y") {
        const lastUrl = new URL('../index.html', import.meta.url).href;
        location.href = lastUrl;
    }
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
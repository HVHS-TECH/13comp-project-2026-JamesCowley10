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
const gtnLobbyURL = new URL('../lobby/gtnLobby.html', import.meta.url).href;
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
const waitingDiv = document.getElementById('waitingDiv');
const gameDiv = document.getElementById('gameDiv');
const mainTitleGame = document.getElementById('mainTitleGame');
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
let playerNumber = sessionStorage.getItem("playerNumber");
let gameNumber = sessionStorage.getItem("gameNumber");
let gameData = {};

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

// Function to set up game html and start game when there are 2 players in game
async function startGame() {
    console.log("Game starting...");
    console.log("Player number: " + playerNumber);
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
        guessInput.hidden = true;
        guessButton.hidden = true;
    }
}

// Function to check if player's guess is the same as random number
function checkGuess() {
    if (guessInput.value == gameData.randomNumber) {
        console.log("Correct guess!");
    } else {
        console.log("Wrong guess!");
    }
}

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set, fb_get, userDetails, fb_onValueChange }
    from '../../../main/index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_set = fb_set;
window.fb_get = fb_get;
window.fb_onValueChange = fb_onValueChange;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

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

    window.location.href = gtnLobbyURL;
    updateButton(leaveGameButtonWaiting, "Leaving game...", buttonSelectBackgroundColor);
}

// Event listener for on click of leaveGameButtonGame returns player to gtnLobby.html
leaveGameButtonGame.onclick = function () {
    // Delete whole game from database
    fb_set('liveGames/game' + gameNumber, null);

    window.location.href = gtnLobbyURL;
    updateButton(leaveGameButtonGame, "Leaving game...", buttonSelectBackgroundColor);
}

// Onload calls setPlayerInfo function to set player profile info
setPlayerInfo();

fb_onValueChange('liveGames/game' + gameNumber + '/players/', (snapshot) => {
    const players = snapshot.val();
    if (players.player1 != null && players.player2 != null) {
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

// Event listener for on click of guessButton, calls checkGuess function
guessButton.onclick = function () {
    // Call checkGuess function
    checkGuess();
    guessInput.value = "";
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
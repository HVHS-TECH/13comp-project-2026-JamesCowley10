/**************************************************************/
// gtnLobby.mjs
// Main script for gtnLobby.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gtnLobby.mjs',
    'color: blue; background-color: white;');

const gameSearchButton = document.getElementById('gameSearchButton');
const leaderboardButton = document.getElementById('leaderboardButton');
const returnButton = document.getElementById('returnButton');
const profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");
const gtnGameURL = new URL('../game/gtnGame.html', import.meta.url).href;
const gamePageURL = new URL('../../../main/gamePage/gamePage.html', import.meta.url).href;
const leaderboardPageURL = new URL('../leaderboard/gtnLeaderboard.html', import.meta.url).href;
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
const mainTitle = document.getElementById('mainTitle');
let gameId = null;

/**************************************************************/
// updateButton(button, text, backgroundColor)
// Called to update style and state of a button
// Disables button, updates button text and background colour to inputted values
// Input: button (string), text (string), backgroundColor (string)
// Return: N/A
/**************************************************************/
function updateButton(button, text, backgroundColor) {
    button.disabled = true;
    button.innerText = text;
    button.style.backgroundColor = backgroundColor;
}

/**************************************************************/
// createGameId()
// Called to generate unique game ID
// Returns a string with the unique game ID that is generated
// Input: N/A
// Return: string
/**************************************************************/
function createGameId() {
    // Use current date and random number to generate unique game id for realtime database
    return "game-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

/**************************************************************/
// createGame(selectedGameId)
// Called to create a new game
// Create new game in realtime database with selectedGameId, set user as player 1, send to gtnGame.html
// Input: selectedGameId (string)
// Return: N/A
/**************************************************************/
function createGame(selectedGameId) {
    console.log("No games found");
    gameId = selectedGameId;
    console.log("Game id: " + gameId);
    sessionStorage.setItem("playerNumber", 1);
    sessionStorage.setItem("gameId", gameId);

    fb_set('liveGames/' + gameId, {
        players: {
            player1: {
                player1uid: userDetails.uid,
                player1username: userDetails.username,
                player1photoURL: userDetails.photoURL
            }
        },
        game: {
            player1Guess: "",
            player2Guess: "",
            playerTurn: 1,
            winner: "",
            randomNumber: Math.floor(Math.random() * 100) + 1,
        }
    });
    // Send user to gtnGame.html
    window.location.href = gtnGameURL;
    sessionStorage.setItem("isInGame", "true");
}

/**************************************************************/
// joinGame(selectedGameId)
// Called to join an existing game
// Joins the user as player 2 in specific game
// Input: selectedGameId (string)
// Return: N/A
/**************************************************************/
function joinGame(selectedGameId) {
    console.log("Joining game " + selectedGameId + " as player 2");
    gameId = selectedGameId;
    sessionStorage.setItem("playerNumber", 2);
    sessionStorage.setItem("gameId", gameId);
    fb_set('liveGames/' + gameId + "/players/" + "player2", {
        player2uid: userDetails.uid,
        player2username: userDetails.username,
        player2photoURL: userDetails.photoURL,
    });
    // Send user to gtnGame.html
    window.location.href = gtnGameURL;
    sessionStorage.setItem("isInGame", "true");
}

/**************************************************************/
// searchingForGame(text)
// Called to search for an available game
// If available game is found, join as player 2, else creates new game, joins as player 1
// Input: text (string)
// Return: N/A
/**************************************************************/
function searchingForGame(text) {
    updateButton(gameSearchButton, text, buttonSelectBackgroundColor);

    // Read the live games to determine whether an open lobby already exists
    fb_get('liveGames/').then((snapshot) => {
        const liveGames = snapshot;
        // If liveGames has nothing in it, create a game and join as player 1
        if (liveGames != null) {
            let availableGameId = null;
            const liveGameKeys = Object.keys(liveGames);

            // Go through the live games and choose the first one with less than 2 players
            for (let i = 0; i < liveGameKeys.length; i++) {
                const currentGameId = liveGameKeys[i];
                const players = liveGames[currentGameId].players;

                if (players != null && Object.keys(players).length < 2) {
                    availableGameId = currentGameId;
                    break;
                }
            }

            if (availableGameId != null) {
                console.log("Joining game: " + availableGameId);
                joinGame(availableGameId);
                return;
            }

            const nextGameId = createGameId();
            console.log("No available games. Creating game: " + nextGameId);
            createGame(nextGameId);

        } else {
            // If no games are found, create a new game and join as player 1
            createGame(createGameId());
        }
    }).catch((error) => {
        console.error(error);
    }
    );
}


/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set, fb_get, userDetails }
    from '../../../main/index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_set = fb_set;
window.fb_get = fb_get;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

/**************************************************************/
// gtnLobby.html main code
/**************************************************************/

// Checks if profileImgURL exists in sessionStorage, if so sets it as src for profileImg
if (profileImgURL != null) {
    profileImg.src = profileImgURL;
    console.log("Profile image loaded");
}

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

// Event listener for the play button
gameSearchButton.onclick = function () {
    searchingForGame("Searching for game...");
}

//  Event listener for on click of leaderboardButton sends user to leaderboardPage.html
leaderboardButton.onclick = function () {
    location.href = leaderboardPageURL;
    updateButton(leaderboardButton, "Opening...", buttonSelectBackgroundColor);
}

//  Event listener for on click of returnButton returns user to gamePage.html
returnButton.onclick = function () {
    location.href = gamePageURL;
    updateButton(returnButton, "Returning...", buttonSelectBackgroundColor);
}

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
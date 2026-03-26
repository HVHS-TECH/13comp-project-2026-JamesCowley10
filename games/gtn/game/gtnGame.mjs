/**************************************************************/
// gtnGame.mjs
// Main script for gtnGame.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gtnGame.mjs',
    'color: blue; background-color: white;');

const leaveGameButton = document.getElementById('leaveGameButton');
const player1ProfileImg = document.getElementById('player1ProfileImg');
const player2ProfileImg = document.getElementById('player2ProfileImg');
const player1Name = document.getElementById('player1Name');
const player2Name = document.getElementById('player2Name');
const gtnLobbyURL = new URL('../lobby/gtnLobby.html', import.meta.url).href;
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
let playerNumber = sessionStorage.getItem("playerNumber");
let gameNumber = sessionStorage.getItem("gameNumber");

// Function to update a button's text, background colour, and disable it
function updateButton(button, text, backgroundColor) {
    button.disabled = true;
    button.innerText = text;
    button.style.backgroundColor = backgroundColor;
}

// Function to set player profile info on load
function setPlayerInfo() {
    if (playerNumber == 1) {
        player1ProfileImg.src = userDetails.photoURL;
        player1Name.innerText = userDetails.username;
    }
    else if (playerNumber == 2) {
        player2ProfileImg.src = userDetails.photoURL;
        player2Name.innerText = userDetails.username;
        fb_get('liveGames/game' + gameNumber + '/players/player1/').then((snapshot) => {
            const player1Info = snapshot
            if (player1Info != null) {
                player1ProfileImg.src = player1Info.player1photoURL;
                player1Name.innerText = player1Info.player1username;
            }
        });
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
leaveGameButton.onclick = function () {
    window.location.href = gtnLobbyURL;
    updateButton(leaveGameButton, "Leaving game...", buttonSelectBackgroundColor);
}

// Onload calls setPlayerInfo() to set player profile info
setPlayerInfo();

fb_onValueChange('liveGames/game' + gameNumber + '/players/', (snapshot) => {
    const players = snapshot.val();
    if (players.player1 != null && players.player2 != null) {
        player1ProfileImg.src = players.player1.player1photoURL;
        player1Name.innerText = players.player1.player1username;
        player2ProfileImg.src = players.player2.player2photoURL;
        player2Name.innerText = players.player2.player2username;
    }
});

/**************************************************************/
//   END OF CODE
/**************************************************************/
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
const gtnLobbyURL = new URL('../lobby/gtnLobby.html', import.meta.url).href;
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';

// Function to update a button's text, background colour, and disable it
function updateButton(button, text, backgroundColor) {
    button.disabled = true;
    button.innerText = text;
    button.style.backgroundColor = backgroundColor;
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



/**************************************************************/
//   END OF CODE
/**************************************************************/
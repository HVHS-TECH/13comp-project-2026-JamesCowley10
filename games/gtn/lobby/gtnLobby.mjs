/**************************************************************/
// gtnLobby.mjs
// Main script for gtnLobby.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gtnLobby.mjs',
    'color: blue; background-color: white;');

let gameSearchButton = document.getElementById('gameSearchButton');
let returnButton = document.getElementById('returnButton');

function searchingForGame(text) {
    gameSearchButton.disabled = true;
    gameSearchButton.innerText = text;
    gameSearchButton.style.backgroundColor = 'rgb(226, 226, 226)';
    console.log("Searching for game...");
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

// Event listener for the play button
gameSearchButton.onclick = function () {
    searchingForGame("Searching for game...");
}

// On click of returnButton returns player to game page
returnButton.onclick = function () {
    const gamePageURL = new URL('../../../main/gamePage/gamePage.html', import.meta.url).href;
    location.href = gamePageURL;
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
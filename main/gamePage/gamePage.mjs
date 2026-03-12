/**************************************************************/
// gamePage.mjs
// Main script for gamePage.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gamePage.mjs',
    'color: blue; background-color: white;');

let gtnButton = document.getElementById('gtnButton');
let zombzButton = document.getElementById('zombzButton');
const gtnPageURL = new URL('../../games/gtn/gtnLobby.html', import.meta.url).href;
const zombzPageURL = new URL('../../games/zombz/zombzLobby.html', import.meta.url).href;
let profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, userDetails }
    from '../index/fb_io.mjs';
window.fb_initialise = fb_initialise;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

/**************************************************************/
// gamePage.html main code
/**************************************************************/

// Checks if profileImgURL exists in sessionStorage, if so sets it as src for profileImg
if (profileImgURL != null) {
    profileImg.src = profileImgURL;
    console.log("Profile image loaded");
} else { // If profileImg is null, loads placeholder image
    console.log("No profile image found, using placeholder");
}

console.table(userDetails);

// Event listener for the GTN button
gtnButton.onclick = async function () {
    window.location.href = gtnPageURL;
}

// Event listener for the Zombz button
zombzButton.onclick = async function () {
    window.location.href = zombzPageURL;
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
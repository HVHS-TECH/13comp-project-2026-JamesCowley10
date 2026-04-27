/**************************************************************/
// gtnLeaderboard.mjs
// Main script for gtnLeaderboard.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gtnLeaderboard.mjs',
    'color: blue; background-color: white;');

const leaderboardButton = document.getElementById('leaderboardButton');
const returnButton = document.getElementById('returnButton');
const profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");
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
// gtnLeaderboard.html main code
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

//  Event listener for on click of returnButton returns user to gamePage.html
returnButton.onclick = function () {
    location.href = gtnLobbyURL;
    updateButton(returnButton, "Returning...", buttonSelectBackgroundColor);
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
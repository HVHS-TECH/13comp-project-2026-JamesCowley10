/**************************************************************/
// gamePage.mjs
// Main script for gamePage.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gamePage.mjs',
    'color: blue; background-color: white;');

const gtnButton = document.getElementById('gtnButton');
const zombzButton = document.getElementById('zombzButton');
const adminButton = document.getElementById('adminButton');
const gtnPageURL = new URL('../../games/gtn/lobby/gtnLobby.html', import.meta.url).href;
const zombzPageURL = new URL('../../games/zombz/zombzMenuScreen.html', import.meta.url).href;
const profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
let isAdmin = sessionStorage.getItem('admin');

function checkAdmin() {
    if (isAdmin == 'y') {
        adminButton.style.hidden = false;
    } else {
        adminButton.style.hidden = true;
    }
}

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
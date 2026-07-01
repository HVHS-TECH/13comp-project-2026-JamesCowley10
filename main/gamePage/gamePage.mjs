/**************************************************************/
// gamePage.mjs
// Main script for gamePage.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';
const COL_B = '#CD7F32';
console.log('%c gamePage.mjs',
    'color: blue; background-color: white;');

const gtnButton = document.getElementById('gtnButton');
const zombzButton = document.getElementById('zombzButton');
const adminButton = document.getElementById('adminButton');
const gtnPageURL = new URL('../../games/gtn/lobby/gtnLobby.html', import.meta.url).href;
const zombzPageURL = new URL('../../games/zombz/zombzMenuScreen.html', import.meta.url).href;
const adminPageURL = new URL('../admin/adminPage.html', import.meta.url).href;
const indexPageURL = new URL('../../index.html', import.meta.url).href;
const accountPageURL = new URL('../accountPage/accountPage.html', import.meta.url).href;
const profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
const logoutButton = document.getElementById('logoutButton');
let isAdmin = sessionStorage.getItem('admin');

/**************************************************************/
// checkAdmin()
// Called by gamePage.html to check if user is admin
// If user is admin, show admin button, else hide it
// Input: N/A
// Return: N/A
/**************************************************************/
function checkAdmin() {
    if (isAdmin == 'y') {
        adminButton.hidden = false;
    } else {
        adminButton.hidden = true;
    }
}

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, userDetails, fb_signOut }
    from '../index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_signOut = fb_signOut;

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

// Event listener for the GTN button
gtnButton.onclick = async function () {
    window.location.href = gtnPageURL;
}

// Event listener for the Zombz button
zombzButton.onclick = async function () {
    window.location.href = zombzPageURL;
}

// Event listener for the Admin button
adminButton.onclick = async function () {
    window.location.href = adminPageURL;
}

// Event listener for the Logout button
logoutButton.onclick = async function () {
    await fb_signOut();
    // Clear sessionStorage after logout
    sessionStorage.clear();
    // Redirect to login page after logout
    window.location.href = indexPageURL;
}

// Event listener for the profileImg button
profileImg.onclick = async function () {
    window.location.href = accountPageURL;
}

// Call checkAdmin function to set admin button as visible or not
checkAdmin();

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
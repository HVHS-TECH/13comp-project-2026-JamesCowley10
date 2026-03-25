/**************************************************************/
// main.mjs
// Main script for index.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c main.mjs',
    'color: blue; background-color: white;');

const loginButton = document.getElementById('loginButton');
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
import { fb_initialise, fb_login, fb_onAuthStateChanged, fb_signOut, fb_set, fb_get }
    from './fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_login = fb_login;
window.fb_onAuthStateChanged = fb_onAuthStateChanged;
window.fb_signOut = fb_signOut;
window.fb_set = fb_set;
window.fb_get = fb_get;

/**************************************************************/
// index.html main code
/**************************************************************/
fb_initialise();

// Event listener for the login button
loginButton.onclick = function () {
    fb_login();
    updateButton(loginButton, "Logging In...", buttonSelectBackgroundColor);
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
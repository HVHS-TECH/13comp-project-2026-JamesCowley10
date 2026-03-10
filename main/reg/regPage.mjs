/**************************************************************/
// regPage.mjs
// Main script for regPage.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c regPage.mjs',
    'color: blue; background-color: white;');

let regWarning = document.getElementById('regWarning');


/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set }
    from '../index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_set = fb_set;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

/**************************************************************/
// regPage.html main code
/**************************************************************/

// Sets userDetails as items from sessionStorage
//userDetails.uid = sessionStorage.getItem("uid");
//userDetails.email = sessionStorage.getItem("email");
//userDetails.photoURL = sessionStorage.getItem("photoURL");
//userDetails.displayName = sessionStorage.getItem("displayName");
//console.table(userDetails);

document.getElementById("regButton").onclick = async function () {
    let username = document.getElementById("regUsername").value;
    let age = document.getElementById("regAge").value;
    let address = document.getElementById("regAddress").value;
    let phoneNumber = document.getElementById("regPhoneNumber").value;
    age = Number(age);
    phoneNumber = Number(phoneNumber);

    console.log(username, age, address, phoneNumber);
    regWarning.hidden = false;
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
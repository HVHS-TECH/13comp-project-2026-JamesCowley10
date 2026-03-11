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
let regButton = document.getElementById('regButton');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set, userDetails }
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
userDetails.uid = sessionStorage.getItem("uid");
userDetails.email = sessionStorage.getItem("email");
userDetails.photoURL = sessionStorage.getItem("photoURL");
userDetails.displayName = sessionStorage.getItem("displayName");
console.table(userDetails);

// Event listener for the register button
document.getElementById("regButton").onclick = async function () {
    let username = document.getElementById("regUsername").value;
    let age = document.getElementById("regAge").value;
    let address = document.getElementById("regAddress").value;
    let phoneNumber = document.getElementById("regPhoneNumber").value;
    age = Number(age);
    phoneNumber = Number(phoneNumber);
    console.table({ username, age, address, phoneNumber });

    // Validate username input is not empty
    if (username.trim() == "") {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Please enter a username!";
        return;
    }

    // Validate username input only contains letters
    if (!/^[A-Za-z]+$/.test(username)) {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Username must only contain letters!";
        return;
    }

    // Validate username input is 15 characters or under
    if (username.length > 15) {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Username must be 15 letters or under!";
        return;
    }

    // Validate age input is not empty
    if (age === null || age === "") {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Please enter an age!";
        return;
    }
    // Validates age input is a number between 1 and 150
    if (isNaN(age) || Number(age) < 1 || Number(age) > 150) {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Age must be a number from 1-150!";
        return;
    }

    // Validate address input is not empty
    if (address.trim() == "") {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Please enter an address!";
        return;
    }

    // Validate phone number input is not empty and is a valid number
    if (phoneNumber === null || phoneNumber === "" || isNaN(phoneNumber) || phoneNumber < 1000000000 || phoneNumber > 9999999999) {
        regWarning.hidden = false;
        regWarning.style.animation = "none";
        regWarning.style.animation = "fadeInOut 5s forwards";
        regWarning.innerText = "Please enter a valid phone number!";
        return;
    }

    // If all validation is passed then set user's details and proceed
    console.log("Valid Inputs");

    userDetails.username = username;
    userDetails.age = age;
    userDetails.address = address;
    userDetails.phoneNumber = phoneNumber;

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("age", age);
    sessionStorage.setItem("address", address);
    sessionStorage.setItem("phoneNumber", phoneNumber);

    // Sets the username and age to the user's userDetails and shows an error if one occurs
    try {
        await fb_set('userDetails/' + userDetails.uid, userDetails);
        console.table(userDetails);
        const gameUrl = new URL('../gamePage/gamePage.html', import.meta.url).href;
        location.href = gameUrl;
    } catch (error) {
        console.error(error);
        regWarning.hidden = false;}
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
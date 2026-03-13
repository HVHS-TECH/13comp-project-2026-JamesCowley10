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
const maxUsernameLength = 15;

// Displays a warning message
function regWarningFade(text) {
    regWarning.hidden = false;
    regWarning.style.animation = "none";
    regWarning.style.animation = "fadeInOut 5s forwards";
    regWarning.innerText = text;
}

// Validates username input, returns true if valid, else displays an error message and returns false
function checkName(username) {
    // Validate username input is not empty
    if (username.trim() == "") {
        regWarningFade("Please enter a username!");
        return false;
    }
    // Validate username input only contains letters
    if (!/^[A-Za-z]+$/.test(username)) {
        regWarningFade("Username must only contain letters!");
        return false;
    }
    // Validate username input is within the allowed length
    if (username.length > maxUsernameLength) {
        regWarningFade("Username must be 15 letters or under!");
        return false;
    }
    return true;
}

// Validates age input, returns true if valid, else displays an error message and returns false
function checkAge(age) {
    // Validate age input is not empty
    if (age === null || age === "") {
        regWarningFade("Please enter an age!");
        return false;
    }
    // Validates age input is a number between 1 and 150
    if (isNaN(age) || Number(age) < 1 || Number(age) > 150) {
        regWarningFade("Age must be a number from 1-150!");
        return false;
    }
    return true;
}

// Validates address input, returns true if valid, else displays an error message and returns false
function checkAddress(address) {
    if (address.trim() == "") {
        regWarningFade("Please enter an address!");
        return false;
    }
    return true;
}

// Validates phone number input, returns true if valid, else displays an error message and returns false
function checkPhoneNumber(phoneNumber) {
    if (phoneNumber === null || phoneNumber === "" || isNaN(phoneNumber) || phoneNumber < 1000000000 || phoneNumber > 9999999999) {
        regWarningFade("Please enter a valid phone number!");
        return false;
    }
    return true;
}

// Runs functions to validate all inputs, returns true if all inputs are valid, else returns false
function checkInputs(username, age, address, phoneNumber) {
    if (!checkName(username)) {
        return false;
    }
    if (!checkAge(age)) {
        return false;
    }
    if (!checkAddress(address)) {
        return false;
    }
    if (!checkPhoneNumber(phoneNumber)) {
        return false;
    }
    return true;
}

async function registrationSuccess(username, age, address, phoneNumber) {
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
        regWarning.hidden = false;
    }
}

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
    // Get input values
    let username = document.getElementById("regUsername").value;
    let age = document.getElementById("regAge").value;
    let address = document.getElementById("regAddress").value;
    let phoneNumber = document.getElementById("regPhoneNumber").value;
    age = Number(age);
    phoneNumber = Number(phoneNumber);
    console.table({ username, age, address, phoneNumber });

    if (!checkInputs(username, age, address, phoneNumber)) {
        return;
    } else {
        await registrationSuccess(username, age, address, phoneNumber);
    }
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
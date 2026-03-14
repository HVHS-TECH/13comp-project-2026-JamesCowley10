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
let returnToLoginButton = document.getElementById('returnToLoginButton');
let username = document.getElementById("regUsername").value;
let age = document.getElementById("regAge").value;
let address = document.getElementById("regAddress").value;
let phoneNumber = document.getElementById("regPhoneNumber").value;
const maxUsernameLength = 15;

// Displays a warning message
function regWarningFade(text) {
    regWarning.hidden = false;
    regWarning.style.animation = "none";
    regWarning.style.animation = "fadeInOut 5s forwards";
    regWarning.innerText = text;
}

// Validates user inputs, returns true if valid, else displays corresponding error message and returns false
function checkInputs(username, age, address, phoneNumber) {
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
    // Validates address input is not empty
    if (address.trim() == "") {
        regWarningFade("Please enter an address!");
        return false;
    }
    // Validates phone number input
    if (phoneNumber === null || phoneNumber === "" || isNaN(phoneNumber) || phoneNumber < 1000000000 || phoneNumber > 9999999999) {
        regWarningFade("Please enter a valid phone number!");
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

// If input changes in username input field, then changes colour depending on validity
document.getElementById("regForm").addEventListener("input", function () {
    // Get current values of input fields
    username = document.getElementById("regUsername").value;
    age = document.getElementById("regAge").value;
    address = document.getElementById("regAddress").value;
    phoneNumber = document.getElementById("regPhoneNumber").value;

    // If username input is valid, change colour to green, else change to red
    if (/^[A-Za-z]+$/.test(username) && username.length <= 15) {
        document.getElementById("regUsername").style.color = "green";
    } else {
        document.getElementById("regUsername").style.color = "red";
    }
    // If age input is valid, change colour to green, else change to red
    if (!isNaN(age) && Number(age) >= 1 && Number(age) <= 150) {
        document.getElementById("regAge").style.color = "green";
    } else {
        document.getElementById("regAge").style.color = "red";
    }
    // If address input is valid, change colour to green, else change to red
    if (address.trim() != "") {
        document.getElementById("regAddress").style.color = "green";
    } else {
        document.getElementById("regAddress").style.color = "red";
    }
    // If phone number input is valid, change colour to green, else change to red
    if (!isNaN(phoneNumber) && Number(phoneNumber) >= 1000000000 && Number(phoneNumber) <= 9999999999) {
        document.getElementById("regPhoneNumber").style.color = "green";
    } else {
        document.getElementById("regPhoneNumber").style.color = "red";
    }
});

// Sets userDetails as items from sessionStorage
userDetails.uid = sessionStorage.getItem("uid");
userDetails.email = sessionStorage.getItem("email");
userDetails.photoURL = sessionStorage.getItem("photoURL");
userDetails.displayName = sessionStorage.getItem("displayName");
console.table(userDetails);

// Event listener for the register button
regButton.onclick = async function () {
    // Get input values
    username = document.getElementById("regUsername").value;
    age = document.getElementById("regAge").value;
    address = document.getElementById("regAddress").value;
    phoneNumber = document.getElementById("regPhoneNumber").value;
    age = Number(age);
    phoneNumber = Number(phoneNumber);
    console.table({ username, age, address, phoneNumber });

    // Check inputs and if valid fires function for registration success
    if (!checkInputs(username, age, address, phoneNumber)) {
        return;
    } else {
        await registrationSuccess(username, age, address, phoneNumber);
    }
}

// Event listener for the return to login button, on click returns user to login page
returnToLoginButton.onclick = function () {
    // Sends user to login page
    const loginUrl = new URL('../../index.html', import.meta.url).href;
    location.href = loginUrl;
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
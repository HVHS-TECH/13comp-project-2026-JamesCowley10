/**************************************************************/
// accountPage.mjs
// Main script for accountPage.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c accountPage.mjs',
    'color: blue; background-color: white;');

const regWarning = document.getElementById('regWarning');
const regButton = document.getElementById('regButton');
const returnButton = document.getElementById('returnButton');
const profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");
const maxUsernameLength = 15;
const buttonSelectBackgroundColor = 'rgb(226, 226, 226)';
const gamePageURL = new URL('../gamePage/gamePage.html', import.meta.url).href;
const loginPageURL = new URL('../../index.html', import.meta.url).href;
let username = document.getElementById("regUsername").value;
let age = document.getElementById("regAge").value;
let address = document.getElementById("regAddress").value;
let phoneNumber = document.getElementById("regPhoneNumber").value;

/**************************************************************/
// regWarningFade()
// Called by checkInputs() to display warning message
// Makes warning visible and sets text to inputted text
// Input: text (string)
// Return: N/A
/**************************************************************/
function regWarningFade(text) {
    regWarning.hidden = false;
    regWarning.innerText = text;
}

/**************************************************************/
// updateButton(button, text, backgroundColor)
// Called by button event listeners to update style and state of button
// Disables button, updates button text and background colour to inputted values
// Input: button (string), text (string), backgroundColor (string)
// Return: N/A
/**************************************************************/
function updateButton(button, text, backgroundColor) {
    button.disabled = true;
    button.innerText = text;
    button.style.backgroundColor = backgroundColor;
}

/**************************************************************/
// checkInputs(username, age, address, phoneNumber)
// Called by regButton event listener to validate user inputs
// Validates user inputs, returns true if valid, else displays corresponding error message and returns false
// Input: username (string), age (number), address (string), phoneNumber (number)
// Return: boolean
/**************************************************************/
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
    // Validate address input is not empty and has a valid address selected
    if (address.trim() == "" || !address) {
        regWarningFade("Please enter a valid address!");
        return false;
    }
    // Validates phone number input
    if (phoneNumber === null || phoneNumber === "" || isNaN(phoneNumber) || phoneNumber < 1000000000 || phoneNumber > 999999999999) {
        regWarningFade("Please enter a valid phone number!");
        return false;
    }
    return true;
}

/**************************************************************/
// registrationSuccess()
// Called by regButton event listener if all inputs are valid
// Sets userDetails and sessionStorage to necessary values, then sends user to gamePage.html
// Input: username (string), age (number), address (string), phoneNumber (number)
// Return: N/A
/**************************************************************/
async function registrationSuccess(username, age, address, phoneNumber) {
    // If all validation is passed then set user's details and proceed
    console.log("Valid Inputs");

    updateButton(regButton, "Updating...", buttonSelectBackgroundColor);

    userDetails.username = username;
    userDetails.age = age;
    userDetails.address = address;
    userDetails.phoneNumber = phoneNumber;

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("age", age);
    sessionStorage.setItem("address", address);
    sessionStorage.setItem("phoneNumber", phoneNumber);

    // Sets the username and age to the user's userDetails in the database, then sends user to gamePage.html
    try {
        await fb_set('userDetails/' + userDetails.uid, userDetails);
        console.table(userDetails);
        const gameUrl = new URL('../gamePage/gamePage.html', import.meta.url).href;
        location.href = gameUrl;
    } catch (error) {
        console.error(error);
        regWarningFade("Error updating details. Please try again.");
    }
}

/**************************************************************/
// setInitialDetails()
// Called by accountPage.html to set placeholder values of registration fields
// Sets registration fields to current user's userDetails
// Input: N/A
// Return: N/A
/**************************************************************/
function setInitialDetails () {
    // Sets values of input fields to current userDetails values
    document.getElementById("regUsername").value = userDetails.username;
    document.getElementById("regAge").value = userDetails.age;
    document.getElementById("regAddress").value = userDetails.address;
    document.getElementById("regPhoneNumber").value = userDetails.phoneNumber;
}

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set, userDetails, fb_get }
    from '../index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_set = fb_set;
window.fb_get = fb_get;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

/**************************************************************/
// accountPage.html main code
/**************************************************************/

// If input changes in input field, then changes colour depending on validity
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
    if (!isNaN(phoneNumber) && Number(phoneNumber) >= 1000000000 && Number(phoneNumber) <= 999999999999) {
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
userDetails.username = sessionStorage.getItem("username");
userDetails.address = sessionStorage.getItem("address");
userDetails.age = sessionStorage.getItem("age");
userDetails.phoneNumber = sessionStorage.getItem("phoneNumber");
console.table(userDetails);

// Checks if profileImgURL exists in sessionStorage, if so sets it as src for profileImg
if (profileImgURL != null) {
    profileImg.src = profileImgURL;
    console.log("Profile image loaded");
}

setInitialDetails();

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

//  Event listener for the return to login button, on click returns user to login page
returnButton.onclick = function () {
    location.href = loginPageURL;
    updateButton(returnButton, "Returning...", buttonSelectBackgroundColor);
}

// Onload if sessionStorage.loggedIn is not y, then send user to last page
window.onload = function () {
    if (sessionStorage.getItem("loggedIn") != "y") {
        const lastUrl = new URL('../regPage.html', import.meta.url).href;
        location.href = lastUrl;
    }
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
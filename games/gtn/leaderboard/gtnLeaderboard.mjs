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
const leaderboardTable = document.getElementById("leaderboardTable");

/**************************************************************/
// updateButton(button, text, backgroundColor)
// Called by button event listeners to update style and state of a button
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
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_readSorted, userDetails }
    from '../../../main/index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_readSorted = fb_readSorted;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

// Reads sorted top 10 player's wins from database to display on gtn leaderboard
fb_readSorted('userScores/gtn', 'wins', 10, "../../games/gtn/leaderboard/gtnLeaderboard.mjs");

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
// displayLeaderboard(leaderboardData)
// Called by gtnLeaderboard.html to display leaderboard data
// Creates leaderboard table with rank, name, and wins for top 10 player in realtime database
// Input: leaderboardData (array)
// Return: N/A
/**************************************************************/
export async function displayLeaderboard(leaderboardData) {
    console.log(leaderboardData);

    for (let i = 0; i < leaderboardData.length; i++) {
        let leaderboardEntry = document.createElement("tr");
        leaderboardEntry.classList.add("leaderboardRow");
        let rank = document.createElement("td");
        rank.classList.add("leaderboardTextItem");
        let name = document.createElement("td");
        name.classList.add("leaderboardTextItem");
        let wins = document.createElement("td");
        wins.classList.add("leaderboardTextItem");
        name.innerHTML = leaderboardData[i].name
        wins.innerHTML = leaderboardData[i].wins

        // Makes rank inner html the value of the current index + 1 to show rank of player
        rank.innerHTML = i + 1;

        // If rank is 1, 2, or 3, changes colour to corresponding colour to show podium spot
        if (rank.innerHTML == 1) {
            leaderboardEntry.style.color = "#c5a100";
        } else if (rank.innerHTML == 2) {
            leaderboardEntry.style.color = "#686868";
        } else if (rank.innerHTML == 3) {
            leaderboardEntry.style.color = "#CD7F32";
        }

        // If name of leaderboard entry is name of user, makes font weight bold to show user who they are
        if (leaderboardData[i].name == userDetails.username) {
            leaderboardEntry.style.fontWeight = "bolder";
        }

        leaderboardEntry.appendChild(rank);
        leaderboardEntry.appendChild(name);
        leaderboardEntry.appendChild(wins);
        leaderboardTable.appendChild(leaderboardEntry);
    }
}

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
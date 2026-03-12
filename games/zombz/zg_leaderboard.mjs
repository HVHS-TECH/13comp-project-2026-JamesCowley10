/**************************************************************/
// zg_leaderboard.mjs
// Main script for zg_leaderboard.mjs
// Written by James Cowley, Term 2 2025
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c zg_leaderboard.mjs',
    'color: blue; background-color: white;');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_readSorted }
    from "../../main/index/fb_io.mjs";
window.fb_initialise = fb_initialise;
window.fb_readSorted = fb_readSorted;

/**************************************************************/
// Initialize Firebase
/**************************************************************/
fb_initialise();
fb_readSorted('userScores/Zombz', 'score', 10);

/**************************************************************/
// zg_leaderboard.mjs main code
/**************************************************************/
export async function displayLeaderboard(leaderboardData) { // Displays leaderboard data found from fb_readSorted
    console.log(leaderboardData);
    let leaderboardTable = document.createElement("table");

    for (let i = 0; i < leaderboardData.length; i++) {
        let leaderboardEntry = document.createElement("tr");
        let name = document.createElement("td");
        let score = document.createElement("td");
        name.innerHTML = leaderboardData[i].name
        score.innerHTML = leaderboardData[i].score
        leaderboardEntry.appendChild(name);
        leaderboardEntry.appendChild(score);
        leaderboardTable.appendChild(leaderboardEntry);
    }
    document.getElementById("leaderboard").appendChild(leaderboardTable);
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
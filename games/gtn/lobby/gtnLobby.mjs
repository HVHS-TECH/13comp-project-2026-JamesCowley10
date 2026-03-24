/**************************************************************/
// gtnLobby.mjs
// Main script for gtnLobby.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c gtnLobby.mjs',
    'color: blue; background-color: white;');

let gameSearchButton = document.getElementById('gameSearchButton');
let returnButton = document.getElementById('returnButton');
let profileImg = document.getElementById('profileImg');
const profileImgURL = sessionStorage.getItem("photoURL");
let gameNumber = 1;
let numberOfGames = 0;

function searchingForGame(text) {
    gameSearchButton.disabled = true;
    gameSearchButton.innerText = text;
    gameSearchButton.style.backgroundColor = 'rgb(226, 226, 226)';
    console.log("Searching for game...");

    // Read the number of games in the liveGames to determine the gameNumber if a game needs to be created
    fb_get('liveGames/').then((snapshot) => {
        const liveGames = snapshot
        if (liveGames != null) {
            numberOfGames = Object.keys(liveGames).length;
            numberOfGames = Number(numberOfGames);
            console.log("Number of games: " + numberOfGames);

            fb_get('liveGames/game' + numberOfGames + '/players/').then((snapshot) => {
                const players = snapshot
                if (players != null) {
                    const numberOfPlayers = Object.keys(players).length;
                    console.log("Players in game" + numberOfGames + ": " + numberOfPlayers);
                    // If there are less than 2 players in game, join the game
                    if (numberOfPlayers < 2) {
                        console.log("Joining game" + numberOfGames + " as player 2");
                        fb_set('liveGames/' + "game" + gameNumber + "/players/" + "player2", {
                            player2uid: userDetails.uid,
                            player2username: userDetails.username,
                            player2photoURL: userDetails.photoURL,
                        });
                    }

                    else {
                        console.log("All games full, creating new game");
                        gameNumber = numberOfGames + 1;
                        gameNumber = Number(gameNumber);
                        console.log("Game number: " + gameNumber);
                        fb_set('liveGames/' + "game" + gameNumber, {
                            players: {
                                player1: {
                                    player1uid: userDetails.uid,
                                    player1username: userDetails.username,
                                    player1photoURL: userDetails.photoURL
                                }
                            },
                            game: "",
                        });
                    }
                }
            }).catch((error) => {
                console.error(error);
            });

        } else {
            // If no games are found, create a new game with chosen gameNumber
            console.log("No games found");
            gameNumber = 1;
            gameNumber = Number(gameNumber);
            console.log("Game number: " + gameNumber);

            fb_set('liveGames/' + "game" + gameNumber, {
                players: {
                    player1: {
                        player1uid: userDetails.uid,
                        player1username: userDetails.username,
                        player1photoURL: userDetails.photoURL
                    }
                },
                game: {
                    player1Guess: "",
                    player2Guess: "",
                    isPlayer1Turn: true,
                    isPlayer2Turn: false,
                    randomNumber: Math.floor(Math.random() * 100) + 1,
                }
            });
        }
    }).catch((error) => {
        console.error(error);
    }
    );
}

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_set, fb_get, userDetails }
    from '../../../main/index/fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_set = fb_set;
window.fb_get = fb_get;

/**************************************************************/
// Initilise Firebase
/**************************************************************/
fb_initialise();

/**************************************************************/
// gtnLobby.html main code
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

// Event listener for the play button
gameSearchButton.onclick = function () {
    searchingForGame("Searching for game...");
}

// On click of returnButton returns player to game page
returnButton.onclick = function () {
    const gamePageURL = new URL('../../../main/gamePage/gamePage.html', import.meta.url).href;
    location.href = gamePageURL;
}

/**************************************************************/
//   END OF CODE
/**************************************************************/
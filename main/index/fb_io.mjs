//**************************************************************/
// fb_io.mjs
// Generalised firebase routines
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';
const COL_B = '#CD7F32';
console.log('%c ./fb_io.mjs',
    'color: blue; background-color: white;');

export let FB_GAMEDB;
export let fb_dataArray = [];
export let userDetails = {
    displayName: null,
    email: null,
    photoURL: null,
    uid: null,
    username: null,
    age: null,
    address: null,
    phoneNumber: null
};

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules
/**************************************************************/
import { initializeApp }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, limitToFirst, onValue, onDisconnect }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

/**************************************************************/
// fb_initialise()
// Called by html INITIALISE FIREBASE button
// List all the functions called by code or html outside of this module
// Input:  N/A
// Return: N/A
/**************************************************************/
export {
    fb_initialise, fb_login, fb_onAuthStateChanged, fb_signOut, fb_set, fb_get, fb_getAll, fb_update, fb_readSorted, fb_onValueChange, fb_onDisconnect
};

function fb_initialise() {
    sessionStorage.setItem("mustRegister", "n");

    const FB_GAMECONFIG = {
        apiKey: "AIzaSyCYwD2IYqCFh8TK4j1zgBfVm0XBXQOs_BE",
        authDomain: "comp-james-cowley.firebaseapp.com",
        databaseURL: "https://comp-james-cowley-default-rtdb.firebaseio.com",
        projectId: "comp-james-cowley",
        storageBucket: "comp-james-cowley.firebasestorage.app",
        messagingSenderId: "573308382841",
        appId: "1:573308382841:web:cf31d7e7fbe60c432faea8",
        measurementId: "G-GECJPBKJ9D"
    };

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    FB_GAMEDB = getDatabase(FB_GAMEAPP);

    const AUTH = getAuth();

}

/**************************************************************/
// fb_login()
// Called by html LOGIN button
// Login to Firebase via Google authentication
// Input:  N/A
// Return: N/A
/**************************************************************/
function fb_login() {
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyCYwD2IYqCFh8TK4j1zgBfVm0XBXQOs_BE",
        authDomain: "comp-james-cowley.firebaseapp.com",
        databaseURL: "https://comp-james-cowley-default-rtdb.firebaseio.com",
        projectId: "comp-james-cowley",
        storageBucket: "comp-james-cowley.firebasestorage.app",
        messagingSenderId: "573308382841",
        appId: "1:573308382841:web:cf31d7e7fbe60c432faea8",
        measurementId: "G-GECJPBKJ9D"
    };

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    FB_GAMEDB = getDatabase(FB_GAMEAPP);

    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    // The following prompts the Google account selection window
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        userDetails.displayName = result.user.displayName;
        userDetails.email = result.user.email;
        userDetails.photoURL = result.user.photoURL;
        userDetails.uid = result.user.uid;

        sessionStorage.setItem("uid", userDetails.uid);
        sessionStorage.setItem("email", userDetails.email);
        sessionStorage.setItem("photoURL", userDetails.photoURL);
        sessionStorage.setItem("displayName", userDetails.displayName);

        const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
        get(dbReference).then((snapshot) => {
            var fb_data = snapshot.val();
            if (fb_data != null) {
                userDetails.username = fb_data.username;
                userDetails.age = fb_data.age;
                userDetails.address = fb_data.address;
                userDetails.phoneNumber = fb_data.phoneNumber;
                sessionStorage.setItem("username", userDetails.username);
                sessionStorage.setItem("age", userDetails.age);
                sessionStorage.setItem("address", userDetails.address);
                sessionStorage.setItem("phoneNumber", userDetails.phoneNumber);
                sessionStorage.setItem("loggedIn", "y");
                sessionStorage.setItem("mustRegister", "n");

                /**************************************************************/
                // USER IS REGISTERED, BUT ARE THEY ADMIN
                const dbReference = ref(FB_GAMEDB, 'admins/' + userDetails.uid);
                get(dbReference).then((snapshot) => {
                    var fb_data = snapshot.val();
                    const gamePageURL = new URL('../gamePage/gamePage.html', import.meta.url).href;
                    if (fb_data != null) {
                        sessionStorage.setItem('admin', 'y');
                        location.href = gamePageURL;
                    } else {
                        sessionStorage.setItem('admin', 'n');
                        location.href = gamePageURL;
                    }

                }).catch((error) => {
                    console.error("fb_login: admin check failed:", error);
                });

                /**************************************************************/

            } else {
                sessionStorage.setItem("mustRegister", "y");

                /**************************************************************/
                // USER IS NOT REGISTERED, BUT ARE THEY ADMIN
                const dbReference = ref(FB_GAMEDB, 'admins/' + userDetails.uid);
                get(dbReference).then((snapshot) => {
                    const regUrl = new URL('../reg/regPage.html', import.meta.url).href;
                    var fb_data = snapshot.val();
                    if (fb_data != null) {
                        sessionStorage.setItem('admin', 'y');
                        location.href = regUrl;
                    } else {
                        sessionStorage.setItem('admin', 'n');
                        location.href = regUrl;
                    }

                }).catch((error) => {
                    console.error("fb_login: admin check failed:", error);
                });

                /**************************************************************/
            }
        }).catch((error) => {
            console.error("fb_login: failed to read userDetails:", error);
        });

    })
        .catch((error) => {
            console.error("fb_login: Google sign-in failed:", error);
        });
}

/**************************************************************/
// fb_onAuthStateChanged)
// Called by html DETECT LOGIN CHANGE button
// Checks the current status of the user
// Input:  N/A
// Return: N/A
/**************************************************************/
function fb_onAuthStateChanged() {
    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            return;
        }
    }, (error) => {
        console.error("fb_onAuthStateChanged: auth state check failed:", error);
    });
}

/**************************************************************/
// fb_signOut()
// Called by html LOGOUT button
// Logs the user out
// Input:  N/A
// Return: N/A
/**************************************************************/
function fb_signOut() {
    const AUTH = getAuth();
    signOut(AUTH).then(() => {
    })
        .catch((error) => {
            console.error("fb_signOut: sign out failed:", error);
        });
}

/**************************************************************/
// fb_set(path, data)
// Called by html WRITE RECORD button
// Writes data to the database
// Input: path (string), data (object)
// Return: Promise
/**************************************************************/
function fb_set(path, data) {
    const dbReference = ref(FB_GAMEDB, path);

    return set(dbReference, data)
        .then(() => {
        })
        .catch((error) => {
            console.error("fb_set: write failed for path:", path, error);
        });
}

/**************************************************************/
// fb_get()
// Called by html READ RECORD button
// Reads data from database
// Input: path (string)
// Return: Promise
/**************************************************************/
function fb_get(path) {
    const dbReference = ref(FB_GAMEDB, path);
    return get(dbReference)
        .then((snapshot) => {
            var fb_data = snapshot.val();
            if (fb_data != null) {
                return fb_data;
            } else {
                return null;
            }
        }).catch((error) => {
            console.error("fb_get: read failed for path:", path, error);
            return null;
        });
}

/**************************************************************/
// fb_getAll()
// Called by html READ ALL button
// Reads all data from 'userDetails'
// Input:  N/A
// Return: N/A
/**************************************************************/
function fb_getAll() {
    const dbReference = ref(FB_GAMEDB, 'userDetails');
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();

        if (fb_data != null) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                fb_dataArray = [];
                fb_dataArray.push(childData);
            });
        }
    }).catch((error) => {
        console.error("fb_getAll: failed to read userDetails:", error);
    });
}

/**************************************************************/
// fb_update()
// Called by html UPDATE RECORD button
// Updates a set of data in the database, specifically displayName currently
// Input:  N/A
// Return: N/A
/**************************************************************/
function fb_update() {
    const _data = userDetails;
    const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
    update(dbReference, _data).then(() => {
    }).catch((error) => {
        console.error("fb_update: update failed:", error);
    });
}

/**************************************************************/
// fb_readSorted(path, sortkey, number, leaderboardPath)
// Called to retrieve and sort desired data from realtime database
// Read sorted
// Input: path (string), sortkey (string) number (number), leaderboardPath (string)
// Return: N/A but returns sorted data to console
/**************************************************************/
async function fb_readSorted(path, sortkey, number, leaderboardPath) {
    const dbReference = query(ref(FB_GAMEDB, path), orderByChild(sortkey), limitToFirst(number));
    try {
        const snapshot = await get(dbReference);
        var fb_data = snapshot.val();
        if (fb_data != null) {
            var result = []
            snapshot.forEach(child => {
                result.push(child.val())
            });
            // Import displayLeaderboard when running fb_readSorted to avoid overrunning code
            const { displayLeaderboard } = await import(leaderboardPath);
            // Reverses the scores so that scores are from highest to lowest
            result.reverse(); // Reverses the scores so that scores are from highest to lowest
            displayLeaderboard(result);
        }
    } catch (error) {
        console.error("fb_readSorted: sorted read failed for path:", path, error);
    }
}

/**************************************************************/
// fb_onValueChange(path, callback)
// Called to listen for changes in a path in the database
// Listen for value changes
// Input: path (string), callback (function)
// Return: N/A but returns sorted data to console
/**************************************************************/

async function fb_onValueChange(path, callback) {
    const dbReference = ref(FB_GAMEDB, path);
    onValue(dbReference, (snapshot) => {
        callback(snapshot);
    }, (error) => {
        console.error("fb_onValueChange: read failed for path:", path, error);
    });
}

/**************************************************************/
// fb_onDisconnect()
// Called to set up a disconnect handler for a path in the database
// Check if a user has disconnected
// Input: path (string), callback (function)
// Return: N/A
/**************************************************************/
function fb_onDisconnect(path, callback) {
    const dbReference = ref(FB_GAMEDB, path);
    onDisconnect(dbReference).remove().then(() => {
        sessionStorage.setItem("isInGame", "false");
    }).catch((error) => {
        console.error("fb_onDisconnect: setup failed for path:", path, error);
    });
}

/**************************************************************/
// END OF CODE
/**************************************************************/
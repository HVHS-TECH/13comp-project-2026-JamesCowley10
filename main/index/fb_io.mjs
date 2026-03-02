//**************************************************************/
// fb_io.mjs
// Generalised firebase routines
// Written by James Cowley, Term 1 2026
//
// All variables & function begin with fb_  all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/
const COL_C = 'white'; // These two const are part of the coloured 	
const COL_B = '#CD7F32'; //  console.log for functions scheme
console.log('%c ./fb_io.mjs',
    'color: blue; background-color: white;');

export let FB_GAMEDB;
export let fb_dataArray = [];
export let userDetails = {
    displayName: null,
    email: null,
    photoURL: null,
    uid: null,
    name: null,
    age: null
};

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, limitToFirst }
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
    fb_initialise, fb_login, fb_onAuthStateChanged, fb_signOut, fb_set, fb_get, fb_getAll, fb_update, fb_readSorted
};

function fb_initialise() {
    console.log('%c fb_initialise(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

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
    console.info(FB_GAMEDB);         	//DIAG

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
    console.log('%c fb_login(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

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
    console.info(FB_GAMEDB);

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
        console.table(userDetails);

        sessionStorage.setItem("uid", userDetails.uid);
        sessionStorage.setItem("email", userDetails.email);
        sessionStorage.setItem("photoURL", userDetails.photoURL);
        sessionStorage.setItem("displayName", userDetails.displayName);

        fb_set('userDetails/' + userDetails.uid, userDetails);

        const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid);
        get(dbReference).then((snapshot) => {
            var fb_data = snapshot.val();
            if (fb_data != null) {
                console.log("✅ Successful Read");
                userDetails.name = fb_data.name;
                userDetails.age = fb_data.age;
                sessionStorage.setItem("name", userDetails.name);
                sessionStorage.setItem("age", userDetails.age);
                console.table(fb_data);

                /**************************************************************/
                // USER IS REGISTERED, BUT ARE THEY ADMIN
                const dbReference = ref(FB_GAMEDB, 'admins/' + userDetails.uid);
                get(dbReference).then((snapshot) => {
                    var fb_data = snapshot.val();
                    const gameUrl = new URL('../gamePage/gamePage.html', import.meta.url).href;
                    if (fb_data != null) {
                        console.log("✅ User Is An Admin");
                        sessionStorage.setItem('admin', 'y');
                        //location.href = gameUrl;
                        //location.href = '/main/gamePage/gamePage.html'
                    } else {
                        console.log("Not an admin");
                        sessionStorage.setItem('admin', 'n');
                        //location.href = gameUrl;
                        //location.href = '/main/gamePage/gamePage.html'
                    }

                }).catch((error) => {
                    console.error(error);;
                });

                /**************************************************************/

            } else {
                console.log("❓ No Record Found"); // Succesful read but no record found

                /**************************************************************/
                // USER IS NOT REGISTERED, BUT ARE THEY ADMIN
                const dbReference = ref(FB_GAMEDB, 'admins/' + userDetails.uid);
                get(dbReference).then((snapshot) => {
                    const regUrl = new URL('../reg/regPage.html', import.meta.url).href;
                    var fb_data = snapshot.val();
                    if (fb_data != null) {
                        console.log("✅ User Is An Admin");
                        sessionStorage.setItem('admin', 'y');
                        //location.href = regUrl;
                        //location.href = 'main/reg/regPage.html'
                    } else {
                        console.log("Not an admin");
                        sessionStorage.setItem('admin', 'n');
                        //location.href = regUrl;
                        //location.href = 'main/reg/regPage.html'
                    }

                }).catch((error) => {
                    console.error(error);;
                });

                /**************************************************************/
            }
        }).catch((error) => {
            console.error(error);;
        });

    })
        .catch((error) => {
            console.error(error);;
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
    console.log('%c fb_onAuthStateChanged(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            console.log("✅ User Is Logged In");
        } else {
            console.log("✅ User Is Logged Out");
        }
    }, (error) => {
        console.error(error);;
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
    console.log('%c fb_signOut(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const AUTH = getAuth();
    signOut(AUTH).then(() => {
        console.log("✅ Login Successful");
    })
        .catch((error) => {
            console.error(error);;
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
    console.log('%c fb_set(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const dbReference = ref(FB_GAMEDB, path);

    return set(dbReference, data)
        .then(() => {
            console.log("✅ Successful Write");
        })
        .catch((error) => {
            console.error(error);;
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
    console.log('%c fb_get(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const dbReference = ref(FB_GAMEDB, path);
    return get(dbReference)
        .then((snapshot) => {
            var fb_data = snapshot.val();
            if (fb_data != null) {
                console.log("✅ Successful Read");
                console.table(fb_data);
                return fb_data;
            } else {
                console.log("❓ No Record Found");
                return null;
            }
        }).catch((error) => {
            console.error(error);;
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
    console.log('%c fb_getAll(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const dbReference = ref(FB_GAMEDB, 'userDetails');
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();

        if (fb_data != null) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                console.log(childData);
                fb_dataArray = [];
                fb_dataArray.push(childData);
            });
            console.log("✅ Successful Read");
            console.table(fb_dataArray);
        } else {
            console.log("❓ No Record Found");
        }
    }).catch((error) => {
        console.error(error);;
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
    console.log('%c fb_update(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const _data = userDetails;
    const dbReference = ref(FB_GAMEDB, 'userDetails/' + userDetails.uid + '/displayName');
    update(dbReference, _data).then(() => {
        console.log("✅ Successful Update");
        console.table(_data);
    }).catch((error) => {
        console.error(error);;
    });
}

/**************************************************************/
// fb_readSorted(path, sortkey, number)
// Called to retrieve and sort desired data from realtime database
// Read sorted
// Input: path (string), sortkey (string) number (number)
// Return: N/A but returns sorted data to console
/**************************************************************/
async function fb_readSorted(path, sortkey, number) {
    console.log('%c fb_readSorted(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const dbReference = query(ref(FB_GAMEDB, path), orderByChild(sortkey), limitToFirst(number));
    try {
        const snapshot = await get(dbReference);
        var fb_data = snapshot.val();
        if (fb_data != null) {
            var result = []
            snapshot.forEach(child => {
                result.push(child.val())
            });
            console.log("✅ Successful Sorted Read");
            const { displayLeaderboard } = await import("../../games/zg/zg_leaderboard.mjs"); // Import displayLeaderboard when running fb_readSorted to avoid overrunning code
            result.reverse(); // Reverses the scores so that scores are from highest to lowest
            displayLeaderboard(result);
        } else {
            console.log("✅ No Record Found");
        }
    } catch (error) {
        console.error(error);;
    }
}

/**************************************************************/
// END OF CODE
/**************************************************************/
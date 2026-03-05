/**************************************************************/
// main.mjs
// Main entry for index.html
// Written by James Cowley, Term 1 2026
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c main.mjs',
    'color: blue; background-color: white;');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module
import { fb_initialise, fb_login, fb_onAuthStateChanged, fb_signOut, fb_set, fb_get }
    from './fb_io.mjs';
window.fb_initialise = fb_initialise;
window.fb_login = fb_login;
window.fb_onAuthStateChanged = fb_onAuthStateChanged;
window.fb_signOut = fb_signOut;
window.fb_set = fb_set;
window.fb_get = fb_get;

/**************************************************************/
// index.html main code
/**************************************************************/
fb_initialise();

/**************************************************************/
//   END OF CODE
/**************************************************************/
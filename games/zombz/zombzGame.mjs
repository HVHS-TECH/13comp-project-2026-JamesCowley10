/*******************************************************/
// zombzGame.js 
// Zombz Game
// Written by James Cowley
/*******************************************************/
// Variables

import { fb_initialise, fb_readSorted, fb_set, userDetails, fb_get } 
    from "../../main/index/fb_io.mjs";

/*******************************************************/
const TILE_WIDTH = 48;
const TILE_HEIGHT = 48;
const WALL_THICKNESS = 30;
const WALL_HEIGHT = 1000;
const PLAYER_SHADOW_SIZE = 16;
const ZOMBIE_WIDTH = 12;
const ZOMBIE_HEIGHT = 15;
const PLAYER_WIDTH = 14;
const PLAYER_HEIGHT = 27;
const PLAYER_SPEED = 1;
const MAX_PLAYER_HEALTH = 100;
const ZOMBIE_SPEED = 0.028;
const ZOMBIE_SPAWNER_MULTIPLIER = 2;
const CONSUMABLE_WIDTH = 18;
const CONSUMABLE_HEIGHT = 18;
const sreloadUrl = new URL('./assets/reloadSound.mp3', import.meta.url).href;
const RELOAD_SOUND = new Audio(sreloadUrl);
//const RELOAD_SOUND = new Audio("/games/zg/assets/reloadSound.mp3");

const GUNS = {
    pistol: {
        ammo: 12,
        bulletSpeed: 7
    },
    shotgun: {
        ammo: 8,
        bulletSpeed: 11
    },
    assaultRifle: {
        ammo: 30,
        bulletSpeed: 14
    }
};

let cnv;

let time = 0;
let score = 0;
let kills = 0;
let wave = 0;
let zombiesRemaining = 0;
let canReload = true;

let sheetImg;

let player;
let playerShadow;
let playerHealth = MAX_PLAYER_HEALTH;
let characterShadowImg;
let playerImgRight;
let playerImgLeft;

let zombieGroup;
let newZombie;
let zombieDamage = 100 / (60 * 8); // 100 damage over 480 frames
let zombieImg;

let gun;
let currentGun;
let currentGunAmmo;
let currentBulletSpeed;

let gunFrame;
let gunFrameImg;
let currentGunImgRight;
let currentGunImgLeft;

let assaultRifleRight;
let assaultRifleLeft;

let shotgunRight;
let shotgunLeft;

let pistolRight;
let pistolLeft;

let bulletsGroup;
let bulletImg;

let consumableImg;
let newConsumable;

let shootSound;
let healthSound;

let consumablesGroup;
let statsUIGroup;

let healthBarOutline;
let healthBarOutlineImg;
let healthBarFill;
let healthBarFillImg;

let wallTop;
let wallBot;
let wallRight;
let wallLeft;
let wallGroup;
let wallTopImg;
let wallBotImg;
let wallLeftImg;
let wallRightImg;

let mousePosition;
let mouseAngle;

let highscore;

window.preload = preload;
window.setup = setup;
window.draw = draw;

userDetails.uid = sessionStorage.getItem("uid");
userDetails.name = sessionStorage.getItem("name");
console.table(userDetails);

/*******************************************************/
// preload()
// Called when the page loads
// Preload assets
// Input: N/A
// Output: N/A
/*******************************************************/
function preload() {
    console.log("Preloading Assets...");
    const ASSETS = './assets/';  // relative to games/zg/index.html
    sheetImg            = loadImage(ASSETS + 'tileMap.png');
    zombieImg           = loadImage(ASSETS + 'zombieCharacter.png');
    playerImgRight      = loadImage(ASSETS + 'playerRight.png');
    playerImgLeft       = loadImage(ASSETS + 'playerLeft.png');
    characterShadowImg  = loadImage(ASSETS + 'characterShadow.png');
    assaultRifleRight   = loadImage(ASSETS + 'assaultRifleRight.png');
    assaultRifleLeft    = loadImage(ASSETS + 'assaultRifleLeft.png');
    shotgunRight        = loadImage(ASSETS + 'shotgunRight.png');
    shotgunLeft         = loadImage(ASSETS + 'shotgunLeft.png');
    pistolRight         = loadImage(ASSETS + 'pistolRight.png');
    pistolLeft          = loadImage(ASSETS + 'pistolLeft.png');
    healthBarOutlineImg = loadImage(ASSETS + 'healthBarOutline.png');
    healthBarFillImg    = loadImage(ASSETS + 'healthBarFill.png');
    gunFrameImg         = loadImage(ASSETS + 'gunFrame.png');
    bulletImg           = loadImage(ASSETS + 'bullet.png');
    wallTopImg          = loadImage(ASSETS + 'wallTop.png');
    wallBotImg          = loadImage(ASSETS + 'wallBot.png');
    wallLeftImg         = loadImage(ASSETS + 'wallLeft.png');
    wallRightImg        = loadImage(ASSETS + 'wallRight.png');
    consumableImg       = loadImage(ASSETS + 'healthKit.png');
}

/*******************************************************/
// setup()
// Called when the page loads
// Setup the canvas and initial game state
// Input: N/A
// Output: N/A
/*******************************************************/
function setup() {
    fb_initialise();
    highscore = fb_get('userScores/Zombz/' + sessionStorage.getItem("uid") + '/score');
    frameRate(60);
    console.log("Starting Setup...");
    cnv = new Canvas(336, 240, "pixelated x4");
    wallGroup = new Group();
    zombieGroup = new Group();
    bulletsGroup = new Group();
    consumablesGroup = new Group();
    statsUIGroup = new Group();
    createZombies();
    createBulletGroup();
    tileSetUp();
    createZombies();
    createPlayer(width / 2, height / 2);
    createStatsUI();
    createWalls();
    startWave();

    // For debugging as per request of teacher
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'z') {
            console.log('%c html_listen4Debug(): ACTIVE',
                'color: white; background-color: purple;');
            // Place debug code here ***************************
            // EG to set debug mode for all sprites 
            allSprites.debug = true;

            // To slow the frame rate down to 1 frame/sec
            frameRate(1);

            // OR to tell P5 to NOT call the draw loop again (freeze the screen)
            //noLoop();

        } else if (event.ctrlKey && event.key === 'x') {
            console.log('%c html_listen4Debug(): INACTIVE',
                'color: white; background-color: purple;');
            // Place code to turn off debug mode here *********
            // EG to turn off debug mode for all sprites
            allSprites.debug = false;

            // To reset frame rate to 60 frame/sec
            frameRate(60);

            // OR if you set noLoop() - to start P5 calling the draw loop again
            //loop();
        }
    });
}

/*******************************************************/
// tileSetUp()
// Called by setup() when game starts
// Setup the tile map and positioning
// Input: N/A
// Output: N/A
/*******************************************************/
function tileSetUp() {
    console.log("Setting Up Tiles...");
    let grass = new Group();
    grass.collider = "none";
    grass.spriteSheet = sheetImg;
    grass.addAni({
        w: 48,
        h: 48,
        row: 0,
        col: 0
    });
    grass.tile = 'g';
    grass.layer = 0;

    let stone = new Group();
    stone.collider = "none";
    stone.spriteSheet = sheetImg;
    stone.addAni({
        w: 48,
        h: 48,
        row: 0,
        col: 1
    });
    stone.tile = 's';
    stone.layer = 0;

    let dirt = new Group();
    dirt.collider = "none";
    dirt.spriteSheet = sheetImg;
    dirt.addAni({
        w: 48,
        h: 48,
        row: 0,
        col: 4
    });
    dirt.tile = 'd';
    dirt.layer = 0;

    let road = new Group();
    road.collider = "none";
    road.spriteSheet = sheetImg;
    road.addAni({
        w: 48,
        h: 48,
        row: 0,
        col: 3
    });
    road.tile = 'r';
    road.layer = 0;

    new Tiles(
        [
            'ddgsrrs', // Rows = 5 (240/48)
            'dggsrrs',
            'gggsrrs',
            'ssssrrs',
            'rrrrrrr'
        ],
        25, 0, // x, y
        TILE_WIDTH, TILE_HEIGHT // w, h
    );
}

/*******************************************************/
// createWalls()
// Called by setup when game starts
// Create walls and positioning
// Input: N/A
// Output: N/A
/*******************************************************/
function createWalls() {
    console.log("Creating Walls...");

    wallLeft = new Sprite(-WALL_THICKNESS + 13, height / 2, WALL_THICKNESS, WALL_HEIGHT, 's');
    wallLeft.image = (wallLeftImg);
    wallGroup.add(wallLeft);
    wallRight = new Sprite(width + WALL_THICKNESS - 13, height / 2, WALL_THICKNESS, WALL_HEIGHT, 's');
    wallRight.image = (wallRightImg);
    wallGroup.add(wallRight);
    wallTop = new Sprite(width / 2, 0, WALL_HEIGHT, WALL_THICKNESS, 's');
    wallTop.image = (wallTopImg);
    wallGroup.add(wallTop);
    wallBot = new Sprite(width / 2, height, WALL_HEIGHT, WALL_THICKNESS, 's');
    wallBot.image = (wallBotImg);
    wallGroup.add(wallBot);

    wallGroup.layer = 5;
}

/*******************************************************/
// createPlayer()
// Called by setup() when game starts
// Create the player and set it's positioning
// Input: N/A
// Output: N/A
/*******************************************************/
function createPlayer(x, y) {
    console.log("Creating Player...");

    playerShadow = new Sprite(0, 0, PLAYER_SHADOW_SIZE, PLAYER_SHADOW_SIZE, "n");
    playerShadow.opacity = 0.3;
    player = new Sprite(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, "d");
    gun = new Sprite(0, 0, 28, 11, "n");
    gun.image = (pistolRight);
    currentGun = "pistol";
    currentGunImgRight = (pistolRight);
    currentGunImgLeft = (pistolLeft);
    currentGunAmmo = GUNS[currentGun].ammo;
    currentBulletSpeed = GUNS[currentGun].bulletSpeed;

    player.image = (playerImgRight);
    playerShadow.image = (characterShadowImg);
    player.rotationLock = true;
}

/*******************************************************/
// createZombies()
// Called by setup() when game starts
// Set up zombieGroup
// Input: N/A
// Output: N/A
/*******************************************************/
function createZombies() {
    console.log("Creating Zombies...");

    zombieGroup.w = ZOMBIE_WIDTH;
    zombieGroup.h = ZOMBIE_HEIGHT;
    zombieGroup.rotationLock = true;

    zombieGroup.layer = 3;
    zombieGroup.collider = "d";
    zombieGroup.image = (zombieImg);
}

/*******************************************************/
// createBulletGroup()
// Called by setup() when game starts
// Create bullet group and setup
// Input: N/A
// Output: N/A
/*******************************************************/
function createBulletGroup() {
    console.log("Creating BulletGroup...");

    bulletsGroup.speed = currentBulletSpeed;
    bulletsGroup.diameter = 2;
    bulletsGroup.color = "yellow";
    bulletsGroup.collider = "k";
    bulletsGroup.image = (bulletImg);
    bulletsGroup.layer = 8;
}

/*******************************************************/
// spawnConsumables()
// Called by updateSpritesAndVariables() when consumable needs to spawn
// Creates consumable and spawns it in a random position
// Input: N/A
// Output: N/A
/*******************************************************/
function spawnConsumable() {
    console.log("Creating Consumables...");

    consumablesGroup.collider = "n";
    consumablesGroup.image = (consumableImg);
    consumablesGroup.layer = 1;
    consumablesGroup.w = CONSUMABLE_WIDTH;
    consumablesGroup.h = CONSUMABLE_HEIGHT;
    consumablesGroup.rotation = Math.random(-45, 45);
    consumablesGroup.rotationLock = true;

    newConsumable = new consumablesGroup.Sprite(random(10, 150), random(10, 150));
    newConsumable.rotation = random(-360, 360);
}

/*******************************************************/
// changeGun()
// Called by updateSpritesAndVariables when player reaches a certain amount of kils
// Function for changing player gun
// Input: newGun
// Output: N/A
/*******************************************************/
function changeGun(newGun) {
    console.log("Changing Gun...");

    if (GUNS[newGun]) {
        currentGun = newGun;
    }
}

/*******************************************************/
// startWave()
// Called by setup() when game starts, aswell as spawnZombies once new wave begins
// Used to start wave
// Input: N/A
// Output: N/A
/*******************************************************/
function startWave() {
    console.log("Starting Wave...");

    wave = wave + 1;
    zombiesRemaining = Math.floor(2 + wave * ZOMBIE_SPAWNER_MULTIPLIER);
    spawnZombies();
    if (Math.random() < 0.08) { // 8% chance to spawn a consumable, runs function to spawn one when needed
        spawnConsumable();
    }
}

/*******************************************************/
// spawnZombies()
// Called by updateSpritesAndVariables while game is playing
// Used to spawn zombies into the game
// Input: N/A
// Output: N/A
/*******************************************************/
function spawnZombies() {
    console.log("Spawning Zombies...");

    if (zombiesRemaining > 0) {
        setTimeout(() => {
            newZombie = new zombieGroup.Sprite();
            newZombie.x = random() < 0.5 ? random(2, 50) : random(width - 50, width);
            newZombie.y = random() < 0.5 ? random(2, 50) : random(height - 50, height);
            zombiesRemaining = zombiesRemaining - 1;

            spawnZombies();
        }, random(200, 1500));
    } else {
        setTimeout(() => {
            startWave();
        }, 2000);
    }
}

/*******************************************************/
// createStatsUI()
// Called by setup() when game starts
// Creates UI for Kills, Time, Ammo, Health, and player's current gun
// Input: N/A
// Output: N/A
/*******************************************************/
function createStatsUI() {
    console.log("Creating Stats UI...");

    healthBarOutline = new Sprite(45, 45, 67, 16, "n");
    healthBarOutline.image = (healthBarOutlineImg);
    statsUIGroup.add(healthBarOutline);
    healthBarFill = new Sprite(55, 45, 67, 16, "n");
    healthBarFill.image = (healthBarFillImg);
    statsUIGroup.add(healthBarFill);

    healthBarOutline.layer = 99;
    healthBarFill.layer = 100;

    gunFrame = new Sprite(24, 68, 23, 23, "n");
    gunFrame.image = (gunFrameImg);
    statsUIGroup.add(gunFrame);
    let currentGunImg = new Sprite(24, 68, 30, 30, "n");
    currentGunImg.image = (pistolRight);
    statsUIGroup.add(currentGunImg);

    statsUIGroup.layer = 12;

    let killsText = document.createElement("p");
    killsText.id = ("killsText");

    killsText.classList.add("killsText");
    killsText.innerText = ("Kills: " + kills);

    let timeText = document.createElement("p");
    timeText.id = ("timeText");

    timeText.classList.add("timeText");
    timeText.innerText = ("Time: " + time);

    let ammoText = document.createElement("p");
    ammoText.id = ("ammoText");

    ammoText.classList.add("ammoText");
    ammoText.innerText = ("Ammo: " + currentGunAmmo + "/" + (GUNS[currentGun].ammo));

    let waveText = document.createElement("p");
    waveText.id = ("waveText");

    waveText.classList.add("waveText");
    waveText.innerText = ("Wave: " + wave);

    document.body.appendChild(killsText);
    document.body.appendChild(timeText);
    document.body.appendChild(ammoText);
    document.body.appendChild(waveText);

    let endScoreText = document.getElementById("endScoreText");
    endScoreText.innerText = ("");
    let endScreenTitle = document.getElementById("endScreenTitle");
    endScreenTitle.innerText = ("");
    let menuButton = document.getElementById("menuButton");
    menuButton.innerText = ("");
    menuButton.disabled = true;
    menuButton.style.pointerEvents = "none";
    let playAgainButton = document.getElementById("playAgainButton");
    playAgainButton.innerText = ("");
    playAgainButton.disabled = true;
    playAgainButton.style.pointerEvents = "none";
}

/*******************************************************/
// endScreen()
// Called by updateSpritesAndVariables when player health <= 0
// Hides sprites and shows end screen
// Input: N/A
// Output: N/A
/*******************************************************/
function endScreen() {
    console.log("endScreen(): Creating End Screen...");
    let score = Number(kills * time.toFixed(0));
    let name = userDetails.name;
    let uid = sessionStorage.getItem("uid");

    // Get the user's current highscore first
    fb_get('userScores/Zombz/' + uid).then((fb_data) => {
        let highscore = fb_data ? fb_data.score : null;

        if (highscore === null || highscore === undefined) {
            // No previous score, set as highscore
            console.log("No previous highscore. Setting new highscore: " + score);
            fb_set('userScores/Zombz/' + uid, { score: score, name: name });
        } else if (score > highscore) {
            // New highscore
            console.log("New High Score! Previous: " + highscore + " New: " + score);
            fb_set('userScores/Zombz/' + uid, { score: score, name: name });
        } else {
            // Not a highscore
            console.log("No New High Score. Current: " + score + ", Highscore: " + highscore);
        }

        statsUIGroup.remove();
        //killsText.remove();               //???
        //timeText.remove();                //???
        let endScoreText = document.getElementById("endScoreText");
        endScoreText.innerText = ("Score: " + score);
        let endScreenTitle = document.getElementById("endScreenTitle");
        endScreenTitle.innerText = ("GAME OVER");
        let menuButton = document.getElementById("menuButton");
        menuButton.innerText = ("MENU");
        menuButton.disabled = false;
        menuButton.style.pointerEvents = "auto";
        let playAgainButton = document.getElementById("playAgainButton");
        playAgainButton.innerText = ("PLAY AGAIN");
        playAgainButton.disabled = false;
        playAgainButton.style.pointerEvents = "auto";
    });
}

/*******************************************************/
// updateStats()
// Called by draw() every 60th of a second
// Updates stats variables and HTML
// Input: N/A
// Output: N/A
/*******************************************************/
function updateStats() {
    time = time + (1 / 60);
    killsText.innerText = ("Kills: " + kills); // Update UI Stats, Kills, Time, Ammo
    timeText.innerText = ("Time: " + (time.toFixed(0)));
    waveText.innerText = ("Wave: " + wave);
}

/*******************************************************/
// updateGun()
// Called by draw() every 60th of a second
// Checks to see whether gun should be changed and updates gun variables
// Input: N/A
// Output: N/A
/*******************************************************/
function updateGun() {
    if (kills == 20) { // If player has 30 kills, give them the shotgun and change needed variables
        console.log("Gun Changing To Shotgun...");
        currentGun = "shotgun";
        currentBulletSpeed = GUNS[currentGun].bulletSpeed;
        currentGunAmmo = GUNS[currentGun].ammo;
        currentGunImgLeft = shotgunLeft;
        currentGunImgRight = shotgunRight;
        currentGunImg.image = (currentGunImgRight);
    }

    if (kills == 40) { // If player has 70 kills, give them the assault rifle and change needed variables
        console.log("Gun Changing To Assault Rifle...");
        currentGun = "assaultRifle";
        currentBulletSpeed = GUNS[currentGun].bulletSpeed;
        currentGunAmmo = GUNS[currentGun].ammo;
        currentGunImgLeft = assaultRifleLeft;
        currentGunImgRight = assaultRifleRight;
        currentGunImg.image = (currentGunImgRight);
    }

    if (currentGunAmmo <= 0) {
        if (canReload === true) {
            console.log("Gun is out of ammo");
            console.log("Reloading...");
            canReload = false;
            ammoText.innerText = ("Reloading..");
            RELOAD_SOUND.volume = 0.4;
            RELOAD_SOUND.playbackRate = 1.2;
            RELOAD_SOUND.play();

            setTimeout(() => {
                currentGunAmmo = GUNS[currentGun].ammo;
                ammoText.innerText = ("Ammo: " + currentGunAmmo + "/" + (GUNS[currentGun].ammo));
                canReload = true;
            }, 5000);
        }
    }

    if (mouse.presses()) { // Check if player clicks, if so then shoot gun
        if (currentGunAmmo > 0) {
            console.log("Gun Fired...");
            let bullet = new bulletsGroup.Sprite();
            bullet.collider = "none";
            bullet.x = gun.x;
            bullet.y = gun.y;
            bullet.direction = bullet.angleTo(mouse);
            bullet.speed = currentBulletSpeed;
            currentGunAmmo = currentGunAmmo - 1;
            //shootSound = new Audio("./assets/shootSound.mp3"); // Must load here in order to avoid overriding
            const shootUrl = new URL('./assets/shootSound.mp3', import.meta.url).href;
            const shootSound = new Audio(shootUrl);
            shootSound.volume = 0.3;
            shootSound.play();
            ammoText.innerText = ("Ammo: " + currentGunAmmo + "/" + (GUNS[currentGun].ammo));
        }
    }
}

/*******************************************************/
// updatePositioning()
// Called by draw() every 60th of a second
// Updates sprite positioning and mouse positioning
// Input: N/A
// Output: N/A
/*******************************************************/
function updatePositioning() {
    playerShadow.x = player.x - 1;
    playerShadow.y = player.y + 11;

    gun.x = player.x;
    gun.y = player.y + 11;

    mousePosition = {
        x: mouse.x - gun.x,
        y: mouse.y - gun.y
    };

    mouseAngle = Math.atan2(mousePosition.y, mousePosition.x) * (180 / Math.PI); // Make the mouseAngle different depending on where the mousePosition is

    if (mouseAngle > 90 || mouseAngle < -90) { // Make image change depending on what the angle is
        gun.image = currentGunImgLeft;
        player.image = (playerImgLeft);
    } else {
        gun.image = currentGunImgRight;
        player.image = (playerImgRight);
    }

    gun.rotation = mouseAngle;

    if (kb.pressing('left')) { // Check for player movement inputs and make other things follow accordingly
        player.vel.x = -PLAYER_SPEED;
        playerShadow.vel.x = -PLAYER_SPEED;
    } else if (kb.pressing('right')) {
        player.vel.x = PLAYER_SPEED;
        playerShadow.vel.x = PLAYER_SPEED;
    };

    if (kb.released('left')) {
        player.vel.x = 0;
        playerShadow.vel.x = 0;
    } else if (kb.released('right')) {
        player.vel.x = 0;
        playerShadow.vel.x = 0;
    }

    if (kb.pressing('up')) {
        player.vel.y = -PLAYER_SPEED;
        playerShadow.vel.y = -PLAYER_SPEED;
    } else if (kb.pressing('down')) {
        player.vel.y = PLAYER_SPEED;
        playerShadow.vel.y = PLAYER_SPEED;
    };

    if (kb.released('up')) {
        player.vel.y = 0;
        playerShadow.vel.y = 0;
    } else if (kb.released('down')) {
        player.vel.y = 0;
        playerShadow.vel.y = 0;
    }
}

/*******************************************************/
// updateZombies()
// Called by draw() every 60th of a second
// Update zombie positioning and neccesary variables due to events, e.g zombie death or zombie damage
// Input: N/A
// Output: N/A
/*******************************************************/
function updateZombies() {
    for (let i = 0; i < zombieGroup.length; i++) {
        zombieGroup[i].moveTowards(player, ZOMBIE_SPEED) // Makes zombies move towards player at current speed of zombies
        for (let j = 0; j < bulletsGroup.length; j++) {
            if (zombieGroup[i].overlapping(bulletsGroup[j])) { // Checks if bullet hits zombie
                zombieGroup[i].remove(); // If bullet hits, remove zombie, remove bullet, and add 1 to kill counter
                bulletsGroup[j].remove();
                kills = kills + 1;
            }
        }
    }

    for (let zombie of zombieGroup) {
        if (zombie.overlapping(player)) { // Checks if a zombie is overlapping the player
            playerHealth = playerHealth - zombieDamage; // If so, removes health, scales and positions health bar fill
            healthBarFill.scale.x = playerHealth / 100;
            healthBarFill.x = healthBarFill.x - 0.05;
        }
    }

    if (playerHealth <= 0) { // Checks if player has lost all of their health
        console.log("Player Dead, Running End Screen Function...");
        endScreen();
    }  
}

/*******************************************************/
// checkOverlapping()
// Called by draw() every 60th of a second
// Removes bullets and consumables during neccesary times, e.g bullet hits wall
// Input: N/A
// Output: N/A
/*******************************************************/
function checkOverlapping() {
    for (let wall of wallGroup) {
        for (let bullet of bulletsGroup) {
            if (bullet.overlapping(wall)) { // Checks if bullet hits a wall
                console.log("Bullet Hit Wall...");
                bullet.remove(); // Removes bullet if it hits a wall
            }
        }
    }

    for (let consumable of consumablesGroup) { // Currently does nothing
        if (player.overlapping(consumable)) {
            if (playerHealth < 100) {
                consumable.remove();
                playerHealth = MAX_PLAYER_HEALTH;
                healthBarFill.scale.x = 1;
                healthBarFill.x = 55;
                healthSound = new Audio("/games/zg/assets/healthSound.mp3"); // Must load here in order to avoid overriding
                healthSound.volume = 0.3;
                healthSound.play();
            }
        }
    }
}

/*******************************************************/
// draw()
// Called every 60th of a second
// Draw loop
// Input: N/A
// Output: N/A
/*******************************************************/
function draw() {
    background("black");
    updateStats();
    updateGun();
    updatePositioning();
    updateZombies();
    checkOverlapping();
    if (playerHealth <= 0) {
        noLoop();
    }
}

/*******************************************************/
//  END OF APP
/*******************************************************/
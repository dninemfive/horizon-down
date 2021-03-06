/*
    HORIZON DOWN
    By: Graydon, Lucas, Vika
    Completed on 3 May 2021

    Creative tilt:
        Technical:
            We use a dynamic set to update the obstacles, allowing an unlimited number of obstacles onscreen without memory leaks as obstacles are deleted as soon as they
            leave the screen (play.js l207, 142-3). Similarly, the collectibles in the game are simply obstacles with a different effect when collided with ("", l150-2).
            Both the main menu and the play screen are in the same Scene class in order to make the animated transition between one and the other smoother, and a JS object
            was used to simulate enums from other languages in order to control game state (main.js l29-34, play.js l75-85, &c). I'm proud of the relatively elegant way
            these particular systems are handled, though the code could definitely be way more readable if refactored.
        Artistic:
                The music and the art have pieced together a theme that we did not originally intend to create, but the decision to have a set music style and lore tremendously
            helped generate a fun world for players to experience. As the artist, I am particularly proud of the second level assets of the Core interior, as I believe the
            second level to be a nice contrast to the brightness of the first.
                The music was meant to evoke a driving intensity to add interest and a sensation of levity to the game. Somewhere between spy thriller and coffee house, the
            jazz-rock score is fully composed original music, made in the open source Musescore 3. It's about 72 measures long and features five voices: Trumpet, Tenor Sax,
            Trombone, Bass, and Drums. It was heavily inspired by the work of Gordon Goodwin's Big Phat Band, particularly their smash hit "The Jazz Police," which, if you 
            listen to carefully, you can hear that I lifted two bars of melody from. Creating the music was a surprisingly intense process that took a lot out of me, but I am 
            proud to have officially written my first game score, even if it is small and... let's say 'unnecessarily dissonant.'

*/
let config = {
    type: Phaser.CANVAS,
    width: 1000,
    height: 750,
    scene: [Play, Lose, Lore],
    autoCenter: Phaser.CENTER_HORIZONTALLY
};
let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyLEFT, keyRIGHT; // globals so that player.update() can access them

// basically an enum
let STATES = { MAIN: 0, TRANSITION: 1, GAME: 2 };
// Stores the current game state.
// MAIN is basically the old main menu scene, with the titles and stuff.
// GAME is the old play scene, with no title text and all the game objects spawning
// TRANSITION transitions from MAIN to GAME, fading out the title and moving the player in from the top
let state = STATES.MAIN;
let score = 0;
let highScore = 0;

// global settings
let playerScale = 0.225,
    wallScale = 0.2,
    initialFallSpeed = 10,         // minimum and initial fall speed
    fallSpeedIncrease = 1.1,       // how much the player's fall speed increases each time an obstacle spawns, as a factor of their current speed
    maxFallSpeed = 35,
    playerAcceleration = 0.5,
    playerDeceleration = 50,        // __divisor__ for player deceleration (higher values = less deceleration)
    playerMaxSpeed = 3,             // max player velocity
    obstacleSpawnPeriod = 500,      // approximately how many update() calls between obstacle spawn. affected by randomness.
    playerStartPos = 0.333,         // vertical location of the player, as a proportion of screen height; also max player health
    obstacleDamage = 0.111,         // amount of damage the player takes from obstacles
    fallSpeedDamage = 2,            // how much the player's speed is divided when hitting an obstacle. will never fall below the initial fall speed
    playerHealthPerTick = 0.00005,  // amount the player heals each tick
    backgroundScaleFactor = 0.0001, // modifies the amount the background moves, for parallax purposes
    blackoutFadeout = 0.02,         // how much (as a proportion of 100%) the blackout frame fades per tick
    obstacleDelay = 300,            // how long, in ticks, before the obstacle counter begins
    pointsPerObstacle = 100,        // how many points you get per obstacle. Multiplied by the log of the player's current speed.
                                    // The player also loses this much score (not multiplied by the log) when hitting an obstacle (min 0)
    obstacleWidthScale = wallScale * 1.6,
    obstacleOffset = 250,           // amount obstacles are guaranteed to stick out of the wall, so they don't disappear completely
    collectibleSpawnChance = 50,    // each time an obstacle spawns there's a 1 in this chance to spawn a collectible at the same time
    collectibleScore = 1500;        // amount of score you get for collecting collectibles

// if we make this a global we don't have to copy this to multiple contexts >.>
let textConfigWhite = {
    fontFamily: "Century Gothic",
    fontSize: "28px",
    backgroundColor: "#00000000",
    color: "#FFFFFF",
    align: "right",
    padding: { top: 5, bottom: 5 },
    fixedWidth: 0
}
let textConfigBlack = {
    fontFamily: "Century Gothic",
    fontSize: "28px",
    backgroundColor: "#00000000", // transparent
    color: "#000000",
    align: "right",
    padding: { top: 5, bottom: 5 },
    fixedWidth: 0
}
let textConfigDebug = {
    fontFamily: "Century Gothic",
    fontSize: "28px",
    backgroundColor: "#e8bc4e", // from the side walls
    color: "#000000",
    align: "left",
    padding: { top: 5, bottom: 5, right: 10, left: 10 },
    fixedWidth: 0
}
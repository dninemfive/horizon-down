let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 540,
    scene: [Menu, Play, Lose, Lore],
    autoCenter: Phaser.CENTER_HORIZONTALLY
};
let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyLEFT, keyRIGHT; // globals so that player.update() can access them

// global settings
let playerScale = 0.15,
    wallScale = 0.2,
    startingFallSpeed = 10,         // minimum and initial fall speed
    fallSpeedIncrease = 1.1,          // how much the player's fall speed increases each time an obstacle spawns, as a factor of their current speed
    playerAcceleration = 0.5,
    playerDeceleration = 50,        // __divisor__ for player deceleration (higher values = less deceleration)
    playerMaxSpeed = 3,             // max player velocity
    obstacleSpawnPeriod = 500,      // approximately how many update() calls between obstacle spawn. affected by randomness.
    playerStartPos = 0.666,         // vertical location of the player, as a proportion of screen height; also max player health
    obstacleDamage = 0.333,         // amount of damage the player takes from obstacles
    fallSpeedDamage = 5,            // how much the player slows down when hitting an obstacle. will never fall below the initial fall speed
    playerHealthPerTick = 0.001,    // amount the player heals each tick
    backgroundScaleFactor = 0.01;   // modifies the amount the background moves, for parallax purposes

// if we make this a global we don't have to copy this to multiple contexts >.>
let textConfig = {
    fontFamily: "Courier",
    fontSize: "28px",
    backgroundColor: "#F3B141",
    color: "#843605",
    align: "right",
    padding: { top: 5, bottom: 5 },
    fixedWidth: 0
}
let mainMenuConfig = {
    fontFamily: "Century Gothic",
    fontSize: "50px",
    backgroundColor: "#00000000", // transparent
    color: "#000000",
    align: "right",
    padding: { top: 5, bottom: 5 },
    fixedWidth: 0
}
let menuConfig = {
    fontFamily: "Courier",
    fontSize: "28px",
    backgroundColor: "#00FF00",
    color: "#000000",
    align: "right",
    padding: { top: 5, bottom: 5 },
    fixedWidth: 0
}
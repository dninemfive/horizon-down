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
let playerScale = 0.1,
    wallScale = 0.2,
    fallSpeed = 3,
    playerStartPos = 0.3, // vertical location of the player, as a proportion of screen height
    backgroundScaleFactor = 0.9; // modifies the amount the background moves, for parallax purposes

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
let menuConfig = {
    fontFamily: "Courier",
    fontSize: "28px",
    backgroundColor: "#00FF00",
    color: "#000000",
    align: "right",
    padding: { top: 5, bottom: 5 },
    fixedWidth: 0
}
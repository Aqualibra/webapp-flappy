// the functions associated with preload, create and update.
var actions = { preload: preload, create: create, update: update };
// the Game object used by the phaser.io library
var game = new Phaser.Game(790, 400, Phaser.AUTO, "game", actions);
// Loads all resources for the game and gives them names.
function preload() {
    // make image file available to game and associate with alias playerImg
    game.load.image("playerImg","../assets/jamesBond.gif");
}

// Initialises the game. This function is only called once.
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#F3D3A3");
    // add welcome text
    game.add.text(20, 20, "Welcome to my game",
        {font: "30px Arial", fill: "#FFFFFF"});
    // add image associated with player
    game.add.sprite(80, 200, "playerImg");
}

// This function updates the scene. It is called for every new frame.
function update() {
}
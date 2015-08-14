var actions = { preload: preload, create: create, update: update };
var splashDisplay = []
var game = new Phaser.Game(700, 400, Phaser.AUTO, "game", actions);
var score = 0;
var labelScore;
var player;
var pipes = [];
var pipeInterval = 1.75;
var gapSize = 100;
var gapMargin = 30;
var blockHeight = 70;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var balloons = [];
var weight = [];
var arr = ["zero", "one", "two", "three", "four"];
console.log(arr[3]);
arr.splice(2, 1);
console.log(arr[3]);
console.log(arr[2]);
console.log(arr);

var arr = ["zero", "one", "two", "three", "four"];
//for(var i = 0; i < arr.length; i++){
//    console.log(arr + " " + i + "th is " + arr[i]);
//    arr.splice(i, 1);
//}

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + " (" +
    jQuery("#email").val() + "): " + jQuery("#score").val() + "</p>");
    event_details.preventDefault();
});


$.get("/score", function(data){
    var scores = JSON.parse(data);
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append("<li>" + scores[i].name + ": " +
        scores[i].score + "</li>");
    }
});

function preload() {
    game.load.image("backgroundImg", "../assets/sky.gif");
    game.load.image("playerImg","../assets/channing.gif");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe","../assets/pipe_blue.gif");
    game.load.image("balloons","../assets/heart.gif");
    game.load.image("weight","../assets/brokenheart.gif");
}

function start()
{
    splashDisplay.destroy();
    player.body.gravity.y = 200;

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);
    player.anchor.setTo(0.5, 0.5);

    //game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
}
function create() {

    game.stage.setBackgroundColor();
    game.add.image(0, 0, "backgroundImg");
    game.add.text(20, 20, "CHANNING AWAITS...",
        {font: "30px Stencil Std", fill: "#FFFFFF"});
    player = game.add.sprite(80, 200, "playerImg");

    labelScore = game.add.text(20, 60, "0",
        {font: "30px Stencil Std", fill: "#FFFFFF"});

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);

    splashDisplay = game.add.text(175,150, "Press ENTER to start,\n   SPACEBAR to jump", {font: "30px Stencil Std", fill: "#FFFFFF"});
}


function update() {
    player.rotation = Math.atan(player.body.velocity.y / 200);
    game.physics.arcade .overlap(player, pipes, gameOver);
    if(player.body.y < 0 || player.body.y > 400){
        gameOver();
    }
    for(var i=balloons.length - 1; i >= 0; i--){

        game.physics.arcade.overlap(player,balloons[i], function(){
            for(var i=balloons.length - 1; i>=0; i--){
                game.physics.arcade.overlap(player,balloons[i], function(){

                    changeGravity(-100);
                    balloons[i].destroy();
                    balloons.splice(i,1);

                });
            }


        });


    }
    for(var i=weight.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,weight[i], function(){

            changeGravity(100);
            weight[i].destroy();
            weight.splice(i,1);

        });
    }

    game.physics.arcade.overlap(player, pipes, function(){
        score = 0;
        game.paused = true;
        $("#greeting-form").show();
    });


}

function addPipeBlock(x, y) {
    var pipe = game.add.sprite(x,y,"pipe");
    pipes.push(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for(var y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    for(var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    changeScore();
}

function playerJump() {
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(function () {
            player.body.velocity.y = - jumpPower;
        });
}

function changeScore() {
    score++;
    labelScore.setText(score.toString());
}

function gameOver() {
    game.destroy();
    $("#score").val(score);
    $("#greeting").show();
    game.state.restart();
    gameGravity = 200;
    game.physics.arcade.overlap(player, pipes, function(){
        score = 0;
        game.paused = true;
        $("#greeting-form").show();
    });
}


function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}


function generateBalloons(){
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}

function generateWeight(){
    var bonus = game.add.sprite(width, 0, "weight");
    weight.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = game.rnd.integerInRange(60,100);
}




function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
}



//function nameOfTheFunction(parameterOne, parameterTwo) {
//    //do stuff here 2
//}
//
//nameOfTheFunction(argumentOne, argumentTwo);
//



function checkBonus(bonusArray, bonusEffect){
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,bonusArray[i], function(){
            changeGravity(bonusEffect);
            bonusArray[i].destroy();
            bonusArray.splice(i,1);
        });
    }
}





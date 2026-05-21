const config = {

    type: Phaser.AUTO,

    width: 960,
    height: 540,

    pixelArt: true,

    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let slimes;

function preload(){

    this.load.image(
        "grass",
        "assets/grass.png"
    );

    this.load.image(
        "tree",
        "assets/tree.png"
    );

    this.load.image(
        "player",
        "assets/player.png"
    );

    this.load.image(
        "slime",
        "assets/slime.png"
    );

    this.load.image(
        "mage",
        "assets/mage.png"
    );

    this.load.image(
        "portal",
        "assets/portal.png"
    );
}

function create(){

    for(let y=0;y<12;y++){

        for(let x=0;x<20;x++){

            this.add.image(
                x*48+24,
                y*48+24,
                "grass"
            );
        }
    }

    player =
        this.physics.add.sprite(
            100,
            100,
            "player"
        );

    player.setCollideWorldBounds(
        true
    );

    this.add.image(
        300,
        150,
        "mage"
    );

    slimes =
        this.physics.add.group();

    slimes.create(
        500,
        200,
        "slime"
    );

    slimes.create(
        650,
        300,
        "slime"
    );

    slimes.create(
        750,
        180,
        "slime"
    );

    cursors =
        this.input.keyboard.createCursorKeys();

    this.input.keyboard.on(
        "keydown-SPACE",
        () => {

            slimes.children.iterate(
                slime => {

                    if(!slime.active)
                        return;

                    const dist =
                        Phaser.Math.Distance.Between(
                            player.x,
                            player.y,
                            slime.x,
                            slime.y
                        );

                    if(dist < 70){

                        slime.destroy();
                    }
                }
            );
        }
    );
}

function update(){

    player.setVelocity(
        0
    );

    const speed = 180;

    if(cursors.left.isDown){

        player.setVelocityX(
            -speed
        );
    }

    if(cursors.right.isDown){

        player.setVelocityX(
            speed
        );
    }

    if(cursors.up.isDown){

        player.setVelocityY(
            -speed
        );
    }

    if(cursors.down.isDown){

        player.setVelocityY(
            speed
        );
    }
}
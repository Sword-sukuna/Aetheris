const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#1d2b53",

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
let spaceKey;

function preload() {
    this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
    this.load.image("slime", "https://labs.phaser.io/assets/sprites/slug.png");
    this.load.image("tile", "https://labs.phaser.io/assets/textures/grass.png");
}

function create() {

    // chão simples
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
            this.add.image(x * 32, y * 32, "tile").setOrigin(0);
        }
    }

    // player
    player = this.physics.add.sprite(100, 100, "player");
    player.setScale(2);

    // slimes
    slimes = this.physics.add.group();

    slimes.create(300, 200, "slime").setScale(1.5);
    slimes.create(500, 300, "slime").setScale(1.5);
    slimes.create(700, 150, "slime").setScale(1.5);

    // controles
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {

    const speed = 200;

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
    }

    if (cursors.right.isDown) {
        player.setVelocityX(speed);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
    }

    if (cursors.down.isDown) {
        player.setVelocityY(speed);
    }

    // ataque (SPACE)
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {

        slimes.children.iterate(slime => {

            if (!slime) return;

            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                slime.x, slime.y
            );

            if (dist < 80) {
                slime.destroy();
            }
        });
    }
}
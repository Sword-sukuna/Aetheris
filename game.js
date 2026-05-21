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
let spaceKey;
let slimes;

const TILE = 32;

function preload() {
    this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
    this.load.image("slime", "https://labs.phaser.io/assets/sprites/slug.png");
    this.load.image("tile", "https://labs.phaser.io/assets/textures/grass.png");
}

function create() {

    // câmera suave seguindo player
    this.cameras.main.setBounds(0, 0, 2000, 2000);

    // chão (grid organizado)
    for (let y = 0; y < 40; y++) {
        for (let x = 0; x < 60; x++) {
            this.add.image(x * TILE, y * TILE, "tile")
                .setOrigin(0)
                .setAlpha(0.9);
        }
    }

    // player centralizado no mundo
    player = this.physics.add.sprite(400, 300, "player");
    player.setScale(1.6);
    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    // slimes
    slimes = this.physics.add.group();

    for (let i = 0; i < 6; i++) {
        let slime = slimes.create(
            300 + i * 120,
            200 + (i % 2) * 120,
            "slime"
        );

        slime.hp = 3;
        slime.setScale(1.4);
        slime.setTint(0x88ff88);
    }

    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {

    const speed = 220;

    player.setVelocity(0);

    if (cursors.left.isDown) player.setVelocityX(-speed);
    if (cursors.right.isDown) player.setVelocityX(speed);
    if (cursors.up.isDown) player.setVelocityY(-speed);
    if (cursors.down.isDown) player.setVelocityY(speed);

    // ataque mais RPG
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {

        let hit = false;

        slimes.children.iterate(slime => {

            if (!slime) return;

            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                slime.x, slime.y
            );

            if (dist < 70) {

                slime.hp--;

                // feedback visual
                slime.setTint(0xff5555);

                this.time.delayedCall(120, () => {
                    if (slime && slime.active) {
                        slime.setTint(0x88ff88);
                    }
                });

                hit = true;

                if (slime.hp <= 0) {

                    this.tweens.add({
                        targets: slime,
                        alpha: 0,
                        scale: 0,
                        duration: 200,
                        onComplete: () => slime.destroy()
                    });
                }
            }
        });

        if (!hit) {
            player.setTint(0xff4444);

            this.time.delayedCall(100, () => {
                player.clearTint();
            });
        }
    }
}
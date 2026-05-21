const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE = 48;

// ================= MAPAS =================
const MAPS = {
    city: [
        "####################",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "#..................#",
        "####################"
    ],
    forest: [
        "####################",
        "#..................#",
        "#....######........#",
        "#..................#",
        "#......####........#",
        "#..................#",
        "#..........####....#",
        "####################"
    ]
};

let currentMap = "city";

// ================= PLAYER =================
const player = {
    x: 2,
    y: 2,
    hp: 100,
    maxHp: 100,
    attack: 10,
    xp: 0,
    level: 1,
    gold: 0,
    color: "#4da6ff"
};

// ================= NPC =================
const npcs = [
    {
        x: 5,
        y: 3,
        name: "Velho Mago",
        dialog: ["Bem-vindo a Aetheris jovem aventureiro!"]
    }
];

// ================= SLIMES =================
const slimes = [
    { x: 8, y: 3, hp: 3, dead: false },
    { x: 12, y: 5, hp: 3, dead: false },
    { x: 15, y: 2, hp: 3, dead: false }
];

// ================= QUEST =================
let quest = {
    active: false,
    kills: 0,
    target: 3,
    completed: false
};

// ================= INPUT =================
const keys = {};
let dialogOpen = false;
let dialogText = "";

// ================= EVENTOS =================
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === "e") handleNPC();
    if (e.code === "Space") attack();
    if (key === "escape") dialogOpen = false;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ================= MOVIMENTO =================
function update() {
    if (dialogOpen) return;

    let nx = player.x;
    let ny = player.y;

    if (keys["w"]) ny--;
    if (keys["s"]) ny++;
    if (keys["a"]) nx--;
    if (keys["d"]) nx++;

    if (!isWall(nx, ny)) {
        player.x = nx;
        player.y = ny;
    }

    // portal cidade → floresta
    if (currentMap === "city" && player.x === 18 && player.y === 6) {
        currentMap = "forest";
        player.x = 2;
        player.y = 2;
    }
}

// ================= COLISÃO =================
function isWall(x, y) {
    const map = MAPS[currentMap];

    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length)
        return true;

    return map[y][x] === "#";
}

// ================= ATAQUE =================
function attack() {
    if (currentMap !== "forest") return;

    for (const s of slimes) {
        if (s.dead) continue;

        const dx = Math.abs(player.x - s.x);
        const dy = Math.abs(player.y - s.y);

        if (dx <= 1 && dy <= 1) {
            s.hp -= player.attack;

            if (s.hp <= 0) {
                s.dead = true;
                quest.kills++;

                gainXP(10);
                checkQuest();

                showMessage("Slime derrotado!");
            }
            break;
        }
    }
}

// ================= XP =================
function gainXP(amount) {
    player.xp += amount;

    const need = player.level * 30;

    if (player.xp >= need) {
        player.xp -= need;
        player.level++;
        player.maxHp += 20;
        player.hp = player.maxHp;
        player.attack += 2;

        showMessage("LEVEL UP! Lv " + player.level);
    }
}

// ================= QUEST =================
function checkQuest() {
    if (!quest.active || quest.completed) return;

    if (quest.kills >= quest.target) {
        quest.completed = true;
        gainXP(50);
        player.gold += 50;

        showMessage("Missão concluída!");
    }
}

// ================= NPC =================
function handleNPC() {
    for (const n of npcs) {
        const dx = Math.abs(player.x - n.x);
        const dy = Math.abs(player.y - n.y);

        if (dx <= 1 && dy <= 1) {
            dialogOpen = true;

            if (!quest.active) {
                quest.active = true;
                dialogText = "Derrote 3 slimes na floresta.";
            } else if (quest.completed) {
                dialogText = "Obrigado herói!";
            } else {
                dialogText = `Progresso: ${quest.kills}/${quest.target}`;
            }
        }
    }
}

// ================= DRAW MAP =================
function drawMap() {
    const map = MAPS[currentMap];

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            ctx.fillStyle = map[y][x] === "#"
                ? "#1f4d3a"
                : "#2ecc71";

            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
    }
}

// ================= DRAW =================
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(
        player.x * TILE + 10,
        player.y * TILE + 10,
        TILE - 20,
        TILE - 20
    );
}

function drawSlimes() {
    if (currentMap !== "forest") return;

    for (const s of slimes) {
        if (s.dead) continue;

        ctx.fillStyle = "lime";
        ctx.fillRect(
            s.x * TILE + 10,
            s.y * TILE + 10,
            TILE - 20,
            TILE - 20
        );
    }
}

function drawNPCs() {
    if (currentMap !== "city") return;

    for (const n of npcs) {
        ctx.fillStyle = "orange";
        ctx.fillRect(
            n.x * TILE + 10,
            n.y * TILE + 10,
            TILE - 20,
            TILE - 20
        );
    }
}

function drawHUD() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    ctx.fillText("Lv: " + player.level, 20, 30);
    ctx.fillText("XP: " + player.xp, 20, 55);
    ctx.fillText("HP: " + player.hp, 20, 80);
    ctx.fillText("Gold: " + player.gold, 20, 105);
}

function drawDialog() {
    if (!dialogOpen) return;

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(50, canvas.height - 160, canvas.width - 100, 100);

    ctx.fillStyle = "white";
    ctx.fillText(dialogText, 80, canvas.height - 120);
}

// ================= MESSAGE =================
let msg = "";
let msgTimer = 0;

function showMessage(t) {
    msg = t;
    msgTimer = 120;
}

function drawMessage() {
    if (msgTimer <= 0) return;

    ctx.fillStyle = "black";
    ctx.fillRect(20, canvas.height - 70, 300, 30);

    ctx.fillStyle = "white";
    ctx.fillText(msg, 30, canvas.height - 50);

    msgTimer--;
}

// ================= LOOP =================
function loop() {
    update();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawSlimes();
    drawNPCs();
    drawPlayer();
    drawHUD();
    drawDialog();
    drawMessage();

    requestAnimationFrame(loop);
}

loop();
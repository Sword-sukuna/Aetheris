const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE = 48;

// ======================
// MAPAS
// ======================

const CITY_MAP = [
"####################",
"#..................#",
"#..................#",
"#..................#",
"#..................#",
"#..................#",
"#..................#",
"####################"
];

const FOREST_MAP = [
"####################",
"#..................#",
"#....######........#",
"#..................#",
"#......####........#",
"#..................#",
"#..........####....#",
"#..................#",
"####################"
];

const maps = {
    city: CITY_MAP,
    forest: FOREST_MAP
};

let currentMap = "city";

// ======================
// PLAYER
// ======================

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

// ======================
// QUEST
// ======================

const quest = {
    active: false,
    kills: 0,
    target: 3,
    completed: false
};

// ======================
// NPC
// ======================

const npcs = [
{
    x:5,
    y:3,
    name:"Velho Mago"
}
];

// ======================
// PORTAL
// ======================

const portal = {
    x:18,
    y:6
};

// ======================
// MONSTROS
// ======================

const slimes = [
{
    x:8,
    y:3,
    hp:20,
    dead:false
},
{
    x:12,
    y:5,
    hp:20,
    dead:false
},
{
    x:15,
    y:2,
    hp:20,
    dead:false
}
];

// ======================
// INPUT
// ======================

const keys = {};

document.addEventListener("keydown",(e)=>{

    const key = e.key.toLowerCase();

    keys[key] = true;

    if(e.code === "Space"){
        attack();
    }

    if(key === "e"){
        interactNPC();
    }

    if(key === "escape"){
        dialogOpen = false;
    }

});

document.addEventListener("keyup",(e)=>{

    keys[e.key.toLowerCase()] = false;

});

// ======================
// DIALOGO
// ======================

let dialogOpen = false;
let dialogText = "";

// ======================
// MENSAGENS
// ======================

let message = "";
let messageTimer = 0;

function showMessage(text){

    message = text;
    messageTimer = 180;

}

function drawMessage(){

    if(messageTimer <= 0) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        20,
        canvas.height - 70,
        500,
        40
    );

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        message,
        35,
        canvas.height - 42
    );

    messageTimer--;

}

// ======================
// XP
// ======================

function gainXP(amount){

    player.xp += amount;

    const needed =
        player.level * 30;

    if(player.xp >= needed){

        player.xp -= needed;

        player.level++;

        player.maxHp += 20;
        player.hp = player.maxHp;

        player.attack += 2;

        showMessage(
            "LEVEL UP! Nivel " +
            player.level
        );
    }
}

// ======================
// QUEST
// ======================

function checkQuest(){

    if(
        !quest.active ||
        quest.completed
    ) return;

    if(
        quest.kills >=
        quest.target
    ){

        quest.completed = true;

        gainXP(50);

        player.gold += 50;

        showMessage(
            "Missao concluida!"
        );
    }
}

// ======================
// ATAQUE
// ======================

function attack(){

    if(currentMap !== "forest")
        return;

    for(const slime of slimes){

        if(slime.dead)
            continue;

        const dx =
            Math.abs(player.x - slime.x);

        const dy =
            Math.abs(player.y - slime.y);

        if(dx <= 1 && dy <= 1){

            slime.hp -= player.attack;

            if(slime.hp <= 0){

                slime.dead = true;

                gainXP(10);

                player.gold += 5;

                quest.kills++;

                checkQuest();

                showMessage(
                    "Slime derrotado!"
                );

            }else{

                showMessage(
                    "Dano causado!"
                );
            }

            break;
        }
    }
}

// ======================
// NPC
// ======================

function interactNPC(){

    for(const npc of npcs){

        const dx =
            Math.abs(player.x - npc.x);

        const dy =
            Math.abs(player.y - npc.y);

        if(dx <= 1 && dy <= 1){

            dialogOpen = true;

            if(!quest.active){

                quest.active = true;

                dialogText =
                    "Derrote 3 slimes na floresta.";

            }else if(quest.completed){

                dialogText =
                    "Obrigado heroi!";

            }else{

                dialogText =
                    "Progresso: " +
                    quest.kills +
                    "/" +
                    quest.target;
            }
        }
    }
}

// ======================
// COLISAO
// ======================

function isWall(x,y){

    const map =
        maps[currentMap];

    if(
        y < 0 ||
        y >= map.length ||
        x < 0 ||
        x >= map[0].length
    ){
        return true;
    }

    return map[y][x] === "#";

}

// ======================
// UPDATE
// ======================

function update(){

    if(dialogOpen)
        return;

    let nx = player.x;
    let ny = player.y;

    if(keys["w"]) ny--;
    if(keys["s"]) ny++;
    if(keys["a"]) nx--;
    if(keys["d"]) nx++;

    if(!isWall(nx,ny)){

        player.x = nx;
        player.y = ny;

    }

    keys["w"] = false;
    keys["s"] = false;
    keys["a"] = false;
    keys["d"] = false;

    updateSlimes();

}

// ======================
// IA DOS SLIMES
// ======================

function updateSlimes(){

    if(currentMap !== "forest")
        return;

    for(const slime of slimes){

        if(slime.dead)
            continue;

        const dx =
            Math.abs(player.x - slime.x);

        const dy =
            Math.abs(player.y - slime.y);

        if(dx <= 1 && dy <= 1){

            player.hp -= 0.2;

            if(player.hp <= 0){

                gameOver();

            }
        }
    }
}

// ======================
// GAME OVER
// ======================

function gameOver(){

    alert("GAME OVER");

    location.reload();

}

// ======================
// DESENHO
// ======================

function drawMap(){

    const map =
        maps[currentMap];

    for(let y=0;y<map.length;y++){

        for(let x=0;x<map[y].length;x++){

            const tile =
                map[y][x];

            ctx.fillStyle =
                tile === "#"
                ? "#2d6a4f"
                : "#74c69d";

            ctx.fillRect(
                x*TILE,
                y*TILE,
                TILE,
                TILE
            );

            ctx.strokeStyle =
                "#00000022";

            ctx.strokeRect(
                x*TILE,
                y*TILE,
                TILE,
                TILE
            );
        }
    }
}

function drawPlayer(){

    ctx.fillStyle =
        player.color;

    ctx.fillRect(
        player.x*TILE+8,
        player.y*TILE+8,
        TILE-16,
        TILE-16
    );

}

function drawPortal(){

    if(currentMap !== "city")
        return;

    ctx.fillStyle =
        "purple";

    ctx.fillRect(
        portal.x*TILE+8,
        portal.y*TILE+8,
        TILE-16,
        TILE-16
    );

}

function drawNPCs(){

    if(currentMap !== "city")
        return;

    for(const npc of npcs){

        ctx.fillStyle =
            "orange";

        ctx.fillRect(
            npc.x*TILE+8,
            npc.y*TILE+8,
            TILE-16,
            TILE-16
        );
    }
}

function drawSlimes(){

    if(currentMap !== "forest")
        return;

    for(const slime of slimes){

        if(slime.dead)
            continue;

        ctx.fillStyle =
            "lime";

        ctx.fillRect(
            slime.x*TILE+8,
            slime.y*TILE+8,
            TILE-16,
            TILE-16
        );

        ctx.fillStyle =
            "white";

        ctx.font =
            "14px Arial";

        ctx.fillText(
            "HP:"+slime.hp,
            slime.x*TILE,
            slime.y*TILE-5
        );
    }
}

function drawDialog(){

    if(!dialogOpen)
        return;

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        50,
        canvas.height-180,
        canvas.width-100,
        120
    );

    ctx.strokeStyle =
        "white";

    ctx.strokeRect(
        50,
        canvas.height-180,
        canvas.width-100,
        120
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        dialogText,
        80,
        canvas.height-120
    );
}

function drawHUD(){

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Nivel: " +
        player.level,
        20,
        30
    );

    ctx.fillText(
        "XP: " +
        player.xp,
        20,
        60
    );

    ctx.fillText(
        "Gold: " +
        player.gold,
        20,
        90
    );

    ctx.fillText(
        "HP: " +
        Math.floor(player.hp) +
        "/" +
        player.maxHp,
        20,
        120
    );

    if(quest.active){

        ctx.fillText(
            "Quest: " +
            quest.kills +
            "/" +
            quest.target,
            20,
            150
        );
    }
}

// ======================
// LOOP
// ======================

function gameLoop(){

    update();

    if(
        currentMap === "city" &&
        player.x === portal.x &&
        player.y === portal.y
    ){

        currentMap = "forest";

        player.x = 2;
        player.y = 2;

    }

    if(
        currentMap === "forest" &&
        player.x === 1 &&
        player.y === 1
    ){

        currentMap = "city";

        player.x = 17;
        player.y = 6;

    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawMap();
    drawPortal();
    drawNPCs();
    drawSlimes();
    drawPlayer();
    drawHUD();
    drawDialog();
    drawMessage();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
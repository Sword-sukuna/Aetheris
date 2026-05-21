const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE = 48;

const MAP = [
"####################",
"#..................#",
"#..................#",
"#..................#",
"#..................#",
"#..................#",
"#..................#",
"####################"
];

const player = {
    x: 2,
    y: 2,
    color: "#4da6ff"
};

const npcs = [
{
    x:5,
    y:3,
    name:"Velho Mago",
    dialog:[
        "Bem-vindo a Aetheris jovem aventureiro!"
    ]
}
];

const keys = {};

let dialogOpen = false;
let dialogText = "";

document.addEventListener("keydown", e => {

    const key = e.key.toLowerCase();

    keys[key] = true;

    if(key === "e"){

        for(const npc of npcs){

            const dx =
                Math.abs(player.x - npc.x);

            const dy =
                Math.abs(player.y - npc.y);

            if(dx <= 1 && dy <= 1){

                dialogOpen = true;

                dialogText =
                    npc.name +
                    ": " +
                    npc.dialog[0];
            }
        }
    }

    if(key === "escape"){

        dialogOpen = false;
    }
});

document.addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;
});

function isWall(x,y){

    if(
        y < 0 ||
        y >= MAP.length ||
        x < 0 ||
        x >= MAP[0].length
    ){
        return true;
    }

    return MAP[y][x] === "#";
}

function update(){

    if(dialogOpen) return;

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
}

function drawMap(){

    for(let y=0;y<MAP.length;y++){

        for(let x=0;x<MAP[y].length;x++){

            const tile = MAP[y][x];

            if(tile === "#"){

                ctx.fillStyle = "#2d6a4f";

            }else{

                ctx.fillStyle = "#74c69d";
            }

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

function drawNPCs(){

    for(const npc of npcs){

        ctx.fillStyle = "orange";

        ctx.fillRect(
            npc.x*TILE+8,
            npc.y*TILE+8,
            TILE-16,
            TILE-16
        );

        ctx.fillStyle = "black";

        ctx.font = "12px Arial";

        ctx.fillText(
            "NPC",
            npc.x*TILE+8,
            npc.y*TILE
        );
    }
}

function drawInteractionHint(){

    for(const npc of npcs){

        const dx =
            Math.abs(player.x - npc.x);

        const dy =
            Math.abs(player.y - npc.y);

        if(dx <= 1 && dy <= 1){

            ctx.fillStyle =
                "white";

            ctx.font =
                "18px Arial";

            ctx.fillText(
                "[E] Conversar",
                npc.x*TILE-20,
                npc.y*TILE-10
            );
        }
    }
}

function drawDialog(){

    if(!dialogOpen) return;

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        50,
        canvas.height-180,
        canvas.width-100,
        120
    );

    ctx.strokeStyle =
        "#ffffff";

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

    ctx.font =
        "16px Arial";

    ctx.fillText(
        "ESC para fechar",
        80,
        canvas.height-90
    );
}

function gameLoop(){

    update();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawMap();

    drawNPCs();

    drawPlayer();

    drawInteractionHint();

    drawDialog();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
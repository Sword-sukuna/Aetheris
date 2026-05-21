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

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
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

            ctx.strokeStyle = "#00000022";

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

    ctx.fillStyle = player.color;

    ctx.fillRect(
        player.x*TILE+8,
        player.y*TILE+8,
        TILE-16,
        TILE-16
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
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();
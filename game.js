// ==========================
// PLAYER
// ==========================

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

let message = "";
let messageTimer = 0;

function showMessage(text){

    message = text;

    messageTimer = 180;
}

function drawMessage(){

    if(messageTimer <= 0) return;

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        20,
        canvas.height - 80,
        500,
        40
    );

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        message,
        40,
        canvas.height - 50
    );

    messageTimer--;
}

function attack(){

    for(const slime of slimes){

        if(slime.dead) continue;

        const dx =
            Math.abs(
                player.x -
                slime.x
            );

        const dy =
            Math.abs(
                player.y -
                slime.y
            );

        if(dx <= 1 && dy <= 1){

            slime.hp -= player.attack;

            if(slime.hp <= 0){

                slime.dead = true;

                gainXP(10);

                player.gold += 5;

                showMessage(
                    "Slime derrotado!"
                );

                quest.kills++;

                checkQuest();
            }

            break;
        }
    }
}

let quest = {

    active:false,

    kills:0,

    target:3,

    completed:false
};

function checkQuest(){

    if(
        !quest.active ||
        quest.completed
    ) return;

    if(
        quest.kills >=
        quest.target
    ){

        quest.completed =
            true;

        gainXP(50);

        player.gold += 50;

        showMessage(
            "Missao concluida!"
        );
    }
}

if(key === "e"){

    for(const npc of npcs){

        const dx =
            Math.abs(
                player.x -
                npc.x
            );

        const dy =
            Math.abs(
                player.y -
                npc.y
            );

        if(dx <= 1 && dy <= 1){

            dialogOpen =
                true;

            if(!quest.active){

                quest.active =
                    true;

                dialogText =
                    "Derrote 3 slimes.";

            }else if(
                quest.completed
            ){

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

function updateSlimes(){

    if(currentMap !==
       "forest") return;

    for(const slime of slimes){

        if(slime.dead) continue;

        const dx =
            Math.abs(
                player.x -
                slime.x
            );

        const dy =
            Math.abs(
                player.y -
                slime.y
            );

        if(dx <= 1 && dy <= 1){

            player.hp -= 0.1;

            if(player.hp <= 0){

                gameOver();
            }
        }
    }
}

function gameOver(){

    alert(
        "Game Over"
    );

    location.reload();
}

function drawHUD(){

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "Level: " +
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
        Math.floor(player.hp)
        +
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

if(
    currentMap ===
    "forest" &&
    player.x === 1 &&
    player.y === 1
){

    currentMap =
        "city";

    player.x = 17;

    player.y = 6;
}


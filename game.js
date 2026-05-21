const player = document.getElementById("player");

let x = 100;
let y = 100;

document.addEventListener("keydown",(e)=>{

    if(e.key==="w") y -= 10;

    if(e.key==="s") y += 10;

    if(e.key==="a") x -= 10;

    if(e.key==="d") x += 10;

    player.style.left = x + "px";
    player.style.top = y + "px";
});
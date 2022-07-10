const FPS_VALUE = 100;

// makeboard.js → setBoard 내에 isBoard 변수 존재
// player.js → displayTank 함수 존재 (removeTank 와 연결, 움직임은 tankMove, tankRange로 제어)
function game() {
   if (isBoard){
       displayObj(tank);
       displayObj(enemy);
    }
}

document.addEventListener("keydown", function(){
    game();
})
// shoot!
document.addEventListener("keydown", displayBullet);

const start = document.getElementById("start");
const gameBoard = document.querySelector("#game-board");

const board = {
    width : 30,
    height : 30,
    value : 0,
}

const tank ={
    value : 1, // player value 1 
    width : 4,
    height : 4,
    x : Math.floor(board.width/2),
    y : Math.floor(board.height/2)+(board.height/3),
    display : "⁂",
    hp : 1,
}

const bullet = {
    value : -1,
    display : "●",
    x : tank.x,
    y : tank.y - Math.floor(tank.height/2),
    isShoot : false,
}

const enemy = {
    value : 3,
    display : "◈",
    width : 5,
    height : 5,
    x : 10,
    y : 10,
    hp : 5,
}
const SPACE = "ㆍ";
const FPS = "50";
// 좌표체계 및 접근을 위한 Arr 생성 (ES6)
const boardArr = new Array(board.height).fill(board.value).map(()=> new Array(board.width).fill(board.value));

// bullet display
function shootBullet(){
    boardArr[bullet.y][bullet.x] = bullet.value;
    bullet.y -= 1;
    //hit! enemy!
    hitEnemy(bullet.x, bullet.y);
    if (bullet.y == 0){
        bullet.isShoot = false;
        bullet.y = tank.y - Math.floor(tank.height/2);
        bullet.x = tank.x;
	}
}

//hit! and bullet 사라지기!
function hitEnemy(x, y){
    if (y-1 >0) {
    	if (boardArr[y-1][x] == enemy.value){
        	bullet.y = 0;
            enemy.hp -= 1;
    	}
    }
}
// hit my Tank,, ㅜㅜ 
function hitTank(x, y){
    /*
    for(let i=y+Math.floor(tank.height/2); i >= y-Math.floor(tank.height/2); i--){
        for(let j=x-Math.floor(tank.width/2); j <= x+Math.floor(tank.width/2); j++){
    		if (boardArr[y][x] == enemy.value){
        		tank.hp -= 1;
        		if (tank.hp === 0) {
            		console.log('end!');
        		}
    		}
        }
    }*/
    console.log(boardArr[y][x]);
    if (boardArr[y+1][x+1] == enemy.value){
        console.log("nn");
    }
}
// 기체의 변화에 따른 배열 초기화! (tank, enemy, board)
function setTank(x, y, eX, eY){
    for(let i=0; i<board.height; i++){
        for(let j=0; j<board.width; j++){
            if (i <= y+Math.floor(tank.height/2) && i> y-Math.floor(tank.height/2) && j >= x-Math.floor(tank.width/2) && j <x+Math.floor(tank.width/2)){
	            boardArr[i][j] = tank.value;
                // hp 다 닳으면 없어지도록!
            } else if (enemy.hp >0 &&i <= eY + Math.floor(enemy.height/2) && i > eY - Math.floor(enemy.height/2) && j >= eX-Math.floor(enemy.width/2) && j < eX+Math.floor(enemy.width/2)){
                boardArr[i][j] = enemy.value;
                
            } else {
                boardArr[i][j] = board.value;
            }
        }
    }
    hitTank(x, y);
}
// Start Game!
function setBoard(){
    // className 설정으로 CSS 설정 부여 start hidden
    start.className = "hidden";
    // className 설정으로 CSS 설정 미부여 game-board display
    gameBoard.className = "";
    
    for(let i=0; i<board.height; i++){

        const line = document.createElement("p");
        line.id = i;
        if(i===0 || i===board.height-1){
            line.innerText="━".repeat(board.width);
        } else{
            line.innerText = `${SPACE}`.repeat(board.width);
        }
        gameBoard.appendChild(line);
    }
    setInterval(inGame, FPS);
    
}
// 변화에 따른 보드 초기화!
function loadBoard(){
    for(let i=0; i<board.height; i++){
        // board 내 line 생성
        const line = document.getElementById(`${i}`);
        let lineText = "";
        
        if (i===0 || i===board.height-1) {
            //line.innerText="━".repeat(board.width);
        } else {
            
            for(let j=0; j<board.width; j++){
                if (boardArr[i][j] === board.value) {
                    lineText += SPACE;
                } else if (boardArr[i][j] === tank.value){
                    lineText += tank.display;
                } else if (boardArr[i][j] === bullet.value){
                    lineText += bullet.display;
                } else if (boardArr[i][j] === enemy.value){
                    lineText += enemy.display;
                }
            }
        	line.innerText = lineText;
        }
    }
}

// 게임실행
function inGame(){
    setTank(tank.x, tank.y, enemy.x, enemy.y);
    
    // shooting!!
    if (bullet.isShoot){
        shootBullet();
    }
    enemyMove();
    loadBoard();

}

// tank의 움직임!
function tankMove(event){
    
    if (event.keyCode === 38) { //Up
        if (tank.y-Math.floor(tank.height/2) > 0 ){
            tank.y -= 1;
        }
    } else if (event.keyCode === 39) {// right
        if (tank.x+Math.floor(tank.width/2) < board.width){
            tank.x += 1;
        }
    } else if (event.keyCode === 40) {// down
        if (tank.y+Math.floor(tank.height/2) < board.height-2){
            tank.y += 1;
        }
    } else if (event.keyCode === 37) {// left
        if (tank.x-Math.floor(tank.width/2) > 0){
            tank.x -= 1;
        }
    }
}
function tankAttack(event){
    if (event.keyCode === 32){
        bullet.isShoot = true;
    }
}

// enemy의 움직임! // 개빠름
function enemyMove(){
    const movePattern = Math.floor(Math.random()*10 % 4);
    const moveLength = Math.floor(Math.random()*10 % 2) + 1;
    if (movePattern == 0) { //up
        if (enemy.y - Math.floor(enemy.height/2) > 0){
            enemy.y -= moveLength;
        }
    } else if (movePattern == 1) { // right
        if (enemy.x + Math.floor(enemy.width/2) < board.width) {
            enemy.x += moveLength;
        }
    } else if (movePattern == 2) {
        if (enemy.y + Math.floor(enemy.height/2) < board.height-2) {
            enemy.y += moveLength;
        }
    } else if (movePattern == 3) {
        if (enemy.x - Math.floor(enemy.width/2) > 0) {
            enemy.x -= moveLength;
        }
    }
}

// level design // enemy die -> new enemy 
//function level
start.addEventListener("click", setBoard);
document.addEventListener("keydown", tankMove);
document.addEventListener("keydown", tankAttack);
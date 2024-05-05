// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);
// 이미지 불러오기
let spaceImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;
let gameover=false;
let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;
// 총알들을 저장하는 list
let bulletList = [];

function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX+15;
        this.y = spaceshipY;
        this.alive = true;
        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };
    this.checkHit = function(){
        for(let i=0;i<enemyList.length;i++){
            if(
            this.y <= enemyList[i].y &&
            this.x>=enemyList[i].x && 
            this.x <= enemyList[i].x+40
            ){
                score++;
                this.alive = false;
                enemyList.splice(i,1);
            } 
        }
    };
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum
}

let enemyList = [];

function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    };
    this.update = function(){
        this.y += 3;
        if(this.y >= canvas.height - 48){
            gameover = true;
        }
    };
}

function loadImage(){
    spaceImage = new Image();
    spaceImage.src="images/space.jpg";
    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";
    gameoverImage = new Image();
    gameoverImage.src="images/gameover.jpg";
    enemyImage = new Image();
    enemyImage.src="images/enemy.png";
    bulletImage = new Image();
    bulletImage.src="images/bullet.png";
}

let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];
        if(event.keyCode == 32){
            createBullet(); // 총알 생성 함수
        }
    });
}

function createBullet(){
    let b = new Bullet(); // 총알 생성
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },1000);
}

function update() {
    if(39 in keysDown) {
        spaceshipX += 5; // 우주선의 속도
    } // 오른쪽 버튼
    if(37 in keysDown) {
        spaceshipX -= 5;
    } // 왼쪽 버튼
    if(spaceshipX <=0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width-64){
        spaceshipX=canvas.width-64;
    }
    // 총알의 y좌표 업데이트
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            bulletList[i].update();
        bulletList[i].checkHit();
        } 
    }
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(spaceImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText('Score:${score}', 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }   
    }
    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function main(){
    if(!gameover){
        requestAnimationFrame(main);
        update(); // 좌표값 업데이트
        render(); // 그리기
    }
    else{
        ctx.drawImage(gameoverImage, 10, 100, 380, 380)
    }    
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
// 방향키를 누르면 우주선의 xy좌표가 변경되고 다시 render 그리기
// 발사된 총알들은 총알 배열에 저장
// 총알들은 xy좌표가 존재
// 총알 배열을 가지고 
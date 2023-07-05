window.addEventListener("load",(e)=>{

    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    canvas.width = innerWidth * 2;
    canvas.height = innerHeight;

    class Meteor{
        constructor(game){
            this.game = game;
            this.isMeteorCreated = false;
            this.meteorSpeed = 0.2;
            this.gravity = 0.4;
            this.meteorY = 0;
            this.meteor1Img = document.querySelector(".meteor1");
            this.meteorFrameX = 0;
            this.meteorFrameY = 1;
            this.meteor1SpriteWidth = 100;
            this.meteor1SpriteHeight = 100;
            this.counter = 0;
            this.createFire = false;
            this.meteorFire = document.querySelector(".fire1");
            this.lastY = 0;

        }
        drawMeteor(context,delta){
           if(this.isMeteorCreated){
      
            if(this.meteorY > this.game.gameHeight) {
                this.isMeteorCreated = false;
                this.lastY = this.meteorY;
                this.meteorY = 0;
                this.meteorSpeed = 0.2;
                this.createFire = true;
                return;
            }
      
           
         //   context.drawImage(this.stageOneImg,this.frameX * this.stageOneSpriteWidth,this.frameY * this.stageOneSpriteHeight,300,300,this.unitX,this.unitY,this.soldierWidth,this.soldierHeight);

            context.drawImage(this.meteor1Img,this.game.mouse.mouseX,this.meteorY,this.meteor1SpriteWidth,this.meteor1SpriteHeight);
            this.meteorY+=this.meteorSpeed;
            this.meteorSpeed+=this.gravity;

           }
            
        }
        drawFire(context,delta){
            if(this.createFire){
                context.drawImage(this.meteorFire,this.meteorFrameX * 300,this.meteorFrameY * 300,300,300,this.game.mouse.mouseX,this.game.gameHeight * 0.7,300,200);
            
       

            if(this.meteorFrameX >= 19){
                this.createFire = false;
                this.counter = 0;
                this.meteorFrameX = 0;
                return;
            }
            if(this.counter >= 50){
                this.meteorFrameX++;
                this.counter = 0;
            }

            this.counter+=delta;
            

            }
        }
    }


    class Mouse {
        constructor(game){
            this.game = game;
            this.mouseX = undefined;
            this.mouseY = undefined;
        }
    }



    class UI {

        constructor(game){
            this.game = game;
            this.cash =2000;
            this.basicTurret = document.querySelector(".basic");
            this.stageOneGround = document.querySelector(".grass");
            this.overlay1 = document.querySelector(".overlay1");
            
        }
        draw(context){
            context.drawImage(this.overlay1,0,0,this.game.gameWidth,this.game.gameHeight);
            context.drawImage(this.stageOneGround,0,this.game.gameHeight * 0.86,this.game.gameWidth,200);
            context.font = "50px Helvetica Bold";
            context.fillStyle = "white";
            context.fillText( `Cash: ${this.cash}\$`,10,100,300);
            
        }

    }
    class Turret {
        constructor(game){

            this.game = game;
            this.turretX = this.game.gameWidth* 0.15;
            this.turretY = this.game.gameHeight * 0.8;
            this.shootInterval = 1000;
            this.shootCounter = 0;
            this.buildDifferenceY = 0;
            this.counter = 0;
            this.turrerFrameX = 0;
            this.turretFrameY = 0;
        }

        buildTurret(delta){
            console.log(this.game.pressedKey);
            if(this.game.pressedKey == "basic"){
                if(this.counter > 50){
                    this.game.builtTurrets.push(new BasicTurret(this.game));
                    this.counter = 0;
                }
               
                this.counter+=delta;
              
                
            }

        }

       
        draw(context,delta){
            for(let i = 0; i < this.game.builtTurrets.length;i++){
                this.game.builtTurrets[i].draw(context,delta);
             
               
                
            }
        }
        
    }

    class BasicTurret extends Turret {

        constructor(game){
            super(game);
            this.damage = 50;
            this.hitPeriod = 3000;
            this.health = 200;
            this.maxBullets = 50;
            this.basicDifference = 100;
            this.basicX = Math.random()*(this.game.gameWidth* 0.35);
            this.basicY = this.game.gameHeight * 0.55;
            this.bullet = new Bullet(this);
            this.basicImage = document.querySelector(".cap1");
            
      
         
        

        }
       
    

        draw(context,delta){
           this.bullet.draw(context);
           if(this.turrerFrameX > 2){
            this.turrerFrameX = 0;
           }
           if(this.counter > 1500){
            this.turrerFrameX++;
            this.counter = 0;
           }
           context.drawImage(this.basicImage,this.turrerFrameX * 130,this.turretFrameY * 100,120,150,this.basicX,this.basicY,300,300);
           this.counter+=delta;
        }
    };

    class Bullet {
        constructor(turret){
            this.turret = turret;
            this.bulletX = this.turret.basicX;
            this.bulletY = this.turret.basicY;
            this.bulletWidth = 50;
            this.bulletHeight = 50;
            this.bulletSpeed = this.turret.game.gameSpeed;
            this.verticalSpeed = 0;
        }
        draw(context){
            if(this.bulletSpeed < 1){
                if(this.bulletY > this.turret.game.gameHeight){
                    this.bulletX = this.turret.basicX;
                    this.bulletY = this.turret.basicY;
                    this.bulletSpeed = this.turret.game.gameSpeed;
                    this.verticalSpeed = 0;
                }
                this.bulletY+=this.verticalSpeed;
                this.verticalSpeed+=0.02;
                this.bulletX+=2;
                
            } else {
                this.bulletX+= this.bulletSpeed;
                this.bulletSpeed-=0.02;
            }
            context.fillRect(this.bulletX,this.bulletY,this.bulletWidth,this.bulletHeight);
      

        }
    }

    class GameState {

        constructor(game){
            this.game = game;
            this.statCounter = 0;
        }

        dist(){
            for(let i = 0; i < this.game.objects.length;i++){
                if(this.game.objects[i] != undefined && this.game.enemyObjects[i] != undefined && Math.abs(this.game.objects[i].unitX-this.game.enemyObjects[i].enemyX) < 100){
                    this.game.gameSpeed = 0;
                    this.game.fight = true;
             
                }
            }
        }
        /**
         * checks damage to the main tower
         * @returns void
         */
        checkWin(){

            if(this.game.tower.health <= 0){
                alert("YOU LOST!");
                return;
            }


           if(this.game.enemyObjects[this.statCounter] != undefined){

            if(this.game.enemyObjects[this.statCounter].enemyX < 100){
                this.game.tower.health-=20;
                this.game.enemyObjects.shift();
                return;
            }

        


           }

            
         

        }
        
        displayEnemyDamage(context){
            let counter = 0;
            let damageText = '-' + this.game.objects[this.statCounter].strength;
            let x = this.game.enemyObjects[this.statCounter].enemyX;
            let y = this.game.enemyObjects[this.statCounter].enemyY-30;
            context.font = "50px Helvetica";
            context.fillStyle = "red";
            while(counter < 1000){

                context.fillText(damageText,x,y,200);
                counter++;
                
            }


            return;


        }
        checkCollision(){
            
           if(this.game.enemyObjects.length > 0){
         
                if(this.game.meteor.meteorY + this.game.meteor.meteor1SpriteHeight > this.game.enemyObjects[0].enemyY){
                        
                }

            }
         
        }

        startFight(delta,context){

            if(this.game.objects[this.statCounter].health <= 0){
              
                this.game.objects.shift();
                this.game.fight = false;
                this.game.gameSpeed = 3;
                this.game.fpsCounter = 0;
             
                return;
            }

            if(this.game.enemyObjects[this.statCounter].health <= 0){
                
                this.game.enemyObjects.shift();
                this.game.fight = false;
                this.game.gameSpeed = 3;
                this.game.fpsCounter = 0;
                this.game.ui.cash+=40;
        
                return;
            }


            if(this.game.pressedKey == "click"){
                this.game.enemyObjects[this.statCounter].health-=this.game.objects[this.statCounter].strength;
                this.game.pressedKey = "None";
                this.displayEnemyDamage(context);
                
            }
            if(this.game.fpsCounter > this.game.enemyObjects[this.statCounter].hitPeriod){
               this.game.objects[this.statCounter].health-=this.game.enemyObjects[this.statCounter].strength;
              
               this.game.fpsCounter = 0;
            }

            this.game.fpsCounter+=delta;


        }


        
    };

    class Enemy {


        constructor(game){
            this.game = game;
            this.unit = new Unit(this);
            this.health = 100;
            this.healthBarHeight = 15;
            this.enemyX = this.game.gameWidth;
            this.enemyY = this.game.gameHeight * 0.75
            this.enemyW = 100;
            this.enemyH = 100;
            this.enemyPeriod = 2200;
            this.hitPeriod = 1000;
            this.strength = 100;

        }

        createEnemy(delta){

            if(this.game.fpsCounter > this.enemyPeriod){
                this.game.enemyObjects.push(new Enemy(this.game));
                this.game.fpsCounter = 0;
                return;
            }

            this.game.fpsCounter+=delta;


        }

        draw(context){
            for(let i = 0; i < this.game.enemyObjects.length;i++){
                this.game.enemyObjects[i].drawEnemy(context);
         
                
            }
        }
        drawEnemy(context){
            context.fillStyle = "blue";
            context.fillRect(this.enemyX,this.enemyY,this.enemyW,this.enemyH);
            context.fillStyle = "red";
            context.fillRect(this.enemyX,this.enemyY - 60,this.health,this.healthBarHeight);
            this.enemyX-=this.game.gameSpeed;
        }


    }





    class Unit {
        constructor(game){

            this.game = game;
            this.hitPeriod = 200;
            this.strength = 80;
            this.health = 1000;
         


        }

        createUnit(key){
            if(key == "j"){
                if(this.game.counter >= 1){
                    return;
                }
                this.game.objects.push(new Soldier(this.game));
                this.game.counter++;
                this.game.ui.cash-=500;
               
                
            } 
        }
        draw(context,delta){
            for(let i = 0; i < this.game.objects.length;i++){
                this.game.objects[i].draw(context,delta);
           
            }
        }

    }

    class Soldier extends Unit  {
        constructor(game){
            super(game);
            this.game = game;
            this.soldierWidth = 100;
            this.soldierHeight = 100;
            this.unitX = 100;
            this.unitY = this.game.gameHeight * 0.75;
            this.stageOneSpriteWidth = 263;
            this.stageOneSpriteHeight = 341;
            this.frameX = 0;
            this.frameY = 0;
            this.stageOneImg = document.querySelector(".caveMen");
            this.counter = 0;
            

        }
        draw(context,delta){
            if(this.frameY >= 3) this.frameY = 0;
            if(this.frameX >= 3) this.frameX = 0;
            if(this.counter > 500) {
                if(this.game.fight) this.frameY++;
                this.frameX++;
                this.counter = 0;
            }
            context.drawImage(this.stageOneImg,this.frameX * this.stageOneSpriteWidth,this.frameY * this.stageOneSpriteHeight,300,300,this.unitX,this.unitY,this.soldierWidth,this.soldierHeight);
            this.unitX+=this.game.gameSpeed;
            this.counter+=delta;
           
        }
    }


    class Tower {

        constructor(game){
            this.game = game;
            this.unitX = this.game.gameWidth * 0.05;
            this.unitY = this.game.gameHeight * 0.8;
            this.turretSlots = 0;
            this.maxTurrerSlots = 5;
            this.health = 200;
            this.shield = 100;
            this.towerImage = document.querySelector(".cave");

        }

        draw(context){
            context.fillStyle = "red";
            context.fillRect(this.game.gameWidth * 0.01,this.game.gameHeight * 0.2,50,this.health);
            context.drawImage(this.towerImage,this.game.gameWidth * 0.001,this.game.gameHeight * 0.55,300,300);

        }



    };

    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener("keydown",(e)=>{

                this.game.pressedKey = e.key;
                console.log(e.key);

            });

            window.addEventListener("keyup",(e)=>{

                this.game.pressedKey = 'S' + e.key;
                this.game.counter = 0;

            });
           
            window.addEventListener("click",(e)=>{

                if(!this.game.interrupt){
                    this.game.pressedKey = "click";
                }

            });
          this.game.ui.basicTurret.addEventListener("mousedown",e=>{

                this.game.pressedKey = "basic";
                this.game.interrupt = true;

                
          });
          this.game.ui.basicTurret.addEventListener("mouseup",e=>{

            this.game.pressedKey = "R" + "basic";
            this.game.interrupt = true;

            
      });
          this.game.ui.basicTurret.addEventListener("mouseleave",e=>{

            this.game.interrupt = false;

            
      });

          window.addEventListener("wheel",(e)=>{
            if(!this.game.meteor.isMeteorCreated){
                this.game.mouse.mouseX = e.x;
                this.game.meteor.isMeteorCreated = true;
                
                
            }
            console.log(this.game.meteor.isMeteorCreated,this.game.meteor.meteorY);
            
          });

            
        }
    }

    class Game {

        constructor(width,height){
            this.gameWidth = width;
            this.gameHeight = height;
            this.pressedKey = undefined;
            this.ui = new UI(this);
            this.tower = new Tower(this);
            this.unit = new Unit(this);
            this.input = new InputHandler(this);
            this.enemy = new Enemy(this);
            this.gameStats = new GameState(this);
            this.turret = new Turret(this);
            this.mouse = new Mouse(this);
            this.meteor = new Meteor(this);
            this.objects = [];
            this.enemyObjects = [];
            this.builtTurrets = [];
            this.fight = false;
            this.counter = 0;
            this.gameSpeed = 3;
            this.fps = 30;
            this.fpsCounter = 0;
            this.interrupt = false;
         
        }

        render(context,delta){
            this.unit.draw(context,delta);
            this.enemy.draw(context);
            this.turret.draw(context,delta);
            this.ui.draw(context);
            this.meteor.drawMeteor(context,delta);
            this.tower.draw(context);
            this.meteor.drawFire(context,delta);

        }


        update(context,delta){

            if(this.fight){

                this.gameStats.startFight(delta,context);
            }

            this.gameStats.checkWin();
            this.unit.createUnit(this.pressedKey);
            this.turret.buildTurret(delta);
            this.enemy.createEnemy(delta);
            this.gameStats.dist();
            this.gameStats.checkCollision();
            this.render(context,delta);
            
        }



    };

    const game = new Game(canvas.width,canvas.height);
    let lastTime = 0;
    const animate = (timeStamp) => {
        let delta = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(ctx,delta);
        requestAnimationFrame(animate);
    
    }
    animate(0);


});



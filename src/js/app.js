let claroLogo;
let buttonStart;
let resize = true;
let servsMove = true;
let score = 0; 
let displayScore;
let marcador;
let mContext;

let servsSprites = ['serv1', 'serv2', 'serv3'];
let servs = [];

class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 

    preload(){ 
        this.load.image('background', './assets/img/background.png');
        this.load.image('serv1', './assets/img/serv1.png');
        this.load.image('serv2', './assets/img/serv2.png');
        this.load.image('serv3', './assets/img/serv3.png');
        this.load.image('hero', './assets/img/hero.png');
        this.load.image('centro', './assets/img/centro.png');
        this.load.image('marcador', './assets/img/marcador.png');
        this.load.image('play', './assets/img/play-button.png');
    }
 
    create(){
        mContext = this;
        this.add.image((mContext.game.config.width/2), (mContext.game.config.height/2), 'background');
        claroLogo = this.add.image((mContext.game.config.width/2), (mContext.game.config.height/2), 'centro');
        claroLogo.setDepth(1);
        marcador = this.add.image(150, 150, 'marcador').setScale(.5);
        displayScore = this.add.text(150, 130, score, { font: '64px Courier', fill: '#ff0000' });
        buttonStart = this.add.sprite((mContext.game.config.width/2), 900, 'play').setScale(.45).setInteractive();

        // Start
        buttonStart.on('pointerdown', function (pointer){   
            buttonStart.setScale(.45) 
            mContext.generateServ();

            setInterval(() => {
                buttonStart.destroy();
            }, 500);
        });
 
        buttonStart.on('pointerover', function (pointer){   
            buttonStart.setScale(.40)         
        });

        buttonStart.on('pointerout', function (pointer){   
            buttonStart.setScale(.45)         
        });
    }    

    generateServ(){
        let intervalServs = setInterval(function (){
            servs.push(
                mContext.physics.add.sprite((mContext.game.config.width/2), (mContext.game.config.height/2), servsSprites[mContext.getRandomServ()])
                .setScale(.3)
                .setInteractive()
                .setVelocityX(mContext.getRandomVelocity())
                .setVelocityY(mContext.getRandomVelocity())
                .on('pointerdown', function (pointer){   
                    mContext.tweens.add({
                        targets: this,
                        alpha: 0,
                        duration: 150,
                        ease: 'Power2'
                    }, this);
                    mContext.addScore();
                })
            );
        }, 300);

        setTimeout(() => {
            clearInterval(intervalServs);
            claroLogo.destroy();
            marcador.destroy();
            displayScore.destroy();

            this.add.image((mContext.game.config.width/2), (mContext.game.config.height/2), 'marcador').setScale(.8);           
            this.add.text((mContext.game.config.width/2) -20, (mContext.game.config.height/2) - 43, score, { font: '128px Courier', fill: '#ff0000' });            
            setTimeout(() => {
                location.reload();
            }, 5000);
        }, 30000);
    }

    getRandomVelocity(){
        let min = -250;
        let max = 250;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomServ(){
        let min = 0;
        let max = servsSprites.length;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    addScore(){
        score += 1;        
        displayScore.setText(score);
    }

    update(){
        if (resize){
            claroLogo.scale += .0009;
            resize = claroLogo.scale >= 1 ? !resize : resize;
        }else if (!resize) {
            claroLogo.scale -= .0009;
            resize = claroLogo.scale <= .92 ? !resize : resize;            
        }        

        if (servsMove){
            servs.forEach((elem) => {
                elem.y += .1
                elem.x += .1
                elem.angle += .2;

                servsMove = elem.angle >= 10 ? !servsMove : servsMove;            
            });
        }else if (!servsMove){
            servs.forEach((elem) => {
                elem.y -= .1
                elem.x -= .1
                elem.angle -= .2;

                servsMove = elem.angle <= -10 ? !servsMove : servsMove;   
            });
        }

        this.deleteServs();
    }

    deleteServs(){
        servs.forEach((elem, key, obj) => {
            if (elem.x > ((mContext.game.config.width/2) + elem.width) || elem.x < (-1 * elem.width)){
                elem.destroy();
                obj.splice(key, 1);
            }

            if (elem.y > ((mContext.game.config.height/2) + elem.height) || elem.y < (-1 * elem.width)){
                elem.destroy();
                obj.splice(key, 1);
            }
        });
    }
} 

const config = {
    type: Phaser.AUTO,
    height: 1080,
    width: 720,
    parent: 'game-container',
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    dom: {
        createContainer: true
    },
    input :{
		activePointers: 3,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            // gravity: { y: 350 }
        }
    }
}

game = new Phaser.Game(config)
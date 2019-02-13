enchant();

var FPS = 24;
var DISPLAY_X = 640;
var DISPLAY_Y = 1000;
var GameObject = null;
var SceneMaker = {};



window.onload = function () {


    GameObject = new Core(DISPLAY_X, DISPLAY_Y);
    GameObject.fps = FPS;

    var left = (0.5*window.innerWidth - window.innerHeight*0.32);
    document.getElementById('enchant-stage').style.left = left+"px";

    GameObject.preload(
        'udpk1.png',
        'udpk2.png'
        );

    GameObject.onload = function () {
    
        // start scene
        SceneMaker.createStartScene = function () {
            var scene = new Scene();
            scene.backgroundColor = '#151A4E';

            var num = 0;

            var label = new Label();
            label.text = num;
            label.textAlign = 'center';
            label.color = '#ffffff';
            label.x = 0; label.y = 100;
            label.width = DISPLAY_X;
            label.font = '100px sans-serif';
            scene.addChild(label);

            var UZ = enchant.Class.create(enchant.Sprite, {
                initialize: function(){
                    enchant.Sprite.call(this, 200, 200);
                    this.image = GameObject.assets['udpk2.png'];
                    this.x = DISPLAY_X;
                    this.y = DISPLAY_Y/2;
                    scene.addChild(this);     

                    this.tl.moveBy(-DISPLAY_X/4-20, 0, 15)  
                    .rotateBy(10,2) 
                    .moveBy(-DISPLAY_X/4, -80, 12) 
                    .then(function(){
                        label.text = num;
                        this.image = GameObject.assets['udpk1.png'];
                    })  
                    .rotateBy(-20,2)
                    .moveBy(-DISPLAY_X/4, 80, 10)
                    .rotateBy(10,2) 
                    .moveBy(-DISPLAY_X/4 - 50, 0, 15)
                    .scaleTo(-0.5, 0.5, 10)    
                    .moveBy(DISPLAY_X-30, 0, 50)
                    .then(function(){
                        scene.removeChild(this);
                    })
                    ; 
                }
            });

            scene.tl.then(function(){
                num++;
                var uz = new UZ();
                
            })
            .delay(40)
            .loop()
            ;


            return scene;
        };



        GameObject.replaceScene(SceneMaker.createStartScene());
    };
    GameObject.start(); 
};

enchant();
var FPS = 24;
var DISPLAY_X = 640;
var DISPLAY_Y = 1000;
var GameObject = null;
var SceneMaker = {}
var VERSION = "ver1.0.0";

window.onload = function () {
    // init display
    GameObject = new Core(DISPLAY_X, DISPLAY_Y);
    GameObject.fps = FPS;
    GameObject.scale = 1;

    GameObject.preload(
        'op/op1.png',
        'op/op2.png',
        'op/op3.png',
        'op/op4.png',

        'bg.png',
    
        'cats/ept.png',
        'cats/cat1.png',
        'cats/cat2_store1.png',
        'cats/cat2.png',
        'cats/cat3_store1.png',
        'cats/cat3.png',
    
        'btn/bt1.png',
        'btn/bt1_1.png',
        'btn/bt2.png',
        'btn/bt2_1.png',
        'btn/bt3.png',
        'btn/bt3_1.png',
    
        'txt/ept.png',
        'txt/txt1.png',
    
        'chara/chr1.png'
        );

    GameObject.onload = function () {
        // start scene
        SceneMaker.createStartScene = function () {
            var scene = new Scene();
            scene.backgroundColor = '#ffffff';

            var versionLabel = new Label(VERSION);
            versionLabel.textAlign = 'center';
            versionLabel.color = '#000';
            versionLabel.x = 0;
            versionLabel.y = 8;
            versionLabel.width = DISPLAY_X - 8;
            versionLabel.font = '15px sans-serif';
            // scene.addChild(versionLabel);

            bg = new  Sprite(640,700);//Sprite(640,700);
            bg.image = GameObject.assets['op/op1.png'];
            bg.y = DISPLAY_Y/2-300;
            scene.addChild(bg);
            scene.addChild(versionLabel);

            var num = 1;
            bg.addEventListener(Event.TOUCH_START, function (e){
                num++;
                if (num==5) GameObject.replaceScene(SceneMaker.createGameScene());
                bg.image = GameObject.assets['op/op'+num+'.png'];

            });


            return scene;
        };

        SceneMaker.createGameScene = function () {
            var scene = new Scene();
            scene.backgroundColor = '#ffffff';

            cat1 = new Sprite(600,656);
            cat1.image = GameObject.assets['bg.png'];
            cat1.x = 20; cat1.y = 30;
            scene.addChild(cat1);

            cat1 = new Sprite(200,200);
            cat1.image = GameObject.assets['cats/cat1.png'];
            cat1.x = 10; cat1.y = DISPLAY_Y-400;
            scene.addChild(cat1);

            cat2 = new Sprite(200,200);
            cat2.image = GameObject.assets['cats/ept.png'];
            cat2.x = 200+10; cat2.y = DISPLAY_Y-400;
            scene.addChild(cat2);

            cat3 = new Sprite(200,200);
            cat3.image = GameObject.assets['cats/ept.png'];
            cat3.x = 400+10; cat3.y = DISPLAY_Y-400;
            scene.addChild(cat3);


            return scene;
        };


        GameObject.replaceScene(SceneMaker.createStartScene());
    }
    GameObject.start(); 

};
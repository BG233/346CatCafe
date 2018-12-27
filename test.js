enchant();
var VERSION = "ver1.0.0";

var cat_list =[
    new Cat('凛', 'cats/cat2.png', ['cats/cat2_store1.png'],['cats/cat2_store1_1.png'],'ふーん','cats/cat2_touch.png'),
    new Cat('未央', '', ['cats/cat3_store1.png'],[],'MIO',''),
    
    // new Cat('响子画的', 'test.png', ['test.png'],['test.png'],'233',''),
    new Cat('响子画的猫', '', ['cats/cat4_store.png',],[],'...',''),


]

var customer_list = [
    new Customer('有点脸熟的OL','chara/chr1.png',['送出了生火腿蜜瓜','卯月猫被抢走了'],['win','lose'])


];

function Cat(name, enqueue_fig, store_fig, store_when_enq,sound,touch){
    this.name = name;
    this.enqueue_fig = enqueue_fig;
    this.store_fig = store_fig;
    this.store_when_enq = store_when_enq;
    this.meet_time = 0;
    this.sound = sound;
    this.touch = touch;
}

function Customer(name,figure,reaction,tag){
    this.name = name;
    this.figure = figure;
    this.reaction = reaction;
    this.tag = tag; //win lose eat touch
}

var FPS = 24;
var DISPLAY_X = 640;
var DISPLAY_Y = 1000;
var GameObject = null;
var SceneMaker = {}

var unit = '';
var end_tag = ''; //normal 346<-常务

window.onload = function () {
    GameObject = new Core(DISPLAY_X, DISPLAY_Y);
    GameObject.fps = FPS;
    GameObject.scale = 1;

    GameObject.preload(
        'test.png',

        'op/op1.png',
        'op/op2.png',
        'op/op3.png',
        'op/op4.png',

        'bg/bg.png',
        'bg/win.png',
        'bg/gameover.png',
        'emp_tmp.png',

        'cats/ept.png',
        'cats/cat1.png',
        'cats/cat1_touch.png',

        'cats/cat2_store1.png',
        'cats/cat2_store1_1.png',
        'cats/cat2_touch_sp.png',
        'cats/cat2_touch.png',
        'cats/cat2.png',

        'cats/cat3_store1.png',
        'cats/cat3.png',

        'cats/cat4_store.png',
    
        'btn/bt1.png',
        'btn/bt1_1.png',
        'btn/bt2.png',
        'btn/bt2_1.png',
        'btn/bt3.png',
        'btn/bt3_1.png',

        'btn/restart.png',
    
        'txt/ept.png',
        'txt/txt1.png',
    
        'chara/chr1.png',

        'skill/skill1_1.png',
        'skill/skill1_2_1.png',
        'skill/skill1_2_2.png',
        'skill/skill1_3_1.png',
        'skill/skill1_3_2.png',
        'skill/skill1_4.png'
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

            bg = new  Sprite(640,700);
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
            var stage = 0;
            var queue = new Array();
            var can_pass = 1, can_op1=1, can_op2=1, skill_ctn = 0;
            var meetObj = null; 
            var tmp_index = null;
            var tmp_index1 = null;
            unit = '';

            var scene = new Scene();
            scene.backgroundColor = '#ffffff';

            bg = new Sprite(600,656);
            bg.image = GameObject.assets['bg/bg.png'];
            bg.x = 20; bg.y = 35;
            scene.addChild(bg);

            meet = new Sprite(550,550);
            meet.image = GameObject.assets['emp_tmp.png']; //test
            meet.x = 50; meet.y = 90;
            scene.addChild(meet);

            skill_fig = new Sprite(350,350);
            skill_fig.image = GameObject.assets['emp_tmp.png']; //test
            skill_fig.x = DISPLAY_X/2-175; skill_fig.y = 200;
            scene.addChild(skill_fig);

            var label = new Label();
            label.text = 'うづう〜';
            label.textAlign = 'center';
            label.color = '#000';
            label.x = 0; label.y = 15;
            label.width = DISPLAY_X-20;
            label.font = '25px sans-serif';
            scene.addChild(label);

            cat1 = new Sprite(200,200);
            cat1.image = GameObject.assets['cats/cat1.png'];
            cat1.x = 10; cat1.y = DISPLAY_Y-400;
            scene.addChild(cat1);

            //touch
            cat1.addEventListener(Event.TOUCH_START, function (e) {
                // alert(queue[0].name);
                cat1.image = GameObject.assets['cats/cat1_touch.png']; 
                if (queue.length>0){
                    if (queue[0].name == '凛') cat2.image = GameObject.assets['cats/cat2_touch_sp.png']; 
                    else if(queue.length==2 && queue[1].name == '凛') cat3.image = GameObject.assets['cats/cat2_touch_sp.png']; 
                }
            });
            cat1.addEventListener(Event.TOUCH_END, function (e) {
                cat1.image = GameObject.assets['cats/cat1.png']; 
                if (queue.length>0){
                    if (queue[0].name == '凛') cat2.image = GameObject.assets['cats/cat2.png']; 
                    else if(queue.length==2 && queue[1].name == '凛') cat3.image = GameObject.assets['cats/cat2.png']; 
                }
            });

            cat2 = new Sprite(200,200);
            cat2.image = GameObject.assets['cats/ept.png'];
            cat2.x = 200+10; cat2.y = DISPLAY_Y-400;
            scene.addChild(cat2);
            //touch
            cat2.addEventListener(Event.TOUCH_START, function (e) {
                if (queue.length>=1){
                    cat2.image = GameObject.assets[queue[0].touch]; 
                }
            });
            cat2.addEventListener(Event.TOUCH_END, function (e) {
                if (queue.length>=1){
                    cat2.image = GameObject.assets[queue[0].enqueue_fig]; 
                }
            });

            cat3 = new Sprite(200,200);
            cat3.image = GameObject.assets['cats/ept.png'];
            cat3.x = 400+10; cat3.y = DISPLAY_Y-400;
            scene.addChild(cat3);

            bt1 = new Sprite(200,100);
            bt1.image = GameObject.assets['btn/bt1.png'];
            bt1.x = 20; bt1.y = DISPLAY_Y-180;
            scene.addChild(bt1);

            bt2 = new Sprite(200,100);
            bt2.image = GameObject.assets['btn/bt2.png'];
            bt2.x = 200+20; bt2.y = DISPLAY_Y-180;
            scene.addChild(bt2);

            bt3 = new Sprite(200,100);
            bt3.image = GameObject.assets['btn/bt3.png'];
            bt3.x = 400+20; bt3.y = DISPLAY_Y-180;
            scene.addChild(bt3);
            
            //溜走btn
            function passby(){

                function init_state(){
                    can_pass = 1;
                        can_op1 = 1;
                        can_op2 = 1;
                        bt1.image = GameObject.assets['btn/bt1.png'];
                        bt2.image = GameObject.assets['btn/bt2.png'];
                }

                if (can_pass){
            
                    can_pass = 0;
                    //回收上个情况
                    label.text = '';
                    skill_fig.image = GameObject.assets['emp_tmp.png']; 
                    meet.image = GameObject.assets['emp_tmp.png'];
                    //凛的特判
                    if (cat_list[0].meet_time==2 && cat_list[0].name=='凛' && ((queue.length==0)||(queue.length==1&&queue[0].name!='凛'))){ 
                        
                        if(unit == '') unit = 'uzurin';
                        else if (unit == 'uzumio') unit == 'NG';
                        
                        label.text = "凛跟了过来";
                        if(queue.length==0)
                            cat2.image = GameObject.assets[cat_list[0].enqueue_fig];
                        else if(queue.length ==1)
                            cat3.image = GameObject.assets[cat_list[0].enqueue_fig];

                        queue.push(cat_list[0]);
                        cat_list.splice(0,1);

                        can_pass = 1;
                        can_op2 = 0;
                        bt2.image = GameObject.assets['btn/bt2_1.png'];
                        can_op1 = 0;
                        bt1.image = GameObject.assets['btn/bt1_1.png'];
                        return;
                    }
            
                    var a=Math.random();
                    if (a<0.2){ //empty
                        label.text = '这里啥也没有';
                        stage = 0;
            
                    }else if(a<0.6){ //meet cat    
                        stage = 1;
                        meet_cat();
            
                    }else{ //meet customer
                        // label.text = '猫咖里的客人出现了';
                        stage = 2;
                        meet_customer()
                    }
                    
                    init_state()
                }
                
            
            }
            
            function meet_cat(){   
                var index = Math.floor((Math.random()* cat_list.length)); 
                cat_list[index].meet_time++;
                var index1 = Math.floor((Math.random()* cat_list[index].store_fig.length)); 
                
                meet.image = GameObject.assets[cat_list[index].store_fig[index1]];
                label.text = cat_list[index].name + "出现了";

                meetObj = cat_list[index];
                tmp_index = index;
                tmp_index1 = index1;
            }

            function meet_customer(){
                var index = Math.floor((Math.random()* customer_list.length));
                meet.image = GameObject.assets[customer_list[index].figure];
                label.text = customer_list[index].name + "出现了";

                meetObj = customer_list[index];
                tmp_index = index;
                // tmp_index1 = index1;
            }

            bt3.addEventListener(Event.TOUCH_START, function (e) {
                bt3.image = GameObject.assets['btn/bt3_1.png'];
            });
            bt3.addEventListener(Event.TOUCH_END, function (e) {
                passby();
                bt3.image = GameObject.assets['btn/bt3.png'];
            });


            function enqueue(){ 
                if(queue.length<2){
                    if(queue.length==0)
                        cat2.image = GameObject.assets[meetObj.enqueue_fig];
                    else if(queue.length == 1)
                        cat3.image = GameObject.assets[meetObj.enqueue_fig];

                    meet.image = GameObject.assets[meetObj.store_when_enq[tmp_index1]]
                    
                    queue.push(cat_list[tmp_index]);
                    cat_list.splice(tmp_index,1);

                    can_pass = 1;
                    can_op2 = 0;
                    bt2.image = GameObject.assets['btn/bt2_1.png'];
                    can_op1 = 0;
                    bt1.image = GameObject.assets['btn/bt1_1.png'];

                } 
            }
            //特技披露

            function kttk(stg, with_rin){
                skill_ani_done = 0;
                skill_fig.image = GameObject.assets['skill/skill1_1.png'];

                skill_fig.tl
                .moveBy(0, -25, 4);
                skill_fig.tl
                .moveBy(0, 25, 4);
                skill_fig.tl
                .moveBy(0, -25, 4);
                skill_fig.tl
                .moveBy(0, 25, 4)
                .then(function(){
                    if (with_rin){  //锤凛
                        skill_fig.image = GameObject.assets['skill/skill1_2_1.png'];
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_2_2.png'];});
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_2_1.png'];});
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_2_2.png'];});

                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['emp_tmp.png']; after()});

                    }
                    else if(stg == 2){  //锤人
                        skill_fig.image = GameObject.assets['skill/skill1_3_1.png'];
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_3_2.png'];});
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_3_1.png'];});
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_3_2.png'];});
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_3_1.png'];});
                    
                        skill_fig.tl
                        .delay(5)
                        .then(function(){skill_fig.image = GameObject.assets['emp_tmp.png']; after()});

                    }else{ //什么也没发生
                        skill_fig.tl
                        .delay(10)
                        .then(function(){skill_fig.image = GameObject.assets['skill/skill1_4.png'];});

                        skill_fig.tl
                        .delay(10)
                        .then(function(){skill_fig.image = GameObject.assets['emp_tmp.png']; after()});

                    }

            
                })

                function after(){
                    if(stg==0){
                        label.text = '然而什么也没发生';
                    }else if (stg == 1){ //回喵 或者入队

                        //特判凛直接入队
                        if(meetObj.name=='凛'){

                            if(unit == '') unit = 'uzurin';
                            else if (unit == 'uzumio') unit == 'NG'; 

                            label.text = "凛粘了过来";
                            enqueue();
                            return;
                        }else if( Math.random()<0.3 && meetObj.enqueue_fig!='' ){
                            enqueue();
                            label.text = meetObj.name+"加入了队伍";
                            return;
                        }
                        
                        label.text = meetObj.name+'发出了'+meetObj.sound+'的声音';
    
                    }else if (stg == 2){//没看见或者回应
                        var tmp = Math.random<0.5;
                        if (meetObj.name = '有点脸熟的OL') tmp = 0;

                        if(tmp<0.5){  //看向了这边
                            label.text = meetObj.name+'看向了这边';

                            meet.tl
                            .delay(30)
                            .then(function(){
                                var index = Math.floor((Math.random()* meetObj.tag.length)); 

                                switch(meetObj.tag[index]){
                                    case "win":
                                        if (meetObj.name = '有点脸熟的OL') end_tag = '346';
                                        // label.text = meetObj.reaction[index];
                                        GameObject.replaceScene(SceneMaker.Win());
                                        break;
                                    case "lose":
                                        if (meetObj.name = '有点脸熟的OL') end_tag = '346';
                                        GameObject.replaceScene(SceneMaker.GameOver());
                                        break;
                                    case "eat":
    
                                        break;
                                    case "touch":
    
                                        break;
    
                                }

                            });


                            
                        }else{
                            label.text = meetObj.name+'并没有注意到这边';
                        }
    
                    }
                }
                

            }

            function show_skill(){//之后改成根据组合判断技能！！！！！！！！！！！！！！！！！！！！！！

                if (queue.length == 0){
                    kttk(stage, 0);
                    
                }
                if (queue.length >= 1){

                    if (queue[0].name == '凛' || (queue.length==2 &&queue[1].name == '凛')){
                       if (Math.random()<0.55){ //锤肩
                            kttk(stage, 0);
                       }else{ //合体特技(锤凛)
                            kttk(stage, 1);
                       }

                    }else{ //卯月单人技能
                        
                        kttk(stage, 0);
                    }
                }
 

            }

            bt2.addEventListener(Event.TOUCH_END, function (e) {
                if(can_op2){
                    can_op2 = 0;
                    bt2.image = GameObject.assets['btn/bt2_1.png'];
                    show_skill();
                    // can_op = 1;
                }
            
            });

            //喵

            bt1.addEventListener(Event.TOUCH_END, function (e) {
                
                can_op1 = 0;
                bt1.image = GameObject.assets['btn/bt1_1.png'];
            });




            return scene;
        };

        SceneMaker.GameOver = function () {
            var scene = new Scene();
            scene.backgroundColor = '#ffffff';



            bg = new  Sprite(640,1000);
            bg.image = GameObject.assets['bg/gameover.png'];
            scene.addChild(bg);

            restart = new  Sprite(200,100);
            restart.image = GameObject.assets['btn/restart.png'];
            restart.x = DISPLAY_X/2;
            restart.y = DISPLAY_Y/2;
            scene.addChild(restart);

            restart.addEventListener(Event.TOUCH_END, function (e) {
                GameObject.replaceScene(SceneMaker.createGameScene());
            });



            return scene;
        };

        SceneMaker.Win = function () {
            var scene = new Scene();
            scene.backgroundColor = '#ffffff';



            bg = new  Sprite(640,1000);
            bg.image = GameObject.assets['bg/win.png'];
            scene.addChild(bg);

            restart = new  Sprite(200,100);
            restart.image = GameObject.assets['btn/restart.png'];
            restart.x = DISPLAY_X/2;
            restart.y = DISPLAY_Y/2;
            scene.addChild(restart);

            restart.addEventListener(Event.TOUCH_END, function (e) {
                GameObject.replaceScene(SceneMaker.createGameScene());
            });



            return scene;
        };


        GameObject.replaceScene(SceneMaker.createStartScene());
    }
    GameObject.start(); 

};



enchant();
var VERSION = "ver 0.0.0";


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
    this.tag = tag; //win lose eat touch txt
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
        'bg/gameover_sp.png',
        'emp_tmp.png',

        'cats/ept.png',
        'cats/cat1.png',
        'cats/cat1_touch.png',

        'cats/cat2_store1.png',
        'cats/cat2_store1_1.png',
        'cats/cat2_store2_1.png',
        'cats/cat2_store2_2.png',
        'cats/cat2_touch_sp.png',
        'cats/cat2_touch.png',
        'cats/cat2.png',

        'cats/cat3_store1.png',
        'cats/cat3_store2.png',
        'cats/cat3.png',

        'cats/cat4_store.png',
    
        'btn/skip.png',
        'btn/bt1.png',
        'btn/bt1_1.png',
        'btn/bt2.png',
        'btn/bt2_1.png',
        'btn/bt3.png',
        'btn/bt3_1.png',

        'btn/restart.png',
    
        'txt/txt1.png',
    
        'chara/chr1.png',
        'chara/chr2.png',
        'chara/chr3.png',

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

            bg = new  Sprite(640,700);
            bg.image = GameObject.assets['op/op1.png'];
            bg.y = DISPLAY_Y/2-300;
            scene.addChild(bg);

            skip = new Sprite(100,60);
            skip.image = GameObject.assets['btn/skip.png'];
            skip.x = DISPLAY_X-120; 
            skip.y =20;
            scene.addChild(skip);
            skip.addEventListener(Event.TOUCH_END, function (e) {
                GameObject.replaceScene(SceneMaker.createGameScene());
            });

            var l = new Label('Touch to Continue');
            l.textAlign = 'center';
            l.color = '#000';
            l.x = 0;
            l.y = 900;
            l.width = DISPLAY_X;
            l.font = '15px sans-serif';
            scene.addChild(l);
            

            var num = 1;
            bg.addEventListener(Event.TOUCH_START, function (e){
                num++;
                if (num==5) GameObject.replaceScene(SceneMaker.createGameScene());
                bg.image = GameObject.assets['op/op'+num+'.png'];

            });


            return scene;
        };

        SceneMaker.createGameScene = function () {
            var cat_list =[
                new Cat('凛', 'cats/cat2.png', ['cats/cat2_store1.png','cats/cat2_store2_1.png'],['cats/cat2_store1_1.png','cats/cat2_store2_2.png'],'ふーん','cats/cat2_touch.png'),
                new Cat('未央', '', ['cats/cat3_store1.png','cats/cat3_store2.png'],[],'MIO',''),
                
                // new Cat('响子画的', 'test.png', ['test.png'],['test.png'],'233',''),
                new Cat('响子画的猫', '', ['cats/cat4_store.png',],[],'...',''),
            
            ]

            var customer_list = [
                new Customer('有点脸熟的OL','chara/chr1.png',
                            ['送出了生火腿蜜瓜','卯月猫被抢走了','卯月猫被大摸了一把'],
                            ['win','lose','touch']),

                new Customer('小情侣','chara/chr2.png',
                            ['送出了生火腿蜜瓜','摸了摸卯月猫的肚皮'],
                            ['win','touch']),
                new Customer('在撸自己家的猫的Big Brige小姐','chara/chr3.png',
                            ['自己吃了生火腿蜜瓜','摸了摸卯月猫'],
                            ['txt','touch']),
            
            ];

            var by_op1 = 0;
            var by_op2 = 0;
            
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

            txt0 = new Sprite(200,80);
            txt0.image = GameObject.assets['emp_tmp.png']; //
            txt0.x = DISPLAY_X/2-100; txt0.y = 0;
            scene.addChild(txt0);

            var label = new Label();
            label.text = '在店里找找有没有生火腿吧';
            label.textAlign = 'center';
            label.color = '#000';
            label.x = 0; label.y = 20;
            label.width = DISPLAY_X;
            label.font = '25px sans-serif';
            scene.addChild(label);

            var versionLabel = new Label(VERSION);
            versionLabel.textAlign = 'right';
            versionLabel.color = '#000';
            versionLabel.x = 0;
            versionLabel.y = 2;
            versionLabel.width = DISPLAY_X-4;
            versionLabel.font = '15px sans-serif';
            scene.addChild(versionLabel);

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
            //touch
            cat3.addEventListener(Event.TOUCH_START, function (e) {
                if (queue.length==2){
                    cat3.image = GameObject.assets[queue[1].touch]; 
                }
            });
            cat3.addEventListener(Event.TOUCH_END, function (e) {
                if (queue.length==2){
                    cat3.image = GameObject.assets[queue[1].enqueue_fig]; 
                }
            });

            //喵的框

            txt1 = new Sprite(200,80);
            txt1.image = GameObject.assets['emp_tmp.png']; //'emp_tmp.png'
            txt1.x = 15; txt1.y = DISPLAY_Y-470;
            scene.addChild(txt1);

            txt2 = new Sprite(200,80);
            txt2.image = GameObject.assets['emp_tmp.png']; //'emp_tmp.png'
            txt2.x = 200+15; txt2.y = DISPLAY_Y-470;
            scene.addChild(txt2);

            txt3 = new Sprite(200,80);
            txt3.image = GameObject.assets['emp_tmp.png']; //'emp_tmp.png'
            txt3.x = 400+15; txt3.y = DISPLAY_Y-470;
            scene.addChild(txt3);

            var lb1= new Label();
            lb1.text = '';
            lb1.textAlign = 'center';
            lb1.color = '#000';
            lb1.x = 15; lb1.y = DISPLAY_Y-445;
            lb1.width = 200;
            lb1.font = '25px sans-serif';
            scene.addChild(lb1);

            var lb2= new Label();
            lb2.text = '';
            lb2.textAlign = 'center';
            lb2.color = '#000';
            lb2.x = 200+15; lb2.y = DISPLAY_Y-445;
            lb2.width = 200;
            lb2.font = '25px sans-serif';
            scene.addChild(lb2);

            var lb3= new Label();
            lb3.text = '';
            lb3.textAlign = 'center';
            lb3.color = '#000';
            lb3.x = 400+15; lb3.y = DISPLAY_Y-445;
            lb3.width = 200;
            lb3.font = '25px sans-serif';
            scene.addChild(lb3);

            //按钮
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
                        by_op1 = 0;
                        by_op2 = 0;
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

                    meet.tl
                    .moveBy(5,0, 5)
                    .then(function(){
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
                        
                        meet.tl.moveBy(-5,0, 5);
                        
                        init_state()

                    });
            
                    
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
                if (can_pass){
                    passby();
                    bt3.image = GameObject.assets['btn/bt3.png'];
                }
                
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
                    bt3.image = GameObject.assets['btn/bt3.png'];
                    can_op2 = 0;
                    bt2.image = GameObject.assets['btn/bt2_1.png'];
                    can_op1 = 0;
                    bt1.image = GameObject.assets['btn/bt1_1.png'];

                } 
            }
            //特技披露

            function kttk(stg, with_rin){

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
                        recover();
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
                        if (meetObj.name!='响子画的猫')
                            label.text = meetObj.name+'用爪子挠了挠头';
                        else
                            label.text = '什么也没发生';

                        recover();

                    }else if (stg == 2){//没看见或者回应
                        var tmp = Math.random();

                        if (meetObj.name == '有点脸熟的OL') tmp = 0;


                        if(tmp<0.5){  //看向了这边

                            label.text = meetObj.name+'看向了这边';

                            meet.tl
                            .delay(30)
                            .then(function(){
                                var index = Math.floor((Math.random()* meetObj.tag.length)); 

                                switch(meetObj.tag[index]){
                                    case "win": 
                                        if (meetObj.name == '有点脸熟的OL') end_tag = '346';
                                        // label.text = meetObj.reaction[index];
                                        GameObject.replaceScene(SceneMaker.Win());
                                        break;
                                    case "lose":
                                        if (meetObj.name == '有点脸熟的OL') end_tag = '346';
                                        GameObject.replaceScene(SceneMaker.GameOver());
                                        break;
                                    case "eat":

                                        recover();
                                        break;
                                    case "touch"://摸摸卯卯猫猫
                                        label.text = meetObj.reaction[index];
                                        cat1.image = GameObject.assets['cats/cat1_touch.png']; 
                                        if (queue.length>0){
                                            if (queue[0].name == '凛') cat2.image = GameObject.assets['cats/cat2_touch_sp.png']; 
                                            else if(queue.length==2 && queue[1].name == '凛') cat3.image = GameObject.assets['cats/cat2_touch_sp.png']; 
                                        }
                                        cat1.tl
                                        .delay(20)
                                        .then(function(){
                                            cat1.image = GameObject.assets['cats/cat1.png']; 
                                            if (queue.length>0){
                                                if (queue[0].name == '凛') cat2.image = GameObject.assets['cats/cat2.png']; 
                                                else if(queue.length==2 && queue[1].name == '凛') cat3.image = GameObject.assets['cats/cat2.png']; 
                                            }
                                            recover();
                                        });
                        
                                        break;
                                    case "txt":
                                        label.text = meetObj.reaction[index];

                                        recover();
                                        break;
    
                                }

                            });


                            
                        }else{
                            label.text = meetObj.name+'并没有注意到这边';
                            recover();
                        }

                        function recover(){
                            if(by_op2){
                                can_op1 = 1;
                                bt1.image = GameObject.assets['btn/bt1.png'];
                            }
                            can_pass = 1;
                            bt3.image = GameObject.assets['btn/bt3.png'];
                        }
    
                    }

                    

                }               

            }

            function show_skill(){//之后改成根据组合判断技能==============================

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

                    can_pass = 0;
                    bt3.image = GameObject.assets['btn/bt3_1.png'];

                    if (can_op1){
                        can_op1 = 0;
                        bt1.image = GameObject.assets['btn/bt1_1.png'];
                        by_op2 = 1;
                    }

                    show_skill();
                    
                }
            
            });

            //喵

            bt1.addEventListener(Event.TOUCH_END, function (e) {

                if(can_op1){
                    can_op1 = 0;
                    bt1.image = GameObject.assets['btn/bt1_1.png'];

                    can_pass = 0;
                    bt3.image = GameObject.assets['btn/bt3_1.png'];
                    
                    if (can_op2){
                        can_op2 = 0;
                        bt2.image = GameObject.assets['btn/bt2_1.png'];
                        by_op1 = 1;
                    }
                    
                    meow();
                    
                }    
            });

            function meow(){
                var uzu_sound = ['うづう〜','皮酿酿~','HEGO!'];
                var index = Math.floor((Math.random()* uzu_sound.length));
                //sp judge
                if(meet.Obj!=null&&meetObj.figure=='chara/chr3.png') index = 2;

                txt1.image = GameObject.assets['txt/txt1.png'];
                lb1.text = uzu_sound[index];
                txt1.tl
                .delay(30)
                .then(function(){
                    txt1.image = GameObject.assets['emp_tmp.png'];
                    lb1.text = '';
                    feedback();
                });

                

                if (queue.length>=1){
                    txt2.image = GameObject.assets['txt/txt1.png'];
                    lb2.text = queue[0].sound;
                    txt2.tl
                    .delay(30)
                    .then(function(){
                        txt2.image = GameObject.assets['emp_tmp.png'];
                        lb2.text = '';
                    });
                }

                if (queue.length==2){
                    txt3.image = GameObject.assets['txt/txt1.png'];
                    lb3.text = queue[1].sound;
                    txt3.tl
                    .delay(30)
                    .then(function(){
                        txt3.image = GameObject.assets['emp_tmp.png'];
                        lb3.text = '';
                    });
                }

                function feedback(){
                    if(stage == 1){
                        txt0.image = GameObject.assets['txt/txt1.png'];
                        label.text = meetObj.sound;
                        txt0.tl
                        .delay(30)
                        .then(function(){
                            txt0.image = GameObject.assets['emp_tmp.png'];
                            label.text = '';
                            recover();
                        });


                    }else if(stage == 2){
                        if(meetObj.figure=='chara/chr3.png'){//hassy的特判

                            txt0.image = GameObject.assets['txt/txt1.png'];
                            label.text = 'HEGO!!';
                            txt0.tl
                            .delay(30)
                            .then(function(){
                                txt0.image = GameObject.assets['emp_tmp.png'];
                                label.text = '';
                                recover();
                            });


                        }else{
                            label.text = meetObj.name + '不知道听没听见';
                            recover();
                        }

                    }else{
                        label.text = '然而什么也没发生……';
                        recover();
                    }

                    function recover(){
                        if (by_op1){
                            can_op2 = 1;
                            bt2.image = GameObject.assets['btn/bt2.png'];
                        }
                        can_pass = 1;
                        bt3.image = GameObject.assets['btn/bt3.png'];

                    }
                    
                    
                    
                }


            }




            return scene;
        };

        SceneMaker.GameOver = function () {
            var scene = new Scene();
            scene.backgroundColor = '#ffffff';



            bg = new  Sprite(640,1000);
            if(end_tag == '346' && (unit == 'uzurin' || unit == 'NG'))
                bg.image = GameObject.assets['bg/gameover_sp.png'];
            else
                bg.image = GameObject.assets['bg/gameover.png'];
            scene.addChild(bg);

            restart = new  Sprite(200,100);
            restart.image = GameObject.assets['btn/restart.png'];
            restart.x = DISPLAY_X/2;
            restart.y = DISPLAY_Y/2+100;
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
            restart.y = DISPLAY_Y/2+100;
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



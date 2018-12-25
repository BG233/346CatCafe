
var imgSrcArr = [
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

];

var cat_list =[
    new Cat('凛', 'cats/cat2.png', ['cats/cat2_store1.png'],'ふーん'),
    new Cat('未央', '', ['cats/cat3_store1.png'],'MIO')
]

function Cat(name, enqueue_fig, store_fig,sound){
    this.name = name;
    this.enqueue_fig = enqueue_fig;
    this.store_fig = store_fig;
    this.meet_time = 0;
    this.sound = sound;
}


var newimages=[]

function preloadimages(arr){
    var loadedimages=0
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            init();
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
        imageloadpost()
        }
    }
}

preloadimages(imgSrcArr);

function init(){
    document.getElementById("msg").innerHTML = "loading done";
    document.getElementById("cat1").src = 'cats/cat1.png';
    document.getElementById("cat2").src = 'cats/ept.png';
    document.getElementById("cat3").src = 'cats/ept.png';
    document.getElementById("txt").src = 'txt/ept.png';
    document.getElementById("bt1").src = 'btn/bt1.png';
    document.getElementById("bt2").src = 'btn/bt2.png';
    document.getElementById("bt3").src = 'btn/bt3.png';
    document.getElementById("main").style.display = '';
}


var stage = 0;
var queue = new Array();
var can_pass = 1, can_op1=1, can_op2=1;


function passby(){
    if (can_pass){

        can_pass = 0;
        document.getElementById("msg").innerHTML = "🐱🐱";

        document.getElementById("bt1").src = 'btn/bt1.png'; can_op1 = 1;
        document.getElementById("bt2").src = 'btn/bt2.png'; can_op2 = 1;

        //回收上个情况
        document.getElementById("char").style.display = 'none';


        if (cat_list[0].meet_time==2 && cat_list[0].name=='凛' && queue.length<2){ //rin enqueue
            document.getElementById("msg").innerHTML = "凛跟了过来";
            document.getElementById("cat2").src = cat_list[0].enqueue_fig;

            queue.push(cat_list[0]);

            cat_list.splice(0,1);

            can_pass = 1;
            return;
        }


        var a=Math.random();
        if (a<0.2){ //empty
            document.getElementById("msg").innerHTML = "啥也没有";
            stage = 0;

        }else if(a<0.6){ //meet cat    
            stage = 1;
            meet_cat();

        }else{ //meet customer

            stage = 2;
    
        }
    }

    can_pass = 1;

}

function meet_cat(){   //要是遇到两次凛都选择路过，凛会自己跟过来

    var index = Math.floor((Math.random()* cat_list.length)); 
    // alert(cat_list[index].store_fig); 

    cat_list[index].meet_time++;
    var index1 = Math.floor((Math.random()* cat_list[index].store_fig.length)); 
    

    document.getElementById("char").src = cat_list[index].store_fig[index1];
    document.getElementById("char").style.display = '';
    document.getElementById("msg").innerHTML = cat_list[index].name + "出现了";

    //开始特判
    


}


function meow(){
    if(can_op1){
        if(stage==0)  document.getElementById("msg").innerHTML ="啥也没发生";

        document.getElementById("bt1").src = 'btn/bt1_1.png';
        can_op1 = 0;
    }

}

function skill(){
    if(can_op2){
        if(stage==0)  document.getElementById("msg").innerHTML ="啥也没发生";

        document.getElementById("bt2").src = 'btn/bt2_1.png';
        can_op2 = 0;
    }

    
}
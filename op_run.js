
var imgSrcArr = [
    'op/op1.png',
    'op/op2.png',
    'op/op3.png',
    'op/op4.png'
];

var newimages=[];
var can_op = 0;
var current_page = 0;

function preloadimages(arr){
    var loadedimages=0
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){

            document.getElementById("msg").innerHTML = "loading done";
            document.getElementById("op").src = newimages[0].src;
            can_op = 1;
            document.getElementById("main").style.display = '';

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

function next_page(){ 
    if (can_op){
        if (current_page==imgSrcArr.length-1){
            window.location.href='cat.html';
        }else{
            document.getElementById("op").src = newimages[current_page+1].src;
            current_page++;
        }

    }

}
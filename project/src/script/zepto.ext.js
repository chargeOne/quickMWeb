/**
 * Created by jingming.yu on 14-12-18.
 */
//扩展Zepto 增加
(function($){
    var move=false;
    var pos={};
    var cls=[];
    var ev_start,ev_move,ev_end;
    var hasTouch="ontouchstart" in window;
    ev_start=hasTouch ? "touchstart" : "mousedown";
    ev_move=hasTouch ? "touchmove" : "mousemove";
    ev_end=hasTouch ? "touchend" : "mouseup";
    function onMouseMove(e){
        var oldPos=pos;
        if(hasTouch){
            pos={
                x:e.targetTouches[0].pageX,
                y:e.targetTouches[0].pageY
            };
        }else{
            pos={
                x:e.pageX,
                y:e.pageY
            };
        }
        if(oldPos.x!=pos.x || oldPos.y!=pos.y){
            if(cls!=null && cls!=""){
                for(var i=0;i<cls.length;i++) {
                    $("." + cls[i]).removeClass(cls[i]);
                }
            }
            move=true;
        }
    }
    $(document).bind(ev_move,onMouseMove);
    $.fn.downHighLight=function(className){
        $(this).bind(ev_start,function(e){
            if(cls.indexOf(className)==-1){
                cls.push(className);
            }
            move=false;
            if(hasTouch){
                pos={
                    x:e.targetTouches[0].pageX,
                    y:e.targetTouches[0].pageY
                };
            }else{
                pos={
                    x:e.pageX,
                    y:e.pageY
                };
            }
            $(this).addClass(className);
        });
        $(this).bind(ev_end,function(e){
            $(this).removeClass(className);
            if(!move){
                $(this).trigger("tapclick");
            }
        });
    };
})(Zepto);
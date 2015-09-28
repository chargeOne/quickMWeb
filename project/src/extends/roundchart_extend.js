/**
 * Created by 136248 on 2015/3/21.
 */
define(['zepto','roundchart'],
    function ($,chart) {
        return{
            create:function(div,color,perc){
                this.remove(div);
                var total=100;
                var rest=100-perc
                var roundChart = new RoundChart({
                    boxId: div.id,     //容器ID   （必选）
                    data: {             //数据     （必选）  长度统一
                        rates: [perc+"%",rest+"%"],
                        color: ['#5dd9bc','#ff6464']
                    },
                    canvasId: "",        //画板ID         （可选）  默认为容器ID + 'Canvas'
                    radius: "",       //饼图半径       （可选）  默认为容器最小宽（或者）高的一半
                    centerX: '',         //饼图中心X      （可选）  默认为容器宽的1/2处，单位为px 或 %
                    centerY: '',         //饼图中心Y      （可选）  默认为容器高的1/2处，单位为px 或 %
                    isAnimate: true,     //是否动画过场   （可选）  默认为 false
                    isOpen: false,        //是否点击伸展   （可选）  默认为 false
                    newsCanvasId: "",    //提示框画板ID   （可选）  默认为容器ID + 'NewsCanvas'
                    newsCanvasStyle: ""  //提示框画板样式 （可选）  格式为{style1:value1,style2:value2},默认样式
                });
                var canvas=$(div).find("canvas")[0];
                var context = canvas.getContext('2d');
//                context.shadowOffsetX = 3;
//                context.shadowOffsetY = 3;
//                context.shadowBlur = 3;
//                context.shadowColor="#5e1b18";
                  //$(div).append('<span style="position: relative;text-align: center;z-index: 9999;text-shadow:#000 2px 0 0">0%</span>');
                $(div).append('<p style="position: relative;text-align: center;z-index: 9999;text-shadow:#000 2px 0 0">0%</p>');
                  var $p=$(div).find('p');
                  $p.css({top:-parseInt($p.height()*0.8+$(canvas).height()/2)+"px"});


            },
            remove:function(div){
                var canvas=$(div).find("canvas")[0];
                if(canvas){
                    var context = canvas.getContext('2d');
                    //context.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
                    context.clearRect(0,0,canvas.width,canvas.height);
                    $(canvas).css({"display":"none"});
                    $(canvas).remove();
                }
                $(div).empty();
            }

        }
    })
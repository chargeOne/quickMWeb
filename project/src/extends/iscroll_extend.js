/**
 * Created by 136248 on 2015/1/20.
 */
define(['iscroll','zepto'],function(Iscroll,$) {
	/**
	 * 初始化iScroll控件
     1 .scroll不要在css里设置高度,不然拖不动
     2 #wrapper要设置position:relative,不然滚动条位置不对,不然不在容器内.
     3.  如果不显示滚动条, 在.scroller加上 overflow: hidden;
     4. 注意css文件是否是动态嵌入,如果是,要延时一下,再new iScroll(), 不然有可能因为没有加载css文件 ,从而.scroller高度为0.不显示滚动条.
	 */
	function loaded(pageinto,opts) {
            var myScroll,pullDownEl, pullDownOffset,
            pullUpEl, pullUpOffset

        var options={type:"3"}//1.为不能滚动,2.为上下拖拽不能刷新,3.为类似微博模式
        if(!isNaN(opts.type))options.type=opts.type;
        /**
         * 下拉刷新 （自定义实现此方法）
         * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
         */
        function pullDownAction () {
            ryan.syswin.app[$(pageinto).attr("id")]().update(function(el, e){
                if(e.result=="success"){
                    var ind=$(pageinto).find(".index_noData");
                    if(ind)ind.remove();
                    $(pageinto).find(".Rthelist").prepend(el);
                }else{
                    $(pageinto).find(".Rthelist").html(el);
                }
                myScroll.refresh();		//数据加载完成后，调用界面更新方法
            });

        }

        /**
         * 滚动翻页 （自定义实现此方法）
         * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
         */
        function pullUpAction () {
            ryan.syswin.app[$(pageinto).attr("id")]().update(function(el, e){
                if(e.result=="success"){
                    var ind=$(pageinto).find(".index_noData");if(ind)ind.remove();
                    $(pageinto).find(".Rthelist").append(el);
                }else{
                    $(pageinto).find(".Rthelist").html(el);
                }
                pullUpEl.style.visibility="hidden";
                myScroll.refresh();		// 数据加载完成后，调用界面更新方法
            });

        }
	    if(options&&options.type=="1"){
//          myScroll = new iScroll(pageinto.querySelector(".wrapper"), {
//              RScroller: 'Rscroller',
//              hScroll: false, vScroll: false,//禁用各方向的滚动条
//              hScrollbar:false,//隐藏水平方向的滚动条。
//              vScrollbar:false,//隐藏垂直方向的滚动条。
//              momentum:false//是否有惯性
//			})
			//$(pageinto).find(".wrapper").css({position:"static"});//解决滚动重叠
		   	var MyScroll=function(){//重写对象，不做iscroll控制
		   		this.scrollToElement=function(target){
                    var topScroll=$(target).offset().top-$(".Rwrapper").offset().top;
                    $(".Rwrapper").scrollTop(topScroll);
                };
				this.refresh=function(){};
                this.destroy=function(){};
		   	}

            $(pageinto.querySelector(".Rwrapper")).css({"overflow-y":"auto","overflow-x":"hidden"});
		   	myScroll=new MyScroll(); 	    	
		  	return myScroll;
		}
		
		pullDownEl = $(pageinto).find('.pullDown')[0];
		pullUpEl = $(pageinto).find('.pullUp')[0];
		
		if((options&&options.type=="2")||(!pullDownEl&&!pullUpEl)){
            pullDownEl = document.createElement('div');
            pullUpEl =document.createElement('div');

            myScroll = new iScroll(pageinto.querySelector(".Rwrapper"), {
		        RScroller: 'Rscroller',
		        fixedScrollbar:false,//在IOS中拖动滚动条的时候可能会使内容（或滚动条，）缩小，设置该参数为true可防止该现象。同样适用于Android。Android默认为true，IOS默认为FALSE。
		        click: true,
		        tap: true,
		        mouseWheel: true,
		        scrollbars: true,
		        probeType: 2,
		        momentum:true,//是否有惯性
		        //bounce:false,//是否拖出界面
                vScrollbar:false//隐藏竖滚动条
		        });
		     return myScroll;
	    }
		
		    pullUpOffset = pullUpEl.offsetHeight;
		    pullDownOffset = pullDownEl.offsetHeight;
		   // pullUpEl.style.visibility="hidden";
		
		
		myScroll = new iScroll(pageinto.querySelector(".Rwrapper"), {
		    RScroller: 'Rscroller',
		    //fixedScrollbar:false,//在IOS中拖动滚动条的时候可能会使内容（或滚动条，）缩小，设置该参数为true可防止该现象。同样适用于Android。Android默认为true，IOS默认为FALSE。
		    click: true,
		    tap: true,
		    mouseWheel: true,
		    scrollbars: true,
		    probeType: 2,
		    momentum:true,
		    //bounce:false,//是否拖出界面
		
		    useTransition: true,
		    topOffset: pullDownOffset,
            vScrollbar:false,//隐藏竖滚动条
		
		    onRefresh: function () {
		        if (pullDownEl.className.match('Rloading')) {
		            pullDownEl.className = 'pullDown';
		            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
		        } else if (pullUpEl.className.match('Rloading')) {
		            pullUpEl.className = 'pullUp';
		            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
		        }
		    },
		    onScrollStart:function(){
		        pullUpEl.style.display="block";
		        pullUpEl.style.visibility="visible";
		    },
		    onScrollMove: function () {
		        if (this.y > 5 && !pullDownEl.className.match('flip')) {
		            pullDownEl.className = 'pullDown flip';
		            pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
		            this.minScrollY = 0;
		        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
		            pullDownEl.className = 'pullDown';
		            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
		            this.minScrollY = -pullDownOffset;
		        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
		            pullUpEl.className = 'pullUp flip';
		            pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
		            this.maxScrollY = this.maxScrollY;
		        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
		            pullUpEl.className = 'pullUp';
		            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
		            this.maxScrollY = pullUpOffset;
		
		        }
		    },
		    onScrollEnd: function () {
		        if (pullDownEl.className.match('flip')) {
		            pullDownEl.className = 'pullDown Rloading';
		            pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
		            pullDownAction();	// Execute custom function (ajax call?)
		        } else if (pullUpEl.className.match('flip')) {
		            pullUpEl.className = 'pullUp Rloading';
		            pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
		            pullUpAction();	// Execute custom function (ajax call?)
		        }
		    }
		});
		return myScroll;
    }
    return{
        init:function(pginto,opts) {
            var scrollobject=loaded(pginto,opts);
            scrollobject.type=opts.type;
        	return scrollobject;
        }     
    }
})
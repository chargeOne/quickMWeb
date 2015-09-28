define(['backbone', 'text!publish_sell/modules/fangyuantupian/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        $selfPage:null,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();

        },
        initPages:function(){
            this.$selfPage=$("#fangyuantupian");
            /*浮层--点击图片取消
            var $cancel_pic = $("#mark").find(".mui-btn");
            $cancel_pic.on("click",function(){
                mui('#mark').popover('hide');
                $(".mui-backdrop.mui-backdrop-action.mui-active").remove();
            });*/
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'click #fangyuantupian #Rthelist .conMs li .centerImg':'uploadPic',//点击上传图片
            'click #fangyuantupian #mark .mui-content-padded a':'cancelLayer',//点击取消按钮，取消浮层
           'click #fangyuantupian #Rthelist .tabBox li':'tabBtn'//切换实勘图与户型图
          //  'click #fangyuantupian #Rthelist .conMs li a':'viewPic'//点击浏览图片
			//'click #fangyuantupian #mark #camera':'cameraFun'
        },
        render: function (e) {
            if(this.collection){
                if(e.result=="success"){
                    $(this.el).html(this.template({data: this.collection.toJSON()}));
                }else{
                    $(this.el).html('<div class="nearby_noData">数据加载不成功</div>');
                    $(this.el).find(".nearby_noData").height(window.innerHeight+60+"px");
                }
            }else if(this.model){
                if(e.result=="success"){
                    $(this.el).html(this.template(this.model.toJSON()));
                }else {
                    $(this.el).html('<div class="nearby_noData">数据加载不成功</div>');
                    $(this.el).find(".nearby_noData").height(window.innerHeight+60+"px");
                }
            }
            $(this.el).attr("id",new Date().getTime());//设置一个可识别的单元块id
            this.trigger("fangyuantupian:render", {result:e.result,data: e.data});
            this.stickitData();
            return this;
        },
        cameraFun:function(){
			alert(0);
            Mwap.events.trigger(Mwap.eventTypes.camera,{size:"60x60",device:"iPhone6"});
            ryan.syswin.app.MwapFun.cameraFun();
        },
        stickitData:function(){//将local storage中的缓存数据填入表格
            var tempData = ryan.syswin.app.global.user;
            var $see = this.$selfPage.find("#Rthelist").find(".shikantu");
            var $unit = this.$selfPage.find("#Rthelist").find(".huxingtu").find(".conMs");
            var seeCell='<ol class="conMs">';
            var unitCell='';
            var that =this;

            var pic_see_url=tempData.getTempData("fabuchushou_bt","pic_see_url");
            var pic_unit_url=tempData.getTempData("fabuchushou_bt","pic_unit_url");

            var seeNum = 0;
            //实勘图
            if(pic_see_url != undefined){
                seeNum = pic_see_url.length;
                $(pic_see_url).each(function(i,v){
                    if(i%3 == 0 && i != 0){
                        seeCell += '</ol><ol class="conMs">';
                    }
                    seeCell +='<li data-id="'+ v.id+'" data-index="'+i+'"><a href="#"><img src="'+ v.url+'" /></a></li>';
                });
                if(seeNum%3 == 0 && seeNum != 0){
                    seeCell += '</ol><ol class="conMs">';
                }
            }
            seeCell += '<li><img class="centerImg" src="/html/secHouse/project/images/addBTn.png"/></li>';
            seeCell += '</ol>';
            $see.html("");
            $see.html(seeCell);
            //实勘图数量
            var $see_title = this.$selfPage.find("#Rthelist").find(".tabBox").find("li:nth-child(1)").find("a");
            $see_title.html("实勘图("+seeNum+")");
            //户型图
            if(pic_unit_url != undefined){
                unitCell +='<li data-id="'+pic_unit_url.id+'"><a href="#"><img src="'+ pic_unit_url.url+'" /></a></li>';
            }
            unitCell += '<li><img class="centerImg" src="/html/secHouse/project/images/addBTn.png"/></li>';
            $unit.html("");
            $unit.html(unitCell);

        },
        uploadPic:function(e){
            mui('#mark').popover('toggle');
            var $bg=$(".mui-backdrop.mui-backdrop-action.mui-active").clone();
                $(".mui-backdrop.mui-backdrop-action.mui-active").remove();
                $('#mark').parent().append($bg);

            $bg.one("click",function(){
                mui('#mark').popover('hide');
                $(".mui-backdrop.mui-backdrop-action.mui-active").remove();
            });
			//
			document.querySelector('#camera').onclick=function(){
				alert(typeof Mwap);
			}
        },
        cancelLayer:function(e){

            mui('#mark').popover('hide');
            $(".mui-backdrop.mui-backdrop-action.mui-active").remove();
        },
        tabBtn:function(e){
            var $parentBtn = $(e.currentTarget);

            $parentBtn.each(function (i) {
                if((!$(this).hasClass("active"))) {
                    $(this).addClass("active");
                    $(this).siblings().removeClass("active");
                }
                var li_text = $(this).text();
                if(li_text.indexOf("实") >= 0){

                    $parentBtn.parents(".topTab").siblings(".shikantu").css("display","block");
                    $parentBtn.parents(".topTab").siblings(".huxingtu").css("display","none");
                }else if(li_text.indexOf("户") >= 0){
                    $parentBtn.parents(".topTab").siblings(".huxingtu").css("display","block");
                    $parentBtn.parents(".topTab").siblings(".shikantu").css("display","none");
                }

            });

        },
        viewPic:function(e){
            var $parentBtn = $(e.currentTarget);
            var index = $parentBtn.parent("li").data("index");

            ryan.syswin.app.loadPage("tupianliulan",index);
        }

    });
    return nearbyView;
});
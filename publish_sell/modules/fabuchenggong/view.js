define(['backbone', 'text!publish_sell/modules/fabuchenggong/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        fbcsid:null,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();

        },
        initPages:function(){
            var resource = ryan.syswin.app.getPhpParam()["resource"];
            if(resource == 6){//从php跳转过来 需要赋值本地
                ryan.syswin.app.global.user.setClone();
            }
            var that = this;
            this.fbcsid = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");//发布出售id


            var $fuceng = $(".popcon").find(".btn").find("a");
            $($fuceng).off();
            $($fuceng).on("click",function(e){
                var $parentBtn = $(e.currentTarget);
                var $childBtn = $(e.target);
                var currentClassname = $parentBtn[0].className;

                if(currentClassname == "complete"){
                    //调用php接口，改变上架状态: 2:上架 1：下架
                    var type = 1;//上下架状态
                    var data = "id="+that.fbcsid+"&type="+type;
                    if(that.fbcsid != undefined){
                        $.ajax({
                            url:"http://mobile.fangtoon.com/index.php?r=Sale/HouseStatus",
                            type:"get",
                            data:data,
                            dataType:"json",
                            success:function(msg){
                                if(msg.code == 1){
                                    ryan.syswin.app.loadPage("tijiaochenggong");
                                }else if(msg.code == -1){
                                    ryan.syswin.app.loadPage("shangjiashibai","-1");
                                }else if(msg.code == -2){
                                    ryan.syswin.app.loadPage("shangjiashibai","-2");
                                }else{
                                    ryan.syswin.app.loadPage("shangjiashibai");
                                }
                            },
                            error:function(){
                                ryan.syswin.app.dialog("出错了，请联系管理员！");
                            }
                        });
                    }else{
                        window.location.href="#&publish_sell/fabuchushou_bt.html";
                    }
                }
                $("#fabuchenggong").find(".pop").css("display","none");

            });
            this.fbczyl();
        },
        fbczyl:function(){
            var $ylBtn = $("#RHeader").find("a:nth-child(3)");
            var that = this;

            $ylBtn.off();
            $ylBtn.on("click",function(){
                console.log("预览");
                ryan.syswin.app.global.user.createClone();
                window.location.href=location.origin+"/index.php?r=sellinfo/index&id="+that.fbcsid+"&types=6";
            })
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'click .shangjia':'shangjia_Fun',//点击上架
            'click #fabuchenggong #Rthelist .edit ':'backEdit',//继续编辑
            'click #fabuchenggong #Rthelist #fyyl':'fyylFun'
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
            this.trigger("fabuchenggong:render", {result:e.result,data: e.data});
            this.setPer();
            this.stickitData();
            return this;
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var per =  ryan.syswin.app.global.user.getTempData("fabuchushou_bt","per");

            var $round=$("#fabuchenggong").find("#roundchart");
            var Round=ryan.syswin.app.chart.round;
            new Round().create($round[0],"#cc0000",per);
        },
        setPer:function(){
            var $per_circle = $("#fabuchenggong").find(".bigcircle");

//            var per =  ryan.syswin.app.global.user.getTempData("fabuchushou_bt","per");
//            console.log("perperperperperperperper",per);
//            if(!per){
//                console.log("1212");
//                per = ryan.syswin.app.getPercent.fbcgPercent("fabuchushou_bt","fabuchushou_xt");
//                ryan.syswin.app.global.user.setTempData("fabuchushou_bt","per",per);
//                console.log("121212555",per);
//            }

            var per = ryan.syswin.app.getPercent.fbcgPercent("fabuchushou_bt","fabuchushou_xt");
            if(per != 0){
                ryan.syswin.app.global.user.setTempData("fabuchushou_bt","per",per);
            }
            per =  ryan.syswin.app.global.user.getTempData("fabuchushou_bt","per");


            //ryan.syswin.app.global.user.setTempData("fabuchenggong","per",per);
//            if(per == "100%"){
//                $per_circle.addClass("green");
//            }else if(per == "0%"){
//                ryan.syswin.app.loadPage("fabuchushou_bt");//不能直接进入发布成功页面
//            }
//            $per_circle.html(per);
            var $round=$("#fabuchenggong").find("#roundchart");
            var Round=ryan.syswin.app.chart.round;
            new Round().create($round[0],"#cc0000",per);
        },
        shangjia_Fun:function(e){
            var $shangjia_btn = $(e.currentTarget);
            var $childBtn = $(e.target);
            var $fuceng = $("#fabuchenggong").find(".pop");
            $fuceng.css("display","block");

        },
        backEdit:function(e){
            //window.location.href = location.origin + "/html/secHouse/publish_sell.html#&publish_sell/fabuchushou_bt.html?id="+this.fbcsid+"&pedit=1";
            ryan.syswin.app.loadPage("fabuchushou_bt","edit");
        },
        fyylFun:function(){
            ryan.syswin.app.global.user.createClone();
            window.location.href=location.origin+"/index.php?r=sellinfo/index&id="+this.fbcsid+"&types=6";
        }
    });
    return nearbyView;
});
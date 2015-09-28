define(['backbone', 'text!publish_rent/modules/tijiaochenggong/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();

        },
        initPages:function(){

            var $shangjia_btn = $(".shangjia");
            var $fuceng = $("#fabuchenggong").find(".pop");
            var $fc_btn = $fuceng.find(".btn").find("a");

            $shangjia_btn.on("click",function(e){
                $fuceng.css("display","block");

                if($fc_btn.className == "complete"){
                    ryan.syswin.app.loadPage("tijiaochenggong");
                }else if($fc_btn.className == "cancel"){
                    $fuceng.css("display","none");
                }
                console.log($shangjia_btn);

            })
            this.fyyl();
        },
        fyyl:function(){
            var $ylBtn = $("#RHeader").find("a:nth-child(3)");
            var fbcsid=ryan.syswin.app.global.user.getTempData("fabuchuzu_bt","fabuchuzuid");//发布出租id
            //fbcsid = 56193;
            $ylBtn.off();
            $ylBtn.on("click",function(){
                window.location.href=location.origin+"/index.php?r=rentinfo/index&id="+fbcsid;
            })
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'touchstart .cont .footerBar a':'onpress_Fun',//点赞，点踩，点收藏(按下)
            'touchstart .cont dl':'onpress_Fun',//进入正文区(按下)
            'touchstart .cont .picBox':'onpress_Fun'//进入正文区(按下)
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
            this.trigger("tijiaochenggong:render", {result:e.result,data:e.data});
            return this;
        },
        onpress_Fun:function(e){
            var $parentBtn=$(e.currentTarget);
            $parentBtn.toggleClass('adfActive');
            $parentBtn.one("touchend",function(){
                $parentBtn.toggleClass('adfActive');
            })
        }


    });
    return nearbyView;
});
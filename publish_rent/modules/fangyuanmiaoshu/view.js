define(['backbone', 'text!publish_rent/modules/fangyuanmiaoshu/view.html'], function (Backbone, nearbyViewTemplate) {
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
            var $fuceng = $(".popcon").find(".btn").find("a");

            $($fuceng).on("click",function(e){
                var $parentBtn = $(e.currentTarget);
                var $childBtn = $(e.target);
                var currentClassname = $parentBtn[0].className;

                if(currentClassname == "complete"){
                    ryan.syswin.app.loadPage("tijiaochenggong");
                }
                $("#fabuchenggong").find(".pop").css("display","none");

            })

        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'click #fangyuanmiaoshu a.blue':'fyms_fun'//

        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var tempData = ryan.syswin.app.global.user;
            var info=tempData.getTempData("fabuchuzu_xt","fangyuanmiaoshu");
            info = ryan.syswin.app.inputIsNull(info)?info:"";
            $("#fangyuanmiaoshu").find(".TextField").val(info)
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
            this.trigger("fangyuanmiaoshu:render", {result:e.result,data: e.data});
            this.stickitData();
            return this;
        },
        fyms_fun:function(e){
            var $shangjia_btn = $(e.currentTarget);
            var $childBtn = $(e.target);
            var info=$("#fangyuanmiaoshu").find(".TextField").val();

            ryan.syswin.app.global.user.setTempData("fabuchuzu_xt","fangyuanmiaoshu",info);
            ryan.syswin.app.loadPage("fabuchuzu_xt");

        }

    });
    return nearbyView;
});
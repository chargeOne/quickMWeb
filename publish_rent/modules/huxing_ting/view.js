define(['backbone', 'text!publish_rent/modules/huxing_ting/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        delayId:0,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();

        },
        initPages:function(){
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'click #huxing_ting .cyList li':'li_subMenu'
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
            this.trigger("huxing_ting:render", {result:e.result,data:e.data});
            this.stickitData();
            return this;
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var $bt_li =  $("#huxing_ting").find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;

            var pianqu=tempData.getTempData("fabuchuzu_bt","huxing_ting");

            $bt_li.each(function(i,v) {
                var li_text = $(v).text().replace(/\s/gi, '');
                if (pianqu&&pianqu!=""&&pianqu.indexOf(li_text) != -1) {
                    $(v).find("span").addClass("selected");
                    // $(v).css({"background-color": "#fc8c2c"});
                }
            })
        },
        li_subMenu:function(e){
            var $parentBtn=$(e.currentTarget);
            var $childBtn = $(e.target);
            var huxing_ting_value = $childBtn.text().replace(/\s/gi,'');
            if(huxing_ting_value == "无"){
                huxing_ting_value = "0厅";
            }

            $parentBtn.parents().children("li").each(function(i,v){
                $(v).find("span").removeClass("selected");
            });

            $childBtn.children("span").addClass("selected");
            $childBtn.children("span").css('pointer-events','none');
            //将户型信息写入localStorage
            ryan.syswin.app.global.user.setTempData("fabuchuzu_bt","huxing_ting",huxing_ting_value);

            clearTimeout(this.delayId);
            this.delayId=setTimeout(function(){
                ryan.syswin.app.loadPage("huxing_wei");
            },800);

            e.stopPropagation();
            e.preventDefault();

        }


    });
    return nearbyView;
});
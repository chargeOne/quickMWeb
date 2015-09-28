define(['backbone', 'text!publish_sell/modules/shi/view.html'], function (Backbone, nearbyViewTemplate) {
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

            'click #shi .cyList li':'li_subMenu'//选择几室
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var $bt_li =  $("#shi").find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;

            var pianqu=tempData.getTempData("fabuchushou_bt","shi");

            $bt_li.each(function(i,v) {
                var li_text = $(v).text().replace(/\s/gi, '');
                if (pianqu&&pianqu!=""&&pianqu.indexOf(li_text) != -1) {
                    $(v).find("span").addClass("selected");
                    // $(v).css({"background-color": "#fc8c2c"});
                }
            })
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
            this.trigger("shi:render", {result:e.result,data:e.data});
            this.stickitData();
            return this;
        },
        li_subMenu:function(e){
            var $parentBtn=$(e.currentTarget);
            var $childBtn = $(e.target);
            var shi_value = $childBtn.text().replace(/\s/gi,'');

            $parentBtn.parents().children("li").each(function(i,v){
                $(v).find("span").removeClass("selected");
            });

            $childBtn.children("span").addClass("selected");
            $childBtn.children("span").css('pointer-events','none');

            //将户型信息写入localStorage
            ryan.syswin.app.global.user.setTempData("fabuchushou_bt","shi",shi_value);
            //setTimeout('ryan.syswin.app.loadPage("ting")',800);

            var that=this;
            clearTimeout(that.delayId);
            that.delayId=setTimeout(function(){
                ryan.syswin.app.loadPage("ting");
            },800);

            e.stopPropagation();
            e.preventDefault();

        }

    });
    return nearbyView;
});
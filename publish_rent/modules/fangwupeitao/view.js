
define(['backbone', 'text!publish_rent/modules/fangwupeitao/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        delayIds:0,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();

        },
        initPages:function(){
            this.$selfPage=$("#fangwupeitao");
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            //'click #chaoxiang .cyList li':'li_subMenu'//点击片区
            'click #fangwupeitao a.blue':'zsss_fun'//点击下一步
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
            this.trigger("fangwupeitao:render", {result:e.result,data: e.data});
            this.stickitData();
            return this;
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var $bt_li =  this.$selfPage.find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;
            var baohanzujin=tempData.getTempData("fabuchuzu_xt",this.$selfPage.attr("id"));

            $bt_li.each(function(i,v) {
                var li_text = $(v).text().replace(/\s/gi, '');
                var sected=$(v).find("input");
                if (baohanzujin&&baohanzujin!=""&&baohanzujin.indexOf(li_text) != -1) {
                    sected.prop('checked',true)
                }
            })
        },
        li_subMenu:function(e){

            var $parentBtn = $(e.currentTarget);
            var $childBtn = $(e.target);
            var cx_name = $childBtn.text().replace(/\s/gi,'');

            $parentBtn.parents().children("li").each(function(i,v){
                $(v).find("span").removeClass("selected");
            });

            $childBtn.children("span").addClass("selected");
            $childBtn.children("span").css('pointer-events','none');
            //将片区名称写入localStorage
            ryan.syswin.app.global.user.setTempData("fabuchuzu_xt","chaoxiang",cx_name);

            clearTimeout(this.delayId);
            this.delayId = setTimeout(function(){
                    ryan.syswin.app.loadPage("fabuchuzu_xt");
            },800);

            e.stopPropagation();
            e.preventDefault();

        },
        zsss_fun:function(e){
            var that=this;
            that.selectCon="";
            that.selectId="";
            $("#fangwupeitao").find("input[name='checkbox']").each(function(i) {
                if ($(this).prop('checked')) {
                    var temp_zsss_name = $(this).siblings("label").text();
                    var temp_zsss_id = $(this).siblings("label").data("id");
                    that.selectCon+=temp_zsss_name+",";
                    that.selectId+=temp_zsss_id+",";
                }
            });

            this.selectCon=this.selectCon.substr(0,this.selectCon.length-1);
            this.selectId=this.selectId.substr(0,this.selectId.length-1);

            //将户型信息写入localStorage
            ryan.syswin.app.global.user.setTempData("fabuchuzu_xt","fangwupeitao",this.selectCon+"&"+this.selectId);
            ryan.syswin.app.loadPage("fabuchuzu_xt");
        }

    });
    return nearbyView;
});
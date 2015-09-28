define(['backbone', 'text!publish_rent/modules/fangyuanbiaoqian/view.html'], function (Backbone, nearbyViewTemplate) {
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
            this.$selfPage=$("#fangyuanbiaoqian");
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'click #fangyuanbiaoqian #Rthelist a.blue':'next_step'
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
            this.trigger("fangyuanbiaoqian:render", {result:e.result,data: e.data});
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
        next_step:function(e){
            var that=this;
            that.selectCon="";
            var temp_fybq_name='';
            var temp_fybq_value='';
            $("#fangyuanbiaoqian").find("input[name='checkbox']").each(function(i) {
                if ($(this).prop('checked')) {
                    temp_fybq_name += $(this).siblings("label").text()+",";
                    temp_fybq_value += $(this).val()+",";
                }
            });
            this.selectCon = temp_fybq_name.substr(0,temp_fybq_name.length-1) +"&"+temp_fybq_value.substr(0,temp_fybq_value.length-1);
            //将户型信息写入localStorage
            ryan.syswin.app.global.user.setTempData("fabuchuzu_xt","fangyuanbiaoqian",this.selectCon);
            ryan.syswin.app.loadPage("fabuchuzu_xt");


        }

    });
    return nearbyView;
});
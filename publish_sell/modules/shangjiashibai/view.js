
define(['backbone', 'text!publish_sell/modules/shangjiashibai/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        delayIds:0,
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

        },
        setFailMsg:function(){
            this.$selfPage=$("#shangjiashibai");
            //获取失败状态码
            var failed = this.$selfPage.data("inpage-params");
            //failed = -2;
            var $warn_msg = this.$selfPage.find("#Rthelist").find(".xqcenter");
            var warn_msg = "";
            if(failed == "-1"){
                warn_msg = "上架失败，房源已被上架";
            }else if(failed == "-2"){
                warn_msg = "上架失败，您的房源信息存在非法词汇";
                this.$selfPage.find("#Rthelist").find(".liulanfangyuan").css("display","none");
            }else{
                warn_msg = "操作失败";
            }
            $warn_msg.text(warn_msg);
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            //'click #zuqi .cyList li':'li_subMenu'//点击片区
            'click #shangjiashibai #Rthelist .liulanfangyuan':'llfyFun',
            'click #shangjiashibai #Rthelist .jubao':'jubaoFun'
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
            this.trigger("shangjiashibai:render", {result:e.result,data: e.data});
            this.setFailMsg();
            return this;
        },
        llfyFun:function(){
            var fbcsid=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");
            window.location.href=location.origin+"/index.php?r=sellinfo/index&id="+fbcsid;
        },
        jubaoFun:function(){
            var fbcsid=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");
            window.location.href=location.origin+"/index.php?r=sellinfo/jubao&id="+fbcsid;
        }

    });
    return nearbyView;
});
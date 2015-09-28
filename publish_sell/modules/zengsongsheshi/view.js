define(['backbone', 'text!publish_sell/modules/zengsongsheshi/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        selectCon:"",
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
            'click #zengsongsheshi .cyList li .check':'sel_zengsongsheshi',//选择赠送设施其他
            'click #zengsongsheshi a.blue':'zsss_fun'//点击下一步
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var $bt_li =  $("#zengsongsheshi").find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;
            var pianqu=tempData.getTempData("fabuchushou_xt","zengsongsheshi");
            $("#zengsongsheshi").find(".addInp").hide();

            $bt_li.each(function(i,v) {
                var li_text = $(v).text().replace(/\s/gi, '');
                var sected=$(v).find("input")
                if (pianqu&&pianqu!=""&&pianqu.indexOf(li_text) != -1) {
                    sected.prop('checked',true)
                    if(sected.attr("id")=="check5"){
                        $("#zengsongsheshi").find(".addInp").show();
                        $("#zengsongsheshi").find(".addInp").find("textarea").val(pianqu.split(":")[1]);
                    }
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
            this.trigger("zengsongsheshi:render", {result:e.result,data:e.data});
            this.stickitData();
            return this;
        },
        sel_zengsongsheshi:function(e){
            var $parentBtn = $(e.currentTarget);
            var $childBtn = $(e.target);

            if($parentBtn.attr("id")=="check5"){
                if ($parentBtn.prop('checked')) {
                    $("#zengsongsheshi").find(".addInp").show();
                }else{
                    $("#zengsongsheshi").find(".addInp").hide();
                }
            }
            e.stopPropagation();
        },
        zsss_fun:function(e){
            var that=this;
            that.selectCon="";
            var other="";
            $("#zengsongsheshi").find("input[name='checkbox']").each(function(i) {
                if ($(this).prop('checked')) {
                    var temp_zsss_name = $(this).siblings("label").text();
                    that.selectCon+=temp_zsss_name+",";
                    other=$("#zengsongsheshi").find(".addInp").find("textarea").val() == undefined?"":$("#zengsongsheshi").find(".addInp").find("textarea").val();
                }
            });
            //var
            this.selectCon=this.selectCon.substr(0,this.selectCon.length-1);

            //其他
            if(this.selectCon && other){
                this.selectCon+=":"+other;
            }

            //将户型信息写入localStorage
            ryan.syswin.app.global.user.setTempData("fabuchushou_xt","zengsongsheshi",this.selectCon);
            ryan.syswin.app.loadPage("fabuchushou_xt");
        }

    });
    return nearbyView;
});
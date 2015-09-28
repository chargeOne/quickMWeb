
 /*
*@author ryan.zhu<136248.syswin.com>
* 行政区
*/
define(['backbone', 'text!publish_sell/modules/xingzhengqu/view.html'], function (Backbone, ViewTemplate) {
    var byView = Backbone.View.extend({
        template: _.template(ViewTemplate),
        initialize: function () {
            if( this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if( this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();
        },
        initPages: function(){
            
        },
        events : {
            'click #xingzhengqu .cyList li':'li_subMenu'
        },
        render: function (e) {
            if(this. collection){
                if(e. result== "success"){
                    $(this.el).html(this.template({data: this.collection.toJSON()}));
                }else{
                    $(this.el).html('<div class="nearby_noData">数据加载不成功</div>');
                    $(this.el).find(".nearby_noData").height(window.innerHeight+60+ "px" );
                }
            }else if (this. model){
                if(e. result== "success"){
                    $(this.el).html(this.template(this.model.toJSON()));
                }else {
                    $(this.el).html('<div class="nearby_noData">数据加载不成功</div>');
                    $(this.el).find(".nearby_noData").height(window.innerHeight+60+"px" ) ;
                }
            }
            $(this.el).attr("id",new Date ().getTime());//设置一个可识别的单元块id
            this.trigger("xingzhengqu:render", {result:e.result,data: e.data} );
            this.stickitData();
            return this;
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var $bt_li =  $("#xingzhengqu").find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;

            var xingzhengqu=tempData.getTempData("fabuchushou_bt","xingzhengqu");

            $bt_li.each(function(i,v) {
                var li_text = $(v).text().replace(/\s/gi, '');

                if (xingzhengqu&&xingzhengqu!=""&&xingzhengqu.indexOf(li_text) != -1&&li_text) {
                    $(v).css({"background-color": "#fc8c2c"});
                }
            })
        },
        li_subMenu:function( e){
            var $parentBtn=$(e. currentTarget);
            var $childBtn = $(e.target);
            var xzq_name = $childBtn.text().replace(/\s/gi,'');
            var xzq_id = $parentBtn.data("district_id");

            var tempData = ryan.syswin.app.global.user;
            //当行政区改变，清空片区
            var pre_xingzhengqu = tempData.getTempData("fabuchushou_bt","xingzhengqu");
            if(pre_xingzhengqu && pre_xingzhengqu.split("&")[1] != xzq_id){
                tempData.setTempData("fabuchushou_bt","pianqu","");
            }

            //将选定的行政区写入local Storage
            tempData.setTempData("fabuchushou_bt","xingzhengqu",xzq_name+"&"+xzq_id);
            ryan.syswin.app.loadPage("pianqu");

            e.stopPropagation();
            e.preventDefault();
        }

    });
    return byView;
});
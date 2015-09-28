
/*
 *@author ryan.zhu<136248.syswin.com>
 *
 */
define(['backbone', 'text!publish_sell/modules/fangwuweizhi/view.html'], function (Backbone, ViewTemplate) {
    var byView = Backbone.View.extend({
        template: _.template(ViewTemplate),
        $selfPage:null,
        initialize: function () {
            if( this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if( this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();
        },
        initPages: function( ){
            this.$selfPage=$("#fangwuweizhi");
        },
        stickitData:function(){//将local storage中的缓存数据填入表格
            var $bt_li =  this.$selfPage.find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;
            var xiaoqumingcheng=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","xiaoqumingcheng");
            var loudonghao=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","loudonghao");
            var danyuanhao=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","danyuanhao");
            var taofanghao=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","taofanghao");

            //非空验证
            loudonghao = ryan.syswin.app.inputIsNull(loudonghao)?loudonghao:"请输入楼栋号<i class='Arrow'></i>";
            danyuanhao = ryan.syswin.app.inputIsNull(danyuanhao)?danyuanhao:"请输入单元号<i class='Arrow'></i>";
            taofanghao = ryan.syswin.app.inputIsNull(taofanghao)?taofanghao:"请输入套房号<i class='Arrow'></i>";


            $bt_li.each(function(i,v){
                var li_text = $(v).find("label").text().replace(/\s/gi,'');
                if(li_text == "楼栋号"){
                    $(v).find("a").html(loudonghao);
                    $(v).one("click",function(){
                        ryan.syswin.app.loadPage("taofanghao","loudonghao");
                    })
                }else if(li_text == "单元号"){
                    $(v).find("a").html(danyuanhao);(loudonghao.indexOf("请输入楼栋号")!=-1)?$(v).hide():$(v).show();
                    $(v).one("click",function(){
                        ryan.syswin.app.loadPage("taofanghao","danyuanhao");
                    })
                }else if(li_text == "套房号"){
                    $(v).find("a").html(taofanghao);(danyuanhao.indexOf("请输入单元号")!=-1)?$(v).hide():$(v).show();
                    $(v).one("click",function(){
                        ryan.syswin.app.loadPage("taofanghao","taofanghao");
                    })
                }

            });
            //显示下一步按钮
            if((loudonghao.indexOf("请输入楼栋号") == -1) && (danyuanhao.indexOf("请输入单元号") == -1) && (taofanghao.indexOf("请输入套房号") == -1)){
                this.$selfPage.find("#Rthelist").find(".footerbtncon").show();
            }

        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.f()来填充主容器 'touchstart .cont .footerBar a':'onpress_Fun',//点赞，点踩，点收藏(按下) 'click .cont .picBox':'clickPicFun'//进入正文区
            'click #fangwuweizhi #Rthelist .footerbtncon .blue':'nextStep'
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
            this.trigger("fangwuweizhi:render", {result:e.result ,data: e.data});
            this.stickitData();
            return this;
        },
        onpress_Fun:function (e){
            var parentBtn=$(e. currentTarget);
            parentBtn.toggleClass('adfActive');
            parentBtn.one("touchend",function( ){
                parentBtn.toggleClass('adfActive');
            });
            parentBtn.one("touchmove",function( ){
                parentBtn.toggleClass('adfActive');
            });
            e.stopPropagation();
            e.preventDefault();
        },
        nextStep:function( e){
            ryan.syswin.app.loadPage("fabuchushou_bt");
            e.stopPropagation();
            e.preventDefault();
        }

    });
    return byView;
});
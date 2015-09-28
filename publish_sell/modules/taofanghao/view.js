
 /*
*@author ryan.zhu<136248.syswin.com>
*
*/
define(['backbone', 'text!publish_sell/modules/taofanghao/view.html'], function (Backbone, ViewTemplate) {
    var byView = Backbone.View.extend({
        template: _.template(ViewTemplate),
        goPage:null,
        initialize: function () {
            if( this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if( this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();
        },
        initPages: function( ){
        },
        /*
         * 导入设计师写的js代码
         * */
        formcodingScript:function(){
            var inp=$("#taofanghao").find("#inp")[0];
            inp.onfocus=function(){
                inp.value="";
                inp.style.textAlign="left";
                console.log("======================>>>",inp)
            }
            inp.onblur=function(){
                inp.value="请输入套房号搜索";
                inp.style.textAlign="center";
            }

        },
        getTileText:function(subPage){
            var titleText,pageName;
            var xiaoqumingcheng=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","xiaoqumingcheng").split("&")[0];
            var loudonghao=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","loudonghao");
            var danyuanhao=ryan.syswin.app.global.user.getTempData("fabuchushou_bt","danyuanhao");

            if(subPage=="loudonghao"){
                titleText="以下是"+xiaoqumingcheng;
                pageName="楼栋号"
            }else if(subPage=="danyuanhao"){
                titleText="以下是"+xiaoqumingcheng+loudonghao+"栋";
                pageName="单元号"
            }else if(subPage=="taofanghao"){
                titleText="以下是"+xiaoqumingcheng+loudonghao+"栋"+danyuanhao+"单元";
                pageName="套房号"
            }
            return {title:titleText,name:pageName};
        },
        saveTempData:function(subPage,value){
            switch (subPage){
                case "loudonghao":
                    ryan.syswin.app.global.user.setTempData("fabuchushou_bt","loudonghao",value);
                    break;
                case "danyuanhao":
                    ryan.syswin.app.global.user.setTempData("fabuchushou_bt","danyuanhao",value);
                    break;
                case "taofanghao":
                    ryan.syswin.app.global.user.setTempData("fabuchushou_bt","taofanghao",value);
                    break;
            }
        },
        setSearch:function(subPage){
            var that=this;
            var $subPage=$("#taofanghao");
            var getPageInfo=this.getTileText(subPage);
            $subPage.find(".Rwrapper").css({"display":"none"});
            $subPage.find(".xcmcTitle").html(getPageInfo.title);//改变title内容,三个楼栋号,单元号,套房号
            $($subPage.find(".hpHeader").children("a")[1]).html(getPageInfo.name);
            $subPage.find("#inp")[0].value="请输入"+getPageInfo.name+"搜索";

            var $input=$subPage.find("#inp");

            var $pop=$("#taofanghao").find(".mui-popover");
            if($pop)var $scroll=$pop.find(".mui-scroll");
            if($scroll)$scroll.empty();//清空上次结果
            var $xcmcTitle=$("#taofanghao").find(".xcmcTitle");
            if($xcmcTitle)$xcmcTitle.empty();//清空上次结果

            $input.one("click",function(e){//点击启动搜索框;
                    $subPage.find(".mui-popover").css({"display":"block"});
                    var appSearch= "";
                    //获取小区id
                    var xqmc = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","xiaoqumingcheng");
                    var xq_id = "";
                    if(xqmc.indexOf("&") != -1){
                        xq_id = xqmc.split("&")[1]; //---添加

                    }else{ //直接添加套房号
                        xq_id = "";
                    }
                    var subText="";
                    if(subPage == "loudonghao"){
                        appSearch=ryan.syswin.app.search(subPage,"r=Sale/Building&id="+xq_id);
                        subText="楼栋号";
                    }else if(subPage == "danyuanhao"){
                        appSearch=ryan.syswin.app.search(subPage,"r=Sale/Unit&id="+xq_id);
                        subText="单元号";
                    }else if(subPage == "taofanghao"){
                        appSearch=ryan.syswin.app.search(subPage,"r=Sale/Room&id="+xq_id);
                        subText="套房号";
                    }

                    appSearch.$input=$input;
                    appSearch.init($("#taofanghao"),function(view,data){
                        if(data.result=="success"){
                            $("#taofanghao").find(".mui-popover").css("display","block");

                            var ldh = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","loudonghao");
                            var dyh = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","danyuanhao");
                            switch (subPage){
                                case subPage == "loudonghao":
                                    $xcmcTitle.html("以下是"+xqmc.split("&")[0]+"小区的楼栋列表，请点击选择");
                                    break;
                                case subPage == "danyuanhao":
                                    //取出楼栋号
                                    $xcmcTitle.html("以下是"+xqmc.split("&")[0]+"小区"+ldh+"栋的单元列表，请点击选择");
                                    break;
                                case subPage == "taofanghao":
                                    //取出楼栋号
                                    $xcmcTitle.html("以下是"+xqmc.split("&")[0]+"小区"+ldh+"栋"+dyh+"单元的套房列表，请点击选择");
                                    break;
                            }
//                            if(subPage == "loudonghao"){
//                                $xcmcTitle.html("以下是"+xqmc.split("&")[0]+"小区的楼栋列表，请点击选择");
//                            }
                            $xcmcTitle.empty();
                            $scroll.empty();
                            $scroll.append(view.el);
                            view.bind("search:subClick",function(item){//点击列表选项
                                $subPage.find(".mui-popover").css({"display":"none"});
                                that.saveTempData(subPage,item.el.text());

                                if(subPage == "taofanghao"){
                                    ryan.syswin.app.loadPage("fabuchushou_bt");
                                }else{
                                    ryan.syswin.app.loadPage("fangwuweizhi");
                                }
                                appSearch.remove();
                            })

                        }else{
                            $xcmcTitle.html("暂无匹配"+subText+"，请点击新增");
                            $("#taofanghao").find(".mui-popover").css("display","block");
                            $scroll.html('<ul class="cyList"><li><div class="borderLine">新增\"'+$input.val()+'\"</div></li></ul>');
                            var userInput = $input.val();
                            $scroll.find(".cyList").find("li").one("click",function(){

                                that.saveTempData(subPage,userInput);
                                ryan.syswin.app.loadPage("fangwuweizhi");
                                appSearch.remove();
                            });


//                            $("#taofanghao").find(".mui-popover").css("display","none");
//                            $xcmcTitle.html("新增&nbsp"+'"'+$input.val()+'"');
//                            //将新增小区名称写入local storage
//                            that.saveTempData(subPage,$input.val());
//                            $xcmcTitle.one("click",function(){
//                                ryan.syswin.app.loadPage("fangwuweizhi");
//                                appSearch.remove();
//                            })
                        }

                   });
                    mui('.mui-scroll-wrapper').scroll();//刷新
            });
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器 'touchstart .cont .footerBar a':'onpress_Fun',//点赞，点踩，点收藏(按下) 'click .cont .picBox':'clickPicFun'//进入正文区
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
            this.trigger("taofanghao:render", {result:e.result,data:e.data});
            this.formcodingScript();

            this.setSearch($("#taofanghao").data("inpage-params")||"loudonghao");
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
        clickPicFun:function( e){
            var parentBtn = $(e.currentTarget);
            var childBtn = $(e.target);
            e.stopPropagation();
            e.preventDefault();
        }

    });
    return byView;
});
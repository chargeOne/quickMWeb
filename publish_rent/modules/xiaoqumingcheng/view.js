
 /*
*@author ryan.zhu<136248.syswin.com>
*
*/
define(['backbone', 'text!publish_rent/modules/xiaoqumingcheng/view.html'], function (Backbone, ViewTemplate) {
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
        initPages: function( ){
            
        },
        /*
         * 导入设计师写的js代码
         * */
        formcodingScript:function(){
            var inp=$("#xiaoqumingcheng").find("#inp")[0];
            inp.onfocus=function(){
                inp.value="";
                inp.style.textAlign="left";
            }
            inp.onblur=function(){
                inp.value="请输入小区名称搜索";
                inp.style.textAlign="center";
            }
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器 'touchstart .cont .footerBar a':'onpress_Fun',//点赞，点踩，点收藏(按下) 'click .cont .picBox':'clickPicFun'//进入正文区
        },
        setSearch:function(){
            $("#xiaoqumingcheng").find(".xcmcTitle").html("");
            $("#xiaoqumingcheng").find(".Rwrapper").css({"display":"none"});
            var $input=$("#xiaoqumingcheng").find("#inp");
            var cname = $input.val();

            var $pop=$("#xiaoqumingcheng").find(".mui-popover");
            if($pop)var $scroll=$pop.find(".mui-scroll");
            if($scroll)$scroll.empty();//清空上次结果

            var $xcmcTitle=$("#xiaoqumingcheng").find(".xcmcTitle");
            if($xcmcTitle)$xcmcTitle.empty();//清空上次结果

            /*模糊查询小区，添加城区 片区id*/
            var tempData = ryan.syswin.app.global.user;
            var xingzhengqu = tempData.getTempData("fabuchuzu_bt","xingzhengqu");
            var area_id = ryan.syswin.app.inputIsNull(xingzhengqu)?xingzhengqu.split("&")[1]:"";

            var pianqu = tempData.getTempData("fabuchuzu_bt","pianqu");
            var zone_id = ryan.syswin.app.inputIsNull(pianqu)?pianqu.split("&")[1]:"";
            var appSearch=ryan.syswin.app.search("xiaoqumingcheng","r=Sale/CommunityName&area_id="+area_id+"&zone_id="+zone_id);//调用search
            appSearch.$input=$input;
            
            $input.one("click",function(e){//点击启动搜索框;
                //$("#xiaoqumingcheng").find(".mui-popover").css({"display":"block"});

                appSearch.init($("#xiaoqumingcheng"),function(view,data){
                    $xcmcTitle.empty();
                    $scroll.empty();//清空上次结果
                    if(data.result=="success"){

                        $xcmcTitle.html("以下是匹配的小区，请点击选择");
                        $("#xiaoqumingcheng").find(".mui-popover").css("display","block");
                        $scroll.append(view.el);
                        view.bind("search:subClick",function(item){//点击列表选项
//                            $("#focus").find(".seachInp").addClass("initial");
                            $("#xiaoqumingcheng").find(".mui-popover").css({"display":"none"});
//                            $input.val("");
//                            moveItim(item.el);//移动搜索列表被点击项目
                            var xqmc = $(item.el).text();
                            var xqmc_id = $(item.el).data("community-id");
                            var xqmc_code = $(item.el).data("code");
                            //将新增小区名称写入local storage
                            ryan.syswin.app.global.user.setTempData("fabuchuzu_bt","xiaoqumingcheng",xqmc+"&"+xqmc_id+"&"+xqmc_code);
                            ryan.syswin.app.loadPage("fabuchuzu_bt");
                        })
                    }else{
                        //$("#xiaoqumingcheng").find(".mui-popover").css("display","none");
                        $xcmcTitle.html("暂无匹配小区，请点击新增");
                        $("#xiaoqumingcheng").find(".mui-popover").css("display","block");
                        $scroll.html('<ul class="cyList"><li><div class="borderLine">新增\"'+$input.val()+'\"</div></li></ul>');
                        var userInput = $input.val();
                        $scroll.find(".cyList").find("li").one("click",function(){
                            ryan.syswin.app.global.user.setTempData("fabuchuzu_bt","xiaoqumingcheng",userInput);//将新增小区名称写入local storage
                            ryan.syswin.app.loadPage("fabuchuzu_bt");
                        })
                    }
                });
                mui('.mui-scroll-wrapper').scroll();//刷新
            });
        },
        render: function (e) {
            var cname = $("#xiaoqumingcheng").find("#inp").val();
            console.log("========",cname);

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

            this.trigger("xiaoqumingcheng:render", {result:e.result,data:e.data});
            this.formcodingScript();
            this.setSearch();
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
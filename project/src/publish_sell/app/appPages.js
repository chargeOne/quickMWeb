/**
 * Created by ryan on 2015/1/13.
 * 目的:只负责page页的相关内容
 */
define(['require','appConfig','backbone','backbone_stickit','mobilebone','zepto_ext','isc_extend','mb_extend','ui_extend','context'],
    function (require,Config,Backbone,Backbone_stickit,Mobilebone,zepto_ext,isc_extend, mb_extend,ui_extend,Context) {
//        console.log("\n"+"Require:",require);
//        console.log("\n"+"Backbone:",Backbone);
//        console.log("\n"+"isc_extend:",isc_extend);
//        console.log("\n"+"Mobilebone:",Mobilebone);
//        console.log("\n"+"config:",Config);
//        console.log("\n"+"mb_extend:",mb_extend);
//        console.log("\n");
        /*ryan libs*/
        window.Mobilebone=Mobilebone;
        (function (nameSpace) {
            var app = function () {
                var that=this;
                var init = function () {
                    ui_extend.init();
                    window.addEventListener('resize', function() {//通过页面高度判断是否启用了软键盘
                        if(App.global.windowSize.height<App.global.windowSize.defaultHeight){
                            //$("#test").val(false);
                            var next=App.global.currentPage;
                            if(!App.global.isPageMoving){
                                setTimeout(function(){
                                    var cur=App.global.currentPage;
                                    //if(cur.id=="fubuchushou_bt"||cur.id=="fubuchushou_xt"){
                                        ryan.syswin.app.scroll.putDownScroll($(cur));
                                    //}
                                    ryan.syswin.app.global.keyboardStatus=false;
                                },100);
                            }

                        }else{
                            ryan.syswin.app.global.keyboardStatus=true;
                            //$("#test").val(true);
                        }
                        App.global.windowSize.width=window.innerWidth;
                        App.global.windowSize.height=window.innerHeight;
                    });

                    setTimeout(function(){
                        App.global.user=new (App.Rlocalstorage)();
                        //App.global.user.clear();//每次都重新建立一个本地缓存
                        App.global.user.remove("Ryan");
                        App.global.user.create("Ryan");
                        App.setDevice();

                        var model = Backbone.Model.extend({});
                        App.global.stickitMode=new model();

                        Mobilebone.init();
                        var param=App.getParam();
                        if(param==""||!param){//如果地址栏url无参
                            Mobilebone.ajax({
                                url: "publish_sell/"+ryan.syswin.config.pageList[0]+".html",
                                success: function() {
                                }
                            });
                        }
                    },100)

                }
                init();
                return{
                    footer: {
                        setVisilbe:function(pageinto){//根据内容判断是否显示pagefooter
                            var pageName=$(pageinto).attr("id");
                            var visibelpages=ryan.syswin.config.subpageList;
                            if(visibelpages.indexOf(pageName)!=-1){
                                $("#pageFooter").hide();
                            }else{
                                $("#pageFooter").show();
                            }
                        },
                        highLight: function (pageinto) {//是否高亮显示接口
                            var className=$(pageinto).attr("id");
                            var currClass = className;

                            var num = ryan.syswin.config.pageList.indexOf(className);
                            if (typeof className == "string" && num != -1) {//第一次进入页面的footer位置
                                currClass = ryan.syswin.config.footerMenuList[num];
                            }
                            var $footer=$("#pageFooter").find("li");
                            $("#pageFooter").find("li").forEach(function(item, index, array){
                                var clasName=item.className;
                                if(clasName.indexOf("Active")!=-1){
                                    var cls = item.className.split(" ");
                                    $(item).removeClass(cls[cls.length - 1]);
                                }
                            });
                            $("#pageFooter").find("li").forEach(function(item, index, array){
                                if(item.className.indexOf(currClass) != -1){
                                    var cls = item.className.split(" ");
                                    $(item).addClass(ryan.syswin.config.footerMenuList_Activs[index])
                                }
                            });
                        }
                    },
                    //(!添加模块必改!)
                    fabuchushou_bt:function(){
                        return{
                            init:function(callback){
                                //App.page.init('fabuchushou_bt',callback);
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('fabuchushou_bt',callback);
                            },
                            leave:function(callback){
                                App.page.leave('fabuchushou_bt',callback);
                            }
                        }
                    },
                    fabuchushou_xt:function(){
                        return{
                            init:function(callback){
                                //App.page.init('fabuchushou_xt',callback);
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('fabuchushou_xt',callback);
                            },
                            leave:function(callback){
                                App.page.leave('fabuchushou_xt',callback);
                            }
                        }
                    },
                    fabuchenggong:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('fabuchenggong',callback);
                            },
                            leave:function(callback){
                               /// App.page.leave('fabuchenggong',callback);
                            }
                        }
                    },
                    tijiaochenggong:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('tijiaochenggong',callback);
                            },
                            leave:function(callback){
                               /// App.page.leave('tijiaochenggong',callback);
                            }
                        }
                    },
                   xingzhengqu:function(){
                       return{
                           init:function(){
                               //Mobilebone.classAnimation = "slide";
                           },
                           update:function(callback){
                               App.page.update('xingzhengqu',callback,"r=Sale/Area&area_id=110000");
                           },
                           leave:function(callback){
                               ///App.page.leave('xingzhengqu',callback);
                           }
                       }
                   },
                   chaoxiang:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('chaoxiang',callback,"r=rent/Buildingorientation");
                            },
                            leave:function(callback){
                               /// App.page.leave('chaoxiang',callback);
                            }
                        }
                    },
                    pianqu:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slidedown";
                            },
                            update:function(callback){
                                //从local storage中获取行政区id
                                var area = App.global.user.getTempData("fabuchushou_bt","xingzhengqu");
                                var area_id = "";
                                if(area == undefined){
                                    App.loadPage("fabuchushou_bt");
                                }else{
                                    area_id = area.split("&")[1];
                                }
                                App.page.update('pianqu',callback,"r=Sale/Zone&area_id="+area_id);
                            },
                            leave:function(callback){
                               /// App.page.leave('pianqu',callback);
                            }
                        }
                    },
                    xiaoqumingcheng:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('xiaoqumingcheng',callback);
                            },
                            leave:function(callback){
                               /// App.page.leave('xiaoqumingcheng',callback);
                            }
                        }
                    },
                    zengsongsheshi:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('zengsongsheshi',callback,"r=Sale/PresentFacilities");
                            },
                            leave:function(callback){
                              ///  App.page.leave('zengsongsheshi',callback);
                            }
                        }
                    },
                    fangyuanbiaoqian:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('fangyuanbiaoqian',callback,"r=Sale/Tags");
                            },
                            leave:function(callback){
                              ///  App.page.leave('fangyuanbiaoqian',callback);
                            }
                        }
                    },
                    zhuangxiuchengdu:function(){
                        return{
                            init:function(){
                                //Mobilebone.classAnimation = "slide";
                            },
                            update:function(callback){
                                App.page.update('zhuangxiuchengdu',callback,"r=Sale/DecorateDegree");
                            },
                            leave:function(callback){
                               /// App.page.leave('zhuangxiuchengdu',callback);
                            }
                        }
                    },
                    taofanghao: function () {
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slide";
                            },
                            update: function (callback) {
                                App.page.update('taofanghao', callback);
                            },
                            leave: function (callback) {
                               /// App.page.leave('taofanghao',callback);
                            }
                        }
                    },
                    fangyuanmiaoshu: function () {
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slide";
                            },
                            update: function (callback) {
                                App.page.update('fangyuanmiaoshu', callback);
                            },
                            leave: function (callback) {
                              ///  App.page.leave('fangyuanmiaoshu',callback);
                            }
                        }
                    },
                    shi: function () {
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slidedown";
                            },
                            update: function (callback) {
                                App.page.update('shi', callback);
                            },
                            leave: function (callback) {
                              ///  App.page.leave('shi',callback);
                            }
                        }
                    },
                    ting: function () {
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slidedown";
                            },
                            update: function (callback) {
                                App.page.update('ting', callback);
                            },
                            leave: function (callback) {
                               /// App.page.leave('ting',callback);
                            }
                        }
                    },
                    wei: function () {
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slidedown";
                            },
                            update: function (callback) {
                                App.page.update('wei', callback);
                            },
                            leave: function (callback) {
                              ///  App.page.leave('wei',callback);
                            }
                        }
                    },
                    fangyuantupian:function(){
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "turn";
                            },
                            update: function (callback) {
                                App.page.update('fangyuantupian', callback);
                            },
                            leave: function (callback) {
                               /// App.page.leave('fangyuantupian',callback);
                            }
                        }
                    },
                    fangwuweizhi:function(){
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slide";
                            },
                            update: function (callback) {
                                App.page.update('fangwuweizhi', callback);
                            },
                            leave: function (callback) {
                               /// App.page.leave('fangwuweizhi',callback);
                            }
                        }
                    },
                    shangjiashibai:function(){
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slide";
                            },
                            update: function (callback) {
                                App.page.update('shangjiashibai', callback);
                            },
                            leave: function (callback) {
                                /// App.page.leave('fangwuweizhi',callback);
                            }
                        }
                    },
                    tupianliulan:function(){
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slide";
                            },
                            update: function (callback) {
                                App.page.update('tupianliulan', callback);
                            },
                            leave: function (callback) {
                                /// App.page.leave('fangwuweizhi',callback);
                            }
                        }
                    },
                    xinxifabuzerenxieyi:function(){
                        return{
                            init: function () {
                                //Mobilebone.classAnimation = "slide";
                            },
                            update: function (callback) {
                                App.page.update('xinxifabuzerenxieyi', callback);
                            },
                            leave: function (callback) {
                                /// App.page.leave('fangwuweizhi',callback);
                            }
                        }
                    }

                }
            };
            function extendCopy(p,c) {//把appContext对象复制对象给app
                for (var i in p) {
                    c[i] = p[i];
                }
                return c;
            }
            nameSpace.app = new app();
            extendCopy(new Context(nameSpace.app),nameSpace.app);
            var App=nameSpace.app;
            var Config=nameSpace.config;

        })(ryan.syswin||{});

        return ryan.syswin.app;
});




//        var addEventLisenter=function(){
//            $("#pageFooter")[0].addEventListener('click', function(event){
//                var target = event.target || event.touches[0], href = target.href;
//                if ((!href || /a/i.test(target.tagName) == false) && (target = target.getParentElementByTag("li"))) {
//                    var href = target.href;
//                }
//                console.log("点击的是:", target);
//                if(target)nameSpace.app.footer.highLight(target.className);
//
//            }, false);
//        }




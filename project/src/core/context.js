/**
 * Created by 136248 on 2015/2/27.
 * 目的:全局调用的所有公共方法
 */
define(['require','isc_extend','roundchart_extend'],
    function (require,isc_extend,Roundchart_extend) {
        var context=function(app) {
            var App=app||ryan.syswin.app;
            return {
                global: {
                    user: null,//内建用户唯一id
                    bodyPreventDefault: false,//阻止所有点击
                    scrolls: {},//各个页面上的iscroll对象集合;
                    currentPage: null,//当前的页面
                    create_page: null,//最新创建的页面
                    keyboardStatus:false,//软键盘是否弹出,true为已经弹出
                    windowSize:{width:window.innerWidth,height:window.innerHeight,defaultWidth:window.innerWidth,defaultHeight:window.innerHeight},//记录视口的初始值
                    isPageMoving:false,//page页面是否正在做移动动画
                    deviceType:null,//设备型号
                    search:null//搜索控件
                },
                Rlocalstorage: function () {   //local storage 存取控制
                    var storage = window.localStorage;
                    var _uid = null;
                    var isonce = false;//是否是第一次建立用户
                    if (!storage) {
                        alert('This browser does NOT support localStorage');
                        return;
                    }
                    this.setProperty = function (key, value) {//设置某个已保存的键值
                        //if (!this.has())return;
                        var obj = JSON.parse(storage.getItem(_uid));
                        //if (obj.hasOwnProperty(key)) {
                            obj[key] = value;
                      //  }
                        storage[_uid] = JSON.stringify(obj);
                    }
                    this.getProperty = function (key) {//获取某个已保存的键值
                        if (!this.has())return;
                        var obj = JSON.parse(storage.getItem(_uid));
                        if (obj.hasOwnProperty(key)) {
                            return obj[key];
                        }
                        return null;
                    }
                    this.setAllProperty = function (obj) {
                        for (var i in obj) {
                            var value = obj[i];
                            this.setProperty(i, value);
                        }
                    }
                    this.create = function (uid) {
                        if (!storage[uid]) {
                            isonce = false;
                            var _uuid = '[fangtongApp-' + uid + ']' + (new Date).valueOf() + Math.round(Math.random() * 100000000);
                            var obj = {
                                uuid: _uuid,
                                content: "我是RYAN",
                                cardid: ["666"],
                                longitude: "116",
                                latitude: "39",
                                focus: ["12345"],
                                tempData:{}
                            }
                            storage[uid] = JSON.stringify(obj);
                        } else {
                            isonce = true;
                        }
                        _uid = uid;
                    }
                    this.has = function () {
                        var v = storage.getItem(_uid);
                        var obj = JSON.parse(v);
                        if (typeof(obj) != "object" || obj == null) {
                            console.log("没有保存个人信息");
                            return false;
                        }
                        return true;
                    }
                    this.get = function () {
                        return JSON.parse(storage.getItem(_uid));
                    }
                    this.remove = function (key) {
                        //storage.removeItem(_uid)
                        storage.removeItem(key)
                    }
                    this.clear=function(){
                        storage.clear();
                    }
                    this.isOnce = function () {
                        return isonce;
                    }
                    this.setTempData=function(subPage,key,value){
                        var tempData = this.getProperty("tempData");
                        var router=ryan.syswin.app.getParam().split("/")[0];
                        tempData[router+"/"+subPage+".html/"+key] = value;
                        this.setProperty("tempData",tempData);
                    }
                    this.getTempData=function(subPage,key,iscode){
                        var tempData = this.getProperty("tempData");
                        var router=ryan.syswin.app.getParam().split("/")[0];
                        var value=tempData[router+"/"+subPage+".html/"+key];
                        if(iscode){
                            if(value.indexOf("&") != -1){
                                value = encodeURIComponent(value.split("&")[0]);
                            }else{
                                value = encodeURIComponent(value);
                            }

                        }
                        return value;
                    }
                    this.createClone=function(){
                        storage.setItem("clone",JSON.stringify(this.get()));
                    }
                    this.setClone=function(){
                        if(storage.getItem("clone")){
                            storage.setItem("Ryan",storage.getItem("clone"));
                            storage.removeItem("clone");
                        }
                    }
                },
                getParam: function () {//获取url中"#&"符后的字串
                    var url = location.hash || location.search;
                    var theRequest = {};
                    if (url.indexOf("#") != -1) {
                        url = url.substr(1);
                    }
                    var strs = url.split("#");
                    var wenhao=strs[0].length;
                    if(url.indexOf("?") != -1){
                        wenhao=url.indexOf("?");
                    }
                    return strs[0].substring(1, wenhao);
                },
                getPhpParam:function(){ //获取php url传值
                    var args = {};
                    var url = location.hash || location.search;
                    if(url.indexOf("?") != -1) {
                        var query = url.split("?")[1];
                        var pairs = query.split("&");
                        for (var i = 0; i < pairs.length; i++) {
                            var pos = pairs[i].indexOf('=');
                            if (pos == -1) continue;
                            var argname = pairs[i].substring(0, pos);
                            var value = pairs[i].substring(pos + 1);
                            args[argname] = unescape(value);
                        }
                    }
                    return args;
                },
                getHome:function(){
                    var url = location.pathname;
                    var arrUrl=location.pathname.split("/");
                    url=arrUrl[arrUrl.length-1];
                    if(url.indexOf("index")!=-1){
                        return url;
                    }else{
                        return ryan.syswin.config.dir;
                    }
                },
                setDevice:function(){
                    var navigator = window.navigator,
                        userAgent = navigator.userAgent,
                        android = userAgent.match(/(Android)[\s\/]+([\d\.]+)/),
                        ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
                        wp = userAgent.match(/(Windows\s+Phone)\s([\d\.]+)/),
                        isWebkit = /WebKit\/[\d.]+/i.test(userAgent),
                        isSafari = ios ? (navigator.standalone ? isWebkit : (/Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/MQQBrowser/i.test(userAgent))) : false,
                        os = {},
                        type=null;

                    if (android) {
                        os.android = true;
                        os.version = android[2];
                        type="android";
                    }
                    if (ios) {
                        os.ios = true;
                        os.version = ios[2].replace(/_/g, '.');
                        os.ios7 = /^7/.test(os.version);
                        if (ios[1] === 'iPad') {
                            os.ipad = true;
                        } else if (ios[1] === 'iPhone') {
                            os.iphone = true;
                            os.iphone5 = window.screen.height == 568;
                        } else if (ios[1] === 'iPod') {
                            os.ipod = true;
                        }
                        type="ios";
                    }
                    if (wp) {
                        os.wp = true;
                        os.version = wp[2];
                        os.wp8 = /^8/.test(os.version);
                        type="wp";
                    }
                    App.global.deviceType=type;
                },
                picView: function () {//图片查看div
                    var divHtml = '<div class="view-pic"><div class="pic-container"></div></div>';
                    $('body').append(divHtml);

                    $('.view-pic').bind("click", function () {
                        $(".view-pic").css("display", "none");
                    });

                },
                message: function () {//
                    var r = confirm("退回到TOON")
                    if (r == true) {
                        console.log("退回到TOON")
                    } else {

                    }
                },
                readFile: function (files, myimg) {
                    var file = files[0];
                    var img;
                    if (!myimg || myimg.tagName != "IMG") {
                        img = document.createElement('img');
                    } else {
                        img = myimg;
                    }
                    img.style.width = '88px';
                    img.style.height = '88px';
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        img.src = this.result;
                    }
                    reader.onprogress = function (e) {
                        //alert('progress');
                        var total = e.total;
                        var loaded = e.loaded;
                        var progress = document.getElementById('progress');
                        //progress.value = (loaded/total)*progress.max;
                    }
                    reader.onloadend = function (e) {
                        if (e.total != 0) {
                            var progress = document.getElementById('progress');
                            //progress.value = progress.max;
                        }
                    }
                    reader.readAsDataURL(file);
                    return img;
                },
                loadPage: function (url, data, callback) {//手动添加页面
                    console.log("=======>>>0",url,data);
                    var currUrl = url;
                    var pages = ryan.syswin.config.pageList;
                    var subpages = ryan.syswin.config.subpageList;
                    var index = -1;
                    var _data = {};
                    if (data)_data = data;
                    var _url = "";
                    if ((index = pages.indexOf(currUrl)) != -1) {
                        _url = pages[index];
                    } else if ((index = subpages.indexOf(currUrl)) != -1) {
                        _url = subpages[index];
                    }
                    if (index == -1)throw new Error("添加的页面"+url+"没有在config列表中");

                    var data_value=(typeof(_data)=="object")?JSON.stringify(_data):_data;
                    var nextPage=$("#"+url);
                    var prevPage=$(App.global.currentPage);

                    App[url]().init();//切换页面前的初始化操作

                    if(!nextPage[0]){//如果是第一次创建页面,就用ajax方法
                       // console.log("=======>>>1");
                        Mobilebone.ajax({
                            //data: _data,
                            url: ryan.syswin.app.getParam().split("/")[0]+"/"+_url + ".html",
                            success: function (e) {
                                console.log("动态加载页面:", _url, index,_data);
                                if(_data){
                                    var id=$(e).attr("id");
                                    if(data_value=="{}"||data_value==""){
                                        $("#"+id).data("inpage-params","");//增加代入参数机制
                                    }else{
                                        $("#"+id).data("inpage-params",String(data_value));//增加代入参数机制
                                    }

                                }
                                if (callback)callback(e);
                            }
                        });
                    }else{//如果是第n次,就只更新页面内容,不用ajax请求页面主模板
                        //console.log("=======>>>2",_data);
                        var herfUrl= ryan.syswin.app.getParam().split("/")[0]+"/"+_url + ".html";
                        Mobilebone.transition(nextPage[0], prevPage[0], false, {id:herfUrl,a:$('<a data-reload="false" href='+herfUrl+'></a>')[0]});
                        if(data_value=="{}"||data_value==""){
                            nextPage.data("inpage-params","");//增加代入参数机制
                        }else{
                            nextPage.data("inpage-params",String(data_value));//增加代入参数机制
                        }
                    }


                },
                refreshPage:function(){//手动刷新页面
                    console.log("App.global.currentPage:",App.global.currentPage);
                    if(App.global.currentPage.id=="thread"){
                        $("img").each(function (i,e){
                            var imgsrc = $(e);
                            imgsrc[0].onerror=function(q){
                                $(q.target).addClass('imgError');
                            }
                        });
                    }
                },
                dialog: function (msg,delay) {//所有弹出的提示信息
                        if(typeof(delay)=="undefined"){
                            delay=3000;
                        }
                        var $info=$("#__dialog__");
                        if($info.length==0){
                            $info=$('<div id="__dialog__"><div></div></div>');
                            $info.css({
                                "width":"100%",
                                "position":"absolute",
                                "bottom":"65px",
                                //"left":'60px',
                                "text-align":"center",
                                "z-index":100,
                                "font-size":"14px"
                            });
                            $info.find("div").css({
                                "background-color":"#333",
                                "color":"#fff",
                                "max-width":"160px",
                                "display":"inline-block",
                                "border-radius":"3px",
                                "padding":"8px",
                                'opacity':1,
                                "text-align":"center"
                            }).addClass("ui-dialog-blur");

                            $("body").append($info);
                        }
                        $info.find("div").html(msg);
                        $info.show();
                        clearTimeout($info.data("timer"));
                        var timer=setTimeout(function(){
                            $info.removeClass("__dialog__fadeout");
                            $info.hide();
                        },delay);
                        $info.addClass("__dialog__fadeout");
                        $info.data("timer",timer);
                },
                page:{
                    init:function(page,callback,args){
//                        ryan.syswin.app.scroll.putDownScroll($("#"+page));//每次切换页面就收回软键盘高度
//                        ryan.syswin.app.global.keyboardStatus=false;
//                        if(callback)callback();
                    },
                    update:function(page,callback,args){//进入页面后,需要更新页面所有信息
                        var collect = new (require("project/src/extends/collection"))();
                        var view = new (require(ryan.syswin.app.getHome().split(".")[0]+"/modules/"+page+"/view"))({ collection: collect });//初始化thread.view.js
                        if (!view)throw "请确保模块已经注入!";
                        view.id = (new Date()).getTime();
                        view.on(page+':render', function (e) {
                            setTimeout(function () {//必须延迟1秒，等子页面所有dom资源加载完成
                                App.scroll.updateScroll($('#'+page)[0]);
                            }, 1000);
                            if (callback)callback(view.el, e);//往回调函数中注入子页面,e:返回状态
                            App.refreshPage();
                            view.off(page+':render');
                        }, this);
                        collect.fetch(ryan.syswin.config.serveBaseUrl+ryan.syswin.config.serveURLS[page]+"?"+args);//+"&" + Math.random() * 99999);
                        //collect.fetch(ryan.syswin.config.baseUrl+"?"+args)//+"&" + Math.random() * 99999);
                        //collect.fetch("http://localhost:63342/dichan/mobile/public/html/publish_rent/modules/fabuchuzu_xt/fabuchuzu_xt.json");
                    },
                    leave:function(page,callback,args){//离开页面,需要更新所有信息
                        //console.log("####=====>",$("#"+page)[0])
                        ryan.syswin.app.scroll.putDownScroll($("#"+page));//每次切换页面就收回软键盘高度
                        ryan.syswin.app.global.keyboardStatus=false;
                        if(callback)callback();
                    }
                },
                search: function (page,msg) {//请求服务,搜索框等功能
                    var that=this;
                    var instance=ryan.syswin.app.search.instance;
                    if(typeof instance==='object'){
                        App.search.instance.msg=ryan.syswin.config.baseUrl+"?"+msg;
                        return instance;
                    }
                    var _updataMulti = function (callback,arg) {
                        var collect;
                        var view;
                        if(instance&&instance.collect){
                            collect=instance.collect;
                        }else{
                            collect= new (require("project/src/extends/collection"))();
                        }
                        if(instance&&instance.view){
                            view=instance.view;
                        }else{
                            view=  new (require(ryan.syswin.app.getHome().split(".")[0]+"/modules/"+"search"+"/view"))({ collection: collect });//初始化thread.view.js
                        }

                        if (!view)throw "请确保模块已经注入!";
                        view.id = (new Date()).getTime();
                        view.on('search:render', function (e) {
                            //setTimeout(function () {//必须延迟1秒，等子页面所有dom资源加载完成
                                if (callback)callback(view, e);//往回调函数中注入子页面,e:返回状态
                                App.refreshPage();
                                //console.log("str2::",arg);
                            //}, 10);
                            view.off('search:render');
                           App.search.instance.collect=collect;
                           App.search.instance.view=view;
                        }, this);
                        //collect.fetch(ryan.syswin.config.serveBaseUrl+ryan.syswin.config.searchURLS[page])//+"&" + Math.random() * 99999);

                        if(App.search.instance.msg){
                            collect.fetch(App.search.instance.msg+"&cname="+encodeURIComponent(arg));//+"&" + Math.random() * 99999);
                        }else{
                            collect.fetch(ryan.syswin.config.baseUrl+"?"+msg+"&cname="+encodeURIComponent(arg));
                        }
                        //缓存实例
                        //如果已经缓存了实例，则直接返回缓存的实例

                    };
                    return{
                        prevkey:null,
                        sending:false,
                        $input:null,
                        init: function ($pageId,callback) {
                            ryan.syswin.app.search.instance=this;
                            var that=this;
                            var prevkey=this.prevkey;
                            function callbackFun(el,e){
                                that.sending=false;

                                setTimeout(function(){//这里让菊花多转一会
                                    if(!that.sending){
                                        $(that.$input[0].parentNode).removeClass("icon-juhua");//搜索框里的loading
                                    }
                                },1000);

                                var curKey=that.$input.val().replace(/ /g,"");
                                if(curKey!=prevkey){
                                    prevkey=curKey;
                                    that.update(callbackFun,curKey);
                                    return;
                                }
                                callback(el,e);

                               // console.log("llllll:",el,e)
                            }

                            this.$input.bind("input",function(e){
                                var str=$(e.target).val().replace(/ /g,"");
                                if(str!=""&&str){
                                    if(!that.sending){
                                        that.sending=true;
                                        prevkey=str;
                                        //console.log("str1::",str);
                                        that.update(callbackFun,str);
                                        $(e.target.parentNode).addClass("icon-juhua");//搜索框里的loading
                                        //that.sending=false;
                                    }
                                }else{
                                    //清空下拉框
                                    var $pop=$pageId.find(".mui-popover");
                                    if($pop)var $scroll=$pop.find(".mui-scroll");
                                    if($scroll)$scroll.empty();//清空上次结果

                                    var $xcmcTitle=$pageId.find(".xcmcTitle");
                                    if($xcmcTitle)$xcmcTitle.empty();//清空上次结果
                                    console.log("请输入关键字");
                                }
                            });

                            this.$input.bind("keyup",function(e){/*键盘抬起，清空列表*/
                                var str=$(e.target).val().replace(/ /g,"");
                                if(str == ""){
                                    //清空下拉框
                                    var $pop=$pageId.find(".mui-popover");
                                    if($pop)var $scroll=$pop.find(".mui-scroll");
                                    if($scroll)$scroll.empty();//清空上次结果

                                    var $xcmcTitle=$pageId.find(".xcmcTitle");
                                    if($xcmcTitle)$xcmcTitle.empty();//清空上次结果
                                    console.log("请输入关键字");
                                }
                            });

                        },
                        update: function (callback,arg) {
                           if(arg !="" && arg != undefined){
                               _updataMulti(callback,arg);
                           }
                        },
                        remove: function () {
                            this.$input.unbind();
                        }
                    }
                },
                scroll: {
                    addScroll: function (pageinto) {//添加一个iscroll对象
                        var id = $(pageinto).attr("id");
                        var options = {type: ryan.syswin.config.scrollTypes[id]};//设置滚动菜单的类型
                        if (!options.type)options.type = 1;//默认是没有下拉
                        if(ryan.syswin.app.global.deviceType=="ios")options.type = 1;//苹果系统直接是原生下拉
                        ///console.log('isc_extend:',isc_extend,name,weChatScroll);
                        var wrapper = $(pageinto).find(".Rwrapper");
                        var newHeight=App.global.windowSize.defaultHeight-wrapper.offset().top;

                        if (wrapper)wrapper.css({height: newHeight + "px"});
                        $("#test").text($("#test").text()+"\n"+newHeight+":"+wrapper.offset().top);

                        var weChatScroll = isc_extend.init(pageinto, options);
//                        if (App.global.scrolls[id]) {
//                            App.global.scrolls[id].destroy();//销毁重新赋值
//                            App.global.scrolls[id]=null;
//                        }
                            weChatScroll.name = id;
                            App.global.scrolls[id] = weChatScroll;
                    },
                    updateScroll: function (pageinto) {//刷新一个iscroll对象
                        var name = $(pageinto).attr("id");
                        if (App.global.scrolls[name]) {
                            App.global.scrolls[name].refresh();
                        }
                    },
                    gotoScroll: function (pageinto, target) {//goto:是否要去新的位置
                        var name = $(pageinto).attr("id");
                        if (App.global.scrolls[name]) {
                            if (!isNaN(target)) {
                                var $thelist = $(pageinto).find(".Rthelist");
                                var gtarget = $thelist.find("li")[target];
                                if(gtarget)App.global.scrolls[$(pageinto).attr("id")].scrollToElement(gtarget);
                            } else {
                                App.global.scrolls[$(pageinto).attr("id")].scrollToElement(target);
                            }
                        }
                    },
                    /*键盘抬起时,滚动跟着抬起*/
                    putUpScroll:function($parent,$children){
                        if(ryan.syswin.app.global.deviceType=="ios"){
                            $parent[0].style.position="fixed";
                            return;
                        }//苹果系统不用弹出
                        var wrapper = $parent.find(".Rwrapper");

                        var newHeight=$children.offset().height*6;//通过缩短下拉滚动高度，来调整input位置

                        if(wrapper.offset().height<=newHeight)return;//如果已经抬起就不重复改变
                        wrapper.css({height:newHeight+"px"});
                        ryan.syswin.app.scroll.updateScroll($parent);
                        ryan.syswin.app.scroll.gotoScroll($parent,$children[0]);

                    },
                    /*键盘放下时,滚动跟着放下*/
                    putDownScroll:function($parent,$children){
                        if(ryan.syswin.app.global.deviceType=="ios"){
                            $parent[0].style.position="absolute";
                            return;
                        }//苹果系统不用弹出
                        var wrapper = $parent.find(".Rwrapper");
                        var newHeight=App.global.windowSize.defaultHeight-wrapper.offset().top;
                        //if(wrapper.offset().height>=newHeight||!ryan.syswin.app.global.keyboardStatus)return;//如果已经抬起就不重复改变
                        if(wrapper.offset().height>=newHeight)return;//如果已经抬起就不重复改变
                        //$("#test").text($("#test").text()+"\n"+$parent[0].id+":"+document.activeElement.tagName+":"+App.global.currentPage.id);
                        wrapper.css({height:newHeight+"px"});

                        ryan.syswin.app.scroll.updateScroll($parent);
                        ryan.syswin.app.scroll.gotoScroll($parent,0);

                       // $(this).trigger('focus');
                        $("#test").focus();
                    }
                },
                chart:{
                    round:function(){
                        return{
                            create:function(div,color,perc){
                                Roundchart_extend.create(div,color,perc);
                            },
                            remove:function(div){
                                Roundchart_extend.remove(div);
                            }
                        }
                    }
                },
                /*计算用户资料完整度*/
                getPercent:{
                    fbcgPercent:function(bt_id,xt_id){
                        var $opt_li_bt = $("#"+bt_id).find(".field").children("li");//选填---
                        var $opt_li = $("#"+xt_id).find(".field").children("li");//必填---

                        var input_value=[];
                        var a_value=[];

                        $opt_li.each(function(i,v){
                            var temp_input_value = $(v).find(".right").find("input").val();//楼层
                            if((temp_input_value != undefined) && App.inputIsNull(temp_input_value,$(v).find("input")[0])){
                                input_value.push(temp_input_value.replace(/\s/gi,''));
                            }

                            var temp_a_value = $(v).find("a").text();
                            if((temp_a_value != null) && App.inputIsNull(temp_a_value,$(v).find("a")[0])){
                                a_value.push(temp_a_value.replace(/\s/gi,''));
                            }
                        });

                        var isinput = input_value.length + a_value.length+$opt_li_bt.length;
                        var suminput = $opt_li.length +$opt_li_bt.length;//选填加必填
                        var per = (isinput/suminput)*100;
                        if(isinput == 0 && suminput==0){
                            per = "0";
                        }else{
                            per = Math.round(per);
                        }

                        console.log("aaaaaaaaa",input_value);
                        console.log("BBBBBBBBBBB",a_value);
                        console.log("ppppppppppppp",Math.round(per));

                        return per;//四舍五入
                    }
                },
                /*判断非空*/
                inputIsNull:function(val,li,flag,iscode){
                    if(val == undefined||val.length<=0){
                        return false;
                    }else{
                        if($(li)[0]&&val.indexOf($(li).attr("tag"))!= -1){
                            return false;
                        }else{
                            if(iscode){
                                return encodeURIComponent(val);
                            }else{
                                if(flag){
                                    val = val.split("&")[0];
                                }
                                val = val.length>8?val.substring(0,8)+"...":val;
                                return val;
                            }


                            //return true;
                        }
                    }
                },
                setCookie:function(c_name, value, expiredays){
                    var exdate = new Date();
                    exdate.setDate(exdate.getDate() + expiredays);
                    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
                },
                getCooike:function(c_name)
                {
                    if(document.cookie.length>0){
                        c_start=document.cookie.indexOf(c_name + "=");
                        if (c_start!=-1){
                            c_start=c_start + c_name.length+1;
                            c_end=document.cookie.indexOf(";",c_start);
                            if (c_end==-1){
                                c_end=document.cookie.length;
                            }
                            return unescape(document.cookie.substring(c_start,c_end));
                        }
                    }
                    return 0;
                }
//                MwapFun:{
//                    cameraFun:function(){
//                        Mwap.events.on(Mwap.eventTypes.camera,function(e){
//                            $("#test").html(e);
//                            alert("1115665");
//                            alert(e);
//                            Mwap.console.log("camera－e-ok:",e);
//
//                        });
//                    },
//                    albumFun:function(){
//                        Mwap.events.on(Mwap.eventTypes.album,function(e){
//							alert('相册');
//							alert(e);
//                            Mwap.console.log("album－e-ok:",e);
//                            $("#infor").children("p:nth-of-type(1)").text("相册信息:"+e)
//                        });
//                    }
//                },
//                MwapNativeFun:{
//                    cameraFun:function(){
//                        Mwap.events.on(Mwap.nativeTypes.camera,function(e){
//							alert('huode');
//							alert(e);
//
//                            Mwap.console.log("camera－n-ok:",e);
//                            return e.url;
//                        });
//                    },
//                    albumFun:function(){
//                        Mwap.events.on(Mwap.nativeTypes.album,function(e){
//                            $("#infor").children("p:nth-of-type(1)").css({'width':'200px'});
//                            $("#infor").children("p:nth-of-type(1)").css({'word-break':'break-all'});
//                            $("#infor").children("p:nth-of-type(1)").text("相册图:"+ e.url);
//                            Mwap.console.log("album－n-ok:",e);
//                            //$("#retAlbumInfo").text(e.url);
//                            $("#album").css("width","100%");
//                            $("#album").prop("src",e.url);
//                        });
//                    }
//                }
            };
        }
        return context;
});
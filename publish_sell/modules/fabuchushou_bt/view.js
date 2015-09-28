define(['backbone', 'text!publish_sell/modules/fabuchushou_bt/view.html'], function (Backbone, nearbyViewTemplate) {//(!添加模块必改!)
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        pedit:null,
        resource:null,
        $selfPage:null,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();
        },
        bindings: {
//            '#fabuchushou_bt #Rthelist li:nth-child(1) input': {//双项绑定代码
//                observe: 'xingzhengqu',
//                update:function($el,val){ if (val != undefined &&val!=""){ $el.val(val) } else { $el.val($el.attr("tag")) } }
//            }
        },
        /*
         * 导入设计师写的js代码
         * */
        formcodingScript:function(){
            var $plas=$('#fabuchushou_bt').find("#Rthelist").find("input");
            $plas.forEach(function(item, index, array){
                var plastr,inputstr;
                $(item).attr("data-preVal","");//增加保留input最近一次输入字段
                item.onfocus=function(){
                    plastr=this.attributes.tag.value;
                    inputstr=this.value;
                    if(inputstr==plastr){
                        this.value="";
                    }else{
                        this.value=inputstr;
                    }
                    var $li=$(this).parent().parent().parent();
                    if($li[0].tagName!="LI")throw new Error("没有找到li");

                    var that=this;

                    setTimeout(function(){
                        ryan.syswin.app.scroll.putUpScroll($('#fabuchushou_bt'),$li);
                    },300);

                }
                item.onblur=function(){
                    plastr=this.attributes.tag.value;
                    inputstr=this.value;
                    if(inputstr==""){
                        var $li=$(this).parent().parent();
                        this.value=plastr;
                    }
                }
            });
        },
        initPages:function(){
            this.$selfPage=$("#fabuchushou_bt");

            //点击上传图片
            var $uploadBtn = $("#fabuchushou_bt").find(".addBtn").find(".imgCon");
            $uploadBtn.off();
            $uploadBtn.on("click",function(){
                ryan.syswin.app.loadPage("fangyuantupian");
            });

            //判断是否动态加载图片
            var pic_see_url = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","pic_see_url");
            var pic_unit_url = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","pic_unit_url");
            if(pic_see_url == undefined && pic_unit_url == undefined){
                this.loadpicLoop();//动态加载轮播图片
            }
            this.setPicLoop();
            this.userEditHouse();
        },
        userEditHouse:function(){
            //房源编辑
            var houseid = "";
            var that = this;
            var param_edit = "";
            if(location.hash.indexOf("?") != -1){
                param_edit = location.hash.split("?")[1].split("&");
            }
            for(var i=0;i<param_edit.length;i++){
                var param_temp = param_edit[i].split("=");
                switch (param_temp[0]){
                    case "id":
                        houseid = param_temp[1];
                        break;
                    case "pedit":
                        that.pedit = "1";
                        break;
                    case "resource":
                        that.resource =param_temp[1];
                        if(that.resource != null){
                            ryan.syswin.app.global.user.setTempData("fabuchushou_bt","resource",that.resource);
                        }

                }
            }

            if(that.pedit == "1"){//ajax请求获取
                var setData = ryan.syswin.app.global.user;
                //记录是否是编辑房源
                setData.setTempData("fabuchushou_bt","pedit",that.pedit);
                $.ajax({
                    url:"http://mobile.fangtoon.com/index.php?r=Sale/Houses&id="+houseid,
                    type:"get",
                    dataType:"json",
                    data:"",
                    success:function(response){
                        console.log("++++++++=======|||||||===++++++",response.data);
                        if(response.status > 0){
                            var data = response.data;
                            setData.setTempData("fabuchushou_bt","fabuchushouid",data.id);
                            setData.setTempData("fabuchushou_bt","fangyuanbiaoti",data.title);
                            setData.setTempData("fabuchushou_bt","xingzhengqu",data.area_name+"&"+data.area_id);
                            setData.setTempData("fabuchushou_bt","pianqu",data.zone_name+"&"+data.zone_id);
                            setData.setTempData("fabuchushou_bt","xiaoqumingcheng",data.community_name+"&"+data.community_id+"&"+data.community_code);
                            setData.setTempData("fabuchushou_bt","loudonghao",data.building_no);
                            setData.setTempData("fabuchushou_bt","danyuanhao",data.unit_no);
                            setData.setTempData("fabuchushou_bt","taofanghao",data.room_no);
                            setData.setTempData("fabuchushou_bt","shi",data.door_model_id.split("-")[0]+"室");
                            setData.setTempData("fabuchushou_bt","ting",data.door_model_id.split("-")[2]+"厅");
                            setData.setTempData("fabuchushou_bt","wei",data.door_model_id.split("-")[1]+"卫");
                            setData.setTempData("fabuchushou_bt","chushoumianji",data.dimension);
                            setData.setTempData("fabuchushou_bt","chushoujinge",data.price);
                            //必填
                            setData.setTempData("fabuchushou_xt","dijiceng",data.storey);
                            setData.setTempData("fabuchushou_xt","gongjiceng",data.floor);
                            setData.setTempData("fabuchushou_xt","wuyefei",data.property_manage_fee);
                            setData.setTempData("fabuchushou_xt","chaoxiang",data.building_orientation);
                            setData.setTempData("fabuchushou_xt","zhuangxiuchengdu",data.decorate_degree);
                            setData.setTempData("fabuchushou_xt","zengsongsheshi",data.giving);
                            var s_tag = data.s_tag=="&"?"":data.s_tag;
                            setData.setTempData("fabuchushou_xt","fangyuanbiaoqian",s_tag);
                            setData.setTempData("fabuchushou_xt","fangyuanmiaoshu",data.content);

                            var $bt_li =  $("#fabuchushou_bt").find("#Rthelist").find("li");
                            $bt_li.each(function(i,v){
                                var li_text = $(v).find("label").text().replace(/\s/gi,'');
                                if(li_text=="房源标题"){
                                    $(v).find("input").val(data.title);
                                }else if(li_text=="面积"){
                                    $(v).find("input").val(data.dimension);
                                }else if(li_text=="总价"){
                                    $(v).find("input").val(data.price);
                                }else if(li_text == "区域名称"){
                                    $(v).find("a").html(data.area_name+data.zone_name);
                                }else if(li_text == "小区名称"){
                                    $(v).find("a").html(data.community_name);
                                }else if(li_text == "套房号"){
                                    $(v).find("a").html(data.building_no+"-"+data.unit_no+"-"+data.room_no+"室");
                                }else if(li_text == "户型"){
                                    var huxing = data.door_model_id.split("-");
                                    $(v).find("a").html(huxing[0]+"室"+huxing[1]+"厅"+huxing[2]+"卫");
                                }

                            });
                            that.backFun();
                        }
                    }
                });

            }else{
                that.backFun();
            }
        },
        backFun:function(){
            var $backBtn = $("#RHeader").find("a:nth-child(1)");
            var flagText = $("#RHeader").find("a:nth-child(2)").text();
            var resource = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","resource");
            var that = this;


            //获取房源id
            var fbcsid = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");
            $backBtn.off();
            $backBtn.one("click",function(){
                if($(ryan.syswin.app.global.currentPage).attr("id") == "fabuchushou_bt"){
                    if(that.pedit == "1"){
                        window.location.href=location.origin+"/index.php?r=Housing/Houses&id="+fbcsid;
                        //console.log("房源详情");
                    }else if(resource == 1){
                        console.log("首页");
                        window.location.href=location.origin;
                    }else if(resource == 2){
                        console.log("个人中心");
                        window.location.href=location.origin+"/index.php?r=agent/home/index";
                    }else{
                        window.location.href=location.origin+"/index.php?r=agent/home/index";
                    }
                }
            });
        },
        setPicLoop:function(){
            console.log("ttt1:",$("#fabuchushou_bt").find(".Rwrapper").offset())
            var slider = mui("#fabuchushou_bt #slider");
            slider.slider();
//            slider.slider({
//                interval: 0
//            });
            var $slider=$(slider[0]);//$slider.hide();
            var imgcon=$("#fabuchushou_bt").find(".imgCon");
            var img=$slider.find("img")[0];
            if(img){
                img.onload=function(){
//                    $slider.show();
//                    var imgconW=imgcon.offset().height;
//                    var remH=($(this).offset().height-$(this).offset().top/1.5-imgconW)/2;
//                    $("#fabuchushou_bt").find(".addBtn").css("padding",(remH+"px 0"));
//
//                    var wrapper = $("#fabuchushou_bt").find(".Rwrapper");
//                    var newHeight=ryan.syswin.app.global.windowSize.defaultHeight-wrapper.offset().top;
//                    wrapper.css({height:newHeight+"px"});
//                    ryan.syswin.app.scroll.updateScroll($("#fabuchushou_bt"));
                }
            }
        },
        loadpicLoop:function(){
            var $picLoopContainer = this.$selfPage.find("#slider").find(".mui-slider-group");
            var cell;
            //获取房源id
            var fbcsid = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");
            //fbcsid = 43761;
            if(fbcsid != undefined){
                $.ajax({
                    url:"http://mobile.fangtoon.com/index.php?r=Sale/HousePics&id="+fbcsid,
                    dataType:"json",
                    success:function(res){
                        if(res.status == 1){
                            var response = res.data.see;
                            var i =response.length;
                            //第一张
                            var cell_first = '<div class="mui-slider-item"><a href="#"><img src="'+response[i-1].url+'"></a></div>';
                            var cell_center;
                            var cell_last = '<div class="mui-slider-item"><a href="#"><img src="'+response[0].url+'"></a></div>';
                            $(response).each(function(i,v){
                                cell_center += '<div class="mui-slider-item"><a href="#"><img src="'+ v.url+'"></a></div>';
                            });
                            cell = cell_first+cell_center+cell_last;
                            $picLoopContainer.html("");
                            $picLoopContainer.append(cell);
                            //将图片url写入local
                            ryan.syswin.app.global.user.setTempData("fabuchushou_bt","pic_see_url",response);
                            ryan.syswin.app.global.user.setTempData("fabuchushou_bt","pic_unit_url",res.data.unit);
                        }

                    },
                    error:function(){
                        throw new Error("出错了");
                    }
                });
            }else{
                this.$selfPage.find(".addBtn").find(".jiahao").find("p").css("color","black");
            }
        },
        setInput:function(){
            var that=this;
            var tempData = ryan.syswin.app.global.user;
            $('#fabuchushou_bt').find("#Rthelist").find("input").bind("input",function(e){
                var label=this.attributes.tag.value;
                if(label.indexOf("请输入出售面积")!=-1){
                    ValidateFloat(this);
                    tempData.setTempData("fabuchushou_bt","chushoumianji",this.value);
                }else if(label.indexOf("请输入出售金额")!=-1) {
                    ValidateFloat(this);
                    tempData.setTempData("fabuchushou_bt","chushoujinge",this.value);
                }else if(label.indexOf("请输入房源标题")!=-1){
                    tempData.setTempData("fabuchushou_bt","fangyuanbiaoti",this.value);
                }
            });
            function ValidateFloat(e){//只能输入数字和一个小数点
                var pnumber= e.value;
                if(/^(?!0)\d+[.]?\d*$/.test(pnumber)){
                    $(e).attr("data-preVal",pnumber);
                }else{
                    if($(e).attr("data-preVal")>e.value.length&&e.value.length==0){//如果点击的是后退键
                        e.value="";
                        $(e).attr("data-preVal","");
                    }else{
                        e.value=$(e).attr("data-preVal");
                    }
                }

            }
        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'touchstart .cont dl':'onpress_Fun',//进入正文区(按下)
            'click .field li':'li_Hander'//点赞，点踩，点收藏

            //'click #fabuchushou_bt #Rthelist li:nth-child(1) input':"test"
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
            this.trigger("fabuchushou_bt:render", {result:e.result,data: e.data});//(!添加模块必改!)

            this.formcodingScript();
            this.setInput();
            this.stickitData();
            this.submit_bt();

            //this.stickit(ryan.syswin.app.global.stickitMode);//双项绑定代码
            //ryan.syswin.app.global.stickitMode.set("xingzhengqu","ooooo||ooooo");//双项绑定代码

            return this;
        },
        stickitData:function(){//将local storage中的缓存数据填入表格
            var $bt_li =  $("#fabuchushou_bt").find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;

            var fangyuanbiaoti=tempData.getTempData("fabuchushou_bt","fangyuanbiaoti");
            var xingzhengqu = tempData.getTempData("fabuchushou_bt","xingzhengqu");
            var pianqu = tempData.getTempData("fabuchushou_bt","pianqu");
            var xiaoqumingcheng = tempData.getTempData("fabuchushou_bt","xiaoqumingcheng");
            var shi = tempData.getTempData("fabuchushou_bt","shi");
            var ting = tempData.getTempData("fabuchushou_bt","ting");
            var wei = tempData.getTempData("fabuchushou_bt","wei");
            var chushoumianji = tempData.getTempData("fabuchushou_bt","chushoumianji");
            var chushoujinge = tempData.getTempData("fabuchushou_bt","chushoujinge");
            /*套房号*/
            var loudonghao = tempData.getTempData("fabuchushou_bt","loudonghao");
            var danyuanhao = tempData.getTempData("fabuchushou_bt","danyuanhao");
            var taofanghao = tempData.getTempData("fabuchushou_bt","taofanghao");


            //非空验证
            fangyuanbiaoti = ryan.syswin.app.inputIsNull(fangyuanbiaoti) || "请输入房源标题";
            chushoumianji = ryan.syswin.app.inputIsNull(chushoumianji) || "请输入出售面积";
            chushoujinge = ryan.syswin.app.inputIsNull(chushoujinge) || "请输入出售金额";

            xingzhengqu = ryan.syswin.app.inputIsNull(xingzhengqu,"",1) || "请输入区域名称";
            xiaoqumingcheng = ryan.syswin.app.inputIsNull(xiaoqumingcheng,"",1) || "请输入小区名称";
            pianqu = ryan.syswin.app.inputIsNull(pianqu,"",1)||"";

            shi = ryan.syswin.app.inputIsNull(shi)||"请选择户型<i class='Arrow'></i>";
            ting = ryan.syswin.app.inputIsNull(ting)||"";
            wei = ryan.syswin.app.inputIsNull(wei)||"";

            loudonghao = ryan.syswin.app.inputIsNull(loudonghao)?loudonghao+"-":"";
            danyuanhao = ryan.syswin.app.inputIsNull(danyuanhao)?danyuanhao+"-":"";
            taofanghao = ryan.syswin.app.inputIsNull(taofanghao)?taofanghao+"室":"请输入套房号";
            var tah_bt = ryan.syswin.app.inputIsNull(loudonghao+danyuanhao+taofanghao)||"请输入套房号";

            $bt_li.each(function(i,v){
                var li_text = $(v).find("label").text().replace(/\s/gi,'');
                if(li_text=="房源标题"){
                    $(v).find("input").val(fangyuanbiaoti);
                }else if(li_text=="面积"){
                    $(v).find("input").val(chushoumianji);
                }else if(li_text=="总价"){
                    $(v).find("input").val(chushoujinge);
                }else if(li_text == "区域名称"){
                    $(v).find("a").html(xingzhengqu+pianqu);
                }else if(li_text == "小区名称"){
                    $(v).find("a").html(xiaoqumingcheng);
                }else if(li_text == "套房号"){
                    $(v).find("a").html(tah_bt);
                }else if(li_text == "户型"){
                    $(v).find("a").html(shi+ting+wei);
                }

            });


            //绑定轮播图片
            var pic_see_url =tempData.getTempData("fabuchushou_bt","pic_see_url");

            if(pic_see_url != undefined){
                var $picLoopContainer = this.$selfPage.find("#slider").find(".mui-slider-group");
                var seeNum = pic_see_url.length;
                var cell;
                console.log("====>><<<<",pic_see_url,seeNum);
                var cell_first = '<div class="mui-slider-item"><a href="#"><img src="'+pic_see_url[seeNum-1].url+'"></a></div>';
                var cell_center;
                var cell_last = '<div class="mui-slider-item"><a href="#"><img src="'+pic_see_url[0].url+'"></a></div>';
                $(pic_see_url).each(function(i,v){
                    cell_center += '<div class="mui-slider-item"><a href="#"><img src="'+ v.url+'"></a></div>';
                });
                cell = cell_first+cell_center+cell_last;
                $picLoopContainer.html("");
                $picLoopContainer.append(cell);
            }
        },
        submit_bt:function(){//点击个人发布上传表单
            //获取是否是继续编辑状态
            var isEdit = $("#fabuchushou_bt").data("inpage-params");
            ryan.syswin.app.global.user.setTempData("fabuchushou_bt","isEdit",isEdit);
            var pedit = this.pedit;

            var $publishBt_btn = $("#fabuchushou_bt").find(".footerbtncon").find(".btncon").find(".yellow");
            var $ul_list = $("#fabuchushou_bt").find("#Rthelist").find(".field").find("li");
            var data=[];
            var flag = true;


            $publishBt_btn.off();
            $publishBt_btn.on("click",function(){
                $ul_list.each(function(i,v){

                    var a=$(v).find("a")[0];
                    var i=$(v).find("input")[0];

                    if(a&&!ryan.syswin.app.inputIsNull($(a).text(),$(a))){
                        $(a).css({"color":'red'});
                    }else if(i&&!ryan.syswin.app.inputIsNull($(i).val(),$(i))){
                        $(i).css({"color":'red'});
                    }
                    setTimeout(function(){
                        $(a).css({"color":'#bebebe'});
                        $(i).css({"color":'#bebebe'});
                    },2000);

                    if(($(a).css("color")=="red") || ($(i).css("color")=="red")){
                        flag = false;
                        //return false;
                    }

                });

                var $submitBtn=$(this);
                if($submitBtn.css("pointer-events")=="auto"){
                    var that=this;
                    $submitBtn.css({"pointer-events":"none","background-color": "rgb(219, 191, 158)"});
                    setTimeout(function(){
                        $(that).css({"pointer-events":"auto","background-color": "#fc8c2c"});
                        $ul_list.each(function(i,v){
                            var a=$(v).find("a")[0];
                            var i=$(v).find("input")[0];
                            if(a&&!ryan.syswin.app.inputIsNull($(a).text(),$(a))){
                                $(a).css({"color":'#bebebe'});
                            }else if(i&&!ryan.syswin.app.inputIsNull($(i).val(),$(i))){
                                $(i).css({"color":'#bebebe'});
                            }
                        })
                    },3000)
                }
                console.log("flagflagflagflagflag",flag);
                if(flag){
                    //读取必填数据
                    var tempData = ryan.syswin.app.global.user;

                    data["title"]=tempData.getTempData("fabuchushou_bt","fangyuanbiaoti",1);
                    data["area_name"] = tempData.getTempData("fabuchushou_bt","xingzhengqu").split("&")[0];
                    data["area_id"]=tempData.getTempData("fabuchushou_bt","xingzhengqu").split("&")[1];

                    //判断片区是否为空
                    var pianqu = tempData.getTempData("fabuchushou_bt","pianqu");
                    if(ryan.syswin.app.inputIsNull(pianqu)){
                        data["zone_name"] = pianqu.split("&")[0];
                        data["zone_id"]=pianqu.split("&")[1];
                    }else{
                        data["zone_name"] = "";
                        data["zone_id"]="";
                    }

                    data["community_name"] = tempData.getTempData("fabuchushou_bt","xiaoqumingcheng",1);
                    data["community_id"] = tempData.getTempData("fabuchushou_bt","xiaoqumingcheng").split("&")[1];
                    data["community_code"] = tempData.getTempData("fabuchushou_bt","xiaoqumingcheng").split("&")[2];

                    //厅、卫不能为空
                    var ting = tempData.getTempData("fabuchushou_bt","ting");
                    var wei = tempData.getTempData("fabuchushou_bt","wei");
                    ting = ryan.syswin.app.inputIsNull(ting)?ting.substr(0,1):"0";
                    wei = ryan.syswin.app.inputIsNull(wei)?wei.substr(0,1):"0";
                    data["door_model_id"] = tempData.getTempData("fabuchushou_bt","shi").substr(0,1)+"-"+ting+"-"+wei;

                    data["dimension"] = tempData.getTempData("fabuchushou_bt","chushoumianji");
                    data["price"] = tempData.getTempData("fabuchushou_bt","chushoujinge");
                    data["building_no"] = encodeURIComponent(tempData.getTempData("fabuchushou_bt","loudonghao")+"-"+tempData.getTempData("fabuchushou_bt","danyuanhao")+"-"+tempData.getTempData("fabuchushou_bt","taofanghao"));


                    //发布出售-必填-----提交Ajax
                    var temp_data = "title="+data["title"]+"&dimension="+data["dimension"]+"&price="+data["price"]+"&area_name="+data["area_name"]+"&community_name="+data["community_name"]+"&building_no="+data["building_no"]+"&door_model_id="+data["door_model_id"]+"&area_id="+data["area_id"]+"&zone_id="+data["zone_id"]+"&zone_name="+data["zone_name"]+"&community_id="+data["community_id"]+"&code="+data["community_code"];

                    var fbcs_bt_id = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");//获取必填页提交返回id
                    var url="";
                    if(fbcs_bt_id == undefined){
                        url = "http://mobile.fangtoon.com/index.php?r=Sale/OnePage";
                    }else{
                        url = "http://mobile.fangtoon.com/index.php?r=Sale/OnePage&id="+fbcs_bt_id;//update数据
                    }

                    $.ajax({
                        url:url,
                        type:"get",
                        dataType:"json",
                        data:temp_data,
                        success:function(res){
                            if(res.status == 1){
                                var fbcsid = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");
                                if(fbcsid == undefined){
                                    //将返回的数据id保存到local Storage
                                    ryan.syswin.app.global.user.setTempData("fabuchushou_bt","fabuchushouid",res.data.id);
                                }
                                ryan.syswin.app.loadPage("fabuchushou_xt");
                                $submitBtn.css({"pointer-events":"auto","background-color": "#fc8c2c"});
                            }else{
                                ryan.syswin.app.dialog("提交失败，请重试！");
                            }
                        },
                        error:function(){
                            ryan.syswin.app.dialog("出错了，请联系管理员！");
                            //$("#test").append("123131221321");
                        }

                    });
                }

            });
        },
        onpress_Fun:function(e){
            var $parentBtn=$(e.currentTarget);
            $parentBtn.toggleClass('adfActive');
            $parentBtn.one("touchend",function(){
                $parentBtn.toggleClass('adfActive');
            })
            $parentBtn.one("touchmove",function(){
                $parentBtn.toggleClass('adfActive');
            });
            e.stopPropagation();
            e.preventDefault();
        },
        li_Hander:function(e){
            var $parentBtn=$(e.currentTarget);
            var textLi = $parentBtn.find("label").text().replace(/\s/gi,'');
            var isPedit = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","pedit");
            var that = this;
            if(textLi == "户型"){
                ryan.syswin.app.loadPage("shi");
            }else if(textLi == "区域名称"){
                if(isPedit == 1){
                    $parentBtn.find("a").css({"color":'red'});
                    setTimeout(function(){
                        $parentBtn.find("a").css({"color":'#bebebe'});
                    },2000);
                }else{
                    ryan.syswin.app.loadPage("xingzhengqu");
                }

            }else if(textLi == "小区名称"){

                /*没有选择片区 则不能选择小区*/
                var xingzhengqu = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","xingzhengqu");
                if(xingzhengqu == undefined){
                    var $xingzhengqu = that.$selfPage.find("#Rthelist").find(".field").find("li:nth-child(2)");
                    $xingzhengqu.find("a").css("color","red");
                }else if(isPedit == 1){
                    $parentBtn.find("a").css({"color":'red'});
                    setTimeout(function(){
                        $parentBtn.find("a").css({"color":'#bebebe'});
                    },2000);
                }else{
                    ryan.syswin.app.loadPage("xiaoqumingcheng");
                }
            }else if(textLi == "套房号"){
                //如果没有选择小区名称，不允许进入套房号
                var xqmc = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","xiaoqumingcheng");
                if(xqmc == undefined){
                    var $xqmc = that.$selfPage.find("#Rthelist").find(".field").find("li:nth-child(3)");
                    $xqmc.find("a").css("color","red");
                }else if(isPedit == 1){
                    $parentBtn.find("a").css({"color":'red'});
                    setTimeout(function(){
                        $parentBtn.find("a").css({"color":'#bebebe'});
                    },2000);
                }else{
                    ryan.syswin.app.loadPage("fangwuweizhi");
                }

            }

            e.stopPropagation();
            e.preventDefault();
        }
    });
    return nearbyView;
});
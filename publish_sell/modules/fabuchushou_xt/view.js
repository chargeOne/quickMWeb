define(['backbone', 'text!publish_sell/modules/fabuchushou_xt/view.html'], function (Backbone, nearbyViewTemplate) {//(!添加模块必改!)
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        $selfPage:null,
        checkboxStatus:false,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();
        },
        bindings: {
//            '#fabuchushou_xt #Rthelist li:nth-child(1) input': 'xingzhengqu'
        },
        /*
         * 导入设计师写的js代码
         * */
        formcodingScript:function(){
            var $plas=$('#fabuchushou_xt').find("#Rthelist").find("input");
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
                    var $li=$(this).parent().parent();

                    var that=this;

//                    setTimeout(function(){
//                        ryan.syswin.app.scroll.putUpScroll($('#fabuchushou_xt'),$li);
//                    },300);

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
        setInput:function(){
                var that = this;
                var tempData = ryan.syswin.app.global.user;
                $('#fabuchushou_xt').find("#Rthelist").find("input").bind("input", function (e) {
                    var label = this.attributes.tag.value;
                    if (label.indexOf("第几") != -1) {
                        ValidateFloat(this);
                        tempData.setTempData("fabuchushou_xt","dijiceng",this.value);
                    } else if (label.indexOf("共几") != -1) {
                        ValidateFloat(this);
                        tempData.setTempData("fabuchushou_xt","gongjiceng",this.value);
                    }else if (label.indexOf("请输入物业费") != -1) {
                        ValidateFloat(this);
                        tempData.setTempData("fabuchushou_xt","wuyefei",this.value);
                    }
                })
                function ValidateFloat(e) {//只能输入数字和一个小数点
                    var pnumber = e.value;
                    if (/^(?!0)\d+[.]?\d*$/.test(pnumber)) {
                        $(e).attr("data-preVal", pnumber);
                    } else {
                        if ($(e).attr("data-preVal") > e.value.length && e.value.length == 0) {//如果点击的是后退键
                            e.value = "";
                            $(e).attr("data-preVal", "");
                        } else {
                            e.value = $(e).attr("data-preVal");
                        }
                    }

                }
        },
        initPages:function(){
            this.$selfPage=$("#fabuchushou_xt");
            this.xieyi();
            this.agree_xieyi();
        },
        xieyi:function(){
            var $xieyi = this.$selfPage.find(".footerbtncon").find(".agreement").find(".xieyi");
            $xieyi.off();
            $xieyi.on("click",function(){
                ryan.syswin.app.loadPage("xinxifabuzerenxieyi");
            });
        },
        agree_xieyi:function(){
            var $agreeBtn = this.$selfPage.find(".footerbtncon").find(".agreement").find("input");
            var that = this;
            $agreeBtn.off();
            $agreeBtn.on("click",function(){
                if(that.checkboxStatus == true){
                    that.checkboxStatus =false;
                    $agreeBtn.attr('checked','false');
                }else if(that.checkboxStatus == false){
                    that.checkboxStatus = true;
                    $agreeBtn.attr('checked','true');
                }
            });

        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            'touchstart .cont dl':'onpress_Fun',//进入正文区(按下)

            'click .field li':'li_Hander'//点赞，点踩，点收藏
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
            this.trigger("fabuchushou_xt:render", {result:e.result,data: e.data});//(!添加模块必改!)
            this.formcodingScript();
            this.setInput();
            this.stickitData();
            this.submit_xt();
            return this;
        },
        stickitData:function(){//将local storage中的缓存数据填入表格
            var $bt_li =  $("#fabuchushou_xt").find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;

            var dijiceng=tempData.getTempData("fabuchushou_xt","dijiceng");
            var gongjiceng=tempData.getTempData("fabuchushou_xt","gongjiceng");
            var wuyefei=tempData.getTempData("fabuchushou_xt","wuyefei");
            var chaoxiang=tempData.getTempData("fabuchushou_xt","chaoxiang");
            var zhuangxiuchengdu=tempData.getTempData("fabuchushou_xt","zhuangxiuchengdu");
            var zengsongsheshi=tempData.getTempData("fabuchushou_xt","zengsongsheshi");
            var fangyuanbiaoqian=tempData.getTempData("fabuchushou_xt","fangyuanbiaoqian");
            var fangyuanmiaoshu=tempData.getTempData("fabuchushou_xt","fangyuanmiaoshu");


            //非空验证
            dijiceng = ryan.syswin.app.inputIsNull(dijiceng)?dijiceng:"第几";
            gongjiceng = ryan.syswin.app.inputIsNull(gongjiceng)?gongjiceng:"共几";
            wuyefei = ryan.syswin.app.inputIsNull(wuyefei)?wuyefei:"请输入物业费";
            chaoxiang = ryan.syswin.app.inputIsNull(chaoxiang,"",1)||"请选择朝向";
            zhuangxiuchengdu = ryan.syswin.app.inputIsNull(zhuangxiuchengdu,"",1)||"请选择装修程度";
            zengsongsheshi = ryan.syswin.app.inputIsNull(zengsongsheshi)?zengsongsheshi.split(":")[0]:"请选择赠送设施";
            fangyuanbiaoqian = ryan.syswin.app.inputIsNull(fangyuanbiaoqian)?fangyuanbiaoqian.split("&")[0]:"请选择房源标签";
            fangyuanmiaoshu = ryan.syswin.app.inputIsNull(fangyuanmiaoshu)?fangyuanmiaoshu.substring(0,10)+"...":"请输入房源描述";


            $bt_li.each(function(i,v){
                var li_text = $(v).find("label").text().replace(/\s/gi,'');
                if(li_text=="楼层"){
                    $(v).find("input").val(dijiceng);
                }else if(li_text=="总楼层"){
                    $(v).find("input").val(gongjiceng);
                }else if(li_text=="朝向"){
                    $(v).find("a").html(chaoxiang);
                }else if(li_text == "装修程度"){
                    $(v).find("a").html(zhuangxiuchengdu);
                }else if(li_text == "物业费"){
                    $(v).find("input").val(wuyefei);
                }else if(li_text == "赠送设施"){
                    $(v).find("a").html(zengsongsheshi);
                }else if(li_text == "房源标签"){
                    $(v).find("a").html(fangyuanbiaoqian);
                }else if(li_text == "房源描述"){
                    $(v).find("a").html(fangyuanmiaoshu);
                }
            });

        },
        submit_xt:function(){//点击个人发布上传表单
            //$("#fabuchushou_bt").find("#Rthelist").find(".field").children("li:nth-child(1)")
            var fbcs_bt_id = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","fabuchushouid");//获取必填页提交返回id
            //fbcs_bt_id = 56231;
            var $publishXt_btn = $("#fabuchushou_xt").find(".footerbtncon").find(".btncon").find(".blue");
            var data=[];

            //从local storage取出数据
            var tempData = ryan.syswin.app.global.user;
            var dijiceng=tempData.getTempData("fabuchushou_xt","dijiceng");
            var gongjiceng=tempData.getTempData("fabuchushou_xt","gongjiceng");
            var wuyefei=tempData.getTempData("fabuchushou_xt","wuyefei");
            var chaoxiang=tempData.getTempData("fabuchushou_xt","chaoxiang");
            var zhuangxiuchengdu=tempData.getTempData("fabuchushou_xt","zhuangxiuchengdu");
            var zengsongsheshi=tempData.getTempData("fabuchushou_xt","zengsongsheshi");
            var fangyuanbiaoqian=tempData.getTempData("fabuchushou_xt","fangyuanbiaoqian");
            var fangyuanmiaoshu=tempData.getTempData("fabuchushou_xt","fangyuanmiaoshu");

            //非空验证
            data["storey"] = ryan.syswin.app.inputIsNull(dijiceng)?dijiceng:"";
            data["floor"] = ryan.syswin.app.inputIsNull(gongjiceng)?gongjiceng:"";
            data["property_manage_fee"] = ryan.syswin.app.inputIsNull(wuyefei)?wuyefei:"";
            data["building_orientation"] = ryan.syswin.app.inputIsNull(chaoxiang)?chaoxiang.split("&")[1]:"";
            data["decorate_degree"] = ryan.syswin.app.inputIsNull(zhuangxiuchengdu)?zhuangxiuchengdu.split("&")[1]:"";
            data["giving"] = ryan.syswin.app.inputIsNull(zengsongsheshi,"","",1) || "";
            data["s_tag"] = ryan.syswin.app.inputIsNull(fangyuanbiaoqian)?fangyuanbiaoqian.split("&")[1]:"";
            data["content"] = ryan.syswin.app.inputIsNull(fangyuanmiaoshu,"","",1) || "";


            if(fbcs_bt_id != undefined){



                var temp_data="id="+fbcs_bt_id+"&storey="+data["storey"]+"&floor="+data["floor"]+"&property_manage_fee="+data["property_manage_fee"]+"&building_orientation="+data["building_orientation"]+"&decorate_degree="+data["decorate_degree"]+"&giving="+data["giving"]+"&s_tag="+data["s_tag"]+"&content="+data["content"];
//                var pedit = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","pedit");
//                var isEdit = ryan.syswin.app.global.user.getTempData("fabuchushou_bt","isEdit");
//                var url = '';
//                if(isEdit == "edit" || pedit == 1){
//                    url = "http://mobile.fangtoon.com/index.php?r=Sale/TwoPage";//update数据
//                }else{
//                    url = "http://mobile.fangtoon.com/index.php?r=Sale/TwoPage";
//                }
                //同意协议--点击查看详情
                var isconfirm = this.$selfPage.data("inpage-params");
                if(isconfirm == "confirm"){
                    if(this.checkboxStatus == false){
                        //显示对勾
                        this.checkboxStatus = true;
                        this.$selfPage.find(".Rwrapper").find(".footerbtncon").find(".confirm").prop('checked','true');
                    }
                }

                var that = this;
                $publishXt_btn.off();
                $publishXt_btn.on("click",function(){
                    if (that.$selfPage.find(".Rwrapper").find(".footerbtncon").find(".confirm").prop('checked')) {
                        $.ajax({
                            url: "http://mobile.fangtoon.com/index.php?r=Sale/TwoPage",
                            type: "get",
                            dataType: "json",
                            data: temp_data,
                            success: function (res) {
                                if (res.status == 1) {
                                    ryan.syswin.app.loadPage("fabuchenggong");
                                }else{
                                    ryan.syswin.app.dialog("提交失败，请重试！");
                                }
                            },
                            error: function () {
                                ryan.syswin.app.dialog("出错了，请联系管理员！");
                            }
                        });
                    }else{
                        ryan.syswin.app.dialog("请先阅读信息发布协议！");
                    }
                });
            }else{
                //测试先屏蔽掉
                //window.location.href=location.origin+location.pathname+"#&publish_sell/fabuchushou_bt.html";
            }

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
            var $childBtn = $(e.childBtn);
            var textLi = $parentBtn.find("label").text().replace(/\s/gi,'');

            if(textLi == "朝向"){
                ryan.syswin.app.loadPage("chaoxiang");
            }else if(textLi == "装修程度"){
                ryan.syswin.app.loadPage("zhuangxiuchengdu");
            }else if(textLi == "赠送设施"){
                ryan.syswin.app.loadPage("zengsongsheshi");
            }else if(textLi == "房源标签"){
                ryan.syswin.app.loadPage("fangyuanbiaoqian");
            }else if(textLi == "房源描述"){
                ryan.syswin.app.loadPage("fangyuanmiaoshu");
            }
            e.stopPropagation();
            e.preventDefault();
        }

    });
    return nearbyView;
});
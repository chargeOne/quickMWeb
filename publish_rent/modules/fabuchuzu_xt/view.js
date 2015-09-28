
define(['backbone', 'text!publish_rent/modules/fabuchuzu_xt/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        delayIds:0,
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
        initPages:function(){
            this.$selfPage=$("#fabuchuzu_xt");
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
        /*
         * 导入设计师写的js代码
         * */
        formcodingScript:function(){
            var $plas=this.$selfPage.find("#Rthelist").find("input");
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
            this.$selfPage.find("#Rthelist").find("input").bind("input", function (e) {
                var label = this.attributes.tag.value;
                if (label.indexOf("第几") != -1) {
                    ValidateFloat(this);
                    tempData.setTempData(that.$selfPage.attr("id"),"dijiceng",this.value);
                } else if (label.indexOf("共几") != -1) {
                    ValidateFloat(this);
                    tempData.setTempData(that.$selfPage.attr("id"),"gongjiceng",this.value);
                }
            })
            function ValidateFloat(e) {//只能输入数字和一个小数点
                var pnumber = e.value;
                if (/^(?!0)\d*$/.test(pnumber)) {
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
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
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
            this.trigger(this.$selfPage.attr("id")+":render", {result:e.result,data: e.data});
            this.stickitData();
            this.formcodingScript();
            this.setInput();
            this.submit_xt();
            return this;
        },
        stickitData:function() {//将local storage中的缓存数据填入表格
            var $bt_li =  this.$selfPage.find("#Rthelist").find("li");
            var tempData = ryan.syswin.app.global.user;

            var dijiceng=tempData.getTempData("fabuchuzu_xt","dijiceng");
            var gongjiceng=tempData.getTempData("fabuchuzu_xt","gongjiceng");
            var chaoxiang=tempData.getTempData("fabuchuzu_xt","chaoxiang");
            var baohanzujin=tempData.getTempData("fabuchuzu_xt","baohanzujin");
            var zuqi=tempData.getTempData("fabuchuzu_xt","zuqi");
            var fukuanfangshi=tempData.getTempData("fabuchuzu_xt","fukuanfangshi");
            var zhuangxiuchengdu=tempData.getTempData("fabuchuzu_xt","zhuangxiuchengdu");
            var fangwupeitao=tempData.getTempData("fabuchuzu_xt","fangwupeitao");
            var gongnuanfangshi=tempData.getTempData("fabuchuzu_xt","gongnuanfangshi");
            var ruzhushijian=tempData.getTempData("fabuchuzu_xt","ruzhushijian");
            var fangyuanbiaoqian=tempData.getTempData("fabuchuzu_xt","fangyuanbiaoqian");
            var fangyuanmiaoshu=tempData.getTempData("fabuchuzu_xt","fangyuanmiaoshu");


            //非空验证
            dijiceng = ryan.syswin.app.inputIsNull(dijiceng)?dijiceng:"第几";
            gongjiceng = ryan.syswin.app.inputIsNull(gongjiceng)?gongjiceng:"共几";
            chaoxiang = ryan.syswin.app.inputIsNull(chaoxiang,"",1)|| "请选择朝向";
            baohanzujin = ryan.syswin.app.inputIsNull(baohanzujin,"",1)||"请选择包含租金";
            zuqi = ryan.syswin.app.inputIsNull(zuqi,"",1)||"请选择租期";
            fukuanfangshi = ryan.syswin.app.inputIsNull(fukuanfangshi,"",1)||"请选择付款方式";
            zhuangxiuchengdu = ryan.syswin.app.inputIsNull(zhuangxiuchengdu,"",1)||"请选择装修程度";
            fangwupeitao = ryan.syswin.app.inputIsNull(fangwupeitao,"",1)||"请选择房屋配套";
            gongnuanfangshi = ryan.syswin.app.inputIsNull(gongnuanfangshi,"",1)||"请选择供暖方式";
            ruzhushijian = ryan.syswin.app.inputIsNull(ruzhushijian)?ruzhushijian:"请选择入住时间";
            fangyuanbiaoqian = ryan.syswin.app.inputIsNull(fangyuanbiaoqian,"",1)||"请选择房源标签";
            fangyuanmiaoshu = ryan.syswin.app.inputIsNull(fangyuanmiaoshu)?fangyuanmiaoshu.substring(0,8)+"...":"请输入房源描述";


            $bt_li.each(function(i,v){
                var li_text = $(v).find("label").text().replace(/\s/gi,'');
                if(li_text=="楼层"){
                    $(v).find("input").val(dijiceng);
                }else if(li_text=="总楼层"){
                    $(v).find("input").val(gongjiceng);
                }else if(li_text=="朝向"){
                    $(v).find("a").html(chaoxiang);
                }else if(li_text=="包含租金"){
                    $(v).find("a").html(baohanzujin);
                }else if(li_text=="租期"){
                    $(v).find("a").html(zuqi);
                }else if(li_text=="付款方式"){
                    $(v).find("a").html(fukuanfangshi);
                }else if(li_text=="装修程度"){
                    $(v).find("a").html(zhuangxiuchengdu);
                }else if(li_text=="房屋配套"){
                    $(v).find("a").html(fangwupeitao);
                }else if(li_text == "供暖方式"){
                    $(v).find("a").html(gongnuanfangshi);
                }else if(li_text == "入住时间"){
                    $(v).find("a").html(ruzhushijian);
                }else if(li_text == "房源标签"){
                    $(v).find("a").html(fangyuanbiaoqian);
                }else if(li_text == "房源描述"){
                    $(v).find("a").html(fangyuanmiaoshu);
                }
            });
        },
        li_Hander:function(e){
            var $parentBtn=$(e.currentTarget);
            var $childBtn = $(e.childBtn);
            var textLi = $parentBtn.find("label").text().replace(/\s/gi,'');

            if(textLi == "朝向"){
                ryan.syswin.app.loadPage("chaoxiang");
            }else if(textLi == "包含租金"){
                ryan.syswin.app.loadPage("baohanzujin");
            }else if(textLi == "租期"){
                ryan.syswin.app.loadPage("zuqi");
            }else if(textLi == "付款方式"){
                ryan.syswin.app.loadPage("fukuanfangshi");
            }else if(textLi == "装修程度"){
                ryan.syswin.app.loadPage("zhuangxiuchengdu");
            }else if(textLi == "房屋配套"){
                ryan.syswin.app.loadPage("fangwupeitao");
            }else if(textLi == "供暖方式"){
                ryan.syswin.app.loadPage("gongnuanfangshi");
            }else if(textLi == "入住时间"){
                ryan.syswin.app.loadPage("ruzhushijian");
            }else if(textLi == "房源标签"){
                ryan.syswin.app.loadPage("fangyuanbiaoqian");
            }else if(textLi == "房源描述"){
                ryan.syswin.app.loadPage("fangyuanmiaoshu");
            }
            e.stopPropagation();
            e.preventDefault();
        },
        submit_xt:function(){//点击个人发布上传表单
            var fbcz_bt_id = ryan.syswin.app.global.user.getTempData("fabuchuzu_bt","fabuchuzuid");//获取必填页提交返回id
            //fbcz_bt_id = 5832;
            var $publishXt_btn = this.$selfPage.find(".footerbtncon").find(".btncon").find(".blue");
            var data=[];

            //从local storage取出数据
            var tempData = ryan.syswin.app.global.user;
            var dijiceng=tempData.getTempData("fabuchuzu_xt","dijiceng");
            var gongjiceng=tempData.getTempData("fabuchuzu_xt","gongjiceng");
            var chaoxiang=tempData.getTempData("fabuchuzu_xt","chaoxiang");
            var baohanzujin=tempData.getTempData("fabuchuzu_xt","baohanzujin");
            var zuqi=tempData.getTempData("fabuchuzu_xt","zuqi");
            var fukuanfangshi=tempData.getTempData("fabuchuzu_xt","fukuanfangshi");
            var zhuangxiuchengdu=tempData.getTempData("fabuchuzu_xt","zhuangxiuchengdu");
            var fangwupeitao=tempData.getTempData("fabuchuzu_xt","fangwupeitao");
            var gongnuanfangshi=tempData.getTempData("fabuchuzu_xt","gongnuanfangshi");
            var ruzhushijian=tempData.getTempData("fabuchuzu_xt","ruzhushijian");
            var fangyuanbiaoqian=tempData.getTempData("fabuchuzu_xt","fangyuanbiaoqian");
            var fangyuanmiaoshu=tempData.getTempData("fabuchuzu_xt","fangyuanmiaoshu");
            //非空验证
            data["storey"] = ryan.syswin.app.inputIsNull(dijiceng)?dijiceng:"";
            data["sumstorey"] = ryan.syswin.app.inputIsNull(gongjiceng)?gongjiceng:"";
            data["building_orientation"] = ryan.syswin.app.inputIsNull(chaoxiang)?chaoxiang.split("&")[1]:"";
            data["rent_contain"] = ryan.syswin.app.inputIsNull(baohanzujin)?baohanzujin.split("&")[0]:"";
            data["lease_term"] = ryan.syswin.app.inputIsNull(zuqi)?zuqi.split("&")[1]:"";
            data["payment_type"] = ryan.syswin.app.inputIsNull(fukuanfangshi)?fukuanfangshi.split("&")[1]:"";
            data["decorate_degree"] = ryan.syswin.app.inputIsNull(zhuangxiuchengdu)?zhuangxiuchengdu.split("&")[1]:"";
            data["supporting"] = ryan.syswin.app.inputIsNull(fangwupeitao)?fangwupeitao.split("&")[0]:"";
            data["heating"] = ryan.syswin.app.inputIsNull(gongnuanfangshi)?gongnuanfangshi.split("&")[1]:"";
            data["check_in_time"] = ryan.syswin.app.inputIsNull(ruzhushijian)?ruzhushijian:"";
            data["s_tag"] = ryan.syswin.app.inputIsNull(fangyuanbiaoqian)?fangyuanbiaoqian.split("&")[1]:"";
            data["content"] = ryan.syswin.app.inputIsNull(fangyuanmiaoshu)?fangyuanmiaoshu:"";

            console.log("fbcz_bt_idfbcz_bt_idfbcz_bt_idfbcz_bt_id",fbcz_bt_id);
            if(fbcz_bt_id != undefined){
                var temp_data="storey="+data["storey"]+"&sumstorey="+data["sumstorey"]+"&building_orientation="+data["building_orientation"]+"&rent_contain="+data["rent_contain"]+"&lease_term="+data["lease_term"]+"&payment_type="+data["payment_type"]+"&decorate_degree="+data["decorate_degree"]+"&heating="+data["heating"]+"&check_in_time="+data["check_in_time"]+"&supporting="+data["supporting"]+"&s_tag="+data["s_tag"]+"&content="+data["content"];


                    //同意协议--点击查看详情
                    var isconfirm = this.$selfPage.data("inpage-params");
                    if(isconfirm == "confirm"){
                        //if(this.checkboxStatus == false){
                            //显示对勾
                            this.checkboxStatus = true;
                            this.$selfPage.find(".Rwrapper").find(".footerbtncon").find(".confirm").prop('checked','true');
                        //}
                    }
                var that = this;
                $publishXt_btn.off();
                $publishXt_btn.on("click",function(){
                    if (that.$selfPage.find(".Rwrapper").find(".footerbtncon").find(".confirm").prop('checked')){
                        that.checkboxStatus = true;
                        $.ajax({
                            url:"http://mobile.fangtoon.com/index.php?r=Rent/Edit&steps=2&id="+fbcz_bt_id,
                            type:"post",
                            dataType:"json",
                            data:temp_data,
                            success:function(res){
                                if(res.status == 1){
                                    ryan.syswin.app.loadPage("fabuchenggong");
                                }else{
                                    ryan.syswin.app.dialog("提交失败，请重试！");
                                }
                            },
                            error:function(){
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

    }

    });
    return nearbyView;
});
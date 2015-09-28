define(['backbone', 'text!publish_rent/modules/tupianliulan/view.html'], function (Backbone, nearbyViewTemplate) {
    var nearbyView = Backbone.View.extend({
        template: _.template(nearbyViewTemplate),
        $selfPage:null,
        isAdd:false,
        initialize: function () {
            if(this.collection){
                this.collection.bind('Collection:getJsons', this.render, this);
            } else if(this.model){
                this.model.bind('Model:getJson', this.render, this);
            }
            this.initPages();

        },
        events : {//events相当坑,只保存了$(this.el)的dom结构，既<div>...</div>,外部不能用el.children()来填充主容器
            //'click #tupianliulan .sub_tpll':'clickPic'

        },
        initPages:function(){
            this.$selfPage = $("#tupianliulan");
            var $pic_slider = this.$selfPage.find("#slider");
            $pic_slider.css("display","none");
            var that = this;

            setTimeout(function(){
                $pic_slider.css("display","inline-block");
                var params = that.$selfPage.data("inpage-params");
                var index = params.split("&")[0];
                var type = params.split("&")[1];
                console.log("====<<>>>",params);
                var tempData = ryan.syswin.app.global.user;
                var $picLoopContainer = that.$selfPage.find("#slider").find(".mui-slider-group");
                if(type == 0){
                    if(!$picLoopContainer.hasClass("mui-slider-loop")){
                        $picLoopContainer.addClass("mui-slider-loop");
                    }

                    //图片渲染
                    var pic_see_url=tempData.getTempData("fabuchuzu_bt","pic_see_url");
                    var cell='';
                    var pic_count = pic_see_url.length;
                    //实勘图
                    if(pic_see_url != undefined){
                        var cell_first = '<div class="mui-slider-item" data-picid="'+pic_see_url[pic_count-1].id+'"><a href="#"><img src="'+pic_see_url[pic_count-1].url+'"></a></div>';
                        var cell_center='';
                        var cell_last = '<div class="mui-slider-item" data-picid="'+pic_see_url[0].id+'"><a href="#"><img src="'+pic_see_url[0].url+'"></a></div>';
                        $(pic_see_url).each(function(i,v){
                            cell_center += '<div class="mui-slider-item" data-picid="'+v.id+'"><a href="#"><img src="'+ v.url+'"></a></div>';
                        });
                        cell = cell_first+cell_center+cell_last;
                    }

                }else if(type == 1){
                    if($picLoopContainer.hasClass("mui-slider-loop")){
                        $picLoopContainer.removeClass("mui-slider-loop");
                    }
                    //图片渲染
                    var pic_unit_url=tempData.getTempData("fabuchuzu_bt","pic_unit_url");
                    var cell='';
                    console.log("=====>><<<<<<<<<",pic_unit_url);
                    //户型图
                    if(pic_unit_url != undefined){
                        cell = '<div class="mui-slider-item mui-active" data-picid="'+pic_unit_url.id+'"><a href="#"><img src="'+ pic_unit_url.url+'"></a></div>';
                        console.log("111111111111==>><<<",cell);
                    }

                }
                $picLoopContainer.html("");
                $picLoopContainer.append(cell);

                var slider = mui("#tupianliulan #slider");
                slider.slider().gotoItem(index);

            },1000);

            var $clickBtn = this.$selfPage.find(".sub_tpll");
            $clickBtn.on("click",function(){
                $clickBtn.find("#slider").css("display","none");
                ryan.syswin.app.loadPage("fangyuantupian");
            });

        },
        canclePic:function(){
            var $cancleBtn = this.$selfPage.find(".cancle");
            var fbczid = ryan.syswin.app.global.user.getTempData("fabuchuzu_bt","fabuchuzuid");
            fbczid = 71839;
            var picid='';
            var that = this;
            setTimeout(function(){

                $cancleBtn.on("click",function(){
                    var $active_div = that.$selfPage.find("#slider").find(".mui-active");
                    picid = $active_div.data("picid");
                    console.log("&&&&&&&&&&^^^^",picid);
                    $.ajax({
                        url:"http://mobile.fangtoon.com/index.php?r=rent/Delepic",
                        data:"id="+picid,
                        dataType:"json",
                        success:function(data){
                            console.log("opopopopopoopop",data.status);
                            if(data.status == 1){
                                $active_div.next(".mui-slider-item").addClass("mui-active");
                                $active_div.remove();
                                //同时删除local storge中的数据---未完待续
                                var origin = ryan.syswin.app.global.user.getTempData("fabuchuzu_bt","pic_see_url");
                                var newPic = [];
                                $(origin).each(function(i,v){
                                    if(v.id != picid){
                                        newPic.push(v);
                                    }
                                });
                                console.log("12312313132",newPic);
                                //将删除后的see写入localstorage
                                ryan.syswin.app.global.user.setTempData("fabuchuzu_bt","pic_see_url",newPic);
                            }
                        },
                        error:function(){
                        }
                    });
                });

            },1000);


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
            this.trigger("tupianliulan:render", {result:e.result,data:e.data});

            this.canclePic();
            return this;
        }
//        stickitData:function(){//将local storage中的缓存数据填入表格
//            var tempData = ryan.syswin.app.global.user;
//            var $see = this.$selfPage.find("#Rthelist").find(".shikantu");
//            var $unit = this.$selfPage.find("#Rthelist").find(".huxingtu").find(".conMs");
//            var seeCell='<ol class="conMs">';
//            var unitCell='';
//            var that =this;
//
//            var pic_see_url=tempData.getTempData("fabuchuzu_bt","pic_see_url");
//            var pic_unit_url=tempData.getTempData("fabuchuzu_bt","pic_unit_url");
//            //实勘图
//            if(pic_see_url != undefined){
//                $(pic_see_url).each(function(i,v){
//                    if(i%3 == 0 && i != 0){
//                        seeCell += '</ol><ol class="conMs">';
//                    }
//                    seeCell +='<li data-id="'+ v.id+'" data-index="'+i+'"><a href="#"><img src="'+ v.url+'" /></a></li>';
//                });
//
//                seeCell += '<li><img class="centerImg" src="/html/secHouse/project/images/addBTn.png"/></li>';
//                seeCell += '</ol>';
//                $see.html("");
//                $see.html(seeCell);
//            }
//            //户型图
//            if(pic_unit_url != undefined){
//                unitCell +='<li data-id="'+pic_unit_url.id+'"><a href="#"><img src="'+ pic_unit_url.url+'" /></a></li>';
//                unitCell += '<li><img class="centerImg" src="/html/secHouse/project/images/addBTn.png"/></li>';
//                $unit.html("");
//                $unit.html(unitCell);
//            }
//
//        }

    });
    return nearbyView;
});
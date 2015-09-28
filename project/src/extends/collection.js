define(['backbone', './model'], function (Backbone,mode) {
    var collect = Backbone.Collection.extend({
        initialize:function(){
            this.on("add",function(model,response,options){
               // console.log("add:",model,response,options);
            })
        },

        model: mode,
        fetch: function (url) {
            console.log("cccc:",this);
            var self = this;
            var tmpMode;
            $.ajax({
                url: url,
                dataType: 'json',
                timeout:3000,
                success: function( _data ) {

                    var data=(!isNaN(_data.status))?_data:{status:1,data:_data};
                    data.data=(data.data instanceof Array)?data.data:[data.data];
                    //var data = {status:1,data:[{"key":"aaa"},{"key":"bbb"}]};

                    //status 判断>0 或者<=0
                    if(data.status > 0) {

                        $.each(data.data, function (i, item) {
                            tmpMode = new mode(item);
                            self.add(tmpMode);
                        });
                        if (self) {
                            self.trigger("Collection:getJsons", {result: "success", data:data,url: url});
                        } else {
                            self.trigger("Collection:getJsons", {result: "fail", data:data,url: url});
                        }
                    }else{

                        self.trigger("Collection:getJsons",{result:"fail",data:_data,url:url});
                    }
                },
                error: function( _data ) {
                    self.trigger("Collection:getJsons",{result:"fail",data:_data,url:url});
                }
            });
        }
    });
    return collect;
});
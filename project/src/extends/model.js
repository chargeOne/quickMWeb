/**
 * Created by ryan on 2015/1/18.
 */
define(["zepto",'backbone'],function ($,Backbone) {
    var model = Backbone.Model.extend({
        defaults: {

        },
        fetch: function (url) {
            var self = this;
            var tmpNews;
            $.getJSON(url,function (data, status, xhr) {
                    self.set(data);
                    self.trigger("Model:getJson");
                console.log("ok:",self);
            },function(error){
                    console.log("fail:",error);
            })


        }
    });
    return model;
});
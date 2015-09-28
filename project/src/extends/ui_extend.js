/**
 * Created by ryan on 2015/1/25.
 */
define(['mui'],
    function (UI) {
        return{
            init:function(){
                    mui.init({
                            keyEventBind: {
                                backbutton: false  //关闭back按键监听
                            }
                    }
                );
            }
        }
    return "void";
})

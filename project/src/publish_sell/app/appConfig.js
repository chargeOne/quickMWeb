/**
 * Created by 136248 on 2015/1/15.
 * 目的:1.所有配置文件地址2.导入所有view模块
 */
var ryan=ryan||{};ryan.syswin=ryan.syswin||{};

define(
    function (require) {
        var baseUrl= "../";
        ryan.syswin.config = {
            dir:"publish_sell",
            pageList: ["fabuchushou_bt", "fabuchushou_xt", "fabuchenggong", "tijiaochenggong","xingzhengqu","chaoxiang","pianqu","xiaoqumingcheng","zengsongsheshi","fangyuanbiaoqian","zhuangxiuchengdu","taofanghao","fangyuanmiaoshu","shi","ting","wei","fangyuantupian","fangwuweizhi","shangjiashibai","tupianliulan","xinxifabuzerenxieyi"],//主菜单页面(!添加模块必改!)
            subpageList:[""],//二级单页面
            footerMenuList: [""],//主页面footer菜单
            footerMenuList_Activs: [""],//主页面footer菜单效果 1,2,3
            scrollTypes: {
                "fabuchushou_bt":    2,
                "fabuchushou_xt":    2,
                "zengsongsheshi":    2
//                "fabuchenggong":     2,
//                "tijiaochenggong":   2,
//                "xingzhengqu":       2,
//                "pianqu":            2,
//                "chaoxiang":         2,
//                "xiaoqumingcheng":   1


            },//识别滚动菜单的类型，重要(!添加模块必改!)

            serveBaseUrl:"",//服务地址
            serveURLS:{//服务地址分页(!添加模块必改!)
                'fabuchushou_bt':               "publish_sell/modules/fabuchushou_bt/fabuchushou_bt.json",//
                'fabuchushou_xt':               "publish_sell/modules/fabuchushou_xt/fabuchushou_xt.json",//
                'fabuchenggong':                "publish_sell/modules/fabuchenggong/fabuchenggong.json",
                'tijiaochenggong':              "publish_sell/modules/tijiaochenggong/tijiaochenggong.json",
                'xingzhengqu':                  "http://mobile.fangtoon.com/index.php",
                'pianqu':                       "http://mobile.fangtoon.com/index.php",
                'chaoxiang':                    "http://mobile.fangtoon.com/index.php",
                'xiaoqumingcheng':              "publish_sell/modules/xiaoqumingcheng/xiaoqumingcheng.json",
                'zengsongsheshi':               "http://mobile.fangtoon.com/index.php",
                "fangyuanbiaoqian":             "http://mobile.fangtoon.com/index.php",
                "zhuangxiuchengdu":             "http://mobile.fangtoon.com/index.php",
                'taofanghao':                   "publish_sell/modules/taofanghao/taofanghao.json",
                "fangyuanmiaoshu":              "publish_sell/modules/fangyuanmiaoshu/fangyuanmiaoshu.json",
                "shi":                          "publish_sell/modules/shi/shi.json",
                "ting":                         "publish_sell/modules/ting/ting.json",
                "wei":                          "publish_sell/modules/wei/wei.json",
                "fangyuantupian":               "publish_sell/modules/fangyuantupian/fangyuantupian.json",
                "fangwuweizhi":                 "publish_sell/modules/fangwuweizhi/fangwuweizhi.json",
                "shangjiashibai":               "publish_sell/modules/shangjiashibai/shangjiashibai.json",
                "tupianliulan":                 "publish_sell/modules/tupianliulan/tupianliulan.json",
                "xinxifabuzerenxieyi":          "publish_sell/modules/xinxifabuzerenxieyi/xinxifabuzerenxieyi.json"
            },
            searchURLS:{//搜索服务地址
                'loudonghao':                   "publish_sell/modules/loudonghao/search.json",
                'danyuanhao':                   "publish_sell/modules/danyuanhao/search.json",
                'taofanghao':                   "publish_sell/modules/taofanghao/search.json",
                'xiaoqumingcheng':              "publish_sell/modules/xiaoqumingcheng/search.json"
            },
            baseUrl:"http://mobile.fangtoon.com/index.php"//请求php服务端的地址




        }
        require("project/src/extends/model");require("project/src/extends/collection");
        require("publish_sell/modules/search/view");
//
//        //(!添加模块必改!)
        require("publish_sell/modules/fabuchushou_bt/view");
        require("publish_sell/modules/fabuchushou_xt/view");
        require("publish_sell/modules/fabuchenggong/view");
        require("publish_sell/modules/tijiaochenggong/view");
        require("publish_sell/modules/xingzhengqu/view");
        require("publish_sell/modules/pianqu/view");
        require("publish_sell/modules/chaoxiang/view");
        require("publish_sell/modules/xiaoqumingcheng/view");
        require("publish_sell/modules/zengsongsheshi/view");
        require("publish_sell/modules/fangyuanbiaoqian/view");
        require("publish_sell/modules/zhuangxiuchengdu/view");
        require("publish_sell/modules/taofanghao/view");
        require("publish_sell/modules/fangyuanmiaoshu/view");
        require("publish_sell/modules/shi/view");
        require("publish_sell/modules/ting/view");
        require("publish_sell/modules/wei/view");
        require("publish_sell/modules/fangyuantupian/view");
        require("publish_sell/modules/fangwuweizhi/view");
        require("publish_sell/modules/shangjiashibai/view");
        require("publish_sell/modules/tupianliulan/view");
        require("publish_sell/modules/xinxifabuzerenxieyi/view");

        return ryan.syswin.config;
});
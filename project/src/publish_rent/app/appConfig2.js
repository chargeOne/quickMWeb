/**
 * Created by 136248 on 2015/1/15.
 * 目的:1.所有配置文件地址2.导入所有view模块
 */
var ryan=ryan||{};ryan.syswin=ryan.syswin||{};

define(
    function (require) {
        var baseUrl= "../";
        ryan.syswin.config = {
            dir:"publish_rent",
            pageList: ["fabuchuzu_bt","fabuchuzu_xt","chaoxiang","fabuchenggong","fangwupeitao","fangwuweizhi","fangyuanbiaoqian","fangyuanmiaoshu","fangyuantupian","fukuanfangshi","gongnuanfangshi","huxing_shi","huxing_ting","huxing_wei","pianqu","ruzhushijian","taofanghao","tijiaochenggong","xiaoqumingcheng","xingzhengqu","zhuangxiuchengdu","baohanzujin","zuqi"],//主菜单页面(!添加模块必改!)



            subpageList:[""],//二级单页面
            footerMenuList: [""],//主页面footer菜单
            footerMenuList_Activs: [""],//主页面footer菜单效果 1,2,3
            scrollTypes: {
                "fabuchuzu_bt":      2,
                "fabuchuzu_xt":      2
//                "fabuchenggong":     2,
//                "tijiaochenggong":   2,
//                "xingzhengqu":       2,
//                "pianqu":            2,
//                "chaoxiang":         2,
//                "xiaoqumingcheng":   1



            },//识别滚动菜单的类型，重要(!添加模块必改!)

            serveBaseUrl:"",//服务地址
            serveURLS:{//服务地址分页(!添加模块必改!)
                'fabuchuzu_bt':                 "publish_rent/modules/fabuchuzu_bt/fabuchuzu_bt.json",//
                'fabuchuzu_xt':                 "publish_rent/modules/fabuchuzu_xt/fabuchuzu_xt.json",//
                'fabuchenggong':                "publish_rent/modules/fabuchenggong/fabuchenggong.json",
                'tijiaochenggong':              "publish_rent/modules/tijiaochenggong/tijiaochenggong.json",
                'xingzhengqu':                  "publish_rent/modules/xingzhengqu/xingzhengqu.json",
                'pianqu':                       "publish_rent/modules/pianqu/pianqu.json",
                'chaoxiang':                    "publish_rent/modules/chaoxiang/chaoxiang.json",
                'xiaoqumingcheng':              "publish_rent/modules/xiaoqumingcheng/xiaoqumingcheng.json",
                "fangyuanbiaoqian":             "publish_rent/modules/tijiaochenggong/tijiaochenggong.json",
                "zhuangxiuchengdu":             "publish_rent/modules/tijiaochenggong/tijiaochenggong.json",
                'taofanghao':                   "publish_rent/modules/taofanghao/taofanghao.json",
                "fangyuanmiaoshu":              "publish_rent/modules/fangyuanmiaoshu/fangyuanmiaoshu.json",
                "huxing_shi":                   "publish_rent/modules/huxing_shi/huxing_shi.json",
                "huxing_ting":                  "publish_rent/modules/huxing_ting/huxing_ting.json",
                "huxing_wei":                   "publish_rent/modules/huxing_wei/huxing_wei.json",
                "fangyuantupian":               "publish_rent/modules/fangyuantupian/fangyuantupian.json",
                "fangwuweizhi":                 "publish_rent/modules/fangwuweizhi/fangwuweizhi.json",
                "baohanzujin":                  "publish_rent/modules/baohanzujin/baohanzujin.json",
                "zuqi":                         "publish_rent/modules/zuqi/zuqi.json",
                "fukuanfangshi":                "publish_rent/modules/fukuanfangshi/fukuanfangshi.json",
                "fangwupeitao":                 "publish_rent/modules/fangwupeitao/fangwupeitao.json",
                "gongnuanfangshi":              "publish_rent/modules/gongnuanfangshi/gongnuanfangshi.json",
                "ruzhushijian":                 "publish_rent/modules/ruzhushijian/ruzhushijian.json"

            },
            searchURLS:{//搜索服务地址
                'loudonghao':                   "publish_rent/modules/taofanghao/search.json",
                'danyuanhao':                   "publish_rent/modules/taofanghao/search.json",
                'taofanghao':                   "publish_rent/modules/taofanghao/search.json",
                'xiaoqumingcheng':              "publish_rent/modules/taofanghao/search.json"
            }

        }
        require("project/src/extends/model");require("project/src/extends/collection");
        require("publish_rent/modules/search/view");
//
//        //(!添加模块必改!)
        require("publish_rent/modules/chaoxiang/view");
        require("publish_rent/modules/fabuchuzu_bt/view");
        require("publish_rent/modules/fabuchuzu_xt/view");
        require("publish_rent/modules/fabuchenggong/view");
        require("publish_rent/modules/fangwupeitao/view");
        require("publish_rent/modules/fangwuweizhi/view");
        require("publish_rent/modules/fangyuanbiaoqian/view");
        require("publish_rent/modules/fangyuanmiaoshu/view");
        require("publish_rent/modules/fangyuantupian/view");
        require("publish_rent/modules/fukuanfangshi/view");
        require("publish_rent/modules/gongnuanfangshi/view");
        require("publish_rent/modules/huxing_shi/view");
        require("publish_rent/modules/huxing_ting/view");
        require("publish_rent/modules/huxing_wei/view");
        require("publish_rent/modules/pianqu/view");
        require("publish_rent/modules/ruzhushijian/view");
        require("publish_rent/modules/taofanghao/view");
        require("publish_rent/modules/tijiaochenggong/view");
        require("publish_rent/modules/xiaoqumingcheng/view");
        require("publish_rent/modules/xingzhengqu/view");
        require("publish_rent/modules/zhuangxiuchengdu/view");
        require("publish_rent/modules/baohanzujin/view");
        require("publish_rent/modules/zuqi/view");

        return ryan.syswin.config;
});
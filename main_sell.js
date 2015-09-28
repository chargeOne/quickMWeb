/**
 * Created by ryan on 2015/1/18.
 */
require.config({
    baseUrl: "",
    paths: {
        "zepto": "project/src/script/zepto.min",
        "zepto_ext": "project/src/script/zepto.ext",
        "underscore": "project/src/script/underscore-min",
        "backbone": "project/src/script/backbone","backbone_stickit": "project/src/script/backbone.stickit",
        "iscroll":"project/src/script/iscroll",
        //"iscroll":"project/src/script/iscroll-probe",
        "mobilebone":"project/src/script/mobilebone",
        "text": 'project/src/script/text',
        "require":'project/src/script/require',
        "mui":'project/src/script/mui.min',

        "appConfig":"project/src/publish_sell/app/appConfig",
       // "appConfig":"project/src/publish_sell/app/appConfig2",
        "context":"project/src/core/context",

        "mb_extend":"project/src/extends/mobilebone_extend",
        "isc_extend":"project/src/extends/iscroll_extend",
        "ui_extend":"project/src/extends/ui_extend",

        "roundchart":"project/src/script/roundchart","roundchart_extend":"project/src/extends/roundchart_extend"

    },
    shim: {
        'zepto':{
            exports: '$'
        },
        'zepto_ext': {
            deps: ['zepto'],
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone':{
            deps: ['underscore', 'zepto'],
            exports: 'Backbone'
        },
        'backbone_stickit':{
            deps: ['backbone'],
            exports: 'Backbone_stickit'
        }
    }
});
require(["project/src/publish_sell/app/appPages"], function (project) {
    ////console.log(project)
});


//define(function(require, exports, module) {
//    var pj = require("pj");
//    console.log("ooooo:",pj);
//})
({
    appDir: './',
    baseUrl: './',
    dir: 'dist/',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    //optimize:'none',
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        "zepto": "project/src/script/zepto.min",
        "zepto_ext": "project/src/script/zepto.ext",
        "underscore": "project/src/script/underscore-min",
        "backbone": "project/src/script/backbone","backbone_stickit": "project/src/script/backbone.stickit",
        "iscroll":"project/src/script/iscroll",
        "mobilebone":"project/src/script/mobilebone",
        "text": 'project/src/script/text',
        "require":'project/src/script/require',
        "mui":'project/src/script/mui.min',

        "appConfig":"project/src/publish_sell/app/appConfig",
        "context":"project/src/core/context",

        "mb_extend":"project/src/extends/mobilebone_extend",
        "isc_extend":"project/src/extends/iscroll_extend",
        "ui_extend":"project/src/extends/ui_extend"
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
        'backbone': {
            deps: ['underscore', 'zepto'],
            exports: 'Backbone'
        }
    }
})
/*
 appDir：项目目录，相对于参数文件的位置。

 baseUrl：js文件的位置。

 dir：输出目录。

 modules：一个包含对象的数组，每个对象就是一个要被优化的模块。

 fileExclusionRegExp：凡是匹配这个正则表达式的文件名，都不会被拷贝到输出目录。

 optimizeCss: 自动压缩CSS文件，可取的值包括“none”, “standard”, “standard.keepLines”, “standard.keepComments”, “standard.keepComments.keepLines”。

 removeCombined：如果为true，合并后的原文件将不保留在输出目录中。

 paths：各个模块的相对路径，可以省略js后缀名。

 shim：配置依赖性关系。如果某一个模块不是AMD模式定义的，就可以用shim属性指定模块的依赖性关系和输出值。

 generateSourceMaps：是否要生成source map文件

node C:\Users\ryan\AppData\Roaming\npm\node_modules\requirejs\bin\r.js -o build.js


node C:\Users\136248\AppData\Roaming\npm\node_modules\requirejs\bin\r.js -o build.js


*
* */
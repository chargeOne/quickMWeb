/**
 * Created by 136248 on 2015/3/20.
 */
/*
 * 自定义canvas饼图js
 * by xiaoMo
 * 2013-05-01
 */
(function(window, doc){
var RoundChart = function (oParam) {
    var x = oParam.centerX, y = oParam.centerY, r = oParam.radius;
    var _this = this;                                                                     //表示实例对象
    _this.boxId = oParam.boxId || "";                                                     //容器 ID
    _this.data = oParam.data || "";                                                       //数据对象
    this.oBox=_this.oBox = document.getElementById(_this.boxId);                                    //容器 DOM对象
    _this.oBoxWidth = _this.css(_this.boxId, "width")*2;                                    //容器 width
    _this.oBoxHeight = _this.css(_this.boxId, "height")*2;                                  //容器 height
    _this.canvasId = oParam.canvasId || _this.boxId + "Canvas";                           //画板 ID
    _this.isAnimate = oParam.isAnimate || false;                                          //是否过场动画
    _this.isOpen = oParam.isOpen || false;
    _this.radius = r ?
            r.indexOf("%") != -1 ? parseFloat(r) / 100 : parseFloat(r) :
        Math.min(_this.oBoxWidth, _this.oBoxHeight) / 2;                      //饼图半径
    _this.centerX = x ?
            x.indexOf("%") != -1 ? parseFloat(x) / 100 : parseFloat(x) :
        _this.oBoxWidth / 2;                                                  //饼图中心 x 坐标
    _this.centerY = y ?
            y.indexOf("%") != -1 ? parseFloat(y) / 100 : parseFloat(y) :
        _this.oBoxHeight / 2;                                                 //饼图中心 y 坐标
    _this.canvas = _this.createElement(_this.boxId, _this.canvasId, 'canvas');            //容器内 添加canvas

   $("#"+_this.canvasId).css({ 'width': _this.oBoxWidth /2, "height": _this.oBoxHeight/2 });
    //_this.css(_this.canvasId, { 'position': 'absolute', "zIndex": 100 });                 //初始化 canvas 样式
    _this.attr(_this.canvasId, { 'width': _this.oBoxWidth, 'height': _this.oBoxHeight }); //默认canvas高宽为容器大小，需attr设置高宽，否则会失真

    /*
    _this.newsCanvasId = oParam.newsCanvasId || _this.boxId + "NewsCanvas";               //提示消息canvas ID
    _this.newsCanvas = _this.createElement(_this.boxId, _this.newsCanvasId, 'canvas');    //容器内 添加提示消息canvas
    _this.css(_this.newsCanvasId, oParam.newsCanvasStyle || { 'position': 'absolute', 'marginLeft': '0px', 'zIndex': 101, 'marginTop': '0px', 'borderStyle': 'outset', 'opacity': 0, '-webkit-transition': 'all 0.5s ease-in-out', '-moz-transition': 'all 0.5s ease-in-out', 'transition': 'all 0.5s ease-in-out' });
    _this.attr(_this.newsCanvasId, { 'width': oParam.newsCanvasStyle.width || "50px", 'height': oParam.newsCanvasStyle.height || '15px' });
    */
    _this.initChart();
}
RoundChart.prototype = {
    browser: (function () {
        var u = navigator.userAgent;
        return {
            IE: document.all ? document.documentMode ? document.documentMode : 6 : false, //IE6789
            webKit: u.indexOf('AppleWebKit/') > -1,                                       //苹果、谷歌内核
            gecko: u.indexOf('Gecko/') > -1 && u.indexOf('KHTML') == -1                   //火狐内核
        }
    }()),
    css: function (ele, value) {  //类似jQuery.css  可选取可设置
        var browser = this.browser, result = "";
        ele = (typeof ele == "string") ? document.getElementById(ele) : ele;
        if (typeof value == "object") {
            this.each(value, function (k, v) { ele.style[k] = v; })
        }
        else {
            if (value == "float") { value = browser.IE ? "styleFloat" : "cssFloat"; }
            result = browser.IE ? ele.currentStyle[value] : document.defaultView.getComputedStyle(ele, null)[value];
            return /width|height|left|top|right|bottom/g.test(value) ? parseFloat(result) : result
        }
    },
    attr: function (ele, value) { //类似jQuery.attr 可选取可设置
        ele = (typeof ele == "string") ? document.getElementById(ele) : ele;
        if (typeof value == "object") {
            this.each(value, function (k, v) {
                ele.setAttribute(k, v);
            })
        }
        else {
            return ele.getAttribute(value);
        }
    },
    each: function (object, callback) { //遍历
        var type = Object.prototype.toString.apply(object), i = 0, length = object.length;
        if (type == "[object Object]" && !length) {
            for (name in object) { callback.call(object[name], name, object[name]) }
        }
        else {
            for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
        }
    },
    createElement: function (parentNodeId, childNodeId, nodeName) { //创建元素
        var child = document.createElement(nodeName);
        child.id = childNodeId;
        document.getElementById(parentNodeId).appendChild(child);
        return child;
    },
    bind: function (ele, eventType, fn) {
        this.browser.IE ? ele.attachEvent("on" + eventType, fn) : ele.addEventListener(eventType, fn, false);
    },
    getQuarter: function (x, y) { //判断象限
        if (x >= 0 && y >= 0) return 1;
        if (x < 0 && y > 0) return 2;
        if (x < 0 && y < 0) return 3;
        if (x > 0 && y < 0) return 4;
    },
    getAngle: function (n, angle) { //判断象限获得角度
        if (n == 1) return angle;
        else if (n == 3) return angle - Math.PI;
        else return Math.PI / 2 * n - angle;
    },
    byteLength: function (str) { //判断是否为汉字双字节
        var j = 0;
        for (var i = 0, len = str.length; i < len; i++) {
            if (str.charCodeAt(i) > 255)
                j += 2;
            else
                j++;
        }
        return j;
    },
    initChart: function () {  //初始化
        var canvas = this.canvas,
            w = this.css(this.canvasId, "width"),
            h = this.css(this.canvasId, "height"),
            r = this.radius,
            centerX = this.centerX,
            centerY = this.centerY,
            rates = this.data.rates,
            color = this.data.color,
            speed = this.isAnimate ? 0.04 : 1,
            _this = this,
            startAngleArray = [],
            endAngle = 0,
            aSpeed = speed,
            limitSpeed = 1,
            ctx = canvas.getContext('2d');
            ctx.translate(centerX, centerY);
        var that=this;
        var total=parseInt(rates[0]);
        var $p;
        function init(speed) {
            if(!$p&&$(that.oBox).find("p")[0])$p=$(that.oBox).find("p");
            var startAngle = 0;
            for (var i = 0, len = rates.length; i < len; i++) {
                startAngleArray.push(startAngle);
                endAngle = startAngle + Math.PI * 2 * parseFloat(rates[i]) / 100;

//                ctx.beginPath();
//                ctx.lineWidth = 1;
//                ctx.strokeStyle = '#000';
                ctx.fillStyle = color[i];
                ctx.beginPath();
                ctx.moveTo(0, 0)
                ctx.arc(0, 0, r, startAngle * speed, endAngle * speed, false);
                ctx.lineTo(0, 0);
//                ctx.stroke();
                ctx.fill();
                startAngle = endAngle;
            }
            limitSpeed = Math.min(1, speed += aSpeed);
            //speed < (1 + aSpeed) ? setTimeout(function () { init(limitSpeed) }, 25) : _this.addEvent(_this.canvas);//鼠标事件
            speed < (1 + aSpeed) ? setTimeout(function () { init(limitSpeed) }, 30) : "";

            var _speed=(speed>=1)?1:speed;
            var currVal=_speed*total//ryan.获取 当前比例值
            if($p){
                $p.text(parseInt(currVal)+"%");
            }


           // $(that.oBox).find("span")[0].innerHTML=currVal.toFixed(0);
        }
        init(speed);
    },
    animateRound: function (params) { //切糕动画

        var hotAngle = this.hotAngle,
            rates = this.data.rates,
            color = this.data.color,
            canvas = this.canvas,
            endAngle = 0,
            startAngleArray = [],
            ctx = canvas.getContext('2d'),
            w = parseFloat(this.attr(this.canvas, "width")),
            h = parseFloat(this.attr(this.canvas, "height")),
            r = this.radius,
            n = params.n,
            vx = params.vx,
            vy = params.vy,
            newCenterLength = params.centerLength || 30,
            nPI = this.getQuarter(vx, vy),
            halfAngle = parseFloat(rates[n]) / 100 * Math.PI * 2 / 2 + hotAngle[n],
            angle = this.getAngle(nPI, halfAngle),
            newCenterX = vx > 0 ? Math.cos(angle) * newCenterLength : Math.cos(angle) * (-newCenterLength),
            newCenterY = vy > 0 ? Math.sin(angle) * newCenterLength : Math.sin(angle) * (-newCenterLength);
        ctx.clearRect(-w / 2, -h / 2, w, h);
        function animate(n) {

            var startAngle = params.startAngle;
            for (var i = 0, len = rates.length; i < len; i++) {
                startAngleArray.push(startAngle);
                endAngle = startAngle + Math.PI * 2 * parseFloat(rates[i]) / 100;
                ctx.fillStyle = color[i];
                ctx.beginPath();
                if (i != n) {
                    ctx.moveTo(0, 0)
                    ctx.arc(0, 0, r, startAngle, endAngle, false);
                    ctx.lineTo(0, 0);
                }
                else {
                    ctx.moveTo(newCenterX, newCenterY)
                    ctx.arc(newCenterX, newCenterY, r, startAngle, endAngle, false);
                    ctx.lineTo(newCenterX, newCenterY);
                }
                ctx.fill();
                startAngle = endAngle;
            }
        }
        animate(n);
    },
    addEvent: function (bindObjId) {  //事件添加
        var bindObjId = bindObjId || document,
            rates = this.data.rates,
            items = this.data.items,
            showData = this.data.showData,
            color = this.data.color,
            r = this.radius,
            hotAngle = [0],
            centerX = this.centerX,
            centerY = this.centerY,
            _this = this,
            brower = this.browser,
            newsCanvas = this.newsCanvas;
        for (var i = 0, len = rates.length; i < len; i++) {
            var n = 0;
            for (var j = 0; j <= i; j++) {
                n += parseFloat(rates[j]) / 100;
            }
            hotAngle.push(n * Math.PI * 2);
        }
        this.hotAngle = hotAngle;
        function getPosition(obj) {
            var topValue = 0, leftValue = 0;
            while (obj) {
                leftValue += obj.offsetLeft;
                topValue += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return { X: leftValue, Y: topValue };
        }
        this.bind(bindObjId, 'click', function (e) {
            var e = e || window.event,
                mousePos = getPosition(_this.oBox),
                x = (brower.gecko ? e.layerX : e.offsetX) - centerX,
                y = (brower.gecko ? e.layerY : e.offsetY) - centerY,
                vx = x > 0 ? 1 : -1,  //x象限
                vy = y > 0 ? 1 : -1,  //y象限
                radius = Math.sqrt(x * x + y * y),
                hotP = Math.atan2(y, x) < 0 ? Math.atan2(y, x) + Math.PI * 2 : Math.atan2(y, x),
                isOpen = _this.isOpen;
            try {
                var condition1, condition2, condition3;
                for (var i = 0, len = hotAngle.length; i < len; i++) {
                    var beginAngle = hotAngle[i];
                    condition1 = hotP > hotAngle[i];
                    condition2 = hotP < hotAngle[i + 1];
                    condition3 = radius <= r;
                    var endAngle = hotAngle[i + 1]
                    if (condition1 && condition2 && condition3) {
                        if (isOpen) _this.animateRound({ canvasId: bindObjId, startAngle: 0, n: i, radius: r, vx: vx, vy: vy, centerLength: 30 })
                        _this.css(_this.newsCanvas, {
                            "opacity": 1,
                            "marginLeft": x + centerX + 6 + "px",
                            "marginTop": y + centerY - 10 + "px"
                        });
                        var content = items[i] + ": " + showData[i];
                        var textLength = _this.byteLength(content);
                        newsCanvas.setAttribute("width", textLength * 7);
                        var w = parseFloat(newsCanvas.getAttribute("width"));
                        var h = parseFloat(newsCanvas.getAttribute("height"));
                        var ctx = newsCanvas.getContext('2d');
                        console.log("0000||||++++",ctx);
                        ctx.save();
                        ctx.fillStyle = "#fff";
                        ctx.fillRect(0, 0, w, h);
                        ctx.fillStyle = color[i];
                        ctx.fillText(content, 5, 12);
                        ctx.restore();
                        break;
                    }
                    if (!condition3) {
                        _this.animateRound({ canvasId: bindObjId, startAngle: 0, n: -1, radius: r, vx: vx, vy: vy, centerLength: 30 })
                        _this.css(newsCanvas, { "opacity": 0 });
                        break;
                    }
                }
            } catch (e) { }
        });
    }
}
    if (typeof exports !== 'undefined') {
        exports.RoundChart = RoundChart;
    }
    else {
        window.RoundChart = RoundChart;
    }
    return RoundChart;
})(window, document);
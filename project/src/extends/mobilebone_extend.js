/**
 * Created by ryan on 2015/1/18.
 */
define(['mobilebone'],
    function (Mobilebone) {
//define(function(require, exports, module) {
        Mobilebone.onpagefirstinto = function (pageinto) {
            var $header=$(pageinto).find(".hpHeader");
            if($header[0]){
                var href=$header.children("a:nth-of-type(1)").attr("href");
                var data_ajax=($header.children("a:nth-of-type(1)").data("ajax")==false)?false:true;

                var left=$header.children("a:nth-of-type(1)").text();
                var center=$header.children("a:nth-of-type(2)").text();
                var right=$header.children("a:nth-of-type(3)").text();

                $(pageinto).data("title_href",href);
                $(pageinto).data("title_left",left);
                $(pageinto).data("title_center",center);
                $(pageinto).data("title_right",right);
                $(pageinto).data("ajax",data_ajax);
                $header.empty();
            }
            console.log("第一次加载:",pageinto);
            var pageObject=ryan.syswin.app[$(pageinto).attr("id")];

            if(!pageObject){throw new Error("appPages.js的return里初始化对象[init]:"+$(pageinto).attr("id"))+"{}"}
            ///pageObject().init();
            ryan.syswin.app.scroll.addScroll(pageinto);//这里初始一定要等需要滚动元素全部加载完毕，重要

            /Android/i.test(navigator.userAgent) && pageinto.addEventListener('tap', Mobilebone.handleTapEvent, false);
        };
        Mobilebone.callback = function (pageinto, pageout) {
            var id=$(pageinto).attr("id");
            $("#RHeader").children("a:nth-of-type(1)").data("ajax",$(pageinto).data("ajax"));
            $("#RHeader").children("a:nth-of-type(1)").attr("href",$(pageinto).data("title_href"));
            $("#RHeader").children("a:nth-of-type(1)").text($(pageinto).data("title_left"));
            $("#RHeader").children("a:nth-of-type(2)").text($(pageinto).data("title_center"));
            $("#RHeader").children("a:nth-of-type(3)").text($(pageinto).data("title_right"));
            var pageObject=ryan.syswin.app[id];
            if(!pageObject){throw new Error("appPages.js的return里初始化对象[updata]:"+$(pageinto).attr("id"))+"{}"}
            pageObject().update(function(el, e){
                console.log("updata加载:",pageinto,pageout);
                $(pageinto).find(".Rthelist").empty().append(el);

            });

//            var isok = function (str) {
//                if (typeof(str) == "string" && str.length > 0) {
//                    return true;
//                }
//                return false;
//            }
//            var header = document.querySelector("body > .header"), footer = document.querySelector("body > .footer");
//
//            var ele_link_in = null, ele_link_out = null;
//            var ele_header_in = null, ele_header_out = null;
//            if (footer&&pageinto && isok(pageinto.id)) {
//                ele_link_in = footer.querySelector("a[href$=" + pageinto.id + "]");
//                ///ele_header_in = pageinto.querySelector(".header");
//                if (footer&&pageout && isok(pageout.id)) {
//                    ele_link_out = footer.querySelector("a[href$=" + pageout.id + "]");
//                    /// ele_header_out = pageout.querySelector(".header");
//                } else if (footer&&ele_header_in == null) {
//                    ///header.className = "header in";
//                    footer.className = "footer in";
//                }
//                if (ele_header_in == null) {
//                    ele_link_in && ele_link_in.classList.add("active");
//                    ele_link_out && ele_link_out.classList.remove("active");
//
//                    if (footer&&ele_header_out != null) {
//                        ///header.className = "header slide reverse in";
//                        footer.className = "footer slide reverse in";
//                    }
//                } else if (footer&&pageout && ele_header_out == null) {
//                    // include header, slide-out fixed header
//                    ///header.className = "header slide out";
//                    footer.className = "footer slide out";
//                }
//            }
            ryan.syswin.app.global.currentPage=pageinto;
            ryan.syswin.app.footer.setVisilbe(pageinto);
            ryan.syswin.app.footer.highLight(pageinto);
        };
        Mobilebone.createPage2 = function (dom_or_html, element_or_options, options) {
            var response = null;
            if (!dom_or_html) return;
            options = options || {};
            var current_page = document.querySelector(".in." + this.classPage);
            var page_title;
            if (element_or_options) {
                if (element_or_options.nodeType == 1) {
                    if (element_or_options.href || element_or_options.action) {
                        page_title = element_or_options.getAttribute("data-title") || options.title;
                    }
                    response = options.response;
                } else {
                    response = element_or_options.response || options.response;
                    page_title = element_or_options.title || options.title;
                }
            }
            var create_page = null;
            var create = document.createElement("div");
            if (typeof dom_or_html == "string") {
                create.innerHTML = dom_or_html;
            } else {
                create.appendChild(dom_or_html);
            }
            var create_title = create.getElementsByTagName("title")[0];
            if (!(create_page = create.querySelector("." + this.classPage))) {
                create.className = "page out";
                ///if (typeof page_title == "string") create.setAttribute("data-title", page_title);//2015.1.14不加载分页title
                create_page = create;
            } else {
                if (create_title) {
                    ///create_page.setAttribute("data-title", create_title.innerText);//2015.1.14不加载分页title
                } else if (typeof page_title == "string") {
                    ///create_page.setAttribute("data-title", page_title);//2015.1.14不加载分页title
                }
            }
            window.page = create_page;
            var $footer = $(create_page).find(".footer");
            if ($footer && $footer.length)$footer.remove();
            $footer = null;
            document.body.appendChild(create_page);
            create = null;
            var optionsTransition = {
                response: response || dom_or_html,
                id: this.getCleanUrl(element_or_options) || create_page.id || ("unique" + Date.now())
            };
            if (typeof options == "object") {
                if (typeof options.history != "undefined") {
                    optionsTransition.history = options.history;
                }
                if (typeof options.remove != "undefined") {
                    optionsTransition.remove = options.remove;
                }
            }
            //ryan.syswin.app.global.currentPage=current_page;
            ryan.syswin.app.global.create_page=create_page;
            this.transition(create_page, current_page, optionsTransition);
        };
        Mobilebone.animationstart=function(page, into_or_out, options){
            //console.log("=================<<<1",page.id, into_or_out,Mobilebone.classAnimation)
            $("#"+page.id).css('pointer-events','none');//规避动画过程中，按钮位移动,造成的叠加被点击
            ryan.syswin.app.global.isPageMoving=true;
        }
        Mobilebone.animationend=function(page, into_or_out, options){
            //console.log("=================<<<2",page.id, into_or_out,Mobilebone.classAnimation)
            setTimeout(function(){
                $("#"+page.id).css('pointer-events','auto');//规避动画过程中，按钮位移动,造成的叠加被点击
                ryan.syswin.app.global.isPageMoving=false;
            },300)
            if(into_or_out=="out"){
                var pageObject=ryan.syswin.app[$(page).attr("id")];
                if(!pageObject){throw new Error("没有在project.js里初始化对象:"+$(pageinto).attr("id"))+"{}"}
            }
        }
        Mobilebone.fallback = function (pageInto, pageout) {
            //console.log("=================<<<3",pageInto.id, pageout.id)
            var pageObject=ryan.syswin.app[$(pageout).attr("id")];
            if(!pageObject){throw new Error("appPages.js的return里初始化对象[leave]:"+$(pageinto).attr("id"))+"{}"}
            console.log("将要离开的页面:",pageObject())
            pageObject().leave(function(){});

        }
//       Mobilebone.transition= function (pageInto, pageOut, options){
//           console.log("transition",pageInto)
//       }
        //Mobilebone.init();
        return "void";
    });
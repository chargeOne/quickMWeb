<div id="fabuchushou_bt" class="page out">
    <div class="wrapper">
        <div class="hpHeader header">
            <a href="#"><</a>
            <a href="#">发布出售（必填）</a>
            <a href="#"></a>
        </div>
        <div class="content main">
            <div class="addBtn">
                <div class="imgCon"></div>
                <p>添加照片</p>
            </div>

            <div class="Rwrapper">
                <div class="Rscroller">
                    <div id="Rthelist" class="Rthelist"></div>
                    <div class="footerbtncon">
                        <div class="btncon">
                            <a href="" class="yellow">个人发布</a>
                            <a href="" class="blue">委托发布</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div class="pop hidden">
        <div class="bigPop"></div>
        <div class="twobtn">
            <a href="">拍照</a>
            <a href="">从手机相册中选择</a>
        </div>
        <div class="bottom"><a href="">取消</a></div>
    </div>
    <script type="text/javascript">
        document.getElementById("bigPop").style.minHeight=window.screen.height+"px";
        var pla=document.getElementsByTagName("input");
		var i=0;
		for (i=0;i<pla.length;i++) {
			var plastr,inputstr;
			pla[i].onfocus=function(){
				plastr=this.attributes.tag.value;
				inputstr=this.value;
				if(inputstr==plastr){
					this.value="";
				}else{
					this.value=inputstr;
				}
			}
			pla[i].onblur=function(){
				plastr=this.attributes.tag.value;
				inputstr=this.value;
				if(inputstr==""){
					this.value=plastr;
				}
			}
		}
    </script>
</div>
var $,tab,dataStr,layer;
layui.config({
	base : "js/"
}).extend({
	"nav" : "nav"
})
layui.use(['nav','form','element','layer','jquery'],function(){
	var form = layui.form,
		element = layui.element;
		$ = layui.$;
    	layer = parent.layer === undefined ? layui.layer : top.layer;
		tab = layui.nav({
			openTabNum : "50",  //最大可打开窗口数量
			url : "json/navs.json" //获取菜单json地址
		});

	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
	function getData(json){
		$.get(tab.tabConfig.url,function(data){
			if(json == "zj"){
				dataStr = data.zj;
				//重新渲染左侧菜单
				tab.render();
			}else if(json == "mb"){
				dataStr = data.mb;
				//重新渲染左侧菜单
				tab.render();
            }else if(json == "cj"){
                dataStr = data.cj;
                //重新渲染左侧菜单
                tab.render();
            }else if(json == "sz"){
                dataStr = data.sz;
                //重新渲染左侧菜单
                tab.render();
            }
		})
	}
	//页面加载时判断左侧菜单是否显示
	//通过顶部菜单获取左侧菜单
	$(".topLevelMenus li").click(function(){
        $(".topLevelMenus li").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		$(".layui-layout-admin").removeClass("showMenu");
		getData($(this).data("menu"));
		//渲染顶部窗口
		tab.tabMove();
	})

	//隐藏左侧导航
	$(".hideMenu").click(function(){
		if($(".topLevelMenus li.layui-this a").data("url")){
			layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
			return false;
		}
		$(".layui-layout-admin").toggleClass("showMenu");
        // 图标变化
		if($(".layui-layout-admin").hasClass("showMenu")){
            $(this).find("i").removeClass("layui-icon-shrink-right");
            $(this).find("i").addClass("layui-icon-spread-left");
        }else{
            $(this).find("i").removeClass("layui-icon-spread-left");
            $(this).find("i").addClass("layui-icon-shrink-right");
        }
		//渲染顶部窗口
		tab.tabMove();
	})

	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
	getData("zj");

	// 添加新窗口
	$("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
		//如果不存在子级
		if($(this).siblings().length == 0){
			addTab($(this));
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	})

	//清除缓存
	$(".clearCache").click(function(){
		window.sessionStorage.clear();
        window.localStorage.clear();
        var index = layer.msg('清除缓存中，请稍候...',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            layer.msg("缓存清除成功！");
        },1000);
    })

	//刷新后还原打开的窗口
    if(cacheStr == "true") {
        if (window.sessionStorage.getItem("menu") != null) {
            menu = JSON.parse(window.sessionStorage.getItem("menu"));
            curmenu = window.sessionStorage.getItem("curmenu");
            var openTitle = '';
            for (var i = 0; i < menu.length; i++) {
                openTitle = '';
                if (menu[i].icon) {
                    if (menu[i].icon.split("-")[0] == 'icon') {
                        openTitle += '<i class="seraph ' + menu[i].icon + '"></i>';
                    } else {
                        openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
                    }
                }
                openTitle += '<cite>' + menu[i].title + '</cite>';
                openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
                element.tabAdd("nav", {
                    title: openTitle,
                    content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
                    id: menu[i].layId
                })
                //定位到刷新前的窗口
                if (curmenu != "undefined") {
                    if (curmenu == '' || curmenu == "null") {  //定位到首页
                        element.tabChange("nav", '');
                    } else if (JSON.parse(curmenu).title == menu[i].title) {  //定位到刷新前的页面
                        element.tabChange("nav", menu[i].layId);
                    }
                } else {
                    element.tabChange("nav", menu[menu.length - 1].layId);
                }
            }
            //渲染顶部窗口
            tab.tabMove();
        }
    }else{
		window.sessionStorage.removeItem("menu");
		window.sessionStorage.removeItem("curmenu");
	}
})

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}
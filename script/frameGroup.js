
let NVTabBar = null;
function openMainFrameGroup() {

    NVTabBar = api.require('NVTabBar');

    // api.addEventListener({
    //     name: 'viewappear'
    // }, function (ret, err) {
    //     api.sendEvent({
    //         name: 'viewappear_main'
    //     });
    // });

    //打开页面组
    OpenFrameGroup();

    //打开导航控件
    BarOpen();

    bindFrameEvent();

    // TODO 处理页面大小变化(android虚拟按键显示与隐藏)
    // TODO 处理 IOS api.winWidth 不准
}

function bindFrameEvent() {
    // 切换主页面索引
    api.addEventListener({
        name: 'switchFrameGroup'
    }, function(ret) {
        if (ret && ret.value && [0, 1, 2, 3, 4].indexOf(ret.value.index) !== -1) {
            SetTab(ret.index, ret.value.reload);
        }
    });

    // 隐藏导航 navBar
    api.addEventListener({
        name: 'hideNavBar'
    }, function() {
        //解决点击导航栏位置导致的页面切换错误
        NVTabBar.close()
        api.setFrameGroupAttr({
            name: 'main',
            rect: {x: 0, y: 0, w: 'auto', h: api.winHeight}
        })
        NVTabBar.hide({
            animation:true
        });
    });

    // 显示导航 navBar
    api.addEventListener({
        name: 'showNavBar'
    }, function() {
        //重新创建
        BarOpen();
        NVTabBar.show({
            animation:true
        });
        api.setFrameGroupAttr({
            name: 'main',
            rect: {x: 0, y: 0, w: 'auto', h: api.winHeight - calcPx2Rem(60)}
        })
    });
}



function calcPx2Rem(px) {
    const width = api.winWidth;
    let remWidth = width > 960 ? 128 :
        width > 800 ? 106.6666 :
            width > 760 ? 101.3333 :
                width > 720 ? 96 :
                    width > 680 ? 90.6666 :
                        width > 640 ? 85.3333 :
                            width > 600 ? 80 :
                                width > 560 ? 74.6667 :
                                    width > 520 ? 69.3333 :
                                        width > 440 ? 58.6667 :
                                            width > 414 ? 55.2 :
                                                width > 400 ? 53.3333 :
                                                    width > 375 ? 50 :
                                                        width > 360 ?  48 :
                                                            width > 320 ? 42.6667 : 50;

    return px / 50 * remWidth;
}

//打开底部导航
function BarOpen() {
    var _w = api.winWidth / 5.0;
    var _iBgMarginB = -2.0;
    const itemIconRectW = calcPx2Rem(25.0);
    const itemIconRectH = calcPx2Rem(25.0);
    const itemTitleSize = calcPx2Rem(12.0);
    const itemTitleMarginB = calcPx2Rem(6.0);
    NVTabBar.open({
        styles: {
            bg: 'rgba(255,255,255,1)',
            h: calcPx2Rem(60),
            dividingLine: {
                width: 0,
                color: '#d2d2d2'
            },
            badge: {
                bgColor: '#ff0',
                numColor: '#fff',
                size: calcPx2Rem(6.0),
                centerX: calcPx2Rem(40),
                centerY: calcPx2Rem(6.0)
            }
        },
        selectedIndex: 0,
        items: [{
            w: _w,
            bg: {
                marginB: _iBgMarginB,
                image: 'rgba(255,255,255,0.5)'
            },
            iconRect: {
                w: itemIconRectW,
                h: itemIconRectH,
            },
            icon: {
                normal: 'widget://image/home.png',
                selected: 'widget://image/home-sel.png'
            },
            title: {
                text: '首页',
                size: itemTitleSize,
                marginB: itemTitleMarginB,
                normal: '#696969',
                selected: '#FF5E62',
            }
        }, {
            w: _w,
            bg: {
                marginB: _iBgMarginB,
                image: 'rgba(255,255,255,0.5)'
            },
            iconRect: {
                w: itemIconRectW,
                h: itemIconRectH,
            },
            icon: {
                normal: 'widget://image/order.png',
                selected: 'widget://image/order-sel.png'
            },
            title: {
                text: '订单',
                size: itemTitleSize,
                normal: '#696969',
                selected: '#FF5E62',
                marginB: itemTitleMarginB
            }
        }, {
            w: _w,
            bg: {
                marginB: _iBgMarginB,
                image: 'rgba(255,255,255,0.5)'
            },
            iconRect: {
                w: itemIconRectW,
                h: itemIconRectH,
            },
            icon: {
                normal: 'widget://image/spike.png',
                selected: 'widget://image/spike-sel.png'
            },
            title: {
                text: '秒杀',
                size: itemTitleSize,
                normal: '#696969',
                selected: '#FF5E62',
                marginB: itemTitleMarginB
            }
        }, {
            w: _w,
            bg: {
                marginB: _iBgMarginB,
                image: 'rgba(255,255,255,0.5)'
            },
            iconRect: {
                w: itemIconRectW,
                h: itemIconRectH,
            },
            icon: {
                normal: 'widget://image/news.png',
                selected: 'widget://image/news-sel.png'
            },
            title: {
                text: '新闻',
                size: itemTitleSize,
                normal: '#696969',
                selected: '#FF5E62',
                marginB: itemTitleMarginB
            }
        }, {
            w: _w,
            bg: {
                marginB: _iBgMarginB,
                image: 'rgba(255,255,255,0.5)'
            },
            iconRect: {
                w: itemIconRectW,
                h: itemIconRectH,
            },
            icon: {
                normal: 'widget://image/my.png',
                selected: 'widget://image/my-sel.png'
            },
            title: {
                text: '我的',
                size: itemTitleSize,
                normal: '#696969',
                selected: '#FF5E62',
                marginB: itemTitleMarginB
            }
        }],
    }, function(ret, err) {
        if (ret) {
            if (ret.eventType === "click") {
                if (ret.index == 2) {
                    api.sendEvent({name: 'switchTab2'})
                }
                SetTab(ret.index);
            }
        }
    });
}

//打开FrameGroup
function OpenFrameGroup() {
    let top = 0;
    let bottom = calcPx2Rem(60); // 底部导航栏高度
    api.openFrameGroup({
        name: 'main',
        rect: {
            x: 0,
            y: top,
            w: 'auto',
            h: api.winHeight - bottom - top
        },
        index: 0, // 默认显示的页面索引
        preload: 1, // 预加载的 frame 个数
        scrollEnabled: false,  // frame 组是否能够左右滚动
        frames: [{
            name: 'about',
            url: 'widget://html/home/home.html',
            bgColor: '#fff',
            scaleEnabled: false, // 页面是否可缩放
        }, {
            name: 'home',
            url: 'widget://html/order/order.html',
            bgColor: '#fff',
            scaleEnabled: false, // 页面是否可缩放
        }, {
            name: 'main',
            url: 'widget://html/seckill/seckill.html',
            bgColor: '#fff',
            scaleEnabled: false, // 页面是否可缩放
        },{
            name: 'news',
            url: 'widget://html/news/news.html',
            bgColor: '#fff',
            scaleEnabled: false, // 页面是否可缩放
        },{
            name: 'mine',
            url: 'widget://html/mine/mine.html',
            bgColor: '#fff',
            scaleEnabled: false, // 页面是否可缩放
        }]
    }, function(ret, err) {
        if (ret) {
            ShowBarIndex(ret.index);
        }
    });

}


//显示底部某个菜单
function ShowBarIndex(index) {
    NVTabBar.setSelect({
        index: index,
        selected: true
    });
}
//显示FrameGroup的Frame
function ShowFrameGroupByIndex(index, reload) {
    api.setFrameGroupIndex({
        name: 'main',
        index: index,
        reload: !!reload
    });
}
//设置对应的选项卡
function SetTab(index, reload){
    ShowBarIndex(index);
    ShowFrameGroupByIndex(index, reload);
}
var NVTabBars = null;

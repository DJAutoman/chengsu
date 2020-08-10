var callMap = {
    iosamap: {
        name: '高德地图',
        ios: 'iosamap://',
        android: 'com.autonavi.minimap'
    },
    baidumap: {
        name: '百度地图',
        ios: 'baidumap://',
        android: 'com.baidu.BaiduMap'
    },
    comgooglemap: {
        name: 'google地图',
        ios: 'comgooglemaps://',
        android: 'com.google.android.apps.maps'
    },
    // 判断当前系统为 iOS(异步)
    // callMap.hasIos();
                                                                  //必返     |           |      Boolean     |  true(是)、false(否)
    hasIos: function(){
        return api.systemType == 'ios';
    },

    // 判断当前设备是否安装地图 APP(同步)
    // callMap.fnAppInstalled(_type, function(ret){                //必填     |           |  String     |  地图类型。iosamap(高德地图)、baidumap(百度地图)、comgooglemap(google地图)
    //     // ret.installed                                        //必返     |           |  Boolean    |  true(已安装)、false(未安装)
    // })
    fnAppInstalled: function(_type, _cb){
        var _self = this;
        api.appInstalled({
            appBundle: _self.hasIos() ? _self[_type]['ios'] : _self[_type]['android']
        }, function(ret, err) {
            _cb && _cb(ret);
        });
    },

    // 打开某一个地图，并标记目标地点(异步)
    // callMap.fnOpenMap({
    //     type: _temp.type,                                   //必填     |           |  String     |  地图类型。iosamap(高德地图)、baidumap(百度地图)、comgooglemap(google地图)
    //     end: {
    //         lat: 39.8411062307,                             //必填     |           |  String     |  目标经度
    //         lon: 116.7566751225                             //必填     |           |  String     |  目标纬度
    //     }
    // })
    fnOpenMap: function(_obj){
        var _self = this;
        location.href = eval(_obj.type+'()');

        function iosamap(){
            var _param = _self.fnConvertParam({
                sourceApplication: 'Apicloud',
                sid: 'BGVIS1',
                did: 'BGVIS2',
                dlon: _obj.end.lon,
                dlat: _obj.end.lat,
                t: 0
            });
            if (_self.hasIos()) {
                return ['iosamap://Path', _param].join('');
            } else {
                return ['amapuri://route/plan/', _param].join('');
            }
        }

        function baidumap(){
            var _param = _self.fnConvertParam({
                destination: [_obj.end.lat, _obj.end.lon].join(),
                coord_type: 'bd09ll',
                mode: 'driving',
                src: 'ios.baidu.openAPIdemo'
            });
            return ['baidumap://map/direction', _param].join('');
        }

        function comgooglemap(){
            if (_self.hasIos()) {
                var _param = _self.fnConvertParam({
                    daddr: [_obj.end.lat, _obj.end.lon].join()
                });
                return ['comgooglemaps://', _param].join('');
            } else {
                return ['google.navigation:q=' + _obj.end.lat + ',' + _obj.end.lon].join('');
            }
        }
    },

    // 对象转 get 参数格式(异步)
    // fnConvertParam({                                    //必填     |           |  Object     |  需要格式化的参数
    //     key1: '1',
    //     key2: '2'
    //     …
    // })
    //                                                     //必返     |           |  String      |  get 参数格式字符串（首字符带 ? 号 ）
    fnConvertParam: function(param) {
        var _param = [],
            symbol = '?';
        for (var key in param) {
            if (typeof param[key] == 'function') {
                continue;
            }
            if (param[key] instanceof Object) {
                _param.push(key + '=' + JSON.stringify(param[key]));
            } else {
                if( typeof param[key] != 'undefined' ){
                    _param.push(key + '=' + param[key]);
                }
            }
        }
        return symbol + _param.join('&');
    }
}

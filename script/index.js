
(function(target, factory) {
    target.ApiRender = factory();

}(this, function() {

    /* ============================== config ============================== */
    const config = {
        serverURL: 'http://192.168.6.139:8877',
        userSessionKey: 'USER_SESSION',
        userTokenKey: 'USER_TOKEN',
        organizationId: 10000,
        bannersCacheKey: 'BANNERS_CACHE'
    }

    /* ============================== 工具 start ============================== */
    // 将 js 对象转换成 url 格式参数
    function paramToURL(params) {
        if (!params) {
            return '';
        }
        const keys = Object.keys(params);
        const end = keys.reduce((end, key) => {
            const val = params[key];
            if (val !== null && val !== undefined && val !== '') {
                return `${end}${encodeURIComponent(key)}=${encodeURIComponent(val)}&`;
            }
            return end;
        }, '');
        return end.substring(0, end.length - 1);
    }

    // 浮点数保留两位小数
    function floatToPrice(f) {
        if (f === null || f === undefined || f === '') {
            return '0.00';
        }
        f = f + '';
        var idx = f.indexOf('.');
        if (idx === -1) {
            return f + '.00';
        }
        var pat = f.split('.');
        if (pat[1].length < 2) {
            return pat[0] + '.' + pat[1] + "0".repeat(2 - pat[1].length);
        }
        return pat[0] + '.' + pat[1].substring(0, 2);
    }

    // 格式化时间为 2020-04-18 22:23:24 格式
    function formatDate(date) {
      function addZero(num) {
        return num > 9 ? num : '0' + num;
      }
      const d = new Date(date)
      if (Number.isNaN(d.getDay())) {
        return ''
      }
      var format = d.getFullYear() + '-'
      var format = d.getFullYear() + '-'
       return (format + addZero(d.getMonth() + 1) + '-' +
      addZero(d.getDate()) + ' ' +
      addZero(d.getHours()) + ':' +
      addZero(d.getMinutes()) + ':' +
      addZero(d.getSeconds()));
    }
    // 格式化时间为 2020-04-18 格式
    function formatDateYMD(date) {
      var datestr = formatDate(date)
      return datestr.substring(0, datestr.indexOf(' '));
    }
    // 格式化时间为 22:23:24 格式
    function formatDateHMS(date) {
      var datestr = formatDate(date)
      return datestr.substring(datestr.indexOf(' '));
    }


    function getSearch(key) {
      var search = window.location.search
      search = search.substring(1)
      var params = search.split('&')
      for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=')
        if (param[0] === key) {
          return param[1];
        }
      }
      return null;
    }

    function isEmpty(data) {
        return data === undefined || data === null || data === '' ||
            (Array.isArray(data) && data.length === 0) ||
            (typeof data === 'object' && Object.keys(data).length === 0);
    }

    function PageHelper(pageIndex, pageSize, render) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.next = (callback) => {
            render(this.pageIndex++, this.pageSize)
        }
    }

    /* ============================== 工具 end ============================== */


    /* ============================== ajax start ============================== */

    // 浏览器原生 XMLHttpRequest ajax 请求
    function browserRequest(method, url, params, callback) {
        try {
            url = config.serverURL + url;
            if (method === 'GET' && params) {
                const urlParams = utils.paramToURL(params);
                url = !urlParams ? url : (url + '?' + urlParams);
            }

            const xhr = new XMLHttpRequest()
            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", getStorage(config.userTokenKey) || "D6E7B697C4194FA9B9132B8C81406C54");
            // xhr.onreadystatechange = function() {
            //   console.log(JSON.stringify(xhr))
            //     if (xhr.readyState === 4) {
            //         callback(JSON.parse(xhr.responseText));
            //     }
            // }
            xhr.onload = function() {
              console.log(JSON.stringify(xhr))
                if (xhr.readyState === 4) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
            if (method === 'POST') {
                return xhr.send(utils.paramToURL(params));
            }
            xhr.send();
        }catch(err) {
            callback(null, err)
        }
    }

    function apiRequest(method, url, params, callback) {
        if (!/^(http|https):\/\//.test(url)) {
            url = config.serverURL + url;
        }
        if (method.toUpperCase() === 'GET' && params && Object.keys(params).length > 0) {
            const urlParams = utils.paramToURL(params);
            url = !urlParams ? url : (url + '?' + urlParams);
        }

        const options = {
            url,
            method: method.toLocaleLowerCase(),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: getStorage(config.userTokenKey),
            },
        }
        if (method.toUpperCase() === 'POST'&& params && Object.keys(params).length > 0) {
            const keys = Object.keys(params);
            let filterParams = {};
            for (let i = 0; i < keys.length; i++) {
                if (params[keys[i]] !== undefined && params[keys[i]] !== null && params[keys[i]] !== '' && !Number.isNaN(params[keys[i]])) {
                    filterParams[keys[i]] = params[keys[i]];
                }
            }
            options.data = {
                values: filterParams,
            }
        }
        // console.log(JSON.stringify(options.data))
        api.ajax(options, function(ret, err) {
            if (ret.code !== 200) {
                return callback(ret, ret);
            }
            callback(ret, err);
        })
    }

    // get 请求
    function get(url, params, callback) {
        // return browserRequest('GET', url, params, callback);
        return apiRequest('GET', url, params, callback);
    }

    // post 请求
    function post(url, params, callback) {
        return apiRequest('POST', url, params, callback);
    }

    function getResource(url, params, callback) {
        if (params && Object.keys(params).length > 0) {
            const urlParams = utils.paramToURL(params);
            url = !urlParams ? url : (url + '?' + urlParams);
        }
        const options = {
            url,
            method: 'get',
            cache: false, // 缓存，上线开启
            dataType: 'text',
            charset: 'utf-8',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
        api.ajax(options, function(ret, err) {
            callback(ret, err);
        })
    }

    /**
     * 设置 storage
     */
    function setStorage(key, value) {
        $api.setStorage(key, value);
    }

    /*
     *根据key获取session值
     * key：session中的键
     */
    function getStorage(key) {
        //获得获取localStorage（比cookie存的大）数据的信息
        return $api.getStorage(key);
    }

    /**
     * 移除 storage
     * @param key
     */
    function removeStorage(key) {
        $api.rmStorage(key);
    }

    /**
     * 检查是否存在某个 key
     */
    function existStorage(key) {
        const val = getStorage(key)
        return val !== undefined && val !== null && val !== '';
    }

    /**
     * 清空本地存储
     */
    function clearStorage() {
        $api.clearStorage();
    }

    /* ============================== ajax end ============================== */



    /* ============================== api cloud start ============================== */

    /**
     * 跳转页面，打开新页面
     * pageName:页面标识，自定义
     * pagePath：页面路径（相对路径）
     * parameterStr:参数拼接json对象
     */
    function openWin(pageName, pagePath, parameterStr) {
        api.openWin({
            name: pageName,
            url: pagePath,
            pageParam: parameterStr,
            reload: true,
            slidBackEnabled: false,
            allowEdit: false,
            hScrollBarEnabled: false,
            vScrollBarEnabled: false,
            delay: 300,
            animation:{
                type:"fade",
                duration:500
            }
        });
    }

    /***
     *关闭页面
     */
    function closeWin(pageName) {
        api.closeWin({
            name: pageName ? api.frameName : pageName,
            animation: {
                type: 'ripple',
                subType: 'from_left',
                duration: 500
            }
        });
    }

    /***
     * 显示等待框
     * @param title 等待进度条标题  字符串
     * @param msg 等待进度条文本提示  字符串
     */
    function showProgress(title, msg) {
        api.showProgress({
            style: 'default',
            animationType: 'zoom',
            title: title,
            text: msg,
            modal: true
        });
    }

    /**
     *隐藏等待进度条
     */
    function hideProgress() {
        api.hideProgress();
    }


    /***
     *页面提示方法
     * @param msg 提示文本提示  字符串
     */
    function showAlert(msg, callback) {
        api.alert({
            title: "提示",
            msg: msg
        }, function (ret, err) {
            try {
                if (callback) {
                    callback(ret, err);
                }
            } catch (e) {
            }
        });
    }

    /***
     *页面提示方法
     * @param title 提示标题  字符串
     * @param msg 提示文本提示  字符串
     */
    function showTitleAlert(title, msg, callback) {
        api.alert({
            title: title,
            msg: msg
        }, function (ret, err) {
            try {
                if (callback) {
                    callback(ret, err);
                }
            } catch (e) {
            }
        });
    }

    /*
     * 检查网络连接
     * @tips 是否有提示信息
     */
    function checkNetwork(tips) {
        //网络类型unknown:未知,ethernet:以太网,wifi:wifi,2g:2g,3g:3g,4g:4g,none:无网络
        var connectionType = api.connectionType;
        var flat = false;
        //connectionType == "unknown" ||
        if (connectionType == "none") {
            hideProgress();
            if (tips) {
                api.toast({
                    msg: '无法连接网络,请检查你的网络!'
                });
            }
        } else {
            flat = true;
        }
        return flat;
    }

    function getGpsLocation(callback) {
        try {
            const aMapLBS = api.require('aMapLBS'); //引入模块
            //配置定位信息
            aMapLBS.configManager({
                accuracy: 'hundredMeters',
                filter: 1
            }, function(ret, err) {
                if (err) { return callback(null, err); }
                if (!ret.status) { return callback(null, ret); }

                //先取消其他定位
                aMapLBS.stopUpdatingLocation();
                //先定位经纬度
                aMapLBS.singleLocation({
                    timeout: 10
                }, function(ret, err) {
                    if (err) { return callback(null, err); }
                    if (!ret.status) { return callback(null, ret); }
                    callback({lat: ret.lat, lon: ret.lon})
                });
            });
        }catch(err){
            callback(null, err);
        }
    }

    // 下拉刷新
    function bindRefreshHeader(callback) {
        // 下拉刷新
        api.setCustomRefreshHeaderInfo({
            bgColor: '#FFF',
            images:['widget://image/Frame12.png',
                'widget://image/Frame13.png'],
            tips: {
                pull: '下拉刷新',
                threshold: '松开立即刷新',
                load: '正在刷新'
            },
        }, function() {
            //下拉刷新被触发，自动进入加载状态，使用 api.refreshHeaderLoadDone() 手动结束加载中状态
            callback();
        });
    }
    // 结束下拉刷新
    function refreshHeaderDone() {
        api.refreshHeaderLoadDone();
    }

    // 提示消息
    function showToast(msg, duration = 2000, location = 'bottom') {
        api.toast({ msg, duration, location });
    }

    // api fs 模块 同步读取文件
    function fsReadSync(path) {
        const fs = api.require('fs');
        // 以只读方式打开文件
        const open = fs.openSync({path: path, flags: 'read'});
        if (!open.status) {
            return console.error('importVue 打开文件失败：' + JSON.stringify(open));
        }
        const read = fs.readSync({fd: open.fd});
        if (!read.status) {
            return console.error('importVie 读取文件失败：' + JSON.stringify(read));
        }
        return read.data;
    }

    // 从vue文本中获取标签内容
    function getTagContent(tag, content) {
        let start = content.indexOf(`<${tag}>`);
        if (start === -1){
            return '';
        }
        start = start + tag.length + 2
        const end = content.indexOf(`</${tag}>`, start);
        if (end === -1) {
            return '';
        }
        return content.substring(start, end);
    }

    // 加载 vue component 组件
    // TODO storage 加缓存，不每次读取文件
    function importVue(path) {
        let paths = [];
        if (!Array.isArray(path)) {
            if (typeof path !== 'string') {
                return null;
            }
            paths.push(path);
        } else {
            paths = path;
        }
        const components = {};
        paths.forEach(path => {
            const content = fsReadSync(path);
            const template = getTagContent('template', content);
            const style = getTagContent('style', content);
            const script = getTagContent('script', content).trim().replace('export default', '').trimLeft().replace(/;$/, '');
            const component = eval('(' + script + ')');
            // 插入样式到页面
            if (style) {
                const styleTag = document.createElement('style')
                styleTag.innerHTML = style
                document.getElementsByTagName('head')[0].appendChild(styleTag)
            }
            component.template = template;
            components[component.name] = component;
        })
        return components;
    }

    /* ============================== api cloud end ============================== */

    const handles = {
        config, // 全局配置
        get,  // ajax get
        post,  // ajax post
        getResource,
        storage: {
            setStorage,
            getStorage,
            removeStorage,
            existStorage,
        }
    }
    const utils = {
        isEmpty,
        paramToURL,
        floatToPrice,  //保留2位小数
        formatDate,    //时间格式
        formatDateYMD,  // 年月日
        getSearch,      // 接受 url 传值
        PageHelper,     //分页
    }
    const apiHandles = {
        openWin,
        closeWin,
        showProgress,    //加载弹框
        hideProgress,    //隐藏加载弹框
        showAlert,
        showTitleAlert,
        checkNetwork,        //是否连网？
        getGpsLocation,
        bindRefreshHeader,  //下拉刷新
        refreshHeaderDone,  //停止下拉刷新
        showToast,
        fsReadSync,
        importVue,
    }

    /**
     * 渲染及初始化数据
     * @param init
     */
    function ApiRender(init) {
        // 无法判断是浏览器还是APP环境
        // if (typeof apiready === 'undefined') {
        //     init(Object.assign(handles, apiHandles));
        //     return;
        // }
        window.apiready = () => init(Object.assign(handles, utils, apiHandles));
    }
    return ApiRender;
}));

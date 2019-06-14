//时间戳转换 type=0=>月+日 type=1=>时+分 type=2=> 年+月+日 无=>年+月+日+时+分+秒
function tampToTime(timestamp, type, dateYear) {
    if (timestamp === '' || timestamp === null || timestamp === undefined) {
        return '--'
    } else {
        let date = new Date(timestamp);
        let dateM = new Date(dateYear);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let s = ':' + date.getSeconds();
        if (type == 0) {
            return M + D;
        } else if (type == 1) {
            return h + m;
        } else if (type == 2) {
            return Y + M + D;
        } else if (type == 3) {
            if (date.getFullYear() == dateM.getFullYear()) {
                return M + D
            } else {
                return Y + M + D
            }
        } else if (type == 4) {
            return M + D + ' ' + h + m;
        } else if (type == 5) {
            return date.getFullYear();
        } else {
            return Y + M + D + ' ' + h + m;
        }
    }
}

//时间转时间戳
function timeToTamp(time) {
    time = time.replace(/\s/g, 'T').replace(/\//g, '-')
    // console.log(time)
    var tamp = Date.parse(time);   //精确到秒 毫秒用000替代
    // console.log(tamp)
    return tamp;
}

function timeToTampNotice(time) {
    var d = new Date(time);
    var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return Date.parse(date)
}

//聊天时间戳显示
function timestampToTime(timestamp) {
    let date = new Date(timestamp);
    let newDate = new Date(Date.now())
    let newY = newDate.getFullYear() + '-';
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + '';
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let s = ':' + date.getSeconds();
    let today = GetDateStr(0);
    let yestday = GetDateStr(-1);
    let boforday = GetDateStr(-2);
    let dataday = Y + M + D;
    if (dataday == today) {
        if (h >= 0 && h < 6) {
            return '凌晨 ' + h + m;
        } else if (h >= 6 && h < 8) {
            return '早上 ' + h + m;
        } else if (h >= 8 && h < 12) {
            return '上午 ' + h + m;
        } else if (h == 12) {
            return '中午 ' + h + m;
        } else if (h >= 12 && h < 18) {
            return '下午 ' + h + m;
        } else if (h >= 18) {
            return '晚上 ' + h + m;
        }
    } else if (dataday == yestday) {
        // if(h>=0 && h<6){
        //     return '昨天 凌晨 '+h+m;
        // }else if(h>=6 && h<8){
        //     return '昨天 早上 '+h+m;
        // }else if(h>=8 && h<12){
        //     return '昨天 上午 '+h+m;
        // }else if(h == 12){
        //     return '昨天 中午 '+h+m;
        // }else if(h>=12 && h<18){
        //     return '昨天 下午 '+h+m;
        // }else if(h>=18){
        //     return '昨天 晚上 '+h+m;
        // }
        return '昨天 ' + h + m;
    } else if (dataday == boforday) {
        // if(h>=0 && h<6){
        //     return '前天 凌晨 '+h+m;
        // }else if(h>=6 && h<8){
        //     return '前天 早上 '+h+m;
        // }else if(h>=8 && h<12){
        //     return '前天 上午 '+h+m;
        // }else if(h == 12){
        //     return '前天 中午 '+h+m;
        // }else if(h>=12 && h<18){
        //     return '前天 下午 '+h+m;
        // }else if(h>=18){
        //     return '前天 晚上 '+h+m;
        // }
        return '前天 ' + h + m
    } else if (date.getFullYear() == new Date(Date.now()).getFullYear()) {
        // if(h>=0 && h<6){
        //     return M + D + ' 凌晨 '+h+m;
        // }else if(h>=6 && h<8){
        //     return M + D + ' 早上 '+h+m;
        // }else if(h>=8 && h<12){
        //     return M + D + ' 上午 '+h+m;
        // }else if(h == 12){
        //     return M + D + ' 中午 '+h+m;
        // }else if(h>=12 && h<18){
        //     return M + D + ' 下午 '+h+m;
        // }else if(h>=18){
        //     return M + D + ' 晚上 '+h+m;
        // }
        return M + D + ' ' + h + m;

    } else if (newY === Y) {
        return M + D + ' ' + h + m;
    } else {
        // if(h>=0 && h<6){
        //     return Y + M + D + ' 凌晨 '+h+m;
        // }else if(h>=6 && h<8){
        //     return Y + M + D + ' 早上 '+h+m;
        // }else if(h>=8 && h<12){
        //     return Y + M + D + ' 上午 '+h+m;
        // }else if(h == 12){
        //     return Y + M + D + ' 中午 '+h+m;
        // }else if(h>=12 && h<18){
        //     return Y + M + D + ' 下午 '+h+m;
        // }else if(h>=18){
        //     return Y + M + D + ' 晚上 '+h+m;
        // }
        return Y + M + D;
    }
}

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear() + '-';
    var m = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1) + '-';//获取当前月份的日期
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
    return y + m + d;
}

//数组 对象-时间排序
function sortTime(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

//对象深拷贝
function objDeepCopy(source) {
    var sourceCopy = {};
    for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    return sourceCopy;
}

//  时间戳
function timestamp() {
    const time = new Date();
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    const ms = time.getMilliseconds()
    return "" + y + Add0(m) + Add0(d) + Add0(h) + Add0(mm) + Add0(s) + Add0(ms);
}

function Add0(m) {
    return m < 10 ? '0' + m : m;
}


//生成随机数
function createRandomId() {
    // return timestamp()+Math.random().toString(36).substr(2);
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

//判断时间在三分钟内
function threeTime(data, i) {
    if (i == 0 || data[i].date - data[i - 1].date > 3 * 60 * 1000) {
        return true
    } else {
        return false
    }
}

//临时消息最后一条显示列表
function showLast(data, rs_num, type) {
    if (data == null || data[rs_num] == null || data[rs_num].length == 0) {
        return ''
    } else {
        let lastData = data[rs_num][data[rs_num].length - 1].obj
        // if (type == 1) {
        //     let name = data[rs_num][data[rs_num].length - 1].obj.own_name == undefined ? JSON.parse(localStorage.getItem('baseinfo')).name : data[rs_num][data[rs_num].length - 1].obj.own_name
        //     if (lastData.type == 0) {
        //         return name + '：' + lastData.content
        //     } else if (lastData.type == 1) {
        //         return name + '：' + '[图片]'
        //     } else if (lastData.type == 2) {
        //         return name + '：' + '[语音]'
        //     } else if (lastData.type == 3) {
        //         return name + '：' + '[视频]'
        //     } else if (lastData.type == 4) {
        //         return name + ':' + '[文件]'
        //     }

        // } else {
        //     if (lastData.type == 0) {
        //         return lastData.content
        //     } else if (lastData.type == 1) {
        //         return '[图片]'
        //     } else if (lastData.type == 2) {
        //         return '[语音]'
        //     } else if (lastData.type == 3) {
        //         return '[视频]'
        //     } else if (lastData.type == 4) {
        //         return '[文件]'
        //     }
        // }
        if (lastData.type == 0) {
            return lastData.content
        } else if (lastData.type == 1) {
            return '[图片]'
        } else if (lastData.type == 2) {
            return '[语音]'
        } else if (lastData.type == 3) {
            return '[视频]'
        } else if (lastData.type == 4) {
            return '[文件]'
        }

    }
}

//新消息处理
function newMsg(data) {
    let length = 0
    for (let i in data) {
        length += data[i]
    }
    return length
}

//显示回车换行
function showEnt(data) {
    return data.replace(/\n/g, '<br>')
}

//系统消息显示
function systemMsg(code) {

    if (code == "sk_100002" //侗友 系统消息
        || code == "sk_200002"      //加入团
        || code == "sk_200006" //退出
        || code == "sk_200007" //被T出
        || code == "sk_200010" //删除行程安排
        || code == "sk_200011"//开关旅行团
        || code == "sk_200012"  //禁言
        || code == "sk_200013"  //更改旅行团 旅行状态
        || code == "sk_200014"  //更改团员 旅行状态
        || code == "sk_200018"  //删除游团通知
        || code == "sk_200019"  //修改团名
        || code == "sk_2000016"  //团转让
    ) {
        return true
    } else {
        return false
    }
}

//消息内容显示
function contentMeMsg(code) {
    if (code == "sk_100000" || code == "sk_200000") {
        return true
    } else {
        return false
    }
}

function contentYMsg(code) {
    if (code == "sk_100000" || code == "sk_200000") {
        return true
    } else {
        return false
    }
}

//行程安排
function tripMeMsg(code) {
    if (code == "sk_200005" || code == "sk_200008") {
        return true
    } else {
        return false
    }
}

function tripYMsg(code) {
    if (code == "sk_200005" || code == "sk_200008") {
        return true
    } else {
        return false
    }
}

//游团通知
function noticeMeMsg(code) {
    if (code == "sk_200004") {
        return true
    } else {
        return false
    }
}

function noticeYMsg(code) {
    if (code == "sk_200004") {
        return true
    } else {
        return false
    }
}

//判断文件类型
function fileType(name) {
    let ind1 = name.lastIndexOf('.')
    let ind2 = name.length
    let suffix = name.substring(ind1 + 1, ind2)
    if (RegExp(/pdf/).test(suffix) || RegExp(/PDF/).test(suffix)) {
        return 'pdf'
    } else if (RegExp(/doc/).test(suffix)) {
        return 'word'
    } else if (RegExp(/xl/).test(suffix)) {
        return 'xls'
    } else if (RegExp(/ppt/).test(suffix)) {
        return 'ppt'
    }
}

//文件下载
function downloadFile(url) {
    try {
        var $eleForm = $("<form method='get'></form>");
        $eleForm.attr("action", url);
        $(document.body).append($eleForm);
        $eleForm.submit();
    } catch (e) {
        window.open(url);
    }
}

function openFile(url) {
    // console.log(url)
    if (url.substr(url.lastIndexOf('.')) == '.pdf' || url.substr(url.lastIndexOf('.')) === '.PDF') {
        window.open(url)
    } else {
        window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url)
    }

}


//判断ios or android
function isAndroid() {
    let u = navigator.userAgent, app = navigator.appVersion;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return true
    }
    if (isIOS) {
        return false
    }
}

//申明交互
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
}

function trim(content, el) {
    // console.log($(el).length)
    if ($.trim(content) != '' || $(el).length > 0) {
        return false
    } else {
        return true
    }
}

//导游认证转义
function getValid(type) {
    if (type == -1) {
        return '未认证';
    } else if (type == 0) {
        return '认证中';
    } else if (type == 1) {
        return '认证通过';
    } else if (type == 2) {
        return '认证失败';
    } else if (type == 3) {
        return '认证失效';
    } else {
        return '---';
    }
}

function flgNull(msg) {
    if (msg === null || msg === "" || msg === undefined) {
        return '---'
    } else {
        return msg
    }
}

//时间换算
function sTotime(date) {
    date = Math.round(date / 1000);
    if (date < 60) {
        return date + "''";
    } else if (date < 3600) {
        if (date % 60 == 0) {
            return parseInt(date / 60) + "'"
        } else {
            return parseInt(date / 60) + "'" + (date % 60) + "''"
        }
    }
}

//数组去重
function uniq(array) {
    var temp = [];
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
        }
    }
    return temp
}

//数组对象去重（会话列表）
function sessUniq(oldArr) {
    var allArr = [];
    for (var i = 0; i < oldArr.length; i++) {
        var flag = true;
        for (var j = 0; j < allArr.length; j++) {
            if (oldArr[i].rs_num == allArr[j].rs_num) {
                flag = false;
            }
            ;
        }
        ;
        if (flag) {
            allArr.push(oldArr[i]);
        }
        ;
    }
    ;
    return allArr
}

//base64转图片
function base64ToBlob(dataurl, filename) {
    try {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    } catch (e) {
    }
}


//判断是否是火狐浏览器
function isFirefox() {
    var userAgent = navigator.userAgent;
    var isFF = userAgent.indexOf('Firefox') > -1;
    if (isFF) {
        return true
    } else {
        return false
    }
}

//判断是否是IE
function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;

}

function lengHide(msg) {
    if (msg.length > 10) {
        return msg.substr(0, 5) + '...' + msg.substr(msg.length - 5, msg.length)
    } else {
        return msg
    }
}

//获取key所对应的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//切割字符串转换参数表
function toParamMap(str) {
    var map = {};
    var segs = str.split("&");
    for (var i in segs) {
        var seg = segs[i];
        var idx = seg.indexOf('=');
        if (idx < 0) {
            continue;
        }
        var name = seg.substring(0, idx);
        var value = seg.substring(idx + 1);
        map[name] = value;
    }
    return map;
}

//统一错误返回
function err(res, _that) {
    if (res.success === "00100004" || res.success === "00100002" || res.success === "00100003") {
        if (res.success === "00100004" || res.success === "00100002") {
            _that.$message.error('登录已失效，请重新登录！');
        } else if (res.success === "00100003") {
            _that.$message.error('你的账号在其它地方登陆！');
        }
        setTimeout(() => {
            localStorage.setItem("loginVisitor", "");
            _that.$router.push({path: "/"});
        }, 300)
    } else if (res.success === "00100006") {
        _that.$message.warning(res.msg);
        _that.$router.push({path: "/unbind"});
    } else {
        if (typeof res == 'string') {
            _that.$message.error(JSON.parse(res).msg);
        } else {
            _that.$message.error(res.msg);
        }
    }
}

//null返回空
function isNull(msg) {
    if (msg == null) {
        return ''
    } else {
        return msg.content
    }
}

export default {
    timestampToTime,
    tampToTime,
    timeToTamp,
    timeToTampNotice,
    sortTime,
    objDeepCopy,
    createRandomId,
    threeTime,
    showLast,
    showEnt,
    systemMsg,
    contentMeMsg,
    contentYMsg,
    tripMeMsg,
    tripYMsg,
    noticeMeMsg,
    noticeYMsg,
    newMsg,
    fileType,
    downloadFile,
    openFile,
    isAndroid,
    setupWebViewJavascriptBridge,
    trim,
    getValid,
    flgNull,
    sTotime,
    uniq,
    sessUniq,
    base64ToBlob,
    isFirefox,
    isIE,
    lengHide,
    getQueryString,
    toParamMap,
    err,
    isNull
}

$('header').load('header.html');
$('.left').load($('.left').attr('data')+'.html');
$("#toprightlogout").change(function () {
    if($(this).val()=='logout'){
        iajax(
            wPath.getUrl('userLogout'),
            {},
            function(obj) {
                window.location.href="login.html";
            }
        );

    }
});

function initleft(tab,pslider) {
    tab.each(function () {
        if($(this).attr('data')==getUrlParam('flag')){
            tab.removeClass('active');
            tab.removeClass('normal');
            tab.addClass('normal');
            $(this).removeClass('normal');
            $(this).addClass('active');
        }
    })
    tab.click(function () {
        if($(this).attr('data')=='poor-people'){
        		window.location = 'poor-people.html?flag=poor-people';
        }else if($(this).attr('data')=='poor-village'){
        		window.location = 'poor-village.html?flag=poor-village';
        }else{
            window.location = $(this).attr('data-page')+'.html?flag='+$(this).attr('data');
        }
    });
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//行政区划绘制方法
function getBoundary(map,name) {
    var boundary = new BMap.Boundary();
    boundary.get(name, function (rs) {
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            return;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            //建立多边形覆盖物
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 2,
                strokeColor: "#0000ff",
                strokeOpacity: 1.0,
                fillOpacity: 0.1,
                fillColor: "#ffffff"
            });
            map.addOverlay(ply);  //添加覆盖物
        }
    });
}

function iajax(url, postData, succCallback, errorCallback, type, dataType){
    var type = type || "GET";
    var dataType = dataType || "json";
    layui.use('layer', function() {
        var layer = layui.layer;var lindex='';
        $.ajax({
            type: type,
            url: url,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: postData,
            dataType: dataType,

            beforeSend: function () {  //开始loading
                // lindex = layer.load(2);
            },
            success: function (res) {
                if (res.result == 'SUCCESS') {
                    if (succCallback) {
                        succCallback(res);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback(res);
                    }else{
                        msg='获取接口数据失败';
                        if(res.message){
                            msg=res.message;
                        }
                        layer.msg(msg, {icon: 5});
                    }
                }
            },
            error:function(res){
                layer.msg(res.message, {icon: 5});
                setTimeout('window.location.href="login.html"',3000);
            },
            complete: function () {   //结束loading
                // layer.close(lindex);
            }
        });
    });

}
function getfstr(variable1) {
    if (variable1 == null || variable1 == undefined || variable1 == '') {
        return '';
    }
    return variable1;
}
function closelay() {
    var index=parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
function getdm(dmCode,id,form) {
    iajax(
        wPath.getUrl('dm/getdm'),
        {dmCode:dmCode},
        function(obj){
            $.each(obj.object.subDmList,function (i,o) {
                var hselect='';

                if(o.dm==$("#"+id).attr('data')){
                    hselect='selected="selected"';
                }
                $("#"+id).append('<option value="'+o.dm+'" '+hselect+'>'+o.dmValue+'</option>');
            });
            if( form){
                form.render('select');
            }
        }
    )
}
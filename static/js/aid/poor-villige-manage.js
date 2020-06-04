$(function(){
    queryVillageInfoDetailByVillageId();
    //致贫原因
    queryVillageFamilyPovertyReasonStatistics();
    //生活条件
    queryVillageLiveStatistics();
    //帮扶措施
    queryVillageHelpPlanStatistics();
    //结构分析统计
    queryVillageFamilyAttributeStatistics();
});

var villageId=getUrlParam("areaId");
// var villageId='361102006003';
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//致贫原因
function queryVillageFamilyPovertyReasonStatistics(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        type: "post",
        url: wPath.getUrl('queryVillageFamilyPovertyReasonStatistics'),
        data:{villageId:villageId},
        dataType:'JSON',
        success: function(data) {
            if(data.result ==  "SUCCESS"){
                if(data.object != null) {
                    var dataList = [];
                    var resultList = data.object;
                    for (var i = 0; i < resultList.length; i++) {
                        var obj = {};
                        obj.value = resultList[i].povertyReasonCount;
                        obj.name = resultList[i].povertyReason;
                        dataList.push(obj);
                    }
                    povertyReasonChart(dataList);
                }
            }else{
                new NoticeJs({
                    text: data.message,
                    position: 'middleCenter',
                    animation: {
                        open: 'animated bounceIn',
                        close: 'animated bounceOut'
                    }
                }).show();
            }
        },
        //调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {

        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
    });
}
//南丁格尔图
function povertyReasonChart(dataList){
    var myChart = echarts.init(document.getElementById('nandingger'));
    var Nantinger = {
        tooltip : {
            trigger: 'item',//显示项目信息
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
        series : [
            {
                name: '贫困原因',
                type: 'pie',
                radius: [10, 80],
                center: ['50%', '50%'],
                roseType : 'area',
                data: dataList,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var colorList = ['#9d96f5','#37a2da','#67e0e3','#ffdb5c','#ff9f7f',
                                '#89c997','#f2ac9d', '#f19149','#b3d465','#fff45c','#f19ec2','#96e7f6','#96c2f6'];
                            return colorList[params.dataIndex]
                        }
                    }
                },
            }
        ]
    };
    myChart.setOption(Nantinger);
}

//贫困村信息
function queryVillageInfoDetailByVillageId(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        type: "post",
        url: wPath.getUrl('queryVillageInfoDetailByVillageId'),
        data:{villageId:villageId},
        dataType:'JSON',
        success: function(data) {
            if(data.result ==  "SUCCESS"){
                if(data.object != null) {
                    var html =
                        '<li>名称：' + data.object.village + '</li>' +
                        '<li>所在位置：' + data.object.province + data.object.city + data.object.county + data.object.town + data.object.village + '</li>' +
                        '<li>村负责人：' + data.object.leader + '</li>' +
                        '<li>村办公电话：' + data.object.telephoneNumber + '</li>'
                    $("#basicInfo").append(html);
                    //当前位置
                    $("#location").append(data.object.city + ' > ' +
                        data.object.county + ' > ' + data.object.town + ' > ' + data.object.village);

                    //地图
                    createMap(data.object);

                    //生产条件
                    produceEchart(data.object);
                }else {
                    new NoticeJs({
                        text: '未查询到贫困村信息',
                        position: 'middleCenter',
                        animation: {
                            open: 'animated bounceIn',
                            close: 'animated bounceOut'
                        }
                    }).show();
                }
            }else{
                new NoticeJs({
                    text: data.message,
                    position: 'middleCenter',
                    animation: {
                        open: 'animated bounceIn',
                        close: 'animated bounceOut'
                    }
                }).show();
            }
        },
        //调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {

        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
    });
}

//生产条件
function produceEchart(data){
    var dataList=[];
    dataList.push(data.livestockSum==null?0:data.livestockSum);
    dataList.push(data.waterArea==null?0:data.waterArea);
    dataList.push(data.grassArea==null?0:data.grassArea);
    dataList.push(data.forfruitArea==null?0:data.forfruitArea);
    dataList.push(data.irrigatedArea==null?0:data.irrigatedArea);
    dataList.push(data.grainGreenArea==null?0:data.grainGreenArea);
    dataList.push(data.forestArea==null?0:data.forestArea);
    dataList.push(data.cultivatedArea==null?0:data.cultivatedArea);

    var produce_echart = echarts.init(document.getElementById('produceBar'));
    var produce_bar = {
        tooltip: {
            trigger: 'axis',//显示axis部分信息
            axisPointer: {
                type: 'shadow',
                label: {
                    show: false
                }
            }
        },
        calculable : true,
        grid: {
            top:'10%',
            left: '6%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: {
            show:false,
            splitLine:{show: false},//网格线不显示
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#808080'
                }
            },
            axisLine:{
                show:false,//y轴不显示
            },
            axisTick: {
                show: false//刻度不显示
            },
            type: 'category',
            data: ['畜生存栏数','水域','牧地','林果','有效灌溉','退耕还林','林地','耕地面积']
        },
        series: [
            {
//              name: '2011年',
                type: 'bar',
                barWidth: 14,
                barGap:0.5,
                itemStyle: {
                    normal: {

                        color: function(params) {
                            var colorList = ['#89c997','#f2ac9d', '#f19149','#b3d465','#fff45c','#f19ec2','#96e7f6','#96c2f6'];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data: dataList
            }
        ]
    };
    produce_echart.setOption(produce_bar);

}

//生活条件
function queryVillageLiveStatistics(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        type: "post",
        url: wPath.getUrl('queryVillageLiveStatistics'),
        data:{villageId:villageId},
        dataType:'JSON',
        success: function(data) {
            if(data.result == "SUCCESS"){
                if(data.object != null){
                    lifeChart(data.object);
                }
            }else{
                new NoticeJs({
                    text: data.message,
                    position: 'middleCenter',
                    animation: {
                        open: 'animated bounceIn',
                        close: 'animated bounceOut'
                    }
                }).show();
            }
        },
        //调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {

        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
    });
}

function lifeChart(data){
    var dataList=[];
    dataList.push(data.drinkingTroubleCount==null?0:data.drinkingTroubleCount);
    dataList.push(data.noDrinkSaveCount==null?0:data.noDrinkSaveCount);
    dataList.push(data.dangerBuildingCount==null?0:data.dangerBuildingCount);
    dataList.push(data.ruralTourismCount==null?0:data.ruralTourismCount);
    dataList.push(data.farmStayCount==null?0:data.farmStayCount);
    dataList.push(data.radioTVCount==null?0:data.radioTVCount);
    dataList.push(data.networkCount==null?0:data.networkCount);
    dataList.push(data.gprsCount==null?0:data.gprsCount);

    var life_echart = echarts.init(document.getElementById('lifeBar'));
    var life_bar = {
        tooltip: {trigger: 'item'},
        calculable : true,
        grid: {
            top:'10%',
            left: '3%',
            right: '4%',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            axisTick: { show: false } ,//竖向网格线不显示
            axisLine: {
                lineStyle: {
                    color: '#b58fe8'
                }
            },
            type: 'category',
            axisLabel:{
                interval:0,
                rotate:45,//倾斜度 -90 至 90 默认为0
                margin:2,
                textStyle:{
                    fontsize:1,
//					interval: 'auto',
                    color:"#808080"
                }
            },
            data: ['饮水困难', '未实现饮水安全', '危房户数', '开展乡村旅游', '经营农家乐', '通广播电视', '通宽带', '能用手机上网']
        },
        yAxis: {
            position: 'left',
            splitLine: {show: false},//横向网格线不显示
            axisLine: {
                lineStyle: {
                    color: '#b58fe8'
                }
            },
            type: 'value'
        },
        series:{
            name: '',
            type: 'bar',
            barWidth: 20,
            barGap:0.2,
            itemStyle: {
                normal: {

                    color: new echarts.graphic.LinearGradient(//表格颜色渐变
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#b58fe8'},
                            {offset: 1, color: '#f2ac9d'}
                        ]
                    )
                }
            },
            data: dataList,
        },
    };
    life_echart.setOption(life_bar);
}

//帮扶散点图
function queryVillageHelpPlanStatistics(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        type: "post",
        url: wPath.getUrl('queryVillageHelpPlanStatistics'),
        data:{villageId:villageId},
        dataType:'JSON',
        success: function(data) {
            if(data.result == "SUCCESS"){
                var nameList = [];
                var helpCountList = [];
                var helpAmountList = [];
                var resultList = data.object;
                if(resultList != null && resultList.length > 0){
                    for(var i=0; i<resultList.length; i++){
                        nameList.push(resultList[i].projectCategory);
                        var valList = [];
                        valList[0] = i;
                        valList[1] = resultList[i].helpCount;
                        helpCountList.push(valList);
                        helpAmountList.push(resultList[i].helpAmountSum);
                    }
                    helpPlanChart(nameList, helpCountList, helpAmountList);
                }
            }else{
                new NoticeJs({
                    text: data.message,
                    position: 'middleCenter',
                    animation: {
                        open: 'animated bounceIn',
                        close: 'animated bounceOut'
                    }
                }).show();
            }
        },
        //调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {

        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
    });
}

function helpPlanChart(nameList, helpCountList, helpAmountList){
    var solu_echart = echarts.init(document.getElementById('solu_chart'));
    var solu_bar = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                shadowStyle: {

                },
                label: {
                    show: false
                }
            }
        },
        calculable : true,
        xAxis: {
            axisTick: { show: false } ,//竖向网格线不显示
            axisLine: {
                lineStyle: {
                    color: '#b58fe8'
                }
            },
            type: 'category',
            axisLabel:{
                interval:0,
                rotate:45,//倾斜度 -90 至 90 默认为0
                margin:10,
                textStyle:{
                    fontsize:1,
                    color:"#808080"
                }
            },
            type: 'category',
            data: nameList
        },
        yAxis: [{
            name: '项目数',
            splitLine: {show: false},//横向网格线不显示
            axisLine: {
                lineStyle: {
                    color: '#b58fe8'
                }
            },
        },{
            name: '资金（元）',
            splitLine: {show: false},//横向网格线不显示
            axisLabel: {
                lineStyle: {
                    color: '#b58fe8'
                }
            }
        }],
        series: [{
            name:'项目数',
            symbolSize: 15,//散点大小
            data: helpCountList,
            type: 'scatter',
            itemStyle: {
                normal: {

                    color: new echarts.graphic.LinearGradient(//表格颜色渐变
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#b58fe8'},
                            {offset: 1, color: '#f2ac9d'}
                        ]
                    )
                }
            },
        },{
            name: '资金',
            type: 'line',
            yAxisIndex: 1,
            data: helpAmountList
        }]
    };
    solu_echart.setOption(solu_bar);
}

//结构分析统计
function queryVillageFamilyAttributeStatistics(){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        type: "post",
        url: wPath.getUrl('queryVillageFamilyAttributeStatistics'),
        data:{villageId:villageId},
        dataType:'JSON',
        success: function(data) {
            if(data.result == "SUCCESS"){
                if(data.object != null) {
                    var dataList = [];
                    var nameList = [];
                    var valueList = [];
                    var resultList = data.object;
					var maxArr = [];
					for (var i = 0; i < resultList.length; i++) {
						maxArr.push(resultList[i].familyCount);
					}
					var maxValue = Math.max.apply(null, maxArr);
                    for (var i = 0; i < resultList.length; i++) {
                        if(resultList[i].attribute.indexOf("数") == -1){
                            var obj = {};
                            obj.value = resultList[i].familyCount;
                            obj.name = resultList[i].attribute;
                            dataList.push(obj);
                        }
                        var name = {};
                        name.text = resultList[i].attribute;
						name.max = maxValue * 1.1;
                        nameList.push(name);
                        valueList.push(resultList[i].familyCount);
                    }
                    attributeChart(dataList, nameList, valueList);
                }
            }else{
                new NoticeJs({
                    text: data.message,
                    position: 'middleCenter',
                    animation: {
                        open: 'animated bounceIn',
                        close: 'animated bounceOut'
                    }
                }).show();
            }
        },
        //调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {

        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
    });
}

function attributeChart(dataList, nameList, valueList){
    var cirque_echart = echarts.init(document.getElementById('cirque'));
    var cirque_bar = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'贫困户属性',
                type:'pie',
                radius: ['100%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '12',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {

                        color: function(params) {
                            var colorList = ['#9d96f5','#37a2da','#67e0e3','#ffdb5c','#ff9f7f'];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data:dataList
            }
        ]
    };
    cirque_echart.setOption(cirque_bar);

//六角图
    var hexagonChart = echarts.init(document.getElementById('hexagon'));
    hexagonOption = {
        calculable : true,
        polar : [
            {
                indicator : nameList,
                radius : 60
            }
        ],
		tooltip: {},
        series : [
            {
                name: '贫困户属性',
                type: 'radar',
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'//覆盖面类别
                        }
                    }
                },
                data : [

                    {
                        value : valueList,
                        name : '贫困户'
                    }
                ]
            }
        ]
    };
    hexagonChart.setOption(hexagonOption);
}

function createMap(data){
    cityName = data.city;
    var locationStr = data.city + data.county + data.town + data.village;
    // 创建地图实例
    map = new BMap.Map("allmap");
    //创建信息窗口对象
    var opts = {
        width : 300,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title : locationStr , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
    };
    var infoWindow = new BMap.InfoWindow('<p>农民专业合作社个数：' + data.artelSum + '</p>' +
        '<p style="margin-top:5px;">乡村旅游从业人员数：'+data.ruralTourismStaffSum+ '</p>' +
        '<p style="margin-top:5px;">通宽带的村小学个数：'+data.primarySchoolSum+ '</p>', opts);
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(locationStr, function(point){
        if (point) {
            point = point;
            map.centerAndZoom(point, 10);
            marker = new BMap.Marker(point);
            map.addOverlay(marker);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            marker.addEventListener("click", function(){
                map.openInfoWindow(infoWindow,point); //开启信息窗口
            });
        }else{
            new NoticeJs({
                text: '地址不存在',
                position: 'middleCenter',
                animation: {
                    open: 'animated bounceIn',
                    close: 'animated bounceOut'
                }
            }).show();
        }
    }, data.city);
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    getBoundary(cityName);
}
//行政区划绘制方法
function getBoundary(name) {
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


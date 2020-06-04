if(getUrlParam("countyId")!=''){
    $("#countyId").val(getUrlParam("countyId"));
}
if(getUrlParam("year")!=''){
    $("#year").val(getUrlParam("year"));
}
$("#year").change(function () {
    window.location.href="mpoor.html?year="+$(this).val()+"&countyId="+getUrlParam("countyId")+"&flag=poor-county";
})
//left
setTimeout(iajax(
    wPath.getUrl('countyCondition/queryAreaById'),
    {cityId:361100000000},
    function(obj){
        var lefthtml=' <li class="province"><span><i class="triangle-down"></i>上饶市</span><ul>';
        $.each(obj.object,function (i,o) {
            var pclass='pslider-noactive';
            if((getUrlParam("countyId")=='' && i==0) || getUrlParam("countyId")==o.areaId){
                pclass='pslider-active'
            }
            lefthtml+='<li class="city '+pclass+'" data-id="'+o.areaId+'"><a href="mpoor.html?countyId='+o.areaId+'&year='+$("#year").val()+'&flag=poor-county">'+o.areaName+'</a></li>';
        });
        lefthtml+='</ul></li>';
        $('.pslider').html(lefthtml);
    }
), 1000);
iajax(
    wPath.getUrl('countyCondition/findCountyConditionByCountyId'),
    {countyId:$("#countyId").val(),year:$("#year").val()},
    function(obj){
        var category1 = new Array();var barData1 =new Array();
        $.each(obj.object, function (i, o) {
            category1.push(o.town);
            barData1.push(o.familyNum);
        });
        chart1(category1,barData1);
        $("#countytit").text($(".pslider-active a").text()+"贫困户数  "+obj.message.familyCount+"户/"+obj.message.familyMemberCount+"人");
    }
);
// var reason=['因病','因残','因学','因灾','缺土地','缺水','缺技术','缺劳动力','缺资金','交通条件落后','自身发展动力不足'];
iajax(
    wPath.getUrl('countyCondition/mainPovertyReason'),
    {countyId:$("#countyId").val(),year:$("#year").val()},
    function(obj){
        var data1 = [];var data2 =[];
        $.each(obj.message, function (i, o) {
            if(o.mainPovertyReasonName){
                data1.push({text : o.mainPovertyReasonName, max  : 10000});
                data2.push(o.familyNum);
            }
        });
        if(data1.length>0){
            chart2(data1,data2);
        }
    }
);
iajax(
    wPath.getUrl('countyCondition/countyLandResource'),
    {countyId:$("#countyId").val(),year:$("#year").val()},
    function(obj){
        var data1 = [];
        if(obj.object) {
            data1.push({value:obj.object.cultivatedArea, name:'耕地面积'});
            data1.push({value:obj.object.desertificationArea, name:'荒漠化面积'});
            data1.push({value:obj.object.farmlandArea, name:'基本农田面积'});
            data1.push({value:obj.object.forestArea, name:'林地面积'});
            data1.push({value:obj.object.forfruitArea, name:'林果面积'});
            data1.push({value:obj.object.grainGrassArea, name:'退耕还草面积'});
            data1.push({value:obj.object.grainGreenArea, name:'退耕还林面积'});
            data1.push({value:obj.object.grassArea, name:'牧草地面积'});
            data1.push({value:obj.object.irrigatedArea, name:'有效灌溉面积'});
            data1.push({value:obj.object.rockyDesertificationArea, name:'石漠化面积'});
            data1.push({value:obj.object.waterArea, name:'水域面积'});
            chart3(data1)
        }
    }
);

iajax(
    wPath.getUrl('countyCondition/queryAvgIncome'),
    {countyId:$("#countyId").val(),year:$("#year").val()},
    function(obj){
        var data1 = [];var data2 =[];
        $.each(obj.object, function (i, o) {
            data1.push(o.town);
            data2.push(o.aveIncome);
        });
        chart4(data1,data2);
    }
);

iajax(
    wPath.getUrl('countyCondition/queryCountyLive'),
    {countyId:$("#countyId").val(),year:$("#year").val()},
    function(obj){
        var data1 = [];var data2 = [];
        data1.push({value:obj.object.Nhighway, name:''});
        data1.push({value:obj.object.Yhighway, name:''});
        data2.push({value:obj.object.Ybus, name:''});
        data2.push({value:obj.object.Nbus, name:''});
        $("#isroad").text(obj.message.是否通二级公路);
        $("#moneyinput").text(obj.message.交通部门资金投入);
        chart5(data1);
        chart6(data2);
    }
);

function initchart7() {
    iajax(
        wPath.getUrl('countyCondition/helpPlanByCountyId'),
        {countyId: $("#countyId").val(), year: $("#year").val()},
        function (obj) {
            var data1 = [];
            var data2 = [];
            var data1 = [];
            var data2 = [];
            $.each(obj.object, function (i, o) {
                data1.push(o.town);
                data2.push(o.planAmount);
            });
            chart7(data1, data2);
        }
    );
}

$('#tit span').click(function() {
    var i = $(this).index();
    $(this).siblings().addClass('spnormal');
    $(this).addClass('spactive').siblings().removeClass('spactive');
    $(this).removeClass('spnormal');
    $('#cont .chart2').eq(i).show().siblings().hide();
    if($(this).text()=='帮扶措施'){
        initchart7();
    }

});
function chart1(category1,barData1){
    var myChart = echarts.init(document.getElementById('chart1'));
    option1 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true,
                    backgroundColor: '#333'
                }
            }
        },
        xAxis: {
            data: category1,
            axisTick: { show: false } ,
            axisLine: {
                lineStyle: {
                    color: '#b58fe8'
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                show: true,
                interval: 'auto',
                margin: 8,

            },
        },
        yAxis:
            [

                {
                    type: 'value',
                    name: '',
                    position: 'left',
                    splitLine: {show: false},
                    axisLine: {
                        lineStyle: {
                            color: "#b58fe8"
                        }
                    }
                }

            ],
        series:
            {
                name: '贫苦户数',
                type: 'bar',
                // barWidth: 24,
                // barGap:0.2,
                itemStyle: {
                    normal: {

                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#b58fe8'},
                                {offset: 1, color: '#f2ac9d'}
                            ]
                        )
                    }
                },
                data: barData1
            }
        ,
        grid: {
            left: '5%',
            right: '5%',
            top: '20%',
            // height: '70%',
            containLabel: true,
        },
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option1);
}

function chart2(data1,data2){
        var myChart = echarts.init(document.getElementById('chart2'));
        option = {
            tooltip : {
                trigger: 'item'
            },
            calculable : true,
            polar : [
                {
                    indicator : data1,
                    radius : 100
                }
            ],
            series : [
                {
                    name: '致贫原因',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data : [
                        {
                            value : data2,
                            name : '致贫户数'
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);
}
function chart3(data1){
    var myChart = echarts.init(document.getElementById('chart3'));
    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
        series : [
            {
                name:'面积模式',
                type:'pie',
                radius : [20, 110],
                // center : ['75%', 200],
                roseType : 'area',
                // max: 40,                // for funnel
                sort : 'ascending',     // for funnel
                data:data1
            }
        ]
    };

    myChart.setOption(option);
}
function chart4(data1,data2){
    var myChart = echarts.init(document.getElementById('chart4'));
    option = {
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : data1,
                axisLine: {
                    lineStyle: {
                        color: '#b58fe8'
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLine: {
                    lineStyle: {
                        color: '#b58fe8'
                    }
                },
            }
        ],
        series : [
            {
                name:'贫困户人均收入',
                type:'line',
                itemStyle: {
                    normal: {

                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#b58fe8'},
                                {offset: 1, color: '#f2ac9d'}
                            ]
                        )
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#b58fe8'
                        }, {
                            offset: 1,
                            color: '#f2ac9d'
                        }])
                    }
                },
                data:data2
            }
        ]
    };

    myChart.setOption(option);
}
function chart5(data1){
    var myChart = echarts.init(document.getElementById('chart5'));
    option = {
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : ['50%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    // emphasis : {
                    //     label : {
                    //         show : true,
                    //         position : 'center',
                    //         textStyle : {
                    //             fontSize : '12',
                    //         }
                    //     }
                    // }
                },
                data:data1
            }
        ]
    };

    myChart.setOption(option);
}
function chart6(data1){
    var myChart = echarts.init(document.getElementById('chart6'));
    option = {
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : ['50%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '12',
                            }
                        }
                    }
                },
                data:data1
            }
        ]
    };

    myChart.setOption(option);
}
function chart7(data1,data2){
    var myChart = echarts.init(document.getElementById('chart7'));
    option = {
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : data1,
                axisLine: {
                    lineStyle: {
                        color: '#b58fe8'
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLine: {
                    lineStyle: {
                        color: '#b58fe8'
                    }
                },
            }
        ],
        series : [
            {
                name:'帮扶资金累计',
                type:'line',
                itemStyle: {
                    normal: {

                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#b58fe8'},
                                {offset: 1, color: '#f2ac9d'}
                            ]
                        )
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#b58fe8'
                        }, {
                            offset: 1,
                            color: '#f2ac9d'
                        }])
                    }
                },
                data:data2
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            top: '14%',
            height: '73%',
            containLabel: true,

        },
    };

    myChart.setOption(option);
}
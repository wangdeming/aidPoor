$(function(){
	$("#economy_home_header").load("economy_header.html",function(){
		$("#header_nav_0").addClass("nav_active");
	});
	town_gdp_array = new Array();
	$.ajax({
		type: "post",
		url: wPath.getUrl('listGdpEveryDistrictOnYear'),
		success: function(msg) {
			var datatotal=msg.object;
			var gdpSum_max = datatotal[0].gdpSum;			
			for(var i = 0, l = datatotal.length; i < l; i++) {	
				var left_item_value = datatotal[i].gdpSum/gdpSum_max*190;
				var town_gdp_html = '<div class="distribution_left_item"><span class="left_item_name">' 
				+ datatotal[i].district +'</span><span class="left_item_value" style="width:'
				+ left_item_value +'px;" title="'
				+ datatotal[i].gdpSum +'"></span></div>';				
				$("#town_gdp").append(town_gdp_html);
				town_gdp_array.push({name: datatotal[i].district, value: datatotal[i].gdpSum});
			}
			createEcharts();
		},
		//调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {       		
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
	
	$.ajax({
		type: "post",
		url: wPath.getUrl('industrydistribution'),
		success: function(msg) {
			var datatotal=msg.object;			
			for(var i = 0, l = datatotal.length; i < l; i++) {							
				var industrydistribution_html = '<div class="distribution_right_item"><span class="right_item_name" title="'
				+ datatotal[i].industryName +'">'
				+ datatotal[i].industryName +'</span><span class="right_item_value"></span><span class="right_item_num">'
				+ datatotal[i].investment +'</span></div>';
				$("#industrydistribution_gdp").append(industrydistribution_html);
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
	
	$.ajax({
		type: "get",
		url: wPath.getUrl('totalfiscalrevenue'),
		success: function(msg) {
			var datatotal=msg.object;			
			$("#city_revenue").text(datatotal.totalFiscalRevenue);
			if(datatotal.totalFiscalRevenue >= datatotal.preTotalFiscalRevenue){
				$("#city_revenue").removeClass("valueDown").addClass("valueUp");
			}else{
				$("#city_revenue").removeClass("valueUp").addClass("valueDown");
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
	
	$.ajax({
		type: "get",
		url: wPath.getUrl('gdpcomparison'),
		success: function(msg) {
			var datatotal=msg.object;			
			$("#city_gdp").text(datatotal[0].gdp * 10000);
			$("#cityGdpGrowthRate").text(datatotal[0].growth + '%');
			if(datatotal[0].growth >= datatotal[1].growth){
				$("#cityGdpGrowthRate").removeClass("valueDown").addClass("valueUp");
			}else{
				$("#cityGdpGrowthRate").removeClass("valueUp").addClass("valueDown");
			}
			if(datatotal[0].gdp >= datatotal[1].gdp){
				$("#city_gdp").removeClass("valueDown").addClass("valueUp");
			}else{
				$("#city_gdp").removeClass("valueUp").addClass("valueDown");
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
		
});

function createEcharts(){
	var mapChart;  
    var option;
    $.get('../static/js/economy/SR.json',function(srJson){
    		echarts.registerMap('上饶', srJson);   
        mapChart = echarts.init(document.getElementById('map'));
        option = {
            title: {
                text: '上饶市各县(区)生产总值(单位:万元)',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c} (万元)'
            },
            visualMap: {
                min: town_gdp_array[town_gdp_array.length-1].value,
                max: town_gdp_array[0].value,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                textStyle: {
                    fontSize: '80%',
                    color: '#fff'
                },
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
            },
            series: [{
                name: '上饶市分布图',
                type: 'map',
                map: '上饶', // 自定义扩展图表类型
                aspectScale: 1.0, //地图长宽比. default: 0.75
                selectedMode : 'single',
                textAlign: 'center',
                zoom: 1.1, //控制地图的zoom，动手自己更改下 看看什么效果吧
                // roam: false,
                shadowBlur: 50,
                shadowColor: 'rgba(21,41,185,.75)',
                label: {
                    normal: {
                        textStyle: {
                            color: '#000000'
                        }
                    }
                },
                itemStyle: {
                    normal: {label: {show: true}, color: '#fff', borderColor: '#eee', areaColor: '#ddd'},
                    emphasis: { areaColor: null,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 1,
                        shadowColor: '#000000'},
                },
                data: town_gdp_array,
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 50,
                }
            }]
        }
		mapChart.setOption(option);
        mapChart.dispatchAction({
            type: 'mapSelect',
            name: town_gdp_array[0].name,
        });
    });

    var currentLoc = 0;
    setInterval(function () {
        currentLoc = (currentLoc+1) % town_gdp_array.length;
        mapChart.dispatchAction({
            type: 'mapSelect',
            name: town_gdp_array[currentLoc].name
        });
        currentLoc++;
    }, 2000);
}

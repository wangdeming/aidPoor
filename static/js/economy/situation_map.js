$(function() {
	$("#economy_home_header").load("economy_header.html", function() {
		$("#header_nav_1").addClass("nav_active");
	});
	$(".situation_left_item:first").trigger("click");
	$.each($(".situation_left_item"), function(index, item) {
		$(item).click(function() {
			$(".situation_left_item").css("background-color", "transparent");
			$(this).css("background-color", "rgba(0, 254, 233, 0.15)");
		});
	});

	situation_map_array = new Array();
	situation_map_unit = "";
	situation_map_title = "";
	$.get('../static/js/economy/SR.json', function(srJson) {
		echarts.registerMap('上饶', srJson);
		creatEcharts();
	});

	$("#gross_production").click(function() {
		$.ajax({
			type: "post",
			url: wPath.getUrl('listGdpEveryDistrictOnYear'),
			success: function(msg) {
				console.log(msg);
				var datatotal = msg.object;
				var tempArr = new Array();
				for(var i = 0, l = datatotal.length; i < l; i++) {
					tempArr.push({
						name: datatotal[i].district,
						value: datatotal[i].gdpSum
					});
				}
				situation_map_array = tempArr;
				situation_map_unit = "万元";
				situation_map_title = "生产总值";
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				creatEcharts();
			},
			//调用出错执行的函数
			error: function(e) {
				//请求出错处理
			}
		});
	});

	$("#revenue").click(function() {
		$.ajax({
			type: "post",
			url: wPath.getUrl('listfiscalrevenue'),
			success: function(msg) {
				console.log(msg);
				var datatotal = msg.object;
				var tempArr = new Array();
				for(var i = 0, l = datatotal.length; i < l; i++) {
					tempArr.push({
						name: datatotal[i].district,
						value: datatotal[i].fiscalRevenue
					});
				}
				situation_map_array = tempArr;
				situation_map_unit = "万元";
				situation_map_title = "财政收入";
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				creatEcharts();
			},
			//调用出错执行的函数
			error: function(e) {
				//请求出错处理
			}
		});
	});

	$("#total_retail_sales").click(function() {
		$.ajax({
			type: "post",
			url: wPath.getUrl('listretailsales'),
			success: function(msg) {
				console.log(msg);
				var datatotal = msg.object;
				var tempArr = new Array();
				for(var i = 0, l = datatotal.length; i < l; i++) {
					tempArr.push({
						name: datatotal[i].district,
						value: datatotal[i].retailSales
					});
				}
				situation_map_array = tempArr;
				situation_map_unit = "万元";
				situation_map_title = "零售品销售总额";
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				creatEcharts();
			},
			//调用出错执行的函数
			error: function(e) {
				//请求出错处理
			}
		});
	});

	$("#electricity_consumption").click(function() {
		$.ajax({
			type: "post",
			url: wPath.getUrl('electricityconsumption'),
			success: function(msg) {
				console.log(msg);
				var datatotal = msg.object;
				var tempArr = new Array();
				for(var i = 0, l = datatotal.length; i < l; i++) {
					tempArr.push({
						name: datatotal[i].district,
						value: datatotal[i].electricityConsumption
					});
				}
				situation_map_array = tempArr;
				situation_map_unit = "万千瓦时";
				situation_map_title = "用电量";
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				creatEcharts();
			},
			//调用出错执行的函数
			error: function(e) {
				//请求出错处理
			}
		});
	});

	$("#gross_production").trigger("click");

});

function creatEcharts() {
	mapChart = echarts.init(document.getElementById('map'));
	option = {
		title: {
			text: '上饶市各县(区)' + situation_map_title,
			left: 'center',
			top: 20,
			textStyle: {
				color: '#fff'
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: '{b}<br/>{c} (' + situation_map_unit + ')'
		},
		visualMap: {
			min: situation_map_array[situation_map_array.length-1].value,
			max: situation_map_array[0].value,
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
			data: situation_map_array,
            markPoint: {
                symbol: 'circle',
                symbolSize: 50,
            }
		}]
	}
	mapChart.setOption(option, {
            notMerge: true,
	});
    mapChart.dispatchAction({
        type: 'mapSelect',
        name: situation_map_array[0].name,
    });
}



var currentLoc = 0;
setInterval(function () {
    currentLoc = (currentLoc+1) % situation_map_array.length;
    mapChart.dispatchAction({
        type: 'mapSelect',
        name: situation_map_array[currentLoc].name
    });
    currentLoc++;
}, 2000);




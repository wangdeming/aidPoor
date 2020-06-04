$(function(){
	$("#economy_home_header").load("economy_header.html",function(){
		$("#header_nav_3").addClass("nav_active");		
	});
	var mapChart;  
    var option;
    $.get('../static/js/economy/SR.json',function(srJson){
    		echarts.registerMap('上饶', srJson);   
        mapChart = echarts.init(document.getElementById('map'));
        option = {     
                tooltip: {  
                    trigger: 'item',  
                    formatter: '{b}<br/>{c} (亿元)'  
                },                                
                series:[  
                    {  
                    name: '上饶市分布图',  
                        type: 'map',  
                        map: '上饶', // 自定义扩展图表类型  
                        aspectScale: 1.0, //地图长宽比. default: 0.75  
                        zoom: 1.1, //控制地图的zoom，动手自己更改下 看看什么效果吧  
                        roam: false,  
                        itemStyle:{  
                            normal:{areaColor: '#00fee9',label:{show:true}},
                            emphasis:{areaColor: 'rgb(233,246,45)',label:{show:true}}  
                        } ,
                        data:[
			                {name: "万年县", value: 25.0369},
							{name: "上饶县", value: 39.1103},
							{name: "余干县", value: 25.8257},
							{name: "信州区", value: 44.7153},
							{name: "婺源县", value: 17.7968},
							{name: "广丰区", value: 66.7963},
							{name: "弋阳县", value: 21.1368},
							{name: "德兴市", value: 25.9389},
							{name: "横峰县", value: 15.5829},
							{name: "玉山县", value: 25.4884},
							{name: "鄱阳县", value: 38.7417},
							{name: "铅山县", value: 21.8063}
			            ]
                    }
                ]  
            }  
            mapChart.setOption(option);
    });
});

var myCircle = Circles.create({
  id:                  'circle_rate',
  radius:              39,
  value:               89,
  maxValue:            100,
  width:               10,
  text:                "优",
  colors:              ['#4B253A','#D3B6C6'],
  duration:            400
});
		function right_chart4(category1,lineData1,barData1){
			var myChart = echarts.init(document.getElementById('chart4'));
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
						color: '#00fee9'
					}
				},
				axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
					show: true,
					interval: 'auto',
					rotate: 270,
					margin: 8,
					
				},
			},
			yAxis:
			[
				
				{
					type: 'value',
					name: '',
					min: 0,
					max: 2000,
					
					position: 'left',
					splitLine: {show: false},
					axisLine: {
						lineStyle: {
							color: "#00fee9"
						}
					}
				},
				{
					type: 'value',
					name: '',
					min: 0,
					max: 20,
					splitLine: {show: false},
					position: 'right',
					axisLine: {
						lineStyle: {
							color: "#00fee9"
						}
					}
				}
				
			],
			series: [
			 {
				name: '生产总值（亿元）',
				type: 'bar',
				barWidth: 15,
				barGap:0.2,
				itemStyle: {
					normal: {
					   
						color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1,
							[
								{offset: 0, color: 'rgb(176,255,248)'},
								{offset: 1, color: '#00fee9'}
							]
						)
					}
				},
				data: barData1
			},
			{
				name:'增长（%）',
				type:'line',
				smooth:true,
				 yAxisIndex: 1,
				symbol: 'Circle',
				
				itemStyle: {
					normal: {
						color: '#fff100'
					}
				},
				data: lineData1
			},]
			,
			grid: {
				left: '5%',
				right: '5%',
				top: '5%',
				height: '70%',
				containLabel: true,
				
			},
		};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option1);	
}
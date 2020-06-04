$(function(){

    var _baseurl=wPath.getPrefix()+'/';
    //ajax data
    getindustrycomparison(_baseurl,2016);
    //left tab
    $('#tit span').click(function() {
        var i = $(this).index();
        $(this).addClass('select').siblings().removeClass('select');
        $('#con .tab').eq(i).show().siblings().hide();
        getindustrycomparison(_baseurl,$(this).text());
    });
    $("#economy_home_header").load("economy_header.html",function(){
        $("#header_nav_2").addClass("nav_active");
    });
    //center chart1
    var lineData1= [];//增长%
    var barData1 = [];//生产总值
    var category1 = [];//横坐标数据
    $.get(_baseurl+"gdpcomparison", function(obj){
        if(obj.result=='SUCCESS'){
            $.each(obj.object,function (i,o) {
                category1.push(o.year);
                lineData1.push(o.growth);
                barData1.push(o.gdp);
            });
        }
        // console.log(category1); console.info(lineData1);console.info(barData1);
        center_chart1(category1,lineData1,barData1);
    });


    //center chart2
    var data1 = [];
    var data2=[];
    $.get(_baseurl+"industrydistributionchart", function(obj){
        if(obj.result=='SUCCESS'){
            $.each(obj.object,function (i,o) {
                if(i=='one'){
                    data1=o;
                }
                if(i=='two'){
                    data2=o;
                }
            });
        }
        // console.log(data1); console.info(data2);;
        center_chart2(data1,data2);
    });



    //right chart3
    var category3 = ['第一产业','第二产业','第三产业'];
    var lineData3= ['第一季度','第二季度','第三季度','第四季度',];//横坐标数
    var barData31 =[];//第一产业季度统计
    var barData32 =[];//第二产业季度统计
    var barData33 =[];//第三产业季度统计
    $.get(_baseurl+"quarterlystatistics", function(obj){
        if(obj.result=='SUCCESS'){
            $.each(obj.object,function (i,o) {
                barData31[(o.quarter-1)]=o.primaryIndustry/1;
                barData32[(o.quarter-1)]=o.secondaryIndustry/1;
                barData33[(o.quarter-1)]=o.tertiaryIndustry/1;
            });
        }
        // console.log(barData31); console.info(barData32);
        right_chart3(category3,lineData3,barData31,barData32,barData33);
    });

});


function getindustrycomparison(_baseurl,year) {
	var _growth="",_investment="",_industryName="";
    $.get(_baseurl+"industrycomparison?year="+year, function(obj){
        $("#tablehtml").html('');
        if(obj.result=='SUCCESS'){
            $.each(obj.object,function (i,o) {
				if(o.industryName){
                    _industryName=o.industryName;
				}
                if(o.investment){
                    _investment=o.investment;
                }
                if(o.growth){
                    _growth=o.growth;
                }
                $("#tablehtml").append('<ul class="table-row"> ' +
                    '<li class="table-cell w207">'+_industryName+'</li> ' +
                    '<li class="table-cell w75">'+_investment+'</li>' +
                    '<li class="table-cell w108">'+_growth+'</li>' +
                    '</ul>');
            })
        }
    });
}
function center_chart1(category1,lineData1,barData1){
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
    legend: {
        data: [ '生产总值（亿元）','增长（%）'],
		y: 'bottom',
        textStyle: {
            color: '#00fee9'
        }
    },
    xAxis: {
        data: category1,
        axisLine: {
            lineStyle: {
                color: '#00fee9'
            }
        }
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
					color: "#00fee9"
				}
			}
		},
		{
            type: 'value',
			name: '',
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
        barWidth: 24,
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
		sampling: 'average',
		itemStyle: {
			normal: {
				color: '#fff100'
			}
		},
		areaStyle: {
			normal: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					color: '#fff100'
				}, {
					offset: 1,
					color: 'rgb(29, 61, 53)'
				}])
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
	//center chart2
function center_chart2(data1,data2){

	var myChart = echarts.init(document.getElementById('chart2'));
	option2 = {
	color:['#9ebffa','#f9db71','#87dde1','#57a1d5','#817be3','#e0beef','#f2a385','#ea7a94'],
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
   
    series: [
			{
				name:'产业分布',
				type:'pie',
				selectedMode: 'single',
				radius: [0, '30%'],
	
				label: {
					normal: {
						position: 'inner'
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:data1
			},
			{
				name:'产业分布',
				type:'pie',
				radius: ['40%', '55%'],
				label:{show:false},
				data:data2,
			}
		]
	};
	myChart.setOption(option2);	
}

function right_chart3(category3,lineData3,barData31,barData32,barData33){
	var myChart = echarts.init(document.getElementById('chart3'));
	option3 = {
	color:'#00fee9',
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
    legend: {
		y: 'bottom',
        data:category3,
		 textStyle: {
            color: '#00fee9'
        }
    },
 
    xAxis : [
        {
            type : 'category',
            data : lineData3,
			axisTick:{show:false},
			axisLine: {
				show: false,
				lineStyle: {
					color: '#00fee9'
				}
        	} 
        }
    ],
    yAxis : {
			splitLine: {show: false},
			axisLine: { show: false } ,
			axisTick: { show: false } ,
			axisLabel:{show:false}
    },
    series : [
			{
				name:'第一产业',
				type:'bar',
				data:barData31,
				 
			},
			{
				name:'第二产业',
				barGap: 0,
				type:'bar',
				data:barData32,
				itemStyle: { 
						color: 'rgb(8,205,254)'
				}
			   
			},
			{
				name:'第三产业',
				type:'bar',
				data:barData33,
				itemStyle: { 
						color: 'rgb(118,254,8)'
				}
			},
		],
    grid: {
        left: '10%',
        right: '10%',
        top: '15%',
        height: '70%',
        containLabel: true,
       	
    },
	};
	myChart.setOption(option3);	
}
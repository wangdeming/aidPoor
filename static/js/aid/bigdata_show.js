var myChart;
var amount_poverty_thisyear;//今年扶贫库总人数
var numberOfOutPoverty_thisyear;//今年脱贫总人数
var amount_poverty_lastyear;//去年扶贫库总人数
var numberOfOutPoverty_lastyear;//去年脱贫人数
var thisyear;//今年的年号
var lastyear;//去年的年号

var numberOfPoverty; //贫困人口数
var numberOfFanpin; //返贫人口数
var numberOfWeiFanPin; //未返贫人口数
var numberOfWillOutPovertyThisYear;//今年预脱贫人口数

var cityName;
var cityLatAndLon;
var mapCount;

$(function(){	
	myChart = echarts.init(document.getElementById('echartDiv'));	
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('index'),
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				var datatotal = msg.object;
				//地图数据
				mapCount = datatotal.mapCount;
				//扶贫库总人数
				var povertyBankCount = datatotal.povertyBankCount;
				//今年数据
				amount_poverty_thisyear = povertyBankCount.currentCount.povertyCount;
				numberOfOutPoverty_thisyear = povertyBankCount.currentCount.overcomePovertyCount;
				thisyear = povertyBankCount.currentCount.year;
				//去年数据
				amount_poverty_lastyear = povertyBankCount.preCount.povertyCount;
				numberOfOutPoverty_lastyear = povertyBankCount.preCount.overcomePovertyCount;
				lastyear = povertyBankCount.preCount.year;
				$("#thisyear").text(thisyear);
				$("#lastyear").text(lastyear);
				if(numberOfOutPoverty_thisyear == 0 || amount_poverty_thisyear == 0){
					amount_poverty_thisyear = 536731;
					numberOfOutPoverty_thisyear = 123210;
				}
				if(numberOfOutPoverty_lastyear == 0 || amount_poverty_lastyear == 0){
					amount_poverty_lastyear = 587653;
					numberOfOutPoverty_lastyear = 145638;
				}
				//点击今年按钮
				$("#thisyear").click(function(){
					$(this).css("background-color","#ae5dcb");
					$("#lastyear").css("background-color","#613f74");									    
				    drawLeftOne(parseFloat(numberOfOutPoverty_thisyear / amount_poverty_thisyear));
			    		$("#dataNums").rollNum({
				        deVal:amount_poverty_thisyear,
				        digit:'10'
				    });
				    $("#overcomePovertyCount").text(numberOfOutPoverty_thisyear);				    	
				});
				//点击去年按钮
				$("#lastyear").click(function(){
					$(this).css("background-color","#ae5dcb");
					$("#thisyear").css("background-color","#613f74");					
				    drawLeftOne(parseFloat(numberOfOutPoverty_lastyear / amount_poverty_lastyear));
			    		$("#dataNums").rollNum({
				        deVal:amount_poverty_lastyear,
				        digit:'10'
				    });
				    $("#overcomePovertyCount").text(numberOfOutPoverty_lastyear);				   
				});
				
				//数据一览
				var povertyCountByType = datatotal.povertyCountByType;
				numberOfPoverty = povertyCountByType.povertyCount;  //贫困人口数
				numberOfFanpin = povertyCountByType.returnPovertyCount;  //返贫人数
				numberOfWeiFanPin = povertyCountByType.noReturnPovertyCount;  //未返贫人数
				numberOfWillOutPovertyThisYear = povertyCountByType.relievePovertyCount;  //本年度预脱贫人数
				if(numberOfPoverty != 0 && amount_poverty_thisyear != 0){
					drawDataList("left_two_right_item_one","#60b2f6",numberOfPoverty/amount_poverty_thisyear,numberOfPoverty);
				}else{
					drawDataList("left_two_right_item_one","#60b2f6",0.5,406895);
				}				
				if(numberOfFanpin != 0 && numberOfOutPoverty_thisyear != 0){
					drawDataList("left_two_right_item_two","#e885e7",numberOfFanpin/numberOfOutPoverty_thisyear,numberOfFanpin);
				}else{
					drawDataList("left_two_right_item_two","#e885e7",0.4,8969);
				}				
				if(numberOfWeiFanPin != 0 && numberOfOutPoverty_thisyear != 0){
					drawDataList("left_two_right_item_three","#9cc666",numberOfWeiFanPin/numberOfOutPoverty_thisyear,numberOfWeiFanPin);
				}else{
					drawDataList("left_two_right_item_three","#9cc666",0.6,397955);
				}				
				if(numberOfWillOutPovertyThisYear != 0 && numberOfPoverty != 0){
					drawDataList("left_two_right_item_four","#b47ef0",parseFloat(numberOfWillOutPovertyThisYear)/numberOfPoverty,numberOfWillOutPovertyThisYear);
				}else{
					drawDataList("left_two_right_item_four","#b47ef0",0.4,51695);
				}	
				
				//帮扶措施
				if(typeof(datatotal.helpRatio) == "undefined"){		
					var numberArr = ['6%','7%','8%','15%','22%','42%'];
					drawPolicies(numberArr);
				}else{
					var helpRatio = datatotal.helpRatio;
					var numberArr = [helpRatio.moveRatio+'%',
									helpRatio.educationRatio+'%',
									helpRatio.serviceRatio+'%',
									helpRatio.otherRatio+'%',
									helpRatio.industryRatio+'%',
									helpRatio.guaranteeRatio+'%',];
	
					drawPolicies(numberArr);
				}				
				
				//致贫原因分析
				var mainPovertyReasonRatio = datatotal.mainPovertyReasonRatio;
				if(mainPovertyReasonRatio.length == 0){
					var reasonArr = ["原因一","原因二","原因三","原因四","原因五","原因六","原因七","原因八","原因九","原因十",];
					var proportionaArr = [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1];
					drawReasonOfPoverty(reasonArr,proportionaArr);
				}else{
					var reasonArr = new Array();
					var proportionaArr = new Array();
					for(var i = 0;i<mainPovertyReasonRatio.length;i++){
						if(typeof(mainPovertyReasonRatio[i].mainPovertyReasonName)=="undefined"){
							reasonArr.push("原因"+i);
						}else{
							reasonArr.push(mainPovertyReasonRatio[i].mainPovertyReasonName);
						}						
						proportionaArr.push(mainPovertyReasonRatio[i].ratio);
					}				
					drawReasonOfPoverty(reasonArr,proportionaArr);
				}								
				//帮扶任务数据管理
				var helpTaskDataManagement = datatotal.helpTaskDataManagement;
				if(typeof(helpTaskDataManagement.planAmount) == "undefined"){
					odoo.default({ el:'#numOfFunds',value:'￥1,098,660,000'});
				}else{
					var planAmount = helpTaskDataManagement.planAmount;
					odoo.default({ el:'#numOfFunds',value:'￥'+ planAmount });
				}
				if(typeof(helpTaskDataManagement.helpPlanCount) == "undefined" || helpTaskDataManagement.helpPlanCount == 0){
					$("#helpPlanCount").text('9个');
				}else{
					$("#helpPlanCount").text(helpTaskDataManagement.helpPlanCount + '个');
				}
				if(typeof(helpTaskDataManagement.helpBenefitPersonCount) == "undefined" || helpTaskDataManagement.helpBenefitPersonCount == 0){
					$("#helpBenefitPersonCount").text('5689687人');
				}else{
					$("#helpBenefitPersonCount").text(helpTaskDataManagement.helpBenefitPersonCount + '人');
				}												
				if(typeof(helpTaskDataManagement.helpPersonCount) == "undefined" || helpTaskDataManagement.helpPersonCount == 0){
					$("#helpPersonCount").text('1402人');
				}else{
					$("#helpPersonCount").text(helpTaskDataManagement.helpPersonCount + '人');
				}				
				if(typeof(helpTaskDataManagement.familyConditionCount) == "undefined" || helpTaskDataManagement.familyConditionCount == 0){
					$("#familyConditionCount").text('11685户');
				}else{
					$("#familyConditionCount").text(helpTaskDataManagement.familyConditionCount + '户');
				}
				
				if(typeof(helpTaskDataManagement.visitRecordCount) == "undefined" || helpTaskDataManagement.visitRecordCount == 0){
					$("#visitRecordCount").text('789次');					
				}else{
					$("#visitRecordCount").text(helpTaskDataManagement.visitRecordCount + '次');
				}
				
				if(typeof(helpTaskDataManagement.helpCompleteGrowthRatio) == "undefined" || helpTaskDataManagement.helpCompleteGrowthRatio == 0){
					$("#helpCompleteGrowthRatio").text('20.1%');
				}else{
					$("#helpCompleteGrowthRatio").text(helpTaskDataManagement.helpCompleteGrowthRatio + '%');
				}				
				//帮扶完成进度				
				if(typeof(datatotal.helpCompletionProgress) == "undefined"){
					drawProgressOfHelp(0.26);
				}else{
					drawProgressOfHelp(datatotal.helpCompletionProgress);
				}
				//资金使用情况
				if(typeof(datatotal.useFunds) == "undefined" || datatotal.useFunds.length == 0){
					var monthArr = ["一月","三月","五月","七月","九月","十一月",];
					var useFundArr = [123456,234567,345678,456789,567890,678901];
					createEcharts(monthArr,useFundArr);
				}else{
					var useFunds = datatotal.useFunds;
					var monthArr = new Array();
					var useFundArr = new Array();
					for(var i = 0;i<useFunds.length;i++){
						monthArr.push(useFunds[i].month);
						useFundArr.push(useFunds[i].planAmount);
					}
					createEcharts(monthArr,useFundArr);
				}
				//检查异常
				var checkCount = datatotal.checkCount;
				if(checkCount.exceptionCount == 0){
					$("#exceptionCount").text('98人');
				}else{
					$("#exceptionCount").text(checkCount.exceptionCount+'人');
				}
				if(checkCount.cleanCount == 0){
					$("#cleanCount").text('27人');
				}else{
					$("#cleanCount").text(checkCount.cleanCount+'人');
				}
				if(checkCount.retainCount == 0){
					$("#retainCount").text('71人');
				}else{
					$("#retainCount").text(checkCount.retainCount+'人');
				}				
				if(checkCount.exceptionCount == 0){
					var amountOfAbnormal = 98;
					var outOfAbnormal = 27;
					drawPieOfAbnormal(amountOfAbnormal,outOfAbnormal);
				}else{
					drawPieOfAbnormal(checkCount.exceptionCount,checkCount.cleanCount);
				}
				//异常检查统计
				var checkCountByType = datatotal.checkCountByType;
				var tempTypeArray = new Array();
				if(typeof(checkCountByType.shareholderCount) == "undefined" || checkCountByType.shareholderCount == 0){
					tempTypeArray.push("28人");
				}else{
					tempTypeArray.push(checkCountByType.shareholderCount + "人");
				}
				if(typeof(checkCountByType.haveCarCount) == "undefined" || checkCountByType.haveCarCount == 0){
					tempTypeArray.push("19人");
				}else{
					tempTypeArray.push(checkCountByType.haveCarCount + "人");
				}
				if(typeof(checkCountByType.livingFacilitiesFineCount) == "undefined" || checkCountByType.livingFacilitiesFineCount == 0){
					tempTypeArray.push("17人");
				}else{
					tempTypeArray.push(checkCountByType.livingFacilitiesFineCount + "人");
				}
				if(typeof(checkCountByType.haveMachineCount) == "undefined" || checkCountByType.haveMachineCount == 0){
					tempTypeArray.push("16人");
				}else{
					tempTypeArray.push(checkCountByType.haveMachineCount + "人");
				}
				if(typeof(checkCountByType.haveCommodityHouseCount) == "undefined" || checkCountByType.haveCommodityHouseCount == 0){
					tempTypeArray.push("32人");
				}else{
					tempTypeArray.push(checkCountByType.haveCommodityHouseCount + "人");
				}
				if(typeof(checkCountByType.financialSupportCount) == "undefined" || checkCountByType.financialSupportCount == 0){
					tempTypeArray.push("7人");
				}else{
					tempTypeArray.push(checkCountByType.financialSupportCount + "人");
				}
				if(typeof(checkCountByType.villageCadreCount) == "undefined" || checkCountByType.villageCadreCount == 0){
					tempTypeArray.push("5人");
				}else{
					tempTypeArray.push(checkCountByType.villageCadreCount + "人");
				}
				if(typeof(checkCountByType.highConsumption) == "undefined" || checkCountByType.highConsumption == 0){
					tempTypeArray.push("9人");
				}else{
					tempTypeArray.push(checkCountByType.highConsumption + "人");
				}
				if(typeof(checkCountByType.incomeExpenditure) == "undefined" || checkCountByType.incomeExpenditure == 0){
					tempTypeArray.push("28人");
				}else{
					tempTypeArray.push(checkCountByType.incomeExpenditure + "人");
				}
				if(typeof(checkCountByType.haveHighGradeAppliancesCount) == "undefined" || checkCountByType.haveHighGradeAppliancesCount == 0){
					tempTypeArray.push("18人");
				}else{
					tempTypeArray.push(checkCountByType.haveHighGradeAppliancesCount + "人");
				}
				
				drawAbnormalDetails(tempTypeArray);
				
				//走访记录
				createVisitList();				
								
			}else{
				new NoticeJs({
				    text: msg.message,
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
        		//默认点击今年的按钮
			$("#thisyear").trigger("click");
			var ip = '223.84.134.60';//returnCitySN["cip"];
		    	$.ajax({
		         type: "GET",
		         url: 'http://api.map.baidu.com/location/ip?ip='+ ip +'&ak=OyUHa2lhUWhzn6BDskAy8YjzqXNDvArU&coor=bd09ll',
		         dataType: "JSONP",
		         success: function(data){
		             if(data.status == 0){
		             	cityName = data.content.address;
		             	cityLatAndLon = data.content.point;
		             }else{
		             	cityName = "江西省上饶市";
		             	cityLatAndLon =  {x: "117.95546388", y: "28.45762255"};
		             }
		          },
		         complete:function(XMLHttpRequest,textStatus){
		         	createMap();
		         }
		     });
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
			          	   	        	    	             	        	     
     $("#loginoutBtn").click(function(){
     	$.ajax({
     		xhrFields: {
		       withCredentials: true
		    },
		    crossDomain: true,
     		type:"GET",
     		url:wPath.getUrl('userLogout'),
     		dataType:"JSON",
     		success:function(msg){
     			if(msg.result == "SUCCESS"){
     				window.location.href = "login.html";
     			}else{
     				new NoticeJs({
					    text: msg.message,
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
	        }
     	});
     });
     
});
var nt_example1 = $('#right_two_bottom').newsTicker({
    row_height: 60,
    max_rows: 5,
    duration: 2000,
});
			
function createMap(){
	//百度地图的设置
	map = new BMap.Map("map");          // 创建地图实例
	map.centerAndZoom(new BMap.Point(parseFloat(cityLatAndLon.x), parseFloat(cityLatAndLon.y)), 9);   // 初始化地图，设置中心点坐标和地图级别
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	getBoundary(cityName);
	map.addEventListener("zoomend", function () {
	    map.panTo(new BMap.Point(parseFloat(cityLatAndLon.x), parseFloat(cityLatAndLon.y)));
	});		
	opts = {
			width : 250,     // 信息窗口宽度
			height: 60,     // 信息窗口高度
			enableMessage:true//设置允许信息窗发送短息
		   };
	for (var i = 0;i<mapCount.length;i++) {
		getBoundary(mapCount[i].countyName);		
		myGeo = new BMap.Geocoder();
		var content = '<p>'+ mapCount[i].countyName +'</p><p>贫困总户数：'+ mapCount[i].familyCount +'户</p><p>贫困总人数：'+ mapCount[i].personCount +'人</p>';
		geocodeSearch(mapCount[i].countyName,content);
	}		   		
}
function geocodeSearch(add,content){
	myGeo.getPoint(add, function(point){
		if (point) {
			marker = new BMap.Marker(point); 				
			map.addOverlay(marker);
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			marker.addEventListener("click",function(){
			var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
			map.openInfoWindow(infoWindow,point); //开启信息窗口
			});			
		}
	}, "合肥市");
}

$(window).resize(function () {          //当浏览器大小变化时
    myChart.resize();
});

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

function drawLeftOne(gate){
	var x = 75;
	var y = 75;
	var r = 75;
	var radius = 62.5;
	var startAngle = (Math.PI / 180) * 180;
	var endAngle1   = (Math.PI / 180) * 180 + Math.PI * gate;
	var endAngle2 = Math.PI * 2;
	var anticlockwise = false;
	
	var lineX=x + r * Math.cos(endAngle1);
	var liney=y + r *Math.sin(endAngle1);
	
	var canvas = document.getElementById('amount_shuck_poverty');	
	canvas.height=canvas.height;
	if(canvas.getContext){
		var ctx = canvas.getContext('2d');		
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle2, anticlockwise);
		ctx.lineWidth = 25;
		ctx.strokeStyle = "#ae5dcb";
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle1, anticlockwise);
		ctx.lineWidth = 25;
		ctx.strokeStyle = "#bc01ff";
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(lineX,liney);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#ff0000";
		ctx.stroke();
	}
}

function drawDataList(canvasId,color,number,numberOfPeople){
	var canvas = document.getElementById(canvasId);
	var ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.fillStyle = "#404a73";
    ctx.fillRect(0,20, 280,12);
    
    ctx.beginPath();
    ctx.fillStyle = color;
    var rectWidth = number * 280;
    ctx.fillRect(0,20, rectWidth,12);
    
    ctx.beginPath();
    ctx.textAlign="right";  
    ctx.font = "normal normal 12px 方正兰亭中黑";
	ctx.fillStyle = "#b0e1ff";
	ctx.fillText(numberOfPeople + "",280,18);
}

function drawPolicies(numberArr){
	var textArr = ["搬迁帮扶","教育帮扶","服务帮扶","其他帮扶","产业帮扶","保障帮扶"];
	var colorArr = ["#7EC5A5","#EE4651","#F7CA55","#36B9EA","#B08FC9","#734DE4"];
	var canvas  = document.getElementById("left_three_canvas");
	var ctx = canvas.getContext("2d");	
	ctx.beginPath();
	ctx.font = "normal normal 14px 方正兰亭中黑";
	ctx.fillStyle = "#b0e1ff";
	for(var i = 0;i<textArr.length;i++){
		ctx.fillText(textArr[i], 42, 35*(i+1));
	}
	
	ctx.beginPath();
	ctx.strokeStyle = "#b0e1ff";
	ctx.lineWidth = 1;
	ctx.setLineDash([2,2]);
	
	for(var i = 0;i<textArr.length;i++){
		ctx.moveTo(105,30+35*i);
		ctx.lineTo(105+122-i*18,30+35*i);
		ctx.stroke();
	}
	
	for(var i=0;i<colorArr.length;i++){	
		ctx.beginPath();
		ctx.moveTo(251,15);
		ctx.lineTo(362-i*35*111/210,225-35*i);
		ctx.lineTo(140+i*35*111/210,225-35*i);
		ctx.fillStyle = colorArr[i];
		ctx.fill();
	}
	
	ctx.beginPath();
	ctx.font = "normal normal 10px 方正兰亭中黑";
	ctx.fillStyle = "#212226";
	for(var i = 0;i<numberArr.length;i++){
		ctx.fillText(numberArr[i],245,20+35*(i+1/2));
	}
}
function drawReasonOfPoverty(reasonArr,proportionaArr){
	var canvas  = document.getElementById("left_four_canvas");
	var ctx = canvas.getContext("2d");	
	
	for(var i = 0;i<reasonArr.length;i++){
		
		var x = 73*(i%5 + 1) - 20;
		var y = 80*(parseInt(i/5) + 1) - 20;
		var radius = 20;
		var startAngle = 0;
		var endAngle = Math.PI * 2;
		var endAngle1 = Math.PI * 2*proportionaArr[i] / 100;
		var anticlockwise = false;
		
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		
		var linearGradient1 = ctx.createLinearGradient(x-20,y,x+20,y);
		linearGradient1.addColorStop(0, '#2a84ff');
		linearGradient1.addColorStop(1, '#8b0fff');
		 
		ctx.fillStyle = linearGradient1;
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.arc(x, y, radius, startAngle, endAngle1, anticlockwise);
		ctx.fillStyle = "#00fff0";
		ctx.fill();
		
		ctx.beginPath();
		ctx.font = "normal normal 10px 方正兰亭中黑";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(proportionaArr[i] +'%', x - 10, y -5);
		
		ctx.beginPath();
		ctx.font = "normal normal 14px 方正兰亭中黑";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(reasonArr[i], x - 20, y + 35);
	}
}
function drawProgressOfHelp(percent){
	var x = 54;
	var y = 54;
	var r = 50;
	var startAngle = 0;
	var endAngle1   = Math.PI * 2 * (1 - percent);
	var endAngle2 = Math.PI * 2;
	var anticlockwise = true;
	var canvas = document.getElementById("progressOfHelp");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 8;
	
	ctx.beginPath();
	ctx.arc(x, y, r, startAngle, endAngle2, anticlockwise);
	ctx.strokeStyle = "#8E00FF";
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(x, y, r, startAngle, endAngle1, anticlockwise);
	ctx.strokeStyle = "#00DBFF";
	ctx.stroke();
	
	ctx.beginPath();
	ctx.font = "normal normal 24px 方正兰亭中黑";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(percent * 100 + '%', x - 20, y + 10);
}

function createEcharts(monthArr,useFundArr){	
    // 指定图表的配置项和数据
    var option = {  
        xAxis: {
        		type: 'category',
    			boundaryGap: false,
            data: monthArr
        },
        tooltip : {
	         trigger: 'item',
    			formatter: "{a}-{b}:{c}"
	    },
        yAxis: {
            	type: 'value',
            	splitLine: {
	            show: false
	        }
        },
        series: [{
            name: '资金使用情况(元)',
            type: 'line',
            lineStyle: {
				color: '#F5E200',
				width: 1
			},
            data: useFundArr
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
function drawPieOfAbnormal(amountOfAbnormal,outOfAbnormal){	
	var canvas = document.getElementById("pie_abnormal");
	var ctx = canvas.getContext("2d");
	var x = 59;
	var y = 59;
	var r = 59;
	var startAngle = 0;
	var endAngle1   = Math.PI * 2 * outOfAbnormal / amountOfAbnormal;
	var endAngle2 = Math.PI * 2;
	var anticlockwise = false;
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.arc(x, y, r, startAngle, endAngle1, anticlockwise);
	ctx.fillStyle = "#67E0E3";
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.arc(x, y, r, endAngle1, endAngle2, anticlockwise);
	ctx.fillStyle = "#FF9F7F";
	ctx.fill();
}
function drawAbnormalDetails(checkCountByType){
	var canvas = document.getElementById("abnormalDetails");
	var ctx = canvas.getContext("2d");
	var typeArr = ['家庭成员作为法人或股东在工商部门注册有企业',
					'有家用轿车',
					'房子、家具等基本生活设施状况良好',
					'有大型农机具',
					'在城镇有门市房、商品房',
					'家庭成员有财政供养人员',
					'家庭成员有担任村干部',
					'经常出入高档消费场所',
					'家庭收入、支出超过平均水平',
					'有高档家电'];	
	ctx.beginPath();
	ctx.rect(0,0,190,140);
	ctx.fillStyle = "#DC5356";
	ctx.fill();	
	canvasTextAutoLine(typeArr[0],ctx,0,30,190,checkCountByType[0],140);
	ctx.beginPath();
	
	ctx.beginPath();
	ctx.rect(190,0,190,110);
	ctx.fillStyle = "#EFCB68";
	ctx.fill();
	canvasTextAutoLine(typeArr[1],ctx,190,30,190,checkCountByType[1],110);
	
	ctx.beginPath();
	ctx.rect(0,140,110,110);
	ctx.fillStyle = "#8CC2A5";
	ctx.fill();
	canvasTextAutoLine(typeArr[2],ctx,0,165,110,checkCountByType[2],110);
	
	ctx.beginPath();
	ctx.rect(110,140,80,110);
	ctx.fillStyle = "#AB91C6";
	ctx.fill();
	canvasTextAutoLine(typeArr[3],ctx,110,165,80,checkCountByType[3],110);
	
	ctx.beginPath();
	ctx.rect(190,110,190,140);
	ctx.fillStyle = "#5EB7E5";
	ctx.fill();
	canvasTextAutoLine(typeArr[4],ctx,190,165,190,checkCountByType[4],140);
	
	ctx.beginPath();
	ctx.rect(0,250,60,120);
	ctx.fillStyle = "#E54C25";
	ctx.fill();
	canvasTextAutoLine(typeArr[5],ctx,0,275,60,checkCountByType[5],120);
	
	ctx.beginPath();
	ctx.rect(60,250,130,50);
	ctx.fillStyle = "#6D52DD";
	ctx.fill();
	canvasTextAutoLine(typeArr[6],ctx,60,265,130,checkCountByType[6],50);
	
	ctx.beginPath();
	ctx.rect(60,300,130,70);
	ctx.fillStyle = "#FD6936";
	ctx.fill();
	canvasTextAutoLine(typeArr[7],ctx,60,320,130,checkCountByType[7],70);
	
	ctx.beginPath();
	ctx.rect(190,250,140,120);
	ctx.fillStyle = "#99CCFF";
	ctx.fill();
	canvasTextAutoLine(typeArr[8],ctx,190,275,140,checkCountByType[8],120);
	
	ctx.beginPath();
	ctx.rect(330,250,50,120);
	ctx.fillStyle = "#8EC3A7";
	ctx.fill();
	canvasTextAutoLine(typeArr[9],ctx,330,275,50,checkCountByType[9],120);
}
function canvasTextAutoLine(str,ctx,initX,initY,width,numstr,height){   
	ctx.beginPath(); 
    ctx.fillStyle = "#ffffff";
    var strWidth = ctx.measureText(str).width;
    ctx.font = "normal normal 12px 方正兰亭中黑";
    if(strWidth > width){   	   		   		    		
    		var multiple = parseInt(strWidth/width) + 1;
    		var num = parseInt(width/12);
    		var strArray = new Array();
    		for(var i = 0;i<multiple;i++){
    			var tempStr = str.substring(num * i,num * (i + 1));
    			strArray.push(tempStr);
    		}
    		for(var i = 0;i<strArray.length;i++){
    			ctx.textAlign = 'center';
    			ctx.fillText(strArray[i],initX + width / 2,initY + i * 20);
    		}
    		   			    
    }else{
    		ctx.textAlign = 'center';
    		ctx.fillText(str,initX + width / 2,initY);
    }
    
    ctx.fillText(numstr,initX + width / 2,initY + 1/2*height);
 }
function createVisitList(){
	var visitList = [
					{imageName:"../static/img/aid/icon_01.png",village:"玉山某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_02.png",village:"铅山某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_03.png",village:"信州某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_01.png",village:"横峰某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_02.png",village:"弋阳某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_03.png",village:"德兴某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_01.png",village:"玉山某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_02.png",village:"铅山某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_03.png",village:"信州某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_01.png",village:"横峰某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_02.png",village:"弋阳某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"},
					{imageName:"../static/img/aid/icon_03.png",village:"德兴某某村",time:"2018-03-12",details:"共核实5户贫困家庭情况"}
					];
	for(var i = 0;i<visitList.length;i++){
		var html = '<li class="right_two_bottom_item clearfix"><img class="right_img" src="'
		+ visitList[i].imageName +'" /><div class="right_two_bottom_item_up"><span class="adress">'
		+ visitList[i].village +'</span><span class="time">'
		+ visitList[i].time +'</span></div><div class="right_two_bottom_item_down">'
		+ visitList[i].details +'</div></li>';
		
		$("#right_two_bottom").append(html);
	}
	$("li.right_two_bottom_item:even").addClass("fl");
	$("li.right_two_bottom_item:odd").addClass("fr");
}

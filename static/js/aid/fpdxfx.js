var cityName;
var cityLatAndLon;
var mapCount =  [];
$(function(){	
	$("#userBtn").click(function(){
		if ($("#showDiv").hasClass("hidden")) {
			$("#showDiv").removeClass("hidden")
		} else{
			$("#showDiv").addClass("hidden");
		}
	});
	$("#navBtnOne").click(function(){
		if (!$("#navBtnOne").hasClass("navActive")) {
			$("#navBtnOne").addClass("navActive");
			$("#navBtnTwo").removeClass("navActive");
			$("#right_one").removeClass("hidden");
			$("#right_two").addClass("hidden");
		} 
	});
	$("#navBtnTwo").click(function(){
		if (!$("#navBtnTwo").hasClass("navActive")) {
			$("#navBtnTwo").addClass("navActive");
			$("#navBtnOne").removeClass("navActive");
			$("#right_two").removeClass("hidden");
			$("#right_one").addClass("hidden");
		}
	});
	$("#userName").text(localStorage.getItem("userName"));
	getIndexInfo("");
	$("#yearSelect").change(function(){
		var selectYear = $("#yearSelect").val();
		selectYear = selectYear.substring(0,4);
		getIndexInfo(selectYear);
	});
});

function getIndexInfo(year) {
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('index'),
		data:{year:year},
		dataType:"JSON",
		success:function(msg){
			if(msg.result == "SUCCESS"){
				var data = msg.object;
				var yearList = data.yearList;
				var yearOptions = '';
				for (var i = 0;i<yearList.length;i++) {
					var tempOption = '<option>' + yearList[i] + '年</option>';
					yearOptions +=tempOption;
				}
				$("#yearSelect").empty().append(yearOptions);
				if (year != "") {
					$("#yearSelect").val(year + "年");
				}
				$("#bfzrrsNum").text(data.helpPersonCount);
				$("#dqpkhNum").text(data.familyCount);
				$("#bfhjrsNum").text(data.getHelpPersonCount);
				$("#zfcsNum").text(data.visitRecordCount);
				$("#bfrwsNum").text(data.helpPlanCount);
				$("#bfwczzlNum").text(data.growthRate);
				if (typeof(data.sumFund)=="undefined") {
					$("#shljbfzjNum").text("0");
				} else{
					$("#shljbfzjNum").text(parseFloat(data.sumFund).toLocaleString());
				}
				var overcomePovertyCount = data.povertyBankCount.currentCount.overcomePovertyCount;
				var amountNum = data.povertyBankCount.currentCount.povertyCount + overcomePovertyCount;
				var povertyCountByType = data.povertyCountByType;
				var value_one_per = parseInt(povertyCountByType.povertyCount * 100 / amountNum);
				var value_two_per = parseInt(povertyCountByType.returnPovertyCount * 100 / amountNum);
				var value_three_per = parseInt(povertyCountByType.noReturnPovertyCount * 100 / amountNum);
				var value_four_per = parseInt(povertyCountByType.relievePovertyCount * 100 / amountNum);
				$("#data_value_one").text(povertyCountByType.povertyCount);
				$("#data_foreBg_one").css("width",value_one_per + "%");
				$("#data_value_two").text(povertyCountByType.returnPovertyCount);
				$("#data_foreBg_two").css("width",value_two_per + "%");
				$("#data_value_three").text(povertyCountByType.noReturnPovertyCount);
				$("#data_foreBg_three").css("width",value_three_per + "%");
				$("#data_value_four").text(povertyCountByType.relievePovertyCount);
				$("#data_foreBg_four").css("width",value_four_per + "%");
				var gate = (parseFloat(overcomePovertyCount) / amountNum).toFixed(2);
				drawLeftOne(gate);
				$("#amountNum").text(amountNum);
				$("#numOfOutPoverty").text(overcomePovertyCount);
				var numsArr = String(amountNum).split("");
				for (var i = 0;i<numsArr.length;i++) {
					$("#amountNumUl>li").eq(9-numsArr.length+i).text(numsArr[i]);
				}
				if (typeof(data.helpCompletionProgress)=="undefined") {
					drawProgressOfHelp(0);
				} else{
					var helpCompletionProgress = (parseFloat(data.helpCompletionProgress) / 100).toFixed(2);
					drawProgressOfHelp(helpCompletionProgress);
				}
				var reasonArr = ["因病","因残","因学","因灾","缺土地","缺水","缺技术","缺劳动力","缺资金","交通条件","自身","其他"];
				var proportionaArr = [0,0,0,0,0,0,0,0,0,0,0,0];
				var mainPovertyReasonRatio = data.mainPovertyReasonRatio;
				for (var i =0;i<mainPovertyReasonRatio.length;i++) {
					var mainPovertyReason = parseInt(mainPovertyReasonRatio[i].mainPovertyReason);
					if (mainPovertyReason != 99) {
						proportionaArr[mainPovertyReason -1] = (parseFloat(mainPovertyReasonRatio[i].ratio) / 100).toFixed(2);
					} else{
						proportionaArr[11] = (parseFloat(mainPovertyReasonRatio[i].ratio) / 100).toFixed(2);
					}
				}
				drawReasonOfPoverty(reasonArr,proportionaArr);
				var yData = [0,0,0,0,0,0,0,0,0,0,0,0];
				var useFunds = data.useFunds;
				for (var i = 0;i<useFunds.length;i++) {
					var monthNum = parseInt(useFunds[i].month);
					yData[monthNum - 1] = useFunds[i].planAmount;
				}
				drawZjsyqkChart(yData);
				mapCount = data.mapCount;
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
			}
		}
	});
}
var myGeo = new BMap.Geocoder();
var index = 0;
var countyArr = [];
var contentArr = [];
function createMap(){
	//百度地图的设置
	map = new BMap.Map("map");          // 创建地图实例
	map.centerAndZoom(new BMap.Point(parseFloat(cityLatAndLon.x), parseFloat(cityLatAndLon.y)), 9);   // 初始化地图，设置中心点坐标和地图级别
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	getBoundary(cityName,"#0000ff");
	map.addEventListener("zoomend", function () {
	    map.panTo(new BMap.Point(parseFloat(cityLatAndLon.x), parseFloat(cityLatAndLon.y)));
	});		
	opts = {
			width : 150,     
			height: 50,  
			enableMessage:true
		   };
	
	for (var i = 0;i<mapCount.length;i++) {
		getBoundary(mapCount[i].countyName,"#ff0000");
		countyArr.push(mapCount[i].countyName);
		var content = '<p style="font-size: 14px;color: #4E5558;">'+ mapCount[i].countyName 
					+'</p><p style="font-size: 14px;color: #4E5558;">贫困人数(人)：'+ mapCount[i].personCount 
					+'</p><p style="font-size: 14px;color: #4E5558;">贫困户数(户)：'+ mapCount[i].familyCount + '</p>';					
		contentArr.push(content);			   		
	}	
	bdGEO();
}

function bdGEO(){
	var add = countyArr[index];
	geocodeSearch(add);
	index++;
}
function geocodeSearch(add){
	if(index < countyArr.length){
		setTimeout(window.bdGEO,400);
	} 
	var tempContent = contentArr[index];
	myGeo.getPoint(add, function(point){
		if (point) {
			var marker = new BMap.Marker(point);
			map.addOverlay(marker);				
			var infoWindow = new BMap.InfoWindow(tempContent, opts);
			marker.addEventListener("click", function(){          
				map.openInfoWindow(infoWindow,point); 
			});
		}
	}, "上饶市");
}

//行政区划绘制方法
function getBoundary(name,color) {
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
                strokeColor: color,
                strokeOpacity: 1.0,
                fillOpacity: 0.1,
                fillColor: "#ffffff"
            });
            map.addOverlay(ply);  //添加覆盖物
        }
    });
}

function drawLeftOne(gate){
	var x = 128;
	var y = 128;
	var r = 128;
	var radius = 106;
	var startAngle = (Math.PI / 180) * 180;
	var endAngle1   = (Math.PI / 180) * 180 + Math.PI * gate;
	var endAngle2 = Math.PI * 2;
	var anticlockwise = false;
	
	var lineX=x + r * Math.cos(endAngle1);
	var liney=y + r *Math.sin(endAngle1);
	
	var canvas = document.getElementById('canvas1');
	
	if(canvas.getContext){
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);  
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle2, anticlockwise);
		ctx.lineWidth = 44;
		ctx.strokeStyle = "#D8D8D8";
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle1, anticlockwise);
		ctx.lineWidth = 44;
		ctx.strokeStyle = "#2FA8FF";
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(lineX,liney);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#FFA25C";
		ctx.stroke();
	}
}
function drawReasonOfPoverty(reasonArr,proportionaArr){
	var canvas  = document.getElementById("canvas2");
	var ctx = canvas.getContext("2d");	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i = 0;i<reasonArr.length;i++){		
		var x = 78*(i%6) + 24;
		var y = 93*(parseInt(i/6)) + 24;
		var radius = 20;
		var startAngle = (Math.PI / 180) * 90;
		var endAngle = Math.PI * 2 + (Math.PI / 180) * 90;
		var endAngle1 = (Math.PI / 180) * 90 - Math.PI * 2 * proportionaArr[i];
		
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle, false);
		
		ctx.fillStyle = "#EFEFEF";
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.arc(x, y, radius, startAngle, endAngle1, true);
		
		var linearGradient1 = ctx.createLinearGradient(x-24,y-24,x+24,y+24);
		linearGradient1.addColorStop(0, '#56B8FF');
		linearGradient1.addColorStop(1, '#0094FF');
		 
		ctx.fillStyle = linearGradient1;		
		ctx.fill();
		
		ctx.beginPath();
		ctx.font = "normal normal 10px 方正兰亭中黑";
		ctx.fillStyle = "#4E5558";
		ctx.textAlign = "left";
		ctx.fillText((proportionaArr[i] * 100).toFixed(0) +'%', x - 15, y -5);
		
		ctx.beginPath();
		ctx.font = "normal normal 14px 方正兰亭中黑";
		ctx.fillStyle = "#4E5558";
		ctx.textAlign = "center";
		ctx.fillText(reasonArr[i], x, y + 38);
	}
}
function drawProgressOfHelp(percent){
	var x = 200;
	var y = 200;
	var r = 168;
	var startAngle = 0;
	var endAngle1   = Math.PI * 2 * percent;
	var endAngle2 = Math.PI * 2;
	var anticlockwise = false;
	var canvas = document.getElementById("canvas3");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.lineWidth = 64;
	
	ctx.beginPath();
	ctx.arc(x, y, r, startAngle, endAngle2, anticlockwise);
	ctx.strokeStyle = "#D8D8D8";
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(x, y, r, startAngle, endAngle1, anticlockwise);
	ctx.strokeStyle = "#2FA8FF";
	ctx.stroke();
	
	ctx.beginPath();
	ctx.font = "normal normal 24px PingFangSC-Semibold";
	ctx.fillStyle = "#1E1E1E";
	ctx.textAlign = "center";
	ctx.fillText(percent * 100 + '%', x, y);
}
function drawZjsyqkChart (yData) {
	var xData = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
	var canvas = document.getElementById("canvas4");
	var context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width,canvas.height);
	var yMax = Math.max.apply(null,yData);
	var lineNums = getArrayFromNum(yMax);
	if (yMax == 0) {
		yMax = 1;
	}
	context.beginPath();
	for (var i = 0;i<lineNums.length;i++) {
		context.font = "14px PingFangSCRegular";  	    
		context.fillStyle = "#1E1E1E";
		context.textAlign = "left";
		context.fillText(lineNums[i],0,80*(lineNums.length - i -1)+35);
	}
	for (var i = 0;i<lineNums.length;i++) {
		if (i == 5) {
			context.beginPath();
			context.lineWidth = 2;
		} else{
			context.beginPath();
			context.lineWidth = 0.5;
		}
		context.strokeStyle = '#A0A0A0';
		context.moveTo(36,30+80*i);
		context.lineTo(1044,30+80*i);
		context.stroke();
	}
	context.beginPath();
	for (var i = 0;i<xData.length;i++) {
		context.font = "14px PingFangSC-Semibold";  	    
		context.fillStyle = "#1E1E1E";
		context.textAlign = "center";
		context.fillText(xData[i],78+84*i,450);
	}
	context.beginPath();
	context.moveTo(78,430);
	for (var i = 0;i<yData.length;i++) {
		var lineY = 430 - parseFloat(yData[i]) / yMax * 400;
		var lineX = 78+84*i;
		context.lineTo(lineX,lineY);
		var grd = context.createLinearGradient(lineX,430,lineX,lineY);
		grd.addColorStop(0,"rgba(86,184,255,0.2)");
		grd.addColorStop(1,"rgba(0,148,255,0.3)");
		context.fillStyle = grd;
		if(i == yData.length - 1){
			context.lineTo(lineX,430);
		}
		
	}
	context.fill();
	context.beginPath();
	context.moveTo(78,430);
	for (var i = 0;i<yData.length;i++) {
		var lineY = 430 - parseFloat(yData[i]) / yMax * 400;
		var lineX = 78+84*i;
		context.strokeStyle = "#2FA8FF";
		context.lineWidth = 2;
		context.lineTo(lineX,lineY);
		if(i == yData.length - 1){
			context.lineTo(lineX,430);
		}
	}
	context.stroke();
	for (var i = 0;i<yData.length;i++) {
		context.beginPath();
		var lineY = 430 - parseFloat(yData[i]) / yMax * 400;
		var lineX = 78+84*i;
		context.fillStyle = "#ffffff";
		context.arc(lineX, lineY, 3, 0, Math.PI * 2, false);
		context.fill();
		context.beginPath();
		context.strokeStyle = "#2FA8FF";
		context.arc(lineX, lineY, 4, 0, Math.PI * 2, false);
		context.stroke();
	}
}

function getArrayFromNum(x){
	var i_x = parseInt(x);
	if (isNaN(i_x)) {       
        return false;
    }
	var numsArr = new Array();
	var temp = parseInt(i_x / 10);
	if(temp == 0){
		numsArr = [0,2,4,6,8,10];
	}else{
		temp = (temp + 1) * 10;
		for (var i = 0;i<6;i++) {
			var item = temp * i / 5;
			numsArr.push(item);
		} 
	}
	return numsArr;
}
function jumpToSetup(){
	window.location.href = "setup.html";
}
function loginoutBtnClick(){
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
				alert(msg.message);
			}
		}
	});
}
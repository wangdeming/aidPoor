
function showTime(){ 
  var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六'); 
  var time=new Date(); 
  var year=time.getFullYear(); 
  var month=time.getMonth(); 
  var date=time.getDate(); 
  var day=time.getDay(); 
  var hour=time.getHours(); 
  var minutes=time.getMinutes(); 
  month=month+1;
  month<10?month='0'+month:month; 
  date<10?date='0'+date:date;
  hour<10?hour='0'+hour:hour; 
  minutes<10?minutes='0'+minutes:minutes; 
  var now_time=year+'-'+month+'-'+date+' '+show_day[day]+' '+hour+':'+minutes; 
  document.getElementById('show_time').innerHTML=now_time;  
  setTimeout("showTime();",1000*60);
}
$(function(){
	showTime();
	
	$("#header_nav_0").click(function(){
		window.location.href = "economy_home.html";
	});
	$("#header_nav_1").click(function(){
		window.location.href = "situation_map.html";
	});
	$("#header_nav_2").click(function(){
		window.location.href = "report.html";
	});
	$("#header_nav_3").click(function(){
		window.location.href = "economy_analysis.html";
	});
	$("#header_nav_4").click(function(){
		window.location.href = "interface.html";
	});
	$("#a_back").click(function(){
		window.location.href = "../index.html";
	});
});

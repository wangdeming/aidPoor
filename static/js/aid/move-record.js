//var familyId='0000316f11ce410fa4edfcb46eab1c5c';
var visitRecordId='3c761211ca8f4096923d7fa819bb8c4e';
var visitId;
var familyId=getUrlParam("familyId");
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
//var newsId = getUrlParam("familyId");
$(function(){
	to_page(1);	
});

	var theme = "ios";
    var mode = "scroller";
    var display = "bottom";
    var lang="zh";
        
	$("#demo_datetime").flatpickr();
	//弹出隐藏层
	function ShowDiv(show_div,bg_div){
	document.getElementById(show_div).style.display='block';
	document.getElementById(bg_div).style.display='block' ;
	var bgdiv = document.getElementById(bg_div);
	bgdiv.style.width = document.body.scrollWidth;
	// bgdiv.style.height = $(document).height();
	$("#"+bg_div).height($(document).height());
	};
	//关闭弹出层
	function CloseDiv(show_div,bg_div)
	{
	document.getElementById(show_div).style.display='none';
	document.getElementById(bg_div).style.display='none';
	};
	

function to_page(pageNumber){
    $.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('visitRecordPage'),
		data:{
			pageNumber:pageNumber,
			pageSize:10,
			familyId:familyId
			},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				$("#moveRecordNum").text(msg.object.total);
				build_table(msg.object.list);
                build_page(msg);
			}else{
				alert(msg.message);
			}
		}
	});
}
function build_table(list) {
	var html="";
	$.each(list, function(index,element) {
		
		var visitorName = '';
		if(typeof(element.visitorName) == "undefined"){
			visitorName = '';
		}else{
			visitorName = element.visitorName+',';
		}
		
		html+=
		'<tr style="font-size: 12px" data-id=' +element.id+ '>\n'+
			'<td>'+parseInt(index+1)+'</td>\n'+
			'<td id="visitTime">'+element.visitTime+'</td>\n'+
			'<td id="visitTheme">'+element.visitTitle+'</td>\n'+
			'<td id="vContent">'+element.content+'</td>\n'+
			'<td id="vName">'+visitorName+element.otherVisitor+'</td>\n'+
			'<td id="createDateTime">'+element.createDateTime+'</td>\n'+
			'<td>\n'+
				'<a class="editBtn" onclick="editMoveRecord(event)">编辑</a>\n'+
				'<a class="deleteBtn" onclick="deleteMoveRecord(event)">删除</a>\n'+
			'</td>\n';
	});
	$("table.moveRecordTable>tbody").empty();
    $("table.moveRecordTable>tbody").append(html); 
}

function build_page(data) {
	$("#page_area").empty();
	var btnFirst = $("<button></button>").addClass("btn-first").append("首页");
    var btnPre = $("<button></button>").addClass("btn-prev").append("上一页");
    var ul = $("<ul></ul>").addClass("el-pager");
    
    $.each(data.object.navigatepageNums, function(index, item) {
    	var numLi = $("<li></li>").addClass("number").append(item);
    	if (data.object.pageNum == item) {
    		numLi.addClass("page-active");
        }
    	numLi.click(function () {
    	to_page(item);
    	});
    	ul.append(numLi);
    });
    
    var btnNext = $("<button></button>").addClass("btn-next").append("下一页");
    var btnLast = $("<button></button>").addClass("btn-last").append("末页");
    if (data.object.pages != 0) {
            $("#page_area").append(btnFirst).append(btnPre).append(ul).append(btnNext).append(btnLast);
        }
    if (data.object.hasPreviousPage == false) {
        btnPre.addClass("disabled");
        btnFirst.addClass("disabled");
    } else {
        btnPre.click(function () {
            to_page(data.object.pageNum - 1);
        });
        btnFirst.click(function () {
            to_page(1);
        });
    }
    if (data.object.hasNextPage == false) {
        btnNext.addClass("disabled");
        btnLast.addClass("disabled");
    } else {
        btnNext.click(function () {
            to_page(data.object.pageNum + 1);
        });
        btnLast.click(function () {
            to_page(data.object.pages);
        });
    }
}

function basicInfo(visitRecordId){
    $.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('basicinfo'),
		data:{
			familyId:familyId,
			visitRecordId:visitRecordId
			},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){
				$("#familyMasterName").empty();
				$("#visitorName").empty();	
				var html1="";
				var html2="";
				html1+='<span>被走访人：</span>'+
				'<span id="familyId" data-value='+msg.object.familyId+'>'+msg.object.familyMasterName+'</span>';
				html2+='<span>走&nbsp;访&nbsp;人：</span>'+
				'<span id="visitorId" data-value='+msg.object.visitorId+'>'+msg.object.visitorName+'</span>';	
				$("#familyMasterName").append(html1);
				$("#visitorName").append(html2);		
			}else{
				alert(msg.message);
			}
		}
	});
}
	
function addRecord(){
	visitId = '';
	var visitRecordId = $(event.target).parent().parent().attr("data-id");
	
	basicInfo(visitRecordId);
	
	$("#addVisitRecorder").text("新增-走访记录");
	
	$("#demo_datetime").val("");
	
	$("#otherVisitor").val("");
	
	$("#moveTitle").val("");
	
	$("#visitContent").val("");
	
	ShowDiv('MyDiv','fade')
}
function addOrEditMoveRecord(){
	
	var visitorId;//走访人id
	visitorId=$("#visitorId").attr("data-value");
	
	var familyId;//贫困户id
	familyId=$("#familyId").attr("data-value");
	
	var visitTime1;//走访时间
	visitTime1=$("#demo_datetime").val();
	
	var visitTitle;//走访主题
	visitTitle=$("#moveTitle").val();
	
	var content;//走访内容
	content=$("#visitContent").val();
	
	var otherVisitor;//其他走访人
	otherVisitor=$("#otherVisitor").val();
	
    $.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('addOrEditMoveRecord'),
		data:{
			id:visitId,
			visitorId:visitorId,
			familyId:familyId,
			visitTime1:visitTime1,
			visitTitle:visitTitle,
			content:content,
			otherVisitor:otherVisitor
			},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				alert(msg.message);
				CloseDiv('MyDiv','fade');
				to_page(1);
			}else{
				alert(msg.message);
			}
		}
	});
}
	

function editMoveRecord(event){
	var visitRecordId = $(event.target).parent().parent().attr("data-id");
	basicInfo(visitRecordId);
	$("#addVisitRecorder").text("编辑-走访记录");
	
	var datetime=$(event.target).parent().siblings("#visitTime").text();
	$("#demo_datetime").val(datetime);
	
	var otherVisitorName=$(event.target).parent().siblings("#vName").text().substr($(event.target).parent().siblings("#vName").text().indexOf(',')+1)
	$("#otherVisitor").val(otherVisitorName);
	
	var visitTheme=$(event.target).parent().siblings("#visitTheme").text();
	$("#moveTitle").val(visitTheme);
	
	var visitCon=$(event.target).parent().siblings("#vContent").text();
	$("#visitContent").val(visitCon);
	
	visitId = $(event.target).parent().parent().attr("data-id");
	ShowDiv('MyDiv','fade');	
	
}
	
	
function deleteMoveRecord(event){	
	var visitRecordId = $(event.target).parent().parent().attr("data-id");
	console.log(visitRecordId);
    $.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('deleteMoveRecord'),
		data:{
			visitRecordId:visitRecordId
			},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){	
				alert(msg.message);
				to_page(1);	
			}else{
				alert(msg.message);
			}
		}
	});
}
	
 var countyAreaId = getUrlParam("areaId");
 var villageId = '';
 var flag = '';
 var keywords = '';
 var newsId = getUrlParam("villageId");
 $('select.drop-select').each(function(){
    new Select({
        el: this,
        className: 'select-theme-chosen'
    });
});
$(function(){
	if(countyAreaId != null && countyAreaId != ''){
        villageBasicInfo(countyAreaId);
        createVillageTable(1);
        getDmCode();
	}
});

function reloadData(){
    countyAreaId = $('#tempAreaId').val();
    villageBasicInfo(countyAreaId);
    createVillageTable(1);
    getDmCode();
}

function createVillageTable(pageNum){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('villageconditionQueryVillageInfoPage'),
		data:{countyAreaId:countyAreaId,flag:flag,keywords:keywords,pageNum:pageNum,pageSize:10},
		dataType:'JSON',
		success: function(msg) {
			$("ul.el-pager").empty();
			$("table.tdata>tbody").empty();
			if(msg.result ==  "SUCCESS"	){				
				 var datatotal = msg.object;
				 var city = '';var county = '';var town = '';
				 if (typeof(datatotal.location)!="undefined" && typeof(datatotal.location.city)!="undefined") {
				 	city = datatotal.location.city;
				 }
				 if (typeof(datatotal.location)!="undefined" && typeof(datatotal.location.town)!="undefined") {
				 	town = datatotal.location.town;
				 }
				 if (typeof(datatotal.location)!="undefined" && typeof(datatotal.location.county)!="undefined") {
				 	county = datatotal.location.county;
				 }
                $('#location').html(city + ' > ' + county + ' > ' + town);

				var villageList = datatotal.data;
				var pageList = datatotal.page;
				var trsHtml = '';
				for (var i=0;i<villageList.length;i++) {
					var villageFlag = villageList[i].flag;
					var isPoorVillageOrNot = '';
					if (typeof(villageFlag)!="undefined") {
						if (villageFlag == 1 || villageFlag == 3) {
							isPoorVillageOrNot = '是';
						} else{
							isPoorVillageOrNot = '否';
						}
					}
					var helpUnit = '';
					if (typeof(villageList[i].helpUnit)!="undefined") {
						helpUnit = villageList[i].helpUnit;
					}
					var telephoneNumber = '';
					if (typeof(villageList[i].telephoneNumber)!="undefined") {
						telephoneNumber = villageList[i].telephoneNumber;
					}
					var tr = '<tr><td data-id="'
					+ villageList[i].villageId +'">'
					+ parseInt(i+1) +'</td><td>'
					+ villageList[i].villageId +'</td><td>'
					+ villageList[i].village +'</td><td>'
					+ isPoorVillageOrNot +'</td><td>'
					+ villageList[i].county + '-' + villageList[i].city + '-' + villageList[i].province +'</td><td>'
					+ villageList[i].familyCount +'</td><td>'
					+ villageList[i].povertyFamilyCount +'</td><td>'
					+ villageList[i].leader +'</td><td>'
					+ telephoneNumber +'</td><td>'
					+ helpUnit +'</td><td><a onclick="editBtnClick(event);" class="editBtn">编辑</a>' +
						'<a href="poor-village-manage.html?areaId='+villageList[i].villageId +'&flag=poor-village" class="manageBtn">详情</a></td></tr>';
					trsHtml +=tr;
				}				
				$("table.tdata>tbody").append(trsHtml);
				createPages(pageList.pages,pageNum);
				$("#amount-villages").text(pageList.total);
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
            //请求出错处理
        }
	});
}
function editBtnClick(event){
	villageId = $(event.target).parent().parent().find("td:first-child").attr("data-id");
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('villageconditionQueryVillageInfoDetailByVillageId'),
		data:{villageId:villageId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				 var datatotal = msg.object;
				$("#village-name").text('所在村：'+datatotal.village+'（'+datatotal.province+datatotal.city+datatotal.county+datatotal.town+'）');
				$("#poor-status>button").each(function(){
					$(this).removeClass("btn_1").addClass("btn_2");
					if($(this).attr("data-dm") == datatotal.flag){
						$(this).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#village-leader").val(datatotal.leader);
				$("#village-telephoneNumber").val(datatotal.telephoneNumber);
				$("#poor-attribute>button").each(function(){
					$(this).removeClass("btn_1").addClass("btn_2");
					if($(this).attr("data-attribute") == datatotal.attribute){
						$(this).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("ul.ul_2>li.li_02>input").each(function(){
					var keyWord = $(this).attr("id").substr(8);
					$(this).val(datatotal[keyWord]);
				});
				$("ul.ul_3>li.li_03>input").each(function(){
					var keyWord = $(this).attr("id").substr(8);
					$(this).val(datatotal[keyWord]);
				});
				$("#poor-bus>button").each(function(){
					$(this).removeClass("btn_1").addClass("btn_2");
					if($(this).attr("data-bus") == datatotal.bus){
						$(this).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#poor-highway>button").each(function(){
					$(this).removeClass("btn_1").addClass("btn_2");
					if($(this).attr("data-highway") == datatotal.highway){
						$(this).removeClass("btn_2").addClass("btn_1");
					}
				});
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
        		$("#poor-status>button").click(function(){
        			$("#poor-status>button").removeClass("btn_1").addClass("btn_2");
        			$(this).removeClass("btn_2").addClass("btn_1");
        		});
        		$("#poor-attribute>button").click(function(){
        			$("#poor-attribute>button").removeClass("btn_1").addClass("btn_2");
        			$(this).removeClass("btn_2").addClass("btn_1");
        		});
        		$("#poor-bus>button").click(function(){
        			$("#poor-bus>button").removeClass("btn_1").addClass("btn_2");
        			$(this).removeClass("btn_2").addClass("btn_1");
        		});
        		$("#poor-highway>button").click(function(){
        			$("#poor-highway>button").removeClass("btn_1").addClass("btn_2");
        			$(this).removeClass("btn_2").addClass("btn_1");
        		});
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
	ShowDiv('MyDiv','fade');
}
function editVillageInfo(){
	var leader = $("#village-leader").val();
	var telephoneNumber = $("#village-telephoneNumber").val();
	var cultivatedArea = $("#village-cultivatedArea").val();
	var irrigatedArea = $("#village-irrigatedArea").val();
	var forestArea = $("#village-forestArea").val();
	var grainGreenArea = $("#village-grainGreenArea").val();
	var forfruitArea = $("#village-forfruitArea").val();
	var waterArea = $("#village-waterArea").val();
	var grassArea = $("#village-grassArea").val();
	var livestockSum = $("#village-livestockSum").val();
	var artelSum = $("#village-artelSum").val();
	var primarySchoolSum = $("#village-primarySchoolSum").val();
	var flag = '';
	$("#poor-status>button").each(function(){		
		if($(this).hasClass("btn_1")){
			flag = $(this).attr("data-dm");
		}
	});
	var attribute = '';
	$("#poor-attribute>button").each(function(){		
		if($(this).hasClass("btn_1")){
			attribute = $(this).attr("data-attribute");
		}
	});
	var bus = '';
	$("#poor-bus>button").each(function(){		
		if($(this).hasClass("btn_1")){
			bus = $(this).attr("data-bus");
		}
	});
	var highway = '';
	$("#poor-highway>button").each(function(){		
		if($(this).hasClass("btn_1")){
			highway = $(this).attr("data-highway");
		}
	});
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('villageconditionUpdateVillageInfo'),
		data:{villageId:villageId,leader:leader,telephoneNumber:telephoneNumber,flag:flag,attribute:attribute,
				cultivatedArea:cultivatedArea,irrigatedArea:irrigatedArea,forestArea:forestArea,grainGreenArea:grainGreenArea,
				forfruitArea:forfruitArea,waterArea:waterArea,grassArea:grassArea,livestockSum:livestockSum,artelSum:artelSum,
				primarySchoolSum:primarySchoolSum,highway:highway,bus:bus},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				 new NoticeJs({
				    text: '修改成功',
				    position: 'middleCenter',
				    animation: {
				        open: 'animated bounceIn',
				        close: 'animated bounceOut'
				    }
				}).show();
				
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
        		createVillageTable(1);
        		CloseDiv('MyDiv','fade');
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}
function toFirstPage(){
	createVillageTable(1);
}
function toPrePage(){
	var index = parseInt($("ul.el-pager>li.page-active").text());
	if(index == 1){
		return false;
	}else{
		createVillageTable(parseInt(index - 1));
	}
}
function toNextPage(){
	var index = parseInt($("ul.el-pager>li.page-active").text());
	var num = parseInt($("ul.el-pager>li").length);
	if(index == num){
		return false;
	}else{
		createVillageTable(index + 1);
	}
}
function toLastPage(){
	var num = parseInt($("ul.el-pager>li").length);
	createVillageTable(num);
}
function createPages(num,index){	
	var pageLis = '';            						
	for (var i=0;i<num;i++) {
		if(i == parseInt(index - 1)){
			var li = '<li class="number page-active">'+ parseInt(i+1) +'</li>';
		}else{
			var li = '<li class="number">'+ parseInt(i+1) +'</li>';
		}
		pageLis += li;
	}
	$("ul.el-pager").append(pageLis);
}
function villageBasicInfo(countyAreaId){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('villageconditionQueryFamilyStatisticsByCountyAreaId'),
		data:{countyAreaId:countyAreaId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				var datatotal = msg.object;
				$("#house-zero").text(datatotal.povertyVillageCount);
				$("#person-zero").text(datatotal.villageCount);
				$("#house-one").text(datatotal.familyCount);
				$("#person-one").text(datatotal.familyMemberCount);
				$("#house-two").text(datatotal.povertyFamilyCount);
				$("#person-two").text(datatotal.povertyFamilyMemberCount);
				$("#house-three").text(datatotal.relievePovertyFamilyCount);
				$("#person-three").text(datatotal.relievePovertyFamilyMemberCount);
				$("#house-four").text(datatotal.preRelievePovertyFamilyCount);
				$("#person-four").text(datatotal.preRelievePovertyFamilyMemberCount);
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
            //请求出错处理
        }
	});
}
function getDmCode(){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('dmGetdm'),
		data:{dmCode:'TPBS'},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				 var datatotal = msg.object;
				 var subDmList = datatotal.subDmList;
				 var optionsHtml = '<option data-dm="">全部</option>';
				 for(var i=0;i<subDmList.length;i++){
				 	var optionHtml = '<option data-dm="'+ subDmList[i].dm +'">'+ subDmList[i].dmValue +'</option>';
				 	optionsHtml +=optionHtml;
				 }
				 $("#dmCodeSelect").empty().append(optionsHtml);
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
            //请求出错处理
        }
	});
}
function searchPoorVillage(){
	var dmValue = $("#dmCodeSelect + a").text();
	$("#dmCodeSelect>option").each(function(){
		if($(this).text()==dmValue){
			flag = $(this).attr("data-dm");
		}
	});
	keywords = $("#searchInput").val();
	createVillageTable(1);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
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
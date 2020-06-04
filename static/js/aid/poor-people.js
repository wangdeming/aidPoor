 $('select.drop-select').each(function(){
    new Select({
        el: this,
        className: 'select-theme-chosen'
    });
});

var dialogInstace, onMoveStartId;	//	用于记录当前可拖拽的对象
// var zIndex = 9000;
//	获取元素对象
function g(id) {
    return document.getElementById(id);
}
//	自动居中元素（el = Element）
function autoCenter(el) {
    var bodyW = document.documentElement.clientWidth;
    var bodyH = document.documentElement.clientHeight;
    var elW = el.offsetWidth;
    var elH = el.offsetHeight;
    el.style.left = (bodyW - elW) / 2 + 'px';
    el.style.top = (bodyH - elH) / 2 + 'px';
}
//	自动扩展元素到全部显示区域
function fillToBody(el) {
    el.style.width = document.documentElement.clientWidth + 'px';
    el.style.height = document.documentElement.clientHeight + 'px';
}
//	在页面中侦听 鼠标弹起事件
document.onmouseup = function (e) {
    dialogInstace = false;
    clearInterval(onMoveStartId);
}
//	重新调整对话框的位置和遮罩，并且展现
function showDialog() {
    g('dialogMove').style.display = 'block';
    g('mask').style.display = 'block';
    autoCenter(g('dialogMove'));
    fillToBody(g('mask'));
}
//	关闭对话框
function hideDialog() {
    g('dialogMove').style.display = 'none';
    g('mask').style.display = 'none';
}
//var areaId = '361102001017';
var areaId=getUrlParam("areaId");
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}

var familyId = '';
var createOrUpdate = '';
$(function(){

	createOptions("poor-people-attr","PKHSX");
	createOptions("main-reason","ZPYY");
	createOptions("standards","SBBZ");
	createOptions("flag","TPBS");

	$("#isOrNotReturePoor>button").click(function(){
		$("#isOrNotReturePoor>button").removeClass("btn_1").addClass("btn_2");
		$(this).removeClass("btn_2").addClass("btn_1");
	});
	$("#newPeople").click(function(){
		if ($("#three-add-record-btn").hasClass("hidden")) {
			$("#three-add-record-btn").removeClass("hidden");
		}
		if ($("#three-delete-record-btn").hasClass("hidden")) {
			$("#three-delete-record-btn").removeClass("hidden");
		}
		$(".poor_people_info_one").css("display","block");
		$(".poor_people_info_two").css("display","none");
		$(".poor_people_info_three").css("display","none");
		familyId = '';
		createOrUpdate = "新建";
		$("#dialog-title").text("新建-贫困户信息采集");
		showDialog();
	});
    if(areaId != null && areaId != '') {
        familyAndMembercount();
        to_page(1);
    }
});

function reloadData(){
    areaId = $('#tempAreaId').val();
    familyAndMembercount();
    to_page(1);
}

// $(window).resize(function () {          //当浏览器大小变化时
// 	if($(".ui-mask").css("display") == "block"){
// 		$(".ui-mask").css({"width":"100%","height":"100%"});
// 	}else{
// 		hideDialog();
// 	}
// });

function createOptions(elementId,str){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('dmGetdm'),
		data:{dmCode:str},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){	
				var datatotal = msg.object;
				var subDmList = datatotal.subDmList;
				var optionsHtml = '<option data-dm="">全部</option>';
				for (var i=0;i<subDmList.length;i++) {
					var option = '<option data-dm="'+ subDmList[i].dm +'">'+ subDmList[i].dmValue +'</option>';
					optionsHtml += option;
				}				
				$("#"+elementId).empty().append(optionsHtml);
			}else{
				alertMessage(msg.message);
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
function familyAndMembercount(){
	 $.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familyandmembercount'),
		data:{areaId:areaId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){	
				$("#allFamily1").text(msg.object.familyCount);
				$("#allFamily2").text(msg.object.memberCount);
				$("#outPovertyFamily1").text(msg.object.noPovertyFamilyCount);
				$("#outPovertyFamily2").text(msg.object.noPovertyMemberCount);
				$("#povertyFamily1").text(msg.object.povertyFamilyCount);
				$("#povertyFamily2").text(msg.object.povertyMemberCount);
				$("#prePovertyFamily1").text(msg.object.relieveNoPovertyFamilyCount);
				$("#prePovertyFamily2").text(msg.object.relieveNoPovertyMemberCount);
				$("#antiPoverty1").text(msg.object.returnPovertyFamilyCount);	
				$("#antiPoverty2").text(msg.object.returnPovertyMemberCount);	
			}else{
				alertMessage(msg.message);
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
function searchBtnClick(){
	to_page(1);
}
function to_page(pageNumber){
	var attribute;
	$("#poor-people-attr>option").each(function(){
		if($(this).text()!="全部" && $(this).text()==$("#poor-people-attr + a").text()){
			attribute = $(this).attr("data-dm");			
		}
	});
	var mainPovertyReason;
	$("#main-reason>option").each(function(){
		if($(this).text()!="全部" && $(this).text()==$("#main-reason + a").text()){
			mainPovertyReason = $(this).attr("data-dm");			
		}
	});
	var standards;
	$("#standards>option").each(function(){
		if($(this).text()!="全部" && $(this).text()==$("#standards + a").text()){
			standards = $(this).attr("data-dm");			
		}
	});
	var flag;
	$("#flag>option").each(function(){
		if($(this).text()!="全部" && $(this).text()==$("#flag + a").text()){
			flag = $(this).attr("data-dm");			
		}
	});
	var antiPoverty;
	$("#isOrNotReturePoor>button").each(function(){
		if($(this).hasClass("btn_1")){
			antiPoverty = $(this).attr("data-dm");		
		}
	});
	var realName;
	if ($("#key").val().length != 0) {
		realName = $("#key").val();
	}
		
    $.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familyList'),
		data:{
			pageNumber:pageNumber,pageSize:10,
			areaId:areaId,
			attribute: attribute,
			mainPovertyReason:mainPovertyReason,
			antiPoverty:antiPoverty,
			standards:standards,
			flag:flag,
			realName:realName
			},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){
				$('#location').html(msg.object.location.city + ' > ' +
                    msg.object.location.county + ' > ' + msg.object.location.town + ' > ' + msg.object.location.village);

				$("#poorPeopleNum").text(msg.object.pageInfo.total);
				build_table(msg.object.pageInfo.list);
                build_page(msg.object.pageInfo);
			}else{
				alertMessage(msg.message);
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
function build_table(list) {
	var html="";
	$.each(list, function(index,element) {
		var helpPerson = '';
		if(typeof(element.helpPerson) != "undefined"){
			helpPerson = element.helpPerson;
		}
		var flagName="";
		if(typeof(element.flagName) != "undefined"){
			flagName = element.flagName;
		}
		var helpUnit="";
		if(typeof(element.helpUnit) != "undefined"){
			helpUnit = element.helpUnit;
		}
		var remark="";
		if(typeof(element.remark) != "undefined"){
			remark = element.remark;
		}
		var attributeName="";
		if(typeof(element.attributeName) != "undefined"){
			attributeName = element.attributeName;
		}
		var standardsName="";
		if(typeof(element.standardsName) != "undefined"){
			standardsName = element.standardsName;
		}
		html+=
		'<tr style="font-size: 12px" data-id=' +element.id+ '>'+
			'<td>'+parseInt(index+1)+'</td>'+
			'<td>'+element.realName+'</td>'+
			'<td>'+element.memberCount+'</td>'+
			'<td>'+attributeName+'</td>'+
			'<td>'+standardsName+'</td>'+
			'<td title="'+ element.area +'">'+ element.area +'</td>'+
			'<td>'+flagName+'</td>'+
			'<td>'+helpUnit+'</td>'+
			'<td>'+helpPerson+'</td>'+
			'<td>'+remark+'</td>'+
			'<td>'+
				'<a class="editBtn" onclick="editBtnClick(event);">编辑</a>'+
				// '<a class="deleteBtn" onclick="deletePoorPeopleRecord(event);">删除</a>'+
				'<a href="move-record.html?flag=poor-people&familyId=' +element.id+ '" class="visitRecordBtn">走访记录</a>'+
				'<a href="poor-house-manage.html?flag=poor-people&familyId=' +element.id+ '" class="manageBtn">详情</a>'+
			'</td>';
	});
	$("table.tdata>tbody").empty();
    $("table.tdata>tbody").append(html);
}

function build_page(data) {
	$("#page_area").empty();
	var btnFirst = $("<button></button>").addClass("btn-first").append("首页");
    var btnPre = $("<button></button>").addClass("btn-prev").append("上一页");
    var ul = $("<ul></ul>").addClass("el-pager");
    
    $.each(data.navigatepageNums, function(index, item) {
    	var numLi = $("<li></li>").addClass("number").append(item);
    	if (data.pageNum == item) {
    			numLi.addClass("page-active");
        }
	    	numLi.click(function () {
	   	 	to_page(item);
	    	});
	    	ul.append(numLi);
    });
    
    var btnNext = $("<button></button>").addClass("btn-next").append("下一页");
    var btnLast = $("<button></button>").addClass("btn-last").append("末页");
    if (data.pages != 0) {
            $("#page_area").append(btnFirst).append(btnPre).append(ul).append(btnNext).append(btnLast);
        }
    if (data.hasPreviousPage == false) {
        btnPre.addClass("disabled");
        btnFirst.addClass("disabled");
    } else {
        btnPre.click(function () {
            to_page(data.pageNum - 1);
        });
        btnFirst.click(function () {
            to_page(1);
        });
    }
    if (data.hasNextPage == false) {
        btnNext.addClass("disabled");
        btnLast.addClass("disabled");
    } else {
        btnNext.click(function () {
            to_page(data.pageNum + 1);
        });
        btnLast.click(function () {
            to_page(data.pages);
        });
    }
}
//删除
function deletePoorPeopleRecord(event){
	var familyId = $(event.target).parent().parent().attr("data-id");
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familyconditionDelete'),
		data:{familyId:familyId},
		dataType:'JSON',
		async: false,
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				alertMessage(msg.message);
			}else{
				alertMessage(msg.message);
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
	setTimeout(function() {
		to_page(1);
	}, 1000);
}

//新增第一步
var provinceId;var cityId;var countyId;var townId;
$(function(){
	
	queryAreaListByParentId('','ul-province');	
	selectOpenOrClose("province");
	selectOpenOrClose("city");
	$("#address-city>div.selectbox").click(function(){
		if ($("#select-province").text() == '请选择省') {
			alertMessage("请先选择省");
		}else{
			$("#ul-province>li").each(function(){
				if($(this).text() == $("#select-province").text()){
					provinceId = $(this).attr("data-areaId");
				}
			});
			var data = {provinceId:provinceId};
			queryAreaListByParentId(data,'ul-city');				
		}
	});
	selectOpenOrClose("county");
	$("#address-county>div.selectbox").click(function(){
		if ($("#select-city").text() == '请选择市') {
			alertMessage("请先选择市");
		}else{
			$("#ul-city>li").each(function(){
				if($(this).text() == $("#select-city").text()){
					cityId = $(this).attr("data-areaId");
				}
			});
			var data = {provinceId:provinceId,cityId:cityId};
			queryAreaListByParentId(data,'ul-county');				
		}
	});
	selectOpenOrClose("town");
	$("#address-town>div.selectbox").click(function(){
		if ($("#select-county").text() == '请选择县') {
			alertMessage("请先选择县");
		}else{
			$("#ul-county>li").each(function(){
				if($(this).text() == $("#select-county").text()){
					countyId = $(this).attr("data-areaId");
				}
			});
			var data = {provinceId:provinceId,cityId:cityId,countyId:countyId};
			queryAreaListByParentId(data,'ul-town');				
		}
	});
	selectOpenOrClose("village");
	$("#address-village>div.selectbox").click(function(){
		if ($("#select-town").text() == '请选择镇') {
			alertMessage("请先选择镇");
		}else{
			$("#ul-town>li").each(function(){
				if($(this).text() == $("#select-town").text()){
					townId = $(this).attr("data-areaId");
				}
			});
			var data = {provinceId:provinceId,cityId:cityId,countyId:countyId,townId:townId};
			queryAreaListByParentId(data,'ul-village');			
		}
	});
	var bankOptions = createSelectOptions("BANK");
	$("#opening-bank").append(bankOptions);
	radioButtonClick("poor-standards-div");	
	radioButtonClick("poor-attribute-div");	
	radioButtonClick("isOrNotJLS");
	radioButtonClick("isOrNotDSZN");
	radioButtonClick("isOrNotSNH");
	radioButtonClick("isOrNotFP");
	radioButtonClick("isOrNotDZXSKZBYM");
	var sexOptions = createSelectOptions("SEX");
	var relationOptions = createSelectOptions("YHZGX");
	var nationOptions = createSelectOptions("NATION");
	var politicsOptions = createSelectOptions("POLITICS");
	var eduOptions = createSelectOptions("EDU");
	var laborSkillOptions = createSelectOptions("SKILL");
	var workStatusOptions = createSelectOptions("WORK_CON");
	var workTimeOptions = createSelectOptions("WORK_TIME");
	var isOptions = createSelectOptions("IS");
	var studentStatusOptions = createSelectOptions("STUDENT");
	var healthConditionOptions = createSelectOptions("HEALTH");
	$("#add-record-btn").click(function(){
		var tdNum = $("table.family_member_information>tbody>tr").length + 1;
		var tempHtml = '<tr><td><input type="checkbox" data-id=""/></td><td>'
									+ tdNum +'</td><td><input type="text" value=""/></td><td><select>'
									+ sexOptions +'</select></td><td><input type="text" value="" /></td><td><select>'
									+ relationOptions +'</select></td><td><select>'
									+ nationOptions +'</select></td><td><select>'
									+ politicsOptions +'</select></td><td><select>'
									+ eduOptions +'</select></td><td><select>'
									+ laborSkillOptions +'</select></td><td><select>'
									+ workStatusOptions +'</select></td><td><select>'
									+ workTimeOptions +'</select></td><td><select>'
									+ isOptions +'</select></td><td><select>'
									+ isOptions +'</select></td><td><select>'
									+ studentStatusOptions +'</select></td><td><input type="text" value="" /></td><td><select>'
									+ healthConditionOptions +'</select></td><td><select>'
									+ isOptions +'</select></td><td><select>'
									+ isOptions +'</select></td><td><select>'
									+ isOptions +'</select></td></tr>';
		$("table.family_member_information>tbody").append(tempHtml);
	});
	$("#add-record-btn").trigger("click");
	$("#delete-record-btn").click(function(){
		$("table.family_member_information>tbody>tr").each(function(index,item){
			if($(item).children().find("input[type=checkbox]").prop('checked')){
				$(item).remove();
			}						
		});
		$("table.family_member_information>tbody>tr").each(function(index,item){			
			$(item).find("td:eq(1)").text(index+1);
		});
	});
	$("#first-operation-save-btn").click(function(){
		addPoorStepOne();
//		$(".poor_people_info_one").css("display","none");
//		$(".poor_people_info_two").css("display","block");
	});
	$("#first-operation-cancle-btn").click(function(){
		hideDialog();
	});
	radioButtonClick("main_reason");
	secondButtonClick("other_reason");
	radioButtonClick("fanpin_reason");
	$("#second-operation-back-btn").click(function(){		
		$(".poor_people_info_one").css("display","block");
		$(".poor_people_info_two").css("display","none");
	});
	$("#second-operation-next-btn").click(function(){
		addPoorStepTwo();
//		$(".poor_people_info_two").css("display","none");
//		$(".poor_people_info_three").css("display","block");
	});
	radioButtonClick("productElectric");
	radioButtonClick("liveElectric");
	radioButtonClick("joinArtel");
	radioButtonClick("toilet");
	radioButtonClick("drinkingTrouble");
	radioButtonClick("drinkingSave");
	var mainFuelTypeOptions = createSelectOptions("FUEL");
	var entryRoadTypeOptions = createSelectOptions("RHL");
	$("#mainFuelType").append(mainFuelTypeOptions);
	$("#entryRoadType").append(entryRoadTypeOptions);
	$("#three-operation-back-btn").click(function(){
		$(".poor_people_info_two").css("display","block");
		$(".poor_people_info_three").css("display","none");
	});
	$("#three-operation-sure-btn").click(function(){
		addPoorStepThree();
//		$(".poor_people_info_one").css("display","block");
//		$(".poor_people_info_three").css("display","none");
//		hideDialog();
	});
	var helpPersonOptions = getHelpPersonData();
	$("#three-add-record-btn").click(function(){
		var tdNum = $("table.help-person-table>tbody>tr").length + 1;
		var tempHtml = '<tr data-id=""><td><input type="checkbox"/></td><td>'
						+ tdNum +'</td><td><select onchange="selectChange(this);">'
						+ helpPersonOptions +'</select></td><td></td><td></td><td></td><td><input type="text" value="" placeholder="xxxx-xx-xx"/></td><td><input type="text" value="" placeholder="xxxx-xx-xx"/></td><td></td><td></td><td></td></tr>';
		$("table.help-person-table>tbody").append(tempHtml);
	});
	$("#three-add-record-btn").trigger("click");
	$("#three-delete-record-btn").click(function(){
		$("table.help-person-table>tbody>tr").each(function(index,item){
			if($(item).children().find("input[type=checkbox]").prop('checked')){
				$(item).remove();
			}						
		});
		$("table.help-person-table>tbody>tr").each(function(index,item){			
			$(item).find("td:eq(1)").text(index+1);
		});
	});
});
function selectChange(obj){
	var sex = $(obj).find("option:selected").attr("data-sex");
	$(obj).parent().parent().find("td:eq(3)").text(sex!="undefined"?sex:'');
	var politics = $(obj).find("option:selected").attr("data-politics");
	$(obj).parent().parent().find("td:eq(4)").text(politics!="undefined"?politics:'');
	var companyName = $(obj).find("option:selected").attr("data-companyName");
	$(obj).parent().parent().find("td:eq(5)").text(companyName!="undefined"?companyName:'');
	var affiliation = $(obj).find("option:selected").attr("data-affiliation");
	$(obj).parent().parent().find("td:eq(8)").text(affiliation!="undefined"?affiliation:'');
	var companyAddress = $(obj).find("option:selected").attr("data-companyAddress");
	$(obj).parent().parent().find("td:eq(9)").text(companyAddress!="undefined"?companyAddress:'');
	var telephoneNumber = $(obj).find("option:selected").attr("data-telephoneNumber");
	$(obj).parent().parent().find("td:eq(10)").text(telephoneNumber!="undefined"?telephoneNumber:'');
	var data_id = $(obj).find("option:selected").attr("data-id");
	$(obj).parent().parent().attr("data-id",data_id);
}
function getHelpPersonData(){
	var helpPersonOptions;
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "get",
		url: wPath.getUrl('familyconditionListhelpperson'),
		dataType:'JSON',
		async: false,
		success: function(msg) {
			var optionsHtml = '<option>未选择</option>';
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				for (var i=0;i<datatotal.length;i++) {
					var option = '<option data-id="'
									+ datatotal[i].id +'" data-politics="'
									+ datatotal[i].politics +'" data-telephoneNumber="'
									+ datatotal[i].telephoneNumber +'" data-affiliation="'
									+ datatotal[i].affiliation +'" data-sex="'
									+ datatotal[i].sex +'" data-companyName="'
									+ datatotal[i].companyName +'" data-companyAddress="'
									+ datatotal[i].companyAddress +'">'
									+ datatotal[i].name +'</option>';
					optionsHtml +=option;				
				}
				helpPersonOptions = optionsHtml;
			}else{
				alertMessage(msg.message);
			}
		}
	});
	return helpPersonOptions;
}
function getHelpPersonSelectedData(str){
	var helpPersonOptions;
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "get",
		url: wPath.getUrl('familyconditionListhelpperson'),
		dataType:'JSON',
		async: false,
		success: function(msg) {
			var optionsHtml = '<option>未选择</option>';
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				for (var i=0;i<datatotal.length;i++) {
					if(datatotal[i].id == str){
						var option = '<option data-id="'
									+ datatotal[i].id +'" data-politics="'
									+ datatotal[i].politics +'" data-telephoneNumber="'
									+ datatotal[i].telephoneNumber +'" data-affiliation="'
									+ datatotal[i].affiliation +'" data-sex="'
									+ datatotal[i].sex +'" data-companyName="'
									+ datatotal[i].companyName +'" data-companyAddress="'
									+ datatotal[i].companyAddress +'" selected="selected">'
									+ datatotal[i].name +'</option>';
						optionsHtml +=option;
					}else{
						var option = '<option data-id="'
									+ datatotal[i].id +'" data-politics="'
									+ datatotal[i].politics +'" data-telephoneNumber="'
									+ datatotal[i].telephoneNumber +'" data-affiliation="'
									+ datatotal[i].affiliation +'" data-sex="'
									+ datatotal[i].sex +'" data-companyName="'
									+ datatotal[i].companyName +'" data-companyAddress="'
									+ datatotal[i].companyAddress +'">'
									+ datatotal[i].name +'</option>';
						optionsHtml +=option;
					}
				}
				helpPersonOptions = optionsHtml;
			}else{
				alertMessage(msg.message);
			}
		}
	});
	return helpPersonOptions;
}
function createSelectOptions(str){	
	var dataOptions='<option data-dm="">未选择</option>';
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('dmGetdm'),
		data:{dmCode:str},
		dataType:'JSON',
		async: false,
		success: function(msg) {
			var tempOptions='<option data-dm="">未选择</option>';
			if(msg.result == "SUCCESS"){				
				var datatotal=msg.object;
				for(var i=0;i<datatotal.subDmList.length;i++){
						tempOptions += '<option data-dmValue="'
						+ datatotal.subDmList[i].dmValue +'" data-dm="'
						+ datatotal.subDmList[i].dm +'" data-dmCode="'
						+ datatotal.dmCode +'" data-dmName="'
						+ datatotal.dmName +'">'
						+ datatotal.subDmList[i].dmValue +'</option>';
				}
			dataOptions = tempOptions;
			}else{
				alertMessage(msg.message);
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
	return dataOptions;
}
function setSelectedOptions(str,dm){
	var dataOptions='<option data-dm="">未选择</option>';
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('dmGetdm'),
		data:{dmCode:str},
		dataType:'JSON',
		async: false,
		success: function(msg) {
			var tempOptions='<option data-dm="">未选择</option>';
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				for(var i=0;i<datatotal.subDmList.length;i++){
					if(datatotal.subDmList[i].dm == dm){
						tempOptions += '<option data-dmValue="'
						+ datatotal.subDmList[i].dmValue +'" data-dm="'
						+ datatotal.subDmList[i].dm +'" data-dmCode="'
						+ datatotal.dmCode +'" data-dmName="'
						+ datatotal.dmName +'" selected="selected">'
						+ datatotal.subDmList[i].dmValue +'</option>';
					}else{
						tempOptions += '<option data-dmValue="'
						+ datatotal.subDmList[i].dmValue +'" data-dm="'
						+ datatotal.subDmList[i].dm +'" data-dmCode="'
						+ datatotal.dmCode +'" data-dmName="'
						+ datatotal.dmName +'">'
						+ datatotal.subDmList[i].dmValue +'</option>';
					}
				}
			dataOptions = tempOptions;
			}else{
				alertMessage(msg.message);
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
	return dataOptions;
}
function radioButtonClick(str){
	$("#"+ str +">button").click(function(){
		$("#"+ str +">button").removeClass("btn_1").addClass("btn_2");
		$(this).removeClass("btn_2").addClass("btn_1");
	});
}
function secondButtonClick(str){
	$("#"+ str +">button").click(function(){
		if($("#"+ str +">button.btn_1").length == 2){
			$("#"+ str +">button").removeClass("btn_1").addClass("btn_2");
			$(this).removeClass("btn_2").addClass("btn_1");
		}else{
			$(this).removeClass("btn_1").removeClass("btn_2").addClass("btn_1");
		}		
	});
}

function addPoorStepOne(){
	var urlStr = '';
	var data;
	var areaId = getAreaId("village");
	var allAreaIds=getAreaId("province") + ','+getAreaId("city") + ',' + getAreaId("county") +',' + getAreaId("town") + ',' +getAreaId("village");
	var address = $("#address-details").val();
	var telephoneNumber = $("#contact-phone").val();
	var bankName = $("#opening-bank>option:selected").attr("data-dm");
	var bankNo = $("#bank-account").val();
	var standards = getDm("poor-standards-div");	
	var attribute = getDm("poor-attribute-div");	
	var jls = getDm("isOrNotJLS");	
	var onlyChild = getDm("isOrNotDSZN");
	var doubleDaughters = getDm("isOrNotSNH");
	var antiPoverty = getDm("isOrNotFP");
	var immigrant = getDm("isOrNotDZXSKZBYM");
	var relievePovertyYear = $("#overcome-poverty").val();
	var dropout = $("#dropout-poverty").val();	
	var array = new Array();
	$("table.family_member_information>tbody>tr").each(function(index,item){
		var object = new Object();
		object.id = $(item).find("td:eq(0)>input").attr("data-id");
		object.realName = $(item).find("td:eq(2)>input").val();
		object.sex = $(item).find("td:eq(3)>select>option:selected").attr("data-dm");
		object.idcardNo = $(item).find("td:eq(4)>input").val();	
		object.relation = $(item).find("td:eq(5)>select>option:selected").attr("data-dm");
		object.nation = $(item).find("td:eq(6)>select>option:selected").attr("data-dm");
		object.politics = $(item).find("td:eq(7)>select>option:selected").attr("data-dm");
		object.education = $(item).find("td:eq(8)>select>option:selected").attr("data-dm");
		object.laborSkill = $(item).find("td:eq(9)>select>option:selected").attr("data-dm");
		object.workStatus = $(item).find("td:eq(10)>select>option:selected").attr("data-dm");
		object.workTime = $(item).find("td:eq(11)>select>option:selected").attr("data-dm");
		object.activeServicemen = $(item).find("td:eq(12)>select>option:selected").attr("data-dm");
		object.medicalInsurance = $(item).find("td:eq(13)>select>option:selected").attr("data-dm");
		object.studentStatus = $(item).find("td:eq(14)>select>option:selected").attr("data-dm");
		object.studySite = $(item).find("td:eq(15)>input").val();
		object.healthCondition = $(item).find("td:eq(16)>select>option:selected").attr("data-dm");
		object.commercialInsurance = $(item).find("td:eq(17)>select>option:selected").attr("data-dm");
		object.residentsInsurance = $(item).find("td:eq(18)>select>option:selected").attr("data-dm");
		object.enjoyLowPolicy = $(item).find("td:eq(19)>select>option:selected").attr("data-dm");
		array.push(object);
	});	
	var familyMemberJsonListString = JSON.stringify(array);	
	if(createOrUpdate == "新建"){
		urlStr = 'familyconditionInsert1';
		data= {areaId:areaId,allAreaIds:allAreaIds,address:address,telephoneNumber:telephoneNumber,bankName:bankName,
		bankNo:bankNo,standards:standards,attribute:attribute,jls:jls,onlyChild:onlyChild,doubleDaughters:doubleDaughters,
		antiPoverty:antiPoverty,immigrant:immigrant,relievePovertyYear:relievePovertyYear,dropout:dropout,
		familyMemberJsonListString:familyMemberJsonListString};
	}else{
		urlStr = 'familyconditionUpdate1';
		data= {id:familyId,areaId:areaId,allAreaIds:allAreaIds,address:address,telephoneNumber:telephoneNumber,bankName:bankName,
		bankNo:bankNo,standards:standards,attribute:attribute,jls:jls,onlyChild:onlyChild,doubleDaughters:doubleDaughters,
		antiPoverty:antiPoverty,immigrant:immigrant,relievePovertyYear:relievePovertyYear,dropout:dropout,
		familyMemberJsonListString:familyMemberJsonListString};
	}
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl(urlStr),
		data: data,
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				alertMessage(msg.message);
				$(".poor_people_info_one").css("display","none");
				$(".poor_people_info_two").css("display","block");
				if(createOrUpdate == "新建"){
					familyId = msg.object;
				}				
			}else{
				alertMessage(msg.message);
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
function getDm(str){
	var tempDm = '';	
	$("#"+ str +">button").each(function(){
		if($(this).hasClass("btn_1")){
			tempDm = $(this).attr("data-dm");		
		}
	});
	return tempDm;
}
function getDms(str){
	var tempDm = '';	
	$("#"+ str +">button").each(function(){
		if($(this).hasClass("btn_1")){
			tempDm += $(this).attr("data-dm")+',';		
		}
	});
	return tempDm;
}
function getAreaId(str){
	var tempAreaId='';
	$("#ul-"+ str +">li").each(function(){
		if($(this).text() == $("#select-"+ str +"").text()){
			tempAreaId = $(this).attr("data-areaId");
		}
	});
	return tempAreaId;
}
//新增第二步
function addPoorStepTwo(){
	var urlStr = '';
	if(createOrUpdate == "新建"){
		urlStr = 'familyconditionInsert2';
	}else{
		urlStr = 'familyconditionUpdate2';
	}
	var mainPovertyReason = getDm("main_reason");
	var otherPovertyReason = getDms("other_reason");
	var antiPovertyReason = getDm("fanpin_reason");
	var wagesIncome = $("#wagesIncome").val();
	var transferIncome = $("#transferIncome").val();
	var otherTransferIncome = $("#otherTransferIncome").val();
	var propertyIncome = $("#propertyIncome").val();
	var productIncome = $("#productIncome").val();
	var productCost = $("#productCost").val();
	var endowment = $("#endowment").val();
	var familyPlan = $("#familyPlan").val();
	var ecological = $("#ecological").val();
	var lowInsurance = $("#lowInsurance").val();
	var fiveInsurance = $("#fiveInsurance").val();
	var farmMaterials = $("#farmMaterials").val();
	var foodAid = $("#foodAid").val();
	var medicare = $("#medicare").val();
	var medicalAid = $("#medicalAid").val();
	var medicalBusiness = $("#medicalBusiness").val();
	var interestIncome = $("#interestIncome").val();
	var expropriation = $("#expropriation").val();
	var rentalIncome = $("#rentalIncome").val();
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl(urlStr),
		data:{id:familyId,familyId:familyId,mainPovertyReason:mainPovertyReason,otherPovertyReason:otherPovertyReason,
		antiPovertyReason:antiPovertyReason,wagesIncome:wagesIncome,transferIncome:transferIncome,otherTransferIncome:otherTransferIncome,
		propertyIncome:propertyIncome,productIncome:productIncome,productCost:productCost,endowment:endowment,familyPlan:familyPlan,
		ecological:ecological,lowInsurance:lowInsurance,fiveInsurance:fiveInsurance,farmMaterials:farmMaterials,foodAid:foodAid,
		medicare:medicare,medicalAid:medicalAid,medicalBusiness:medicalBusiness,interestIncome:interestIncome,expropriation:expropriation,
		rentalIncome:rentalIncome},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				alertMessage(msg.message);
				if(createOrUpdate == "新建"){
					familyId = msg.object;
				}
				$(".poor_people_info_two").css("display","none");
				$(".poor_people_info_three").css("display","block");
			}else{
				alertMessage(msg.message);
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
//新增第三步
function addPoorStepThree(){
	var urlStr = '';
	if(createOrUpdate == "新建"){
		urlStr = 'familyconditionInsert3';
	}else{
		urlStr = 'familyconditionUpdate3';
	}
	var cultivatedArea = $("#cultivatedArea").val();
	var productElectric = getDm("productElectric");
	var mainFuelType = $("#mainFuelType>option:selected").attr("data-dm");
	var irrigatedArea = $("#irrigatedArea").val();
	var liveElectric = getDm("liveElectric");
	var joinArtel = getDm("joinArtel");
	var forestArea = $("#forestArea").val();
	var distance = $("#distance").val();
	var toilet = getDm("toilet");	
	var grainGreenArea = $("#grainGreenArea").val();
	var entryRoadType = $("#entryRoadType>option:selected").attr("data-dm");
	var drinkingTrouble = getDm("drinkingTrouble");
	var forfruitArea =  $("#forfruitArea").val();
	var houseArea = $("#houseArea").val();
	var drinkingSave = getDm("drinkingSave");
	var waterArea = $("#waterArea").val();
	var pastureArea = $("#pastureArea").val();	
	var array = new Array();
	$("table.help-person-table>tbody>tr").each(function(index,item){
		var object = new Object();
		object.id = $(item).attr("data-id");
		object.helpFamilyId = familyId;
		object.startTime = $(item).find("td:eq(6)>input").val();
		object.endTime = $(item).find("td:eq(7)>input").val();			
		array.push(object);
	});	
	helpPersonJsonListString = JSON.stringify(array);
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl(urlStr),
		data:{familyId:familyId,cultivatedArea:cultivatedArea,productElectric:productElectric,mainFuelType:mainFuelType,irrigatedArea:irrigatedArea,
		liveElectric:liveElectric,joinArtel:joinArtel,forestArea:forestArea,distance:distance,toilet:toilet,grainGreenArea:grainGreenArea,
		entryRoadType:entryRoadType,drinkingTrouble:drinkingTrouble,forfruitArea:forfruitArea,houseArea:houseArea,drinkingSave:drinkingSave,
		waterArea:waterArea,pastureArea:pastureArea,helpPersonJsonListString:helpPersonJsonListString},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				alertMessage(msg.message);
				hideDialog();
				window.location.reload();
			}else{
				alertMessage(msg.message);
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

//查询省市县镇村
function queryAreaListByParentId(data,elementId){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('areaRelation/listarearelation'),
		data:data,
		dataType:'JSON',
		async: false,
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				if(datatotal.length != 0){
						$("#"+elementId).empty();
					}
				for(var i = 0;i<datatotal.length;i++){
					var optionHtml = '<li class="item" data-areaId="'
					+ datatotal[i].id +'">'
					+ datatotal[i].name +'</li>';
					$("#"+elementId).append(optionHtml);
				}
			}else{
				alertMessage(msg.message);
			}
		},
		//调用执行后调用的函数
        complete: function (XMLHttpRequest, textStatus) {
        		selectLiClick("province");
			selectLiClick("city");
			selectLiClick("county");
			selectLiClick("town");
			selectLiClick("village");
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}
function selectOpenOrClose(str){
	$("#address-"+ str +">div.selectbox").click(function(){
		if($("#address-"+ str +">div.selectbox>a.after-arrow").hasClass("arrow-down")){
			$("#address-"+ str +">div.selectbox>a.after-arrow").removeClass("arrow-down").addClass("arrow-up");
			$("#address-"+ str +">div.dropdown").removeClass("closeSelect").addClass("openSelect");
		}else{
			$("#address-"+ str +">div.selectbox>a.after-arrow").removeClass("arrow-up").addClass("arrow-down");
			$("#address-"+ str +">div.dropdown").removeClass("openSelect").addClass("closeSelect");
		}
	});
}
function selectLiClick(str){
	$("#ul-"+ str +">li.item").each(function(){
		$(this).click(function(){
			$("#select-"+ str).text($(this).text());
			$("#address-"+ str +">div.selectbox>a.after-arrow").removeClass("arrow-up").addClass("arrow-down");
			$("#address-"+ str +">div.dropdown").removeClass("openSelect").addClass("closeSelect");
		});
	});
}
function alertMessage(str){
	new NoticeJs({
	    text: str,
	    position: 'middleCenter',
	    animation: {
	        open: 'animated bounceIn',
	        close: 'animated bounceOut'
	    }
	}).show();
}
//编辑贫困户
function editBtnClick(event){
	$(".poor_people_info_one").css("display","block");
	$(".poor_people_info_two").css("display","none");
	$(".poor_people_info_three").css("display","none");
	showDialog();
	createOrUpdate = "编辑";
	$("#dialog-title").text("编辑-贫困户信息采集");
	familyId = $(event.target).parent().parent().attr("data-id");
	if (!$("#three-add-record-btn").hasClass("hidden")) {
		$("#three-add-record-btn").addClass("hidden");
	}
	if (!$("#three-delete-record-btn").hasClass("hidden")) {
		$("#three-delete-record-btn").addClass("hidden");
	}
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familyconditionSelect'),
		data:{familyId:familyId},
		dataType:'JSON',
		async: false,
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				//基本信息及致贫返贫原因
				var familyCondition = datatotal.familyCondition;
				var allAreaIds = familyCondition.allAreaIds;
				var areaIdsArray=allAreaIds.split(",");
				queryAreaListByParentId('','ul-province');
				$("#ul-province>li").each(function(index,item){
					if($(item).attr("data-areaid") == areaIdsArray[0]){
						$(item).trigger("click");
					}
				});
				var dataProvince = {provinceId:areaIdsArray[0]};
				queryAreaListByParentId(dataProvince,'ul-city');
				$("#ul-city>li").each(function(index,item){
					if($(item).attr("data-areaid") == areaIdsArray[1]){
						$(item).trigger("click");
					}
				});
				var dataCity = {provinceId:areaIdsArray[0],cityId:areaIdsArray[1]};
				queryAreaListByParentId(dataCity,'ul-county');
				$("#ul-county>li").each(function(index,item){
					if($(item).attr("data-areaid") == areaIdsArray[2]){
						$(item).trigger("click");
					}
				});
				var dataCounty = {provinceId:areaIdsArray[0],cityId:areaIdsArray[1],countyId:areaIdsArray[2]};
				queryAreaListByParentId(dataCounty,'ul-town');
				$("#ul-town>li").each(function(index,item){
					if($(item).attr("data-areaid") == areaIdsArray[3]){
						$(item).trigger("click");
					}
				});
				var dataTown = {provinceId:areaIdsArray[0],cityId:areaIdsArray[1],countyId:areaIdsArray[2],townId:areaIdsArray[3]};
				queryAreaListByParentId(dataTown,'ul-village');
				$("#ul-village>li").each(function(index,item){
					if($(item).attr("data-areaid") == areaIdsArray[4]){
						$(item).trigger("click");
					}
				});
				$("#address-details").val(familyCondition.address);
				$("#contact-phone").val(familyCondition.telephoneNumber);
				$("#opening-bank>option").each(function(index,item){
					if($(item).attr("data-dm") == familyCondition.bankName){
						$(item).prop("selected",true);
					}
				});
				$("#bank-account").val(familyCondition.bankNo);
				var standards = familyCondition.standards;
				$("#poor-standards-div>button").each(function(index,item){
					if($(item).attr("data-dm") == standards){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var attribute = familyCondition.attribute;
				$("#poor-attribute-div>button").each(function(index,item){
					if($(item).attr("data-dm") == attribute){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var jls = familyCondition.jls;
				$("#isOrNotJLS>button").each(function(index,item){
					if($(item).attr("data-dm") == jls){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var onlyChild = familyCondition.onlyChild;
				$("#isOrNotDSZN>button").each(function(index,item){
					if($(item).attr("data-dm") == onlyChild){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var doubleDaughters = familyCondition.doubleDaughters;
				$("#isOrNotSNH>button").each(function(index,item){
					if($(item).attr("data-dm") == doubleDaughters){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var antiPoverty = familyCondition.antiPoverty;
				$("#isOrNotFP>button").each(function(index,item){
					if($(item).attr("data-dm") == antiPoverty){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var immigrant = familyCondition.immigrant;
				$("#isOrNotDZXSKZBYM>button").each(function(index,item){
					if($(item).attr("data-dm") == immigrant){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#overcome-poverty").val(familyCondition.relievePovertyYear);
				$("#dropout-poverty").val(familyCondition.dropout);
				var mainPovertyReason = familyCondition.mainPovertyReason;
				$("#main_reason>button").each(function(index,item){
					if($(item).attr("data-dm") == mainPovertyReason){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var otherPovertyReason = familyCondition.otherPovertyReason;
				if(typeof(otherPovertyReason)!="undefined"){
					var otherPovertyReasonArray = otherPovertyReason.split(",");
					$("#other_reason>button").each(function(index,item){
						for(var i=0;i<otherPovertyReasonArray.length;i++){
							if($(item).attr("data-dm") == otherPovertyReasonArray[i]){
								$(item).removeClass("btn_2").addClass("btn_1");
							}
						}					
					});
				}				
				var antiPovertyReason = familyCondition.antiPovertyReason;
				$("#fanpin_reason>button").each(function(index,item){
					if($(item).attr("data-dm") == antiPovertyReason){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				//家庭成员
				var familyMemberList = datatotal.familyMemberList;
				$("table.family_member_information>tbody").empty();
				for(var i = 0;i<familyMemberList.length;i++){
					var sexOptions = setSelectedOptions("SEX",familyMemberList[i].sex);
					var relationOptions = setSelectedOptions("YHZGX",familyMemberList[i].relation);
					var nationOptions = setSelectedOptions("NATION",familyMemberList[i].nation);
					var politicsOptions = setSelectedOptions("POLITICS",familyMemberList[i].politics);
					var eduOptions = setSelectedOptions("EDU",familyMemberList[i].education);
					var laborSkillOptions = setSelectedOptions("SKILL",familyMemberList[i].laborSkill);
					var workStatusOptions = setSelectedOptions("WORK_CON",familyMemberList[i].workStatus);
					var workTimeOptions = setSelectedOptions("WORK_TIME",familyMemberList[i].workTime);
					var activeServicemenOptions = setSelectedOptions("IS",familyMemberList[i].activeServicemen);
					var medicalInsuranceOptions = setSelectedOptions("IS",familyMemberList[i].medicalInsurance);
					var studentStatusOptions = setSelectedOptions("STUDENT",familyMemberList[i].studentStatus);
					var healthConditionOptions = setSelectedOptions("HEALTH",familyMemberList[i].healthCondition);
					var commercialInsuranceOptions = setSelectedOptions("IS",familyMemberList[i].commercialInsurance);
					var residentsInsuranceOptions = setSelectedOptions("IS",familyMemberList[i].residentsInsurance);
					var enjoyLowPolicyOptions = setSelectedOptions("IS",familyMemberList[i].enjoyLowPolicy);
					var tempHtml = '<tr><td><input type="checkbox" data-id="'
									+ familyMemberList[i].id +'"/></td><td>'
									+ parseInt(i+1) +'</td><td><input type="text" value="'
									+ familyMemberList[i].realName +'"/></td><td><select>'
									+ sexOptions +'</select></td><td><input type="text" value="'
									+ familyMemberList[i].idcardNo +'" /></td><td><select>'
									+ relationOptions +'</select></td><td><select>'
									+ nationOptions +'</select></td><td><select>'
									+ politicsOptions +'</select></td><td><select>'
									+ eduOptions +'</select></td><td><select>'
									+ laborSkillOptions +'</select></td><td><select>'
									+ workStatusOptions +'</select></td><td><select>'
									+ workTimeOptions +'</select></td><td><select>'
									+ activeServicemenOptions +'</select></td><td><select>'
									+ medicalInsuranceOptions +'</select></td><td><select>'
									+ studentStatusOptions +'</select></td><td><input type="text" value="'
									+ familyMemberList[i].studySite +'" /></td><td><select>'
									+ healthConditionOptions +'</select></td><td><select>'
									+ commercialInsuranceOptions +'</select></td><td><select>'
									+ residentsInsuranceOptions +'</select></td><td><select>'
									+ enjoyLowPolicyOptions +'</select></td></tr>';
					$("table.family_member_information>tbody").append(tempHtml);
				}
				//收入情况
				var familyIncomeExpend = datatotal.familyIncomeExpend;
				$("#wagesIncome").val(familyIncomeExpend.wagesIncome);
				$("#transferIncome").val(familyIncomeExpend.transferIncome);
				$("#otherTransferIncome").val(familyIncomeExpend.otherTransferIncome);
				$("#propertyIncome").val(familyIncomeExpend.propertyIncome);
				$("#productIncome").val(familyIncomeExpend.productIncome);
				$("#productCost").val(familyIncomeExpend.productCost);
				$("#endowment").val(familyIncomeExpend.endowment);
				$("#familyPlan").val(familyIncomeExpend.familyPlan);
				$("#ecological").val(familyIncomeExpend.ecological);
				$("#lowInsurance").val(familyIncomeExpend.lowInsurance);
				$("#fiveInsurance").val(familyIncomeExpend.fiveInsurance);
				$("#farmMaterials").val(familyIncomeExpend.farmMaterials);
				$("#foodAid").val(familyIncomeExpend.foodAid);
				$("#medicare").val(familyIncomeExpend.medicare);
				$("#medicalAid").val(familyIncomeExpend.medicalAid);
				$("#medicalBusiness").val(familyIncomeExpend.medicalBusiness);
				$("#interestIncome").val(familyIncomeExpend.interestIncome);
				$("#expropriation").val(familyIncomeExpend.expropriation);
				$("#rentalIncome").val(familyIncomeExpend.rentalIncome);
				//生产生活条件
				var familyLive = datatotal.familyLive;
				var familyProduct = datatotal.familyProduct;
				$("#cultivatedArea").val(familyProduct.cultivatedArea);
				var productElectric = familyProduct.productElectric;
				$("#productElectric>button").each(function(index,item){
					if($(item).attr("data-dm") == productElectric){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var mainFuelType = familyLive.mainFuelType;
				$("#mainFuelType>option").each(function(index,item){
					if($(item).attr("data-dm") == mainFuelType){
						$(item).prop("selected",true);
					}
				});
				$("#irrigatedArea").val(familyProduct.irrigatedArea);
				var liveElectric = familyLive.liveElectric;
				$("#liveElectric>button").each(function(index,item){
					if($(item).attr("data-dm") == liveElectric){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				var joinArtel = familyProduct.joinArtel;
				$("#joinArtel>button").each(function(index,item){
					if($(item).attr("data-dm") == joinArtel){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#forestArea").val(familyProduct.forestArea);
				$("#distance").val(familyLive.distance);
				var toilet = familyLive.toilet;
				$("#toilet>button").each(function(index,item){
					if($(item).attr("data-dm") == toilet){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#grainGreenArea").val(familyProduct.grainGreenArea);
				var entryRoadType = familyLive.entryRoadType;
				$("#entryRoadType>option").each(function(index,item){
					if($(item).attr("data-dm") == entryRoadType){
						$(item).prop("selected",true);
					}
				});
				var drinkingTrouble = familyLive.drinkingTrouble;
				$("#drinkingTrouble>button").each(function(index,item){
					if($(item).attr("data-dm") == drinkingTrouble){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#forfruitArea").val(familyProduct.forfruitArea);
				$("#houseArea").val(familyLive.houseArea);
				var drinkingSave = familyLive.drinkingSave;
				$("#drinkingSave>button").each(function(index,item){
					if($(item).attr("data-dm") == drinkingSave){
						$(item).removeClass("btn_2").addClass("btn_1");
					}
				});
				$("#waterArea").val(familyProduct.waterArea);
				$("#pastureArea").val(familyProduct.pastureArea);
				//帮扶责任人
				var helpPersonList = datatotal.helpPersonList;
				$("table.help-person-table>tbody").empty();
				for(var i =0;i<helpPersonList.length;i++){
					var helpPersonSelectedOptions = getHelpPersonSelectedData(helpPersonList[i].id);
					var startTime = helpPersonList[i].startTime;
					if(typeof(startTime)!="undefined" && startTime.length!=0){
						startTime = startTime.substr(0,10);
					}else{
						startTime = '';
					}
					var endTime = helpPersonList[i].endTime;
					if(typeof(endTime)!="undefined" && endTime.length!=0){
						endTime = endTime.substr(0,10);
					}else{
						endTime = '';
					}
					var tempHtml = '<tr data-id=""><td><input type="checkbox"/></td><td>'
						+ parseInt(i+1) +'</td><td>'
						+ helpPersonList[i].name +'</td><td>'
						+ helpPersonList[i].sex +'</td><td>'
						+ helpPersonList[i].politics +'</td><td>'
						+ helpPersonList[i].companyName +'</td><td>'
						+ startTime +'</td><td>'
						+ endTime +'</td><td>'
						+ helpPersonList[i].companyAddress +'</td><td>'
						+ helpPersonList[i].telephoneNumber +'</td></tr>';
					$("table.help-person-table>tbody").append(tempHtml);
				}
			}else{
				alertMessage(msg.message);
			}
		}
	});
}

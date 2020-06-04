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
var accountId;
var sysUserId;
var manager;
$(function(){	
	var roleId = localStorage.getItem("roleId");
	if (roleId == "3") {
		$("#unitEditBtn").addClass("hidden");
	}
	getSexCode();
	getPoliticsCode();
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
			localStorage.setItem("oneOrTwo","one");
		} 
	});
	$("#navBtnTwo").click(function(){
		if (!$("#navBtnTwo").hasClass("navActive")) {
			$("#navBtnTwo").addClass("navActive");
			$("#navBtnOne").removeClass("navActive");
			$("#right_two").removeClass("hidden");
			$("#right_one").addClass("hidden");
			localStorage.setItem("oneOrTwo","two");
		}
	});
	var oneOrTwo = localStorage.getItem("oneOrTwo");
	if (oneOrTwo == "two") {
		$("#navBtnTwo").trigger("click");
	}
	$("#userName").text(localStorage.getItem("userName"));
	$("#userName2").text(localStorage.getItem("userName"));
	$("#userRole").text(localStorage.getItem("roleName"));
	getPersonInfo();
	getUintInfo();
});

function getSexCode() {
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('dmGetdm'),
		data:{dmCode:"SEX"},
		dataType:"JSON",
		success:function(msg){
			if(msg.result == "SUCCESS"){
				var subDmList = msg.object.subDmList;
				var optionsHtml = '<option>无数据</option>';
				for (var i = 0;i<subDmList.length;i++) {
					var tempOption = '<option data-dm="'+ subDmList[i].dm +'" data-dmValue="'+ subDmList[i].dmValue + '">' + subDmList[i].dmValue + '</option>';
					optionsHtml += tempOption;
				}
				$("#sexSelect").empty().append(optionsHtml);
			}else{
				alert(msg.message);
			}
		}
	});
}

function getPoliticsCode() {
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('dmGetdm'),
		data:{dmCode:"POLITICS"},
		dataType:"JSON",
		success:function(msg){
			if(msg.result == "SUCCESS"){
				var subDmList = msg.object.subDmList;
				var optionsHtml = '<option>无数据</option>';
				for (var i = 0;i<subDmList.length;i++) {
					var tempOption = '<option data-dm="'+ subDmList[i].dm +'" data-dmValue="'+ subDmList[i].dmValue + '">' + subDmList[i].dmValue + '</option>';
					optionsHtml += tempOption;
				}
				$("#zzmmSelect").append(optionsHtml);
			}else{
				alert(msg.message);
			}
		}
	});
}

function getPersonInfo() {
	var userId = localStorage.getItem("userId");
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('helpperson/toedit'),
		data:{id:userId},
		dataType:"JSON",
		success:function(msg){
			if(msg.result == "SUCCESS"){
				var data = msg.object;
				$("#ssdwInput").val(data.helpUnit.name);
				$("#nameInput").val(data.helpPerson.name);
				$("#accountInput").val(data.user.loginName);
				$("#roleInput").val(localStorage.getItem("roleName"));
				$("#phoneInput").val(data.helpPerson.telephoneNumber);
				$("#emailInput").val(data.helpPerson.email);
				$("#bfdxInput").val(data.familyName);
				var sex = data.helpPerson.sex;
				if (sex) {
					var sexValue = $("#sexSelect>option[data-dm=" + sex + "]").attr("data-dmValue");
					$("#sexSelect").val(sexValue);
				}
				var politics = data.helpPerson.politics;
				if (politics) {
					var politicsValue = $("#zzmmSelect>option[data-dm=" + politics + "]").attr("data-dmValue");
					$("#zzmmSelect").val(politicsValue);
				}
				accountId = data.user.id;
				sysUserId = data.helpPerson.sysUserId;
				manager = data.helpPerson.manager;
			}else{
				alert(msg.message);
			}
		}
	});
}
var code;
var province;
var city;
var county;
var village;
var town;
var adminSex;
var adminpolitics;
var helpPlanId;
var villageId;
var sys_user_id;
function getUintInfo() {
	var unitId = localStorage.getItem("unitId");
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('helpunit/toedit'),
		data:{id:unitId},
		dataType:"JSON",
		success:function(msg){
			if(msg.result == "SUCCESS"){
				var data = msg.object;
				$("#unitNumInput").val(data.unit.code);
				$("#unitNameInput").val(data.unit.name);
				$("#unitShorthandInput").val(data.unit.abbreviation);
				var provinceName = '';
				if (typeof(data.unit.provinceName)!="undefined") {
					provinceName = data.unit.provinceName;
				}
				var cityName = '';
				if (typeof(data.unit.cityName)!="undefined") {
					cityName = data.unit.cityName;
				}
				var countyName = '';
				if (typeof(data.unit.countyName)!="undefined") {
					countyName = data.unit.countyName;
				}
				var townName = '';
				if (typeof(data.unit.townName)!="undefined") {
					townName = data.unit.townName;
				}
				var villageName = '';
				if (typeof(data.unit.villageName)!="undefined") {
					villageName = data.unit.villageName;
				}
				$("#unitPlaceInput").val(provinceName + cityName + countyName + townName + villageName);
				$("#adminNameInput").val(data.person.name);
				$("#unitPhoneInput").val(data.person.telephone_number);
				$("#unitEmailInput").val(data.person.email);
				$("#pkcInput").val(data.village);
				$("#unitName").text(data.unit.name);
				$("#memberNum").text(data.unit.helpPersonCount + "人");
				code = data.unit.code;
				province =data.unit.province;
				city = data.unit.city;
				county = data.unit.county;
				village = data.unit.village;
				town = data.unit.town;
				adminSex = data.person.sex;
				adminpolitics =data.person.politics;
				if (typeof(data.plan)=="undefined" || typeof(data.plan.id)=="undefined") {
					helpPlanId = "";
				} else{
					helpPlanId =data.plan.id;
				}
				if (typeof(data.plan)=="undefined" || typeof(data.plan.villageId)=="undefined") {
					villageId = "";
				} else{
					villageId = data.plan.villageId;
				}
				sys_user_id = data.person.sys_user_id;
			}else{
				alert(msg.message);
			}
		}
	});
}

function changePwd() {
	showDialog();
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
function changePwdBtnClick() {
	if($("#newPwd").val().length == 0 || $("#againPwd").val().length == 0 || $("#oldPwd").val().length == 0) {
		alert("密码输入不能为空");
		return false;
	}
	if ($("#newPwd").val() != $("#againPwd").val()) {
		alert("请确保两次输入的新密码一致！");
	} else{
		$.ajax({
			xhrFields: {
		       withCredentials: true
		    },
		    crossDomain: true,
			type:"post",
			url:wPath.getUrl('user/edituserpassword'),
			data:{
				userId:accountId,
				originalPassword:$("#oldPwd").val(),
				password:$("#newPwd").val()
			},
			dataType:"JSON",
			success:function(msg){
				if (msg.result == "SUCCESS") {
					$("#newPwd").val("");
					$("#againPwd").val("");
					$("#oldPwd").val("");
					hideDialog();
					alert(msg.message);
				} else{
					alert(msg.message);
				}
			}
		});
	}
}
function personEditBtnClick() {
	$("#personEditBtn").addClass("hidden");
	$("#personCancelBtn").removeClass("hidden");
	$("#personSureBtn").removeClass("hidden");
	$("#nameInput").addClass("noDisabled").removeAttr("disabled");
	$("#sexSelect").addClass("noDisabled").removeAttr("disabled");
	$("#zzmmSelect").addClass("noDisabled").removeAttr("disabled");
	$("#phoneInput").addClass("noDisabled").removeAttr("disabled");
	$("#emailInput").addClass("noDisabled").removeAttr("disabled");
}
function personEditCancel() {
	$("#personEditBtn").removeClass("hidden");
	$("#personCancelBtn").addClass("hidden");
	$("#personSureBtn").addClass("hidden");
	$("#nameInput").removeClass("noDisabled").attr("disabled");
	$("#sexSelect").removeClass("noDisabled").attr("disabled");
	$("#zzmmSelect").removeClass("noDisabled").attr("disabled");
	$("#phoneInput").removeClass("noDisabled").attr("disabled");
	$("#emailInput").removeClass("noDisabled").attr("disabled");
	localStorage.setItem("oneOrTwo","one");
	window.location.reload();
}
function personEditSure() {
	var userId = localStorage.getItem("userId");
	var loginName = localStorage.getItem("userName");
	var password = localStorage.getItem("password");
	var helpUnitId = localStorage.getItem("unitId");
	var name = $("#nameInput").val();
	var sex; 
	if ($("#sexSelect").val() == "无数据") {
		sex = "";
	} else{
		$("#sexSelect>option").each(function(index,element){
			if ($(this).text() == $("#sexSelect").val()) {
				sex = $(this).attr("data-dm");
			}
		});
	}
	var politics;
	if ($("#zzmmSelect").val() == "无数据") {
		politics = "";
	} else{
		$("#zzmmSelect>option").each(function(index,element){
			if ($(this).text() == $("#zzmmSelect").val()) {
				politics = $(this).attr("data-dm");
			}
		});
	}
	var telephoneNumber = $("#phoneInput").val();
	var email = $("#emailInput").val();
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('helpperson/edit'),
		data:{
			id:userId,
			loginName:loginName,
			password:password,
			sysUserId:sysUserId,
			helpUnitId:helpUnitId,
			manager:manager,
			name:name,
			sex:sex,
			politics:politics,
			telephoneNumber:telephoneNumber,
			email:email
		},
		dataType:"JSON",
		success:function(msg){
			if (msg.result == "SUCCESS") {
				alert(msg.message);
				localStorage.setItem("oneOrTwo","one");
				window.location.reload();
			} else{
				alert(msg.message);
			}
		}
	});
}
function unitEditBtnClick() {
	$("#unitEditBtn").addClass("hidden");
	$("#unitCancelBtn").removeClass("hidden");
	$("#unitSureBtn").removeClass("hidden");
	$("#unitNameInput").addClass("noDisabled").removeAttr("disabled");
	$("#unitShorthandInput").addClass("noDisabled").removeAttr("disabled");
	$("#adminNameInput").addClass("noDisabled").removeAttr("disabled");
	$("#unitPhoneInput").addClass("noDisabled").removeAttr("disabled");
	$("#unitEmailInput").addClass("noDisabled").removeAttr("disabled");
}
function unitEditCancel() {
	$("#unitEditBtn").removeClass("hidden");
	$("#unitCancelBtn").addClass("hidden");
	$("#unitSureBtn").addClass("hidden");
	$("#unitNameInput").removeClass("noDisabled").attr("disabled");
	$("#unitShorthandInput").removeClass("noDisabled").attr("disabled");
	$("#adminNameInput").removeClass("noDisabled").attr("disabled");
	$("#unitPhoneInput").removeClass("noDisabled").attr("disabled");
	$("#unitEmailInput").removeClass("noDisabled").attr("disabled");
	localStorage.setItem("oneOrTwo","two");
	window.location.reload();
}
function unitEditSure() {
	var userId = localStorage.getItem("userId");
	var loginName = localStorage.getItem("userName");
	var password = localStorage.getItem("password");
	var helpUnitId = localStorage.getItem("unitId"); 
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('helpunit/edit'),
		data:{
			helpUnitId:helpUnitId,
			code:code,
			helpUnitName:$("#unitNameInput").val(),
			abbreviation:$("#unitShorthandInput").val(),
			province:province,
			city:city,
			county:county,
			village:village,
			town:town,
			id:userId,
			loginName:loginName,
			password:password,
			sysUserId:sys_user_id,
			name:$("#adminNameInput").val(),
			sex:adminSex,
			politics:adminpolitics,
			telephoneNumber:$("#unitPhoneInput").val(),
			email:$("#unitEmailInput").val(),
			helpPlanId:helpPlanId,
			villageId:villageId
		},
		dataType:"JSON",
		success:function(msg){
			if (msg.result == "SUCCESS") {
				alert(msg.message);
				localStorage.setItem("oneOrTwo","two");
				window.location.reload();
			} else{
				alert(msg.message);
			}
		}
	});
}
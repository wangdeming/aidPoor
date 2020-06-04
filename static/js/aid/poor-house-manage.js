var familyId=getUrlParam("familyId");

$(function(){	
	$("#familyIdInput").val(familyId);
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familyconditionQueryAllInfoByFamilyId'),
		data:{familyId:familyId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				//帮扶项目
				if(datatotal.helpPlan.length == 0){
					var helpArr = [
					                {value:335, name:'项目一'},
					                {value:310, name:'项目二'},
					                {value:234, name:'项目三'},
					                {value:135, name:'措施一'},
					                {value:1548, name:'措施二'}
					            ];					
					createEchartsPie(helpArr);
				}else{
					var helpArr = new Array();
					for (var i = 0; i<datatotal.helpPlan.length;i++) {
						var value = 10;
						if (typeof(datatotal.helpPlan[i].value)!="undefined") {
							value = datatotal.helpPlan[i].value;
						}
						var tempData = {value:value,name:datatotal.helpPlan[i].NAME}; 
						helpArr.push(tempData);
					}	
					createEchartsPie(helpArr);
				}				
				//收入
				var strArr = new Array();
				var numArr = new Array();
				if(typeof(datatotal.income) != "undefined"){
					for (var i = 0; i<datatotal.income.length;i++) {
					 strArr.push(datatotal.income[i].name);	
					 numArr.push(datatotal.income[i].value);
					}
					drawIncome(strArr,numArr);
				}				
				//位置及地图				
				var personLocation = datatotal.location;
				if(typeof(personLocation)!="undefined"){
					var locationStr = '当前位置：' + personLocation.city + ' > ' + personLocation.county + ' > ' + personLocation.town + ' > ' + personLocation.village;
					$("#person_location").text(locationStr);
					createMap(personLocation);
				}				
				//基本信息				
				var personBasicInfo = datatotal.basicInfo;
				if(typeof(personBasicInfo) != "undefined"){
					if(typeof(personBasicInfo.photoUrl) != "undefined" && personBasicInfo.photoUrl != ""){
                        $("#person-img").attr("src",personBasicInfo.photoUrl);
					}
                    if(typeof(personBasicInfo.realName) != "undefined"){
                        $("#person-realName").text(personBasicInfo.realName);
                    }
                    if(typeof(personBasicInfo.attribute) != "undefined"){
                        $("#person-attribute").text(personBasicInfo.attribute);
                    }
                    if(typeof(personBasicInfo.sex) != "undefined"){
                        $("#person-sex").text('性别:'+personBasicInfo.sex);
                    }
                    if(typeof(personBasicInfo.idcardNo) != "undefined"){
                        $("#person-idcardNo").text('证件号码:'+personBasicInfo.idcardNo);
                    }
                    if(typeof(personBasicInfo.telephoneNumber) != "undefined"){
                        $("#person-telephoneNumber").text('联系电话:'+personBasicInfo.telephoneNumber);
                    }
                    if(typeof(personBasicInfo.familyNum) != "undefined"){
                        $("#person-familyNum").text('家庭人数:'+personBasicInfo.familyNum);
                    }
				}
				
				//生产生活条件
				var personLiveCondition = datatotal.liveCondition;
				if (typeof(personLiveCondition)!="undefined") {
					var houseArea = "0";
					if (typeof(personLiveCondition.houseArea)!="undefined") {
						houseArea = personLiveCondition.houseArea;
					}
					$("#houseArea").text('住房面积：'+ houseArea +' 平方米');
					$("#mainFuelType").text('燃料类型：' + personLiveCondition.mainFuelType);
					if(personLiveCondition.drinkingSave == '1'){
						$("#drinkingSave").addClass('a_active');
					}
					if(personLiveCondition.toilet == '1'){
						$("#toilet").addClass('a_active');
					}
					if(personLiveCondition.radioTV == '1'){
						$("#radioTV").addClass('a_active');
					}
					if(personLiveCondition.drinkingTrouble == '1'){
						$("#drinkingTrouble").addClass('a_active');
					}
					if(personLiveCondition.productElectric == '1'){
						$("#productElectric").addClass('a_active');
					}
					if(personLiveCondition.liveElectric == '1'){
						$("#liveElectric").addClass('a_active');
					}
					if(personLiveCondition.dangerBuilding == '1'){
						$("#dangerBuilding").addClass('a_active');
					}
				} 
				
				//致贫原因分析
				var povertyReason = datatotal.povertyReason;
				drawPovertyReason(povertyReason);
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
	createFamilyMemberTable();
	
	$("#first-btn").click(function(){
		$(".tab_btn>a").removeClass("active-btn");
		$(this).addClass("active-btn");
		$(".table-container-one").css("display","block");
		$(".table-container-two").css("display","none");
		$(".table-container-three").css("display","none");
	});
	$("#two-btn").click(function(){
		$(".tab_btn>a").removeClass("active-btn");
		$(this).addClass("active-btn");
		$(".table-container-one").css("display","none");
		$(".table-container-two").css("display","block");
		$(".table-container-three").css("display","none");
	});
	$("#three-btn").click(function(){
		$(".tab_btn>a").removeClass("active-btn");
		$(this).addClass("active-btn");
		$(".table-container-one").css("display","none");
		$(".table-container-two").css("display","none");
		$(".table-container-three").css("display","block");
	});
	$("#table-one-add-btn").click(function(){
		var trNum = $("table.table-one>tbody>tr").length;
		var trHtml = '<tr><td><input type="checkbox" id="checkbox-'
						+ trNum +'"/></td><td>'
						+ parseInt(trNum+1) +'</td><td><input id="realName-'
						+ trNum +'" type="text" value=""/></td><td><select id="sex-'
						+ trNum +'">'+ sexOptions +'</select></td><td><input id="idcardNo-'
						+ trNum +'" type="text" value="" /></td><td><select id="relation-'
						+ trNum +'">'+ relationOptions +'</select></td><td><select id="nation-'
						+ trNum +'">'+ nationOptions +'</select></td><td><select id="politics-'
						+ trNum +'">'+ politicsOptions +'</select></td><td><select id="education-'
						+ trNum +'">'+ eduOptions +'</select></td><td><select id="laborSkill-'
						+ trNum +'">'+ laborSkillOptions +'</select></td><td><select id="workStatus-'
						+ trNum +'">'+ workStatusOptions +'</select></td><td><select id="workTime-'
						+ trNum +'">'+ workTimeOptions +'</select></td><td><select id="activeServicemen-'
						+ trNum +'">'+ isOptions +'</select></td><td><select id="medicalInsurance-'
						+ trNum +'">'+ isOptions +'</select></td><td><select id="studentStatus-'
						+ trNum +'">'+ studentStatusOptions +'</select></td><td><input id="studySite-'
						+ trNum +'" type="text" value="" /></td><td><select id="healthCondition-'
						+ trNum +'">'+ healthConditionOptions +'</select></td><td><select id="commercialInsurance-'
						+ trNum +'">'+ isOptions +'</select></td><td><select id="residentsInsurance-'
						+ trNum +'">'+ isOptions +'</select></td><td><select id="enjoyLowPolicy-'
						+ trNum +'">'+ isOptions +'</select></td><td><button onclick="addAndSure(event)">确认</button><button onclick="notAddAnddelete(event)">删除</button></td></tr>';
		$("table.table-one>tbody").append(trHtml);		
	});
	$("#table-one-del-btn").click(function(){
		var deleteRecordIds='';
		$("table.table-one>tbody>tr").each(function(index,item){						
			if($(item).children().find("input[type=checkbox]").prop('checked')){
				deleteRecordIds += $(item).children().find("input[type=checkbox]").attr("data-id") + ',';
			}
		});
		deleteRecords(deleteRecordIds);
	});
	
	createHelpPersonTable();
	
	$("#table-two-add-btn").click(function(){
		var trNum = $("table.table-two>tbody>tr").length;
		var trHtml = '<tr><td><input type="checkbox" id="helpPerson-checkbox-'
				    					+ trNum +'" data-id=""/></td><td>'
				    					+ parseInt(trNum+1) +'</td><td><input id="helpPerson-realName-'
				    					+ trNum +'" type="text" value=""/></td><td><select id="helpPerson-sex-'
				    					+ trNum +'">'+ sexHelpPersonOptions +'</select></td><td><select id="helpPerson-politics-'
				    					+ trNum +'">' + politicsHelpPersonOptions + '</select></td><td><input id="helpPerson-companyName-'
				    					+ trNum +'" type="text" value=""/></td><td><input placeholder="xxxx-xx-xx" id="helpPerson-startTime-'
				    					+ trNum +'" type="text" value=""/></td><td><input placeholder="xxxx-xx-xx" id="helpPerson-endTime-'
				    					+ trNum +'" type="text" value=""/></td><td><select id="helpPerson-affiliation-'
				    					+ trNum +'">'+ affiliationHelpPersonOptions +'</select></td><td><input id="helpPerson-companyAddress-'
				    					+ trNum +'" type="text" value=""/></td><td><input id="helpPerson-telephoneNumber-'
				    					+ trNum +'" type="text" value=""/></td><td><button onclick="helpPersonAddRecord(event)">确认</button><button onclick="helpPersonNotAddRecord(event)">删除</button></td></tr>';
		$("table.table-two>tbody").append(trHtml);
	});
	$("#table-two-del-btn").click(function(){
		var deleteRecordIds='';
		$("table.table-two>tbody>tr").each(function(index,item){						
			if($(item).children().find("input[type=checkbox]").prop('checked')){
				deleteRecordIds += $(item).children().find("input[type=checkbox]").attr("data-id") + ',';
			}
		});
		helpPersonDeleteRecords(deleteRecordIds);
	});
	$(".table-container-one").scroll(function(){
		var offset = $(".table-container-one").scrollLeft();
		$("#table-one-add-btn").css("left",offset);
		$("#table-one-del-btn").css("left",136+offset);
	});
	
	createFilesTable(1);
    $('#upload-btn').click(function(){
        document.getElementById("load_xls").click();
    });
});
function uploadFile(){
	var myform = new FormData($("#uploadForm")[0]);
     $.ajax({
     	xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
        url: wPath.getUrl("fileUploadUploadfile"),
        type: "POST",
        data: myform,
        dataType:'JSON',
        processData : false,     
        contentType : false, 
        success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				new NoticeJs({
				    text: msg.message,
				    position: 'middleCenter',
				    animation: {
				        open: 'animated bounceIn',
				        close: 'animated bounceOut'
				    }
				}).show();
				createFilesTable(1);
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
function createHelpPersonTable(){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('helpPersonQueryInfoByFamilyId'),
		data:{familyId:familyId},
		dataType:'JSON',
		success: function(msg) {
			console.log(msg);
			if(msg.result ==  "SUCCESS"	){	
				var datatotal=msg.object;	
				//性别
				var sexArr = datatotal.sex;
				sexHelpPersonOptions = createOptions(sexArr);
				//政治面貌
				var politicsArr = datatotal.politics;
				politicsHelpPersonOptions = createOptions(politicsArr);
				//隶属关系
				var affiliationArr = datatotal.affiliation;
				affiliationHelpPersonOptions = createOptions(affiliationArr);
				var helpPersonInfoArr = datatotal.helpPersonInfo;				
				$("table.table-two>tbody").empty();
				for(var i = 0;i<helpPersonInfoArr.length;i++){
					var realName = helpPersonInfoArr[i].realName;
					if(typeof(realName) == "undefined"){
						realName='';
					}
					var companyName = helpPersonInfoArr[i].companyName;
					if(typeof(companyName) == "undefined"){
						companyName='';
					}
					var startTime = helpPersonInfoArr[i].startTime;
					if(typeof(startTime) == "undefined"){
						startTime='';
					}
					var endTime = helpPersonInfoArr[i].endTime;
					if(typeof(endTime) == "undefined"){
						endTime='';
					}
					var companyAddress = helpPersonInfoArr[i].companyAddress;
					if(typeof(companyAddress) == "undefined"){
						companyAddress='';
					}
					var telephoneNumber = helpPersonInfoArr[i].telephoneNumber;
					if(typeof(telephoneNumber) == "undefined"){
						telephoneNumber='';
					}
					var tempTrHtml = '<tr><td><input type="checkbox" id="helpPerson-checkbox-'
				    					+ i +'" data-id="'
				    					+ helpPersonInfoArr[i].id +'"/></td><td>'
				    					+ parseInt(i+1) +'</td><td><input id="helpPerson-realName-'
				    					+ i +'" type="text" value="'
				    					+ realName +'"/></td><td><select id="helpPerson-sex-'
				    					+ i +'">'+ sexHelpPersonOptions +'</select></td><td><select id="helpPerson-politics-'
				    					+ i +'">' + politicsHelpPersonOptions + '</select></td><td><input id="helpPerson-companyName-'
				    					+ i +'" type="text" value="'
				    					+ companyName +'"/></td><td><input placeholder="xxxx-xx-xx" id="helpPerson-startTime-'
				    					+ i +'" type="text" value="'
				    					+ startTime +'"/></td><td><input placeholder="xxxx-xx-xx" id="helpPerson-endTime-'
				    					+ i +'" type="text" value="'
				    					+ endTime +'"/></td><td><select id="helpPerson-affiliation-'
				    					+ i +'">'+ affiliationHelpPersonOptions +'</select></td><td><input id="helpPerson-companyAddress-'
				    					+ i +'" type="text" value="'
				    					+ companyAddress +'"/></td><td><input id="helpPerson-telephoneNumber-'
				    					+ i +'" type="text" value="'
				    					+ telephoneNumber +'"/></td><td><button onclick="helpPersonEditRecord(event)">修改</button><button onclick="helpPersonDeleteRecord(event)">删除</button></td></tr>';
				   	$("table.table-two>tbody").append(tempTrHtml);
				   var strArr = ["sex","politics","affiliation"];
					for(var j=0;j<strArr.length;j++){
						var tempStr = helpPersonInfoArr[i][strArr[j]];
						if(typeof(tempStr) != "undefined" && tempStr.length!=0){
							var tempId = "#helpPerson-"+strArr[j]+"-" + i;
							$(tempId).find('option[data-dm='+tempStr+']').prop("selected","selected");
						}
					}				
				$("table.table-two>tbody>tr>td>select").attr("disabled","disabled");
				$("table.table-two>tbody>tr>td>input[type=text]").attr("readonly","readonly");
				}
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
function helpPersonAddRecord(event){
	var trNum = $("table.table-two>tbody>tr").length-1;
	var personId = $("#helpPerson-checkbox-"+trNum).attr("data-id");
	var realName = $("#helpPerson-realName-"+trNum).val();
	var sex = $("#helpPerson-sex-"+trNum).find("option:selected").attr("data-dm");
	var politics = $("#helpPerson-politics-"+trNum).find("option:selected").attr("data-dm");
	var affiliation = $("#helpPerson-affiliation-"+trNum).find("option:selected").attr("data-dm");
	var companyName = $("#helpPerson-companyName-"+trNum).val();
	var startTime = $("#helpPerson-startTime-"+trNum).val();		
	var endTime = $("#helpPerson-endTime-"+trNum).val();				
	var companyAddress = $("#helpPerson-companyAddress-"+trNum).val();
	var telephoneNumber = $("#helpPerson-telephoneNumber-"+trNum).val();
	
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('helpPersonEdit'),
		data:{id:personId,familyId:familyId,realName:realName,sex:sex,politics:politics,
				affiliation:affiliation,companyName:companyName,xstartTime:startTime,xendTime:endTime,
				companyAddress:companyAddress,telephoneNumber:telephoneNumber},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				new NoticeJs({
				    text: msg.message,
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
        		createHelpPersonTable();
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}
function helpPersonNotAddRecord(event){
	$("table.table-two>tbody>tr:last-child").remove();
}
function helpPersonEditRecord(event){
	if($(event.target).text() == "修改"){
		$(event.target).parent().parent().find("select").removeAttr("disabled");
		$(event.target).parent().parent().find("input[type=text]").removeAttr("readonly");
		$(event.target).text("保存");
	}else{
		var trNum = parseInt($(event.target).parent().parent().find("td").eq(1).text()) - 1; 
		var personId = $("#helpPerson-checkbox-"+trNum).attr("data-id");
		var realName = $("#helpPerson-realName-"+trNum).val();
		var sex = $("#helpPerson-sex-"+trNum).find("option:selected").attr("data-dm");
		var politics = $("#helpPerson-politics-"+trNum).find("option:selected").attr("data-dm");
		var affiliation = $("#helpPerson-affiliation-"+trNum).find("option:selected").attr("data-dm");
		var companyName = $("#helpPerson-companyName-"+trNum).val();
		var startTime = $("#helpPerson-startTime-"+trNum).val();		
		var endTime = $("#helpPerson-endTime-"+trNum).val();				
		var companyAddress = $("#helpPerson-companyAddress-"+trNum).val();
		var telephoneNumber = $("#helpPerson-telephoneNumber-"+trNum).val();
		
		$.ajax({
			xhrFields: {
		       withCredentials: true
		    },
		    crossDomain: true,
			type: "post",
			url: wPath.getUrl('helpPersonEdit'),
			data:{id:personId,familyId:familyId,realName:realName,sex:sex,politics:politics,
					affiliation:affiliation,companyName:companyName,xstartTime:startTime,xendTime:endTime,
					companyAddress:companyAddress,telephoneNumber:telephoneNumber},
			dataType:'JSON',
			success: function(msg) {
				if(msg.result == "SUCCESS"){
					new NoticeJs({
					    text: msg.message,
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
	        		createHelpPersonTable();
	        },
	        //调用出错执行的函数
	        error: function (e) {
	            //请求出错处理
	        }
		});
	}
}
function helpPersonDeleteRecord(event){
	var trNum = parseInt($(event.target).parent().parent().find("td").eq(1).text()) - 1; 
	var personId = $("#helpPerson-checkbox-"+trNum).attr("data-id");
	helpPersonDeleteRecords(personId);
}

function helpPersonDeleteRecords(str){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('helpPersonDelete'),
		data:{ids:str},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				new NoticeJs({
				    text: msg.message,
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
        		createHelpPersonTable();
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}

function notAddAnddelete(event){
	$("table.table-one>tbody>tr:last-child").remove();
}
function addAndSure(event){
	var trNum = $("table.table-one>tbody>tr").length-1;
	var realName = $("#realName-"+trNum).val();
	var sex = $("#sex-"+trNum).find("option:selected").attr("data-dm");
	var idcardNo = $("#idcardNo-"+trNum).val();
	var relation = $("#relation-"+trNum).find("option:selected").attr("data-dm");
	var nation = $("#nation-"+trNum).find("option:selected").attr("data-dm");
	var politics = $("#politics-"+trNum).find("option:selected").attr("data-dm");
	var education = $("#education-"+trNum).find("option:selected").attr("data-dm");
	var laborSkill = $("#laborSkill-"+trNum).find("option:selected").attr("data-dm");
	var workStatus = $("#workStatus-"+trNum).find("option:selected").attr("data-dm");
	var workTime = $("#workTime-"+trNum).find("option:selected").attr("data-dm");
	var workTime = $("#workTime-"+trNum).find("option:selected").attr("data-dm");
	var activeServicemen = $("#activeServicemen-"+trNum).find("option:selected").attr("data-dm");
	var studentStatus = $("#studentStatus-"+trNum).find("option:selected").attr("data-dm");
	var commercialInsurance = $("#commercialInsurance-"+trNum).find("option:selected").attr("data-dm");
	var residentsInsurance = $("#residentsInsurance-"+trNum).find("option:selected").attr("data-dm");
	var medicalInsurance = $("#medicalInsurance-"+trNum).find("option:selected").attr("data-dm");
	var studySite = $("#studySite-"+trNum).val();
	var enjoyLowPolicy = $("#enjoyLowPolicy-"+trNum).find("option:selected").attr("data-dm");
	var healthCondition = $("#healthCondition-"+trNum).find("option:selected").attr("data-dm");
	
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familymemberAdd'),
		data:{familyId:familyId,realName:realName,sex:sex,idcardNo:idcardNo,relation:relation,nation:nation,
				politics:politics,education:education,laborSkill:laborSkill,workStatus:workStatus,workTime:workTime,
				activeServicemen:activeServicemen,studentStatus:studentStatus,commercialInsurance:commercialInsurance,
				residentsInsurance:residentsInsurance,medicalInsurance:medicalInsurance,studySite:studySite,
				enjoyLowPolicy:enjoyLowPolicy,healthCondition:healthCondition},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				new NoticeJs({
				    text: msg.message,
				    position: 'middleCenter',
				    animation: {
				        open: 'animated bounceIn',
				        close: 'animated bounceOut'
				    }
				}).show();
				createFamilyMemberTable();
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

function createFamilyMemberTable(){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type:"post",
		url:wPath.getUrl('familymemberQqueryFamilyMemberByFamilyId'),
		data:{familyId:familyId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				//是否
				var isArr = datatotal.is;
				isOptions = createOptions(isArr);	
				//性别
				var sexArr = datatotal.sex;
				sexOptions = createOptions(sexArr);				
				//与户主关系
				var relationArr = datatotal.relation;
				relationOptions = createOptions(relationArr);				
				//民族				
				var nationArr = datatotal.nation;
				nationOptions = createOptions(nationArr);			
				//政治面貌
				var politicsArr = datatotal.politics;
				politicsOptions = createOptions(politicsArr);				
				//文化程度
				var eduArr = datatotal.edu;
				eduOptions = createOptions(eduArr);
				//劳动技能
				var laborSkillArr = datatotal.laborSkill;
				laborSkillOptions = createOptions(laborSkillArr);
				//务工情况
				var workStatusArr = datatotal.workStatus;
				workStatusOptions = createOptions(workStatusArr);
				//务工时间
				var workTimeArr = datatotal.workTime;
				workTimeOptions = createOptions(workTimeArr);
				//在校生情况
				var studentStatusArr = datatotal.studentStatus;
				studentStatusOptions = createOptions(studentStatusArr);
				//健康状况
				var healthConditionArr = datatotal.healthCondition;
				healthConditionOptions = createOptions(healthConditionArr);
				
				var familyMemberInfoArr = datatotal.familyMemberInfo;	
				$("table.table-one>tbody").empty();
				for(var i =0;i<familyMemberInfoArr.length;i++){
					var trHtml = '<tr><td><input type="checkbox" id="checkbox-'
									+ i +'" data-id="'
									+ familyMemberInfoArr[i].id +'"/></td><td>'
									+ parseInt(i+1) +'</td><td><input id="realName-'
									+ i +'" type="text" value="'
									+ familyMemberInfoArr[i].realName +'"/></td><td><select id="sex-'
									+ i +'">'+ sexOptions +'</select></td><td><input id="idcardNo-'
									+ i +'" type="text" value="'
									+ familyMemberInfoArr[i].idcardNo +'" /></td><td><select id="relation-'
									+ i +'">'+ relationOptions +'</select></td><td><select id="nation-'
									+ i +'">'+ nationOptions +'</select></td><td><select id="politics-'
									+ i +'">'+ politicsOptions +'</select></td><td><select id="education-'
									+ i +'">'+ eduOptions +'</select></td><td><select id="laborSkill-'
									+ i +'">'+ laborSkillOptions +'</select></td><td><select id="workStatus-'
									+ i +'">'+ workStatusOptions +'</select></td><td><select id="workTime-'
									+ i +'">'+ workTimeOptions +'</select></td><td><select id="activeServicemen-'
									+ i +'">'+ isOptions +'</select></td><td><select id="medicalInsurance-'
									+ i +'">'+ isOptions +'</select></td><td><select id="studentStatus-'
									+ i +'">'+ studentStatusOptions +'</select></td><td><input id="studySite-'
									+ i +'" type="text" value="'
									+ familyMemberInfoArr[i].studySite +'" /></td><td><select id="healthCondition-'
									+ i +'">'+ healthConditionOptions +'</select></td><td><select id="commercialInsurance-'
									+ i +'">'+ isOptions +'</select></td><td><select id="residentsInsurance-'
									+ i +'">'+ isOptions +'</select></td><td><select id="enjoyLowPolicy-'
									+ i +'">'+ isOptions +'</select></td><td><button onclick="editRecord(event)">修改</button><button onclick="deleteRecord(event)">删除</button></td></tr>';
					$("table.table-one>tbody").append(trHtml);										
					var strArr = ["sex","relation","nation","politics","education",
									"laborSkill","workStatus","workTime","activeServicemen","medicalInsurance",
									"studentStatus","healthCondition","commercialInsurance","residentsInsurance","enjoyLowPolicy"];
					for(var j=0;j<strArr.length;j++){
						var tempStr = familyMemberInfoArr[i][strArr[j]];
						if(typeof(tempStr) != "undefined" && tempStr.length!=0){
							var tempId = "#"+strArr[j]+"-" + i;
							$(tempId).find('option[data-dm='+tempStr+']').prop("selected","selected");
						}
					}
				}
				$("table.table-one>tbody>tr>td>select").attr("disabled","disabled");
				$("table.table-one>tbody>tr>td>input[type=text]").attr("readonly","readonly");
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
function editRecord(event){
	if($(event.target).text() == "修改"){
		$(event.target).parent().parent().find("select").removeAttr("disabled");
		$(event.target).parent().parent().find("input[type=text]").removeAttr("readonly");
		$(event.target).text("保存");
	}else{
		var trNum = parseInt($(event.target).parent().parent().find("td").eq(1).text()) - 1; 
		var personId = $("#checkbox-"+trNum).attr("data-id");
		var realName = $("#realName-"+trNum).val();
		var sex = $("#sex-"+trNum).find("option:selected").attr("data-dm");
		var idcardNo = $("#idcardNo-"+trNum).val();
		var relation = $("#relation-"+trNum).find("option:selected").attr("data-dm");
		var nation = $("#nation-"+trNum).find("option:selected").attr("data-dm");
		var politics = $("#politics-"+trNum).find("option:selected").attr("data-dm");
		var education = $("#education-"+trNum).find("option:selected").attr("data-dm");
		var laborSkill = $("#laborSkill-"+trNum).find("option:selected").attr("data-dm");
		var workStatus = $("#workStatus-"+trNum).find("option:selected").attr("data-dm");
		var workTime = $("#workTime-"+trNum).find("option:selected").attr("data-dm");
		var workTime = $("#workTime-"+trNum).find("option:selected").attr("data-dm");
		var activeServicemen = $("#activeServicemen-"+trNum).find("option:selected").attr("data-dm");
		var studentStatus = $("#studentStatus-"+trNum).find("option:selected").attr("data-dm");
		var commercialInsurance = $("#commercialInsurance-"+trNum).find("option:selected").attr("data-dm");
		var residentsInsurance = $("#residentsInsurance-"+trNum).find("option:selected").attr("data-dm");
		var medicalInsurance = $("#medicalInsurance-"+trNum).find("option:selected").attr("data-dm");
		var studySite = $("#studySite-"+trNum).val();
		var enjoyLowPolicy = $("#enjoyLowPolicy-"+trNum).find("option:selected").attr("data-dm");
		var healthCondition = $("#healthCondition-"+trNum).find("option:selected").attr("data-dm");
		
		$.ajax({
			xhrFields: {
		       withCredentials: true
		    },
		    crossDomain: true,
			type: "post",
			url: wPath.getUrl('familymemberEdit'),
			data:{id:personId,familyId:familyId,realName:realName,sex:sex,idcardNo:idcardNo,relation:relation,nation:nation,
					politics:politics,education:education,laborSkill:laborSkill,workStatus:workStatus,workTime:workTime,
					activeServicemen:activeServicemen,studentStatus:studentStatus,commercialInsurance:commercialInsurance,
					residentsInsurance:residentsInsurance,medicalInsurance:medicalInsurance,studySite:studySite,
					enjoyLowPolicy:enjoyLowPolicy,healthCondition:healthCondition},
			dataType:'JSON',
			success: function(msg) {
				if(msg.result == "SUCCESS"){
					new NoticeJs({
					    text: msg.message,
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
	        		createFamilyMemberTable();
	        },
	        //调用出错执行的函数
	        error: function (e) {
	            //请求出错处理
	        }
		});
	}
}
function deleteRecord(event){
	var trNum = parseInt($(event.target).parent().parent().find("td").eq(1).text()) - 1; 
	var personId = $("#checkbox-"+trNum).attr("data-id");
	deleteRecords(personId);
}
function deleteRecords(str){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('familymemberDeleteByIds'),
		data:{ids:str},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				new NoticeJs({
				    text: msg.message,
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
        		createFamilyMemberTable();
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}
function createOptions(dataArr){
	var dataOptions='<option data-dm="">未选择</option>';
	for(var i=0;i<dataArr.subDmList.length;i++){
		dataOptions += '<option data-dmValue="'
						+ dataArr.subDmList[i].dmValue +'" data-dm="'
						+ dataArr.subDmList[i].dm +'" data-dmCode="'
						+ dataArr.dmCode +'" data-dmName="'
						+ dataArr.dmName +'">'
						+ dataArr.subDmList[i].dmValue +'</option>';
	}
	return dataOptions;
}
function createMap(personLocation){
	cityName = personLocation.city;
	var locationStr = personLocation.city + personLocation.county + personLocation.town + personLocation.village;
	 // 创建地图实例
	map = new BMap.Map("map_div");         
	 //创建信息窗口对象	
	 var opts = {
	  width : 240,     // 信息窗口宽度
	  height: 100,     // 信息窗口高度
	  title : locationStr , // 信息窗口标题
	  enableMessage:true//设置允许信息窗发送短息
	};
	var infoWindow = new BMap.InfoWindow('<p>距离村主干道路：' + personLocation.distance + '公里</p><p style="margin-top:5px;">入户路类型：'+personLocation.entryRoadType+ '</p>', opts); 
	// 创建地址解析器实例
	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(locationStr, function(point){
		if (point) {
			point = point;
			map.centerAndZoom(point, 10);
			marker = new BMap.Marker(point); 
			map.addOverlay(marker);
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画								
			marker.addEventListener("click", function(){          
				map.openInfoWindow(infoWindow,point); //开启信息窗口
			});
		}else{
			new NoticeJs({
			    text: '地址不存在',
			    position: 'middleCenter',
			    animation: {
			        open: 'animated bounceIn',
			        close: 'animated bounceOut'
			    }
			}).show();
		}
	}, personLocation.city);	
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	getBoundary(cityName);				 	
}
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

function createEchartsPie(dataArr){
	myChart = echarts.init(document.getElementById('echarts_pie'));
    // 指定图表的配置项和数据
    var option = {  
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    series : [
	        {
	            name: '接受帮扶项目、措施',
	            type: 'pie',
	            radius : '55%',
	            center: ['50%', '50%'],
	            data:dataArr,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawIncome(strArr,numArr){
	var rectData = [{x:0,y:0,width:200,height:80},
					{x:0,y:80,width:100,height:80},
					{x:100,y:80,width:100,height:80},
					{x:200,y:0,width:90,height:50},
					{x:200,y:50,width:90,height:60},
					{x:200,y:110,width:90,height:50}];
	var colorArr = ["rgba(139,205,255,1.0)","rgba(113,255,200,1.0)","rgba(0,207,255,1.0)",
					"rgba(115,77,228,1.0)","rgba(255,202,203,1.0)","rgba(255,144,255,1.0)"];
//	var strArr = ["工资性收入","低保金","临时救助","抚恤金","其他收入","走访慰问金"];
//	var numArr = ["1000","1000","1000","1000","1000","1000"]
	var canvas  = document.getElementById("income_canvas");
	var ctx = canvas.getContext("2d");
	for(var i =0;i<rectData.length;i++){
		ctx.beginPath();
		ctx.fillStyle = colorArr[i];
		ctx.rect(rectData[i].x,rectData[i].y,rectData[i].width,rectData[i].height);
		ctx.fill();
		
		ctx.beginPath();
		ctx.font = "normal normal 10px 方正兰亭中黑";
		ctx.textAlign = "center";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(strArr[i],rectData[i].x + rectData[i].width / 2,rectData[i].y + rectData[i].height / 2);
		ctx.fillText(numArr[i],rectData[i].x + rectData[i].width / 2,rectData[i].y + 15 + rectData[i].height / 2);
	}
}
function drawPovertyReason(povertyReason){
	var canvas = document.getElementById("povertyReason");
	var ctx = canvas.getContext("2d");
	var otherPointArr = [{x:70,y:90},{x:270,y:210}];
	var notExistPointArr = [{x:270,y:90},{x:90,y:180},{x:180,y:70},
							{x:90,y:140},{x:270,y:140},{x:180,y:180},
							{x:70,y:50},{x:270,y:35},{x:80,y:215}];
	var mainReason = povertyReason.mainReason;
	var otherReasonArr = povertyReason.otherReason;
	var notExistReasonsArr = povertyReason.notExistReasons;
	ctx.beginPath();
	ctx.font = "normal normal 38px 方正兰亭中黑";
	ctx.textAlign = "center";
	ctx.fillStyle = "#e1d588";
	ctx.fillText(mainReason,180,140);
	
	ctx.beginPath();
	ctx.font = "normal normal 22px 方正兰亭中黑";
	ctx.textAlign = "center";
	ctx.fillStyle = "#45a2ff";
	for(var i = 0;i<otherReasonArr.length;i++){
		if(otherReasonArr[i].dmValue != mainReason){
			ctx.fillText(otherReasonArr[i].dmValue,otherPointArr[i%2].x,otherPointArr[i%2].y);
		}
	}
	ctx.beginPath();
	ctx.font = "normal normal 13px 方正兰亭中黑";
	ctx.textAlign = "center";
	ctx.fillStyle = "#808080";
	var len=notExistPointArr.length<notExistReasonsArr.length?notExistPointArr.length:notExistReasonsArr.length;
	for(var i = 0;i<len;i++){
		ctx.fillText(notExistReasonsArr[i].dmValue,notExistPointArr[i].x,notExistPointArr[i].y);
	}	
}
//附件管理
function createFilesTable(pageNum){
	$("table.table-three>tbody").empty();
	$("ul.el-pager").empty();
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('fileUploadQuerySelective'),
		data:{familyId:familyId,pageNum:pageNum,pageSize:5},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){				
				var datatotal = msg.object;
				var imgHost = datatotal.imgHost;
				var pageInfo = datatotal.pageInfo;
				var pageList = pageInfo.list;
				var trsHtml = '';
				for (var i =0;i<pageList.length;i++) {
					var tr = '<tr><td data-id="'
								+ pageList[i].id +'">'
								+ parseInt(i+1) +'</td><td>'
								+ pageList[i].name +'</td><td>'
								+ change(pageList[i].size) +'</td><td>'
								+ pageList[i].type +'</td><td>'
								+ pageList[i].storeDirectory +'</td><td>'
								+ pageList[i].createTime +'</td><td><a target="_blank" href="'
								+ imgHost + pageList[i].linkUrl +'" class="green-background">下载</a><a target="_blank" href="'
								+ imgHost + pageList[i].linkUrl +'" class="blue-background">在线预览</a><a onclick="deleteFile(event);" class="red-background">删除</a></td></tr>';
					trsHtml += tr;			
				}
				$("table.table-three>tbody").append(trsHtml);
				createPages(pageInfo.pages,pageNum);
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
        		$("ul.el-pager>li").click(function(){
        			var num = parseInt($(this).text());
        			createFilesTable(num);
        		});
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}

function deleteFile(event){
	var fileId = $(event.target).parent().parent().find("td:first-child").attr("data-id");
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('fileUploadDeleteById'),
		data:{id:fileId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				new NoticeJs({
				    text: msg.message,
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
        		createFilesTable(1);
        },
        //调用出错执行的函数
        error: function (e) {
            //请求出错处理
        }
	});
}
function toFirstPage(){
	createFilesTable(1);
}
function toPrePage(){
	var index = parseInt($("ul.el-pager>li.page-active").text());
	if(index == 1){
		return false;
	}else{
		createFilesTable(parseInt(index - 1));
	}
}
function toNextPage(){
	var index = parseInt($("ul.el-pager>li.page-active").text());
	var num = parseInt($("ul.el-pager>li").length);
	if(index == num){
		return false;
	}else{
		createFilesTable(index + 1);
	}
}
function toLastPage(){
	var num = parseInt($("ul.el-pager>li").length);
	createFilesTable(num);
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
function change(limit){
   var size = "";
   if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B"
    }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
         size = (limit/1024).toFixed(2) + "KB"
    }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
         size = (limit/(1024 * 1024)).toFixed(2) + "MB"
     }else{                                            //其他转化成GB
         size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
     }
     var sizeStr = size + "";                        //转成字符串
     var index = sizeStr.indexOf(".");                    //获取小数点处的索引
     var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
     if(dou == "00"){                                //判断后两位是否为00，如果是则删除00                
         return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
     }
     return size;
}


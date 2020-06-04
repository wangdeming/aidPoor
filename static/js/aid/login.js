 $('select.drop-select').each(function(){
    new Select({
        el: this,
        className: 'select-theme-chosen'
    });
});
/*记住用户名和密码*/
$(function() {
	//检测cookie中是否保存密码
	if ($.cookie("rememberUser")) {
		$("#rememberUser").attr("checked", true);
		$("#username").val($.cookie("userName"));
		$("#userpwd").val($.cookie("passWord"));
	}	
	//进入注册页面按钮点击
	$("#goRegister").click(function(){
		$("#div1").css("display","none");
		$("#div2").css("display","block");
	});
	//返回登录页面按钮点击
	$("#backToLogin").click(function(){
		$("#div1").css("display","block");
		$("#div2").css("display","none");
	});
	//登录按钮点击
	$("#loginBtn").click(function(){
		login();
	});
	//发送短信验证码按钮点击
	$("#register_sendcode").click(function(){
		sendCode();
	});
	//图片验证码按钮点击
	$("#iconCode").click(function(){
		$("#iconCode").attr("src","http://223.84.134.45:18081/aidPoor/kaptcha.jpg");
	});
	$("#select_province + a").click(function(){
		//查询省级areaId
		queryAreaListOfProvince();
	});
	$("#select_city + a").click(function(){
		//查询市级areaId
		queryAreaListOfCity();
	});
	$("#select_county + a").click(function(){
		//查询县级areaId
		queryAreaListOfCounty();
	});
	$("#registerBtn").click(function(){
		register();
	});
});
//如果$.cookie("rememberUser")为true,即把cookie里存的userName，passWord的值赋给id是username,userpwd的input；
	
function saveUserInfo() {
	if ($("#rememberUser").prop("checked") == true) {
		var userName = $("#username").val();
		var passWord = $("#userpwd").val();
		$.cookie("rememberUser", "true", {
			expires: 7
		}); // 存储一个带7天期限的 cookie
		$.cookie("userName", userName, {
			expires: 7
		}); // 存储一个带7天期限的 cookie
		$.cookie("passWord", passWord, {
			expires: 7
		}); // 存储一个带7天期限的 cookie
	} else {
		$.cookie("rememberUser", "false", {
			expires: -1
		}); // 删除 cookie
		$.cookie("userName", '', {
			expires: -1
		});
		$.cookie("passWord", '', {
			expires: -1
		});
	}
}
//如果$("#rememberUser").prop("checked") == true，把id为username，userpwd的值赋给cookie里的userName，passWord，并设置有效期是七天

function login(){
	saveUserInfo();
	var userName = $("#username").val();
	var userPwd = $("#userpwd").val();
	var data = {loginName:userName,password:userPwd};
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('userLogin'),
		data:data,
		dataType:'JSON',
		success: function(msg) {
			if(msg.result ==  "SUCCESS"	){
				localStorage.removeItem('userobj');
                localStorage.setItem('userobj',JSON.stringify(msg.object));	
				var roleId = msg.object.roleList[0].id;
				var userId = msg.object.helpPersonId;
				var unitId = msg.object.helpUnitId;
				var userName = msg.object.loginName;
				var roleName = msg.object.roleList[0].roleName;
				localStorage.setItem("roleId",roleId);
				localStorage.setItem("userId",userId);
				localStorage.setItem("userName",userName);
				localStorage.setItem("unitId",unitId);
				localStorage.setItem("roleName",roleName);
				localStorage.setItem("password",userPwd);
				localStorage.setItem("oneOrTwo","one");
				window.location.href = "map.html";
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
function sendCode(){
	var userphone = $("#register_userphone").val();
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('userSendRegSmsCode'),
		data:{mobileNo:userphone},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				$("#register_phonecode").val(datatotal.smsCode);
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
function register(){
	var register_username = $("#register_username").val();
	var register_userpwd = $("#register_userpwd").val();
	var register_userphone = $("#register_userphone").val();
	var register_iconcode = $("#register_iconcode").val();
	var register_phonecode = $("#register_phonecode").val();
	var register_username = $("#register_username").val();
	var register_username = $("#register_username").val();
	var userphone = $("#register_userphone").val();
	var areaId;

	if($("#select_city + a").text() == "选择市"){
        new NoticeJs({
            text: "请选择市",
            position: 'middleCenter',
            animation: {
                open: 'animated bounceIn',
                close: 'animated bounceOut'
            }
        }).show();
        return;
    }
	if($("#select_province + a").text() == "选择省") {
		new NoticeJs({
			text: "请选择省",
			position: 'middleCenter',
			animation: {
				open: 'animated bounceIn',
				close: 'animated bounceOut'
			}
		}).show();
		return;
	}

	$("#select_city>option").each(function(index,item){
		if($("#select_city + a").text() == $(item).text()){
			areaId = $(item).attr("data-areaId");
		}
	});

	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('userRegister'),
		data:{loginName:register_username,
				mobileNo:register_userphone,
				password:register_userpwd,
				smsCode:register_phonecode,
				imgCode:register_iconcode,
				areaId:areaId},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				new NoticeJs({
				    text: "注册成功，请记住账号密码并登陆",
				    position: 'middleCenter',
				    animation: {
				        open: 'animated bounceIn',
				        close: 'animated bounceOut'
				    }
				}).show();
				setTimeout(function(){ 
					$("#backToLogin").trigger("click");
				}, 2000);
				
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
function queryAreaListOfProvince(){
	$.ajax({
		xhrFields: {
	       withCredentials: true
	    },
	    crossDomain: true,
		type: "post",
		url: wPath.getUrl('areaRelation/queryAreaListByParentId'),
		data:{parentId:0},
		dataType:'JSON',
		success: function(msg) {
			if(msg.result == "SUCCESS"){
				var datatotal=msg.object;
				if(datatotal.length != 0){
						$("#select_province").empty();
					}
				for(var i = 0;i<datatotal.length;i++){
					var optionHtml = '<option data-areaId="'
					+ datatotal[i].areaId +'">'
					+ datatotal[i].areaName +'</option>';
					$("#select_province").append(optionHtml);
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
function queryAreaListOfCity(){
	var areaId;
	if($("#select_province + a").text() == "选择省"){		
		new NoticeJs({
		    text: "请先选中省地区",
		    position: 'middleCenter',
		    animation: {
		        open: 'animated bounceIn',
		        close: 'animated bounceOut'
		    }
		}).show();
	}else{
		$("#select_province>option").each(function(index,item){
			if($("#select_province + a").text() == $(item).text()){
				areaId = $(item).attr("data-areaId");
			}
		});
		$.ajax({
			xhrFields: {
		       withCredentials: true
		    },
		    crossDomain: true,
			type: "post",
			url: wPath.getUrl('areaRelation/queryAreaListByParentId'),
			data:{parentId:areaId},
			dataType:'JSON',
			success: function(msg) {
				if(msg.result == "SUCCESS"){
					var datatotal=msg.object;
					if(datatotal.length != 0){
						$("#select_city").empty();
					}
					for(var i = 0;i<datatotal.length;i++){
						var optionHtml = '<option data-areaId="'
						+ datatotal[i].areaId +'">'
						+ datatotal[i].areaName +'</option>';
						$("#select_city").append(optionHtml);
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
}
function queryAreaListOfCounty(){
	var areaId;
	if($("#select_city + a").text() == "选择市"){		
		new NoticeJs({
		    text: "请先选中市地区",
		    position: 'middleCenter',
		    animation: {
		        open: 'animated bounceIn',
		        close: 'animated bounceOut'
		    }
		}).show();
	}else{
		$("#select_city>option").each(function(index,item){
			if($("#select_city + a").text() == $(item).text()){
				areaId = $(item).attr("data-areaId");
			}
		});
		$.ajax({
			xhrFields: {
		       withCredentials: true
		    },
		    crossDomain: true,
			type: "post",
			url: wPath.getUrl('areaRelation/queryAreaListByParentId'),
			data:{parentId:areaId},
			dataType:'JSON',
			success: function(msg) {
				if(msg.result == "SUCCESS"){
					var datatotal=msg.object;
					if(datatotal.length != 0){
						$("#select_county").empty();
					}					
					for(var i = 0;i<datatotal.length;i++){
						var optionHtml = '<option data-areaId="'
						+ datatotal[i].areaId +'">'
						+ datatotal[i].areaName +'</option>';						
						$("#select_county").append(optionHtml);
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
}

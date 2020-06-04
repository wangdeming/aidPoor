//$(function(){
//	$.ajaxSetup({
//      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//      headers: { 'x-requested-with': 'XMLHttpRequest' },
//      xhrFields: {
//      	withCredentials: true
//      },
//      crossDomain: true,
//      complete: function (XMLHttpRequest, textStatus) {
//          if (XMLHttpRequest.getResponseHeader("userStatus") == "logintimeout") {
//              parent.window.location.replace(XMLHttpRequest.getResponseHeader("redirectUrl"));
//          }
//      }
//  });
//});
$(function(){
    $.ajax( {
        type: "POST",
        url: wPath.getUrl('checkLoginSession'),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: "json",
        success: function( data ) {
            var localUrl = window.location.href;
            if (data.object.sessionTimeout) {
                if (localUrl.indexOf("login") < 0) {
                    location.href = "../aid/login.html";
                }
            } else {
                if (localUrl.indexOf("login") > -1) {
                    location.href = "../aid/map.html";
                }
            }
        }
    } );
});

// 接口配置
var wPath = {
    protocol: 'http://',
	// host: 'localhost:8088',
	host: '172.16.0.200:8050/aidPoor',
//     host: '223.84.134.45:18081',
//     ctxPath : "/taishi",
    ctxPath : "",
    getPrefix: function (projectName) {
        // return this.protocol + this.host + '/' + 'aidPoor';
        return this.protocol + this.host;
    },
    getUrl: function (type) {
        return this.getPrefix() + (this.uri[type] || '');
        //return 'http://localhost:8080' + (this.uri[type] || '');
    },
    uri: {
        // post
        // 1.0 校验登录会话是否超时
        'checkLoginSession': '/user/checkLoginSession',
        // 1.1 首页-登录
        'userLogin': '/user/login',
        // 1.2	首页-退出登录
        'userLogout': '/user/logout',
        // 1.3 首页-发送短信验证码
        'userSendRegSmsCode': '/user/sendRegSmsCode',
        // 1.4 首页-图形验证码
        'kaptcha': '/kaptcha.jpg',
        // 1.5  首页-用户注册
        'userRegister': '/user/register',
        // 1.6  分页查询用户列表
        'userQueryUserInfoPage': '/user/queryUserInfoPage',
        // 1.7 基础设置-查询用户详细信息
        'userQueryUserInfoDetail': '/user/queryUserInfoDetail',
        // 1.8 基础设置-新增用户信息
        'userAddUserInfo': '/user/addUserInfo',
        // 1.9 基础设置-用户列表-编辑用户信息
        'userEditUserInfo': '/user/editUserInfo',
        //1.10 基础设置-用户列表-批量删除
        'userDeleteUserInfo': '/user/deleteUserInfo',
        // 获取session中登录用户信息。
        'user/sessionForUserInfo':'/user/sessionForUserInfo',

        //----------------------GIS页面---------------------------
        //1.11 基础设置-根据组织编号查询贫困户列表
        'familyCondition/queryFamilyListByOrganizationNo': '/familyCondition/queryFamilyListByOrganizationNo',
        //2.1 查询省市区
        'areaRelation/queryAreaTree': '/areaRelation/queryAreaTree',
        //2.2 根据父节点查询子区域列表
        'areaRelation/queryAreaListByParentId': '/areaRelation/queryAreaListByParentId',
        //2.3 搜索-根据姓名查询户主信息
        'familyMember/queryFamilyMemberByName': '/familymember/queryFamilyMemberByName',
        //2.4 根据贫困户编号查询贫困户信息
        'familyCondition/queryFamilyInfoByFamilyId': '/familycondition/queryFamilyInfoByFamilyId',

        //----------------------贫困县管理页面---------------------------
        //1.2查询全市所有县及其地区编号
        'countyCondition/queryAreaById': '/countyCondition/queryAreaById',
        //1.3查询一个市有多少个贫困县
        'countyCondition/povertyCountyNum': '/countyCondition/povertyCountyNum',
        // 1.4查询全市贫困、脱贫、预脱贫户数及人口总数情况
        'countyCondition/findCountyCondition': '/countyCondition/findCountyCondition',
        // 1.5全市贫困县信息
        'countyCondition/queryAllCountyCondition': '/countyCondition/queryAllCountyCondition',
        // 1.6查询一个县贫困信息
        'countyCondition/queryCountyCondition': '/countyCondition/queryCountyCondition',
        //1.7各县贫困户及人口总数及各镇贫困户统计图
        'countyCondition/findCountyConditionByCountyId': '/countyCondition/findCountyConditionByCountyId',
        // 1.8主要致贫原因
        'countyCondition/mainPovertyReason': '/countyCondition/mainPovertyReason',
        // 1.9人均收入
        'countyCondition/queryAvgIncome': '/countyCondition/queryAvgIncome',
        // 1.10县土地资源
        'countyCondition/countyLandResource': '/countyCondition/countyLandResource',
        // 1.11基础设施
        'countyCondition/queryCountyLive': '/countyCondition/queryCountyLive',
        //1.12帮扶措施
        'countyCondition/helpPlanByCountyId': '/countyCondition/helpPlanByCountyId',
        // 1.13按脱贫标志查询
        'countyCondition/povertyFlagChoose': '/countyCondition/povertyFlagChoose',
        // 1.14按搜索框搜索条件进行查询
        'countyCondition/search': '/countyCondition/search',
        //1.15下载导入模板
        'countyCondition/downloadExcel': '/countyCondition/downloadExcel',
        // 1.21贫困县--导出数据
        'countyCondition/export': '/countyCondition/export',
        //----------------------帮扶责任人，帮扶单位---------------------------
        // 1.1帮扶责任人查询
        'helpPerson/query': '/helpperson/page',
        // 1.2删除帮扶责任人
        'helpPerson/delete': '/helpPerson/delete',
        // 1.1帮扶单位查询
        'helpUnit/query': '/helpunit/page',
        // 1.2帮扶责任人查询
        'helpUnit/update': '/helpUnit/update',
        // 1.5查询单位隶属关系
        'helpUnit/affiliation': '/helpUnit/affiliation',
        // 1.6新建帮扶单位
        'helpUnit/insert': '/helpUnit/insert',
        // 1.7帮扶措施项目类型查询
        'helpPlan/projectCategory': '/helpPlan/projectCategory',
        // 1.8帮扶措施查询列表显示
        'helpPlan/query': '/helpPlan/query',
        //1.9导出帮扶措施
        'helpPlan/export': '/helpPlan/export',
        // 1.5贫困村联想查询
        'helpunit/listvillage':'/helpunit/listvillage',
        // 1.6帮扶单位编辑
        'helpunit/edit':'/helpunit/edit',
        // 1.4帮扶单位显示
        'helpunit/toedit':'/helpunit/toedit',
        // 1.4帮扶责任人编辑
        'helpperson/edit':'/helpperson/edit',
        // 1.4帮扶责任人显示
        'helpperson/toedit':'/helpperson/toedit',
        // 1.4帮扶结对查询列表
        'helpPlan/page':'/helpPlan/page',
        // 3.2帮扶结对前置信息展示
        'helpPlan/getinfo':'/helpPlan/getinfo',
        // 3.3帮扶责任人和贫困户结对
        'helpperson/pair':'/helpPlan/pair',
        // 结束帮扶结对
        'helpperson/end':'/helpPlan/end',
        // 修改密码或重置密码
        'user/edituserpassword':'/user/edituserpassword',


        //----------------------用户管理---------------------------
        // 1.6分页查询用户列表
        'user/queryUserInfoPage': '/user/queryUserInfoPage',
        // 1.7基础设置-查询用户详细信息
        'user/queryUserInfoDetail': '/user/queryUserInfoDetail',
        // 1.8基础设置-新增用户信息
        'user/addUserInfo': '/user/addUserInfo',
        // 1.4查询省市区
        'user/editUserInfo': '/user/editUserInfo',
        // 1.5查询单位隶属关系
        'user/deleteUserInfo': '/user/deleteUserInfo',
        // 4.2根据代码标识查询代码
        'dm/getdm': '/dm/getdm',

        // 2.5精准扶贫大屏展示
        'index': '/index',
        //----------------------贫困户管理页面接口---------------------------
        //1.1 贫困户管理--图表接口
        'familyconditionQueryAllInfoByFamilyId': '/familycondition/queryAllInfoByFamilyId',
        //1.2贫困户管理--家庭成员列表
        'familymemberQqueryFamilyMemberByFamilyId': '/familymember/queryFamilyMemberByFamilyId',
        //1.3贫困户管理--删除操作
        'familymemberDeleteByIds': '/familymember/deleteByIds',
        //1.4贫困户管理--增加记录行
        'familymemberAdd': '/familymember/add',
        //1.5贫困户管理--修改记录行
        'familymemberEdit': '/familymember/edit',
        //1.6贫困户管理--帮扶责任人列表
        'helpPersonQueryInfoByFamilyId': '/helpperson/queryInfoByFamilyId',
        //1.7贫困户管理--删除帮扶责任人
        'helpPersonDelete': '/helpPerson/delete',
        //1.8贫困户管理--编辑帮扶责任人(修改和增加记录行,id存在为修改，id不存在为增加记录行)
        'helpPersonEdit': '/helpPerson/edit',
        //1.9贫困户管理--附件信息列表
        'fileUploadQuerySelective': '/fileUpload/querySelective',
        //2.0贫困户管理--删除附件
        'fileUploadDeleteById': '/fileUpload/deleteById',
        //2.1贫困户管理--上传附件
        'fileUploadUploadfile': '/fileUpload/uploadfile',
        //2.2贫困户管理--贫困户列表
        'familyList': '/familycondition/page',
        //2.3贫困户和贫困人统计
        'familyandmembercount': '/familycondition/familyandmembercount',

        //----------------------贫困村相关页面接口---------------------------
        //地区树结构
        'queryAreaTree': '/areaRelation/queryAreaTree',
        //1.1贫困村管理-贫困村详细信息
        'queryVillageInfoDetailByVillageId': '/villagecondition/queryVillageInfoDetailByVillageId',
        //1.2贫困村管理-贫困户致贫原因统计
        'queryVillageFamilyPovertyReasonStatistics': '/villagecondition/queryVillageFamilyPovertyReasonStatistics',

        //----------------------贫困村页面---------------------------
        //贫困村-根据镇编号统计贫困户
        'villageconditionQueryFamilyStatisticsByCountyAreaId': '/villagecondition/queryFamilyStatisticsByCountyAreaId',
        //贫困村-根据镇编号分页查询贫困村列表
        'villageconditionQueryVillageInfoPage': '/villagecondition/queryVillageInfoPage',
        //贫困村-编辑贫困村-根据贫困村编号查询贫困村详细信息
        'villageconditionQueryVillageInfoDetailByVillageId': '/villagecondition/queryVillageInfoDetailByVillageId',
        //贫困村-编辑贫困村-修改贫困村信息
        'villageconditionUpdateVillageInfo': '/villagecondition/updateVillageInfo',
        //1.3贫困村管理-生活条件统计
        'queryVillageLiveStatistics': '/villagecondition/queryVillageLiveStatistics',
        //1.4贫困村管理-帮扶计划统计
        'queryVillageHelpPlanStatistics': '/villagecondition/queryVillageHelpPlanStatistics',
        //1.5贫困村管理-结构分析统计
        'queryVillageFamilyAttributeStatistics': '/villagecondition/queryVillageFamilyAttributeStatistics',
        //根据代码标识查询代码
        'dmGetdm': '/dm/getdm',
        //新建贫困户-新增第一步
        'familyconditionInsert1': '/familycondition/insert1',
        //新建贫困户-新增第二步
        'familyconditionInsert2': '/familycondition/insert2',
        //新建贫困户-新增第三步
        'familyconditionInsert3': '/familycondition/insert3',
        //编辑页贫困户相关信息查询
        'familyconditionSelect': '/familycondition/select',
        //修改第一步
        'familyconditionUpdate1': '/familycondition/update1',
        //修改第二步
        'familyconditionUpdate2': '/familycondition/update2',
        //修改第三步
        'familyconditionUpdate3': '/familycondition/update3',
        //删除贫困户
        'familyconditionDelete': '/familycondition/delete',
        //查询帮扶责任人列表
        'familyconditionListhelpperson':'/familycondition/listhelpperson',

     //-----------------------走访记录---------------------------------
     //走访记录分页查询
     'visitRecordPage':'/visitrecord/page',
     //新增或编辑走访记录
     'addOrEditMoveRecord':'/visitrecord/edit',
     //删除走访记录
     'deleteMoveRecord':'/visitrecord/delete',
     //获取基本信息
     'basicinfo':'/visitrecord/basicinfo',
	 // 获取省、市、县、乡镇
	 'areaRelation/listarearelation':'/areaRelation/listarearelation',
    },
};
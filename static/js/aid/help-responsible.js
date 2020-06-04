var laypage='';
layui.use(['layer','laypage'], function(){
    var layer = layui.layer;
    laypage = layui.laypage;
});
if(userobj.roleList[0].id=='1' || userobj.roleList[0].id=='2'){
    $(".add").show();
}
function search() {


    getList(1,$('.pslider-active').attr('data-id'),$('.pslider-active').parents('li').length+1);
}
function editpage(id){
    var areaId=g_areaId;
    var areaType=g_areaType;

    if(userobj.roleList[0].id=='1'){
        var areaId=$('.pslider-active').attr('data-id');
        var areaType=($('.pslider-active').parents('li').length+1);
    }
    var tit=id?'编辑':'新增';

    layer.open({
        type: 2,
        title: tit+'帮扶责任人',
        anim: 2,
        closeBtn: 1,
        shadeClose: true,
        area: ['720px', '700px'],
        content:"help-addresponsible.html?id="+id+'&areaId='+areaId+'&areaType='+areaType+'&helpUnitId='+$("#helpUnitId").val()+'&helpUnitName='+getunitname(),
    });
}
function getunitname(){
    return $("#helpUnitId").find("option:selected").text();
}
$("#helpUnitId").change(function () {
    getList(1,$('.pslider-active').attr('data-id'),$('.pslider-active').parents('li').length+1);
});
function getList(pageNum,areaId,areaType){
    if(!areaId){
        areaId=g_areaId;
    }
    if(areaType==1){
        areaType=g_areaType;
    }
    var pageSize=10;
    $("ul.el-pager").empty();
    iajax(
        wPath.getUrl('helpPerson/query'),
        {pageNumber:pageNum,pageSize:pageSize,areaType:areaType,areaId:areaId,name:$("#key").val(),helpUnitId:$("#helpUnitId").val()},
        function(msg){
            $("#nondiv").hide();$(".tdata").show();$("#page").show();
            if(msg.object.total<1){
                $("#nondiv").show();$(".tdata").hide();$("#page").hide();
                return;
            }
            var data=msg.object.list;
            $("table.tdata>tbody").empty();
            if((userobj.roleList[0].id=='1'||userobj.roleList[0].id=='2') && $('.tdata thead tr th').last().text()!='操作') {
                $("table.tdata>thead tr").append('<th >操作</th>');
            }
            for(var i = 0;i<data.length;i++){
                var prohtml='';
                if(userobj.roleList[0].id=='1'||userobj.roleList[0].id=='2'){
                    prohtml='<td><button onclick="resetpass(\''+data[i].userId+'\')">重置密码</button><button onclick="editpage(\''+data[i].id+'\')">编辑</button></td>';
                }
                console.info(prohtml)
                var tempTrHtml = '<tr>' +
                    '<td>'+ (parseInt(i+1)+pageSize*(pageNum-1)) +'</td>' +
                    '<td>'+getfstr(data[i].loginName)+'</td>' +
                    '<td>'+getfstr(data[i].name)+'</td>' +
                    '<td>'+getfstr(data[i].sex)+'</td>' +
                    '<td>'+getfstr(data[i].manager)+'</td>' +
                    '<td>'+getfstr(data[i].politics)+'</td>' +
                    '<td>'+getfstr(data[i].telephoneNumber)+'</td>' +
                    '<td>'+getfstr(data[i].email)+'</td>' +
                    '<td>'+getfstr(data[i].createDatetime)+'</td>' +
                    prohtml+
                    '</tr>';
                $("table.tdata>tbody").append(tempTrHtml);
            }


            laypage.render({
                elem: 'page'
                ,count: msg.object.total
                ,curr: pageNum
                ,limit:pageSize
                ,jump: function(pobj, first){
                    if(!first){
                        getList(pobj.curr,areaId,areaType);
                    }
                }
            });
        }
    );
}
function  resetpass(userId) {
    layer.confirm('是否要把密码重置为123456？', {
        btn : [ '确定', '取消' ]
    }, function(index) {
        iajax(
            wPath.getUrl('user/edituserpassword'),
            {userId:userId,password:123456},
            function(msg){
                layer.alert(msg.message);
            }, false,'POST'
        )
    });

}

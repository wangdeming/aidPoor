var laypage='';
var morder=6;
layui.use(['layer','laypage'], function(){
    var layer = layui.layer;
   laypage = layui.laypage;
});


if(userobj.roleList[0].id=='1' || userobj.roleList[0].id=='2'){
    $(".add").show();
}
function search(obj) {
    var iobj=$(obj).find('i');
    var cname=iobj.attr('class');

    if(cname=='triangle-down'){
        iobj.attr('class','triangle-up');
        morder=iobj.attr('triangle-up');
    }
    if(cname=='triangle-up'){
        iobj.attr('class','triangle-down');
        morder=iobj.attr('triangle-down');
    }

    getList(1,$('.pslider-active').attr('data-id'),$('.pslider-active').parents('li').length+1);
}
function editpage(id){
    var tit=id?'编辑':'新增';

    layer.open({
        type: 2,
        title: tit+'帮扶结对',
        anim: 2,
        closeBtn: 1,
        shadeClose: true,
        area: ['720px', '700px'],
        content:"help-addcombine.html?id="+id+'&areaId='+$('.pslider-active').attr('data-id')+'&areaType='+($('.pslider-active').parents('li').length+1)+"&helpUnitId="+$("#helpUnitId").val(),
    });
}


function getList(pageNum,areaId,areaType){
    if(!areaId){
        areaId=g_areaId;
    }
    if(areaType==1){
        areaType=g_areaType;
    }
    // var morder=
    var pageSize=10;
    $("ul.el-pager").empty();
    var helpUnitId=($("#helpUnitId").val())?$("#helpUnitId").val():userobj.helpUnitId;
    iajax(
        wPath.getUrl('helpPlan/page'),
        {pageNumber:pageNum,pageSize:pageSize,areaType:areaType,areaId:areaId,helpUnitId:helpUnitId,key:$("#familyName").val(),status1:$("#status1").val(),order:morder},
        function(msg){
            $("#nondiv").hide();$(".tdata").show();$("#page").show();
            if(msg.object.total<1){
                $("#nondiv").show();$(".tdata").hide();$("#page").hide();
                return;
            }

            var data=msg.object.list;
            $("table.tdata>tbody").empty();
            for(var i = 0;i<data.length;i++){
                var prohtml='';var stastr='已结束';
                if(data[i].status1!=1){
                    stastr='进行中';
                }
                if(data[i].status1!=1 && (userobj.roleList[0].id=='1'||userobj.roleList[0].id=='2')){
                    prohtml='<button onclick="endplan(\''+data[i].helpPlanId+'\')">结束帮扶</button>';
                }
                var tempTrHtml = '<tr>' +
                    '<td>' + (parseInt(i+1)+pageSize*(pageNum-1)) +'</td>' +
                    '<td>'+getfstr(data[i].helpPersonName)+'</td>' +
                    '<td>'+getfstr(data[i].telephoneNumber)+'</td>' +
                    '<td>'+getfstr(data[i].email)+'</td>' +
                    '<td><a href="./poor-house-manage.html?flag=poor-people&familyId='+data[i].familyId+'" style="color: #0094FF;">'+getfstr(data[i].familyName)+'</a></td>' +
                    '<td>'+stastr+'</td>' +
                    '<td>'+getfstr(data[i].startDate)+'</td>' +
                    '<td>'+getfstr(data[i].endDate)+'</td>' +
                    '<td>'+getfstr(data[i].createDatetime)+'</td>' +
                    '<td>'+prohtml+'</td></tr>';

                $("table.tdata>tbody").append(tempTrHtml);
            }

            laypage.render({
                elem: 'page'
                ,count: msg.object.total
                ,curr: pageNum
                ,limit:pageSize
                ,jump: function(pobj, first){
                    if(!first){
                        getList(pobj.curr,$('.pslider-active').attr('data-id'),$('.pslider-active').parents('li').length+1);
                    }
                }
            });
        }
    );
}
function endplan(helpPlanId) {
    iajax(
        wPath.getUrl('helpperson/end'),
        {helpPlanId:helpPlanId},
        function(msg){
            layer.alert(msg.message);
            search();
        }, false,'POST'
    )
}

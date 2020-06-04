var laypage='';
layui.use(['layer','laypage'], function(){
    var layer = layui.layer;
   laypage = layui.laypage;
});
if(userobj.roleList[0].id=='1'){
    $(".add").show();
}
function editpage(id){
    var tit=id?'编辑':'新增';
    layer.open({
        type: 2,
        title: tit+'帮扶单位',
        anim: 2,
        closeBtn: 1,
        shadeClose: true,
        area: ['920px', '700px'],
        content:"help-addcompany.html?id="+id,
    });
}
function search() {
    getList(1,$('.pslider-active').attr('data-id'),$('.pslider-active').parents('li').length+1);
}
function getList(pageNum,areaId,areaType){
    var pageSize=13;
    $("ul.el-pager").empty();

    iajax(
        wPath.getUrl('helpUnit/query'),
        {pageNumber:pageNum,pageSize:pageSize,areaType:areaType,areaId:areaId,key:$("#key").val()},
        function(msg){
            $("#nondiv").hide();$(".tdata").show();$("#page").show();
            if(msg.object.total<1){
                $("#nondiv").show();$(".tdata").hide();$("#page").hide();
                return;
            }
                var data=msg.object.list;
            $("table.tdata>tbody").empty();
                for(var i = 0;i<data.length;i++){
                    var tempTrHtml = '<tr>' +
                        '<td>'+ (parseInt(i+1)+pageSize*(pageNum-1)) +'</td>' +
                        '<td>'+getfstr(data[i].code)+'</td>' +
                        '<td>'+getfstr(data[i].name)+'</td>' +
                        '<td>'+getfstr(data[i].abbreviation)+'</td>' +
                        '<td>'+getfstr(data[i].address)+'</td>' +
                        '<td>'+getfstr(data[i].personCount)+'</td>' +
                        '<td>'+getfstr(data[i].personName)+'</td>' +
                        '<td>'+getfstr(data[i].telephoneNumber)+'</td>' +
                        '<td>'+getfstr(data[i].email)+'</td>' +
                        '<td>'+getfstr(data[i].village)+'</td>' +
                        '<td>'+getfstr(data[i].createDatetime)+'</td>' +
                        '<td><button onclick="editpage(\''+data[i].id+'\')">编辑</button></td></tr>';

                    $("table.tdata>tbody").append(tempTrHtml);
                }
                // createPages(8,pageNum);
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

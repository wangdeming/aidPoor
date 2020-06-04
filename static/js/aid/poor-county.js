iajax(
    wPath.getUrl('countyCondition/povertyCountyNum'),
    {cityId:361100000000},
    function(obj){
        $("#countyNum").text(obj.object.countyNum);
    }
);
iajax(
    wPath.getUrl('countyCondition/findCountyCondition'),
    {cityId:361100000000},
    function(obj){
        $.each(obj.object, function (i, o) {
            $("#"+i).text(o);
        })
    }
);
$('#export').on('click', function(){
    var arr=[];
    $.each($('input[name="ids[]"]:checked'),function(){
        arr.push($(this).val());
    });
    if(arr.length<1){
        layer.msg('请选择要导出的地区', {icon: 5});
        return;
    }
    var data=arr.join(',');
    iajax(
        wPath.getUrl('countyCondition/export'),
        {ids:data},
        function(obj){
            console.info(wPath.getPrefix()+obj.object);
            window.location.href=wPath.getPrefix()+obj.object;
        },
        false,
        "POST"
    );
});
layui.use(['form','layer','element'], function(){
    var layer = layui.layer;
    var  form = layui.form ;
    var element = layui.element;
    $("#cancel").click(function () {
        layer.closeAll("page");
    });
    form.on('checkbox(chk_all)', function(data){
        if($("#chk_all").is(':checked')){
            $(".cuserl").prop("checked",true);
        }else{
            $(".cuserl").prop("checked",false);
        }
        form.render('checkbox');
    });
    form.on('checkbox(down_all)', function(data){
        if($("#down_all").is(':checked')){
            $(".downl").prop("checked",true);
        }else{
            $(".downl").prop("checked",false);
        }
        form.render('checkbox');
    });
    form.on('submit(down)', function(data){

        if(!$('#downform').serialize()){
            layer.msg('请选择要下载导入模板', {icon: 5});
            return;
        }
        window.location.href=wPath.getUrl('countyCondition/downloadExcel')+"?"+$('#downform').serialize();
        return false;
    });

    iajax(
        wPath.getUrl('dm/getdm'),
        {dmCode:'TPBS'},
        function(obj){
            $.each(obj.object.subDmList,function (i,o) {
                $("#TPBS").append('<option value="'+o.dm+'">'+o.dmValue+'</option>');
            });
            form.render('select');
        }
    )
    $('#download').on('click', function(){
        layer.open({
            type: 1,
            title: '下载导入模板',
            anim: 2,
            shadeClose: true,
            area: ['410px', '330px'],
            content:$('#layerdiv'),
        });
    });
    $("#searsub").click(function () {
        getlist();
    });
    $('#keywords').keyup(function(event){
        if(event.keyCode ==13){
            getlist();
        }
    });
    getlist();
    function getlist(){
        $("#tbody").html("");
        var flag='';
        if($("#TPBS").val()!=0){
            flag=$("#TPBS").val();
        }
        iajax(
            wPath.getUrl('countyCondition/queryAllCountyCondition'),
            {cityId:361100000000,keywords:$("#keywords").val(),flag:flag},
            function(obj){
                $("#nondiv").hide();$(".tdata").show();
                if(obj.object.length<1){
                    $("#nondiv").show();$(".tdata").hide();
                    return;
                }
                var bolstr=['','是','否','是'];

                $.each(obj.object, function (i, o) {
                    var prohtml ='<a href="mpoor.html?countyId='+o.areaId+'&year=2017&flag=poor-county">详情</a>';
                   
                    $("#tbody").append(' <tr>\n' +
                        '            <td><input type="checkbox" lay-skin="primary" class="cuserl"  name="ids[]"   value="'+o.areaId+'"  lay-filter="chk" ></td>\n' +
                        '            <td>' + (i+1) + '</td>\n' +
                        '            <td>' + o.areaId + '</td>\n' +
                        '            <td>' + o.county + '</td>\n' +
                        '            <td>' + bolstr[o.flag] + '</td>\n' +
                        '            <td>' + o.administrativeVillSum + '</td>\n' +
                        '            <td>' + o.povertyVillSum + '</td>\n' +
                        '            <td>' + o.natureVillSum+'</td>\n' +
                        '            <td>' + getfstr(o.mainPovertyReasonName)+'</td>\n' +
                        '            <td>' + getfstr(o.leader)+'</td>\n' +
                        '            <td>' + getfstr(o.telephoneNumber)+'</td>\n' +
                        '            <td>'+prohtml+'</td>\n' +
                        '        </tr>');
                });
                form.render('checkbox');

            }
        );
    }
});
layui.use(['form','layer','laypage'], function(){
    var layer = layui.layer;
    var form = layui.form ;
    var laypage = layui.laypage;
    $('#fadd').on('click', function(){
        layer.open({
            type: 1,
            title: '快速新增',
            anim: 2,
            shadeClose: true,
            area: ['680px', '470px'],
            content:$('#layerdiv').load("user-afuser.html"),
        });
    });
    getlist(1);
    $("#search").click(function () {
        getlist(1);
    });
    $('#keywords').keyup(function(event){
        if(event.keyCode ==13){
            getlist(1);
        }
    });
    form.on('checkbox(chk_all)', function(data){
        if($("#chk_all").is(':checked')){
            $(".cuserl").prop("checked",true);
        }else{
            $(".cuserl").prop("checked",false);
        }
        form.render('checkbox');
    });
    function getlist(pageNum) {
        $("#tbody").html('');
        iajax(
            wPath.getUrl('user/queryUserInfoPage'),
            {keywords: $("#keywords").val(), pageNum: pageNum, pageSize: 10},
            function (obj) {
                $.each(obj.object.data, function (i, o) {
                    if(o.roles){
                        var arr = o.roles.split(',');
                        var rolestr = '',isadmin=false,handlestr='<a href="user.html?flag=user-euser&uid='+o.id+'">编辑</a>';
                        $.each(arr, function (i, a) {
                            rolestr += '<input  type="checkbox" lay-skin="primary" disabled checked="checked" title="'+a+'">';
                            if(a=='管理员'){
                                isadmin=true;
                            }
                        })
                    }

                    if(isadmin){
                        handlestr='<a href="user.html?flag=user-euser&uid='+o.id+'">修改密码</a>';
                    }
                    $("#tbody").append(' <tr>\n' +
                        '            <td><input type="checkbox" lay-skin="primary" class="cuserl"  name="ids[]"   value="'+o.id+'"  lay-filter="chk" ></td>\n' +
                        '            <td>' + o.loginName + '</td>\n' +
                        '            <td>' + getfstr(o.realName) + '</td>\n' +
                        '            <td class="tl">' + rolestr + '</td>\n' +
                        '            <td>' + getfstr(o.lastLoginTime) + '</td>\n' +
                        '            <td>' + o.createTime + '</td>\n' +
                        '            <td>'+handlestr+'</td>\n' +
                        '        </tr>')
                });
                form.render('checkbox');
                laypage.render({
                    elem: 'page'
                    ,count: obj.object.page.total
                    ,curr: obj.object.page.pageNum
                    ,jump: function(pobj, first){
                        if(!first){
                            getlist(pobj.curr);
                        }
                    }
                });
            }
        );
    }
    $("#deleteall").click(function () {
        var uids='';
        $.each($('.cuserl:checked'),function(){
            uids+=$(this).val()+',';
        })
        uids= uids.substring(0,uids.length-1);
        iajax(
            wPath.getUrl('user/deleteUserInfo'),
            {userIds:uids},
            function (obj) {
                layer.alert('操作成功', {icon: 1});
                getlist();
            }
        );
    });
});
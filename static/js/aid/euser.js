layui.use(['form'], function(){
    var form = layui.form ;

    iajax(
        wPath.getUrl('areaRelation/queryAreaListByParentId'),
        {parentId:360000000000},
        function(obj){
            $.each(obj.object,function (i,o) {
                $("#city").append('<option value="'+o.areaName+'">'+o.areaName+'</option>');
            });
            form.render('select');
        }
    )
    iajax(
        wPath.getUrl('dm/getdm'),
        {dmCode:'POLITICS'},
        function(obj){
            $.each(obj.object.subDmList,function (i,o) {
                $("#politics").append('<option value="'+o.dm+'">'+o.dmValue+'</option>');
            });
            form.render('select');
        }
    )
    iajax(
        wPath.getUrl('dm/getdm'),
        {dmCode:'DWLSGX'},
        function(obj){
            $.each(obj.object.subDmList,function (i,o) {
                $("#affiliation").append('<option value="'+o.dm+'">'+o.dmValue+'</option>');
            });
            form.render('select');
        }
    )
    iajax(
        wPath.getUrl('user/queryUserInfoDetail'),
        {userId:getUrlParam('uid')},
        function(obj){
            $.each(obj.object.userInfo,function (i,o) {
                if(i=='id'){
                    i='userId';
                }
                $("input[name^='"+i+"']").val(o);
            });
            $.each(obj.object.userRoleList,function (i,o) {
                console.info(  $("#"+o.role).val());
                $("#"+o.role).attr("checked",true);
            });
            $.each(obj.object.helpPerson,function (i,o) {
                $("input[name^='"+i+"']").val(o);
            });
            form.render('checkbox');
            form.render('select');
        }
    )

    form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ]
        ,repass: function(value) {
            var pass = $("#pass").val();
            if(!new RegExp(pass).test(value)) {
                return '两次输入的密码不一致';
            }
        }
    });


    form.on('submit(ta)', function(data){
        var fields=data.field;
        var r1 ='';var r2='';
        $.each(fields,function (i,o) {
            if(i=='roleIds[0]'){
                r1=o;
            }
            if(i=='roleIds[1]'){
                r2=o;
            }
        });
        fields.roleIds=r1+','+r2;
        console.info(fields);
        iajax(
            wPath.getUrl('user/editUserInfo'),
            fields,
            function(obj){
                if(obj.result=='SUCCESS'){
                    alert('修改成功');
                    window.location.href="user.html?flag=user-muser";
                }
            },
            false,
            'POST'
        );
        return false;
    });
});
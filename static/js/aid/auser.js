layui.use(['form','layer'], function(){
    var form = layui.form ;
    var layer= layui.layer;
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
        iajax(
            wPath.getUrl('user/addUserInfo'),
            fields,
            function(obj){
                if(obj.result=='SUCCESS'){
                    layer.alert('添加成功', {icon: 1});
                    setTimeout('window.location.href="user.html?flag=user-muser"',2000);
                }
            },
            false,
            'POST'
        );
        return false;
    });
});
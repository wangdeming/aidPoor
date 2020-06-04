$('#export').on('click', function(){
    var arr=new Array();
    $.each($('input[name="helpPlan-id[]"]:checked'),function(){
        arr.push($(this).val());
    });
    var ids=arr.join(',');
    iajax(
        wPath.getUrl('helpPlan/export'),
        {ids:ids},
        function(obj){
            console.info(wPath.getPrefix()+obj.object);
            window.location.href=wPath.getPrefix()+obj.object;
        },
        false,
        "POST"
    );
});
$('#import').on('click', function(){
    $("#file").trigger('click');
});

layui.use(['laypage', 'form'], function () {
    var laypage = layui.laypage;
    var form = layui.form;

    createHelpPlanTable(1);

    function createHelpPlanTable(pageNum) {
        var provinceId = $("#select_province").val();
        var cityId = $("#select_city").val();
        var countyId = $("#select_county").val();
        var townId = $("#select_town").val();
        var villageId = $("#select_village").val();
        var areaId;
        if (villageId.length != 0) {
            areaId = villageId;
        } else if (townId.length != 0) {
            areaId = townId;
        } else if (countyId.length != 0) {
            areaId = countyId;
        } else if (cityId.length != 0) {
            areaId = cityId;
        } else {
            areaId = provinceId;
        }
        $("ul.el-pager").empty();
        var projectCategory = getUrlParam('projectCategory');
        iajax(
            wPath.getUrl('helpPlan/query'),
            {pageNum: pageNum, pageSize: 10, projectCategory: projectCategory, areaId: areaId},
            function (msg) {
                var datatotal = msg.object;
                $("#help-plan-totalFunds").text(datatotal.totalFunds);
                var helpPlanInfoArr = datatotal.pageInfo.list;
                $("table.help-plan>tbody").empty();

                for (var i = 0; i < helpPlanInfoArr.length; i++) {
                    var realName = helpPlanInfoArr[i].realName;
                    if (typeof(realName) == "undefined") {
                        realName = '';
                    }

                    var projectName = helpPlanInfoArr[i].projectName;
                    if (typeof(projectName) == "undefined") {
                        projectName = '';
                    }


                    var dmValue = helpPlanInfoArr[i].dmValue;
                    if (typeof(dmValue) == "undefined") {
                        dmValue = '';
                    }

                    var projectContent = helpPlanInfoArr[i].projectContent;
                    if (typeof(projectContent) == "undefined") {
                        projectContent = '';
                    }

                    var projectScale = helpPlanInfoArr[i].projectScale;
                    if (typeof(projectScale) == "undefined") {
                        projectScale = '';
                    }

                    var planAmount = helpPlanInfoArr[i].planAmount;
                    if (typeof(planAmount) == "undefined") {
                        planAmount = '';
                    }
                    var id = helpPlanInfoArr[i].id;
                    if (typeof(id) == "undefined") {
                        id = '';
                    }

                    var createTime = helpPlanInfoArr[i].createTime;
                    if (typeof(createTime) == "undefined") {
                        createTime = '';
                    }

                    var tempTrHtml = '<tr>' +
                        '<td><input type="checkbox" name="helpPlan-id[]" class="hp" lay-skin="primary"  id="helpPlan-checkbox-' + i + '" value="' + id + '"/></td>' +
                        '<td>' + parseInt(i + 1) + '</td>' +
                        '<td>' + realName + '</td>' +
                        '<td>' + projectName + '</td>' +
                        '<td>' + dmValue + '</td>' +
                        '<td>' + projectContent + '</td>' +
                        '<td>' + projectScale + '</td>' +
                        '<td>' + planAmount + '</td>' +
                        '<td>' + id + '</td>' +
                        '<td>' + createTime + '</td>'
                    '</tr>';
                    $("table.help-plan>tbody").append(tempTrHtml);
                }
                form.render('checkbox');
                laypage.render({
                    elem: 'page'
                    , count: datatotal.pageInfo.total
                    , curr: pageNum
                    , limit: 10
                    , jump: function (pobj, first) {
                        if (!first) {
                            createHelpPlanTable(pobj.curr);
                        }
                    }
                });
            }
        );
    }
    function area(parentId, flag) {

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: wPath.getUrl('areaRelation/listarearelation'),
            type: "POST",
            data: {provinceId: $("#select_province").val(),cityId: $("#select_city").val(),countyId: $("#select_county").val(),townId: $("#select_town").val()},
            dataType: 'JSON',
//                processData: false,
//                contentType: false,
            success: function (msg) {
                if (msg.result == "SUCCESS") {

                    var array = msg.object;
                    if (flag == 'province') {
                        $("#select_province").empty();
                        $("#select_province").append('<option value="0"></option>');
                        for (var i = 0; i < array.length; i++) {
                            html = '<option value="' + array[i].id + '">' + array[i].name + '</option>';
                            $("#select_province").append(html);
                        }
                    }
                    if (flag == 'city') {
                        $("#select_city").empty();
                        $("#select_city").append('<option value="0"></option>');
                        for (var i = 0; i < array.length; i++) {
                            html = '<option value="' + array[i].id + '">' + array[i].name + '</option>';
                            $("#select_city").append(html);
                        }
                    }
                    if (flag == 'county') {
                        $("#select_county").empty();
                        $("#select_county").append('<option value="0"></option>');
                        for (var i = 0; i < array.length; i++) {
                            html = '<option value="' + array[i].id + '">' + array[i].name + '</option>';
                            $("#select_county").append(html);
                        }
                    }
                    if (flag == 'town') {
                        $("#select_town").empty();
                        $("#select_town").append('<option value="0"></option>');
                        for (var i = 0; i < array.length; i++) {
                            html = '<option value="' + array[i].id + '">' + array[i].name + '</option>';
                            $("#select_town").append(html);
                        }
                    }
                    if (flag == 'village') {
                        $("#select_village").empty();
                        $("#select_village").append('<option value="0"></option>');
                        for (var i = 0; i < array.length; i++) {
                            html = '<option value="' + array[i].id + '">' + array[i].name + '</option>';
                            $("#select_village").append(html);
                        }
                    }
                    form.render('select');
                } else {
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
    area(0, 'province');
    form.render('select');

    form.on("select(province)", function (data) {
        var province = $("#select_province").val();
        if (province.length == 0) {
            $("#select_city").empty();
            $("#select_city").append('<option value=""></option>');
            $("#select_county").empty();
            $("#select_county").append('<option value=""></option>');
            $("#select_town").empty();
            $("#select_town").append('<option value=""></option>');
            $("#select_village").empty();
            $("#select_village").append('<option value=""></option>');
            form.render('select');
        } else {
            area(province, 'city');
            createHelpPlanTable(1);
        }
    })

    form.on("select(city)", function (data) {
        var  parentId= $("#select_city").val();
        if (parentId.length == 0) {
            $("#select_county").empty();
            $("#select_county").append('<option value=""></option>');
            $("#select_town").empty();
            $("#select_town").append('<option value=""></option>');
            $("#select_village").empty();
            $("#select_village").append('<option value=""></option>');
            form.render('select');
        } else {
            area(parentId, 'county');
            createHelpPlanTable(1)
        }
    })

    form.on("select(county)", function (data) {
        var  parentId= $("#select_county").val();
        $("#select_village").empty();
        $("#select_village").append('<option value=""></option>');
        form.render('select');

        area(parentId, 'town');
        createHelpPlanTable(1)

    })

    form.on("select(town)", function (data) {
        var  parentId= $("#select_town").val();
        if (parentId.length == 0) {
            $("#select_village").empty();
            $("#select_village").append('<option value=""></option>');
            form.render('select');
        } else {
            area(parentId, 'village');
            createHelpPlanTable(1)
        }
    });
    form.on("select(village)", function (data) {
        var  parentId= $("#select_village").val();
        if (parentId.length == 0) {
            // $("#select_village").empty();
            // $("#select_village").append('<option value=""></option>');
            form.render('select');
        } else {
            createHelpPlanTable(1)
        }
    });
    form.on('checkbox(chk_all)', function(data){
        if($("#chk_all").is(':checked')){
            $(".hp").prop("checked",true);
        }else{
            $(".hp").prop("checked",false);
        }
        form.render('checkbox');
    });
});
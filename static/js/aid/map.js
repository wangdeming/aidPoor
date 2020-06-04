$(function () {
	// $.ajaxSetup({
	//     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	//     headers: { 'x-requested-with': 'XMLHttpRequest' },
	//     complete: function (XMLHttpRequest, textStatus) {
	//         if (XMLHttpRequest.getResponseHeader("sessionStatus") == "timeout") {
	//             parent.window.location.replace(XMLHttpRequest.getResponseHeader("redirectUrl"));
	//         }
	//     }
	// });
    poorajax(361100000000,$("#county"));
    $("#county").change(function () {
        poorajax($(this).val(),$("#town"));
    });
    $("#town").change(function () {
        poorajax($(this).val(),$("#village"));
    });
    $("#village").change(function () {

        poorajax($(this).val(),false);
    });

    // $('#name').keyup(function(event){
    //     if(event.keyCode ==13){
    //         getpoorpeople();
    //     }
    // });
    function getareaid(){
        if($("#village").val()>0){
            return $("#village").val();
        }
        if($("#town").val()>0){
            return $("#town").val();
        }
        if($("#county").val()>0){
            return $("#county").val();
        }

    }
    $( "#name" ).autocomplete({
        minLength: 0,
        source: function( request, response ) {
            $.ajax( {
                type: "GET",
                url: wPath.getUrl('familyMember/queryFamilyMemberByName'),
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                // url: "http://localhost/a.php",
                dataType: "json",
                data: {name: request.term,areaId:getareaid()},
                success: function( data ) {
                    response( data.object );
                }
            } );
        },
        select: function( event, ui ) {
            $( "#name" ).val( ui.item.realName );
            $("#realName").text(ui.item.realName);
            $("#sex").text(ui.item.sex);
            getpoorpeople(ui.item.familyId);
            return false;
        }
    })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.realName + "<br>" + item.county+ item.town+ item.village + "</li>" )
            .appendTo( ul );
    };
})



var map = new BMap.Map("allmap");
map.centerAndZoom('上饶', 10);
map.setCurrentCity("上饶市");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
// 编写自定义函数,创建标注
function addMarker(point){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}
getBoundary(map,'江西省上饶市');

function deletePoint(){
    map.clearOverlays();

}

//right chart1
function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}

function right_chart1(data){

    var myChart = echarts.init(document.getElementById('chart1'));
    option = {
        series: [{
            name: '致贫原因',
            type: 'wordCloud',
            size: ['100%', '100%'],
            data: data
        }]
    };

    myChart.setOption(option);
}

function poorajax(data,tagselect) {

    $.ajax({
        type: "GET",
        url: wPath.getUrl('areaRelation/queryAreaListByParentId'),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {parentId:data},
        dataType: "json",
        success: function(obj){
            if(obj.result=='SUCCESS'){
                deletePoint();

                if(!tagselect){

                    var point = new BMap.Point($("#village").find("option:selected").attr('data-lngSpan'), $("#village").find("option:selected").attr('data-latSpan'));
                    addMarker(point);
                }else{
                    tagselect.html('<option value="0">全部</option>');
                    $("#village").html('<option value="0">全部</option>');
                    $.each(obj.object,function (i,o) {
                        var lngSpan =o.longitude;
                        var latSpan =o.latitude ;
                        tagselect.append('<option value="'+o.areaId+'" data-lngSpan="'+lngSpan+'" data-latSpan="'+latSpan+'">'+o.areaName+'</option>');
                        var point = new BMap.Point(lngSpan, latSpan);
                        addMarker(point);
                    });
                }
            }
        }
    });
}
function getpoorpeople(familyId) {
    deletePoint()
    var arr=new Array();
    $.ajax({
        type: "GET",
        url: wPath.getUrl('familyCondition/queryFamilyInfoByFamilyId'),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: {familyId:familyId},
        dataType: "json",
        success: function(obj){
            if(obj.result=='SUCCESS'){
                var o=obj.object;
                $("#masterName").text(o.masterName);
                $("#familyMemberSum").text(o.familyMemberSum);
                $("#laborSum").text(o.laborSum);
                $("#income").text(o.income);
                $("#lowInsSum").text(o.lowInsSum);
                $("#countytown").text(o.county+o.town);
                var lngSpan =o.longitude;
                var latSpan =o.latitude ;
                var point = new BMap.Point(lngSpan, latSpan);
                
                addMarker(point);

                map.setCenter(point)
                arr.push({name:o.mainPovertyReason,value:1500});
                strs=o.otherPovertyReason.split(",");
                for (i=0;i<strs.length ;i++ )
                {
                    arr.push({name:strs[i],value:1500*Math.random()});
                }

                right_chart1(arr);
            }
        }
    });
}
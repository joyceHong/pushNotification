//if (window.device.platform == "iOS" && parseFloat(window.device.version) >= 7.0) {
//    $(".ui-header>*").css("margin-top", function (index, curValue) {
//        return parseInt(curValue, 10) + 10 + 'px';
//    });
//}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function showList(listID,sickNo, name, pregistContext, pregistDate) {
    var setSickNoVal = "$('#patientPage_sickNo').val('" + sickNo + "');";        
    listID.append('<li><a href="#patientPage" id="a" data-role="button"  data-rel="dialog" onclick=' + setSickNoVal + '  data-transition="slide" > <img src="images/money.jpg" class="ui-li-icon" ><h3>' + name + ' 【 ' + pregistDate + ' 】 </h3><p>' + pregistContext + '</p> </a> </li>').listview('refresh');
}

function doAjax(clinicIP,user, password, date) {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: 'http://' + clinicIP + '/webClinic/api/values/listPregist/' + user + "/" + password + "/" + date,
        crossDomain: true,        
        beforeSend: function () {
            $("#loading-image").show();
        },
        timeout: 15000
    })
   .done(function (data) {
       $.each(data, function (k, v) {           
           showList($("#pregistData"), v.sickNo, v.name, v.context, v.pregistDate);
       });
       $("#pregistData").listview("refresh");
       $("#loading-image").hide();
   })
   .fail(function (xhr, textStatus, errorThrown) {
       $("#loading-image").hide();
       alert("網路不通，請檢查網路或帳號密碼錯誤");
   })
}


function dolistOperates(clinicIP,user, password, sickNo, startDate, endDate)
{
    $("#opasmDIV").empty();
    $.ajax({
        url: 'http://' + clinicIP + '/webClinic/api/values/listOperates/' + user + "/" + password + "/" + sickNo +"/"+startDate+"/"+ endDate,
        type: 'GET',
        error: function () {
            document.title = 'error';
            $("#opasmDIV").empty();
            alert("病歷編號:" + sickNo + "的日期 " + startDate + "資料有誤!");
        },
        timeout: 15000,
        beforeSend: function () {
            $("#loading-image").show();
        },
        success: function (data) {
            $(data).each(function (index, obj) {
                var visitedDate = "無";
                if (obj.visitDate != undefined) {
                    visitedDate = obj.visitDate.substring(0, 3) + "-" + obj.visitDate.substring(3, 5) + "-" + obj.visitDate.substring(5, 7);
                }
                $("#opasmDIV").append("<label><font color='#00FF00'>就診日期：" + visitedDate + "</font></label>");

                //手術處置相關
                if (obj.opasms != undefined) {
                    $(obj.opasms).each(function (opasmIndex, opasmObj) {

                        $("#opasmDIV").append("<label><b>就醫序號： </b>" + opasmObj.healthNumber + "</label>");

                        //病人主述
                        var thematic = "無";
                        if (opasmObj.thematic != null) {
                            thematic = opasmObj.thematic
                        }
                        $("#opasmDIV").append("<label><b>病人主述： </b>" + thematic + "</label>");

                        //牙面
                        var toothSurface = "";
                        if (opasmObj.toothSurface != null) {
                            if (opasmObj.toothSurface.trim() != "") {
                                toothSurface = "(" + opasmObj.toothSurface + ") ";
                            }
                        }

                        //國際病碼
                        var internaDiseaseCode = "無"; // 國際病碼
                        if (opasmObj.internaDiseaseCode != null) {
                            internaDiseaseCode = opasmObj.internaDiseaseChinese + " (" + opasmObj.internaDiseaseCode + ")";
                        }

                        $("#opasmDIV").append("<label><b>國際病碼： </b>" + toothSurface + "  " + internaDiseaseCode + " </label>");
                        $("#opasmDIV").append("<label><b>牙齒部位： </b>" + opasmObj.toothLocation + "</label>");
                        if (opasmObj.surgeryCode1.trim() != "")
                            $("#opasmDIV").append("<label><b>處置碼： </b>" + opasmObj.surgeryCode1 + "  " + opasmObj.surgeryCodeChinese1 + "  " + opasmObj.surgeryCodeEnglish1 + "</label>");

                        if (opasmObj.surgeryCode2.trim() != "")
                            $("#opasmDIV").append("<label><b>處置碼 2： </b>" + opasmObj.surgeryCode2 + "  " + opasmObj.surgeryCodeChinese2 + "  " + opasmObj.surgeryCodeEnglish2 + "</label>");

                        if (opasmObj.surgeryCode3.trim() != "")
                            $("#opasmDIV").append("<label><b>處置碼 3： </b>" + opasmObj.surgeryCode3 + "  " + opasmObj.surgeryCodeChinese3 + "  " + opasmObj.surgeryCodeEnglish3 + "</label>");

                        if (opasmObj.surgeryCode4.trim() != "")
                            $("#opasmDIV").append("<label><b>處置碼 4： </b>" + opasmObj.surgeryCode4 + "  " + opasmObj.surgeryCodeChinese4 + "  " + opasmObj.surgeryCodeEnglish4 + "</label>");

                        var disposalRecord = "無";
                        if (opasmObj.disposalRecord != null) {
                            disposalRecord = opasmObj.disposalRecord;
                        }
                        $("#opasmDIV").append("<label><b>處置病歷： </b>" + disposalRecord + "</label>");
                        $("#opasmDIV").append("<hr color=red>");
                    });
                }
            });
            $("#loading-image").hide();
        }
    });
}

//約診病患
$(document).delegate("#pregistPage", "pageinit", function () {
    
    var now = new Date();
    var id = getUrlParameter('id'); //passing url from index;
    var db =sqlList.openDB("clinicDatabase"); //開啟資料表   

    sqlList.executeSQL(db, "select clinicIP,clinicName,user,password from clinics where id=" + id, function (obj) {
        
        var clinicIP = obj.item(0).clinicIP;
        var clinicName = obj.item(0).clinicName;
        var user = obj.item(0).user;
        var password = obj.item(0).password;
        var today = now.toJSON().substring(0, 10);

        $("#patientPage_clinicIP").val(clinicIP);
        $("#pregistPage_clinicName").text(clinicName);
        $("#patientPage_user").val(user);
        $("#patientPage_password").val(password);
        $("#pregistPage_ClinicId").val(id); //把診所的ID暫存下來
        //預設
        $("#scheduleDay").val(today);
        $("#pregistData").empty();
        doAjax(clinicIP, user, password, today);

        //遞減今天日期
        $("#preDay").click(function () {
            preDay = change_date($("#scheduleDay").val(), 0, 0); /*如設為0 反而為減1*/
            $("#scheduleDay").val(preDay);
            $("#pregistData").empty();
            doAjax(clinicIP, user, password, preDay);
        })

        //預設今天
        $("#today").click(function () {
            var today = now.toJSON().substring(0, 10);
            $("#scheduleDay").val(today);
            $("#pregistData").empty();
            doAjax(clinicIP, user, password, today);
        });

        //遞增今天日期
        $("#nextDay").click(function () {
            nextDay = change_date($("#scheduleDay").val(), 0, 2); /* 加2 = 設為今天的下一天*/
            $("#scheduleDay").val(nextDay);
            $("#pregistData").empty();
            doAjax(clinicIP, user, password, nextDay);
        });

        //更改日期
        $("#scheduleDay").change(function () {           
            $("#pregistData").empty();
            doAjax(clinicIP, user, password, $("#scheduleDay").val());
        })
    });
})

//查詢病患
$(document).delegate("#listPatientPage", "pageinit", function () {   
    //if (window.device.platform == "iOS" && parseFloat(window.device.version) >= 7.0) {
    //    $(".ui-header>*").css("margin-top", function (index, curValue) {
    //        return parseInt(curValue, 10) + 10 + 'px';
    //    });
    //}
    var user = $("#patientPage_user").val();
    var password = $("#patientPage_password").val();
    var clinicIP = $("#patientPage_clinicIP").val();
    $("#listPatientPage_search").click(function () {
        
        $("#patientData").empty();
        var searchValue = $("#listPatientPage_searchValue").val();

        if (searchValue.trim() == "") {
            alert("請輸入【病患姓名】 或 【生日】 或 【快速碼】");
            return;
        }


        $.ajax({
            type: "GET",
            dataType: 'json',
            url: 'http://' + clinicIP + '/webClinic/api/values/listPatients/' + user + "/" + password + "/"+ searchValue,
            crossDomain: true,
            beforeSend: function () {
                $("#listPatientPage_loading").show();
            },
            timeout: 15000
        })
        .done(function (data) {
            if (data.length==0) {
                alert("目前無任何資料");
            }

            $.each(data, function (k, v) {
                var birthday = "";
                if (v.birthDay != null) {
                    if (v.birthDay.trim() != "") {
                        birthday = v.birthDay.substring(0, 3) + "-" + v.birthDay.substring(3, 5) + "-" + v.birthDay.substring(5, 7);
                    }
                }
                showList($("#patientData"), v.sickNo, v.name, v.sex, birthday);
            });

            $("#patientData").listview("refresh");
            $("#listPatientPage_loading").hide();
        })
        .fail(function (xhr, textStatus, errorThrown) {
            $("#loading-image").hide();
            alert("網路不通，請檢查網路或帳號密碼錯誤 listPatientPage ");
        });
    })  
})

//病患基本資料
$(document).delegate("#patientPage", "pageshow", function () {
   
    var sickNo = $("#patientPage_sickNo").val();
    var clinicIP = $("#patientPage_clinicIP").val();
    var date = $("#scheduleDay").val();
    var user = $("#patientPage_user").val();
    var password = $("#patientPage_password").val();

    $.ajax({
        url: 'http://' + clinicIP + '/webClinic/api/values/readPatient/' + user + "/" + password + "/"+ sickNo + "/" + date,
        type: 'GET',
        error: function (error)
        {
            alert("病人資料有誤! 查無此人");
        },
        success: function (data) {
            $('#patientPage_name').html(data.name + "(" + data.sex + ")");
            $('#opasmDialog_patientName').html(data.name + "病歷資料");
            var birthday = "無";
            if (data.birthDay != null) {
                var decodeBirthDay =data.birthDay;
                if (decodeBirthDay.trim() != "") {
                    birthday = decodeBirthDay.substring(0, 3) + "-" + decodeBirthDay.substring(3, 5) + "-" + decodeBirthDay.substring(5, 7);
                }
            }            
            $('#patientPage_birthday').html(birthday);
            $('#patientPage_addr').html(data.address);
            $('#patientPage_tel').val(data.tel);
            $('#patientPage_mobile').val(data.mobile);
            $('#patientPage_pregistDate').val(data.pregistDetailData.pregistDate); //預約日期            
            $('#patientPage_pregistRequireTime').val(data.pregistDetailData.pregistRequireTime); //需時
            $('#patientPage_pregistContext').val(data.pregistDetailData.pregistContext); //備註
        },
        timeout: 15000
    });

    $("#patientPage_viewOpasm").click(function () {
        $("#opasmDIV").empty(); //先清空資料
    })
   
})

//調閱病歷頁面
$(document).delegate("#opasmDialog", "pageinit", function () {
   
    //預設
    var now = new Date();
    var startDate = change_date(now.toJSON().substring(0, 10), 0, -180);
    var endDate = now.toJSON().substring(0, 10);
    $("#opasmDialog_startDate").val(startDate);
    $("#opasmDialog_endDate").val(endDate);

    //遞減startDate:今天日期
    $("#opasmDialogStart_preDay").click(function () {
        var preDay = change_date($("#opasmDialog_startDate").val(), 0, 0); /*如設為0 反而為減1*/
        $("#opasmDialog_startDate").val(preDay);
    })

    //預設startDate:今天
    $("#opasmDialog_before3Month").click(function () {
        var today = change_date(now.toJSON().substring(0,10),0, -180); //預設三個月前
        $("#opasmDialog_startDate").val(today);
    });

    //遞增startDate 今天日期
    $("#opasmDialogStart_nextDay").click(function () {
        var nextDay = change_date($("#opasmDialog_startDate").val(), 0, 2); /* 加2 = 設為今天的下一天*/
        $("#opasmDialog_startDate").val(nextDay);
    });

    //遞減endDate:今天日期
    $("#opasmDialogEnd_preDay").click(function () {
        var preDay = change_date($("#opasmDialog_endDate").val(), 0, 0); /*如設為0 反而為減1*/
        $("#opasmDialog_endDate").val(preDay);
    })

    //預設endDate:今天
    $("#opasmDialog_today").click(function () {
        var today = now.toJSON().substring(0, 10); //預設三個月前
        $("#opasmDialog_endDate").val(today);
    });

    //遞增startDate 今天日期
    $("#opasmDialogEnd_nextDay").click(function () {
        var nextDay = change_date($("#opasmDialog_endDate").val(), 0, 2); /* 加2 = 設為今天的下一天*/
        $("#opasmDialog_endDate").val(nextDay);
    });
    

    $("#opasmDialog_search").click(function () {

        var sickNo = $("#patientPage_sickNo").val();
        var clinicIP = $("#patientPage_clinicIP").val();
        var user = $("#patientPage_user").val();
        var password = $("#patientPage_password").val();

        $("#opasmDIV").empty();
        var dStart = change_date($("#opasmDialog_startDate").val(), 0, 1);
        var dEnd = change_date($("#opasmDialog_endDate").val(), 0, 1);
        console.log("clickUser " + sickNo);
        dolistOperates(clinicIP, user, password, sickNo, dStart, dEnd);
    });
})
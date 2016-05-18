
function showList(listID,sickNo, name, pregistContext, pregistDate,doctorName) {
    var setSickNoVal = "$('#patientPage_sickNo').val('" + sickNo + "')";
    
    if (doctorName == undefined) {
        listID.append('<li><a href="#patientPage" id="a" data-rel="dialog" onclick=' + setSickNoVal + '  data-transition="slide" > <img src="images/money.jpg" class="ui-li-icon" ><h3>' + name + ' 【 ' + pregistDate + ' 】 </h3><p>' + pregistContext + '</p></a></li>');
    } else {
        listID.append('<li><a href="#patientPage" id="a" data-rel="dialog" onclick=' + setSickNoVal + '  data-transition="slide" > <img src="images/money.jpg" class="ui-li-icon" ><h3>' + name + ' 【 ' + pregistDate + ' 】 </h3><p><b>醫師姓名:' + doctorName + '</b></p><p>' + pregistContext + '</p></a></li>');
    }
    
}

function doAjax(clinicIP, user, password, date, doctorID) {
    console.log('http://' + clinicIP + '/webClinic/api/values/listPregist/' + user + "/" + password + "/" + date + "/" + doctorID);
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: 'http://' + clinicIP + '/webClinic/api/values/listPregist/' + user + "/" + password + "/" + date+"/"+doctorID,
        crossDomain: true,        
        beforeSend: function () {
            $("#loading-image").show();
        },
        timeout: 15000
    })
   .done(function (data) {
       $("#pregistData").empty();
       $.each(data, function (k, v) {           
           showList($("#pregistData"), v.sickNo, v.name, v.context, v.pregistDate,v.doctorName);
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
            if (data.length == 0) {
                alert("目前無任何資料");
            }

            $(data).each(function (index, obj) {
                var visitedDate = "無";
                if (obj.visitDate != undefined) {
                    visitedDate = obj.visitDate.substring(0, 3) + "-" + obj.visitDate.substring(3, 5) + "-" + obj.visitDate.substring(5, 7);
                }
                $("#opasmDIV").append("<div><p><font color='#0000FF'>就診日期：" + visitedDate + "</font></div>");

                //手術處置相關
                if (obj.opasms != undefined) {
                    $(obj.opasms).each(function (opasmIndex, opasmObj) {

                        $("#opasmDIV").append("<div><b>就醫序號： </b>" + opasmObj.healthNumber + "</div>");

                        //病人主述
                        var thematic = "無";
                        if (opasmObj.thematic != null) {
                            thematic = opasmObj.thematic
                        }
                        $("#opasmDIV").append("<div><b>病人主述： </b>" + thematic + "</div>");

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

                        $("#opasmDIV").append("<div><b>國際病碼： </b>" + toothSurface + "  " + internaDiseaseCode + " </div>");
                        $("#opasmDIV").append("<div><b>牙齒部位： </b>" + opasmObj.toothLocation + "</div>");
                        if (opasmObj.surgeryCode1.trim() != "")
                            $("#opasmDIV").append("<div><b>處置碼： </b>" + opasmObj.surgeryCode1 + "  " + opasmObj.surgeryCodeChinese1 + "  " + opasmObj.surgeryCodeEnglish1 + "</div>");

                        if (opasmObj.surgeryCode2.trim() != "")
                            $("#opasmDIV").append("<div><b>處置碼 2： </b>" + opasmObj.surgeryCode2 + "  " + opasmObj.surgeryCodeChinese2 + "  " + opasmObj.surgeryCodeEnglish2 + "</div>");

                        if (opasmObj.surgeryCode3.trim() != "")
                            $("#opasmDIV").append("<div><b>處置碼 3： </b>" + opasmObj.surgeryCode3 + "  " + opasmObj.surgeryCodeChinese3 + "  " + opasmObj.surgeryCodeEnglish3 + "</div>");

                        if (opasmObj.surgeryCode4.trim() != "")
                            $("#opasmDIV").append("<div><b>處置碼 4： </b>" + opasmObj.surgeryCode4 + "  " + opasmObj.surgeryCodeChinese4 + "  " + opasmObj.surgeryCodeEnglish4 + "</div>");

                        var disposalRecord = "無";
                        if (opasmObj.disposalRecord != null) {
                            disposalRecord = opasmObj.disposalRecord;
                        }
                        $("#opasmDIV").append("<div><b>處置病歷： </b>" + disposalRecord + "</div>");
                        $("#opasmDIV").append("<hr color=red>");
                    });
                }
            });
            $("#loading-image").hide();
        }
    });
}

function showAllDoctors(menuName, clinicIP, user, password,doctorID) {
   return $.ajax({
            type: "GET",
            dataType: 'json',
            url: 'http://' + clinicIP + '/webClinic/api/values/listAllDoctors/' + user + "/" + password,
            crossDomain: true,
            timeout: 15000
        })
        .done(function (data) {
            $.each(data.doctors, function (k, v) {
                var optTempl = '<option value="' + v.doctorID + '">' + v.doctorName + '</option>';
                menuName.append(optTempl);
            });
            if (doctorID == undefined) {
                menuName.val(user).attr('selected', true).siblings('option').removeAttr('selected');
            } else {
                menuName.val(doctorID).attr('selected', true).siblings('option').removeAttr('selected');
            }
            
            //如果登入者非醫師人員，預設為全部醫師
            if (menuName.val() == null) {
                menuName.val('all').attr('selected', true).siblings('option').removeAttr('selected');
            }

            menuName.selectmenu('refresh', true);
            if (data.authority.haveChangeDoctor) {
                menuName.selectmenu('enable');
            } else {
                menuName.selectmenu('disable');
            }
        })
}

function stripscript(s){   
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")   
    var rs = "";   
    for (var i = 0; i < s.length; i++) {   
        rs = rs+s.substr(i, 1).replace(pattern, '');   
    }   
    return rs; 
}

function showHistoryDiv(divObject, data) {
    divObject.empty();
    $.each(data, function (k, v) {
        divObject.append("<div><font color='#0000FF'>" + v.chiName + "</font>:" + v.value + "</div>");
    });
}

//約診病患
$(document).delegate("#pregistPage", "pageinit", function () {
    
    var now = new Date();
    var id = getUrlParameter('id'); //passing url from index;
    var pregistDate = getUrlParameter('pregistDate'); //從修改約診頁面回傳日期
    var passingDoctorID = getUrlParameter('doctorID'); //從修改約診頁面回傳回的醫師代碼
    var db = sqlList.openDB("clinicDatabase"); //開啟資料表   

    $('#healthSummaryPage').load('healthSummary.html'); //業績報表
    $('#healthHistoryPage').load('healthHistory.html'); //歷史申報
    $('#editPregistPage').load('editPregist.html');     //修改約診

    sqlList.executeSQL(db, "select clinicIP,clinicName,user,password from clinics where id=" + id, function (obj) {
        
        var clinicIP = obj.item(0).clinicIP;
        var clinicName = obj.item(0).clinicName;
        var user = obj.item(0).user;
        var password = obj.item(0).password;
        var today = (pregistDate == undefined) ? now.toJSON().substring(0, 10) : pregistDate;

        $("#patientPage_clinicIP").val(clinicIP);
        $("#pregistPage_clinicName").text(clinicName);
        $("#patientPage_user").val(user);
        $("#patientPage_password").val(password);
        $("#pregistPage_ClinicId").val(id); //把診所的ID暫存下來
        
        //預設
        $("#scheduleDay").val(today);
        $("#pregistData").empty();

        showAllDoctors($("#pregistPage_doctor"), clinicIP, user, password,passingDoctorID).done(function (data) {
            doAjax(clinicIP, user, password, today, $("#pregistPage_doctor").val());
            //有權限修改約診
            if (data.authority.haveChangePregist == true) {
                $("#patientPage_editPregist").show();
            }
            else {
                $("#patientPage_editPregist").hide();
            }
        });

        //遞減今天日期
        $("#preDay").click(function () {
            preDay = change_date($("#scheduleDay").val(), 0, 0); /*如設為0 反而為減1*/
            $("#scheduleDay").val(preDay);
            doAjax(clinicIP, user, password, preDay, $("#pregistPage_doctor").val());
        })

        //預設今天
        $("#today").click(function () {
            var today = now.toJSON().substring(0, 10);
            $("#scheduleDay").val(today);
            doAjax(clinicIP, user, password, today, $("#pregistPage_doctor").val());
        });

        //遞增今天日期
        $("#nextDay").click(function () {
            nextDay = change_date($("#scheduleDay").val(), 0, 2); /* 加2 = 設為今天的下一天*/
            $("#scheduleDay").val(nextDay);            
            doAjax(clinicIP, user, password, nextDay, $("#pregistPage_doctor").val());
        });

        //更改日期
        $("#scheduleDay").change(function () {
            doAjax(clinicIP, user, password, $("#scheduleDay").val(), $("#pregistPage_doctor").val());
        })

        //更改醫師
        $("#pregistPage_doctor").change(function () {
            doAjax(clinicIP, user, password, $("#scheduleDay").val(), $("#pregistPage_doctor").val());
        });
    });
})

//查詢病患
$(document).delegate("#listPatientPage", "pageinit", function () {   
    $("#loading-image").hide();
    $("#patientPage_editPregist").hide(); //修改約診的按鈕
    var id = getUrlParameter('id'); //passing url from index;
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
            $('#editPregistPage_patientName').html("修改" + data.name + "約診資料");

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
            $('#patientPage_pregistDoctorID').val(data.pregistDetailData.doctorID);//約診的醫師代號
            $('#patientPage_pregistIkey').val(data.pregistDetailData.ikey);

            //修改約診頁面            
            $("#editPregistPage_date").val(date);
            var pregistTime = data.pregistDetailData.pregistDate;            
            $("#editPregistPage_time").val(pregistTime.substring(11, 16));
            $("#editPregistPage_context").val(data.pregistDetailData.pregistContext);
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
        dolistOperates(clinicIP, user, password, sickNo, dStart, dEnd);
    });
})

//健保彙總頁面
$(document).delegate("#healthSummaryPage", "pageinit", function () {
    var id = getUrlParameter('id'); //passing url from index;    
    var clinicIP = $("#patientPage_clinicIP").val();
    var user = $("#patientPage_user").val();
    var password = $("#patientPage_password").val();

    $("#healthSummaryPage_ClinicId").val(id);
    var now = new Date();
    var startDate = change_date(now.toJSON().substring(0, 10), 0, -30);
    var endDate = now.toJSON().substring(0, 10);
        
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 2).toJSON().substring(0, 10);
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toJSON().substring(0, 10);


    $("#healthSummary_startDate").val(firstDay);
    $("#healthSummary_endDate").val(lastDay);

    //遞減startDate:今天日期
    $("#healthSummary_start_preDay").click(function () {
        var preDay = change_date($("#healthSummary_startDate").val(), 0, 0); /*如設為0 反而為減1*/
        $("#healthSummary_startDate").val(preDay);
    })

    //遞增
    $("#healthSummary_start_nextDay").click(function () {
        var today = change_date($("#healthSummary_startDate").val(), 0, 2); //下一天
        $("#healthSummary_startDate").val(today);
    });

    //遞減 endDate 今天日期
    $("#healthSummary_end_preDay").click(function () {
        var nextDay = change_date($("#healthSummary_endDate").val(), 0, 0);
        $("#healthSummary_endDate").val(nextDay);
    });

    //遞減startDate 今天日期
    $("#healthSummary_end_nextDay").click(function () {
        var nextDay = change_date($("#healthSummary_endDate").val(), 0, 2);
        $("#healthSummary_endDate").val(nextDay);
    });


    //預設startDate:今天
    $("#healthSummary_start").click(function () {
        var today = change_date(now.toJSON().substring(0, 10), 0, -30); //預設三個月前        
        $("#healthSummary_startDate").val(today);
    });

    //endDate 今天日期
    $("#healthSummary_end").click(function () {
        var nextDay = change_date(now.toJSON().substring(0, 10), 0, 1); /*設為今天*/
        $("#healthSummary_endDate").val(nextDay);
    });
    showAllDoctors($("#healthSummary_doctor"), clinicIP, user, password);
    $("#listPatientPage_loading").hide();

    $("#healthSummary_search").click(function () {
        var doctorID = $("#healthSummary_doctor").val();
        var startDate = $("#healthSummary_startDate").val();
        var endDate = $("#healthSummary_endDate").val();
        
        if (startDate == "" || endDate == "") {
            alert("請輸入起迄區間");
        } else {

            $.ajax({
                type: "GET",
                dataType: 'json',
                url: 'http://' + clinicIP + '/webClinic/api/values/liDoctorsHealth/' + user + "/" + password + "/" + doctorID + "/" + startDate + "/" + endDate,
                crossDomain: true,
                timeout: 15000,
                error: function (request, status, error) {
                    var r = jQuery.parseJSON(request.responseText);
                    if (request.responseText == undefined) {
                        alert("查詢失敗");
                    } else {
                        alert("查詢失敗:" + request.responseText)
                    }
                },
                success: function (data) {
                    if (data.length == 0) {
                        alert("查無資料");
                    }

                    $("#healthSummaryPage_searchResult").empty();
                    $(data).each(function (index, obj) {
                        $(obj.summaryDetail).each(function (secondIndex, doctor) {
                            $("#healthSummaryPage_searchResult").append("<br><div><font color='blue'>醫師:" + doctor.doctorName + "</font></div>");
                            $("#healthSummaryPage_searchResult").append("<div>案件別:" + doctor.casetype + "</div>");
                            $("#healthSummaryPage_searchResult").append("<div>健保合計:" + doctor.healthRevSummary + " </div>");
                            $("#healthSummaryPage_searchResult").append("<hr style='background-color:red' />");
                        });

                        $("#healthSummaryPage_searchResult").append("<div><font color=green>總額:</font>" + obj.totalRevSummary + "</div>");
                    });
                },
            })
        }
    });
});

//歷史指標查詢頁面
$(document).delegate("#healthHistoryPage", "pageinit", function () {
    var now = new Date();
    var id = getUrlParameter('id'); //passing url from index;    
    var clinicIP = $("#patientPage_clinicIP").val();
    var user = $("#patientPage_user").val();
    var password = $("#patientPage_password").val();

    $("#healthHistoryPage_ClinicId").val(id);
    $("#healthHistoryPage_year").val(now.getFullYear());
    $("#healthHistoryPage_month").val(now.getMonth() + 1);

    showAllDoctors($("#healthHistory_doctor"), clinicIP, user, password); //顯示醫師下拉式選單

    $("#healthHistory_search").click(function () {

        var doctorID = $("#healthHistory_doctor").val();
        var adYear = $("#healthHistoryPage_year").val();
        var month = $("#healthHistoryPage_month").val();

        if (adYear.trim() == '' || month.trim() == '') {
            alert("請輸入費用年月");
            return;
        }

        $.ajax({
            type: "GET",
            dataType: 'json',
            url: 'http://' + clinicIP + '/webClinic/api/values/readHealthHistory/' + user + "/" + password + "/" + doctorID + "/" + adYear + "/" + month,
            crossDomain: true,
            timeout: 15000,
            error: function (request, status, error) {
                var r = jQuery.parseJSON(request.responseText);
                alert("查詢失敗:申報歷史檔不存在" );
            },
            success: function (data) {
                showHistoryDiv($("#healthHistoryPage_one"), data.liOneIndicator);                
                showHistoryDiv($("#healthHistoryPage_two"), data.liTwoIndicator);
                showHistoryDiv($("#healthHistoryPage_three"), data.liThreeIndicator);
                showHistoryDiv($("#healthHistoryPage_four"), data.liFourIndicator);
                showHistoryDiv($("#healthHistoryPage_five"), data.liFiveIndicator);
                console.log(data);
            },
        })
    });

});

//修改約診的頁面
$(document).delegate("#editPregistPage", "pageshow", function () {
    var id = getUrlParameter('id'); //passing url from index.html;    
    var clinicIP = $("#patientPage_clinicIP").val();
    var user = $("#patientPage_user").val();
    var password = $("#patientPage_password").val();
    var doctorID = $('#patientPage_pregistDoctorID').val();
    var pregistDate = $("#scheduleDay").val(); //從其他頁面回傳日期
    var pregistIkey = $('#patientPage_pregistIkey').val(); //來自病患基本資料的頁面
   
    $("#editPregistPage_doctor").empty();
    showAllDoctors($("#editPregistPage_doctor"), clinicIP, user, password, doctorID);

    $("#editPregistPage_save").click(function () {
        var editPregistDoctorID = $("#editPregistPage_doctor").val(); //編修約診的醫師代號  
        var editPregistDoctorName = $("#editPregistPage_doctor option:selected").text();
        var editPregistContext = stripscript($('#editPregistPage_context').val()); //去掉某些有非法的字元
        var editPregistDate = $('#editPregistPage_date').val();
        var editPregistTime = $('#editPregistPage_time').val().replace(':', '');

        
        if ($("#editPregistPage_doctor").val() == "" || $("#editPregistPage_time").val() == "") {
            alert("請填寫【約診日期】和【約診時間】");
            return;
        }

        $.ajax({
            type: "Post",
            dataType: 'json',
            url: 'http://' + clinicIP + '/webClinic/api/values/editPregist/' + user + "/" + password + "/" + pregistIkey + "/" + editPregistDoctorID + "/" + editPregistDoctorName + "/" + editPregistDate + "/" + editPregistTime + "/" + editPregistContext,
            crossDomain: true,
            timeout: 15000,
            error: function (error) {
                alert("儲存失敗!");
            },
            success: function (data) {
                alert("儲存成功");
                var backToPregistPageDoctorID = $("#pregistPage_doctor").val();
                window.location.replace('patients.html?id=' + id + '&pregistDate=' + pregistDate + '&doctorID=' + backToPregistPageDoctorID);
            },
        })
    });
})
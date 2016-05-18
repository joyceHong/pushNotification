// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var db = window.openDatabase("Database", "1.0", "clinicDatabase", 1000);

(function () {
    "use strict";
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
       
        //if (window.device.platform == "iOS" && parseFloat(window.device.version) >= 7.0)
        //{           
        //    $(".ui-header>*").css("margin-top", function (index, curValue) {
        //        return parseInt(curValue, 10) + 10 + 'px';
        //    });
        //}

        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);       
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        //alert("onPause");
    };
    function onResume() {
        //alert("onResume");
        // TODO: This application has been reactivated. Restore application state here.
    };
  
    //列表的功能
    function appandListView(obj, id, clinicName) {
        var gearLink = "<a href='#settingPage' id=clinic_" + id + "; data-position-to='window' data-transition='slidedown'>Purchase album</a></li>";
        obj.append("<li><a href='patients.html?id=" + id + "' data-ajax='false'><h2>" + clinicName + "</h2></a>" + gearLink).listview("refresh");
    }

    function formValidate(formElement) {
        formElement.validate({
            rules: {
                clinicName: {
                    required: true
                },
                clinicIP: {
                    required: true
                },
                user: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {
                clinicName: {
                    required: "【請勿空白】"
                },
                clinicIP: {
                    required: "【請勿空白】"
                },
                user: {
                    required: "【請勿空白】"
                },
                password: {
                    required: "【請勿空白】】"
                }
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().prev());
            },
            submitHandler: function (form) {
                $(':mobile-pagecontainer').pagecontainer('change', '#success', {
                    reload: false
                });
                return false;
            }
        });
    }

    //從資料庫列出診所的設定
    function listClinics() {
        if (db) {
            //如果沒有table ，自動產生table
            sqlList.executeNonQuery(db, "CREATE TABLE  IF NOT EXISTS  clinics (id INTEGER PRIMARY KEY AUTOINCREMENT, clinicName TEXT, clinicIP TEXT, user TEXT, password TEXT)");
            
            sqlList.executeSQL(db, "select * from clinics", function (objData) {
                $("#clinicList").empty(); //清空所有資料                
                for (var i = 0; i < objData.length; i++) {
                    appandListView($("#clinicList"), objData.item(i).id, objData.item(i).clinicName); //增加節點
                }

                //讀取設定資料
                $("#clinicList > li > a:last-child").on("click", function () {
                    //取得id值                    
                    var objID = $(this).attr('id');                    
                    var arr = objID.split('_');
                    var id = arr[1].replace(';', '');
                    $('#settingPage_hiddenClinic').val(id);
                    if (id != "") {
                        $("#settingPage_add").hide();
                        $("#settingPage_update").show();
                        $("#settingPage_delete").show();
                        
                        sqlList.executeSQL(db, "select * from clinics where id=" + id, function (readData) {
                            $("#settingPage_clinicName").val(readData.item(0).clinicName);
                            $("#settingPage_clinicIP").val(readData.item(0).clinicIP);
                            $("#settingPage_user").val(readData.item(0).user);
                            $("#settingPage_password").val(readData.item(0).password);
                        });
                    } else {
                        $("#settingPage_add").show();
                        $("#settingPage_update").hide();
                        $("#settingPage_delete").hide();
                    }
                });
            });
        }       
    }   
    
    //診所列表
    $(document).delegate("#clinicPage", "pageinit", function () {
        listClinics();
        $("#clinicPage_Add").click(function () {            
            $("#settingPage_hiddenClinic").val("");
            $("#settingPage_clinicName").val("");
            $("#settingPage_clinicIP").val("");
            $("#settingPage_user").val("");
            $("#settingPage_password").val("");
        })

        $("#closeAPP").click(function () {
            if (window.device.platform != "iOS") {
                alert("離開APP");
                navigator.app.exitApp();
            }
        })
    });
  
    //修改設定
    $(document).delegate("#settingPage", "pageinit", function () {
        $("#settingPage_delete").click(function (e) {
            var id = $("#settingPage_hiddenClinic").val();
            e.stopPropagation();
            sqlList.executeNonQueryWithID(db, "delete from clinics where id=?", id);
            listClinics();
            $("#settingPage_hiddenClinic").val("");
        });
      
        $("#settingPage_update").click(function (e) {
            var id = $("#settingPage_hiddenClinic").val();
            var clinicName = $("#settingPage_clinicName").val();
            var clinicIP =   $("#settingPage_clinicIP").val();
            var clinicUser = $("#settingPage_user").val();
            var clinicPassword = $("#settingPage_password").val();
            var form = $("#editForm");
            formValidate(form); //add validate message
            form.submit();  // form submits and dialog close

            if (clinicName != "" && clinicIP != "" || clinicUser != "" || clinicPassword != "") {

                var query = "update clinics set clinicName='" + clinicName + "',clinicIP = '" + clinicIP + "',user = '" + clinicUser + "',password ='" + clinicPassword + "' where id=?";
                sqlList.executeNonQueryWithID(db, query, id);
                alert("修改成功");
                listClinics();
                window.location.replace('index.html#clinicPage');
                $("#settingPage_hiddenClinic").val("");
            }
            e.stopPropagation();
        });
    })
    
    //新增設定
    $(document).delegate("#addSettingPage", "pageinit", function () {

       

        $("#addSettingPage_add").click(function () {
            var clinicName = $("#addSettingPage_clinicName").val();
            var clinicIP = $("#addSettingPage_clinicIP").val();
            var user = $("#addSettingPage_user").val();
            var password = $("#addSettingPage_password").val();
        
            var form = $("#addForm");
            formValidate(form); //add validate message
            form.submit();  // form submits and dialog close

            if (clinicName != "" && clinicIP != "" || user != "" || password !="") {            
                var sqlValue = "INSERT INTO clinics (clinicName,clinicIP,user,password) VALUES('" + clinicName + "'," + "'" + clinicIP + "','" + user + "','" + password + "')";
                sqlList.executeNonQuery(db, sqlValue);
                $("#addSettingPage_hiddenClinic").val("");
                $("#addSettingPage_clinicName").val("");
                $("#addSettingPage_clinicIP").val("");
                $("#addSettingPage_user").val("");
                $("#addSettingPage_password").val("");
                listClinics(); //顯示所有診所列表
                window.location.replace('index.html#clinicPage');
            }
        });


      
    })
})();



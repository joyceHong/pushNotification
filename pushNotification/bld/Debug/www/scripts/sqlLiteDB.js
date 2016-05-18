var db;
var sqlList = {
    openDB:function myfunction(dbName) {
        db = window.openDatabase("Database", "1.0", dbName, 1000);
        return db;
    },
    executeSQL: function myfunction(db, sqlcommand,  returnSuccessHandler) {
        db.transaction(selectDBTransactionSuccessHandler,
               errorHandler, function () { });

        function selectDBTransactionSuccessHandler(sqlTransaction) {
            sqlTransaction.executeSql(sqlcommand, [], successHandler, errorHandler);
        };

        function successHandler(sqlTransaction, sqlResultSet) {
            returnSuccessHandler(sqlResultSet.rows);
        }

        function errorHandler(errorCode) {
            console.log("executeSQL" + " sql: error");
            console.log(errorCode.err);
        };
    },
    executeNonQuery: function executeQuery(db, sqlcommand) {
        db.transaction(function (tx) {
            tx.executeSql(sqlcommand, [], function () { }, errorHandler);
        }, function errorCB(err) {
            alert("error");
            console.warn("Error processing SQL: " + err.code);
        }, function () {
        });

        function errorHandler(err) {
            alert("無法執行sql指令!" +sqlcommand + "錯誤碼" + err.code);
        }
    },
    executeNonQueryWithID: function (db, sqlcommand, id) {
        db.transaction(function (tx) {
            tx.executeSql(sqlcommand, [id], function () {
            });
        }, function errorCB(err) {
            alert("error");
            console.warn("Error processing SQL: " + err.code);
        }, function () {
            //alert("success");
        });

    }
};
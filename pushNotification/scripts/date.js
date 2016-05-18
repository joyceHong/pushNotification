function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateStringInRange);
    if (parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);
        if (month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
};
var change_date = function (dates, months, days) {
    var datestr = parseISO8601(dates);
    // 参数表示在当前日期下要增加的天数  
    var now = new Date(datestr);
    if (months != 0) {
        now.setMonth(now.getMonth() + months);
    }
    now.setDate((now.getDate() - 1) + 1 * days);
    var year = now.getFullYear();
    if (months != 0) {
        var month = now.getMonth() + 1;
    } else {
        var month = now.getMonth() + 1;
    }
    var day = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
};
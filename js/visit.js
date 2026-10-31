"use strict";
// jQuery 3.7.1: wait for fields before creating time choices and binding validation.
$(function () {
    $("#visit-date").attr("min",todayDate());
    const time=$("#visit-time").empty();
    for (const value of ["","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","23:00"]) {
        time.append($("<option>").val(value).text(value || "Choose a time"));
    }
    setupForm("visit","visit-plan-form","visit-form-result");
});

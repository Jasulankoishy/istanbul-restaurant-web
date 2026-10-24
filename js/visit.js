"use strict";
document.getElementById("visit-date").min = todayDate();
const visitTime = document.getElementById("visit-time");
visitTime.replaceChildren();
for (const time of ["", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "23:00"]) {
    const option = makeElement("option", time || "Choose a time");
    option.value = time;
    visitTime.appendChild(option);
}
setupForm("visit", "visit-plan-form", "visit-form-result");

"use strict";
function makeElement(tag, text, classes) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (classes) element.className = classes;
    return element;
}
function todayDate() {
    return new Intl.DateTimeFormat("en-CA", {timeZone: "Asia/Qyzylorda", year: "numeric", month: "2-digit", day: "2-digit"}).format(new Date());
}
function readBasket() {
    try {
        const data = JSON.parse(localStorage.getItem("istanbul-basket") || "[]");
        if (!Array.isArray(data)) return [];
        return data.filter(function (id) { return typeof id === "string"; }).slice(0, 200);
    } catch (error) { return []; }
}
function saveBasket(items) {
    try { localStorage.setItem("istanbul-basket", JSON.stringify(items)); }
    catch (error) { return false; }
    return true;
}
const navigation = document.getElementById("navigation-links");
if (navigation) {
    const item = makeElement("li", "", "nav-item");
    const link = makeElement("a", "Basket (" + readBasket().length + ")", "nav-link py-2");
    link.href = "menu.html#assignment-4";
    link.id = "shared-basket-link";
    item.appendChild(link);
    navigation.appendChild(item);
}

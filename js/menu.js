"use strict";
// jQuery 3.7.1 CDN loads before this file; ready waits until the page DOM exists.
$(function () {
function jqElement(tag, text, classes) {
    return $("<" + tag + ">").text(text).addClass(classes || "");
}

// assignment-4
// Simple meal basket: variables, arrays, operators, conditions, loops and functions.
const products = [
    {
        "id": "menemen",
        "name": "Turkish menemen",
        "category": "breakfast",
        "price": 1900
    },
    {
        "id": "gozleme",
        "name": "Gözleme",
        "category": "breakfast",
        "price": 2400
    },
    {
        "id": "cheese-toast",
        "name": "Cheese toast",
        "category": "breakfast",
        "price": 1500
    },
    {
        "id": "chicken-doner",
        "name": "Chicken döner on a plate",
        "category": "doner",
        "price": 2900
    },
    {
        "id": "beef-wrap",
        "name": "Beef döner in lavash",
        "category": "doner",
        "price": 2700
    },
    {
        "id": "chicken-iskender",
        "name": "Chicken Iskender kebab",
        "category": "doner",
        "price": 3100
    },
    {
        "id": "chicken-quesadilla",
        "name": "Chicken quesadilla",
        "category": "hot-dishes",
        "price": 3000
    },
    {
        "id": "meat-quesadilla",
        "name": "Meat quesadilla",
        "category": "hot-dishes",
        "price": 3200
    },
    {
        "id": "mixed-quesadilla",
        "name": "Mixed quesadilla",
        "category": "hot-dishes",
        "price": 3500
    },
    {
        "id": "margherita",
        "name": "Margherita",
        "category": "pizza",
        "price": 3000
    },
    {
        "id": "pepperoni",
        "name": "Pepperoni",
        "category": "pizza",
        "price": 3500
    },
    {
        "id": "four-seasons",
        "name": "Four Seasons",
        "category": "pizza",
        "price": 3750
    },
    {
        "id": "achuchuk",
        "name": "Achuchuk salad",
        "category": "salads",
        "price": 1500
    },
    {
        "id": "greek-salad",
        "name": "Greek salad",
        "category": "salads",
        "price": 2700
    },
    {
        "id": "chicken-caesar",
        "name": "Chicken Caesar",
        "category": "salads",
        "price": 2700
    },
    {
        "id": "lentil-soup",
        "name": "Lentil soup",
        "category": "soups",
        "price": 1500
    },
    {
        "id": "chicken-soup",
        "name": "Chicken soup",
        "category": "soups",
        "price": 1900
    },
    {
        "id": "ishkembe",
        "name": "İşkembe soup",
        "category": "soups",
        "price": 2200
    }
];
let basket = [];
for (const id of readBasket()) {
    const product = products.find(function (item) { return item.id === id; });
    if (product) basket.push(product);
}

const categoryFilter = $("#category-filter");
const priceFilter = $("#price-filter");
const basketList = $("#basket-list");

// Data helpers are also used when rendering and calculating the basket.
function findProduct(items, id) {
    return items.find(function (item) { return item.id === id; });
}
function getQuantity(items, id) {
    let quantity = 0;
    for (const item of items) {
        if (item.id === id) quantity++;
    }
    return quantity;
}
function filterProducts(items, category, price, query) {
    return items.filter(function (item) {
        const categoryMatches = category === "all" || item.category === category;
        const priceMatches = price === "" || item.price <= Number(price);
        const nameMatches = item.name.toLowerCase().includes(query.trim().toLowerCase());
        return categoryMatches && priceMatches && nameMatches;
    });
}
function createDishRow(product) {
    const row = jqElement("li", "", "d-flex flex-wrap justify-content-between gap-2 border-top py-3").attr("id", "dish-" + product.id);
    const actions = jqElement("div", "", "dish-actions");
    actions.append(jqElement("strong", product.price.toLocaleString("en-US") + " ₸", "text-nowrap"));
    actions.append(jqElement("button", "+", "dish-add").attr({type: "button", "data-dish": product.id, "aria-label": "Add " + product.name + " to basket"}));
    return row.append(jqElement("span", product.name), actions);
}
function renderProducts(items) {
    $("#menu-items article").each(function () {
        const card = $(this);
        const category = card.attr("id").replace("category-", "");
        const list = card.find("ul").empty();
        for (const product of items) {
            if (product.category === category) list.append(createDishRow(product));
        }
        card.parent().toggleClass("d-none", list.children().length === 0);
    });
    return items.length;
}
function showProducts() {
    const matches = filterProducts(products, categoryFilter.val(), priceFilter.val(), menuSearch.val());
    const count = renderProducts(matches);
    menuCount.text(count + " of " + products.length + " dishes found");
    $("#menu-empty").prop("hidden", count !== 0);
}

function addToBasket(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            basket.push(products[i]);
            break;
        }
    }
    showBasket();
}

function calculateTotal(items) {
    let total = 0;
    for (const item of items) total += item.price;
    return total;
}
function changeQuantity(id, amount) {
    const product = findProduct(products, id);
    if (!product) return;
    if (amount > 0) {
        basket.push(product);
    } else {
        const index = basket.findIndex(function (item) { return item.id === id; });
        if (index !== -1) basket.splice(index, 1);
    }
    showBasket();
}
function removeProduct(id) {
    basket = basket.filter(function (item) { return item.id !== id; });
    showBasket();
}

function showBasket() {
    checkout.prop("disabled", basket.length === 0);
    orderPanel.stop(true, true).hide();
    orderResult.empty();
    const stored = saveBasket(basket.map(function (product) { return product.id; }));
    $("#shared-basket-link").text("Basket (" + basket.length + ")");
    basketList.empty();
    for (const product of products) {
        const quantity = getQuantity(basket, product.id);
        if (quantity > 0) {
            const item = jqElement("li", "", "basket-row").attr("data-dish", product.id);
            item.append(jqElement("span", product.name + " × " + quantity));
            item.append(jqElement("strong", product.price * quantity + " ₸"));
            const controls = jqElement("div", "", "d-flex flex-wrap gap-2 basket-controls");
            for (const action of ["−", "+", "Remove"]) {
                controls.append(jqElement("button", action, "btn btn-outline-dark btn-sm").attr({type: "button", "data-action": action, "aria-label": (action === "−" ? "Decrease " : action === "+" ? "Increase " : "Remove ") + product.name}));
            }
            basketList.append(item.append(controls));
        }
    }
    if (basket.length === 0) basketList.text("Your basket is empty.");
    $("#basket-summary").text(basket.length + " portions · " + calculateTotal(basket) + " ₸");
    $("#basket-total").text("Total: " + calculateTotal(basket) + " ₸" + (stored ? "" : " · Browser storage unavailable; basket lasts on this page only."));
}

function clearBasket() {
    basket = [];
    showBasket();
}

// .append/.text/.val replace createElement/appendChild/textContent/value.
// Rendering is shorter; data calculations remain plain JavaScript because jQuery adds no benefit there.
const searchGroup = jqElement("div", "", "mb-3").prependTo(".menu-tools");
const menuSearch = jqElement("input", "", "form-control mb-2").attr({id: "menu-search", type: "search", placeholder: "Dish name"});
const resetFilters = jqElement("button", "Reset filters", "btn btn-outline-dark btn-sm").attr("type", "button");
const menuCount = jqElement("p", "", "small mt-2").attr("role", "status");
searchGroup.append(jqElement("label", "Search dishes", "form-label").attr("for", "menu-search"), menuSearch, resetFilters, menuCount);
menuSearch.on("input", showProducts);
categoryFilter.on("change", showProducts);
priceFilter.on("input", showProducts);
resetFilters.on("click", function () {
    categoryFilter.val("all"); priceFilter.val(""); menuSearch.val("");
    showProducts(); menuSearch.trigger("focus");
});
// Delegation belongs to the existing parent: filter rendering recreates the buttons,
// so direct binding to the original .dish-add collection would miss new buttons.
$("#menu-items").on("click", ".dish-add", function () {
    addToBasket($(this).attr("data-dish"));
});
basketList.on("click", "button[data-action]", function () {
    const button = $(this);
    const id = button.closest("li").attr("data-dish");
    const action = button.attr("data-action");
    if (action === "Remove") removeProduct(id);
    else changeQuantity(id, action === "+" ? 1 : -1);
    const next = basketList.find('li[data-dish="' + id + '"] button[data-action="' + action + '"]');
    (next.length ? next : $("#clear-basket")).trigger("focus");
});
$("#clear-basket").on("click", clearBasket);
const checkout = jqElement("button", "Review order", "btn btn-warning btn-sm ms-2").attr({type:"button",id:"basket-checkout"}).insertAfter("#clear-basket");
const orderPanel = jqElement("section", "", "border rounded p-3 mt-3").attr("aria-label", "Review demonstration order").hide().insertAfter(checkout);
const orderSummary = jqElement("div", "");
const confirmOrder = jqElement("button", "Confirm demo order", "btn btn-warning btn-sm").attr("type","button");
const cancelOrder = jqElement("button", "Back to basket", "btn btn-outline-dark btn-sm ms-2").attr("type","button");
orderPanel.append(orderSummary, jqElement("p", "Demonstration only. No order or payment is sent to the restaurant.", "small mt-3"), confirmOrder, cancelOrder);
const orderResult = jqElement("div", "", "mt-3 text-break").attr({role:"status",tabindex:-1}).insertAfter(orderPanel);
checkout.on("click", function () {
    if (!basket.length) return;
    const lines = basketList.clone().removeAttr("id aria-live");
    lines.find(".basket-controls").remove();
    orderSummary.empty().append(jqElement("h3", "Review your order", "h5"), lines, jqElement("p", basket.length + " portions · Total: " + calculateTotal(basket) + " ₸", "fw-bold mt-3"));
    orderResult.empty(); confirmOrder.prop("disabled",false);
    orderPanel.stop(true,true).slideDown(200, function () { confirmOrder.trigger("focus"); });
});
cancelOrder.on("click", function () {
    orderPanel.stop(true,true).slideUp(200, function () { checkout.trigger("focus"); });
});
confirmOrder.on("click", function () {
    if (!basket.length || $(this).prop("disabled")) return;
    $(this).prop("disabled",true);
    const receipt = orderSummary.clone();
    const reference = "DEMO-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random()*10000).toString().padStart(4,"0");
    basket = []; showBasket();
    orderResult.append(jqElement("h3", "Demo order " + reference, "h5"), receipt,
        jqElement("p", "Local demonstration only: the restaurant has NOT received this order and no payment was taken."),
        jqElement("a", "Call the restaurant to order", "btn btn-outline-dark btn-sm").attr("href","tel:+77021006288"));
    orderResult.hide().fadeIn(200, function () { $(this).trigger("focus"); });
});
showProducts(); showBasket();

});

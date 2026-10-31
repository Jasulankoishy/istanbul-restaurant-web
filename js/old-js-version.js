// Previous plain JavaScript versions. Comparison only: do not load this file.

// menu.js
(function () {
"use strict";
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

const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const basketList = document.getElementById("basket-list");

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
    const row = makeElement("li", "", "d-flex flex-wrap justify-content-between gap-2 border-top py-3");
    row.id = "dish-" + product.id;
    const name = makeElement("span", product.name);
    const actions = makeElement("div", "", "dish-actions");
    actions.appendChild(makeElement("strong", product.price.toLocaleString("en-US") + " ₸", "text-nowrap"));
    const add = makeElement("button", "+", "dish-add");
    add.type = "button";
    add.dataset.dish = product.id;
    add.setAttribute("aria-label", "Add " + product.name + " to basket");
    add.addEventListener("click", function () { addToBasket(product.id); });
    actions.appendChild(add);
    row.append(name, actions);
    return row;
}
function renderProducts(items) {
    const cards = document.querySelectorAll("#menu-items article");
    for (const card of cards) {
        const category = card.id.replace("category-", "");
        const list = card.querySelector("ul");
        list.replaceChildren();
        for (const product of items) {
            if (product.category === category) list.appendChild(createDishRow(product));
        }
        card.parentElement.classList.toggle("d-none", list.children.length === 0);
    }
    return items.length;
}
function showProducts() {
    const matches = filterProducts(products, categoryFilter.value, priceFilter.value, menuSearch.value);
    const count = renderProducts(matches);
    menuCount.textContent = count + " of " + products.length + " dishes found";
    document.getElementById("menu-empty").hidden = count !== 0;
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
    checkout.disabled = basket.length === 0;
    orderPanel.classList.add("d-none");
    orderResult.replaceChildren();
    const stored = saveBasket(basket.map(function (product) { return product.id; }));
    const sharedLink = document.getElementById("shared-basket-link");
    if (sharedLink) sharedLink.textContent = "Basket (" + basket.length + ")";

    basketList.replaceChildren();
    // Show repeated dishes once, with the number of portions.
    for (let i = 0; i < products.length; i++) {
        const quantity = getQuantity(basket, products[i].id);
        if (quantity > 0) {
            const item = document.createElement("li");
            item.className = "basket-row";
            const name = document.createElement("span");
            name.textContent = products[i].name + " × " + quantity;
            const price = document.createElement("strong");
            price.textContent = products[i].price * quantity + " ₸";
            item.appendChild(name);
            item.appendChild(price);
            const controls = makeElement("div", "", "d-flex flex-wrap gap-2 basket-controls");
            for (const action of ["−", "+", "Remove"]) {
                const button = makeElement("button", action, "btn btn-outline-dark btn-sm");
                button.type = "button";
                button.setAttribute("aria-label", (action === "−" ? "Decrease " : action === "+" ? "Increase " : "Remove ") + products[i].name);
                button.addEventListener("click", function () {
                    if (action === "Remove") removeProduct(products[i].id);
                    else changeQuantity(products[i].id, action === "+" ? 1 : -1);
                    const next = basketList.querySelector('button[aria-label="' + button.getAttribute("aria-label") + '"]');
                    if (next) next.focus();
                    else checkout.focus();
                });
                controls.appendChild(button);
            }
            item.appendChild(controls);
            basketList.appendChild(item);
        }
    }
    if (basket.length === 0) {
        basketList.textContent = "Your basket is empty.";
    }
    const total = calculateTotal(basket);
    document.getElementById("basket-summary").textContent = basket.length + " portions · " + total + " ₸";
    document.getElementById("basket-total").textContent = "Total: " + total + " ₸" + (stored ? "" : " · Browser storage unavailable; basket lasts on this page only.");
}

function clearBasket() {
    basket = [];
    showBasket();
}

// Connected controls share the same filtering function.
const searchLabel = makeElement("label", "Search dishes", "form-label");
searchLabel.htmlFor = "menu-search";
const menuSearch = makeElement("input", "", "form-control mb-2");
menuSearch.type = "search";
menuSearch.id = "menu-search";
menuSearch.placeholder = "Dish name";
const searchGroup = makeElement("div", "", "mb-3");
searchGroup.append(searchLabel, menuSearch);
document.querySelector(".menu-tools").prepend(searchGroup);
const resetFilters = makeElement("button", "Reset filters", "btn btn-outline-dark btn-sm");
resetFilters.type = "button";
const menuCount = makeElement("p", "", "small mt-2");
menuCount.setAttribute("role", "status");
searchGroup.append(resetFilters, menuCount);
menuSearch.addEventListener("input", showProducts);
resetFilters.addEventListener("click", function () {
    categoryFilter.value = "all";
    priceFilter.value = "";
    menuSearch.value = "";
    showProducts();
    menuSearch.focus();
});

// Demonstration checkout: no order is sent to the restaurant.
const checkout = makeElement("button", "Review order", "btn btn-warning btn-sm ms-2");
checkout.type = "button";
checkout.id = "basket-checkout";
document.getElementById("clear-basket").after(checkout);
const orderPanel = makeElement("section", "", "border rounded p-3 mt-3 d-none");
orderPanel.setAttribute("aria-label", "Review demonstration order");
const orderSummary = makeElement("div", "");
const orderNotice = makeElement("p", "Demonstration only. No order or payment is sent to the restaurant.", "small mt-3");
const confirmOrder = makeElement("button", "Confirm demo order", "btn btn-warning btn-sm");
confirmOrder.type = "button";
const cancelOrder = makeElement("button", "Back to basket", "btn btn-outline-dark btn-sm ms-2");
cancelOrder.type = "button";
orderPanel.append(orderSummary, orderNotice, confirmOrder, cancelOrder);
const orderResult = makeElement("div", "", "mt-3 text-break");
orderResult.setAttribute("role", "status");
orderResult.tabIndex = -1;
checkout.after(orderPanel, orderResult);
checkout.addEventListener("click", function () {
    if (basket.length === 0) return;
    orderSummary.replaceChildren(makeElement("h3", "Review your order", "h5"));
    const lines = basketList.cloneNode(true);
    for (const controls of lines.querySelectorAll(".basket-controls")) controls.remove();
    lines.removeAttribute("id");
    lines.removeAttribute("aria-live");
    orderSummary.appendChild(lines);
    orderSummary.appendChild(makeElement("p", basket.length + " portions · Total: " + calculateTotal(basket) + " ₸", "fw-bold mt-3"));
    orderPanel.classList.remove("d-none");
    orderResult.replaceChildren();
    confirmOrder.disabled = false;
    confirmOrder.focus();
});
cancelOrder.addEventListener("click", function () {
    orderPanel.classList.add("d-none");
    checkout.focus();
});
confirmOrder.addEventListener("click", function () {
    if (basket.length === 0 || confirmOrder.disabled) return;
    confirmOrder.disabled = true;
    const total = calculateTotal(basket);
    const quantity = basket.length;
    const receipt = orderSummary.cloneNode(true);
    const reference = "DEMO-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    basket = [];
    showBasket();
    orderResult.appendChild(makeElement("h3", "Demo order " + reference, "h5"));
    orderResult.appendChild(receipt);
    orderResult.appendChild(makeElement("p", quantity + " portions · " + total + " ₸. This is a local demonstration. The restaurant has NOT received this order; no payment was taken."));
    const call = makeElement("a", "Call the restaurant to order", "btn btn-outline-dark btn-sm");
    call.href = "tel:+77021006288";
    orderResult.appendChild(call);
    orderResult.focus();
});

categoryFilter.addEventListener("change", showProducts);
priceFilter.addEventListener("input", showProducts);
document.getElementById("clear-basket").addEventListener("click", clearBasket);
showProducts();
showBasket();

})();

// faq.js
(function () {
"use strict";
const faqItems = document.getElementById("faq-items");
const searchBox = makeElement("div", "", "mb-4");
const label = makeElement("label", "Search questions", "form-label");
label.htmlFor = "faq-search";
const search = makeElement("input", "", "form-control mb-2");
search.id = "faq-search";
search.type = "search";
const reset = makeElement("button", "Reset search", "btn btn-outline-dark btn-sm");
reset.type = "button";
const count = makeElement("p", "", "small mt-2");
count.setAttribute("role", "status");
searchBox.append(label, search, reset, count);
faqItems.before(searchBox);
function filterQuestions() {
    const query = search.value.trim().toLowerCase();
    let matches = 0;
    for (const article of faqItems.querySelectorAll("article")) {
        const visible = article.textContent.toLowerCase().includes(query);
        article.classList.toggle("d-none", !visible);
        if (visible) matches++;
    }
    count.textContent = matches ? matches + " questions found" : "No questions found. Reset the search or prepare a question below.";
}
search.addEventListener("input", filterQuestions);
reset.addEventListener("click", function () { search.value = ""; filterQuestions(); search.focus(); });
filterQuestions();
setupForm("faq", "faq-question-form", "question-result");

})();

// visit.js
(function () {
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

})();

// forms.js
(function () {
"use strict";
function fieldError(field) {
    const value = field.value.trim();
    if (field.type === "radio") {
        return field.form.querySelector('input[name="' + field.name + '"]:checked') ? "" : "Choose an option.";
    }
    if (field.type === "checkbox") return field.checked ? "" : "Please acknowledge the demonstration notice.";
    if (field.required && value === "") return "Please complete this field.";
    if (value === "") return "";
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    if (field.type === "tel" && !/^\+?[\d\s()\-]+$/.test(value)) return "Use a valid phone number.";
    if (field.type === "tel" && (value.replace(/\D/g, "").length < 10 || value.replace(/\D/g, "").length > 15)) return "Enter 10–15 phone digits.";
    if (field.type === "number" && (!Number.isInteger(Number(value)) || Number(value) < Number(field.min) || Number(value) > Number(field.max))) return "Enter a whole number from " + field.min + " to " + field.max + ".";
    if (field.type === "date") {
        if (!field.validity.valid) return "Choose a valid date.";
        if (field.id.startsWith("feedback") && value > todayDate()) return "A review cannot describe a future visit.";
        if (!field.id.startsWith("feedback") && value < todayDate()) return "Choose today or a future date.";
    }
    if (field.tagName === "TEXTAREA" && (value.length < 10 || value.length > 1500)) return "Write between 10 and 1500 characters.";
    if (field.autocomplete === "name" && value.length < 2) return "Enter at least two characters.";
    return "";
}
function markField(field, message) {
    let error = document.getElementById(field.id + "-error");
    if (!error) {
        error = makeElement("span", "", "invalid-feedback");
        error.id = field.id + "-error";
        field.parentElement.appendChild(error);
        field.setAttribute("aria-describedby", error.id);
    }
    error.textContent = message;
    error.classList.toggle("d-none", message === "");
    error.classList.toggle("d-block", message !== "");
    field.classList.toggle("is-invalid", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
}
function setupForm(prefix, formId, resultId, onSuccess) {
    const form = document.getElementById(formId);
    form.noValidate = true;
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    const result = document.getElementById(resultId);
    const summary = document.getElementById(prefix + "-summary");
    const live = makeElement("p", "Complete the fields to see your summary.", "small border rounded p-3 mt-3");
    live.setAttribute("aria-live", "polite");
    form.querySelector('button[type="submit"]').parentElement.before(live);
    function clearResult() {
        result.querySelector(".form-result").classList.remove("d-block");
        result.querySelector(".result-idle").classList.remove("d-none");
        summary.replaceChildren();
    }
    function updateSummary() {
        const parts = [];
        for (const field of fields) {
            if (["date", "time", "number"].includes(field.type) || field.tagName === "SELECT" || (field.type === "radio" && field.checked)) {
                if (field.value) parts.push(field.value);
            }
        }
        live.textContent = parts.length ? "Your choices: " + parts.join(" · ") : "Complete the fields to see your summary.";
    }
    function validate(field) {
        let message = fieldError(field);
        if (prefix === "visit" && field.id === "visit-time") {
            const date = document.getElementById("visit-date").value;
            const when = new Date(date + "T" + field.value + ":00+05:00");
            if (date && field.value && when <= new Date()) message = "Choose a future visit time.";
        }
        markField(field, message);
        return message === "";
    }
    for (const field of fields) {
        field.addEventListener("input", function () {
            clearResult();
            if (field.getAttribute("aria-invalid") === "true") validate(field);
            updateSummary();
        });
        field.addEventListener("change", function () { clearResult(); validate(field); updateSummary(); });
        if (field.tagName === "TEXTAREA") {
            let counter = prefix === "visit" ? document.getElementById("note-counter") : null;
            if (!counter) { counter = makeElement("p", "", "form-text"); field.after(counter); }
            function count() { counter.textContent = "Characters: " + field.value.length + " / 1500"; }
            field.addEventListener("input", count);
            form.addEventListener("reset", function () { setTimeout(count, 0); });
            count();
        }
    }
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearResult();
        let firstInvalid = null;
        for (const field of fields) {
            if (!validate(field) && firstInvalid === null) firstInvalid = field;
        }
        if (firstInvalid) { firstInvalid.focus(); return; }
        for (const field of fields) {
            if (field.type === "checkbox" || field.type === "radio" && !field.checked) continue;
            const label = form.querySelector('label[for="' + field.id + '"]');
            summary.appendChild(makeElement("p", (label ? label.textContent.trim() : field.name) + ": " + field.value.trim(), "text-break mb-2"));
        }
        document.getElementById(prefix + "-confirmation").textContent = "Demonstration only. No data is sent to a server; no booking or order is created.";
        result.querySelector(".form-result").classList.add("d-block");
        result.querySelector(".result-idle").classList.add("d-none");
        if (onSuccess) onSuccess(form);
        result.focus();
    });
    form.addEventListener("reset", function () {
        clearResult();
        for (const field of fields) { markField(field, ""); field.removeAttribute("aria-invalid"); }
        setTimeout(updateSummary, 0);
    });
}

})();

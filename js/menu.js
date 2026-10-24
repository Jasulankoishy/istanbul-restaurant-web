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

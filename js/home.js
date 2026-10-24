"use strict";
const featured = [
    {name: "Turkish menemen", price: 1900},
    {name: "Chicken döner on a plate", price: 2900},
    {name: "Margherita", price: 3000},
    {name: "Lentil soup", price: 1500}
];
const suggestion = featured[Math.floor(Math.random() * featured.length)];
const preview = document.getElementById("menu-preview-title");
const card = makeElement("div", "", "border rounded p-3 mb-4 bg-body text-dark");
card.appendChild(makeElement("p", "Something to try", "small text-brand-accent fw-bold mb-2"));
card.appendChild(makeElement("h3", suggestion.name, "h4"));
card.appendChild(makeElement("p", suggestion.price + " ₸ · A random menu suggestion, subject to availability."));
const menuLink = makeElement("a", "Choose from the menu →", "btn btn-warning");
menuLink.href = "menu.html#categories";
card.appendChild(menuLink);
preview.after(card);

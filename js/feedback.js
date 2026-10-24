"use strict";
document.getElementById("feedback-date").max = todayDate();
const reviewForm = document.getElementById("feedback-review-form");
const ratingLabel = makeElement("label", "Rating", "form-label d-block mt-3");
ratingLabel.htmlFor = "feedback-rating";
const rating = makeElement("select", "", "form-select");
rating.id = "feedback-rating";
rating.name = "rating";
rating.required = true;
for (let i = 0; i <= 5; i++) {
    const option = makeElement("option", i === 0 ? "Choose a rating" : i + " / 5");
    option.value = i === 0 ? "" : String(i);
    rating.appendChild(option);
}
reviewForm.querySelector("textarea").parentElement.before(ratingLabel, rating);
const reviews = makeElement("section", "", "mt-4");
reviews.setAttribute("aria-label", "Local demonstration reviews");
const empty = makeElement("p", "No local reviews yet. Reviews disappear when this page is reloaded.", "small");
reviews.appendChild(empty);
reviewForm.after(reviews);
function renderReview(review) {
    const card = makeElement("article", "", "border rounded p-3 mb-3 text-break");
    card.appendChild(makeElement("h3", review.name + " · " + review.rating + "/5", "h5"));
    card.appendChild(makeElement("p", review.text));
    card.appendChild(makeElement("p", review.date + " · Local demonstration", "small text-body-secondary"));
    const remove = makeElement("button", "Remove", "btn btn-outline-dark btn-sm");
    remove.type = "button";
    remove.addEventListener("click", function () { card.remove(); empty.classList.toggle("d-none", reviews.querySelector("article") !== null); });
    card.appendChild(remove);
    return card;
}
let previousReview = "";
setupForm("feedback", "feedback-review-form", "feedback-result", function () {
    const review = {name: document.getElementById("feedback-name").value.trim(), text: document.getElementById("feedback-message").value.trim(), rating: rating.value, date: new Date().toLocaleString("en-GB", {timeZone: "Asia/Qyzylorda"})};
    const key = JSON.stringify([review.name, review.text, review.rating]);
    if (key === previousReview) {
        document.getElementById("feedback-confirmation").textContent = "This review is already displayed. No data was sent.";
        return;
    }
    previousReview = key;
    empty.classList.add("d-none");
    reviews.appendChild(renderReview(review));
});

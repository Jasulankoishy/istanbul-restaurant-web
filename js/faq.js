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

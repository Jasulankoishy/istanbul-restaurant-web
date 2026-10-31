"use strict";
// jQuery 3.7.1; ready ensures the existing FAQ container is available.
$(function () {
    // .find/.each/.toggleClass replace querySelectorAll and classList.
    // jQuery makes traversal and answer effects shorter than the old version.
    const items = $("#faq-items");
    const box = $("<div>").addClass("mb-4").insertBefore(items);
    const search = $("<input>").attr({id:"faq-search",type:"search"}).addClass("form-control mb-2");
    const reset = $("<button>").attr("type","button").addClass("btn btn-outline-dark btn-sm").text("Reset search");
    const count = $("<p>").attr("role","status").addClass("small mt-2");
    box.append($("<label>").attr("for","faq-search").addClass("form-label").text("Search questions"),search,reset,count);
    items.find("article").each(function (index) {
        const article = $(this);
        const answer = article.find("p").attr("id","faq-answer-"+index).hide();
        const title = article.find("h3");
        const button = $("<button>").attr({type:"button","aria-expanded":"false","aria-controls":answer.attr("id")}).addClass("btn btn-outline-dark text-start").text(title.text());
        title.empty().append(button);
    });
    // Parent delegation also works if another FAQ card is appended later.
    items.on("click","h3 button",function () {
        const button = $(this);
        const answer = button.closest("h3").siblings("p");
        const expanded = button.attr("aria-expanded") === "true";
        button.attr("aria-expanded",String(!expanded));
        answer.stop(true,true).slideToggle(200);
    });
    function filterQuestions() {
        const query = search.val().trim().toLowerCase(); let matches = 0;
        items.find("article").each(function () {
            const visible = $(this).text().toLowerCase().includes(query);
            $(this).toggleClass("d-none",!visible); if (visible) matches++;
        });
        count.text(matches ? matches+" questions found" : "No questions found. Reset the search or prepare a question below.");
    }
    search.on("input",filterQuestions);
    reset.on("click",function () { search.val(""); filterQuestions(); search.trigger("focus"); });
    filterQuestions();
    setupForm("faq","faq-question-form","question-result");
});

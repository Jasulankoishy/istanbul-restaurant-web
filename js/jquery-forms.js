"use strict";
// jQuery 3.7.1 replaces field lookup, DOM insertion and addEventListener with jQuery.
// Validation rules are similar in length; field updates and traversal are clearer.
function setupForm(prefix, formId, resultId) {
    const form = $("#"+formId).prop("noValidate",true);
    const fields = form.find("input, select, textarea");
    const result = $("#"+resultId);
    const summary = $("#"+prefix+"-summary");
    const live = $("<p>").addClass("small border rounded p-3 mt-3").attr("aria-live","polite");
    form.find('button[type="submit"]').parent().before(live);
    let submitted = false;
    function message(field) {
        const value = String(field.val() || "").trim(); const type = field.attr("type");
        if (type === "radio") return form.find('input[name="'+field.attr("name")+'"]:checked').length ? "" : "Choose an option.";
        // attr reads the original HTML attribute; prop reads the current checkbox state.
        if (type === "checkbox") return field.prop("checked") ? "" : "Please acknowledge the demonstration notice.";
        if (field.prop("required") && !value) return "Please complete this field.";
        if (!value) return "";
        if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
        if (type === "tel" && (!/^\+?[\d\s()\-]+$/.test(value) || value.replace(/\D/g,"").length < 10 || value.replace(/\D/g,"").length > 15)) return "Enter a valid phone number with 10–15 digits.";
        if (type === "number" && (!Number.isInteger(Number(value)) || Number(value)<Number(field.attr("min")) || Number(value)>Number(field.attr("max")))) return "Enter a whole number from "+field.attr("min")+" to "+field.attr("max")+".";
        if (type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value<todayDate())) return "Choose today or a future date.";
        if (field.is("textarea") && (value.length<10 || value.length>1500)) return "Write between 10 and 1500 characters.";
        if (field.attr("autocomplete")==="name" && value.length<2) return "Enter at least two characters.";
        if (prefix==="visit" && field.attr("id")==="visit-time") {
            const date = form.find('#visit-date').val();
            if (date && new Date(date+"T"+value+":00+05:00")<=new Date()) return "Choose a future visit time.";
        }
        return "";
    }
    function validate(field) {
        const errorMessage = message(field);
        let error = $("#"+field.attr("id")+"-error");
        if (!error.length) {
            error = $("<span>").attr("id",field.attr("id")+"-error").addClass("invalid-feedback").appendTo(field.parent());
            field.attr("aria-describedby",error.attr("id"));
        }
        // Chain: set error text, hide when valid, and display when invalid.
        error.text(errorMessage).toggleClass("d-none",!errorMessage).toggleClass("d-block",!!errorMessage);
        field.toggleClass("is-invalid",!!errorMessage).toggleClass("is-valid",!errorMessage).attr("aria-invalid",String(!!errorMessage));
        return !errorMessage;
    }
    function updateLive() {
        const parts=[];
        fields.filter('select, input[type="date"], input[type="number"], input:checked').each(function () {
            if ($(this).attr("type")!=="checkbox" && $(this).val()) parts.push($(this).val());
        });
        live.text(parts.length ? "Your choices: "+parts.join(" · ") : "Complete the fields to see your summary.");
        form.find("textarea").each(function () { $("#"+prefix+"-counter").text("Characters: "+$(this).val().length+" / 1500"); });
    }
    const counter = prefix==="visit" ? $("#note-counter").attr("id","visit-counter") : $("<p>").attr("id",prefix+"-counter").addClass("form-text").insertAfter(form.find("textarea"));
    function clearResult() { result.find(".form-result").stop(true,true).removeClass("d-block").hide(); result.find(".result-idle").removeClass("d-none"); summary.empty(); }
    form.on("input change","input, select, textarea",function () {
        const field=$(this); clearResult();
        if (submitted || field.hasClass("is-invalid") || field.hasClass("is-valid")) validate(field);
        if (field.attr("type")==="radio") form.find('input[name="'+field.attr("name")+'"]:not(:checked)').each(function () { if (submitted) validate($(this)); });
        if (field.attr("id")==="visit-date" && submitted) validate($("#visit-time"));
        updateLive();
    });
    form.on("submit",function (event) {
        // Without preventDefault the GET form would navigate and put contact data in the URL.
        event.preventDefault(); submitted=true; clearResult(); let first=null;
        fields.each(function () { const field=$(this); if (!validate(field) && !first) first=field; });
        if (first) { first.trigger("focus"); return; }
        fields.each(function () {
            const field=$(this); const type=field.attr("type");
            if (type==="checkbox" || type==="radio" && !field.prop("checked")) return;
            const label=form.find('label[for="'+field.attr("id")+'"]').text().trim() || field.attr("name");
            summary.append($("<p>").addClass("text-break mb-2").text(label+": "+String(field.val()).trim()));
        });
        const receipt=summary.children().clone();
        form.trigger("reset"); summary.append(receipt);
        // .html is only for fixed trusted markup; visitor values above always use .text.
        $("#"+prefix+"-confirmation").html("<strong>Demonstration only.</strong> No data was sent and no booking was created.");
        result.find(".result-idle").addClass("d-none");
        result.find(".form-result").addClass("d-block").hide().fadeIn(200,function () { result.trigger("focus"); });
        // Browser checks improve feedback but can be bypassed; a real server must validate again.
    });
    form.on("reset",function () {
        submitted=false; clearResult(); fields.removeClass("is-invalid is-valid").removeAttr("aria-invalid");
        form.find(".invalid-feedback").text("").addClass("d-none").removeClass("d-block");
        setTimeout(updateLive,0);
    });
    updateLive();
}

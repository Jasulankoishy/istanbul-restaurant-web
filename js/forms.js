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

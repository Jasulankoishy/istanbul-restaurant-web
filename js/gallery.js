"use strict";
const photos = Array.from(document.querySelectorAll("#gallery-items figure img"));
const viewer = document.createElement("dialog");
viewer.className = "photo-viewer border rounded p-3 bg-body";
viewer.setAttribute("aria-label", "Photo viewer");
const image = makeElement("img", "", "img-fluid rounded d-block mx-auto");
image.classList.add("photo-viewer-image");
const caption = makeElement("p", "", "mt-2 text-center");
caption.setAttribute("aria-live", "polite");
const controls = makeElement("div", "", "d-flex flex-wrap justify-content-center gap-2");
let current = 0;
function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    image.src = photos[current].src;
    image.alt = photos[current].alt;
    caption.textContent = (current + 1) + " / " + photos.length + " · " + photos[current].closest("figure").querySelector("figcaption").textContent;
}
for (const action of ["Previous", "Next", "Close"]) {
    const button = makeElement("button", action, "btn btn-outline-dark btn-sm");
    button.type = "button";
    button.addEventListener("click", function () {
        if (action === "Close") viewer.close();
        else showPhoto(current + (action === "Next" ? 1 : -1));
    });
    controls.appendChild(button);
}
viewer.append(image, caption, controls);
document.body.appendChild(viewer);
for (let i = 0; i < photos.length; i++) {
    const button = makeElement("button", "Open photo", "btn btn-outline-dark btn-sm mt-2");
    button.type = "button";
    button.setAttribute("aria-label", "Open photo: " + photos[i].alt);
    button.addEventListener("click", function () { showPhoto(i); viewer.showModal(); });
    photos[i].closest("figure").appendChild(button);
}
viewer.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        showPhoto(current + (event.key === "ArrowRight" ? 1 : -1));
    }
});

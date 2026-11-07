"use strict";
const photos = Array.from(document.querySelectorAll("#gallery-items figure img"));
const insidePhotos = ["restaurant-interior-table.jpg", "restaurant-dining-room.jpg"];
let visiblePhotos = photos;
const gallery = document.getElementById("gallery-items");
const filter = makeElement("select", "", "form-select mb-2");
filter.id = "gallery-filter";
const label = makeElement("label", "Show photos", "form-label");
label.htmlFor = filter.id;
const count = makeElement("p", "", "small");
count.setAttribute("role", "status");
for (const [value, title] of [["all", "All photos"], ["inside", "Inside"], ["outside", "Outside"]]) {
    const option = makeElement("option", title);
    option.value = value;
    filter.appendChild(option);
}
gallery.prepend(label, filter, count);

function photoCategory(photo) {
    const filename = photo.getAttribute("src").split("/").pop();
    return insidePhotos.includes(filename) ? "inside" : "outside";
}

function updateGallery() {
    visiblePhotos = photos.filter(photo => filter.value === "all" || photoCategory(photo) === filter.value);
    for (const photo of photos) {
        photo.closest("figure").classList.toggle("d-none", !visiblePhotos.includes(photo));
    }
    count.textContent = visiblePhotos.length ? visiblePhotos.length + " photos" : "No photos found.";
}
filter.addEventListener("change", updateGallery);
updateGallery();

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
    current = (index + visiblePhotos.length) % visiblePhotos.length;
    image.src = visiblePhotos[current].src;
    image.alt = visiblePhotos[current].alt;
    caption.textContent = (current + 1) + " / " + visiblePhotos.length + " · " + visiblePhotos[current].closest("figure").querySelector("figcaption").textContent;
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
    button.addEventListener("click", function () { showPhoto(visiblePhotos.indexOf(photos[i])); viewer.showModal(); });
    photos[i].closest("figure").appendChild(button);
}
viewer.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        showPhoto(current + (event.key === "ArrowRight" ? 1 : -1));
    }
});

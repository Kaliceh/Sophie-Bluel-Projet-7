console.log("token =", localStorage.getItem("token"));
console.log("document.body =", document.body);

const token = localStorage.getItem("token");


function createEditBanner() {
    const editBanner = document.createElement("div");
    editBanner.classList.add("edit-banner");

    const img = document.createElement("img");
    img.src = "./assets/icons/vector.png";
    img.alt = "Icon modifier";

    const span = document.createElement("span");
    span.textContent = "Mode édition";

    editBanner.appendChild(img);
    editBanner.appendChild(span);

    document.body.prepend(editBanner);
}


function setupLogoutLink() {
    const loginLink = document.getElementById("login-link")
    if (!loginLink) return;

    loginLink.textContent = "logout";

    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
}


function removeFilters() {
    const filters = document.querySelector(".filters");
    if (filters) {
        filters.remove();
    }
}


function createModifyProject() {
    const projectTitle = document.querySelector("#project");
    const modalLink = document.querySelector(".modal-link");

    if (!projectTitle || !modalLink) return;

    const modifyContainer = document.createElement("span");
    modifyContainer.classList.add("modify");

    const imgModify = document.createElement("img");
    imgModify.src = "./assets/icons/vector-2.png";
    imgModify.alt = "Icon modifier";

    const spanModify = document.createElement("span");
    spanModify.textContent = "modifier";

    modifyContainer.appendChild(imgModify);
    modifyContainer.appendChild(spanModify);

    modalLink.appendChild(modifyContainer);

}


function activateEditMode() {
    document.body.classList.add("connected");

    createEditBanner();
    setupLogoutLink();
    removeFilters();
    createModifyProject();
    displayGalleryModal(works);
}

function displayGalleryModal(works) {
    const gallery = document.querySelector(".gallery-container");
    gallery.innerHTML = "";
    for (let currentIndex = 0; currentIndex < works.length; currentIndex++) {
        const figure = createFigureModal(works[currentIndex]);
        gallery.appendChild(figure);
    }
}

function createFigureModal(work) {
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    const trashIconContainer = document.createElement("div");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trashIcon = document.createElement("i");
    trashIconContainer.classList.add("trash");
    trashIcon.classList.add("fa-solid", "fa-trash-can");

    galleryItem.appendChild(img);
    galleryItem.appendChild(trashIconContainer);
    trashIconContainer.appendChild(trashIcon);

    return galleryItem;
}



if (token) {
    activateEditMode();
}



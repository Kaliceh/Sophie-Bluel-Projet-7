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
    const modalLink = document.querySelector(".modal-link");

    if (!modalLink) return;

    const modifyLink = document.createElement("a");
    modifyLink.href = "#modal-gallery";
    modifyLink.classList.add("modify");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-pen-to-square");

    const text = document.createElement("span");
    text.textContent = "modifier";

    modifyLink.appendChild(icon);
    modifyLink.appendChild(text);
    modalLink.appendChild(modifyLink);

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

    galleryItem.dataset.id = work.id;


    return galleryItem;
}

function modalClose() {
    const modals = document.querySelectorAll(".modal");

    for (let currentIndex = 0; currentIndex < modals.length; currentIndex++) {
        const modal = modals[currentIndex];

        modal.addEventListener("click", (event) => {

            if (event.target === modal) {
                resetAddPhotoForm();
                window.location.hash = "";
            }
        });
    }
}

async function deleteWork(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression");
        }

        return true;
    } catch (error) {
        console.error("Impossible de supprimer le projet :", error);
        return false;
    }
}

function setupTrash() {
    const trashIcons = document.querySelectorAll(".trash");

    for (let currentIndex = 0; currentIndex < trashIcons.length; currentIndex++) {
        const trash = trashIcons[currentIndex];

        trash.addEventListener("click", async (event) => {
            event.stopPropagation();

            const galleryItem = trash.parentNode;
            const itemId = parseInt(galleryItem.dataset.id);

            const success = await deleteWork(itemId);

            if (success) {
                galleryItem.remove();

                for (let index = 0; index < works.length; index++) {
                    if (works[index].id === itemId) {
                        works.splice(index, 1);
                        break;
                    }
                }
            } else {
                alert("Impossible de supprimer ce projet.");
            }
        });
    }
}

function activateEditMode() {
    document.body.classList.add("connected");

    createEditBanner();
    setupLogoutLink();
    removeFilters();
    createModifyProject();
    setupTrash();

    if (typeof works !== "undefined") {
        displayGalleryModal(works);
        setupTrash();
    }
}


async function initAdmin() {
    works = await getWorks();
    if (token) {
        activateEditMode();
        modalClose();
        setupImagePreview();
        setupCloseButtons();
        setupCloseArrow();

        const form = document.querySelector('.modal-add-photo');
        form.addEventListener('submit', addProject);

        setupCategories();
    }
}

initAdmin();

function setupImagePreview() {
    const fileInput = document.querySelector(".photo-add input");
    const addPhotoDiv = document.querySelector(".add-photo")
    const imgPreview = addPhotoDiv.querySelector("img.image");

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            imgPreview.src = event.target.result;
            addPhotoDiv.classList.add("image-loaded");
        }

        reader.readAsDataURL(file);
    });
}

function validateForm(title, category, image) {
    if (!title || !category || !image) {
        alert("Veuillez remplir tous les champs et ajouter une image");
        return false;
    }
    return true;
}

function createFormData(title, category, file) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);
    return formData;
}

async function sendProjectToAPI(formData) {
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi du projet");
        }

        const newProject = await response.json();
        return newProject;
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter ce projet.");
        return null;
    }
}

function addProjectToGallery(newProject) {
    const gallery = document.querySelector(".gallery");
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = newProject.imageUrl;
    img.alt = newProject.title;
    caption.textContent = newProject.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
}

async function addProject(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const fileInput = document.querySelector(".photo-add input");
    const file = fileInput.files[0];

    if (!validateForm(title, category, file)) return;

    const formData = createFormData(title, category, file);
    const newProject = await sendProjectToAPI(formData);

    if (newProject) {
        works.push(newProject);
        addProjectToGallery(newProject);
        displayGalleryModal(works);
        setupTrash();
        resetAddPhotoForm();
        window.location.hash = "";
        alert("Projet ajouté avec succès !");
    }
}

async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur récupération catégories :", error);
        return [];
    }
}

async function setupCategories() {
    const select = document.getElementById("category");
    const categories = await getCategories();

    for (let currentIndex = 0; currentIndex < categories.length; currentIndex++) {
        const option = document.createElement("option");
        option.value = categories[currentIndex].id;
        option.textContent = categories[currentIndex].name;
        select.appendChild(option);
    }
}

function resetAddPhotoForm() {
    const form = document.querySelector(".modal-add-photo");
    const fileInput = document.querySelector(".photo-add input");
    const imgPreview = document.querySelector(".add-photo img.image");
    const addPhotoDiv = document.querySelector(".add-photo");

    form.reset();

    imgPreview.src = "/assets/icons/image.png";
    fileInput.value = "";
    addPhotoDiv.classList.remove("image-loaded");
}

function setupCloseButtons() {
    const closeButtons = document.querySelectorAll(".close");

    for (let currentIndex = 0; currentIndex < closeButtons.length; currentIndex++) {
        closeButtons[currentIndex].addEventListener("click", () => {
            resetAddPhotoForm();
            window.location.hash = "";
        });
    }
}

function setupCloseArrow() {
    const arrows = document.querySelectorAll(".arrow");

    for (let currentIndex = 0; currentIndex < arrows.length; currentIndex++) {
        arrows[currentIndex].addEventListener("click", () => {
            resetAddPhotoForm();
            window.location.hash = "";
        });
    }
}
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

        const form = document.querySelector('.modal-add-photo');
        form.addEventListener('submit', addProject);

        setupCategories();
    }
}

initAdmin();
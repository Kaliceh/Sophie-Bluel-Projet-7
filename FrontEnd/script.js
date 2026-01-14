console.log("token =", localStorage.getItem("token"));
console.log("document.body =", document.body);


const token = localStorage.getItem("token");
console.log(token)

if (token) {
    document.body.classList.add("connected");

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

    const loginLink = document.querySelector(`a[href="login.html"]`);
    loginLink.textContent = "logout";

    loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    })

    const filters = document.querySelector(".filters");
    filters.remove();

    const projectTitle = document.querySelector("#project");

    const projectHeader = document.createElement("div");
    projectHeader.classList.add("modify-project");

    projectTitle.parentNode.insertBefore(projectHeader, projectTitle);
    projectHeader.appendChild(projectTitle);

    const modifyContainer = document.createElement("span");
    modifyContainer.classList.add("modify");

    const imgModify = document.createElement("img");
    imgModify.src = "./assets/icons/vector-2.png";
    imgModify.alt = "Icon modifier";

    const spanModify = document.createElement("span");
    spanModify.textContent = "modifier";

    modifyContainer.appendChild(imgModify);
    modifyContainer.appendChild(spanModify);


    projectHeader.appendChild(modifyContainer)

}



let works

async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        return works;

    } catch (erreur) {
        console.log("Erreur lors de la récupération des projets :", erreur);
    }
}

function createFigure(work) {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figCaption = document.createElement("figCaption");
    figCaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figCaption);

    return figure;
}

function displayGallery(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let currentIndex = 0; currentIndex < works.length; currentIndex++) {
        const figure = createFigure(works[currentIndex]);
        gallery.appendChild(figure);
    }
}

async function initGallery() {
    works = await getWorks();
    displayGallery(works);
}

initGallery();


async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        return categories;

    } catch (erreur) {
        console.log("Erreur lors de la récupération des catégories:", erreur);
    }
}

function createCategory(name, works, categoryId = null) {
    const button = document.createElement("button");
    button.textContent = name;
    button.classList.add("filter-button");

    button.addEventListener("click", () => {
        if (categoryId === null) {
            displayGallery(works);
        } else {
            const filteredWorks = works.filter(
                work => work.categoryId === categoryId
            );
            displayGallery(filteredWorks);
        }
    });

    return button;

}

async function displayCategories() {
    const categories = await getCategories();
    const filters = document.querySelector(".filters")

    const allButton = createCategory("Tous", works);
    filters.appendChild(allButton);

    for (let currentIndex = 0; currentIndex < categories.length; currentIndex++) {
        const category = categories[currentIndex];
        const button = createCategory(
            category.name,
            works,
            category.id
        );
        filters.appendChild(button)
    }
}

displayCategories();

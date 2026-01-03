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
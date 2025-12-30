const gallery = document.querySelector(".gallery")

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        for (let currentIndex = 0; currentIndex < works.length; currentIndex++) {
            const work = works[currentIndex];

            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const figureCaption = document.createElement("figureCaption");
            figureCaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figureCaption);
            gallery.appendChild(figure);
        }
    })

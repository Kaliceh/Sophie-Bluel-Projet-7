const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    loginUser(email, password);
})


async function loginUser(email, password) {
    const loginError = document.querySelector("#login-error");

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);

        window.location = "index.html";

        console.log("Connexion réussie :", data);

    } catch (error) {

        if (error.message == 404) {
            loginError.textContent = "Email ou mot de passe incorrect";
        } else {
            loginError.textContent = "Erreur serveur, veuillez réessayer plus tard";
        }
        console.error(error.message);
    }
}




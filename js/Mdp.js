        const motDePasseCorrect = "1";

function verifierMotDePasse() {
    const saisie = document.getElementById("motdepasse");
    const bouton = document.getElementById("validerBtn");
    const messageErreur = document.getElementById("messageErreur");

    // Réinitialiser les classes
    saisie.classList.remove("valid", "shake");
    bouton.classList.remove("flash");

    if (saisie.value === motDePasseCorrect) {
        messageErreur.textContent = "";
        saisie.classList.add("valid");
        bouton.classList.add("flash");

        setTimeout(() => {
            window.open("https://workspace.google.com/intl/fr/gmail/", "_blank"); // Ouvre un nouvel onglet
        }, 800);
        
    } else {
        messageErreur.textContent = "Mot de passe incorrect.";
        saisie.classList.add("shake");

        setTimeout(() => {
            saisie.classList.remove("shake");
        }, 300);
    }
}

// Écouteur pour la touche Entrée
document.getElementById("motdepasse").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        verifierMotDePasse();
    }
});
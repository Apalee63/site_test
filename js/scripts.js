document.addEventListener("DOMContentLoaded", function () {
    chargerDepuisLocalStorage();
    rendreCellulesEditables();
    initialiserTri();
});

function rendreCellulesEditables() {
    const tbody = document.querySelector("#contactsTable tbody");

    // Délégation d'événement : fonctionne même pour les nouvelles cellules
    tbody.addEventListener("input", () => {
        sauvegarderDansLocalStorage();
    });
}


function initialiserTri() {
    const table = document.getElementById("contactsTable");
    const headers = table.querySelectorAll("thead th");
    const tbody = table.querySelector("tbody");

    headers.forEach((header, index) => {
        header.style.cursor = "pointer";
        header.addEventListener("click", () => {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const isAsc = header.classList.toggle("asc");
            headers.forEach((h, i) => { if (i !== index) h.classList.remove("asc"); });

            rows.sort((a, b) => {
                const cellA = a.children[index].textContent.trim().toLowerCase();
                const cellB = b.children[index].textContent.trim().toLowerCase();

                return isAsc
                    ? cellA.localeCompare(cellB)
                    : cellB.localeCompare(cellA);
            });

            rows.forEach(row => tbody.appendChild(row));
            sauvegarderDansLocalStorage();
        });
    });
}

function ajouterLigne() {
    const table = document.getElementById("contactsTable");
    const tbody = table.querySelector("tbody");
    const nbColonnes = table.querySelector("thead tr").children.length - 1; // -1 car on va ajouter une colonne pour le bouton

    const nouvelleLigne = document.createElement("tr");

    for (let i = 0; i < nbColonnes; i++) {
        const cellule = document.createElement("td");
        cellule.contentEditable = true;
        cellule.textContent = "";
        nouvelleLigne.appendChild(cellule);
    }

    const celluleSuppression = document.createElement("td");
    const bouton = document.createElement("button");
    bouton.textContent = "🗑️";
    bouton.onclick = function () {
        nouvelleLigne.remove();
        sauvegarderDansLocalStorage();
    };
    celluleSuppression.appendChild(bouton);
    nouvelleLigne.appendChild(celluleSuppression);

    tbody.appendChild(nouvelleLigne);
    sauvegarderDansLocalStorage();
}


function supprimerDerniereLigne() {
    const tbody = document.querySelector("#contactsTable tbody");
    const lignes = tbody.querySelectorAll("tr");
    if (lignes.length > 0) {
        tbody.removeChild(lignes[lignes.length - 1]);
        sauvegarderDansLocalStorage();
    } else {
        alert("Aucune ligne à supprimer !");
    }
}

function sauvegarderDansLocalStorage() {
    const lignes = document.querySelectorAll("#contactsTable tbody tr");
    const data = [];

    lignes.forEach(tr => {
        const ligne = [];
        tr.querySelectorAll("td").forEach(td => {
            ligne.push(td.textContent.trim());
        });
        data.push(ligne);
    });

    localStorage.setItem("contacts", JSON.stringify(data));
}

function chargerDepuisLocalStorage() {
    const tbody = document.querySelector("#contactsTable tbody");
    const donnees = JSON.parse(localStorage.getItem("contacts"));

    if (!donnees || !Array.isArray(donnees)) return;

    tbody.innerHTML = ""; // vider le tableau

    donnees.forEach(ligne => {
        const tr = document.createElement("tr");

        ligne.forEach(valeur => {
            const td = document.createElement("td");
            td.textContent = valeur;
            td.contentEditable = true;
            tr.appendChild(td);
        });

        const tdSuppr = document.createElement("td");
        const bouton = document.createElement("button");
        bouton.textContent = "🗑️";
        bouton.onclick = function () {
            tr.remove();
            sauvegarderDansLocalStorage();
        };
        tdSuppr.appendChild(bouton);
        tr.appendChild(tdSuppr);

        tbody.appendChild(tr);
    });
}


function reinitialiserTableau() {
    if (!confirm("Voulez-vous vraiment supprimer tous les contacts ?")) return;

    localStorage.removeItem("contacts");

    const tbody = document.querySelector("#contactsTable tbody");
    tbody.innerHTML = "";

    // Ajouter une ligne vide (optionnel)
    ajouterLigne();
}

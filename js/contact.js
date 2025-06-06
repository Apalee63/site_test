document.addEventListener("DOMContentLoaded", function () {
    chargerDepuisLocalStorage();
    initialiserTri();
});
chargerDepuisLocalStorage();

function reinitialiserTableau() {
    if (!confirm("Voulez-vous vraiment supprimer tous les contacts ?")) return;

    localStorage.removeItem("contacts");

    const tbody = document.querySelector("#contactsTable tbody");
    tbody.innerHTML = "";

    ajouterLigne();
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
   document.addEventListener("DOMContentLoaded", () => {
    chargerDepuisLocalStorage();
});

let contactEnCours = null; // Pour modification

function ouvrirPopup(contact = null, index = null) {
    document.getElementById("formTitle").textContent = contact ? "Modifier un contact" : "Ajouter un contact";
    document.getElementById("popupForm").style.display = "block";

    // Préremplir si modification
    document.getElementById("nomInput").value = contact ? contact[0] : "";
    document.getElementById("prenomInput").value = contact ? contact[1] : "";
    document.getElementById("emailInput").value = contact ? contact[2] : "";
    document.getElementById("numeroInput").value = contact ? contact[3] : "";

    contactEnCours = index;
}

function fermerPopup() {
    document.getElementById("popupForm").style.display = "none";
    contactEnCours = null;
}

function enregistrerContact() {
    const nom = document.getElementById("nomInput").value.trim();
    const prenom = document.getElementById("prenomInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const numero = document.getElementById("numeroInput").value.trim();

    if (!nom || !prenom || !email || !numero) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    // Vérification du numéro : chiffres et espaces uniquement
    const numeroValide = /^[\d\s]+$/.test(numero);
    if (!numeroValide) {
        alert("Le numéro ne doit contenir que des chiffres et des espaces.");
        return;
    }

    // Vérification de l'email avec regex
    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValide) {
        alert("Veuillez entrer une adresse email valide.");
        return;
    }

    const contact = [nom, prenom, email, numero];
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    if (contactEnCours !== null) {
        contacts[contactEnCours] = contact;
    } else {
        contacts.push(contact);
    }

    localStorage.setItem("contacts", JSON.stringify(contacts));
    fermerPopup();
    chargerDepuisLocalStorage();
}


function supprimerContact(index) {
    const row = document.querySelectorAll("#tableBody tr")[index];
    row.classList.add("fade-out");

    setTimeout(() => {
        const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        contacts.splice(index, 1);
        localStorage.setItem("contacts", JSON.stringify(contacts));
        chargerDepuisLocalStorage();
    }, 400);
}

function chargerDepuisLocalStorage() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    contacts.forEach((contact, index) => {
        const tr = document.createElement("tr");

        contact.forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });

        const tdActions = document.createElement("td");

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "✏️";
        btnEdit.onclick = () => ouvrirPopup(contact, index);

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "🗑️";
        btnDelete.onclick = () => supprimerContact(index);

        tdActions.appendChild(btnEdit);
        tdActions.appendChild(btnDelete);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function reinitialiserTableau() {
    if (confirm("Supprimer tous les contacts ?")) {
        localStorage.removeItem("contacts");
        chargerDepuisLocalStorage();
    }
}

function filtrerTableau() {
    const filtre = document.getElementById("searchInput").value.toLowerCase();
    const lignes = document.querySelectorAll("#tableBody tr");

    lignes.forEach(tr => {
        const texte = Array.from(tr.children)
            .map(td => td.textContent.toLowerCase())
            .join(" ");
        tr.style.display = texte.includes(filtre) ? "" : "none";
    });
}

async function hashSHA256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

(() => {
    // ⚠️ Mot de passe maître (hashé SHA-256 de "SuperMaster")
    // Pour changer le mot de passe maître, change la ligne ci-dessous par un nouveau hash (voir plus bas)
    const masterPasswordHash = "45bb9b3fe63b1b7eccc7a736e61271af19e46f87569321563289498c3320b2b4"; // "Soeman"

    const attempts = {
        agenda: 0,
        bloc: 0
    };

    window.verifierAcces = async function (zone) {
        const idInput = zone === "agenda" ? "motdepasseAgenda" : "motdepasseBloc";
        const storageKey = zone === "agenda" ? "mdp_agenda" : "mdp_bloc";
        const page = zone === "agenda" ? "agenda.html" : "bloc_note.html";
        const input = document.getElementById(idInput);
        const message = document.getElementById(`erreur_${zone}`);
        const password = input.value.trim();

        if (!password) {
            afficherMessage(message, "Veuillez saisir un mot de passe.", "error");
            return;
        }

        const hash = await hashSHA256(password);
        const mdpStocke = localStorage.getItem(storageKey);

        if (!mdpStocke) {
            localStorage.setItem(storageKey, hash);
            input.value = "";
            afficherMessage(message, "Mot de passe enregistré. Veuillez vous reconnecter.", "success");
        } else if (hash === mdpStocke) {
            input.value = "";
            afficherMessage(message, "", "success");
            window.location.href = page;
        } else {
            attempts[zone]++;
            input.value = "";
            afficherMessage(message, "Mot de passe incorrect.", "error");

            if (attempts[zone] >= 3) {
                afficherReset(zone);
            }
        }
    }

    window.changerMotDePasse = async function (zone) {
        const ancien = document.getElementById(`ancien_${zone}`);
        const nouveau = document.getElementById(`nouveau_${zone}`);
        const message = document.getElementById(`changeErreur_${zone}`);
        const storageKey = zone === "agenda" ? "mdp_agenda" : "mdp_bloc";

        if (!ancien.value || !nouveau.value) {
            afficherMessage(message, "Veuillez remplir les deux champs.", "error");
            return;
        }

        const hashAncien = await hashSHA256(ancien.value);
        const hashNouveau = await hashSHA256(nouveau.value);
        const mdpStocke = localStorage.getItem(storageKey);

        if (hashAncien === mdpStocke) {
            localStorage.setItem(storageKey, hashNouveau);
            afficherMessage(message, "Mot de passe modifié avec succès.", "success");
        } else {
            afficherMessage(message, "Ancien mot de passe incorrect.", "error");
        }

        ancien.value = "";
        nouveau.value = "";
    }

    function afficherReset(zone) {
        const container = document.querySelector(`.container:nth-of-type(${zone === "agenda" ? 1 : 2})`);
        if (container.querySelector(".reset-zone")) return;

        const resetDiv = document.createElement("div");
        resetDiv.className = "reset-zone";
        resetDiv.innerHTML = `
            <input type="password" placeholder="Mot de passe maître" id="reset_${zone}" style="margin-top:10px">
            <button onclick="resetMotDePasse('${zone}')">Réinitialiser</button>
        `;
        container.appendChild(resetDiv);

        setTimeout(() => {
            const resetInput = document.getElementById(`reset_${zone}`);
            if (resetInput) {
                resetInput.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        resetMotDePasse(zone);
                    }
                });
            }
        }, 0);
    }

    window.resetMotDePasse = async function (zone) {
        const input = document.getElementById(`reset_${zone}`);
        const hash = await hashSHA256(input.value);
        const storageKey = zone === "agenda" ? "mdp_agenda" : "mdp_bloc";
        const message = document.getElementById(`erreur_${zone}`);

        if (hash === masterPasswordHash) {
            localStorage.removeItem(storageKey);
            afficherMessage(message, "Mot de passe réinitialisé. Veuillez en définir un nouveau.", "success");
            attempts[zone] = 0;
            input.parentElement.remove();
        } else {
            afficherMessage(message, "Mot de passe maître incorrect.", "error");
        }

        input.value = "";
    }

    function afficherMessage(element, message, type) {
        element.textContent = message;
        element.classList.remove("error", "success", "visible");
        void element.offsetWidth;
        element.classList.add(type);
        element.classList.add("visible");
    }

    // Détection touche Entrée
    const champs = [
        ["motdepasseAgenda", "agenda"],
        ["motdepasseBloc", "bloc"],
        ["ancien_agenda", "agenda"],
        ["nouveau_agenda", "agenda"],
        ["ancien_bloc", "bloc"],
        ["nouveau_bloc", "bloc"]
    ];

    champs.forEach(([id, zone]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    if (id.startsWith("ancien") || id.startsWith("nouveau")) {
                        changerMotDePasse(zone);
                    } else {
                        verifierAcces(zone);
                    }
                }
            });
        }
    });
})();

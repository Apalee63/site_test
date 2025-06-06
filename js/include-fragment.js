/**
 * Fonction qui charge un fragment HTML (header/nav/footer)
 * et insère son contenu à l’intérieur d’un élément dont l’id est donné.
 *
 * @param {string} url        - Chemin du fragment (ex : 'header.html').
 * @param {string} elementId  - Id du div où injecter (ex : 'header').
 */
async function includeFragment(url, elementId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur : ${response.status}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (err) {
    console.error(`Impossible de charger ${url} :`, err);
  }
}

// Lorsque le DOM est prêt, inclure header.html, nav.html, footer.html
document.addEventListener("DOMContentLoaded", () => {
  includeFragment("header.html", "header");
  includeFragment("nav.html",    "nav");
  includeFragment("footer.html", "footer");
});

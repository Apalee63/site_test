document.addEventListener("DOMContentLoaded", () => {
  const notesListElement = document.getElementById("notesList");
  const newNoteBtn       = document.getElementById("newNoteBtn");
  const deleteNoteBtn    = document.getElementById("deleteNoteBtn");
  const saveNoteBtn      = document.getElementById("saveNoteBtn");
  const noteTitleInput   = document.getElementById("noteTitle");
  const noteContentArea  = document.getElementById("noteContent");

  let notes = [];           // Tableau d’objets { id, title, content }
  let currentNoteId = null; // ID de la note en cours d’édition

  // Récupère la liste de notes depuis localStorage (ou initialise un tableau vide)
  function loadNotes() {
    const stored = localStorage.getItem("soeman_notes");
    if (stored) {
      notes = JSON.parse(stored);
    } else {
      notes = [];
    }
  }

  // Sauvegarde le tableau 'notes' dans localStorage
  function saveNotesToStorage() {
    localStorage.setItem("soeman_notes", JSON.stringify(notes));
  }

  // Génère un ID unique (timestamp + random)
  function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
  }

  // Affiche la liste des titres de notes dans la sidebar
  function renderNotesList() {
    notesListElement.innerHTML = "";
    notes.forEach(note => {
      const li = document.createElement("li");
      li.textContent = note.title || "Sans titre";
      li.dataset.id = note.id;
      if (note.id === currentNoteId) {
        li.classList.add("active");
      }
      li.addEventListener("click", () => {
        selectNote(note.id);
      });
      notesListElement.appendChild(li);
    });
  }

  // Sélectionne une note (remplit l’éditeur avec son titre / contenu)
  function selectNote(id) {
    const found = notes.find(n => n.id === id);
    if (!found) return;

    currentNoteId = id;
    noteTitleInput.value  = found.title;
    noteContentArea.value = found.content;
    renderNotesList();
  }

  // Crée une nouvelle note vide et la sélectionne
  function createNewNote() {
    const id = generateId();
    const newNote = { id, title: "", content: "" };
    notes.unshift(newNote); // on ajoute la nouvelle note en début de tableau
    saveNotesToStorage();

    currentNoteId = id;
    noteTitleInput.value  = "";
    noteContentArea.value = "";

    renderNotesList();
    noteTitleInput.focus();
  }

  // Sauvegarde/Met à jour la note en cours uniquement lors du clic “Enregistrer”
  function saveCurrentNote() {
    if (!currentNoteId) {
      alert("Aucune note sélectionnée.");
      return;
    }
    const idx = notes.findIndex(n => n.id === currentNoteId);
    if (idx === -1) return;

    notes[idx].title   = noteTitleInput.value.trim();
    notes[idx].content = noteContentArea.value;
    saveNotesToStorage();
    renderNotesList();
    alert("Note enregistrée !");
  }

  // Supprime la note en cours (après confirmation)
  function deleteCurrentNote() {
    if (!currentNoteId) {
      alert("Aucune note sélectionnée.");
      return;
    }
    if (!confirm("Voulez-vous vraiment supprimer cette note ?")) {
      return;
    }
    const idx = notes.findIndex(n => n.id === currentNoteId);
    if (idx !== -1) {
      notes.splice(idx, 1);
      saveNotesToStorage();
    }
    // Si d’autres notes existent, on sélectionne la première ; sinon, on vide l’éditeur
    if (notes.length) {
      currentNoteId = notes[0].id;
      selectNote(currentNoteId);
    } else {
      currentNoteId = null;
      noteTitleInput.value  = "";
      noteContentArea.value = "";
      renderNotesList();
    }
  }

  // Initialisation : chargement des notes et affichage de la première note si elle existe
  function initialize() {
    loadNotes();
    if (notes.length) {
      currentNoteId = notes[0].id;
      noteTitleInput.value  = notes[0].title;
      noteContentArea.value = notes[0].content;
    }
    renderNotesList();
  }

  // Ajout des event listeners sur les boutons (seulement)
  newNoteBtn.addEventListener("click", createNewNote);
  saveNoteBtn.addEventListener("click", saveCurrentNote);
  deleteNoteBtn.addEventListener("click", deleteCurrentNote);

  // …et on n’ajoute plus d’écouteurs “input” sur title/content (sauvegarde manuelle seulement)

  // Lancement initial
  initialize();
});

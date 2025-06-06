document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth(); // 0-indexé (0 = Janvier)

  const monthYearElem = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");
  const calendarGrid = document.querySelector(".calendar-grid");

  const modal = document.getElementById("eventModal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalDateTitle = document.getElementById("modalDateTitle");
  const eventText = document.getElementById("eventText");
  const saveEventBtn = document.getElementById("saveEvent");
  const deleteEventBtn = document.getElementById("deleteEvent");

  let selectedDateStr = ""; // « YYYY-MM-DD » pour identifier la case

  // Récupère un objet { "YYYY-MM-DD": "Texte de l’événement", ... }
  function getEvents() {
    const data = localStorage.getItem("soeman_events");
    return data ? JSON.parse(data) : {};
  }

  function setEvents(obj) {
    localStorage.setItem("soeman_events", JSON.stringify(obj));
  }

  function buildCalendar(year, month) {
    calendarGrid.innerHTML = `
      <!-- Days of week headers -->      
      <div class="day-header">Lun</div>
      <div class="day-header">Mar</div>
      <div class="day-header">Mer</div>
      <div class="day-header">Jeu</div>
      <div class="day-header">Ven</div>
      <div class="day-header">Sam</div>
      <div class="day-header">Dim</div>
    `.trim();

    // 1er jour du mois
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Dimanche, 1 = Lundi ...
    const startOffset = (firstDay + 6) % 7; // pour faire apparaître le lundi en premier

    // Nb de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Nb de jours dans le mois précédent (utile pour remplir les cases « inactives »)
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Construire un tableau de 42 cases (6 semaines)
    const totalCells = 42;
    const events = getEvents();

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.classList.add("day-cell");

      let dayNum, cellDate;
      if (i < startOffset) {
        // Jours du mois précédent (grisés)
        cell.classList.add("inactive");
        dayNum = daysInPrevMonth - startOffset + i + 1;
        cell.innerHTML = `<span class="day-number">${dayNum}</span>`;
      } else if (i >= startOffset + daysInMonth) {
        // Jours du mois suivant (grisés)
        cell.classList.add("inactive");
        dayNum = i - (startOffset + daysInMonth) + 1;
        cell.innerHTML = `<span class="day-number">${dayNum}</span>`;
      } else {
        // Jours du mois en cours
        dayNum = i - startOffset + 1;
        cellDate = new Date(year, month, dayNum);
        const yyyy = cellDate.getFullYear();
        const mm = String(cellDate.getMonth() + 1).padStart(2, "0");
        const dd = String(cellDate.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        cell.innerHTML = `<span class="day-number">${dayNum}</span>`;

        // Si un événement existe pour cette date, afficher un indicateur
        if (events[dateStr]) {
          const indicator = document.createElement("div");
          indicator.classList.add("event-indicator");
          cell.appendChild(indicator);
        }

        // Au clic, ouvrir la modal pour cette date
        cell.addEventListener("click", () => {
          selectedDateStr = dateStr;
          modalDateTitle.textContent = `Événement du ${dd}/${mm}/${yyyy}`;
          eventText.value = events[dateStr] || "";
          modal.classList.add("show");
          eventText.focus();
        });
      }

      calendarGrid.appendChild(cell);
    }

    // Afficher le mois et l’année en texte
    const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    monthYearElem.textContent = `${monthNames[month]} ${year}`;
  }

  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    buildCalendar(currentYear, currentMonth);
  });

  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    buildCalendar(currentYear, currentMonth);
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  saveEventBtn.addEventListener("click", () => {
    const text = eventText.value.trim();
    const events = getEvents();
    if (text) events[selectedDateStr] = text;
    else delete events[selectedDateStr];
    setEvents(events);
    modal.classList.remove("show");
    buildCalendar(currentYear, currentMonth);
  });

  deleteEventBtn.addEventListener("click", () => {
    const events = getEvents();
    delete events[selectedDateStr];
    setEvents(events);
    modal.classList.remove("show");
    buildCalendar(currentYear, currentMonth);
  });

  // Fermer la modal si l'utilisateur clique à l'extérieur du contenu
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });

  // Construction initiale du calendrier
  buildCalendar(currentYear, currentMonth);
});

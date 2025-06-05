const chartsContainer = document.getElementById("chartsContainer");
const chartForm = document.getElementById("chartForm");
const deleteAllBtn = document.getElementById("deleteAll");

let charts = {};

function getRandomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 70 + Math.random() * 20;
  const l = 50 + Math.random() * 10;
  return `hsl(${h}, ${s}%, ${l}%)`;
}


function loadCharts() {
  const saved = JSON.parse(localStorage.getItem("multiCharts")) || {};
  for (const [name, data] of Object.entries(saved)) {
    createChartElement(name, data.type, data.labels, data.values);
  }
}

function saveCharts() {
  const toSave = {};
  for (const [name, chart] of Object.entries(charts)) {
    toSave[name] = {
      type: chart.config.type,
      labels: chart.data.labels,
      values: chart.data.datasets[0].data
    };
  }
  localStorage.setItem("multiCharts", JSON.stringify(toSave));
}

function createChartElement(name, type, labels = [], values = []) {
  const box = document.createElement("div");
  box.className = "chart-box";
  box.innerHTML = `
  <div>
    <h3 contenteditable="true" spellcheck="false">${name}</h3>
    <canvas id="${name}"></canvas>
    <form class="updateForm">
      <input type="text" placeholder="Nom de la valeur" required style="border-radius: 8px;" />
      <input type="number" placeholder="Valeur" required />
      <button type="submit">Ajouter / Modifier</button>
    </form>
    <div class="value-list"></div>
    <button class="delete-btn">Supprimer ce graphique</button>
  </div>
`;

const backgroundColors = labels.map(() => getRandomColor());

const datasetOptions = {
  label: name,
  data: values,
  backgroundColor: backgroundColors,
  borderColor: '#fff',
  borderWidth: 1
};


if (type === 'bar') {
  datasetOptions.borderRadius = 6;
  datasetOptions.borderSkipped = false;
}

  chartsContainer.appendChild(box);
  const ctx = document.getElementById(name).getContext("2d");
  const chart = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label: name,
        data: values,
        backgroundColor: backgroundColors,
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
options: {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 10
  },
  plugins: {
    legend: {
      labels: { color: '#fff' }
    },
    tooltip: {
      backgroundColor: '#222',
      titleColor: '#fff',
      bodyColor: '#fff',
      cornerRadius: 6,
      padding: 10,
      bodyFont: { weight: 'bold' },
      displayColors: false,
    }
  },
  scales: type === "pie" || type === "doughnut" ? {} : {
    y: {
      beginAtZero: true,
      ticks: { color: '#fff', stepSize: 1 }
    },
    x: {
      ticks: { color: '#fff' }
    }
  }
}

  });

  charts[name] = chart;
  updateValueList(box, chart);

  box.querySelector(".updateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const label = e.target[0].value.trim();
    const value = parseFloat(e.target[1].value);
    if (!label || isNaN(value)) return;

    const index = chart.data.labels.indexOf(label);
    if (index === -1) {
      chart.data.labels.push(label);
      chart.data.datasets[0].data.push(value);
      chart.data.datasets[0].backgroundColor.push(getRandomColor());
    } else {
      chart.data.datasets[0].data[index] = value;
    }
    chart.update();
    updateValueList(box, chart);
    saveCharts();
    e.target.reset();
  });


  const title = box.querySelector("h3");
  title.addEventListener("input", () => {
    const newName = title.textContent.trim();
    if (!newName || newName === name || charts[newName]) {
      title.textContent = name;
      alert("Nom invalide ou déjà utilisé !");
      return;
    }
    charts[newName] = charts[name];
    delete charts[name];
    chart.data.datasets[0].label = newName;
    chart.update();
    saveCharts();
  });
    // Suppression individuelle du graphique
  box.querySelector(".delete-btn").addEventListener("click", () => {
    if (!confirm(`Supprimer le graphique "${name}" ?`)) return;
    chart.destroy();
    box.remove();
    delete charts[name];
    saveCharts();
  });

}
function updateValueList(box, chart) {
  const list = box.querySelector(".value-list");
  list.innerHTML = "";
  chart.data.labels.forEach((label, i) => {
    const value = chart.data.datasets[0].data[i];
    const color = chart.data.datasets[0].backgroundColor[i];

    const row = document.createElement("div");
    row.className = "value-row";

    // Style de la ligne
    row.style.background = color;
    row.style.padding = "5px 10px";
    row.style.borderRadius = "8px";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.marginBottom = "6px";

    // Création des éléments
    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.value = label;
    labelInput.style.flex = "1";
    labelInput.style.borderRadius = "6px";

    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.value = value;
    valueInput.style.width = "80px";
    valueInput.style.borderRadius = "6px";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "✖";
    deleteBtn.title = "Supprimer";
    deleteBtn.style.background = "#e53935";
    deleteBtn.style.color = "#fff";
    deleteBtn.style.border = "none";
    deleteBtn.style.borderRadius = "50%";
    deleteBtn.style.width = "28px";
    deleteBtn.style.height = "28px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.fontWeight = "bold";
    deleteBtn.style.lineHeight = "1";
    deleteBtn.style.display = "flex";
    deleteBtn.style.alignItems = "center";
    deleteBtn.style.justifyContent = "center";

    // Empêche Enter de soumettre le formulaire ou créer une nouvelle ligne
    [labelInput, valueInput].forEach(input => {
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") e.preventDefault();
      });
    });

    // Modification en temps réel
    labelInput.addEventListener("input", () => {
      chart.data.labels[i] = labelInput.value.trim();
      chart.update();
      saveCharts();
    });

    valueInput.addEventListener("input", () => {
      const newValue = parseFloat(valueInput.value);
      chart.data.datasets[0].data[i] = isNaN(newValue) ? 0 : newValue;
      chart.update();
      saveCharts();
    });

    // Suppression
    deleteBtn.addEventListener("click", () => {
      chart.data.labels.splice(i, 1);
      chart.data.datasets[0].data.splice(i, 1);
      chart.data.datasets[0].backgroundColor.splice(i, 1);
      chart.update();
      saveCharts();
      updateValueList(box, chart);
    });

    // Ajout à la ligne
    row.appendChild(labelInput);
    row.appendChild(valueInput);
    row.appendChild(deleteBtn);
    list.appendChild(row);
  });
}

document.getElementById("chartForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("chartName").value.trim();
    const type = document.getElementById("chartType").value;

    if (!name) {
        alert("Veuillez entrer un nom de graphique valide.");
        return;
    }

    const savedCharts = JSON.parse(localStorage.getItem("multiCharts")) || {};
    if (savedCharts[name]) {
        alert("Un graphique avec ce nom existe déjà.");
        return;
    }

    createChartElement(name, type);
    saveCharts();
    e.target.reset();
});

deleteAllBtn.addEventListener("click", () => {
  if (!confirm("Supprimer tous les graphiques ?")) return;
  chartsContainer.innerHTML = "";
  charts = {};
  localStorage.removeItem("multiCharts");
});

window.addEventListener("load", loadCharts);
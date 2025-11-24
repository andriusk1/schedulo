const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const dateInput = document.getElementById("todo-date");
const humanDate = document.getElementById("human-date");

const STORAGE_KEY = "schedulo-todo-by-date-v1";

// tagastame tänane kuupäev kujul 2025-11-06
function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// kuupäev inimesele loetavamaks
function toHumanDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// loeme kõik päevad localStoragest
function getAllFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  return JSON.parse(raw);
}

// kirjutame kõik päevad localStorage-sse
function saveAllToStorage(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// näitame ühe päeva ülesandeid
function showTasksFor(dateStr) {
  list.innerHTML = "";
  const all = getAllFromStorage();
  const tasks = all[dateStr] || [];

  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No tasks for this day.";
    li.style.color = "#777";
    list.appendChild(li);
  } else {
    tasks.forEach(t => {
      // false = ära salvesta kohe uuesti, me lihtsalt kuvame
      addTaskToDom(t.text, t.completed, false);
    });
  }

  humanDate.textContent = toHumanDate(dateStr);
}

// loome üks <li> ja pane see nimekirja
function addTaskToDom(text, completed = false, save = true) {
  const li = document.createElement("li");
  li.className = "todo-item";

  const left = document.createElement("div");
  left.className = "todo-left";

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = completed;

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = text;
  if (completed) {
    span.classList.add("completed");
  }

  // märgime lõpetatuks
  cb.addEventListener("change", () => {
    span.classList.toggle("completed", cb.checked);
    saveCurrentDate();
  });

  left.appendChild(cb);
  left.appendChild(span);

  const del = document.createElement("button");
  del.className = "delete-btn";
  del.textContent = "Delete";
  del.addEventListener("click", () => {
    li.remove();
    saveCurrentDate();
  });

  li.appendChild(left);
  li.appendChild(del);
  list.appendChild(li);

  if (save) {
    saveCurrentDate();
  }
}

// loeme ekraanilt, mis ülesanded sellel kuupäeval on, ja salvestame
function saveCurrentDate() {
  const currentDate = dateInput.value || getTodayISO();
  const all = getAllFromStorage();
  const tasks = [];

  document.querySelectorAll(".todo-item").forEach(li => {
    const textEl = li.querySelector(".todo-text");
    if (!textEl) return; // jätame "pole ülesandeid" vahele
    const done = li.querySelector("input[type='checkbox']").checked;
    tasks.push({
      text: textEl.textContent,
      completed: done
    });
  });

  all[currentDate] = tasks;
  saveAllToStorage(all);
}

// nupu ja enteri kaudu lisamine
function addHandler() {
  const text = input.value.trim();
  if (!text) return;
  addTaskToDom(text, false, true);
  input.value = "";
  input.focus();
}

addBtn.addEventListener("click", addHandler);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addHandler();
  }
});

// kui kuupäev muutub, näita teist päeva
dateInput.addEventListener("change", () => {
  showTasksFor(dateInput.value);
});

// alglaadimisel paneme tänane kuupäev ja näitame selle ülesandeid
document.addEventListener("DOMContentLoaded", () => {
  const today = getTodayISO();
  dateInput.value = today;
  showTasksFor(today);
});

// Allikas: https://dev.to/vladimirschneider/simple-to-do-list-using-localstorage-29on
// -----------------------
// DOM ELEMENTS
// -----------------------
const daysTag               = document.querySelector(".days");
const currentDate           = document.querySelector(".current-date");
const prevNextIcon          = document.querySelectorAll(".icons span");

const eventTitleInput       = document.getElementById("event-title");
const eventDescriptionInput = document.getElementById("event-description");
const addEventBtn           = document.getElementById("add-event-btn");
const eventListEl           = document.querySelector(".event-list");
const eventDateLabelEl      = document.getElementById("selected-date-label");

// -----------------------
// STATE
// -----------------------
let viewDate        = new Date();                    // what month we’re viewing
let currYear        = viewDate.getFullYear();
let currMonth       = viewDate.getMonth();           // 0–11
let selectedDateKey = null;                          // "YYYY-MM-DD"

const events = {};                                   // { "2025-11-03": [ {id,title,description}, ... ] }

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// -----------------------
// HELPERS
// -----------------------
function formatDateKey(year, monthIndex, day) {
  const y = year;
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// -----------------------
// CALENDAR RENDERING
// -----------------------
function renderCalendar() {
  const firstDayofMonth    = new Date(currYear, currMonth, 1).getDay();
  const lastDateofMonth    = new Date(currYear, currMonth + 1, 0).getDate();
  const lastDayofMonth     = new Date(currYear, currMonth, lastDateofMonth).getDay();
  const lastDateofLastMonth= new Date(currYear, currMonth, 0).getDate();

  let liTag = "";
  const today = new Date();

  // prev month tail
  for (let i = firstDayofMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
  }

  // current month days
  for (let i = 1; i <= lastDateofMonth; i++) {
    const thisKey = formatDateKey(currYear, currMonth, i);

    const isToday =
      i === today.getDate() &&
      currMonth === today.getMonth() &&
      currYear === today.getFullYear()
        ? "active"
        : "";

    const isSelected = thisKey === selectedDateKey ? "selected" : "";

    const hasEvent =
      events[thisKey] && events[thisKey].length > 0 ? "has-event" : "";

    liTag += `<li class="${isToday} ${isSelected} ${hasEvent}">${i}</li>`;
  }

  // next month head
  for (let i = lastDayofMonth; i < 6; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.textContent = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
}

renderCalendar();

// prev / next arrows
prevNextIcon.forEach(icon => {
  icon.addEventListener("click", () => {
    if (icon.id === "prev") {
      currMonth--;
    } else if (icon.id === "next") {
      currMonth++;
    }

    if (currMonth < 0 || currMonth > 11) {
      viewDate = new Date(currYear, currMonth, 1);
      currYear = viewDate.getFullYear();
      currMonth = viewDate.getMonth();
    }

    renderCalendar();
  });
});

// -----------------------
// EVENT LIST RENDERING
// -----------------------
function renderEventsForSelectedDate() {
  if (!eventListEl) return;

  if (!selectedDateKey) {
    if (eventDateLabelEl) eventDateLabelEl.textContent = "No day selected";
    eventListEl.innerHTML = "<li>No events for this day.</li>";
    return;
  }

  if (eventDateLabelEl) eventDateLabelEl.textContent = selectedDateKey;

  const list = events[selectedDateKey] || [];

  if (!list.length) {
    eventListEl.innerHTML = "<li>No events for this day.</li>";
    return;
  }

  eventListEl.innerHTML = list
    .map(ev => `
      <li data-id="${ev.id}">
        <div class="event-item-text">
          <div class="event-item-title">${ev.title}</div>
          <div class="event-item-desc">${ev.description || ""}</div>
        </div>
        <button class="delete-event-btn">Delete</button>
      </li>
    `)
    .join("");

  // delete handlers
  eventListEl.querySelectorAll(".delete-event-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const li  = e.target.closest("li");
      const id  = Number(li.dataset.id);
      const arr = events[selectedDateKey];
      if (!arr) return;

      const idx = arr.findIndex(ev => ev.id === id);
      if (idx !== -1) {
        arr.splice(idx, 1);
        if (!arr.length) delete events[selectedDateKey];
      }

      renderEventsForSelectedDate();
      renderCalendar();         // update dots on the calendar
    });
  });
}

// -----------------------
// DAY CLICK
// -----------------------
daysTag.addEventListener("click", e => {
  const target = e.target;
  if (target.tagName !== "LI") return;
  if (target.classList.contains("inactive")) return;

  const dayNumber = Number(target.textContent);
  if (!dayNumber) return;

  selectedDateKey = formatDateKey(currYear, currMonth, dayNumber);

  renderCalendar();             // to reapply selected + has-event classes
  renderEventsForSelectedDate();
});

// -----------------------
// ADD EVENT
// -----------------------
function addEvent() {
  if (!selectedDateKey) {
    alert("Please select a day in the calendar first.");
    return;
  }

  const title = eventTitleInput.value.trim();
  const description = eventDescriptionInput.value.trim();

  if (!title) {
    alert("Please enter an event title.");
    return;
  }

  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  }

  events[selectedDateKey].push({
    id: Date.now(),
    title,
    description
  });

  eventTitleInput.value = "";
  eventDescriptionInput.value = "";

  renderEventsForSelectedDate();
  renderCalendar();             // show dot on that day
}

if (addEventBtn) {
  addEventBtn.addEventListener("click", addEvent);
}

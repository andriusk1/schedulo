const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

const eventTitleInput   = document.getElementById("event-title");
const addEventBtn       = document.getElementById("add-event-btn");
const eventListEl       = document.querySelector(".event-list");
const eventDateLabelEl  = document.querySelector(".event-date-label");

let selectedDate = null;
const events = {};

function formatDateKey(year, monthIndex, day) {
    const y = year;
    const m = String(monthIndex + 1).padStart(2, "0"); // monthIndex is 0–11
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function renderEventsForSelectedDate() {
    if (!eventListEl || !eventDateLabelEl) return;

    if (!selectedDate) {
        eventDateLabelEl.textContent = "No day selected";
        eventListEl.innerHTML = "";
        return;
    }

    eventDateLabelEl.textContent = `Events on ${selectedDate}`;
    const list = events[selectedDate] || [];

    if (!list.length) {
        eventListEl.innerHTML = "<li>No events for this day.</li>";
        return;
    }

    eventListEl.innerHTML = list
        .map((title, i) => `<li>${i + 1}. ${title}</li>`)
        .join("");
}

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

// =========================
// EVENT SYSTEM ADD-ON
// =========================

// unique id counter for events
let eventIdCounter = 0;

// override the old renderer to support description + delete
function renderEventsForSelectedDate() {
    if (!eventListEl || !eventDateLabelEl) return;

    if (!selectedDate) {
        eventDateLabelEl.textContent = "No day selected";
        eventListEl.innerHTML = "";
        return;
    }

    eventDateLabelEl.textContent = `Events on ${selectedDate}`;
    const list = events[selectedDate] || [];

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

    // hook up delete buttons
    eventListEl.querySelectorAll(".delete-event-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const li = e.target.closest("li");
            const id = Number(li.dataset.id);
            const list = events[selectedDate];
            if (!list) return;

            const idx = list.findIndex(ev => ev.id === id);
            if (idx !== -1) {
                list.splice(idx, 1);
                if (!list.length) {
                    delete events[selectedDate];
                }
            }
            renderEventsForSelectedDate();
        });
    });
}

// 1) clicking a day selects it and shows its events
daysTag.addEventListener("click", e => {
    const target = e.target;
    if (target.tagName !== "LI") return;
    if (target.classList.contains("inactive")) return;

    const dayNumber = Number(target.textContent);
    if (!dayNumber) return;

    selectedDate = formatDateKey(currYear, currMonth, dayNumber);

    // visual highlight
    document.querySelectorAll(".days li").forEach(li => {
        li.classList.remove("selected");
    });
    target.classList.add("selected");

    renderEventsForSelectedDate();
});

const eventDescriptionInput = document.getElementById("event-description");

function addEvent() {
    if (!selectedDate) {
        alert("Please select a day in the calendar first.");
        return;
    }

    const title = eventTitleInput.value.trim();
    const description = eventDescriptionInput.value.trim();

    if (!title) {
        alert("Please enter an event title.");
        return;
    }

    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }

    events[selectedDate].push({
        id: Date.now(),
        title: title,
        description: description
    });

    eventTitleInput.value = "";
    eventDescriptionInput.value = "";

    renderEventsForSelectedDate();
}
addEventBtn.addEventListener("click", addEvent);

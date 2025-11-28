// muutujate defineerimine
const Container = document.getElementById("container");
let selectedText = "";
let rangeAT = "";
let noteData = JSON.parse(localStorage.getItem("noteData")) || [];

// uue märkme loomise funktsioon
function CreateNewNote(e) {
  let div = document.createElement("div");
  div.classList.add("note-row");
  let content = e && e.trim() !== "" ? e : "Click to start typing...";
  let newHTML =
    `<div contenteditable="true"
    class="note-editor"
    id="note-editor"
    onmouseup="getSelectedText()"
    onfocus="clearPlaceholder(this)"
    onblur="restorePlaceholder(this)">
    ${content}
    </div>
        <div class="note-controls">
        <div onclick="getSelected('capitalize')" class="capitalize">Aa</div>
        <div onclick="getSelected('bold')" class="bold">B</div>
        <div onclick="getSelected('italic')" class="italic">I</div>
        <div onclick="getSelected('underline')" class="underline">U</div>
        <div onclick="getSelected('lineThrough')" class="lineThrough">ab</div>
        <div onclick="DeleteNote(this)" class="delete-note">DELETE NOTE</div>
    </div>`;
  div.innerHTML = newHTML;
  if (Container.firstChild) {
    Container.insertBefore(div, Container.firstChild);
  } else {
    Container.appendChild(div);
  }

  // Enter-klahvi käsitlemine märkme sees
  const noteEditor = document.querySelectorAll(".note-editor");
  noteEditor.forEach((el) =>
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        document.execCommand("insertHTML", false, "<br/>");
        return false;
      }
    })
  );
  SaveNoteData();
}

// märkmete salvestamise funktsioon
function SaveNoteData() {
  noteData = [];
  const noteEditor = document.querySelectorAll(".note-editor");

  noteEditor.forEach((el) => {
    const html = el.innerHTML.trim();

    // salvesta ainult siis kui märkmel on sisu
    if (html && html !== "Click to start typing...") {
      noteData.push({ value: html });
    }
  });

  localStorage.setItem("noteData", JSON.stringify(noteData));
}

// valitud teksti funktsioon
function getSelectedText() {
  selectedText = window.getSelection().toString();
  rangeAT = window.getSelection().getRangeAt(0);
}

// valitud tekstile stiili rakendamise funktsioon
function getSelected(style) {
  if (selectedText) {
    let div = document.createElement("span");
    div.classList.add(style);
    div.innerHTML = selectedText;
    rangeAT.deleteContents();
    rangeAT.insertNode(div);
  }
}

// märkme kustutamise funktsioon
function DeleteNote(e) {
  let conform = confirm("Are you sure! Do you want to Delete?");
  if (conform) {
    e.parentElement.parentElement.remove();
    SaveNoteData();
  }
}


// märkmete lugemise funktsioon
function readData() {
  const raw = localStorage.getItem("noteData");
  if (!raw) return;

  try {
    noteData = JSON.parse(raw) || [];
  } catch (err) {
    noteData = [];
  }

  noteData.forEach((element) => {
    CreateNewNote(element.value);
  });
}

// lehe laadimisel märkmete lugemine
window.addEventListener("DOMContentLoaded", readData);

// uue märkme lisamise funktsioon
function AddNote() {
  CreateNewNote("");
}

// kõigi märkmete kustutamise funktsioon
function DeleteAllNotes() {
  let ok = confirm("Delete ALL notes? This cannot be undone.");
  if (!ok) return;

  document.querySelectorAll(".note-row").forEach(n => n.remove());

  localStorage.removeItem("noteData");

  noteData = [];
}

// märkme kohatäite eemaldamise funktsioon
function clearPlaceholder(el) {
  if (el.innerHTML.trim() === "Click to start typing...") {
    el.innerHTML = "";
  }
}

// märkme kohatäite taastamise funktsioon
function restorePlaceholder(el) {
  if (el.innerHTML.trim() === "") {
    el.innerHTML = "Click to start typing...";
  }
}

// Allikas: https://dev.to/sharathchandark/how-to-create-sticky-note-app-in-html-css-javascript-mini-text-editor-111i
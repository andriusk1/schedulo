const Container = document.getElementById("container");
let selectedText = "";
let rangeAT = "";
let noteData = JSON.parse(localStorage.getItem("noteData")) || [];

function CreateNewNote(e) {
  let div = document.createElement("div");
  div.classList.add("note-row");
  let newHTML =
    `<div contenteditable="true" class="note-editor" id="note-editor" onmouseup="getSelectedText()">` +
    e +
    `</div>
        <div class="note-controls">
        <div onclick="getSelected('capitalize')" class="capitalize">Aa</div>
        <div onclick="getSelected('bold')" class="bold">B</div>
        <div onclick="getSelected('italic')" class="italic">I</div>
        <div onclick="getSelected('underline')" class="underline">U</div>
        <div onclick="getSelected('lineThrough')" class="lineThrough">ab</div>
        <hr />
        <img src="images/delete.png" onclick="DeleteNote(this)" />
        </div>`;
  div.innerHTML = newHTML;
  Container.appendChild(div);

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

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        SaveNoteData();
    }
});

function SaveNoteData() {
  noteData = [];
  localStorage.setItem("noteData", []);
  const noteEditor = document.querySelectorAll(".note-editor");
  noteEditor.forEach((el) => {
    if (el.innerHTML !== "") {
      let HTML = { value: el.innerHTML };
      noteData.push(HTML);
    }
  });

  localStorage.setItem("noteData", JSON.stringify(noteData));
}

function readData() {
  noteData.forEach((element) => {
    CreateNewNote(element.value + "<br />");
  });
}

function getSelectedText() {
  selectedText = window.getSelection().toString();
  rangeAT = window.getSelection().getRangeAt(0);
}

function getSelected(style) {
  if (selectedText) {
    let div = document.createElement("span");
    div.classList.add(style);
    div.innerHTML = selectedText;
    rangeAT.deleteContents();
    rangeAT.insertNode(div);
  }
}

function DeleteNote(e) {
  let conform = confirm("Are you sure! Do you want to Delete?");
  if (conform) {
    e.parentElement.parentElement.remove();
    SaveNoteData();
  }
}

// Save all notes into localStorage
function SaveNoteData() {
  noteData = [];
  const noteEditor = document.querySelectorAll(".note-editor");

  noteEditor.forEach((el) => {
    const html = el.innerHTML.trim();
    if (html !== "") {
      noteData.push({ value: html });
    }
  });

  localStorage.setItem("noteData", JSON.stringify(noteData));
}

// Re-load notes from localStorage
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

// Call readData AFTER functions are defined
window.addEventListener("DOMContentLoaded", readData);

// Optional: button to add a completely empty new note
function AddNote() {
  CreateNewNote("");
}

function DeleteAllNotes() {
  let ok = confirm("Delete ALL notes? This cannot be undone.");
  if (!ok) return;

  // Remove all visual notes
  document.querySelectorAll(".note-row").forEach(n => n.remove());

  // Clear localStorage data
  localStorage.removeItem("noteData");

  // Reset in-memory array
  noteData = [];
}
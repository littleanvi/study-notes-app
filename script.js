let notes = JSON.parse(localStorage.getItem("studyNotes")) || [];
let editingIndex = null;
const noteTitle = document.getElementById("noteTitle");
const noteSubject = document.getElementById("noteSubject");
const noteContent = document.getElementById("noteContent");
const saveNoteButton = document.getElementById("saveNote");

const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");

const searchInput = document.getElementById("searchNotes");
const filterSubject = document.getElementById("filterSubject");
saveNoteButton.addEventListener("click", function () {
    const title = noteTitle.value.trim();
    const subject = noteSubject.value.trim();
    const content = noteContent.value.trim();

    if (title === "" || subject === "" || content === "") {
        alert("Please fill in the title, subject, and notes content.");
        return;
    }

    const note = {
        title: title,
        subject: subject,
        content: content
    };

    if (editingIndex === null) {
        notes.push(note);
    } else {
        notes[editingIndex] = note;
        editingIndex = null;
        saveNoteButton.textContent = "Save Note";
    }

    saveNotes();

    noteTitle.value = "";
    noteSubject.value = "";
    noteContent.value = "";

    displayNotes();
    noteCount.textContent = `${notes.length} Notes`;
});

function displayNotes() {
    notesContainer.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();
    const currentSubject = filterSubject.value;

    const subjects = [...new Set(notes.map(function (note) {
        return note.subject;
    }))];

    filterSubject.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All Subjects";
    filterSubject.appendChild(allOption);

    subjects.sort().forEach(function (subject) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        filterSubject.appendChild(option);
    });

    filterSubject.value = subjects.includes(currentSubject)
        ? currentSubject
        : "All";

    const selectedSubject = filterSubject.value;

    const filteredNotes = notes
        .map((note, index) => ({ ...note, originalIndex: index }))
        .filter(function (note) {
            const matchesSearch =
                note.title.toLowerCase().includes(searchText) ||
                note.subject.toLowerCase().includes(searchText) ||
                note.content.toLowerCase().includes(searchText);

            const matchesSubject =
                selectedSubject === "All" ||
                note.subject === selectedSubject;

            return matchesSearch && matchesSubject;
        });

    if (filteredNotes.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";

        emptyMessage.textContent = notes.length === 0
            ? "No notes yet. Create your first note!"
            : "No matching notes found. Try another search or subject.";

        notesContainer.appendChild(emptyMessage);
        return;
    }

    filteredNotes.forEach(function (note) {
        const card = document.createElement("div");
        card.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const subject = document.createElement("span");
        subject.className = "note-subject";
        subject.textContent = note.subject;

        const content = document.createElement("p");
        content.textContent = note.content;

        const actions = document.createElement("div");
        actions.className = "note-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-note";
        editButton.addEventListener("click", function () {
            const index = note.originalIndex;

            editingIndex = index;
            noteTitle.value = notes[index].title;
            noteSubject.value = notes[index].subject;
            noteContent.value = notes[index].content;
            saveNoteButton.textContent = "Update Note";
            noteTitle.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-note";
        deleteButton.addEventListener("click", function () {
            const index = note.originalIndex;

            if (confirm("Are you sure you want to delete this note?")) {
                notes.splice(index, 1);

                if (typeof editingIndex !== "undefined" && editingIndex !== null) {
                    if (editingIndex === index) {
                        editingIndex = null;
                        saveNoteButton.textContent = "Save Note";
                        noteTitle.value = "";
                        noteSubject.value = "";
                        noteContent.value = "";
                    } else if (editingIndex > index) {
                        editingIndex--;
                    }
                }
                saveNotes();
                displayNotes();
                noteCount.textContent = `${notes.length} Notes`;
            }
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(subject);
        card.appendChild(content);
        card.appendChild(actions);

        notesContainer.appendChild(card);
    });
}
searchInput.addEventListener("input", displayNotes);
filterSubject.addEventListener("change", displayNotes);
function saveNotes() {
    localStorage.setItem("studyNotes", JSON.stringify(notes));
}
displayNotes();
noteCount.textContent = `${notes.length} Notes`;
const darkModeToggle = document.getElementById("darkModeToggle");

// Restore the saved theme when the app opens
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️ Light Mode";
}

// Switch between light and dark themes
darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});
// class habit
class Habit {
    constructor({ id = null, title, type, goal = 1, progress = 0, frequency }) {
        this.id = id || crypto.randomUUID();
        this.title = title;
        this.goal = goal || 1;
        this.type = type;
        this.progress = progress || 0;
        this.frequency = frequency;
        this.createdDate = parseDate(new Date());
        this.nextDueDate = new Date();
        this.updatedDate = new Date();

        if (this.frequency.type === "daily") {
            this.nextDueDate.setDate(this.createdDate.getDate() + 1);
        } else if (this.frequency.type === "weekly") {
            this.nextDueDate.setDate(this.createdDate.getDate() + 7);
        } else if (this.frequency.type === "custom") {
            this.nextDueDate.setDate(this.createdDate.getDate() + parseInt(this.frequency.customDays));
        }
        this.nextDueDate = parseDate(this.nextDueDate);
    }
}

function parseDate(date) {
    return new Date(date.toDateString());
}

const modal = document.querySelectorAll('.modal');
const helpBtn = document.getElementById('helpBtn');
const closeModalBtn = document.querySelectorAll('.close-modal');
const darkModeBtn = document.querySelectorAll('.fa-moon, .fa-sun');

const allHabits = [];

function setHabits() {
    allHabits.push(...JSON.parse(localStorage.getItem('habits') || "[]"));
}

function toggleDarkMode() {
    const body = document.querySelector('body');
    body.classList.toggle('dark-mode');

    // set localStorage
    const isDark = body.classList.contains("dark-mode")
    localStorage.setItem("darkMode", isDark)
}

helpBtn.addEventListener('click', () => {
    document.querySelector("#modal-instructions").classList.remove("hidden");
});

[...closeModalBtn].forEach(button => {
    button.addEventListener('click', (e) => {
        closeModal(e);
    });
})

darkModeBtn.forEach((btn) => {
    btn.addEventListener('click', toggleDarkMode);
});

function getDarkMode() {
    return (localStorage.getItem("darkMode") || "true") === "true";
}

function clearAllHabits() {
    allHabits.length = 0;
    localStorage.setItem('habits', JSON.stringify(allHabits));
}

function applyTheme() {
    const darkMode = getDarkMode();
    if (!darkMode) {
        toggleDarkMode();
    }
}


function sortHabits() {
    allHabits.sort((a, b) => {
        // 1. Sort by uncompleted first (progress < goal)
        const isAUncompleted = parseFloat(a.progress) < parseFloat(a.goal);
        const isBUncompleted = parseFloat(b.progress) < parseFloat(b.goal);

        if (isAUncompleted !== isBUncompleted) {
            return isAUncompleted ? -1 : 1; // Uncompleted comes first
        }

        // 2. Sort by closest due date (nextDueDate)
        const dateA = new Date(a.nextDueDate);
        const dateB = new Date(b.nextDueDate);
        if (dateA - dateB !== 0) {
            return dateA - dateB; // Closest due date comes first
        }

        // 3. Sort by title alphabetically
        return a.title.localeCompare(b.title);
    });
    localStorage.setItem('habits', JSON.stringify(allHabits));
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function closeModal(e) {
    e.target.closest('.modal').classList.add("hidden");
}
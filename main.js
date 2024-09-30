const modal = document.querySelector('.modal');
const helpBtn = document.getElementById('helpBtn');
const closeModalBtn = document.querySelector('.close-modal');
const darkModeBtn = document.querySelectorAll('.fa-moon, .fa-sun');

const allHabits = [
    {
        id: '1',
        title: 'Read a book',
        progress: 17,
        goal: 30,
        type: 'numeric',
        unit: 'pages'
    },
    {
        id: '2',
        title: 'Drink water',
        progress: 6,
        goal: 8,
        type: 'numeric',
        unit: 'glasses'
    },
    {
        id: '3',
        title: 'Do exercise',
        progress: 0,
        goal: 1,
        type: 'binary'
    },
]

// check local storage
if (localStorage.getItem('habits') === null) {
    localStorage.setItem('habits', JSON.stringify(allHabits));
}

allHabits.length = 0; // reset
allHabits.push(...JSON.parse(localStorage.getItem('habits')));

let lastId = allHabits[allHabits.length - 1].id;
setLastId(lastId);

function getLastId() {
    return localStorage.getItem('lastId') || 0;
}

function setLastId(id) {
    localStorage.setItem('lastId', id);
}

function toggleDarkMode() {
    const body = document.querySelector('body');
    body.classList.toggle('dark-mode');
    
    // set localStorage
    const isDark = body.classList.contains("dark-mode")
    localStorage.setItem("darkMode", isDark)
}

helpBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

darkModeBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        toggleDarkMode();
    });
});

function getDarkMode() {
    return localStorage.getItem("darkMode") || true;
}
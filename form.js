const habitType = document.getElementsByName('type');
const numericHabitInput = document.querySelectorAll('.numeric-habit')
const frequencyInput = document.getElementsByName('frequency');

for (let i = 0; i < habitType.length; i++) {
    habitType[i].addEventListener('change', (event) => {
        if (event.target.value === 'numeric') {
            [...numericHabitInput].forEach(input => {
                input.classList.remove('hidden');
                input.querySelector("input").setAttribute("required", "true");
                input.value = '';
            })
        } else {
            [...numericHabitInput].forEach(input => {
                input.classList.add('hidden')
                input.querySelector("input").removeAttribute("required");
            })
        }
    });
}

for (let i = 0; i < frequencyInput.length; i++) {
    frequencyInput[i].addEventListener('change', (event) => {
        const grandParent = event.target.parentElement.parentElement;
        const customDays = grandParent.nextElementSibling;
        if (event.target.value === 'custom') {
            customDays.classList.remove('hidden');
            customDays.querySelector("input").setAttribute("required", "true");
        } else {
            customDays.classList.add('hidden');
            customDays.querySelector("input").removeAttribute("required");
        }
    });
}

// handle submit form
const form = document.querySelector('form');


function saveHabit() {
    const title = document.getElementById('title').value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const goal = document.getElementById('goal').value;
    const progress = document.getElementById('progress').value;
    const frequency = document.querySelector('input[name="frequency"]:checked').value;
    const customDays = document.getElementById('customDays').value;

    const newHabit = new Habit({
        title,
        type,
        goal,
        progress,
        frequency: {
            type: frequency,
            customDays
        }
    })

    if (id) {
        // remove old habit
        const index = allHabits.findIndex(habit => habit.id === id);
        allHabits.splice(index, 1);
    }

    allHabits.push(newHabit);

    localStorage.setItem('habits', JSON.stringify(allHabits));
    window.open('/', '_self');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveHabit();
})

function gotoHome() {
    window.open('/', '_self');
}

function validateForm() {
    const form = document.querySelector('form');
    form.reportValidity();
    if (!form.checkValidity()) {
        return false;
    }
    return true;
}

// set id input if query string exists
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
if (id) {
    const idInput = document.getElementById('id');
    idInput.value = id;

    const formTitle = document.querySelector('header h1');
    const titleInput = document.getElementById('title');
    const goalInput = document.getElementById('goal');
    const progressInput = document.getElementById('progress');
    const submitBtn = document.querySelector('.submit-btn');

    const currentHabits = JSON.parse(localStorage.getItem('habits')) || [];
    const habit = currentHabits.find(habit => habit.id === id);
    if (habit) {
        formTitle.textContent = 'Edit Habit';
        titleInput.value = habit.title;
        document.querySelector(`#type-${habit.type}`).click();
        document.querySelector(`#frequency-${habit.frequency.type}`).click();

        if (habit.frequency.customDays) {
            document.getElementById('customDays').value = habit.frequency.customDays;
        }
        
        [...numericHabitInput].forEach(input => {
            input.querySelector("input").removeAttribute("required");
        })
        goalInput.value = habit.goal || 1;
        progressInput.value = habit.progress || 0;
        submitBtn.textContent = 'Update';

        titleInput.focus();
    }
}

window.addEventListener('load', function () {
    setHabits();
    applyTheme();
})
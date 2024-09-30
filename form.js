const habitType = document.getElementsByName('type');
const numericHabitInput = document.querySelectorAll('.numeric-habit')

for (let i = 0; i < habitType.length; i++) {
    habitType[i].addEventListener('change', (event) => {
        console.log("changed")
        if (event.target.value === 'numeric') {
            [...numericHabitInput].forEach(input => {
                input.classList.remove('hidden');
                input.setAttribute("required", "true");
            })
        } else {
            [...numericHabitInput].forEach(input => {
                input.classList.add('hidden')
                input.setAttribute("required", "false");
            })
        }
    });
}

// handle submit form
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.progress = 0;
    data.goal = data.goal || 1;

    const id = document.getElementById('id').value;
    const currentHabits = JSON.parse(localStorage.getItem('habits')) || [];
    if (id) {
        data.id = id;

        const habit = currentHabits.find(habit => habit.id === id);
        habit.title = data.title;
        habit.type = data.type;
        habit.goal = data.goal;
        habit.unit = data.unit;
        localStorage.setItem('habits', JSON.stringify(currentHabits));
        window.open('/', '_self');
    } else {
        const lastId = getLastId();
        data.id = String(parseInt(lastId) + 1);
        setLastId(data.id);
        
        currentHabits.push(data);
        localStorage.setItem('habits', JSON.stringify(currentHabits));
        window.location.reload();
    }
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
    const unitInput = document.getElementById('unit');
    const submitBtn = document.querySelector('.submit-btn');

    const currentHabits = JSON.parse(localStorage.getItem('habits')) || [];
    const habit = currentHabits.find(habit => habit.id === id);
    if (habit) {
        formTitle.textContent = 'Edit Habit';
        titleInput.value = habit.title;
        document.querySelector(`#type-${habit.type}`).click();
        goalInput.value = habit.goal || 1;
        unitInput.value = habit.unit || '';
        submitBtn.textContent = 'Update';

        titleInput.focus();
    }
}
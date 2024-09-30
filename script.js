function renderHabits(habits) {
    const habitList = document.querySelector('.habit-list');

    habitList.innerHTML = '';
    habits.forEach((habit) => {
        const habitItem = document.createElement('div');
        habitItem.classList.add('habit-item');
        habitItem.setAttribute('data-id', habit.id);
        habitItem.innerHTML = `
            <div class="habit-header">
                <h3>${habit.title}</h3>
                <div>
                    <a><i class="fa-solid fa-pen" onclick="editHabit(${habit.id})" title="Edit Habit"></i></a>
                    <a><i class="fa-solid fa-trash" onclick="deleteHabit('${habit.id}')" title="Delete Habit"></i></a>
                </div>
            </div>
            
            <div class="habit-body">
                <div class="habit-progress">
                    <div class="habit-progress-bar" data-percent="0"></div>
                </div>
                `
        if (habit.type === 'numeric') {
            habitItem.innerHTML += `
                <div class="habit-stats">
                    <p>Goal: ${habit.goal} ${habit.unit}</p>
                    <p>Progress: <span class="progress-text">${habit.progress}</span>/${habit.goal}</p>
                </div>`;
        }
            
        habitItem.innerHTML += `
            </div>
            <div class="habit-footer">
                ${habit.type === 'numeric' ?
                `<a class="fa-solid fa-minus" onclick="decrementHabit(this)"></a><a class="fa-solid fa-plus" onclick="incrementHabit(this)"></a>` :
                `<a class="fa-solid fa-check" onclick="completeHabit(this)"></a>`
                }
            </div>
        `;
        habitList.appendChild(habitItem);

        renderProgress(habit.id, habit.progress, habit.goal);
    });

}

function renderProgress(habitId, habitProgress = 0, habitGoal = 0) {
    const percentage = Math.ceil(habitProgress * 100 / habitGoal);
    const progressText = document.querySelector(`.habit-item[data-id="${habitId}"] .progress-text`);
    progressText && (progressText.textContent = habitProgress);
    const progressBar = document.querySelector(`.habit-item[data-id="${habitId}"] .habit-progress-bar`);
    progressBar.dataset.percent = percentage;
    progressBar.style.width = `${percentage}%`;

    const habitFooter = document.querySelector(`.habit-item[data-id="${habitId}"] .habit-footer`);
    const habitActions = habitFooter.getElementsByTagName('a');
    const decrementHabitBtn = habitFooter.querySelector(`.fa-minus`);
    if (percentage === 100) {
        [...habitActions].forEach(action => action.remove());

        const completedMark = document.createElement('span');
        completedMark.classList.add('habit-completed');
        completedMark.textContent = 'Completed';
        habitFooter.appendChild(completedMark);
    } else if (percentage === 0) {
        decrementHabitBtn && decrementHabitBtn.classList.add('hidden');
    } else {
        decrementHabitBtn && decrementHabitBtn.classList.remove('hidden');
    }
}

function incrementHabit(elm) {
    const habitId = elm.parentElement.parentElement.getAttribute("data-id");
    const habit = allHabits.find((habit) => habit.id === habitId);
    habit.progress++;
    renderProgress(habitId, habit.progress, habit.goal);
}

function decrementHabit(elm) {
    const habitId = elm.parentElement.parentElement.getAttribute("data-id");
    const habit = allHabits.find((habit) => habit.id === habitId);
    if (habit.progress > 0) {
        habit.progress--;
    }
    renderProgress(habitId, habit.progress, habit.goal);
}

function completeHabit(elm) {
    const habitId = elm.parentElement.parentElement.getAttribute("data-id");
    const habit = allHabits.find((habit) => habit.id === habitId);
    habit.progress = habit.goal;
    renderProgress(habitId, habit.progress, habit.goal);
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function addHabit() {
    window.open('/form', '_self');
}

window.addEventListener('load', function() {
    renderHabits(allHabits);
})

function editHabit(id) {
    window.open(`/form/index.html?id=${id}`, '_self');
}

function deleteHabit(id) {
    const index = allHabits.findIndex(habit => habit.id === id);
    if (index !== -1) {
        allHabits.splice(index, 1);
        localStorage.setItem('habits', JSON.stringify(allHabits));
        renderHabits(allHabits);
    }
}
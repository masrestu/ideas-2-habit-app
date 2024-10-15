function renderHabits(habits) {
    sortHabits();
    const habitList = document.querySelector('.habit-list');

    habitList.innerHTML = '';
    if (!habits.length) {
        habitList.innerHTML = '<p class="no-habits">No habits yet.</p>';
        return;
    }

    habits.forEach(habit => {
        const habitItem = document.createElement('div');
        habitItem.classList.add('habit-item');
        habitItem.setAttribute('data-id', habit.id);
        habitItem.innerHTML = `
            <div class="habit-header">
                <h3>${habit.title}</h3>
            </div>
            
            <div class="habit-body">
                <div class="habit-progress">
                    <div class="habit-progress-bar" data-percent="0"></div>
                </div>
                <div class="habit-stats">
                    <div class="habit-action">
                        ${habit.type === 'numeric' ?
                        `<a class="fa-solid fa-minus" onclick="decrementHabit(this)"></a>
                        <p><span class="habit-numeric-progress"></span> / ${habit.goal}</p>
                        <a class="fa-solid fa-plus" onclick="incrementHabit(this)"></a>` :
                        `<p><span class="habit-numeric-progress"></span> / ${habit.goal}</p>
                        <a class="fa-solid fa-check" onclick="completeHabit(this)"></a>`
                        }
                    </div>
                    <p><i class="fa-solid fa-rotate"></i> ${habit.frequency.customDays ? "Every " + habit.frequency.customDays + " days" : habit.frequency.type}</p>
                </div>
                <div class="habit-stats">
                    <p><i class="fa-solid fa-bullseye"></i> ${new Date(habit.nextDueDate).toLocaleDateString()}</p>
                    <p class="progress-text hidden" style="display:none">In Progress</p>
                </div>
                <div class="habit-footer">
                    <a onclick="editHabit('${habit.id}')" title="Edit Habit">Edit</a>
                    <a onclick="deleteHabit('${habit.id}')" title="Delete Habit">Delete</a>
                </div>
                `
        if (habit.type === 'numeric') {
            habitItem.innerHTML += ``;
        }
            
        habitItem.innerHTML += `
            </div>
        `;

        if (parseInt(habit.progress) === parseInt(habit.goal)) {
            habitItem.classList.add('completed');
        }
        habitList.appendChild(habitItem);

        renderProgress(habit.id, habit.progress, habit.goal);
    });

}

function renderProgress(habitId, habitProgress = 0, habitGoal = 0, progressBefore = habitGoal) {
    const percentage = Math.ceil(habitProgress * 100 / habitGoal);
    const item = document.querySelector(`.habit-item[data-id="${habitId}"]`);
    if (!item) return;
    const progressText = item.querySelector(`.habit-item[data-id="${habitId}"] .progress-text`);
    const progressBar = item.querySelector(`.habit-item[data-id="${habitId}"] .habit-progress-bar`);
    progressBar.dataset.percent = percentage;
    progressBar.style.width = `${percentage}%`;

    const progress = item.querySelector(`.habit-item[data-id="${habitId}"] .habit-numeric-progress`);
    if (progress) {
        progress.innerText = habitProgress;
    }

    const habitActions = item.querySelectorAll('.habit-stats a');
    const decrementHabitBtn = item.querySelector(`.fa-minus`);
    if (percentage === 100) {
        [...habitActions].forEach(action => action.remove());
        progressText.innerText = "Completed";
        const actionContainer = item.querySelector('.habit-action');
        const badge = document.createElement('a');
        badge.classList.add('fa-solid', 'fa-medal');
        actionContainer.appendChild(badge);
        if (progressBefore < habitGoal) {
            const modalCongrats = document.querySelector('#modal-congrats');
            modalCongrats.querySelector("button").setAttribute("data-id", habitId)
            modalCongrats.classList.remove('hidden');
        }
    } else if (percentage === 0) {
        decrementHabitBtn && decrementHabitBtn.classList.add('hidden');
    } else {
        decrementHabitBtn && decrementHabitBtn.classList.remove('hidden');
    }
    updateHabitStorage();
}

function incrementHabit(elm) {
    const habitId = elm.closest('.habit-item').getAttribute("data-id");
    const habit = allHabits.find((habit) => habit.id === habitId);
    const progressBefore = habit.progress;
    habit.progress++;
    renderProgress(habitId, habit.progress, habit.goal, progressBefore);
}

function decrementHabit(elm) {
    const habitId = elm.closest('.habit-item').getAttribute("data-id");
    const habit = allHabits.find((habit) => habit.id === habitId);
    if (habit.progress > 0) {
        habit.progress--;
    }
    renderProgress(habitId, habit.progress, habit.goal);
}

function completeHabit(elm) {
    const habitId = elm.closest('.habit-item').getAttribute("data-id");
    const habit = allHabits.find((habit) => habit.id === habitId);
    const progressBefore = habit.progress;
    habit.progress = habit.goal;
    renderProgress(habitId, habit.progress, habit.goal, progressBefore);
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        event.target.closest(".modal").classList.add("hidden");
    }
});

function addHabit() {
    window.open('/form', '_self');
}

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

function setNextHabit(id) {
    const index = allHabits.findIndex(habit => habit.id === id);
    if (index !== -1) {
        const completedDate = new Date();

        if (allHabits[index].frequency.type === "daily") {
            completedDate.setDate(completedDate.getDate() + 1);
        } else if (allHabits[index].frequency.type === "weekly") {
            completedDate.setDate(completedDate.getDate() + 7);
        } else if (allHabits[index].frequency.type === "custom") {
            completedDate.setDate(completedDate.getDate() + parseInt(allHabits[index].frequency.customDays));
        }

        allHabits[index].updatedDate = new Date();

        allHabits[index].nextDueDate = completedDate;

        localStorage.setItem('habits', JSON.stringify(allHabits));
        renderHabits(allHabits);
    }
}

const modalCongratsButton = document.querySelector("#modal-congrats button");

modalCongratsButton.addEventListener('click', (e) => {
    closeModal(e);
    const id = e.target.getAttribute("data-id");
    e.target.closest('.modal').classList.add("hidden");
    setNextHabit(id);
})

function resetForNextProgress() {
    const newHabits = allHabits.map((habit) => {
        if (parseInt(habit.progress) === parseInt(habit.goal) && dateOnly(habit.updatedDate) < dateOnly(new Date())) {
            return { ...habit, progress: 0, updatedDate: new Date() };
        }
        return habit;
    });
    localStorage.setItem('habits', JSON.stringify(newHabits));
    allHabits.length = 0;
    setHabits();
}

function checkNotification() {
    const warningHabits = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    allHabits.forEach((habit) => {
        habit.lastNotified = dateString(yesterday);
        if (parseInt(habit.progress) == parseInt(habit.goal)) return true;

        if (habit.lastNotified === undefined) habit.lastNotified = yesterday;
        
        if (dateString(habit.lastNotified) === dateString(new Date())) return true;

        if (dateOnly(habit.nextDueDate) < dateOnly(new Date())) {
            warningHabits.push(habit);
        } else {
            if (habit.frequency.type === "daily") {
                if (dateString(habit.nextDueDate) === dateString(new Date())) {
                    warningHabits.push(habit);
                }
            } else {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                if ([dateString(tomorrow), dateString(new Date())].includes(dateString(habit.nextDueDate))) {
                    warningHabits.push(habit);
                }
            }
        }
        // habit.lastNotified = dateString(new Date());

    })
    updateHabitStorage();
    if (warningHabits.length === 0) return;
    popupReminder(warningHabits);
}

window.addEventListener('load', function() {
    setHabits();
    applyTheme();
    resetForNextProgress();
    renderHabits(allHabits);
    checkNotification();
})
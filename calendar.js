let storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];

const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentDate = new Date();
const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth,0);
    const lastDay = new Date(currentYear, currentMonth+1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    for(let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
        datesHTML += '<div class="date inactive">' + prevDate.getDate() + '</div>';
    }

    outerLoop: for(let j = 1; j <= totalDays; j++) {
        const date = new Date(currentYear, currentMonth, j);
        const activeDay = date.toDateString() === new Date().toDateString() ? 'active' : '';
        let dayString = date.getDate().toString();
        let monthString = date.getMonth().toString();

        if (parseInt(date.getDate()) < 10) {
            dayString = "0" + date.getDate().toString();
        }
        if(parseInt(date.getMonth())+1 < 10) {
            monthString = "0" + (date.getMonth()+1).toString();
        }
        let dateString = date.getFullYear() + '-' + monthString + '-' + dayString;

        for(let r = 0; r < storedAssignments.length; r++) {
            if(storedAssignments[r].dueDate === dateString) {
                datesHTML += '<div class="date due">' + j + '</div>';
                continue outerLoop;
            }

        }

        datesHTML += '<div class="date ' + activeDay + '">' + j + '</div>';
    }

    for(let k = 1; k <= 7 - lastDayIndex; k++) {
        const nextDate = new Date(currentYear, currentMonth + 1, k);
        datesHTML += '<div class="date inactive">' + nextDate.getDate() + '</div>';
    }

    datesElement.innerHTML = datesHTML;
}

prevButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
})

nextButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
})

updateCalendar();
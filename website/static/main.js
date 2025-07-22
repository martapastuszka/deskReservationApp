const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();
let selectedDate = null;

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 0);
    const lastDay = new Date(currentYear, currentMonth+1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString
    ('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    for(let i = firstDayIndex; i > 0; i--){
        const prevDate = new Date(currentYear, currentMonth, 0 - i +1);
        datesHTML += `<div class = "date inactive" data-date="${prevDate.toISOString()}">${prevDate.getDate()}</div>`;
    }

    for(let i =1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i);
        const isToday    = date.toDateString() === new Date().toDateString();
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        datesHTML += `<div class="date ${isToday ? 'active' : ''} ${isSelected ? 'selected' : ''}" data-date="${date.toISOString()}">${i}</div>`;

    }

    for(let i = 1; i <= 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive" data-date="${nextDate.toISOString()}">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
})

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
})

datesElement.addEventListener('click', e => {
    const cell = e.target.closest('.date'); // account for nested elements
    if (!cell || cell.classList.contains('inactive')) return; // ignore padding cells
  
    const iso = cell.dataset.date;        // e.g. "2024-07-15T00:00:00.000Z"
    selectedDate = new Date(iso);
  
    // Do whatever you want with the picked date:
    console.log('You clicked', selectedDate.toDateString());
    // Example: emit an event, fill an input, call a callback, etc.
  
    updateCalendar(); // re-render to reflect the new .selected class
  });

updateCalendar();

// =======================================================================================
// ============================== CALENDAR SUPPORT =======================================
// =======================================================================================

const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDate = new Date();
let selectedDate = currentDate.setHours(0, 0, 0, 0);
selectedDate = toSqlDateTime(currentDate);

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
    // monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    for(let i = firstDayIndex; i > 0; i--){
        const prevDate = new Date(currentYear, currentMonth, 0 - i +1);
        // datesHTML += `<div class = "date inactive" data-date="${prevDate.toISOString()}">${prevDate.getDate()}</div>`;
        datesHTML += `<div class = "date inactive" >${prevDate.getDate()}</div>`;
    }

    for(let i =1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i, 0, 0, 0, 0);
        const isToday    = date.toDateString() === new Date().toDateString();
        const isSelected = toSqlDateTime(date) === selectedDate;
        const isPast     = date < currentDate;
        datesHTML += `<div class="date ${isToday ? 'active' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'inactive' : ''}"
                   data-date="${date.toISOString()}">${i}</div>`;
    }

    for(let i = 1; i <= 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        // datesHTML += `<div class="date inactive" data-date="${nextDate.toISOString()}">${nextDate.getDate()}</div>`;
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;
}

// prevBtn.addEventListener('click', () => {
//     currentDate.setMonth(currentDate.getMonth() - 1);
//     updateCalendar();
// })

// nextBtn.addEventListener('click', () => {
//     currentDate.setMonth(currentDate.getMonth() + 1);
//     updateCalendar();
// })

datesElement.addEventListener('click', e => {
    const cell = e.target.closest('.date'); 
    if (!cell || cell.classList.contains('inactive')) return;
  
    const iso = cell.dataset.date; 
    selectedDate = new Date(iso);
    selectedDate = toSqlDateTime(selectedDate);

    console.log("Clicked: ", selectedDate)
  
    updateCalendar(); 
  });

function toSqlDateTime(date) {
  const pad = n => String(n).padStart(2, '0');
  return (
    date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds())
  );
}

updateCalendar();



// =======================================================================================
// ============================== DESK SUPPORT ===========================================
// =======================================================================================

  let selectedDesk = null;

  // Capture the click on any desk
  document.querySelectorAll('svg .desk').forEach(path => {
    path.addEventListener('click', () => {
      selectedDesk = path.dataset.deskId;

      fetch('/desk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ desk_id: selectedDesk, date: selectedDate})
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          updateModalButton(data.reserved);
        } else {
          alert('Failed to get desk status');
        }
      })
      .catch(err => console.error(err));
    });
  });


  function reserve_desk(){
    if (!selectedDesk) return; // extra safety

    fetch('/reserve-desk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk_id: selectedDesk, date: selectedDate})
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        alert('Desk reserved successfully!');
        updateModalButton(body.reserved);
      } else {
        alert(body.message || 'Something went wrong');
      }
    const modalEl = document.getElementById('myModal');
    $(modalEl).modal('hide');
    })
    .catch(err => console.error(err));
  }


  function cancel_reservation(){
    if(!selectedDesk) return; //extra safety

    fetch('/cancel-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk_id: selectedDesk, date: selectedDate})
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        alert('Reservation cancelled successfully!');
        updateModalButton(body.reserved);
      } else {
        alert(body.message || 'Something went wrong while cancelling reservation');
      }
    const modalEl = document.getElementById('myModal');
    $(modalEl).modal('hide');

  })
  .catch(err => console.error(err));
  }


  function updateModalButton(isReserved){
    const bookBtn = document.getElementById('book-btn');
    if(isReserved){
      bookBtn.textContent = 'Cancel reservation';
      bookBtn.onclick = cancel_reservation;
    }else{
      bookBtn.textContent = 'Book';
      bookBtn.onclick = reserve_desk;
    }
  }

  // function closeModal(){
  //   console.log('closeModal sie wywoluje');
  //   const modalEl = document.getElementById('myModal');
  //   $(modalEl).modal('hide');
  // }




  // Hook the Cancel Booking button
  // Zanim obsłużę Cancel Button to muszę się upewnić, że jeśli biurko ma status zarezerwowane, to po kliknięciu na nie pojawi mi sie
  // w modalu przycisk cancel reserwation
  // zeby to zrobic, to muszę odpytać bazę danych - czy biurko jest zarezerwowane, jak tak to open modal z dodatkowym przyciskiem 
  // albo po prostu zmień widoczność przycisku - czyli domyślnie ten przycisk istnieje tylko jest hidden.
  // jak biurko nie jest zarezerwowane to obsługiwany będzie przycisk Book.



//   function reserve_desk(){
//   // Hook the Book button
//   const bookBtn = document.getElementById('book-btn').addEventListener('click', () => {
//     if (!selectedDesk) return; // extra safety

//     console.log('Reserved desk ID:', selectedDesk);
//     fetch('/reserve-desk', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ desk_id: selectedDesk })
//     })
//     .then(res => res.json().then(data => ({ status: res.status, body: data })))
//     // DEBUG: CONSOLE LOG NA res
//     // czy jest zarezerwowane, kto zarezerwowal, czy jest wolne
//     .then(({ status, body }) => {
//       if (status === 200 && body.success) {
//         alert('Desk reserved successfully!');
//         //color the desk red
//         updateModalButton(body.reserved);
//         console.log(body.reserved);
//         // bookBtn.textContent = "Cancel reservation";
//         // bookBtn.removeEventListener('click', bookDesk);
//         // bookBtn.addEventListener('click', cancelReservation);
   
//       } else {
//         alert(body.message || 'Something went wrong');
//       }
//       // Optionally close the modal
//       const modalEl = document.getElementById('myModal');
//       let modal;

//       // If you know you’re on Bootstrap 5.2+
//       // if (bootstrap?.Modal?.getOrCreateInstance) {
//       //   modal = bootstrap.Modal.getOrCreateInstance(modalEl); // create if missing
//       // } else {
//       // Fallback for Bootstrap 4
//       modal = $(modalEl).data('bs.modal') || new bootstrap.Modal(modalEl);
// // }

//       modal.hide(); // now it can’t be undefined
//       // const modal = $(modalEl).data('bs.modal');
//       // modal.hide()
//       // modal.style.display = 'none';
//     })
//     .catch(err => console.error(err));
//   });
//   }

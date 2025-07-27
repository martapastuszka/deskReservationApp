// =======================================================================================
// ============================== CALENDAR SUPPORT =======================================
// =======================================================================================

const monthYearElement = document.getElementById('monthYear');
const datesElement     = document.getElementById('dates');
const prevBtn          = document.getElementById('prevBtn');
const nextBtn          = document.getElementById('nextBtn');

let currentDate   = new Date();                
currentDate.setHours(0, 0, 0, 0);
let selectedDate  = toSqlDateTime(currentDate);

const rangeStart = new Date();                   // today 00:00
rangeStart.setHours(0, 0, 0, 0);
const rangeEnd   = new Date(rangeStart);         // today + 14 days 23:59
rangeEnd.setDate(rangeEnd.getDate() + 14);

const updateCalendar = () => {
  const currentYear  = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDay     = new Date(currentYear, currentMonth, 1); // 1st of month
  const lastDay      = new Date(currentYear, currentMonth + 1, 0); // last of month
  const totalDays    = lastDay.getDate();
  const startWeekIdx = firstDay.getDay();
  const endWeekIdx   = lastDay.getDay();

  const monthYearString = currentDate.toLocaleString('default', {
    month: 'long', year: 'numeric'
  });
  monthYearElement.textContent = monthYearString;

  let datesHTML = '';

  // ---- previous-month leading blanks ----
  for (let i = startWeekIdx; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, 1 - i);
    datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
  }

  // ---- current-month days ----
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i, 0, 0, 0, 0);

    const isToday    = date.getTime() === rangeStart.getTime();
    const isSelected = toSqlDateTime(date) === selectedDate;

    // limit selectable dates to [rangeStart, rangeEnd]
    const isInactive = date < rangeStart || date > rangeEnd;

    datesHTML += `<div class="date ${isToday ? 'active' : ''} ${isSelected ? 'selected' : ''} ${isInactive ? 'inactive' : ''}" data-date="${date.toISOString()}">${i}</div>`;
  }

  // ---- next-month trailing blanks ----
  for (let i = 1; i < 7 - endWeekIdx; i++) {
    const nextDate = new Date(currentYear, currentMonth + 1, i);
    datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
  }

  datesElement.innerHTML = datesHTML;
};

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
})

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
})

datesElement.addEventListener('click', e => {
    const cell = e.target.closest('.date'); 
    if (!cell || cell.classList.contains('inactive')) return;
  
    const iso = cell.dataset.date; 
    selectedDate = new Date(iso);
    selectedDate = toSqlDateTime(selectedDate);

    console.log("Clicked: ", selectedDate)
  
    updateCalendar(); 
    updateDesks();
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
          updateModal(data, selectedDesk, selectedDate);
        } else {
          alert('Failed to get desk status');
        }
      })
      .catch(err => console.error(err));
    });
  });


  function updateDesks() {
    if (!selectedDate) return; // extra safety – make sure a date is chosen first
  
    fetch('/get-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate })
    })
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status === 200 && body.success) {
          console.log(body.desks);

          document.querySelectorAll('#floorplan .desk').forEach(el => {
            el.style.fill = 'transparent';
          });

          body.desks.forEach(({ desk_id, user_id }) => {
            const selector = `#${CSS.escape(desk_id)}, [data-desk-id="${desk_id}"]`;
            const deskEl = document.querySelector(selector);
            if (!deskEl) return; // desk not in the current SVG

            if (user_id === CURRENT_USER_ID) {
              deskEl.style.fill = '#1db954'; // green – my reservation
            } else {
              deskEl.style.fill = '#ff4d4f'; // red – someone else
            }
          });
        } else {
          alert(body.message || 'Something went wrong when loading desk data.');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Network or server error while fetching bookings.');
      });
  }
  


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
        // updateModal(body.reserved);
      } else {
        alert(body.message || 'Something went wrong');
      }
    const modalEl = document.getElementById('myModal');
    $(modalEl).modal('hide');
    updateDesks();
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
        // updateModal(body.reserved);
      } else {
        alert(body.message || 'Something went wrong while cancelling reservation');
      }
    const modalEl = document.getElementById('myModal');
    $(modalEl).modal('hide');
    updateDesks();

  })
  .catch(err => console.error(err));
  }


  function updateModal(data, desk, date){
    const bookBtn = document.getElementById('book-btn');
    const titleEl = document.querySelector('#myModal .modal-title');
    const bookReservation = document.getElementById('book-reservation');
    const bookCount = document.getElementById('book-count');

    switch (data.user_role) {
      case "user":
        canReserve = data.my_desk_count < 1;
        break;
      case "manager":
        canReserve = data.my_desk_count < 2;
        break;
      case "admin":
        canReserve = true;
        break;
      default:
        canReserve = false;
    }
    
    bookBtn.removeAttribute('disabled');
    bookBtn.style.display = 'inline-block';
    
    titleEl.textContent = "Desk: " + desk + " at: " + date.split(" ")[0] + " is";
    bookCount.textContent = 'You have ' + data.my_desk_count + ' desks reserved for that day';
    if(data.reserved){
      bookReservation.textContent = `Reserved by ${data.bookedByMe ? 'You' : data.user_name}`;
      if(data.bookedByMe || data.user_role == 'admin'){
        bookBtn.textContent = 'Cancel reservation';
        bookBtn.onclick = cancel_reservation;
        bookBtn.style.display = 'inline-block';
      }
      else{
        bookBtn.style.display = 'none';
      }
    }else{
      bookReservation.textContent = 'Available';
      bookBtn.textContent = 'Book';
      if(canReserve){
        bookBtn.onclick = reserve_desk;
        bookBtn.style.display = 'inline-block';
      }
      else {
        bookBtn.setAttribute('disabled', true);
      }
    }
  }

  updateDesks();

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
//         updateModal(body.reserved);
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

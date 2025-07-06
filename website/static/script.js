// document.addEventListener('DOMContentLoaded', function(){
//     //Get all elements with class 'desk'
//     var svg = document.getElementById('floorplan');
//     // const desks = document.querySelectorAll('.desk');

//     //Get all desk elements (assuming desks have ids starting with 'desk-')
//     var desks = svg.querySelectorAll('[id^="desk-"]');

//     //Add click event listener to each desk
//     desks.forEach(function(desk){
//         desk.addEventListener('click', function(event){
//             var deskId = event.target.id;
//             openBookingModal(deskId);
//         });
//     });
// });

// //Function to open the booking modal
// function openBookingModal(deskId) {
//     var modal = document.getElementById('myModal');
//     modal.style.display = 'block';
//     document.getElementById('desk_id').value = deskId;
//     document.getElementById('modal-desk-id').textContent = deskId;

//     // Close modal when 'X' is clicked
//     document.querySelector('btn btn-primary').onclick = function() {
//         modal.style.display = 'none';
//     };

//     // Close modal when clicking outside of the modal content
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.style.display = 'none';
//         }
//     };
// }

// document.getElementById('bookingForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission

//     var deskId = document.getElementById('desk_id').value;
//     var startTime = document.getElementById('start_time').value;
//     var endTime = document.getElementById('end_time').value;

//     // Prepare data to send
//     var bookingData = {
//         desk_id: deskId,
//         start_time: startTime,
//         end_time: endTime
//     };

//     // Send data to the server
//     fetch('/book_desk', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(bookingData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert('Desk booked successfully!');
//             // Update the desk appearance
//             updateDeskStatus(deskId, 'booked');
//             // Close the modal
//             document.getElementById('bookingModal').style.display = 'none';
//         } else {
//             alert('Error booking desk: ' + data.error);
//         }
//     })
//     .catch(error => {
//         console.error('Booking error:', error);
//     });
// });

// document.querySelector('.close-modal').addEventListener('click', function() {
//     var modalElement = document.getElementById('modalBook'); // replace with your modal's ID
//     var modalInstance = bootstrap.Modal.getInstance(modalElement);
//     if (modalInstance) {
//       modalInstance.hide();
//     }
//   });


//   document.querySelectorAll('.desk').forEach(el => {
//     el.addEventListener('click', () => {
//       const deskId = el.getAttribute('data-desk-id');
//       openBookingModal(deskId);
//     });
//   });


// let selectedDeskId = null;

// Example function to open the modal when clicking a desk.
// This should be called wherever you handle the desk click event.
// function openBookingModal(deskId) {
//   selectedDeskId = deskId;
//   // Show the modal (using Bootstrap 5)
//   const modal = new bootstrap.Modal(document.getElementById('myModal'));
//   modal.show();
// }

// Book button click handler
// document.getElementById('book-btn').addEventListener('click', () => {
//   const startTimeInput = document.getElementById('start-time').value; // e.g. "09:00"
//   const endTimeInput = document.getElementById('end-time').value;     // e.g. "17:00"

//   if (!startTimeInput || !endTimeInput) {
//     alert('Please select both start and end times');
//     return;
//   }

//   if (!selectedDeskId) {
//     alert('Desk ID is not set');
//     return;
//   }

  // Construct ISO 8601 datetime strings for today + selected times
  // For example, if today is 2024-06-21 and startTimeInput is "09:00", then:
  // startDateTime = "2024-06-21T09:00:00"
//   const today = new Date();
//   const yyyy = today.getFullYear();
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const dd = String(today.getDate()).padStart(2, '0');

//   const startDateTime = `${yyyy}-${mm}-${dd}T${startTimeInput}:00`;
//   const endDateTime = `${yyyy}-${mm}-${dd}T${endTimeInput}:00`;

//   // Optional: validate start < end
//   if (startDateTime >= endDateTime) {
//     alert('End time must be after start time');
//     return;
//   }

//   // Send the data to your Flask backend
//   fetch('/api/bookings', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       desk_id: selectedDeskId,
//       start_date: startDateTime,
//       end_date: endDateTime,
//       description: 'Reservation via modal'
//     })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.success) {
//       alert(`Booking created with ID ${data.booking_id}`);
//       // Close modal
//       const modalEl = document.getElementById('myModal');
//       const modalInstance = bootstrap.Modal.getInstance(modalEl);
//       modalInstance.hide();

//       // Optionally reset form inputs
//       document.getElementById('start-time').value = '';
//       document.getElementById('end-time').value = '';

//       // TODO: Refresh UI or scheduler to show new booking if needed
//     } else {
//       alert('Error: ' + data.error);
//     }
//   })
//   .catch(err => {
//     console.error(err);
//     alert('An error occurred while booking');
//   });
// });



// document.addEventListener('DOMContentLoaded', function() {
//   // Select all desk elements
//   const desks = document.querySelectorAll('.desk');

//   // Add click event listener to each desk
//   desks.forEach(function(desk) {
//       desk.addEventListener('click', function() {
//           // Get the id of the desk, e.g., 'desk-1'
//           const deskId = desk.getAttribute('id');
//           // Extract the numerical part, e.g., '1'
//           const deskNumber = deskId.replace('desk-', '');

//           // Set the desk number in the hidden input field of the modal form
//           document.getElementById('modal-desk-id').value = deskNumber;
//       });
//   });
// });


// // bookowanie biurka
// document.querySelectorAll('.desk').forEach(desk => {
//   desk.addEventListener('click', () => {
//     const deskId = desk.getAttribute('id');
//     fetch('/reserve-desk',{
//       method: 'POST',
//       headers:{
//         'Content-Type': 'application/json'},
//       body: JSON.stringify({desk_id: deskId})
//     })
//     .then(res => res.json())
//     .then(data => {
//       if(data.success){
//         desk.style.fill = 'red'; // np. zmiana koloru na czerwony
//         alert(`Biurko ${deskId} zostało zarezerwowane.`);
//       }else{
//         alert(`Nie udało się zarezerwować biurka: ${data.message}`);
//       }
//     })
//     .catch(err => {
//       alert('Błąd połączenia z serwerem.');
//       console.error(err);
//     });
//   })
// })

//anulowanie rezerwacji
// document.querySelectorAll('.desk').forEach(desk => {
//   desk.addEventListener('dblclick', () => {
//     const deskId = desk.getAttribute('id');
//     fetch('/cancel-reservation', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ desk_id: deskId })
//     })
//       .then(r => r.json())
//       .then(json => {
//         if (json.success) {
//           desk.style.fill = '#59a5a7';
//         } else {
//           alert(json.message);
//         }
//       });
//   });
// });

// const desks = document.querySelectorAll('.desk');

// // Kolor wolnego i zajętego biurka
// const FREE_COLOR  = '#59a5a7';   // turkusowy – wolne
// const BUSY_COLOR  = '#ff4d4d';   // czerwony  – zarezerwowane

// // Podwójne kliknięcie = anulowanie rezerwacji
// // (pojedyncze kliknięcie możesz zostawić jako rezerwację lub otwarcie modala)
// desks.forEach(desk => {
//   desk.addEventListener('dblclick', () => {
//     const deskId = desk.getAttribute('id'); // np. "d1"

//     fetch('/cancel-reservation', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ desk_id: deskId })
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           // Zmiana koloru biurka na wolny
//           desk.style.fill = FREE_COLOR;
//         } else {
//           alert(data.message); // pokazujemy błąd np. "Biurko nie było zarezerwowane"
//         }
//       })
//       .catch(err => console.error(err));
//   });
// });

//Pobieranie statusu biurek
const FREE   = '#59a5a7';
const BUSY   = '#ff4d4d';

fetch('/desks-status')
  .then(r => r.json())
  .then(list => {
     list.forEach(d => {
        const el = document.getElementById(d.desk_id);
        if (el) el.style.fill = d.reserved ? BUSY : FREE;
     });
  });


// script.js
// 1. Inicjalizacja stanu dla każdego biurka
const desks = document.querySelectorAll('.desk');

for (const desk of desks) {
  // zakładamy: czerwony = zajęte, zielonkawy = wolne
  desk.dataset.reserved = desk.style.fill === 'red' ? 'true' : 'false';

  // --- pojedynczy klik = rezerwacja ---
  desk.addEventListener('click', () => {
    if (desk.dataset.reserved !== 'false') return;            // już zajęte lub w trakcie — nic nie rób

    desk.dataset.reserved = 'pending';                        // soft-lock na czas requestu

    fetch('/reserve-desk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk_id: desk.id })
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 409) {                           // 409 = konflikt
            desk.dataset.reserved = 'true';
            desk.style.fill = 'red';
            alert('To biurko jest już zarezerwowane.');
            return;                                           // przerywamy łańcuch
          }
          throw new Error('Błąd serwera: ' + res.status);
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;                                    // konflikt już obsłużony
        if (data.success) {
          desk.dataset.reserved = 'true';
          desk.style.fill = 'red';
          alert(`Biurko ${desk.id} zostało zarezerwowane.`);
        } else {
          desk.dataset.reserved = 'false';
          alert(data.message);
        }
      })
      .catch(err => {
        console.error(err);
        desk.dataset.reserved = 'false';                      // odblokuj, jeśli był wyjątek
      });
  });

  // --- podwójny klik = anulowanie ---
  desk.addEventListener('dblclick', () => {
    if (desk.dataset.reserved !== 'true') return;             // wolne → nie ma czego anulować

    fetch('/cancel-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk_id: desk.id })
    })
      .then(async res => {
        if (!res.ok) throw new Error('Błąd serwera: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          desk.dataset.reserved = 'false';
          desk.style.fill = '#59a5a7';                        // kolor wolnego biurka
          alert(`Rezerwacja biurka ${desk.id} została anulowana.`);
        } else {
          alert(data.message);
        }
      })
      .catch(err => console.error(err));
  });
}
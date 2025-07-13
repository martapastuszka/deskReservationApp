
  let selectedDeskId = null;

  // Capture the click on any desk
  document.querySelectorAll('svg .desk').forEach(path => {
    path.addEventListener('click', () => {
      selectedDeskId = path.dataset.deskId;  // remember id
    });
  });

  // Hook the Book button
  document.getElementById('book-btn').addEventListener('click', () => {
    if (!selectedDeskId) return; // extra safety

    fetch('/reserve-desk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desk_id: selectedDeskId })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        alert('Desk reserved successfully!');
        //color the desk red
   
      } else {
        alert(body.message || 'Something went wrong');
      }
      // Optionally close the modal
      const modalEl = document.getElementById('myModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide()
      modal.style.display = 'none';
    })
    .catch(err => console.error(err));
  });


  // Hook the Cancel Booking button
  // Zanim obsłużę Cancel Button to muszę się upewnić, że jeśli biurko ma status zarezerwowane, to po kliknięciu na nie pojawi mi sie
  // w modalu przycisk cancel reserwation
  // zeby to zrobic, to muszę odpytać bazę danych - czy biurko jest zarezerwowane, jak tak to open modal z dodatkowym przyciskiem 
  // albo po prostu zmień widoczność przycisku - czyli domyślnie ten przycisk istnieje tylko jest hidden.
  // jak biurko nie jest zarezerwowane to obsługiwany będzie przycisk Book.
  

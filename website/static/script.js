
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

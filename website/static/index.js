function deleteNote(noteId) {
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({ noteId: noteId})
    } ).then((_res) =>{
        // reloads the window
        window.location.href = "/";
    })
}
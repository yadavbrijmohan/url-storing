const form = document.getElementById('myform');
const container = document.getElementById('submissions-container');
const editSection = document.getElementById('edit-section');
const editIdInput = document.getElementById('edit-id');
const editUrlInput = document.getElementById('edit-url');
const editDescInput = document.getElementById('edit-description');

const API = "http://localhost:3000/api/submission";
const SUBMIT_API = "http://localhost:3000/submit";

// Handle Add Form (prevent page reload, use fetch)
form.addEventListener('submit', async function(e) {
    e.preventDefault(); // STOP page reload

    const url = document.getElementById('username').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch(SUBMIT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: url, description })
        });

        if (response.ok) {
            form.reset();
            fetchSubmissions();
        }
    } catch (err) {
        console.log("Error submitting:", err);
    }
});

// Fetch and display
async function fetchSubmissions() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        displayData(data);
    } catch (err) {
        container.innerHTML = `<p>Error: ${err.message}</p>`;
    }
}

function displayData(data) {
    container.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>No submissions yet.</p>';
        return;
    }

    data.forEach((item) => {
        const { id, url, description, timeStamp } = item;
        container.innerHTML += `
            <div class="card" data-id="${id}">
                <p><strong>URL:</strong> <a href="${url}" target="_blank">${url}</a></p>
                <p><strong>Description:</strong> ${description || 'No description'}</p>
                <p><strong>Time:</strong> ${new Date(timeStamp).toLocaleString()}</p>
                <button class="edit-btn" onclick="startEdit('${id}', '${url}', '${description || ''}')">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteSubmission('${id}')">🗑️ Delete</button>
            </div>
        `;
    });
}

// Delete by ID
async function deleteSubmission(id) {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
        const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchSubmissions();
        } else {
            alert("Failed to delete");
        }
    } catch (err) {
        console.log("Error:", err);
    }
}

// Start editing — show edit form
function startEdit(id, url, description) {
    editIdInput.value = id;
    editUrlInput.value = url;
    editDescInput.value = description;
    editSection.style.display = 'block';
    window.scrollTo(0, 0);
}

// Cancel editing
function cancelEdit() {
    editSection.style.display = 'none';
    editIdInput.value = '';
    editUrlInput.value = '';
    editDescInput.value = '';
}

// Save edit
async function saveEdit() {
    const id = editIdInput.value;
    const url = editUrlInput.value;
    const description = editDescInput.value;

    try {
        const response = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, description })
        });

        if (response.ok) {
            cancelEdit();
            fetchSubmissions();
        } else {
            alert("Failed to update");
        }
    } catch (err) {
        console.log("Error:", err);
    }
}

// Load on start
fetchSubmissions();
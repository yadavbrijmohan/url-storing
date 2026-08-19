let form = document.getElementById('myform');
// CHANGED: Added reference to description input
let usernameInput = document.getElementById('username');
let descriptionInput = document.getElementById('description');

// CHANGED: Completely rewrote the event listener
form.addEventListener('submit', function(e) {
        // CHANGED: Added setTimeout to clear form after submission
        setTimeout(() => {
        form.reset(); // CHANGED: This clears all form fields
        console.log('Form cleared!'); // CHANGED: Added log to confirm
        }, 10000); // CHANGED: Small delay to ensure form submits first
        });
console.log(form);
const api = "http://localhost:3000/api/submission";
const apiSubmit = "http://localhost:3000/submit";
const container = document.getElementById('submissions-container');

//fetch the data
function fetchSubmissions() {
    fetch(api)
    .then(response => {
        if(!response.ok){
            throw new Error('Network is not ok')
        }
        else{
            return response.json();
        }
    })
    .then (data => {
        displayData(data);
    })
    .catch (err => {
        container.innerHTML = `<p>Error: ${err.message}</p>`
    });

}

    // display Function 
    function displayData(data){
        container.innerHTML = '';

        if(Array.isArray(data)){
            data.forEach((item,index)  => {
                const {url , description, timeStamp} = item;
                container.innerHTML += `
                <div data-index="${index}">
                 <p><strong>URL:</strong> ${url}</p>
                    <p><strong>Discription:</strong> ${description}</p>
                    <p><strong>Time:</strong> ${timeStamp}</p>
                     <button class="edit-btn" onclick="editSubmission(${index})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteSubmission(${index})">🗑️ Delete</button>
                 </div>
                `;
            })
        }
        else{
            const {url , description, timestamp} = data;
                container.innerHTML += `
                <div>
                 <p><strong>URL:</strong> ${url}</p>
                    <p><strong>Discription:</strong> ${description}</p>
                    <p><strong>Time:</strong> ${timeStamp}</p>
                 </div>
                `;
        }
    }
    fetchSubmissions()
    async function deleteSubmission(index) {
        try{
            const response = await fetch(`http://localhost:3000/api/submission/${index}`, {
                method: 'DELETE'
            });
            if(response.ok){
                alert("Deleted successfully");
                fetchSubmissions();
            }
            else{
                alert("Failed to delete it");
            }
            }
            catch(err){
                console(` Error : ${err}`)
            }
    };


console.log("Hello World !")

document.getElementById("registrationForm").addEventListener("submit", function(event){
    event.preventDefault(); // Prevent default form submission
    // Get form data
    var formData = new FormData(this);

    var jsonData = {};
    formData.forEach(function(value, key){
        jsonData[key] = value;
    });

    // Send POST request
    fetch('http://127.0.0.1:5141/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
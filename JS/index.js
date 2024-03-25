/////////////////////////////////// POST ///////////////////////////////////
document.getElementById("connectionUser").addEventListener("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);

    var jsonData = {};
    formData.forEach(function (value, key) {
        jsonData[key] = value;
    });

    var emailUser = jsonData["email"];
    var passwordUser = jsonData["password"];

    if (email && password) {
        console.log(emailUser);
        console.log(passwordUser);

        axios({
                method: "post",
                url: "http://localhost:5037/api/Authentication/SignIn",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    userEmail: emailUser,
                    userPassword: passwordUser
                }
            })
            .then(function (response) {
                console.log(response.data);
                localStorage.setItem('token', response.data);
                window.location.href = "../HTML/Home.html";
            })
            .catch(function (error) {
                console.error('Il y a eu un problème avec la requête axios:', error);
            });
    } else {
        console.error('Email and password are required.');
    }
});
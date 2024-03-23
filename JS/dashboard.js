const token = getTokenFromLocalStorage();
const userId = returnUserId();

fetchUserData(userId);


// Récupération de l'id user à partir du token
function getUserIdFromToken(token) {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.UserId;
}

// Récupération du token dans le local storage
function getTokenFromLocalStorage() {
    return localStorage.getItem('token');
}

// Fonction pour retourner l'id de l'utilisateur
function returnUserId() {
    const token = getTokenFromLocalStorage();
    const userId = getUserIdFromToken(token);
    return userId;
}

// Fonction pour récupérer les données utilisateur
async function fetchUserData(userId) {
    try {
        const response = await fetch(`http://localhost:5037/api/User/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données utilisateur');
        }

        const userData = await response.json();
        console.log(userData);
        document.getElementById('welcomeUser').textContent = capitalizedFirstLetter(userData.userFirstname);
        return userData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
    }
}

document.getElementById('updateUserInformation').addEventListener('submit', async function (event) {
    event.preventDefault();

    var formData = new FormData(this);

    var data = {
        userLastname: formData.get('lastname'),
        userFirstname: formData.get('firstname')
    };

    try {
        const response = await fetch(`http://localhost:5037/api/User?Id=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour des informations utilisateur')
        }

    } catch (error) {
        console.log('Erreur lors de la mise à jour des informations utilisateur', error)
    }
    this.reset();
})

document.getElementById('updateUserPassword').addEventListener('submit', async function (event) {
    event.preventDefault();

    var formData = new FormData(this);

    userPassword = formData.get('password');
    userConfirmPassword = formData.get('password_confirm');

    if (userPassword == userConfirmPassword) {
        var data = {
            userPassword: formData.get('password'),
            userEmail: formData.get('email')
        };

        try {
            const response = await fetch(`http://localhost:5037/api/User?Id=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour des informations utilisateur')
            }

        } catch (error) {
            console.log('Erreur lors de la mise à jour des informations utilisateur', error)
        }
        this.reset();
    } else {
        throw new Error('Les mots de passe ne sont pas identiques')
    }

})

function capitalizedFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
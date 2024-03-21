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
export function returnUserId() {
    const token = getTokenFromLocalStorage();
    const userId = getUserIdFromToken(token);
    return userId;
}

// Fonction pour récupérer les données utilisateur
async function fetchUserData() {
    try {
        const token = getTokenFromLocalStorage(); // Récupérer le token depuis le stockage local
        const userId = returnUserId(); // Récupérer l'identifiant de l'utilisateur

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
        return userData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
    }
}

export async function normalizedUserData() {
    try {
        const userData = await fetchUserData();
        if (userData) {
            userData.userLastname = capitalizedFirstLetter(userData.userLastname);
            userData.userFirstname = capitalizedFirstLetter(userData.userFirstname);
        } else {
            console('Impossible de récupérer les données utilisateur')
        }
    } catch (error) {
        console.log('Erreur lors de la récupération des données utilisateur', error)
    }
    return userData;
}

function capitalizedFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
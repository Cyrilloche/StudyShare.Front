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

// Fonction pour récupérer les données de l'utilisateur et les afficher
function fetchUserData() {
    const token = getTokenFromLocalStorage(); // Récupérer le token
    const userId = returnUserId();

    fetch(`http://localhost:5037/api/User/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error with datas get')
            }
            return response.json();
        })
        .then(userData => {
            console.log(userData);
            document.getElementById('welcomeUser').textContent = userData.userFirstname;
        })
        .catch(error => {
            console.error('Error with user datas', error);
        })
}

// Fonction pour récupérer les documents de l'utilisateur et les afficher
function fetchUserPaper() {
    const token = getTokenFromLocalStorage(); // Récupérer le token
    const userId = returnUserId();

    fetch(`http://localhost:5037/api/Paper/authorId?authorId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error with papers get')
            }
            return response.json();
        })
        .then(papers => {
            console.log(papers);
            addDocumentCardsToPage(papers); // Appel de la fonction pour afficher les documents
        })
        .catch(error => {
            console.error('Error with user papers', error);
        })
}

// Fonction pour créer dynamiquement un encart représentant un document
function createDocumentCard(document) {
    const documentCard = document.createElement('div');
    documentCard.classList.add('document-card');

    const documentTitle = document.title;
    const documentContent = document.content;

    const titleElement = document.createElement('h3');
    titleElement.textContent = documentTitle;

    const contentElement = document.createElement('p');
    contentElement.textContent = documentContent;

    documentCard.appendChild(titleElement);
    documentCard.appendChild(contentElement);

    return documentCard;
}

function addDocumentCardsToPage(documents) {
    const documentsContainer = document.getElementById('documentsContainer');

    documents.forEach(doc => { // Renommez 'document' en 'doc'
        const documentCard = createDocumentCard(doc);
        documentsContainer.appendChild(documentCard);
    });
}


// Appel des fonctions au chargement de la page
window.onload = function () {
    fetchUserData(); // Récupérer les données de l'utilisateur
    fetchUserPaper(); // Récupérer les documents de l'utilisateur
}
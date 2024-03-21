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
        document.getElementById('welcomeUser').textContent = capitalizedFirstLetter(userData.userFirstname);
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
    }
}

// Fonction pour récupérer et afficher les documents
async function fetchAndDisplayDocuments() {
    try {
        const token = getTokenFromLocalStorage();
        const userId = returnUserId();

        const response = await fetch(`http://localhost:5037/api/Paper/authorId?authorId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des documents');
        }

        const papers = await response.json();
        console.log(papers);

        addDocumentCardsToPage(papers); // Ajouter les cartes de document à la page
    } catch (error) {
        console.error('Erreur lors de la récupération des documents', error);
    }
}

// Appel des fonctions au chargement de la page
window.onload = function () {
    fetchUserData(); // Récupérer les données de l'utilisateur
    fetchAndDisplayDocuments(); // Récupérer et afficher les documents de l'utilisateur
}

// Fonction pour créer dynamiquement un encart représentant un document
function createDocumentCard(doc) {

    const documentTitle = doc.paperName;
    const documentContent = doc.paperDescription;

    // Créer l'élément de carte
    const documentCard = document.createElement('col');
    documentCard.classList.add('card', 'mx-2', 'bg-light', 'text-black', 'h-100');

    // // Créer l'en-tête de la carte
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.textContent = documentTitle;

    // Créer le corps de la carte
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Créer le titre de la carte
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = documentTitle;

    // Créer le texte de la carte
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = capitalizedFirstLetter(documentContent);

    // Ajouter les éléments au corps de la carte
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    // Ajouter l'en-tête et le corps à la carte
    documentCard.appendChild(cardHeader);
    documentCard.appendChild(cardBody);


    return documentCard;
}

function addDocumentCardsToPage(documents) {
    const documentsContainer = document.getElementById('documentsContainer');

    documents.forEach(doc => {
        const documentCard = createDocumentCard(doc);
        documentsContainer.appendChild(documentCard);
    });
}

function capitalizedFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
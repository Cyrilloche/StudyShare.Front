const token = getTokenFromLocalStorage();
const userId = returnUserId();

window.onload = function () {
    fetchAndDisplayDocuments();
}

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



// Fonction pour créer dynamiquement un encart représentant un document
function createDocumentCard(doc) {
    const documentTitle = doc.paperName;
    const documentDateUploaded = doc.paperUploadDate;
    const documentDescription = doc.paperDescription;
    console.log(typeof (documentDateUploaded));

    // Créer l'élément de carte
    const documentCard = document.createElement('div');
    documentCard.classList.add('col-3', 'p-2');

    // Créer la carte Bootstrap
    const card = document.createElement('div');
    card.classList.add('card', 'bg-light', 'text-black', 'h-100');

    // Créer le header de la carte
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    //Créer le titre de la carte
    const cardHeaderTitle = document.createElement('h4');
    cardHeaderTitle.textContent = documentTitle;

    // Créer le corps de la carte
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Créer la date d'upload du document dans la carte
    const cardTextUploadDate = document.createElement('p');
    cardTextUploadDate.classList.add('card-text');
    cardTextUploadDate.textContent = documentDateUploaded;

    // Créer le texte descriptif de la carte
    const cardTextDescription = document.createElement('p');
    cardTextDescription.classList.add('card-text');
    cardTextDescription.textContent = capitalizedFirstLetter(documentDescription);

    // Ajouter les éléments au corps de la carte
    cardBody.appendChild(cardTextUploadDate);
    cardBody.appendChild(cardTextDescription);

    // Ajouter l'en-tête et le corps à la carte
    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    // Ajouter le titre de la carte au header de la carte
    cardHeader.appendChild(cardHeaderTitle);

    // Ajouter la carte à l'élément de carte
    documentCard.appendChild(card);

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
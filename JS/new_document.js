const token = getTokenFromLocalStorage();
const userId = returnUserId();

let checkedKeywords = [];
let checkedClasses = [];

window.onload = function () {
    fetchUserData(userId);
    fetchKeywords();
    fetchClasses();
};


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
        return userData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
    }
}

// Fonction pour récupérer les mots-clés
async function fetchKeywords() {
    try {
        const response = await fetch(`http://localhost:5037/api/Keyword`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des mots-clés');
        }

        const keywords = await response.json();
        console.log(keywords);

        displayKeywords(keywords);

    } catch (error) {
        console.error('Erreur lors de la récupération des mots clés', error);
    }
}

//Fonction pour récupérer les classes
async function fetchClasses() {
    try {
        const response = await fetch(`http://localhost:5037/api/ClassLevel`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des classes');
        }

        const classLevels = await response.json();
        console.log(classLevels);

        displayClasses(classLevels);

    } catch (error) {
        console.error('Erreur lors de la récupération des mots classes', error);
    }
}

// Fonction création descheckbox des mots-clés
function createCheckboxListKeyword(keyword) {
    const keywordToDisplayName = keyword.keywordName;

    const list = document.createElement('li');
    list.classList.add('list-group-item')

    const checkbox = document.createElement('input');
    checkbox.classList.add('form-check-input', 'me-1');
    checkbox.type = 'checkbox';
    checkbox.value = keyword.keywordId;

    list.appendChild(checkbox);

    const textSpan = document.createElement('span');
    textSpan.textContent = ' ' + capitalizedFirstLetter(keywordToDisplayName);

    list.appendChild(textSpan);

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            console.log('Mot-clé coché avec l\'ID:', checkbox.value);
            checkedKeywords.push(checkbox.value);
        } else {
            const index = checkedKeywords.indexOf(checkbox.value);
            if (index !== -1) {
                checkedKeywords.splice(index, 1);
            }
        }
        console.log(checkedKeywords);
    });

    return list;
}

// Fonction création descheckbox des classes
function createCheckboxListClassLevel(classe) {
    const classeToDisplayName = classe.classLevelName;

    const classLevel = document.createElement('li');
    classLevel.classList.add('list-group-item')

    const checkbox = document.createElement('input');
    checkbox.classList.add('form-check-input', 'me-1');
    checkbox.type = 'checkbox';
    checkbox.value = classe.classLevelId;

    classLevel.appendChild(checkbox);

    const textSpan = document.createElement('span');
    textSpan.textContent = ' ' + classeToDisplayName;

    classLevel.appendChild(textSpan);

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            console.log('Classe cochée avec l\'ID:', checkbox.value);
            checkedClasses.push(checkbox.value);
        } else {
            const index = checkedClasses.indexOf(checkbox.value);
            if (index !== -1) {
                checkedClasses.splice(index, 1);
            }
        }
        console.log(checkedClasses);
    });

    return classLevel;
}

// Fonction affichage des mots-clés
function displayKeywords(keywords) {
    const keywordsContainer = document.getElementById('keywordsContainer');

    keywords.forEach(keyword => {
        const li = createCheckboxListKeyword(keyword);
        keywordsContainer.appendChild(li);
    })
}

// Fonction affichage des classes
function displayClasses(classLevels) {
    const classesContainer = document.getElementById('classesContainer');

    classLevels.forEach(classLevel => {
        const li = createCheckboxListClassLevel(classLevel);
        classesContainer.appendChild(li);
    })
}

// Fonction 1ère lettre capitale
function capitalizedFirstLetter(word) {
    if (!isNaN(parseInt(word.charAt(0)))) {
        return word;
    } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

}
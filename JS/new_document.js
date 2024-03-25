const token = getTokenFromLocalStorage();
const userId = returnUserId();

let checkedKeywords = [];
let checkedClasses = [];
let selectedFile;
let pathDocument;


window.onload = function () {
    fetchUserData(userId);
    fetchKeywords();
    fetchClasses();
};

/////////////////////////////////// CONFIG ///////////////////////////////////
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

/////////////////////////////////// GET ///////////////////////////////////
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

        displayClasses(classLevels);

    } catch (error) {
        console.error('Erreur lors de la récupération des mots classes', error);
    }
}

/////////////////////////////////// FILE ///////////////////////////////////
// Fonction sélection du fichier 
async function selectFile() {
    try {
        let [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'Files',
                accept: {
                    'file/*': ['.pdf']
                }
            }],
            excludeAcceptAllOption: true,
            multiple: false
        });
        let file = await fileHandle.getFile();
        let fileName = file.name;
        console.log('Nom du fichier sélectionné :', fileName);

        // Mise à jour de la valeur de l'élément <textarea> avec l'ID selectedFileName
        document.getElementById('selectedFileName').innerText = fileName;

        selectedFile = file;
    } catch (error) {
        console.error('Erreur lors de la sélection du fichier :', error);
        throw error;
    }
}


// Fonction sauvegarde du fichier
async function saveFile(updatedFile, extensionFile) {
    try {
        const directoryHandle = await window.showDirectoryPicker();
        pathDocument = directoryHandle;
        console.log(pathDocument);
        const fileHandle = await directoryHandle.getFileHandle(updatedFile.name + extensionFile, {
            create: true
        });
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(updatedFile);
        await writableStream.close();
        console.log('Fichier sauvegardé avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du fichier :', error);
    }
}

/////////////////////////////////// POST ///////////////////////////////////
document.getElementById('create-new-document').addEventListener('submit', async function (event) {
    event.preventDefault();

    // End points 
    const paperEndPoint = 'http://localhost:5037/api/Paper';

    // Récupération des données du formulaire
    const formDataDocument = new FormData(this);
    const paperName = formDataDocument.get('file-name');
    const paperDescription = formDataDocument.get('file-description');
    const date = new Date();
    const formattedDate = date.toISOString();
    console.log(date);
    console.log(typeof (date));

    let extensionFile = getExtensionFile(selectedFile.name);
    const newFileName = date + '_' + paperName;

    // Créer un nouvel objet File avec le nouveau nom
    const updatedFile = new File([selectedFile], newFileName, {
        type: selectedFile.type
    });

    saveFile(updatedFile, extensionFile);

    // Envoyer la requête POST pour créer un nouveau document
    axios.post(paperEndPoint, {
            paperName,
            paperDescription,
            userId: userId,
            paperUploadDate: formattedDate
        })
        .then((response) => {
            console.log(response.data);
            const paperId = response.data.paperId;
            console.log('ID du document créé :', paperId);

            const keywordsData = checkedKeywords;
            const classLevelsData = checkedClasses;

            axios.post(`http://localhost:5037/api/PaperKeyword?paperId=${paperId}`, keywordsData)
                .then((response) => {
                    console.log('Réponse de la requête PaperKeyword :', response);
                })
                .catch((error) => {
                    console.error('Erreur lors de la requête PaperKeyword :', error);
                });
            axios.post(`http://localhost:5037/api/PaperClassLevel?paperId=${paperId}`, classLevelsData)
                .then((response) => {
                    console.log('Réponse de la requête PaperClassLevel :', response);
                })
                .catch((error) => {
                    console.error('Erreur lors de la requête PaperClassLevel :', error);
                });
        })
        .catch((error) => {
            console.error('Erreur lors de la création du document :', error);
        });
});


/////////////////////////////////// HTML ///////////////////////////////////
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
            //console.log('Mot-clé coché avec l\'ID:', checkbox.value);
            checkedKeywords.push(checkbox.value);
        } else {
            const index = checkedKeywords.indexOf(checkbox.value);
            if (index !== -1) {
                checkedKeywords.splice(index, 1);
            }
        }
        //console.log(checkedKeywords);
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
    textSpan.textContent = ' ' + capitalizedFirstLetter(classeToDisplayName);

    classLevel.appendChild(textSpan);

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            //console.log('Classe cochée avec l\'ID:', checkbox.value);
            checkedClasses.push(checkbox.value);
        } else {
            const index = checkedClasses.indexOf(checkbox.value);
            if (index !== -1) {
                checkedClasses.splice(index, 1);
            }
        }
        //console.log(checkedClasses);
        //console.log(typeof (checkedClasses))
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

/////////////////////////////////// TOOLS ///////////////////////////////////
// Fonction 1ère lettre capitale
function capitalizedFirstLetter(word) {
    if (!isNaN(parseInt(word.charAt(0)))) {
        return word;
    } else {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

}

// Fonction récupération de l'extension
function getExtensionFile(fileName) {
    let point = '.';
    let extension = "";
    for (let i = fileName.length; i >= 0; i--) {
        if (fileName[i] == point) {
            extension += fileName[i];
            for (let j = i + 1; j < fileName.length; j++) {
                extension += fileName[j];
            }
            break;
        }
    }
    return extension;
}
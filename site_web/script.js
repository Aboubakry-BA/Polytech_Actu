var currentIndex = 0;
var articlesPerPage = 3;
var articles = [];

function fetchArticles() {
    // Effectuer une requête à l'API pour récupérer les articles
    fetch('http://localhost:8080/api/articles')
        .then(response => response.json())
        .then(data => {
            // Manipuler la réponse de l'API correctement
            articles = data.reverse();
            afficherArticles();
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des articles :', error);
        });
}

function afficherArticles() {
    var articlesContainer = document.getElementById("articles");
    articlesContainer.innerHTML = "";

    for (var i = currentIndex; i < currentIndex + articlesPerPage; i++) {
        if (i >= articles.length) {
            break;
        }

        var article = articles[i];

        var articleElement = document.createElement("div");
        articleElement.classList.add("article");
        articleElement.dataset.id = article.id;

        var titleDateDiv = document.createElement("div");
        titleDateDiv.classList.add("title-date");

        var titreElement = document.createElement("h2");
        titreElement.textContent = article.titre;
        titreElement.setAttribute('data-id', article.id); // Utilisation de l'attribut data-id

        var dateElement = document.createElement("p");
        var formattedDate = formatDate(article.dateModification);
        dateElement.textContent = formattedDate;

        var contenuElement = document.createElement("p");
        var summary = article.contenu.substring(0, 50);
        contenuElement.textContent = summary;

        titleDateDiv.appendChild(titreElement);
        titleDateDiv.appendChild(dateElement);

        articleElement.appendChild(titleDateDiv);
        articleElement.appendChild(contenuElement);

        articlesContainer.appendChild(articleElement);
    }

    // Ajouter des événements aux titres d'articles
    var titleElements = articlesContainer.querySelectorAll('.article h2');
    titleElements.forEach(function (titleElement) {
        titleElement.addEventListener('click', function (event) {
            var target = event.target;
            var id = target.getAttribute('data-id');
            var article = articles.find(function (a) {
                return a.id === parseInt(id);
            });

            // Populate the modal with article information
            document.getElementById('modalArticleTitle').textContent = article.titre;
            document.getElementById('modalArticleContent').textContent = article.contenu;
            document.getElementById('modalArticleCreationDate').innerHTML = `<h4>Date Création: ${formatDate(article.dateCreation)}</h4>`;
            document.getElementById('modalArticleModificationDate').innerHTML = `<h4>Date Modification: ${formatDate(article.dateModification)}</h4>`;
            document.getElementById('modalArticleCategoryLabel').innerHTML = `<h4>Categorie: ${article.categorie.libelle}</h4>`;

            // Show the modal
            var modal = document.getElementById('myModal');
            modal.style.display = "block";

            // Close the modal when the close button or outside modal area is clicked
            var closeBtn = document.getElementById("close");
            modal.onclick = function (event) {
                if (event.target === modal || event.target === closeBtn) {
                    modal.style.display = "none";
                }
            };
        });
    });
}

// Close the modal when the Escape key is pressed
document.addEventListener('keydown', function (event) {
    var modal = document.getElementById('myModal');
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// Effectuer une requête à l'API pour récupérer les liens de la navbar
function fetchNavbarLinks() {
    fetch('http://localhost:8080/api/categories')
        .then(response => response.json())
        .then(data => {
            // Manipuler la réponse de l'API pour générer les liens de la navbar
            var navLinks = document.getElementById("navLinks");
            navLinks.innerHTML = `<li><a href="">Accueil</a></li>`;

            data.forEach(function (link) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = "#";
                a.textContent = link.libelle;
                a.addEventListener("click", function () {
                    fetchArticlesByCategory(link.id);
                });
                li.appendChild(a);
                navLinks.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des liens de la navbar :', error);
        });
}

// Charger les articles depuis l'API en fonction de la catégorie sélectionnée
function fetchArticlesByCategory(categoryId) {
    fetch('http://localhost:8080/api/articles/categories/' + categoryId)
        .then(response => response.json())
        .then(data => {
            var articlesContainer = document.getElementById("articles");
            articlesContainer.innerHTML = "";

            if (data.length === 0) {
                var noArticlesMessage = document.createElement("p");
                noArticlesMessage.textContent = "Aucun article trouvé 🤦‍♂️!!!";
                noArticlesMessage.classList.add("no-articles-message");
                articlesContainer.appendChild(noArticlesMessage);
            } else {
                data.forEach(function (article) {
                    var articleElement = document.createElement("div");
                    articleElement.classList.add("article");
                    articleElement.dataset.id = article.id;

                    var titleDateDiv = document.createElement("div");
                    titleDateDiv.classList.add("title-date");

                    var titreElement = document.createElement("h2");
                    titreElement.textContent = article.titre;

                    var dateElement = document.createElement("p");
                    var formattedDate = formatDate(article.dateModification);
                    dateElement.textContent = formattedDate;

                    var contenuElement = document.createElement("p");
                    var summary = article.contenu.substring(0, 60);
                    contenuElement.textContent = summary;

                    var actionsDiv = document.createElement('div');
                    actionsDiv.classList.add('actions');

                    titleDateDiv.appendChild(titreElement);
                    titleDateDiv.appendChild(dateElement);

                    articleElement.appendChild(titleDateDiv);
                    articleElement.appendChild(contenuElement);
                    articleElement.appendChild(actionsDiv);

                    articlesContainer.appendChild(articleElement);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des articles par catégorie :', error);
        });
}

// Charger les liens de la navbar depuis l'API et afficher les articles correspondants pour le premier lien
fetchNavbarLinks();
fetchArticlesByCategory(1);

function formatDate(dateString) {
    var date = new Date(dateString);
    var options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
}

function afficherPageSuivante() {
    if (currentIndex + articlesPerPage < articles.length) {
        currentIndex += articlesPerPage;
        afficherArticles();
    }
}

function afficherPagePrecedente() {
    if (currentIndex - articlesPerPage >= 0) {
        currentIndex -= articlesPerPage;
        afficherArticles();
    }
}

// Événements pour les boutons de pagination
var previousButton = document.getElementById("previousButton");
previousButton.addEventListener("click", afficherPagePrecedente);

var nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", afficherPageSuivante);

// Charger les articles depuis l'API et afficher les premiers articles
fetchArticles();

var modal = document.getElementById("modal");
var openModalButton = document.getElementById("openModalButton");
var closeButton = document.getElementsByClassName("close")[0];
var loginForm = document.getElementById("loginForm");

openModalButton.addEventListener("click", function () {
    // Vérifier si l'utilisateur est déjà connecté
    if (sessionStorage.getItem('loggedIn')) {
        window.location.href = 'editeur.html';
        return;
    }
    modal.style.display = "block";
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none";
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs de formulaire
    var loginInput = document.getElementById("login");
    var motDePasseInput = document.getElementById("password");
    var erreurMessage = document.getElementById("erreur-message");
    var login = loginInput.value;
    var motDePasse = motDePasseInput.value;

    // Construire l'objet de données à envoyer à l'API
    var data = {
        login: login,
        motDePasse: motDePasse
    };

    // Effectuer une requête à l'API pour la connexion
    fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            loginInput.value = "";
            motDePasseInput.value = "";

            if (!response.ok) {
                throw new Error('Échec de la requête. Statut : ' + response.status);
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            // Vérifier la réponse de l'API pour la réussite de la connexion
            if (responseData.token !== null) {
                // Stocker les informations de connexion dans une session
                sessionStorage.setItem('loggedIn', true);
                sessionStorage.setItem('user', JSON.stringify(responseData));

                // Rediriger vers la page souhaitée
                window.location.href = 'editeur.html';
            } else {
                // Afficher un message d'erreur ou effectuer une autre action en cas d'échec de connexion
                erreurMessage.innerHTML = 'Vous n\'avez pas le token requis pour accéder à la page demandée. Contactez l\'administrateur pour plus d\'infos';
            }
        })
        .catch(error => {
            console.error('Identifiants incorrects :', error);
            erreurMessage.innerHTML = 'Veuillez vérifier vos informations de connexion !!!';
        });
});

// Fermer la modale en cliquant en dehors
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

var carouselContainer = document.querySelector('.carousel-container');

function carouselSlide() {
    var firstImage = carouselContainer.firstElementChild;
    carouselContainer.appendChild(firstImage);
}

setInterval(carouselSlide, 5000);

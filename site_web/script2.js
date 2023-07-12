var articles = [];

var currentIndex = 0;
var articlesPerPage = 2;

var modal = document.getElementById('modal');
var addModal = document.getElementById("addModal");
var deleteModal = document.getElementById('deleteModal');
var openModalButton = document.getElementById('addButton');
var openCatModalButton = document.getElementById('addCatButton');
var addForm = document.getElementById('addForm');
var addForm2 = document.getElementById('addForm2');
var modalTitle = document.getElementById('modalTitle');
var titreInput = document.getElementById('titre');
var contenuInput = document.getElementById('contenu');
var categorieSelect1 = document.getElementById('categorie');
var categorieSelect2 = document.getElementById('updateCategorie');
var addModalTitle = document.getElementById('addModalTitle');
var categoryName = document.getElementById('categoryName');

function fetchArticles() {
    // Appel à l'API pour récupérer les articles
    // Supposons que l'API renvoie les données au format JSON
    fetch('http://localhost:8080/api/articles')
        .then(response => response.json())
        .then(data => {
            articles = data.reverse();
            afficherArticles();
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des articles:', error);
        });
}

function fetchListCategorie() {
    fetch('http://localhost:8080/api/categories')
        .then(response => response.json())
        .then(data => {
            var categoriesContainer = document.getElementById("articles");
            categoriesContainer.innerHTML = "";

            var addButton = document.createElement("button");
            addButton.textContent = "Ajouter catégorie";
            addButton.classList.add("addCatButton");
            addButton.addEventListener("click", function () {
                addModalTitle.textContent = 'Ajouter une catégorie';
                categoryName.value = '';
                erreurMessage = document.getElementById("erreur-message").value = '';

                addModal.style.display = 'block';
            });

            var addButtonContainer = document.createElement("div");
            addButtonContainer.classList.add("add-button-container");
            addButtonContainer.appendChild(addButton);

            categoriesContainer.appendChild(addButtonContainer);

            if (data.length === 0) {
                var noCategoriesMessage = document.createElement("p");
                noCategoriesMessage.textContent = "Aucune catégorie trouvée 🤦‍♂️!!!";
                noCategoriesMessage.classList.add("no-categories-message");
                categoriesContainer.appendChild(noCategoriesMessage);
            } else {
                data.reverse().forEach(function (category) {
                    var categoryElement = document.createElement("div");
                    categoryElement.classList.add("category");
                    categoryElement.dataset.id = category.id;

                    var categoryName = document.createElement("h3");
                    categoryName.textContent = category.libelle;

                    var actionsDiv = document.createElement("div");
                    actionsDiv.classList.add("actions");

                    var modifyButton = document.createElement("button");
                    modifyButton.textContent = "Modifier";
                    modifyButton.classList.add("modifyCatButton");
                    modifyButton.setAttribute("data-id", category.id);
                    modifyButton.addEventListener("click", function () {
                        var categoryId = category.id;
                        var selectedCategory = categories.find(function (c) {
                            return c.id === categoryId;
                        });
                        modifierCategorie(selectedCategory);
                    });
                    actionsDiv.appendChild(modifyButton);

                    var deleteButton = document.createElement("button");
                    deleteButton.textContent = "Supprimer";
                    deleteButton.classList.add("deleteCatButton");
                    deleteButton.setAttribute("data-id", category.id);
                    deleteButton.addEventListener("click", function () {
                        var categoryId = category.id;
                        var selectedCategory = categories.find(function (c) {
                            return c.id === categoryId;
                        });
                        supprimerCategorie(selectedCategory);
                    });
                    actionsDiv.appendChild(deleteButton);

                    categoryElement.appendChild(categoryName);
                    categoryElement.appendChild(actionsDiv);

                    categoriesContainer.appendChild(categoryElement);
                });
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des catégories :", error);
        });
}

fetchListCategorie();

function afficherArticles() {
    var articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = '';

    for (var i = currentIndex; i < currentIndex + articlesPerPage; i++) {
        if (i >= articles.length) {
            break;
        }

        var article = articles[i];

        var articleElement = document.createElement('div');
        articleElement.classList.add('article');
        articleElement.dataset.id = article.id;

        var titleDateDiv = document.createElement('div');
        titleDateDiv.classList.add('title-date');

        var titreElement = document.createElement('h2');
        titreElement.textContent = article.titre;
        titreElement.setAttribute('data-id', article.id); // Utilisation de l'attribut data-id

        var dateElement = document.createElement("p");
        var formattedDate = formatDate(article.dateModification);
        dateElement.textContent = formattedDate;

        var contenuElement = document.createElement("p");
        var summary = article.contenu.substring(0, 50);
        contenuElement.textContent = summary;

        var actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        var modifyButton = document.createElement('button');
        modifyButton.textContent = 'Modifier';
        modifyButton.classList.add('modifyButton');
        modifyButton.setAttribute('data-id', article.id); // Utilisation de l'attribut data-id

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.classList.add('deleteButton');
        deleteButton.setAttribute('data-id', article.id); // Utilisation de l'attribut data-id

        actionsDiv.appendChild(modifyButton);
        actionsDiv.appendChild(deleteButton);

        titleDateDiv.appendChild(titreElement);
        titleDateDiv.appendChild(dateElement);

        articleElement.appendChild(titleDateDiv);
        articleElement.appendChild(contenuElement);
        articleElement.appendChild(actionsDiv);

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

function fetchNavbarLinks() {
    fetch('http://localhost:8080/api/categories')
        .then(response => response.json())
        .then(data => {
            // Manipuler la réponse de l'API pour générer les liens de la navbar
            var navLinks = document.getElementById("navLinks");
            navLinks.innerHTML = `<li><a href="editeur.html">Accueil</a></li>
                                  <li><a href="#" id="categoriesLink">Categories</a></li>`;

            var categoriesLink = document.getElementById("categoriesLink");
            categoriesLink.addEventListener("click", function () {
                fetchListCategorie();
            });

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

                    var modifyButton = document.createElement('button');
                    modifyButton.textContent = 'Modifier';
                    modifyButton.classList.add('modifyButton');
                    modifyButton.setAttribute('data-id', article.id);

                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Supprimer';
                    deleteButton.classList.add('deleteButton');
                    deleteButton.setAttribute('data-id', article.id);

                    actionsDiv.appendChild(modifyButton);
                    actionsDiv.appendChild(deleteButton);

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

var previousButton = document.getElementById('previousButton');
previousButton.addEventListener('click', afficherPagePrecedente);

var nextButton = document.getElementById('nextButton');
nextButton.addEventListener('click', afficherPageSuivante);

var articlesContainer = document.getElementById('articles');
articlesContainer.addEventListener('click', function (event) {
    var target = event.target;
    if (target.classList.contains('modifyButton')) {
        var id = target.getAttribute('data-id');
        var article = articles.find(function (a) {
            return a.id === parseInt(id);
        });
        modifierArticle(article);
    } else if (target.classList.contains('deleteButton')) {
        var id = target.getAttribute('data-id');
        var article = articles.find(function (a) {
            return a.id === parseInt(id);
        });
        supprimerArticle(article);
    }
});

addForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var titre = document.getElementById('titre').value;
    var contenu = document.getElementById('contenu').value;
    var categorie = categorieSelect1.options[categorieSelect1.selectedIndex].value;
    var erreurMessage = document.getElementById("erreur-message");

    // Effectuez le traitement du formulaire ici
    // Par exempleajoutez une requête à l'API pour créer un nouvel article avec les données saisies.

    fetch('http://localhost:8080/api/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            titre: titre,
            contenu: contenu,
            categorie: {
                id: categorie,
            }
        }),
    })
        .then(response => response.json())
        .then(data => {
            // Ajoutez le nouvel article à la liste d'articles existante
            modal.style.display = 'none';
            window.location.href = 'editeur.html';
        })
        .catch(error => {
            console.error('Erreur lors de la création de l\'article:', error);
            erreurMessage.innerHTML = 'Erreur lors de la création de l\'article'
        });
});

addForm2.addEventListener('submit', function (event) {
    event.preventDefault();
    var categoryName = document.getElementById('categoryName').value;
    var addErrorMessage = document.getElementById("addErrorMessage");

    fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            libelle: categoryName
        }),
    })
        .then(response => response.json())
        .then(data => {
            // Ajoutez la nouvelle catégorie à la liste d'articles existante
            fetchNavbarLinks();
            fetchListCategorie();
            addModal.style.display = 'none';
        })
        .catch(error => {
            console.error('Erreur lors de la création de la catégorie:', error);
            addErrorMessage.innerHTML = 'Erreur lors de la création de la catégorie';
        });
});

function modifierArticle(article) {
    var titreInput = document.getElementById('updateTitre');
    var contenuInput = document.getElementById('updateContenu');
    var categorieSelect2 = document.getElementById('updateCategorie');

    titreInput.value = article.titre;
    contenuInput.value = article.contenu;
    categorieSelect2.value = article.categorie.id;

    // Afficher le formulaire modal
    updateModal.style.display = 'block';

    updateForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Récupérer les valeurs mises à jour du formulaire
        var nouveauTitre = titreInput.value;
        var nouveauContenu = contenuInput.value;
        var nouvelleCategorie = categorieSelect2.value;
        var erreurMessage = document.getElementById("erreur-message");

        // Construire l'objet de données à envoyer à l'API pour la mise à jour de l'article
        var newData = {
            titre: nouveauTitre,
            contenu: nouveauContenu,
            categorie: {
                id: nouvelleCategorie
            }
        };

        // Effectuer une requête PUT ou PATCH à l'API pour mettre à jour l'article
        fetch('http://localhost:8080/api/articles/' + article.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then(response => response.json())
            .then(updatedArticle => {
                // Mettre à jour l'article dans la liste des articles
                var foundIndex = articles.findIndex(item => item.id === updatedArticle.id);
                if (foundIndex !== -1) {
                    articles[foundIndex] = updatedArticle;
                }
                // Réafficher les articles
                afficherArticles();
                updateModal.style.display = 'none';
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de l\'article :', error);
                erreurMessage.innerHTML = 'Erreur lors de la mise à jour de l\'article ';
            });
    });
}

function modifierCategorie(categorie) {
    var categoryNameInput = document.getElementById('editCategoryName');
    var editModal = document.getElementById('editModal');
    var editForm = document.getElementById('editForm');

    categoryNameInput.value = categorie.libelle;

    // Afficher le formulaire modal
    editModal.style.display = 'block';

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Récupérer la valeur mise à jour du formulaire
        var nouveauLibelle = categoryNameInput.value;
        var erreurMessage = document.getElementById("editErrorMessage");

        // Construire l'objet de données à envoyer à l'API pour la modification de la catégorie
        var newData = {
            libelle: nouveauLibelle
        };

        // Effectuer une requête PUT ou PATCH à l'API pour mettre à jour la catégorie
        fetch('http://localhost:8080/api/categories/' + categorie.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then(response => response.json())
            .then(updatedCategorie => {
                // Mettre à jour la catégorie dans la liste des catégories
                var foundIndex = categories.findIndex(item => item.id === updatedCategorie.id);
                if (foundIndex !== -1) {
                    categories[foundIndex] = updatedCategorie;
                }
                // Réafficher les catégories
                fetchNavbarLinks();
                fetchListCategorie();
                editModal.style.display = 'none';
            })
            .catch(error => {
                console.error('Erreur lors de la modification de la catégorie :', error);
                erreurMessage.innerHTML = 'Erreur lors de la modification de la catégorie';
            });
    });

    var closeButton = editModal.querySelector('.close');
    closeButton.addEventListener('click', function () {
        editModal.style.display = 'none';
    });
}

function supprimerArticle(article) {
    var deleteModalTitle = document.getElementById('deleteModalTitle');
    var deleteModalContent = document.getElementById('deleteModalContent');
    var erreurMessage = document.getElementById("erreur-message2");

    deleteModalTitle.textContent = 'Supprimer l\'article';
    deleteModalContent.textContent =
        'Êtes-vous sûr de vouloir supprimer cet article ?';

    // Afficher la modale de suppression
    deleteModal.style.display = 'block';

    var deleteConfirmButton = document.getElementById('deleteConfirmButton');
    deleteConfirmButton.textContent = 'Confirmer';
    deleteConfirmButton.addEventListener('click', function () {
        // Effectuer une requête DELETE à l'API pour supprimer l'article
        fetch('http://localhost:8080/api/articles/' + article.id, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    // Supprimer l'article de la liste des articles et réafficher les articles
                    var index = articles.indexOf(article);
                    if (index !== -1) {
                        articles.splice(index, 1);
                        afficherArticles();
                        alert('Article supprimé avec succés !');
                    }
                } else {
                    console.error('Erreur lors de la suppression de l\'article:', response.status);
                    erreurMessage = 'Erreur lors de la suppression de l\'article';
                }
                deleteModal.style.display = 'none';
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de l\'article:', error);
                deleteModal.style.display = 'none';
            });
    });

    var deleteCancelButton = document.getElementById('deleteCancelButton');
    deleteCancelButton.textContent = 'Annuler';
    deleteCancelButton.addEventListener('click', function () {
        deleteModal.style.display = 'none';
    });
}

function supprimerCategorie(categorie) {
    var deleteModal2 = document.getElementById('deleteModal2');
    var deleteModalTitle2 = document.getElementById('deleteModalTitle2');
    var deleteModalContent2 = document.getElementById('deleteModalContent2');
    var deleteErrorMessage = document.getElementById('deleteErrorMessage');

    deleteModalTitle2.textContent = 'Supprimer la catégorie ?';
    deleteModalContent2.textContent = 'Êtes-vous sûr de vouloir supprimer la catégorie "' + categorie.libelle + '" ?';
    deleteErrorMessage.textContent = '';

    // Afficher la modale de suppression
    deleteModal2.style.display = 'block';

    var deleteConfirmButton2 = document.getElementById('deleteConfirmButton2');
    deleteConfirmButton2.textContent = 'Confirmer';
    deleteConfirmButton2.addEventListener('click', function () {
        // Effectuer une requête DELETE à l'API pour supprimer la catégorie
        fetch('http://localhost:8080/api/categories/' + categorie.id, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    // Supprimer la catégorie de la liste des catégories et réafficher les catégories
                    var index = categories.findIndex(item => item.id === categorie.id);
                    if (index !== -1) {
                        categories.splice(index, 1);
                        fetchNavbarLinks();
                        fetchListCategorie();
                        alert('Catégorie supprimée avec succès !');
                    }
                } else {
                    console.error('Erreur lors de la suppression de la catégorie:', error);
                    deleteErrorMessage.textContent = 'Erreur lors de la suppression de la catégorie';
                }
                deleteModal2.style.display = 'none';
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la catégorie:', error);
                deleteModal2.style.display = 'none';
            });
    });

    var deleteCancelButton2 = document.getElementById('deleteCancelButton2');
    deleteCancelButton2.textContent = 'Annuler';
    deleteCancelButton2.addEventListener('click', function () {
        deleteModal2.style.display = 'none';
    });
}

fetchArticles();

openModalButton.addEventListener('click', function () {
    modalTitle.textContent = 'Ajouter un article';
    titreInput.value = '';
    contenuInput.value = '';
    categorieSelect1.value = '';

    modal.style.display = 'block';
});

var closeButtons = document.getElementsByClassName('close');

for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function () {
        var modal = this.closest('.modal');
        modal.style.display = 'none';
    });
}

// Génération des options de catégorie
var categories = [];
function fetchCategories() {
    // Appel à l'API pour récupérer les catégories
    fetch('http://localhost:8080/api/categories')
        .then(response => response.json())
        .then(data => {
            categories = data;
            categories.forEach(function (category) {
                // Créer une nouvelle option pour chaque catégorie
                var option1 = document.createElement('option');
                option1.value = category.id;
                option1.textContent = category.libelle;
                categorieSelect1.appendChild(option1);

                // Créer une autre option pour chaque catégorie
                var option2 = document.createElement('option');
                option2.value = category.id;
                option2.textContent = category.libelle;
                categorieSelect2.appendChild(option2);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error);
        });
}

Promise.all([fetchCategories(), fetchArticles()])
    .then(() => {
        afficherArticles();
    })
    .catch(error => {
        console.error('Erreur lors de l\'initialisation:', error);
    });

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    if (event.target === deleteModal) {
        deleteModal.style.display = 'none';
    }
});

var carouselContainer = document.querySelector('.carousel-container');

function carouselSlide() {
    var firstImage = carouselContainer.firstElementChild;
    carouselContainer.appendChild(firstImage);
}

setInterval(carouselSlide, 5000);

// Récupérer le bouton de déconnexion par son ID
var logoutButton = document.getElementById('logoutButton');

// Ajouter un événement de clic au bouton de déconnexion
logoutButton.addEventListener('click', function () {
    // Supprimer les informations de connexion de la session storage
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('user');

    // Rediriger l'utilisateur vers la page de connexion
    window.location.href = 'accueil.html';
});


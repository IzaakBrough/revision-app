// Define the flashcard content
let cards = [
    {
        question: "What is JavaScript?",
        answer: "A programming language that enables interactive web pages",
        collection: "programming"
    },
    {
        question: "What does CSS stand for?",
        answer: "Cascading Style Sheets",
        collection: "programming"
    },
    {
        question: "What does HTML stand for?",
        answer: "Hypertext Markup Language",
        collection: "programming"
    },
    {
        question: "What is a function in programming?",
        answer: "A reusable block of code designed to perform a specific task",
        collection: "programming"
    },
    {
        question: "What is the DOM?",
        answer: "Document Object Model - a programming interface for web documents",
        collection: "programming"
    }
];

// Collection management
let collections = {
    "Programming": {
        name: "Programming",
        cardCount: 5
    }
};

class Card {
    constructor(question, answer, collection) {
        this.question = question;
        this.answer = answer;
        this.collection = collection;
    }
}

class Collection {
    constructor(name) {
        this.name = name;
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    getCardCount() {
        return this.cards.length;
    }
}

class FlashcardManager {
    constructor() {
        this.cards = [];
        this.collections = {};
    }

    addCard(card) {
        this.cards.push(card);
        if (!this.collections[card.collection]) {
            this.collections[card.collection] = new Collection(card.collection);
        }
        this.collections[card.collection].addCard(card);
    }

    getCardsByCollection(collectionName) {
        return this.collections[collectionName] ? this.collections[collectionName].cards : [];
    }

    updateCard(index, updatedCard) {
        if (index >= 0 && index < this.cards.length) {
            const oldCollection = this.cards[index].collection;
            this.cards[index] = updatedCard;

            if (oldCollection === updatedCard.collection) {
                const collectionCards = this.collections[oldCollection].cards;
                for (let i = 0; i < collectionCards.length; i++) {
                    if (collectionCards[i] === this.cards[index] ||
                        (collectionCards[i].question === this.cards[index].question &&
                         collectionCards[i].answer === this.cards[index].answer)) {
                        collectionCards[i] = updatedCard;
                        break;
                    }
                }
            } else {
                this.removeCardFromCollection(oldCollection, index);

                if (!this.collections[updatedCard.collection]) {
                    this.collections[updatedCard.collection] = new Collection(updatedCard.collection);
                }
                this.collections[updatedCard.collection].addCard(updatedCard);
            }

            return true;
        }
        return false;
    }

    deleteCard(index) {
        if (index >= 0 && index < this.cards.length) {
            const card = this.cards[index];
            const collection = card.collection;

            this.cards.splice(index, 1);

            this.removeCardFromCollection(collection, index);

            return true;
        }
        return false;
    }

    removeCardFromCollection(collectionName, cardIndex) {
        if (this.collections[collectionName]) {
            const collectionCards = this.collections[collectionName].cards;
            const cardToRemove = this.cards[cardIndex];

            for (let i = 0; i < collectionCards.length; i++) {
                if (collectionCards[i] === cardToRemove ||
                    (collectionCards[i].question === cardToRemove.question &&
                     collectionCards[i].answer === cardToRemove.answer)) {
                    collectionCards.splice(i, 1);
                    break;
                }
            }
        }
    }

    exportCards() {
        return JSON.stringify(this.cards, null, 2);
    }

    importCards(json) {
        try {
            const parsedData = JSON.parse(json);

            let importedCards = [];

            if (Array.isArray(parsedData)) {
                importedCards = parsedData;
            } else if (typeof parsedData === 'object') {
                if (parsedData.cards && Array.isArray(parsedData.cards)) {
                    importedCards = parsedData.cards;
                } else {
                    importedCards = [parsedData];
                }
            } else {
                throw new Error("Invalid JSON format: Expected an array or object");
            }

            importedCards.forEach(cardData => {
                if (cardData.question && cardData.answer) {
                    const collection = cardData.collection || "Imported";
                    const card = new Card(cardData.question, cardData.answer, collection);
                    this.addCard(card);
                }
            });
        } catch (error) {
            console.error("Error importing cards:", error);
            throw error;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const createCardBtn = document.getElementById('create-card-btn');
    const editCardsBtn = document.getElementById('edit-cards-btn');
    const flashcardForm = document.getElementById('flashcard-form');
    const flashcardList = document.getElementById('flashcard-list');
    const editCollection = document.getElementById('edit-collection');
    const cardContainer = document.getElementById('card-container');
    const nextButton = document.getElementById('next-button');
    const collectionSelect = document.getElementById('collection-select');
    const formCollectionSelect = document.getElementById('form-collection');
    const createCardForm = document.getElementById('create-card-form');
    const messageDiv = document.getElementById('message');
    const dataManageBtn = document.getElementById('data-manage-btn');
    const dataDropdown = document.getElementById('data-dropdown');
    const exportOption = document.getElementById('export-option');
    const importOption = document.getElementById('import-option');
    const dropArea = document.getElementById('drop-area');
    const flashcardListContainer = document.getElementById('flashcard-list-container');

    const manager = new FlashcardManager();

    cards.forEach(cardData => {
        const card = new Card(cardData.question, cardData.answer, cardData.collection);
        manager.addCard(card);
    });

    function populateCollections() {
        while (collectionSelect.options.length > 2) {
            collectionSelect.remove(2);
        }

        while (editCollection.options.length > 2) {
            editCollection.remove(2);
        }

        formCollectionSelect.innerHTML = '';

        Object.keys(manager.collections).forEach(collectionName => {
            const option = document.createElement('option');
            option.value = collectionName;
            option.textContent = manager.collections[collectionName].name || collectionName;
            collectionSelect.appendChild(option);
            editCollection.appendChild(option.cloneNode(true));

            const formOption = document.createElement('option');
            formOption.value = collectionName;
            formOption.textContent = manager.collections[collectionName].name || collectionName;
            formCollectionSelect.appendChild(formOption);
        });

        const newOption = document.createElement('option');
        newOption.value = "new";
        newOption.textContent = "Create New Collection";
        formCollectionSelect.appendChild(newOption);
    }

    formCollectionSelect.addEventListener('change', function() {
        const newCollectionDiv = document.getElementById('new-collection-div');
        if (this.value === 'new') {
            if (!newCollectionDiv) {
                const div = document.createElement('div');
                div.id = 'new-collection-div';
                div.className = 'form-group';

                const label = document.createElement('label');
                label.setAttribute('for', 'new-collection-name');
                label.textContent = 'New Collection Name:';

                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'new-collection-name';
                input.required = true;
                input.placeholder = 'Enter collection name';

                div.appendChild(label);
                div.appendChild(input);

                formCollectionSelect.parentNode.insertAdjacentElement('afterend', div);
            } else {
                newCollectionDiv.style.display = 'block';
            }
        } else if (newCollectionDiv) {
            newCollectionDiv.style.display = 'none';
        }
    });

    populateCollections();

    let currentCards = [];
    let currentCardIndex = 0;

    function loadCardsFromCollection(collectionName) {
        if (collectionName === 'all') {
            currentCards = [...manager.cards];
        } else {
            currentCards = manager.getCardsByCollection(collectionName);
        }

        currentCardIndex = 0;
        if (currentCards.length > 0) {
            displayCard(currentCards[currentCardIndex]);
        } else {
            displayEmptyState();
        }
    }

    function displayCard(card) {
        const cardFront = cardContainer.querySelector('.card-front p');
        const cardBack = cardContainer.querySelector('.card-back p');

        cardFront.textContent = card.question;
        cardBack.textContent = card.answer;

        const cardElement = cardContainer.querySelector('.card');
        cardElement.classList.remove('flipped');
    }

    function displayEmptyState() {
        const cardFront = cardContainer.querySelector('.card-front p');
        const cardBack = cardContainer.querySelector('.card-back p');

        cardFront.textContent = "No flashcards available in this collection";
        cardBack.textContent = "Create new cards to study!";
    }

    loadCardsFromCollection('programming');
    collectionSelect.value = 'programming';

    createCardBtn.addEventListener('click', function() {
        if (flashcardForm.style.display === 'none') {
            flashcardForm.style.display = 'block';
            createCardBtn.textContent = 'Hide Form';
        } else {
            flashcardForm.style.display = 'none';
            createCardBtn.textContent = 'Add Flashcard';
        }
    });

    editCardsBtn.addEventListener('click', function() {
        if (flashcardList.style.display === 'none') {
            flashcardList.style.display = 'block';
            editCardsBtn.textContent = 'Hide ✏️Cards';
        } else {
            flashcardList.style.display = 'none';
            editCardsBtn.textContent = '✏️Cards';
        }
    });

    cardContainer.addEventListener('click', function() {
        const card = cardContainer.querySelector('.card');
        card.classList.toggle('flipped');
    });

    nextButton.addEventListener('click', function() {
        if (currentCards.length === 0) return;

        currentCardIndex = (currentCardIndex + 1) % currentCards.length;
        displayCard(currentCards[currentCardIndex]);
    });

    collectionSelect.addEventListener('change', function() {
        loadCardsFromCollection(this.value);
    });

    createCardForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const questionInput = document.getElementById('question');
        const answerInput = document.getElementById('answer');
        let collectionName;

        if (formCollectionSelect.value === 'new') {
            const newCollectionInput = document.getElementById('new-collection-name');
            if (newCollectionInput && newCollectionInput.value.trim()) {
                collectionName = newCollectionInput.value.trim();
            } else {
                alert("Please enter a name for your new collection");
                return;
            }
        } else {
            collectionName = formCollectionSelect.value;
        }

        if (questionInput.value && answerInput.value) {
            const newCard = new Card(questionInput.value, answerInput.value, collectionName);
            manager.addCard(newCard);

            // Update the main cards view
            if (collectionSelect.value === 'all' || collectionSelect.value === collectionName) {
                currentCards.push(newCard);
                if (currentCards.length === 1) {
                    displayCard(newCard);
                }
            }

            // Update collections dropdowns
            populateCollections();
            
            // Load the new card's collection in the main view
            if (document.querySelector(`#collection-select option[value="${collectionName}"]`)) {
                collectionSelect.value = collectionName;
                loadCardsFromCollection(collectionName);
            }
            
            // Update the edit cards view and show it if hidden
            editCollection.value = collectionName;
            displayCardsForEdit(collectionName);
            
            if (flashcardList.style.display === 'none') {
                flashcardList.style.display = 'block';
                editCardsBtn.textContent = 'Hide ✏️Cards';
            }

            messageDiv.textContent = "Flashcard added successfully!";
            messageDiv.style.color = "green";

            // Clear inputs
            questionInput.value = "";
            answerInput.value = "";

            // Remove new collection field if exists
            const newCollectionDiv = document.getElementById('new-collection-div');
            if (newCollectionDiv) {
                newCollectionDiv.remove();
            }

            // Hide the form after a delay
            setTimeout(() => {
                flashcardForm.style.display = 'none';
                createCardBtn.textContent = 'Add Flashcard';
                messageDiv.textContent = "";
            }, 2000);
        }
    });

    dataManageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle the dropdown visibility
        if (dataDropdown.classList.contains('show')) {
            dataDropdown.classList.remove('show');
        } else {
            dataDropdown.classList.add('show');
        }
        
        // For debugging
        console.log('Dropdown toggled, current state:', dataDropdown.classList.contains('show'));
    });

    document.addEventListener('click', function(e) {
        if (dataDropdown.classList.contains('show') &&
            !dataManageBtn.contains(e.target) &&
            !dataDropdown.contains(e.target)) {
            dataDropdown.classList.remove('show');
        }
    });

    exportOption.addEventListener('click', function(e) {
        e.stopPropagation();

        const jsonData = manager.exportCards();

        const blob = new Blob([jsonData], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'flashcards.json';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        messageDiv.textContent = "Flashcards exported successfully!";
        messageDiv.style.color = "green";

        dataDropdown.classList.remove('show');

        setTimeout(() => {
            messageDiv.textContent = "";
        }, 3000);
    });

    importOption.addEventListener('click', function(e) {
        e.stopPropagation();

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.addEventListener('change', handleFileSelect);

        fileInput.click();

        dataDropdown.classList.remove('show');
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        readAndImportFile(file);
    }

    function readAndImportFile(file) {
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            messageDiv.textContent = "Please select a JSON file!";
            messageDiv.style.color = "red";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = e.target.result;
                manager.importCards(jsonData);

                // Update collections dropdown
                populateCollections();

                // Update the main card view
                collectionSelect.value = 'all';
                loadCardsFromCollection('all');

                // Update the edit cards view
                editCollection.value = 'all';
                displayCardsForEdit('all');
                
                // Show the edit cards section if it's hidden
                if (flashcardList.style.display === 'none') {
                    flashcardList.style.display = 'block';
                    editCardsBtn.textContent = 'Hide ✏️Cards';
                }

                messageDiv.textContent = "Flashcards imported successfully!";
                messageDiv.style.color = "green";

                setTimeout(() => {
                    messageDiv.textContent = "";
                }, 3000);
            } catch (error) {
                messageDiv.textContent = "Error importing flashcards: " + error.message;
                messageDiv.style.color = "red";
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];

        readAndImportFile(file);

        setTimeout(() => {
            dataDropdown.classList.remove('show');
        }, 1000);
    }

    function displayCardsForEdit(collectionName) {
        flashcardListContainer.innerHTML = '';

        let cardsToDisplay = [];
        if (collectionName === 'all') {
            cardsToDisplay = [...manager.cards];
        } else {
            cardsToDisplay = manager.getCardsByCollection(collectionName);
        }

        if (cardsToDisplay.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-collection-message';
            emptyMessage.textContent = 'No flashcards in this collection.';
            flashcardListContainer.appendChild(emptyMessage);
            return;
        }

        cardsToDisplay.forEach((card, index) => {
            const cardElement = createEditableCardElement(card, index);
            flashcardListContainer.appendChild(cardElement);
        });
    }

    function createEditableCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'editable-card';
        cardElement.dataset.index = index;

        const cardView = document.createElement('div');
        cardView.className = 'card-view';

        const questionView = document.createElement('div');
        questionView.className = 'card-question';
        questionView.textContent = card.question;

        const answerView = document.createElement('div');
        answerView.className = 'card-answer';
        answerView.textContent = card.answer;

        const collectionTag = document.createElement('div');
        collectionTag.className = 'collection-tag';
        collectionTag.textContent = card.collection;

        const actionButtons = document.createElement('div');
        actionButtons.className = 'card-actions';

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.innerHTML = '✏️';
        editButton.title = 'Edit Card';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '🗑️';
        deleteButton.title = 'Delete Card';

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);

        cardView.appendChild(questionView);
        cardView.appendChild(answerView);
        cardView.appendChild(collectionTag);
        cardView.appendChild(actionButtons);

        const editForm = document.createElement('form');
        editForm.className = 'card-edit-form';
        editForm.style.display = 'none';

        const questionInput = document.createElement('input');
        questionInput.type = 'text';
        questionInput.className = 'edit-question';
        questionInput.value = card.question;
        questionInput.placeholder = 'Question';
        questionInput.required = true;

        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.className = 'edit-answer';
        answerInput.value = card.answer;
        answerInput.placeholder = 'Answer';
        answerInput.required = true;

        const collectionSelect = document.createElement('select');
        collectionSelect.className = 'edit-collection';

        Object.keys(manager.collections).forEach(collName => {
            const option = document.createElement('option');
            option.value = collName;
            option.textContent = collName;
            collectionSelect.appendChild(option);
        });

        if (card.collection && collectionSelect.querySelector(`option[value="${card.collection}"]`)) {
            collectionSelect.value = card.collection;
        }

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'save-button';
        saveButton.textContent = 'Save';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Cancel';

        const formButtons = document.createElement('div');
        formButtons.className = 'form-buttons';
        formButtons.appendChild(saveButton);
        formButtons.appendChild(cancelButton);

        editForm.appendChild(questionInput);
        editForm.appendChild(answerInput);
        editForm.appendChild(collectionSelect);
        editForm.appendChild(formButtons);

        cardElement.appendChild(cardView);
        cardElement.appendChild(editForm);

        editButton.addEventListener('click', function() {
            cardView.style.display = 'none';
            editForm.style.display = 'block';
        });

        cancelButton.addEventListener('click', function() {
            editForm.style.display = 'none';
            cardView.style.display = 'flex';
        });

        deleteButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this flashcard?')) {
                const cardIndex = parseInt(cardElement.dataset.index);
                if (manager.deleteCard(cardIndex)) {
                    cardElement.remove();

                    const currentCollection = editCollection.value;
                    displayCardsForEdit(currentCollection);

                    if (collectionSelect.value === currentCollection ||
                        collectionSelect.value === 'all') {
                        loadCardsFromCollection(collectionSelect.value);
                    }

                    messageDiv.textContent = "Flashcard deleted successfully!";
                    messageDiv.style.color = "green";
                    setTimeout(() => { messageDiv.textContent = ""; }, 3000);
                }
            }
        });

        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const cardIndex = parseInt(cardElement.dataset.index);
            const updatedCard = new Card(
                questionInput.value,
                answerInput.value,
                collectionSelect.value
            );

            if (manager.updateCard(cardIndex, updatedCard)) {
                questionView.textContent = updatedCard.question;
                answerView.textContent = updatedCard.answer;
                collectionTag.textContent = updatedCard.collection;

                editForm.style.display = 'none';
                cardView.style.display = 'flex';

                populateCollections();

                if (collectionSelect.value === updatedCard.collection ||
                    collectionSelect.value === 'all') {
                    loadCardsFromCollection(collectionSelect.value);
                }

                messageDiv.textContent = "Flashcard updated successfully!";
                messageDiv.style.color = "green";
                setTimeout(() => { messageDiv.textContent = ""; }, 3000);

                const currentCollection = editCollection.value;
                displayCardsForEdit(currentCollection);
            }
        });

        return cardElement;
    }

    editCollection.addEventListener('change', function() {
        displayCardsForEdit(this.value);
    });

    displayCardsForEdit('all');
});
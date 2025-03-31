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
        this.loadFromLocalStorage();
    }

    addCard(card) {
        this.cards.push(card);
        if (!this.collections[card.collection]) {
            this.collections[card.collection] = new Collection(card.collection);
        }
        this.collections[card.collection].addCard(card);
        this.saveToLocalStorage();
    }

    getCardsByCollection(collectionName) {
        return this.collections[collectionName] ? this.collections[collectionName].cards : [];
    }

    updateCard(index, updatedCard) {
        if (index >= 0 && index < this.cards.length) {
            const oldCard = this.cards[index];
            const oldCollection = oldCard.collection;
            
            // Update the card in the main array
            this.cards[index] = updatedCard;

            // Handle collection changes properly
            if (oldCollection === updatedCard.collection) {
                // Same collection - directly update the card in that collection
                const collectionCards = this.collections[oldCollection].cards;
                
                // Find and update the card in the collection
                let found = false;
                for (let i = 0; i < collectionCards.length; i++) {
                    if (collectionCards[i].question === oldCard.question && 
                        collectionCards[i].answer === oldCard.answer) {
                        collectionCards[i] = updatedCard;
                        found = true;
                        break;
                    }
                }
                
                // If card wasn't found, add it (shouldn't happen, but as a safety measure)
                if (!found) {
                    this.collections[oldCollection].addCard(updatedCard);
                }
            } else {
                // Collection changed - remove from old and add to new
                
                // First, explicitly remove from old collection using the old card data
                if (this.collections[oldCollection]) {
                    const oldCollectionCards = this.collections[oldCollection].cards;
                    for (let i = 0; i < oldCollectionCards.length; i++) {
                        if (oldCollectionCards[i].question === oldCard.question && 
                            oldCollectionCards[i].answer === oldCard.answer) {
                            oldCollectionCards.splice(i, 1);
                            break;
                        }
                    }
                }

                // Then add to new collection
                if (!this.collections[updatedCard.collection]) {
                    this.collections[updatedCard.collection] = new Collection(updatedCard.collection);
                }
                this.collections[updatedCard.collection].addCard(updatedCard);
            }
            
            this.saveToLocalStorage();
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
            this.saveToLocalStorage();
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
            
            this.saveToLocalStorage();
        } catch (error) {
            console.error("Error importing cards:", error);
            throw error;
        }
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem('flashcards', JSON.stringify(this.cards));
            localStorage.setItem('collections', JSON.stringify(
                Object.keys(this.collections).map(key => ({
                    name: this.collections[key].name,
                    cardCount: this.collections[key].cards.length
                }))
            ));
        } catch (error) {
            console.error("Error saving to local storage:", error);
        }
    }
    
    loadFromLocalStorage() {
        try {
            const savedCards = localStorage.getItem('flashcards');
            if (savedCards) {
                const parsedCards = JSON.parse(savedCards);
                
                // Clear existing data
                this.cards = [];
                this.collections = {};
                
                // Reload from saved data
                parsedCards.forEach(cardData => {
                    const card = new Card(cardData.question, cardData.answer, cardData.collection);
                    this.addCard(card);
                });
            } else {
                // Initialize with default cards if no saved data
                this.cards = [];
                this.collections = {};
                cards.forEach(cardData => {
                    // Ensure proper collection name consistency (lowercase)
                    const card = new Card(
                        cardData.question, 
                        cardData.answer, 
                        cardData.collection.toLowerCase()
                    );
                    this.addCard(card);
                });
            }
        } catch (error) {
            console.error("Error loading from local storage:", error);
            
            // Fall back to default cards if there's an error
            this.cards = [];
            this.collections = {};
            cards.forEach(cardData => {
                // Ensure proper collection name consistency (lowercase)
                const card = new Card(
                    cardData.question, 
                    cardData.answer, 
                    cardData.collection.toLowerCase()
                );
                this.addCard(card);
            });
        }
    }
    
    clearLocalStorage() {
        localStorage.removeItem('flashcards');
        localStorage.removeItem('collections');
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
            currentCards = [...manager.getCardsByCollection(collectionName)];
        }

        currentCardIndex = 0;
        if (currentCards.length > 0) {
            displayCard(currentCards[currentCardIndex]);
        } else {
            displayEmptyState();
        }
        
        // Update collection info display
        updateCollectionInfoDisplay(collectionName);
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

    // Modified function to ensure card container is always updated correctly
    function syncCurrentCardDisplay() {
        const currentCollectionName = collectionSelect.value;
        
        // First refresh the collection in case it was modified
        if (currentCollectionName !== 'all') {
            // Make sure we're viewing the latest version of the collection
            const collectionCards = manager.getCardsByCollection(currentCollectionName);
            
            // Reassign to ensure we have the latest version
            currentCards = [...collectionCards];
        } else {
            // For "all" cards, always get a fresh copy
            currentCards = [...manager.cards];
        }
        
        // If we have cards, but our index is now invalid, reset it
        if (currentCards.length > 0) {
            if (currentCardIndex >= currentCards.length) {
                currentCardIndex = 0;
            }
            
            // Display the current card
            displayCard(currentCards[currentCardIndex]);
        } else {
            // No cards to display
            displayEmptyState();
        }
        
        // Update collection info display
        updateCollectionInfoDisplay(currentCollectionName);
    }
    
    // Extract collection info display update to a separate function
    function updateCollectionInfoDisplay(collectionName) {
        const cardCount = collectionName === 'all' ? 
            manager.cards.length : 
            (manager.collections[collectionName]?.cards.length || 0);
            
        // Update or create the collection info element
        let countDisplay = cardContainer.querySelector('.collection-info');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.className = 'collection-info';
            cardContainer.appendChild(countDisplay);
        }
        
        // Update the text content
        countDisplay.textContent = `${collectionName === 'all' ? 'All cards' : collectionName}: ${cardCount} cards`;
    }

    loadCardsFromCollection('programming');
    collectionSelect.value = 'programming';

    // Function to close all dropdown menus and reset button texts
    function closeAllDropdowns() {
        flashcardForm.classList.remove('show');
        flashcardList.classList.remove('show');
        dataDropdown.classList.remove('show');
        
        // Reset button texts
        createCardBtn.textContent = 'Add Flashcard';
        editCardsBtn.textContent = '✏️Cards';
    }

    createCardBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        flashcardList.classList.remove('show');
        dataDropdown.classList.remove('show');
        
        // Reset other button text
        editCardsBtn.textContent = '✏️Cards';
        
        // Toggle this dropdown
        flashcardForm.classList.toggle('show');
        
        // Update button text based on visibility
        createCardBtn.textContent = flashcardForm.classList.contains('show') ? 'Hide Form' : 'Add Flashcard';
    });

    editCardsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        flashcardForm.classList.remove('show');
        dataDropdown.classList.remove('show');
        
        // Reset other button text
        createCardBtn.textContent = 'Add Flashcard';
        
        // Toggle this dropdown
        flashcardList.classList.toggle('show');
        
        // Update button text based on visibility
        editCardsBtn.textContent = flashcardList.classList.contains('show') ? 'Hide ✏️Cards' : '✏️Cards';
        
        // When showing the cards list, adjust the container height
        if (flashcardList.classList.contains('show')) {
            setTimeout(adjustFlashcardListHeight, 10);
        }
    });

    dataManageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        flashcardForm.classList.remove('show');
        flashcardList.classList.remove('show');
        
        // Toggle the dropdown visibility
        dataDropdown.classList.toggle('show');
        
        // Reset other buttons text
        createCardBtn.textContent = 'Add Flashcard';
        editCardsBtn.textContent = '✏️Cards';
    });

    document.addEventListener('click', function(e) {
        // If clicking outside any of the dropdowns or their toggle buttons, close all dropdowns
        if (!dataManageBtn.contains(e.target) && 
            !dataDropdown.contains(e.target) && 
            !createCardBtn.contains(e.target) && 
            !flashcardForm.contains(e.target) &&
            !editCardsBtn.contains(e.target) && 
            !flashcardList.contains(e.target)) {
            
            closeAllDropdowns();
        }
    });

    // Add an event listener for the escape key to close all dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
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
        // Get fresh collection data when switching
        loadCardsFromCollection(this.value);
        
        // Keep edit view in sync if it's visible
        if (flashcardList.classList.contains('show')) {
            editCollection.value = this.value;
            displayCardsForEdit(this.value);
        }
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
            const newCard = new Card(questionInput.value, answerInput.value, collectionName.toLowerCase());
            manager.addCard(newCard);

            // Update collections dropdowns
            populateCollections();
            
            // Update the edit cards view and show it if hidden
            editCollection.value = collectionName;
            displayCardsForEdit(collectionName);
            
            // Update main card view - using our new sync function instead of directly modifying currentCards
            if (collectionSelect.value === 'all' || collectionSelect.value === collectionName) {
                syncCurrentCardDisplay();
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
                flashcardForm.classList.remove('show');
                createCardBtn.textContent = 'Add Flashcard';
                messageDiv.textContent = "";
            }, 2000);
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

        // Add collection options
        Object.keys(manager.collections).forEach(collName => {
            const option = document.createElement('option');
            option.value = collName;
            option.textContent = collName;
            collectionSelect.appendChild(option);
        });

        // Set current collection as selected
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

        // Edit button functionality
        editButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            cardView.style.display = 'none';
            editForm.style.display = 'block';
        });

        // Cancel button functionality
        cancelButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            editForm.style.display = 'none';
            cardView.style.display = 'flex';
        });

        // Delete button functionality with improved syncing
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            if (confirm('Are you sure you want to delete this flashcard?')) {
                const cardIndex = parseInt(cardElement.dataset.index);
                
                // Get real index in the main cards array
                let realIndex = cardIndex;
                const currentCollection = editCollection.value;
                
                if (currentCollection !== 'all') {
                    // Find the index in the main cards array
                    const card = manager.getCardsByCollection(currentCollection)[cardIndex];
                    realIndex = manager.cards.findIndex(c => 
                        c.question === card.question && 
                        c.answer === card.answer && 
                        c.collection === card.collection
                    );
                }
                
                if (manager.deleteCard(realIndex)) {
                    cardElement.remove();
                    
                    // Update the main card view using the sync function
                    syncCurrentCardDisplay();
                    
                    messageDiv.textContent = "Flashcard deleted successfully!";
                    messageDiv.style.color = "green";
                    setTimeout(() => { messageDiv.textContent = ""; }, 3000);
                    
                    // Refresh the edit cards view
                    displayCardsForEdit(currentCollection);
                    
                    // Check if no more cards left in this collection
                    if (flashcardListContainer.children.length === 0) {
                        const emptyMessage = document.createElement('p');
                        emptyMessage.className = 'empty-collection-message';
                        emptyMessage.textContent = 'No flashcards in this collection.';
                        flashcardListContainer.appendChild(emptyMessage);
                    }
                }
            }
        });

        // Submit form functionality with improved card-container updating
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            const cardIndex = parseInt(cardElement.dataset.index);
            
            // Get real index in the main cards array
            let realIndex = cardIndex;
            const currentEditCollection = editCollection.value;
            
            if (currentEditCollection !== 'all') {
                // Find the index in the main cards array
                const collectionCards = manager.getCardsByCollection(currentEditCollection);
                if (cardIndex < collectionCards.length) {
                    const cardToUpdate = collectionCards[cardIndex];
                    
                    // Find the corresponding card in the main array
                    realIndex = manager.cards.findIndex(c => 
                        c.question === cardToUpdate.question && 
                        c.answer === cardToUpdate.answer && 
                        c.collection === cardToUpdate.collection
                    );
                }
            }
            
            if (realIndex >= 0 && realIndex < manager.cards.length) {
                // Store the original card info for comparison
                const originalCard = manager.cards[realIndex];
                
                // Create the updated card (ensuring lowercase collection name)
                const updatedCard = new Card(
                    questionInput.value,
                    answerInput.value,
                    collectionSelect.value.toLowerCase()
                );
                
                // Update the card in the manager
                if (manager.updateCard(realIndex, updatedCard)) {
                    // Update the card view
                    questionView.textContent = updatedCard.question;
                    answerView.textContent = updatedCard.answer;
                    collectionTag.textContent = updatedCard.collection;
                    
                    // Hide the edit form and show the card view
                    editForm.style.display = 'none';
                    cardView.style.display = 'flex';
                    
                    // Refresh the collections dropdown
                    populateCollections();
                    
                    // Update card display in the main view
                    syncCurrentCardDisplay();
                    
                    // If card moved to a different collection, refresh the edit view
                    if (originalCard.collection !== updatedCard.collection) {
                        // We need to redisplay the edit cards for the current filter
                        displayCardsForEdit(currentEditCollection);
                    }
                    
                    messageDiv.textContent = "Flashcard updated successfully!";
                    messageDiv.style.color = "green";
                    setTimeout(() => { messageDiv.textContent = ""; }, 3000);
                }
            } else {
                messageDiv.textContent = "Error updating card: Card not found";
                messageDiv.style.color = "red";
                setTimeout(() => { messageDiv.textContent = ""; }, 3000);
            }
        });

        return cardElement;
    }

    // Add a resize handler to adjust the flashcard list container height
    function adjustFlashcardListHeight() {
        if (flashcardList.classList.contains('show')) {
            const flashcardListRect = flashcardList.getBoundingClientRect();
            const heading = flashcardList.querySelector('h2');
            const formGroup = flashcardList.querySelector('.form-group');
            
            const headingHeight = heading ? heading.offsetHeight : 0;
            const formGroupHeight = formGroup ? formGroup.offsetHeight : 0;
            
            // Calculate the available height, ensuring we have enough space
            const availableHeight = Math.max(
                300, // Minimum height
                flashcardListRect.height - headingHeight - formGroupHeight - 30 // 30px buffer
            );
            
            // Set the height of the cards container
            flashcardListContainer.style.height = `${availableHeight}px`;
            
            // Ensure proper scrolling behaviors
            flashcardListContainer.style.overflowY = 'auto';
            flashcardListContainer.style.overflowX = 'hidden';
            
            // Scroll back to top to avoid any potential scroll positioning issues
            flashcardListContainer.scrollTop = 0;
        }
    }

    // Handle window resize events with debouncing for better performance
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (flashcardList.classList.contains('show')) {
                adjustFlashcardListHeight();
            }
        }, 100); // 100ms debounce
    });

    // Add observer to handle dynamic content changes in the header/form
    const resizeObserver = new ResizeObserver(entries => {
        if (flashcardList.classList.contains('show')) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(adjustFlashcardListHeight, 100); // Debounced response
        }
    });

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
        
        // Adjust the container height after cards are added
        if (flashcardList.classList.contains('show')) {
            setTimeout(adjustFlashcardListHeight, 10);
        }
    }

    editCollection.addEventListener('change', function() {
        displayCardsForEdit(this.value);
    });

    displayCardsForEdit('all');

    // Add a reset functionality to data dropdown
    const resetOption = document.createElement('div');
    resetOption.className = 'dropdown-item';
    resetOption.id = 'reset-option';
    resetOption.innerHTML = `
        <span>Reset Flashcards</span>
        <small>Clear all cards and restore defaults</small>
    `;
    
    dataDropdown.appendChild(resetOption);
    
    resetOption.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (confirm('Are you sure you want to reset all flashcards? This will delete all your custom cards and restore the default set.')) {
            manager.clearLocalStorage();
            
            // Reload the page to reinitialize everything
            window.location.reload();
        }
    });

    // Add CSS for collection info display
    const style = document.createElement('style');
    style.textContent = `
        .collection-info {
            margin-top: 10px;
            text-align: center;
            color: #666;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});
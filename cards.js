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
        return card;
    }

    getCardsByCollection(collectionName) {
        // If the collection exists, return its cards
        if (this.collections[collectionName]) {
            return this.collections[collectionName].cards;
        }
        // Otherwise return empty array
        return [];
    }

    updateCard(index, updatedCard) {
        if (index >= 0 && index < this.cards.length) {
            const oldCard = this.cards[index];
            const oldCollection = oldCard.collection;
            this.cards[index] = updatedCard;
            if (oldCollection === updatedCard.collection) {
                this._updateCardInSameCollection(oldCard, updatedCard, oldCollection);
            } else {
                this._moveCardToNewCollection(oldCard, updatedCard);
            }
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    _updateCardInSameCollection(oldCard, updatedCard, collectionName) {
        const collectionCards = this.collections[collectionName].cards;
        let found = false;
        for (let i = 0; i < collectionCards.length; i++) {
            if (collectionCards[i].question === oldCard.question && 
                collectionCards[i].answer === oldCard.answer) {
                collectionCards[i] = updatedCard;
                found = true;
                break;
            }
        }
        if (!found) {
            this.collections[collectionName].addCard(updatedCard);
        }
    }

    _moveCardToNewCollection(oldCard, updatedCard) {
        const oldCollection = oldCard.collection;
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
        if (!this.collections[updatedCard.collection]) {
            this.collections[updatedCard.collection] = new Collection(updatedCard.collection);
        }
        this.collections[updatedCard.collection].addCard(updatedCard);
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

class UIManager {
    constructor(flashcardManager) {
        this.manager = flashcardManager;
        this.elements = {};
        this.currentCards = [];
        this.currentCardIndex = 0;
        this.resizeTimeout = null;
    }

    initialize() {
        this.cacheElements();
        this.attachEventListeners();
        this.populateCollections();
        this.loadCardsFromCollection('programming');
        this.elements.collectionSelect.value = 'programming';
        this.displayCardsForEdit('all');
        this.addCollectionInfoStyles();
    }

    cacheElements() {
        const elements = [
            'create-card-btn', 'edit-cards-btn', 'flashcard-form', 'flashcard-list',
            'edit-collection', 'card-container', 'next-button', 'collection-select',
            'form-collection', 'create-card-form', 'message', 'data-manage-btn',
            'data-dropdown', 'export-option', 'import-option', 'drop-area',
            'flashcard-list-container'
        ];
        elements.forEach(id => {
            this.elements[this.toCamelCase(id)] = document.getElementById(id);
        });
    }

    toCamelCase(str) {
        return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
    }

    attachEventListeners() {
        this.elements.createCardBtn.addEventListener('click', e => this.handleCreateCardClick(e));
        this.elements.editCardsBtn.addEventListener('click', e => this.handleEditCardsClick(e));
        this.elements.dataManageBtn.addEventListener('click', e => this.handleDataManageClick(e));
        this.elements.nextButton.addEventListener('click', () => this.handleNextButtonClick());
        this.elements.cardContainer.addEventListener('click', () => this.flipCard());
        this.elements.collectionSelect.addEventListener('change', () => this.handleCollectionSelectChange());
        this.elements.editCollection.addEventListener('change', () => this.handleEditCollectionChange());
        this.elements.formCollection.addEventListener('change', () => this.handleFormCollectionChange());
        this.elements.createCardForm.addEventListener('submit', e => this.handleCreateCardSubmit(e));
        this.elements.exportOption.addEventListener('click', e => this.handleExport(e));
        this.elements.importOption.addEventListener('click', e => this.handleImport(e));
        
        // Fix drag and drop event listeners
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.elements.dropArea.addEventListener(eventName, e => this.preventDefaults(e), false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            this.elements.dropArea.addEventListener(eventName, () => this.highlight(), false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.elements.dropArea.addEventListener(eventName, () => this.unhighlight(), false);
        });
        
        this.elements.dropArea.addEventListener('drop', e => this.handleDrop(e), false);
        
        document.addEventListener('click', e => this.handleDocumentClick(e));
        document.addEventListener('keydown', e => this.handleKeyDown(e));
        window.addEventListener('resize', () => this.handleWindowResize());
        
        this.addResetOption();
    }

    handleCreateCardClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        this.elements.flashcardList.classList.remove('show');
        this.elements.dataDropdown.classList.remove('show');
        
        // Reset other button text
        this.elements.editCardsBtn.textContent = '✏️Cards';
        
        // Toggle this dropdown
        this.elements.flashcardForm.classList.toggle('show');
        
        // Update button text based on visibility
        this.elements.createCardBtn.textContent = this.elements.flashcardForm.classList.contains('show') 
            ? 'Hide Form' 
            : 'Add Flashcard';
    }
    
    handleEditCardsClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        this.elements.flashcardForm.classList.remove('show');
        this.elements.dataDropdown.classList.remove('show');
        
        // Reset other button text
        this.elements.createCardBtn.textContent = 'Add Flashcard';
        
        // Toggle this dropdown
        this.elements.flashcardList.classList.toggle('show');
        this.elements.editCardsBtn.textContent = this.elements.flashcardList.classList.contains('show')
            ? 'Hide ✏️Cards'
            : '✏️Cards';
            
        if (this.elements.flashcardList.classList.contains('show')) {
            setTimeout(() => this.adjustFlashcardListHeight(), 10);
        }
    }
    
    handleDataManageClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        this.elements.flashcardForm.classList.remove('show');
        this.elements.flashcardList.classList.remove('show');
        
        // Toggle the dropdown visibility
        this.elements.dataDropdown.classList.toggle('show');
        
        // Reset other buttons text
        this.elements.createCardBtn.textContent = 'Add Flashcard';
        this.elements.editCardsBtn.textContent = '✏️Cards';
    }

    handleNextButtonClick() {
        if (this.currentCards.length === 0) return;

        this.currentCardIndex = (this.currentCardIndex + 1) % this.currentCards.length;
        this.displayCard(this.currentCards[this.currentCardIndex]);
    }

    handleCollectionSelectChange() {
        // Get fresh collection data when switching
        this.loadCardsFromCollection(this.elements.collectionSelect.value);
        
        // Keep edit view in sync if it's visible
        if (this.elements.flashcardList.classList.contains('show')) {
            this.elements.editCollection.value = this.elements.collectionSelect.value;
            this.displayCardsForEdit(this.elements.collectionSelect.value);
        }
    }

    handleEditCollectionChange() {
        this.displayCardsForEdit(this.elements.editCollection.value);
    }

    handleFormCollectionChange() {
        const newCollectionDiv = document.getElementById('new-collection-div');
        if (this.elements.formCollection.value === 'new') {
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

                this.elements.formCollection.parentNode.insertAdjacentElement('afterend', div);
            } else {
                newCollectionDiv.style.display = 'block';
            }
        } else if (newCollectionDiv) {
            newCollectionDiv.style.display = 'none';
        }
    }

    handleCreateCardSubmit(e) {
        e.preventDefault();

        const questionInput = document.getElementById('question');
        const answerInput = document.getElementById('answer');
        let collectionName;

        if (this.elements.formCollection.value === 'new') {
            const newCollectionInput = document.getElementById('new-collection-name');
            if (newCollectionInput && newCollectionInput.value.trim()) {
                collectionName = newCollectionInput.value.trim();
            } else {
                alert("Please enter a name for your new collection");
                return;
            }
        } else {
            collectionName = this.elements.formCollection.value;
        }

        if (questionInput.value && answerInput.value) {
            const newCard = new Card(questionInput.value, answerInput.value, collectionName.toLowerCase());
            this.manager.addCard(newCard);

            // Update collections dropdowns
            this.populateCollections();
            
            // Update the edit cards view and show it if hidden
            this.elements.editCollection.value = collectionName;
            this.displayCardsForEdit(collectionName);
            
            // Update main card view
            if (this.elements.collectionSelect.value === 'all' || this.elements.collectionSelect.value === collectionName) {
                this.syncCurrentCardDisplay();
            }
            
            this.showMessage("Flashcard added successfully!");

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
                this.elements.flashcardForm.classList.remove('show');
                this.elements.createCardBtn.textContent = 'Add Flashcard';
            }, 2000);
        }
    }

    handleExport(e) {
        e.stopPropagation();

        const jsonData = this.manager.exportCards();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'flashcards.json';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.showMessage("Flashcards exported successfully!");
        this.elements.dataDropdown.classList.remove('show');
    }

    handleImport(e) {
        e.stopPropagation();

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        fileInput.click();
        this.elements.dataDropdown.classList.remove('show');
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        this.readAndImportFile(file);
    }

    readAndImportFile(file) {
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            this.showMessage("Please select a JSON file!", true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = e.target.result;
                this.manager.importCards(jsonData);

                // Update collections dropdown
                this.populateCollections();

                // Update the main card view
                this.elements.collectionSelect.value = 'all';
                this.loadCardsFromCollection('all');

                // Update the edit cards view
                this.elements.editCollection.value = 'all';
                this.displayCardsForEdit('all');
                
                // Show the edit cards section if it's hidden
                if (this.elements.flashcardList.style.display === 'none') {
                    this.elements.flashcardList.style.display = 'block';
                    this.elements.editCardsBtn.textContent = 'Hide ✏️Cards';
                }

                this.showMessage("Flashcards imported successfully!");
            } catch (error) {
                this.showMessage("Error importing flashcards: " + error.message, true);
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    handleDocumentClick(e) {
        // If clicking outside any of the dropdowns or their toggle buttons, close all dropdowns
        if (!this.elements.dataManageBtn.contains(e.target) && 
            !this.elements.dataDropdown.contains(e.target) && 
            !this.elements.createCardBtn.contains(e.target) && 
            !this.elements.flashcardForm.contains(e.target) &&
            !this.elements.editCardsBtn.contains(e.target) && 
            !this.elements.flashcardList.contains(e.target)) {
            
            this.closeAllDropdowns();
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
        }
    }

    handleWindowResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.elements.flashcardList.classList.contains('show')) {
                this.adjustFlashcardListHeight();
            }
        }, 100); // 100ms debounce
    }

    closeAllDropdowns() {
        this.elements.flashcardForm.classList.remove('show');
        this.elements.flashcardList.classList.remove('show');
        this.elements.dataDropdown.classList.remove('show');
        
        // Reset button texts
        this.elements.createCardBtn.textContent = 'Add Flashcard';
        this.elements.editCardsBtn.textContent = '✏️Cards';
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.elements.dropArea.classList.add('highlight');
    }

    unhighlight() {
        this.elements.dropArea.classList.remove('highlight');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];

        this.readAndImportFile(file);

        setTimeout(() => {
            this.elements.dataDropdown.classList.remove('show');
        }, 1000);
    }

    flipCard() {
        const card = this.elements.cardContainer.querySelector('.card');
        card.classList.toggle('flipped');
    }

    loadCardsFromCollection(collectionName) {
        if (collectionName === 'all') {
            this.currentCards = [...this.manager.cards];
        } else {
            this.currentCards = [...this.manager.getCardsByCollection(collectionName)];
        }

        this.currentCardIndex = 0;
        if (this.currentCards.length > 0) {
            this.displayCard(this.currentCards[this.currentCardIndex]);
        } else {
            this.displayEmptyState();
        }
        
        // Update collection info display
        this.updateCollectionInfoDisplay(collectionName);
    }

    displayCard(card) {
        const cardFront = this.elements.cardContainer.querySelector('.card-front p');
        const cardBack = this.elements.cardContainer.querySelector('.card-back p');

        cardFront.textContent = card.question;
        cardBack.textContent = card.answer;

        const cardElement = this.elements.cardContainer.querySelector('.card');
        cardElement.classList.remove('flipped');
    }

    displayEmptyState() {
        const cardFront = this.elements.cardContainer.querySelector('.card-front p');
        const cardBack = this.elements.cardContainer.querySelector('.card-back p');

        cardFront.textContent = "No flashcards available in this collection";
        cardBack.textContent = "Create new cards to study!";
    }

    syncCurrentCardDisplay() {
        const currentCollectionName = this.elements.collectionSelect.value;
        
        // First refresh the collection in case it was modified
        if (currentCollectionName !== 'all') {
            // Make sure we're viewing the latest version of the collection
            const collectionCards = this.manager.getCardsByCollection(currentCollectionName);
            
            // Reassign to ensure we have the latest version
            this.currentCards = [...collectionCards];
        } else {
            // For "all" cards, always get a fresh copy
            this.currentCards = [...this.manager.cards];
        }
        
        // If we have cards, but our index is now invalid, reset it
        if (this.currentCards.length > 0) {
            if (this.currentCardIndex >= this.currentCards.length) {
                this.currentCardIndex = 0;
            }
            
            // Display the current card
            this.displayCard(this.currentCards[this.currentCardIndex]);
        } else {
            // No cards to display
            this.displayEmptyState();
        }
        
        // Update collection info display
        this.updateCollectionInfoDisplay(currentCollectionName);
    }

    updateCollectionInfoDisplay(collectionName) {
        const cardCount = collectionName === 'all' ? 
            this.manager.cards.length : 
            (this.manager.collections[collectionName]?.cards.length || 0);
            
        // Update or create the collection info element
        let countDisplay = this.elements.cardContainer.querySelector('.collection-info');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.className = 'collection-info';
            this.elements.cardContainer.appendChild(countDisplay);
        }
        
        // Update the text content
        countDisplay.textContent = `${collectionName === 'all' ? 'All cards' : collectionName}: ${cardCount} cards`;
    }

    adjustFlashcardListHeight() {
        if (this.elements.flashcardList.classList.contains('show')) {
            const flashcardListRect = this.elements.flashcardList.getBoundingClientRect();
            const heading = this.elements.flashcardList.querySelector('h2');
            const formGroup = this.elements.flashcardList.querySelector('.form-group');
            
            const headingHeight = heading ? heading.offsetHeight : 0;
            const formGroupHeight = formGroup ? formGroup.offsetHeight : 0;
            
            // Calculate the available height, ensuring we have enough space
            const availableHeight = Math.max(
                300, // Minimum height
                flashcardListRect.height - headingHeight - formGroupHeight - 30 // 30px buffer
            );
            
            // Set the height of the cards container
            this.elements.flashcardListContainer.style.height = `${availableHeight}px`;
            
            // Ensure proper scrolling behaviors
            this.elements.flashcardListContainer.style.overflowY = 'auto';
            this.elements.flashcardListContainer.style.overflowX = 'hidden';
            
            // Scroll back to top to avoid any potential scroll positioning issues
            this.elements.flashcardListContainer.scrollTop = 0;
        }
    }

    displayCardsForEdit(collectionName) {
        this.elements.flashcardListContainer.innerHTML = '';

        let cardsToDisplay = [];
        if (collectionName === 'all') {
            cardsToDisplay = [...this.manager.cards];
        } else {
            cardsToDisplay = this.manager.getCardsByCollection(collectionName);
        }

        if (cardsToDisplay.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-collection-message';
            emptyMessage.textContent = 'No flashcards in this collection.';
            this.elements.flashcardListContainer.appendChild(emptyMessage);
            return;
        }

        cardsToDisplay.forEach((card, index) => {
            const cardElement = this.createEditableCardElement(card, index);
            this.elements.flashcardListContainer.appendChild(cardElement);
        });
        
        // Adjust the container height after cards are added
        if (this.elements.flashcardList.classList.contains('show')) {
            setTimeout(() => this.adjustFlashcardListHeight(), 10);
        }
    }

    createEditableCardElement(card, index) {
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
        Object.keys(this.manager.collections).forEach(collName => {
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
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            cardView.style.display = 'none';
            editForm.style.display = 'block';
        });

        // Cancel button functionality
        cancelButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            editForm.style.display = 'none';
            cardView.style.display = 'flex';
        });

        // Delete button functionality
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            if (confirm('Are you sure you want to delete this flashcard?')) {
                const cardIndex = parseInt(cardElement.dataset.index);
                
                // Get real index in the main cards array
                let realIndex = cardIndex;
                const currentCollection = this.elements.editCollection.value;
                
                if (currentCollection !== 'all') {
                    // Find the index in the main cards array
                    const card = this.manager.getCardsByCollection(currentCollection)[cardIndex];
                    realIndex = this.manager.cards.findIndex(c => 
                        c.question === card.question && 
                        c.answer === card.answer && 
                        c.collection === card.collection
                    );
                }
                
                if (this.manager.deleteCard(realIndex)) {
                    cardElement.remove();
                    
                    // Update the main card view
                    this.syncCurrentCardDisplay();
                    
                    this.showMessage("Flashcard deleted successfully!");
                    
                    // Refresh the edit cards view
                    this.displayCardsForEdit(currentCollection);
                    
                    // Check if no more cards left in this collection
                    if (this.elements.flashcardListContainer.children.length === 0) {
                        const emptyMessage = document.createElement('p');
                        emptyMessage.className = 'empty-collection-message';
                        emptyMessage.textContent = 'No flashcards in this collection.';
                        this.elements.flashcardListContainer.appendChild(emptyMessage);
                    }
                }
            }
        });

        // Submit form functionality
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            const cardIndex = parseInt(cardElement.dataset.index);
            
            // Get real index in the main cards array
            let realIndex = cardIndex;
            const currentEditCollection = this.elements.editCollection.value;
            
            if (currentEditCollection !== 'all') {
                // Find the index in the main cards array
                const collectionCards = this.manager.getCardsByCollection(currentEditCollection);
                if (cardIndex < collectionCards.length) {
                    const cardToUpdate = collectionCards[cardIndex];
                    
                    // Find the corresponding card in the main array
                    realIndex = this.manager.cards.findIndex(c => 
                        c.question === cardToUpdate.question && 
                        c.answer === cardToUpdate.answer && 
                        c.collection === cardToUpdate.collection
                    );
                }
            }
            
            if (realIndex >= 0 && realIndex < this.manager.cards.length) {
                // Store the original card info for comparison
                const originalCard = this.manager.cards[realIndex];
                
                // Create the updated card (ensuring lowercase collection name)
                const updatedCard = new Card(
                    questionInput.value,
                    answerInput.value,
                    collectionSelect.value.toLowerCase()
                );
                
                // Update the card in the manager
                if (this.manager.updateCard(realIndex, updatedCard)) {
                    // Update the card view
                    questionView.textContent = updatedCard.question;
                    answerView.textContent = updatedCard.answer;
                    collectionTag.textContent = updatedCard.collection;
                    
                    // Hide the edit form and show the card view
                    editForm.style.display = 'none';
                    cardView.style.display = 'flex';
                    
                    // Refresh the collections dropdown
                    this.populateCollections();
                    
                    // Update card display in the main view
                    this.syncCurrentCardDisplay();
                    
                    // If card moved to a different collection, refresh the edit view
                    if (originalCard.collection !== updatedCard.collection) {
                        // We need to redisplay the edit cards for the current filter
                        this.displayCardsForEdit(currentEditCollection);
                    }
                    
                    this.showMessage("Flashcard updated successfully!");
                }
            } else {
                this.showMessage("Error updating card: Card not found", true);
            }
        });

        return cardElement;
    }

    showMessage(message, isError = false) {
        this.elements.message.textContent = message;
        this.elements.message.style.color = isError ? "red" : "green";
        
        setTimeout(() => {
            this.elements.message.textContent = "";
        }, 3000);
    }

    populateCollections() {
        while (this.elements.collectionSelect.options.length > 2) {
            this.elements.collectionSelect.remove(2);
        }
        while (this.elements.editCollection.options.length > 2) {
            this.elements.editCollection.remove(2);
        }
        this.elements.formCollection.innerHTML = '';
        Object.keys(this.manager.collections).forEach(collectionName => {
            const option = document.createElement('option');
            option.value = collectionName;
            option.textContent = this.manager.collections[collectionName].name || collectionName;
            this.elements.collectionSelect.appendChild(option);
            this.elements.editCollection.appendChild(option.cloneNode(true));
            const formOption = document.createElement('option');
            formOption.value = collectionName;
            formOption.textContent = this.manager.collections[collectionName].name || collectionName;
            this.elements.formCollection.appendChild(formOption);
        });
        const newOption = document.createElement('option');
        newOption.value = "new";
        newOption.textContent = "Create New Collection";
        this.elements.formCollection.appendChild(newOption);
    }

    addResetOption() {
        const resetOption = document.createElement('div');
        resetOption.className = 'dropdown-item';
        resetOption.id = 'reset-option';
        resetOption.innerHTML = `
            <span>Reset Flashcards</span>
            <small>Clear all cards and restore defaults</small>
        `;
        this.elements.dataDropdown.appendChild(resetOption);
        resetOption.addEventListener('click', e => {
            e.stopPropagation();
            if (confirm('Are you sure you want to reset all flashcards? This will delete all your custom cards and restore the default set.')) {
                this.manager.clearLocalStorage();
                window.location.reload();
            }
        });
    }

    addCollectionInfoStyles() {
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
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const manager = new FlashcardManager();
    const ui = new UIManager(manager);
    ui.initialize();
});
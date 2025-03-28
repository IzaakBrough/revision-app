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

    exportCards() {
        return JSON.stringify(this.cards, null, 2);
    }

    importCards(json) {
        const importedCards = JSON.parse(json);
        importedCards.forEach(cardData => {
            const card = new Card(cardData.question, cardData.answer, cardData.collection);
            this.addCard(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const createCardBtn = document.getElementById('create-card-btn');
    const flashcardForm = document.getElementById('flashcard-form');
    const cardContainer = document.getElementById('card-container');
    const nextButton = document.getElementById('next-button');
    const collectionSelect = document.getElementById('collection-select');
    const formCollectionSelect = document.getElementById('form-collection');
    const createCardForm = document.getElementById('create-card-form');
    const messageDiv = document.getElementById('message');
    
    // Initialize the FlashcardManager
    const manager = new FlashcardManager();
    
    // Initialize with predefined cards
    cards.forEach(cardData => {
        const card = new Card(cardData.question, cardData.answer, cardData.collection);
        manager.addCard(card);
    });
    
    // Populate the collection dropdowns
    function populateCollections() {
        // Clear existing options except the first two (default and "All Cards") in main dropdown
        while (collectionSelect.options.length > 2) {
            collectionSelect.remove(2);
        }
        
        // Clear all options in the form dropdown
        formCollectionSelect.innerHTML = '';
        
        // Add collections from the manager
        Object.keys(manager.collections).forEach(collectionName => {
            // Add to main dropdown
            const option = document.createElement('option');
            option.value = collectionName;
            option.textContent = manager.collections[collectionName].name || collectionName;
            collectionSelect.appendChild(option);
            
            // Add to form dropdown
            const formOption = document.createElement('option');
            formOption.value = collectionName;
            formOption.textContent = manager.collections[collectionName].name || collectionName;
            formCollectionSelect.appendChild(formOption);
        });
        
        // Add option to create new collection
        const newOption = document.createElement('option');
        newOption.value = "new";
        newOption.textContent = "Create New Collection";
        formCollectionSelect.appendChild(newOption);
    }
    
    // Handle form collection selection change
    formCollectionSelect.addEventListener('change', function() {
        const newCollectionDiv = document.getElementById('new-collection-div');
        if (this.value === 'new') {
            // Show input for new collection name if it doesn't exist
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
            // Hide new collection input if it exists
            newCollectionDiv.style.display = 'none';
        }
    });
    
    populateCollections();
    
    // Current card state
    let currentCards = [];
    let currentCardIndex = 0;
    
    // Load cards from the selected collection
    function loadCardsFromCollection(collectionName) {
        if (collectionName === 'all') {
            currentCards = [...manager.cards];
        } else {
            currentCards = manager.getCardsByCollection(collectionName);
        }
        
        // Reset to first card
        currentCardIndex = 0;
        if (currentCards.length > 0) {
            displayCard(currentCards[currentCardIndex]);
        } else {
            displayEmptyState();
        }
    }
    
    // Display a card in the card container
    function displayCard(card) {
        const cardFront = cardContainer.querySelector('.card-front p');
        const cardBack = cardContainer.querySelector('.card-back p');
        
        cardFront.textContent = card.question;
        cardBack.textContent = card.answer;
        
        // Reset flip state
        const cardElement = cardContainer.querySelector('.card');
        cardElement.classList.remove('flipped');
    }
    
    // Display empty state when no cards are available
    function displayEmptyState() {
        const cardFront = cardContainer.querySelector('.card-front p');
        const cardBack = cardContainer.querySelector('.card-back p');
        
        cardFront.textContent = "No flashcards available in this collection";
        cardBack.textContent = "Create new cards to study!";
    }
    
    // Initially load all cards
    loadCardsFromCollection('programming');
    collectionSelect.value = 'programming';
    
    // Add click event listener to the create card button
    createCardBtn.addEventListener('click', function() {
        // Toggle the form visibility
        if (flashcardForm.style.display === 'none') {
            flashcardForm.style.display = 'block';
            createCardBtn.textContent = 'Hide Form';
        } else {
            flashcardForm.style.display = 'none';
            createCardBtn.textContent = 'Add Flashcard';
        }
    });
    
    // Add click event to flip the card
    cardContainer.addEventListener('click', function() {
        const card = cardContainer.querySelector('.card');
        card.classList.toggle('flipped');
    });
    
    // Handle next button click
    nextButton.addEventListener('click', function() {
        if (currentCards.length === 0) return;
        
        currentCardIndex = (currentCardIndex + 1) % currentCards.length;
        displayCard(currentCards[currentCardIndex]);
    });
    
    // Handle collection change
    collectionSelect.addEventListener('change', function() {
        loadCardsFromCollection(this.value);
    });
    
    // Handle form submission for new card
    createCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const questionInput = document.getElementById('question');
        const answerInput = document.getElementById('answer');
        let collectionName;
        
        // Determine collection from form inputs
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
            
            // Update the current cards if we're viewing the same collection
            if (collectionSelect.value === 'all' || collectionSelect.value === collectionName) {
                currentCards.push(newCard);
                // If this was the first card, display it
                if (currentCards.length === 1) {
                    displayCard(newCard);
                }
            }
            
            // Show success message
            messageDiv.textContent = "Flashcard added successfully!";
            messageDiv.style.color = "green";
            
            // Clear the form
            questionInput.value = "";
            answerInput.value = "";
            
            // Update collections dropdown
            populateCollections();
            
            // Update dropdown selection
            if (document.querySelector(`#collection-select option[value="${collectionName}"]`)) {
                collectionSelect.value = collectionName;
                loadCardsFromCollection(collectionName);
            }
            
            // Remove new collection field if it exists
            const newCollectionDiv = document.getElementById('new-collection-div');
            if (newCollectionDiv) {
                newCollectionDiv.remove();
            }
            
            // Hide form after 2 seconds
            setTimeout(() => {
                flashcardForm.style.display = 'none';
                createCardBtn.textContent = 'Add Flashcard';
                messageDiv.textContent = "";
            }, 2000);
        }
    });
});
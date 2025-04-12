document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const clearChatButton = document.getElementById('clear-chat');
    const settingsToggle = document.getElementById('settings-toggle');
    const aiSettings = document.getElementById('ai-settings');
    const subjectSelect = document.getElementById('subject-select');
    const difficultySelect = document.getElementById('difficulty-select');
    const topicButtons = document.querySelectorAll('.topic-button');
    
    // Sample responses based on topics/subjects
    const aiResponses = {
        general: {
            greeting: [
                "Hello! How can I help with your studies today?",
                "Hi there! What would you like to learn about?",
                "Welcome! What subject shall we explore today?"
            ],
            fallback: [
                "That's an interesting question. Let me help you explore that topic further.",
                "Great question! Let's break this down step by step.",
                "I'd be happy to help you understand this better."
            ]
        },
        math: {
            explain: [
                "In mathematics, this concept involves applying formulas and logical reasoning to solve problems.",
                "This mathematical principle is based on fundamental axioms that help us understand numerical relationships."
            ],
            example: [
                "Here's an example problem: If f(x) = 2x² + 3x - 5, calculate f(3).\n\nSolution: f(3) = 2(3)² + 3(3) - 5 = 2(9) + 9 - 5 = 18 + 9 - 5 = 22",
                "Consider this example: Finding the area of a circle with radius 4 cm.\n\nSolution: Area = πr² = π(4)² = 16π ≈ 50.27 square cm"
            ]
        },
        science: {
            explain: [
                "In science, this phenomenon occurs due to the interaction of various natural forces and elements.",
                "This scientific concept helps us understand how matter and energy behave under specific conditions."
            ],
            example: [
                "For example, when water reaches 100°C at standard pressure, it begins to boil and transform from liquid to gas phase.",
                "Consider photosynthesis: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂. Plants use carbon dioxide and water with sunlight energy to produce glucose and oxygen."
            ]
        },
        programming: {
            explain: [
                "This programming concept helps developers create more efficient and maintainable code through logical structures.",
                "In programming, this approach allows for better organization of data and operations."
            ],
            example: [
                "Here's a simple JavaScript function example:\n\n```javascript\nfunction calculateArea(radius) {\n  return Math.PI * radius * radius;\n}\n\nlet area = calculateArea(5);\nconsole.log(area); // Output: 78.54\n```",
                "Consider this Python example:\n\n```python\ndef is_palindrome(text):\n  cleaned = ''.join(char.lower() for char in text if char.isalnum())\n  return cleaned == cleaned[::-1]\n\nprint(is_palindrome('A man, a plan, a canal: Panama')) # Output: True\n```"
            ]
        }
    };
    
    // Topics for quick access
    const topics = {
        explain: "Can you explain ",
        quiz: "Quiz me on ",
        summarize: "Summarize the key points of ",
        example: "Show me an example of "
    };
    
    // Initialize chat
    let chatHistory = [];
    loadChatHistory();

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    clearChatButton.addEventListener('click', clearChat);
    settingsToggle.addEventListener('click', toggleSettings);
    
    // Setup topic buttons
    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            const topic = button.getAttribute('data-topic');
            if (topics[topic]) {
                chatInput.value = topics[topic];
                chatInput.focus();
            }
        });
    });
    
    // Functions
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Display user message
        addMessage(message, 'user');
        
        // Clear input field
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate AI response after a delay
        setTimeout(() => {
            removeTypingIndicator();
            const response = generateResponse(message);
            addMessage(response, 'ai');
            
            // Save chat history
            saveChatHistory();
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        // Check if the text contains code blocks
        if (text.includes('```')) {
            messageElement.innerHTML = formatCodeBlocks(text);
        } else {
            messageElement.textContent = text;
        }
        
        chatMessages.appendChild(messageElement);
        
        // Store message in history
        chatHistory.push({
            text,
            sender,
            timestamp: new Date().toISOString()
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function formatCodeBlocks(text) {
        // Split by code block markers
        const parts = text.split('```');
        let formatted = '';
        
        parts.forEach((part, index) => {
            if (index % 2 === 0) {
                // Regular text
                formatted += part;
            } else {
                // Code block
                const firstLineBreak = part.indexOf('\n');
                let language = '';
                let code = part;
                
                if (firstLineBreak > 0) {
                    language = part.substring(0, firstLineBreak).trim();
                    code = part.substring(firstLineBreak + 1);
                }
                
                formatted += `<pre><code class="language-${language}">${code}</code></pre>`;
            }
        });
        
        return formatted;
    }
    
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'ai-message', 'typing');
        typingElement.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('typing-dot');
            typingElement.appendChild(dot);
        }
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function generateResponse(message) {
        message = message.toLowerCase();
        const subject = subjectSelect.value;
        
        // Check if the message matches any patterns
        if (message.includes('hello') || message.includes('hi ') || message === 'hi') {
            return getRandomResponse(aiResponses.general.greeting);
        }
        
        // Check for subject-specific responses
        if (aiResponses[subject]) {
            // Check for topic-specific patterns
            if (message.includes('explain') || message.includes('what is') || message.includes('how does')) {
                if (aiResponses[subject].explain) {
                    return getRandomResponse(aiResponses[subject].explain);
                }
            }
            
            if (message.includes('example') || message.includes('show me')) {
                if (aiResponses[subject].example) {
                    return getRandomResponse(aiResponses[subject].example);
                }
            }
        }
        
        // Check for quiz patterns
        if (message.includes('quiz') || message.includes('test me')) {
            return generateQuizQuestion(subject);
        }
        
        // Check for summary patterns
        if (message.includes('summarize') || message.includes('summary')) {
            return generateSummary(subject, message);
        }
        
        // Fallback response
        return getRandomResponse(aiResponses.general.fallback) + 
               "\n\nYou can ask me to explain concepts, provide examples, quiz you on topics, or summarize information.";
    }
    
    function getRandomResponse(responses) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }
    
    function generateQuizQuestion(subject) {
        const questions = {
            general: [
                "What are the three main learning styles?\n\n(Hint: They relate to how people prefer to receive information)",
                "What technique involves reviewing material at increasing intervals over time?"
            ],
            math: [
                "If f(x) = 3x² - 4x + 2, what is f(2)?",
                "Solve for x: 2x + 5 = 13"
            ],
            science: [
                "What is the chemical formula for water?",
                "What is the process by which plants convert light energy into chemical energy?"
            ],
            programming: [
                "What does the acronym API stand for?",
                "In programming, what is a variable?"
            ],
            english: [
                "Identify the parts of speech in this sentence: 'The quick brown fox jumps over the lazy dog.'",
                "What is the difference between a simile and a metaphor?"
            ],
            history: [
                "In what year did World War II end?",
                "Who was the first president of the United States?"
            ]
        };
        
        if (questions[subject]) {
            return "Here's a quiz question for you:\n\n" + getRandomResponse(questions[subject]) + 
                   "\n\nType your answer, and I'll provide feedback!";
        } else {
            return "Here's a general knowledge question:\n\n" + getRandomResponse(questions.general) + 
                   "\n\nType your answer, and I'll provide feedback!";
        }
    }
    
    function generateSummary(subject, message) {
        const summaries = {
            general: "This topic covers fundamental principles and key concepts that form the basis for deeper understanding.",
            math: "This mathematical concept involves working with numbers, patterns, and relationships to solve problems and model real-world scenarios.",
            science: "This scientific concept explains natural phenomena through observation, experimentation, and theoretical analysis.",
            programming: "This programming concept provides structured approaches to designing software solutions that are efficient and maintainable.",
            english: "This literary concept helps analyze and understand texts through examining language, structure, and meaning.",
            history: "This historical event/period had significant impacts on society, politics, and culture, influencing developments that followed."
        };
        
        return `Summary of ${message.replace("summarize", "").replace("summary", "").trim() || "this concept"}:\n\n${summaries[subject] || summaries.general}\n\nWould you like me to elaborate on any specific aspect?`;
    }
    
    function clearChat() {
        if (confirm("Are you sure you want to clear the chat history?")) {
            // Keep only the first welcome message
            const welcomeMessage = chatMessages.firstElementChild;
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
            
            // Reset chat history
            chatHistory = [];
            if (welcomeMessage) {
                chatHistory.push({
                    text: welcomeMessage.textContent,
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                });
            }
            
            // Save updated history
            saveChatHistory();
        }
    }
    
    function toggleSettings() {
        if (aiSettings.style.display === 'block') {
            aiSettings.style.display = 'none';
        } else {
            aiSettings.style.display = 'block';
        }
    }
    
    function saveChatHistory() {
        try {
            localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }
    
    function loadChatHistory() {
        try {
            const saved = localStorage.getItem('aiChatHistory');
            if (saved) {
                chatHistory = JSON.parse(saved);
                
                // Only restore if we have history
                if (chatHistory.length > 0) {
                    // Clear default welcome message
                    chatMessages.innerHTML = '';
                    
                    // Restore messages
                    chatHistory.forEach(message => {
                        addMessage(message.text, message.sender);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            // If error loading, start fresh
            chatHistory = [];
            if (chatMessages.firstElementChild) {
                chatHistory.push({
                    text: chatMessages.firstElementChild.textContent,
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
});

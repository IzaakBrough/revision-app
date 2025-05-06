/**
 * Revision App - Specification Management
 * Main JavaScript file for the specification page
 * Last updated: May 6, 2025
 */

// Global variables
let topicNotesModal; // Modal for topic notes

/**
 * Specification class - Manages the specification data and operations
 */
class Specification {
    constructor() {
        this.specifications = [];
        this.loadFromLocalStorage();
    }
    
    /**
     * Load specifications from localStorage
     */
    loadFromLocalStorage() {
        const savedSpecs = localStorage.getItem('specifications');
        try {
            if (savedSpecs) {
                const parsedSpecs = JSON.parse(savedSpecs);
                // Make sure we have valid specifications data
                if (Array.isArray(parsedSpecs) && parsedSpecs.length > 0) {
                    this.specifications = parsedSpecs;
                    console.log('Loaded specifications from localStorage:', this.specifications.length);
                    return;
                }
            }
            
            // If we get here, either there's no saved data or it's invalid
            console.log('No valid specifications found in localStorage, loading from JSON file');
            this.loadFromJsonFile();
        } catch (error) {
            console.error('Error loading specifications from localStorage:', error);
            this.loadFromJsonFile();
        }
    }
    
    /**
     * Load specifications from JSON file
     */
    loadFromJsonFile() {
        fetch('revision-specifications.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load specifications file');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    this.specifications = data;
                    console.log('Loaded specifications from JSON file:', this.specifications.length);
                    this.saveToLocalStorage();
                } else {
                    throw new Error('Invalid data format in specifications file');
                }
            })
            .catch(error => {
                console.error('Error loading specifications from JSON file:', error);
                this.specifications = this.getDefaultSpecifications();
                this.saveToLocalStorage();
            });
    }
    
    /**
     * Save specifications to localStorage
     */
    saveToLocalStorage() {
        localStorage.setItem('specifications', JSON.stringify(this.specifications));
    }
    
    /**
     * Get default specifications (hardcoded for initial setup)
     */
    getDefaultSpecifications() {
        return [
            {
                id: 'comp-sci',
                name: 'A-level Computer Science Exams',
                level: 'a-level',
                link: 'https://www.ocr.org.uk/qualifications/as-and-a-level/computer-science-h046-h446-from-2015/',
                topics: [
                    {
                        id: 'systems-architecture',
                        name: '1.1 Systems Architecture',
                        description: 'The purpose of the CPU, Von Neumann architecture, CPU performance, and embedded systems.',
                        completed: false,
                        resources: [
                            { name: 'CPU Components PDF', url: '#' },
                            { name: 'Von Neumann Architecture Video', url: '#' }
                        ],
                        notes: '',
                        subtopics: [
                            {
                                id: 'cpu-components',
                                name: '1.1.1 CPU Components',
                                description: 'ALU, CU, Registers, Buses, and their functions.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'von-neumann',
                                name: '1.1.2 Von Neumann Architecture',
                                description: 'Fetch-decode-execute cycle and stored program concept.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'cpu-performance',
                                name: '1.1.3 CPU Performance',
                                description: 'Clock speed, cache size, number of cores, and their impact on performance.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'networks',
                        name: '1.4 Networks',
                        description: 'Types of networks, topologies, protocols, and security.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'network-types',
                                name: '1.4.1 Network Types',
                                description: 'LAN, WAN, PAN, network hardware.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'protocols',
                                name: '1.4.2 Protocols and Layers',
                                description: 'HTTP, TCP/IP, FTP, DNS.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'security',
                                name: '1.4.3 Network Security',
                                description: 'Authentication, encryption, firewall, MAC address filtering.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'algorithms-programming',
                        name: '2.2 Algorithms and Programming',
                        description: 'Computational thinking, standard algorithms, and programming techniques.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'thinking',
                                name: '2.2.1 Computational Thinking',
                                description: 'Abstraction, decomposition, algorithmic thinking.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'standard-algorithms',
                                name: '2.2.2 Standard Algorithms',
                                description: 'Sorting, searching, recursion.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'programming-techniques',
                                name: '2.2.3 Programming Techniques',
                                description: 'Variables, data structures, iteration, subroutines.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    }
                ]
            },
            {
                id: 'maths',
                name: 'A-level Mathematics Exams',
                level: 'a-level',
                link: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/mathematics-2017.html',
                topics: [
                    {
                        id: 'pure-mathematics',
                        name: 'Pure Mathematics',
                        description: 'Proof, algebra, functions, coordinate geometry, sequences, trigonometry, exponentials and logarithms, differentiation, integration, numerical methods.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'algebra-functions',
                                name: '1.1 Algebra and Functions',
                                description: 'Algebraic manipulation, equations, inequalities, and functions.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'coordinate-geometry',
                                name: '1.2 Coordinate Geometry',
                                description: 'Straight lines, circles, parametric equations.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'sequences-series',
                                name: '1.3 Sequences and Series',
                                description: 'Arithmetic and geometric sequences, binomial expansion.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'differentiation',
                                name: '1.4 Differentiation',
                                description: 'Rates of change, stationary points, applications.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'integration',
                                name: '1.5 Integration',
                                description: 'Definite and indefinite integration, applications.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'mechanics',
                        name: 'Mechanics',
                        description: 'Motion, forces, Newton\'s laws, moments.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'kinematics',
                                name: '2.1 Kinematics',
                                description: 'Displacement, velocity, acceleration.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'forces',
                                name: '2.2 Forces',
                                description: 'Types of forces and free body diagrams.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'newtons-laws',
                                name: '2.3 Newton\'s Laws',
                                description: 'Newton\'s three laws of motion.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'statistics',
                        name: 'Statistics',
                        description: 'Data handling, probability, statistical distributions, hypothesis testing.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'data',
                                name: '3.1 Data Collection',
                                description: 'Sampling methods, bias.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'probability',
                                name: '3.2 Probability',
                                description: 'Independent and dependent events.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'distributions',
                                name: '3.3 Distributions',
                                description: 'Binomial, normal distributions.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'hypothesis',
                                name: '3.4 Hypothesis Testing',
                                description: 'Formulating and testing hypotheses.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    }
                ]
            },
            {
                id: 'business',
                name: 'A-level Business Studies Exams',
                level: 'a-level',
                link: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/business-2015.html',
                topics: [
                    {
                        id: 'marketing-people',
                        name: 'Theme 1: Marketing and People',
                        description: 'Meeting customer needs, marketing mix, entrepreneurs and leaders.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'the-market',
                                name: '1.1 The Market',
                                description: 'Markets, demand and supply, price determination.',
                                completed: false,
                                notes: '',
                                subsubtopics: [
                                    {
                                        id: 'mass-niche-markets',
                                        name: 'a) Mass markets and niche markets',
                                        description: 'Defining and distinguishing between mass and niche markets.',
                                        completed: false,
                                        notes: ''
                                    },
                                    {
                                        id: 'dynamic-markets',
                                        name: 'b) Dynamic markets',
                                        description: 'Market growth, shrinkage, and technological change.',
                                        completed: false,
                                        notes: ''
                                    }
                                ]
                            },
                            {
                                id: 'market-research',
                                name: '1.2 Market Research',
                                description: 'Methods, uses and limitations of market research.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'marketing-mix',
                                name: '1.3 Marketing Mix',
                                description: 'Product, price, promotion, place.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'managing-people',
                                name: '1.4 Managing People',
                                description: 'Leadership, motivation, employer-employee relations.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'marketing-operations',
                        name: 'Marketing and Operations',
                        description: 'Marketing objectives, marketing strategies, market research, product portfolio, operational efficiency, quality management, inventory management.',
                        completed: false,
                        resources: [],
                        notes: ''
                    },
                    {
                        id: 'business-strategy',
                        name: 'Theme 3: Business Decisions and Strategy',
                        description: 'Business objectives, growth, decision-making techniques, competitiveness, and change management.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: []
                    },
                    {
                        id: 'global-business',
                        name: 'Theme 4: Global Business',
                        description: 'Globalisation, global markets and marketing, multinational corporations.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: []
                    }
                ]
            },
            {
                id: 'as-comp-sci',
                name: 'AS-Level: Computer Science',
                level: 'as-level',
                link: 'https://www.ocr.org.uk/qualifications/as-and-a-level/computer-science-h046-h446-from-2015/',
                topics: [
                    {
                        id: 'components',
                        name: '1.1 Components of a computer',
                        description: 'Structure and function of processors, input/output devices, main memory, secondary storage.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-cpu',
                                name: '1.1.1 CPU',
                                description: 'The fetch-execute cycle, registers.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-memory',
                                name: '1.1.2 Memory and Storage',
                                description: 'RAM, ROM, virtual memory.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-io-devices',
                                name: '1.1.3 Input/Output Devices',
                                description: 'Types and functions of I/O devices.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'systems-software',
                        name: '1.2 Systems software',
                        description: 'Operating systems, utility software, language translators.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-software',
                                name: '1.2.1 Software',
                                description: 'Types of software and their functions.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-os',
                                name: '1.2.2 Operating Systems',
                                description: 'Functions and components of OS.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-translators',
                                name: '1.2.3 Language Translators',
                                description: 'Compilers, interpreters, assemblers.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'as-algorithms',
                        name: '2.1 Algorithms and Problem Solving',
                        description: 'Introduction to algorithms and computational logic.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-comp-thinking',
                                name: '2.1.1 Computational Thinking',
                                description: 'Problem-solving, abstraction.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-flowcharts',
                                name: '2.1.2 Flowcharts and Pseudocode',
                                description: 'Basic control structures.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-algo',
                                name: '2.1.3 Standard Algorithms',
                                description: 'Linear search, bubble sort.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    }
                ]
            },
            {
                id: 'as-maths',
                name: 'AS-Level: Mathematics',
                level: 'as-level',
                link: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/mathematics-2017.html',
                topics: [
                    {
                        id: 'pure-mathematics',
                        name: 'Pure Mathematics',
                        description: 'Algebra and functions, coordinate geometry, sequences and series, differentiation, integration.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-algebra',
                                name: '1.1 Algebra',
                                description: 'Equations, inequalities, surds.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-trig',
                                name: '1.2 Trigonometry',
                                description: 'Basic identities and equations.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-calc',
                                name: '1.3 Calculus',
                                description: 'Differentiation and basic integration.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'statistics',
                        name: 'Statistics',
                        description: 'Statistical sampling, data presentation and interpretation, probability, statistical distributions.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-sampling',
                                name: '2.1 Sampling',
                                description: 'Techniques and data types.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-probability',
                                name: '2.2 Probability',
                                description: 'Basic rules and tree diagrams.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'as-mechanics',
                        name: 'Mechanics',
                        description: 'Forces, motion and Newton\'s Laws.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-motion',
                                name: '3.1 Kinematics',
                                description: 'Graphs of motion.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-newton',
                                name: '3.2 Newton\'s Laws',
                                description: 'Force diagrams and equilibrium.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    }
                ]
            },
            {
                id: 'as-business',
                name: 'AS-Level: Business Studies',
                level: 'as-level',
                link: 'https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/business-2015.html',
                topics: [
                    {
                        id: 'marketing-people',
                        name: 'Theme 1: Marketing and People',
                        description: 'Meeting customer needs, marketing mix and strategy, managing people, entrepreneurs and leaders.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-market',
                                name: '1.1 Meeting Customer Needs',
                                description: 'Market research and segmentation.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-strategy',
                                name: '1.2 Marketing Strategy',
                                description: 'Product, price, place, promotion.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-management',
                                name: '1.3 Managing People',
                                description: 'Motivation and leadership.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    },
                    {
                        id: 'managing-activities',
                        name: 'Theme 2: Managing Business Activities',
                        description: 'Raising finance, financial planning, managing finance, resource management, external influences.',
                        completed: false,
                        resources: [],
                        notes: '',
                        subtopics: [
                            {
                                id: 'as-raising-finance',
                                name: '2.1 Raising Finance',
                                description: 'Sources of finance.',
                                completed: false,
                                notes: ''
                            },
                            {
                                id: 'as-fin-planning',
                                name: '2.2 Financial Planning',
                                description: 'Cash flow and breakeven.',
                                completed: false,
                                notes: ''
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
    /**
     * Get specifications by level
     */
    getSpecificationsByLevel(level) {
        if (level === 'all') {
            return this.specifications;
        }
        return this.specifications.filter(spec => spec.level === level);
    }
    
    /**
     * Get specification by ID
     */
    getSpecificationById(id) {
        return this.specifications.find(spec => spec.id === id);
    }
    
    /**
     * Create a new specification
     */
    createSpecification(specData) {
        const newSpec = {
            id: this.createUniqueId(specData.name),
            name: specData.name,
            level: specData.level,
            link: specData.link,
            topics: []
        };
        this.specifications.push(newSpec);
        this.saveToLocalStorage();
        return newSpec.id;
    }
    
    /**
     * Delete a specification by ID
     */
    deleteSpecification(id) {
        this.specifications = this.specifications.filter(spec => spec.id !== id);
        this.saveToLocalStorage();
    }
    
    /**
     * Add a topic to a specification
     */
    addTopic(subjectId, topicData) {
        const subject = this.getSpecificationById(subjectId);
        if (!subject) return;
        
        const newTopic = {
            id: this.createUniqueId(topicData.name),
            name: topicData.name,
            description: topicData.description,
            completed: false,
            resources: this.parseResourceLinks(topicData.resources),
            notes: '',
            subtopics: []
        };
        subject.topics.push(newTopic);
        this.saveToLocalStorage();
    }
    
    /**
     * Get topic by ID
     */
    getTopic(subjectId, topicId) {
        const subject = this.getSpecificationById(subjectId);
        if (!subject) return null;
        return subject.topics.find(topic => topic.id === topicId);
    }
    
    /**
     * Get subtopic by ID
     */
    getSubtopic(subjectId, topicId, subtopicId) {
        const topic = this.getTopic(subjectId, topicId);
        if (!topic) return null;
        return topic.subtopics.find(subtopic => subtopic.id === subtopicId);
    }
    
    /**
     * Update topic status
     */
    updateTopicStatus(subjectId, topicId, completed) {
        const topic = this.getTopic(subjectId, topicId);
        if (!topic) return;
        
        topic.completed = completed;
        this.saveToLocalStorage();
    }
    
    /**
     * Update subtopic status
     */
    updateSubtopicStatus(subjectId, topicId, subtopicId, completed) {
        const subtopic = this.getSubtopic(subjectId, topicId, subtopicId);
        if (!subtopic) return;
        
        subtopic.completed = completed;
        this.saveToLocalStorage();
    }
    
    /**
     * Update subsubtopic status
     */
    updateSubsubtopicStatus(subjectId, topicId, subtopicId, subsubtopicId, completed) {
        const subtopic = this.getSubtopic(subjectId, topicId, subtopicId);
        if (!subtopic) return;
        
        const subsubtopic = subtopic.subsubtopics.find(subsubtopic => subsubtopic.id === subsubtopicId);
        if (!subsubtopic) return;
        
        subsubtopic.completed = completed;
        this.saveToLocalStorage();
    }
    
    /**
     * Calculate subject progress percentage
     */
    calculateSubjectProgress(subjectId) {
        const subject = this.getSpecificationById(subjectId);
        if (!subject) return 0;
        
        let totalItems = 0;
        let completedItems = 0;
        
        subject.topics.forEach(topic => {
            // Count topics with subtopics
            if (topic.subtopics && topic.subtopics.length > 0) {
                topic.subtopics.forEach(subtopic => {
                    totalItems++;
                    if (subtopic.completed) completedItems++;
                });
            } else {
                // Count topics without subtopics
                totalItems++;
                if (topic.completed) completedItems++;
            }
        });
        
        if (totalItems === 0) return 0;
        return Math.round((completedItems / totalItems) * 100);
    }
    
    /**
     * Calculate overall progress percentage across all specifications
     */
    calculateOverallProgress() {
        let totalItems = 0;
        let completedItems = 0;
        
        this.specifications.forEach(spec => {
            spec.topics.forEach(topic => {
                // Count topics with subtopics
                if (topic.subtopics && topic.subtopics.length > 0) {
                    topic.subtopics.forEach(subtopic => {
                        totalItems++;
                        if (subtopic.completed) completedItems++;
                    });
                } else {
                    // Count topics without subtopics
                    totalItems++;
                    if (topic.completed) completedItems++;
                }
            });
        });
        
        if (totalItems === 0) return 0;
        return Math.round((completedItems / totalItems) * 100);
    }
    
    /**
     * Parse resource links from string to array of objects
     */
    parseResourceLinks(resourcesStr) {
        if (!resourcesStr) return [];
        
        const lines = resourcesStr.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => {
            const parts = line.split('|');
            if (parts.length === 2) {
                return { name: parts[0].trim(), url: parts[1].trim() };
            } else {
                return { name: line.trim(), url: '#' };
            }
        });
    }
    
    /**
     * Create unique ID from a name
     */
    createUniqueId(name) {
        // Convert name to lowercase, replace spaces with hyphens
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            + '-' + Date.now().toString().slice(-4);
    }
    
    /**
     * Export specifications to JSON
     */
    exportSpecifications() {
        return JSON.stringify(this.specifications, null, 2);
    }
    
    /**
     * Import specifications from JSON
     */
    importSpecifications(jsonData) {
        try {
            const parsedData = JSON.parse(jsonData);
            
            // Basic validation
            if (!Array.isArray(parsedData)) {
                throw new Error('Invalid format: Expected an array');
            }
            
            // Replace current specifications with imported data
            this.specifications = parsedData;
            this.saveToLocalStorage();
            return true;
        } catch (err) {
            console.error('Error importing specifications:', err);
            return false;
        }
    }
}

/**
 * Notes class - Manages notes for topics
 */
class Notes {
    constructor(specificationManager) {
        this.specManager = specificationManager;
    }
    
    /**
     * Save notes for a topic
     */
    saveNotes(subjectId, topicId, notes) {
        const topic = this.specManager.getTopic(subjectId, topicId);
        if (!topic) return false;
        
        topic.notes = notes;
        this.specManager.saveToLocalStorage();
        return true;
    }
    
    /**
     * Get notes for a topic
     */
    getNotes(subjectId, topicId) {
        const topic = this.specManager.getTopic(subjectId, topicId);
        if (!topic) return '';
        
        return topic.notes;
    }
    
    /**
     * Delete notes for a topic
     */
    deleteNotes(subjectId, topicId) {
        return this.saveNotes(subjectId, topicId, '');
    }
    
    /**
     * Create modal for editing notes
     */
    createNotesModal(subjectId, topicId, topicName) {
        // Create modal container if it doesn't exist
        if (!document.getElementById('notes-modal')) {
            const modal = document.createElement('div');
            modal.id = 'notes-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modal-topic-title">Notes</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <textarea id="topic-notes-content" placeholder="Enter your notes here..."></textarea>
                    </div>
                    <div class="modal-footer">
                        <button id="save-notes-btn" class="action-button">Save Notes</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close when clicking outside the modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        const modal = document.getElementById('notes-modal');
        const titleElement = document.getElementById('modal-topic-title');
        const notesTextarea = document.getElementById('topic-notes-content');
        const saveButton = document.getElementById('save-notes-btn');
        
        // Update modal content
        titleElement.textContent = `Notes: ${topicName}`;
        notesTextarea.value = this.getNotes(subjectId, topicId);
        
        // Update save button handler
        saveButton.onclick = () => {
            this.saveNotes(subjectId, topicId, notesTextarea.value);
            modal.style.display = 'none';
            
            // Update UI to show notes indicator
            const topicElement = document.querySelector(`[data-subject="${subjectId}"][data-topic="${topicId}"]`).closest('.topic-item');
            let notesSection = topicElement.querySelector('.topic-notes');
            
            if (notesTextarea.value.trim() !== '') {
                // Create or update notes section
                if (!notesSection) {
                    const topicDetails = topicElement.querySelector('.topic-details');
                    notesSection = document.createElement('div');
                    notesSection.className = 'topic-notes';
                    notesSection.innerHTML = `
                        <h4>Notes:</h4>
                        <div class="notes-content"></div>
                    `;
                    topicDetails.appendChild(notesSection);
                }
                
                const notesContent = notesSection.querySelector('.notes-content');
                notesContent.textContent = notesTextarea.value;
            } else if (notesSection) {
                // Remove notes section if notes are empty
                notesSection.remove();
            }
        };
        
        // Display the modal
        modal.style.display = 'flex';
        return modal;
    }
}

/**
 * UI class - Manages UI interactions
 */
class UI {
    constructor() {
        this.specManager = new Specification();
        
        // DOM elements
        this.collectionSelect = document.getElementById('collection-select');
        this.specificationsContainer = document.getElementById('specifications');
        this.addTopicForm = document.getElementById('add-topic-form');
        this.specificationForm = document.getElementById('specification-form');
        this.settingsButton = document.getElementById('settings-btn');
        this.settingsDropdown = document.getElementById('settings');
        this.emptyState = document.getElementById('empty-state');
        this.addFirstTopicButton = document.getElementById('add-first-topic');
        
        // Initialize the UI
        this.init();
    }
    
    /**
     * Initialize the UI
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Check if specifications container exists
        if (!this.specificationsContainer) {
            console.error('Specifications container not found!');
            return;
        }
        
        // Log initial state
        console.log('Initializing UI with specifications:', this.specManager.specifications.length);
        
        // Render specifications
        this.renderSpecifications();
        
        // Update progress
        this.updateOverallProgress();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Level filter change
        this.collectionSelect.addEventListener('change', () => {
            this.renderSpecifications();
            this.updateOverallProgress(); // Update progress based on selected level
        });
        
        // Settings button click
        this.settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSettingsDropdown();
        });
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.settingsDropdown.contains(e.target) && e.target !== this.settingsButton) {
                this.settingsDropdown.classList.remove('show');
            }
        });
        
        // Add first topic button click
        this.addFirstTopicButton.addEventListener('click', () => {
            this.showSpecificationForm();
        });
        
        // Add topic form submission
        this.addTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTopicFormSubmit();
        });
        
        // Topic checkbox changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('topic-checkbox')) {
                const subjectId = e.target.dataset.subject;
                const topicId = e.target.dataset.topic;
                this.handleTopicStatusChange(subjectId, topicId, e.target.checked);
            } else if (e.target.classList.contains('subtopic-checkbox')) {
                const subjectId = e.target.dataset.subject;
                const topicId = e.target.dataset.topic;
                const subtopicId = e.target.dataset.subtopic;
                this.handleSubtopicStatusChange(subjectId, topicId, subtopicId, e.target.checked);
            } else if (e.target.classList.contains('subsubtopic-checkbox')) {
                const subjectId = e.target.dataset.subject;
                const topicId = e.target.dataset.topic;
                const subtopicId = e.target.dataset.subtopic;
                const subsubtopicId = e.target.dataset.subsubtopic;
                this.handleSubsubtopicStatusChange(subjectId, topicId, subtopicId, subsubtopicId, e.target.checked);
            }
        });
        
        // Topic header clicks
        document.addEventListener('click', (e) => {
            // Handle topic header clicks
            if (e.target.closest('.topic-header') && !e.target.classList.contains('topic-checkbox')) {
                const topicItem = e.target.closest('.topic-item');
                this.toggleTopicDetails(topicItem);
            }
            
            // Handle subtopic header clicks
            if (e.target.closest('.subtopic-header') && !e.target.classList.contains('subtopic-checkbox')) {
                const subtopicItem = e.target.closest('.subtopic-item');
                this.toggleSubtopicDetails(subtopicItem);
            }
            
            // Handle subject header clicks
            if (e.target.closest('.subject-header') && !e.target.closest('a')) {
                const subjectContainer = e.target.closest('.subject-container');
                this.toggleSubjectContent(subjectContainer);
            }
            
            // Handle add notes button clicks
            if (e.target.classList.contains('add-topic-notes')) {
                const topicItem = e.target.closest('.topic-item');
                const checkbox = topicItem.querySelector('.topic-checkbox');
                const subjectId = checkbox.dataset.subject;
                const topicId = checkbox.dataset.topic;
                const topicName = topicItem.querySelector('.topic-name').textContent;
                
                this.notesManager.createNotesModal(subjectId, topicId, topicName);
            }
        });
    }
    
    /**
     * Toggle settings dropdown visibility
     */
    toggleSettingsDropdown() {
        this.settingsDropdown.classList.toggle('show');
        
        // Populate settings dropdown content
        if (this.settingsDropdown.classList.contains('show')) {
            this.renderSettingsContent();
        }
    }
    
    /**
     * Show specification form
     */
    showSpecificationForm() {
        this.specificationForm.style.display = 'block';
    }
    
    /**
     * Hide specification form
     */
    hideSpecificationForm() {
        this.specificationForm.style.display = 'none';
        this.addTopicForm.reset();
    }
    
    /**
     * Handle add topic form submission
     */
    handleAddTopicFormSubmit() {
        const subjectElement = document.getElementById('subject');
        const topicNameElement = document.getElementById('topic-name');
        const topicDescriptionElement = document.getElementById('topic-description');
        const resourceLinksElement = document.getElementById('resource-links');
        
        const subjectName = subjectElement.value;
        const topicName = topicNameElement.value;
        const topicDescription = topicDescriptionElement.value;
        const resourceLinks = resourceLinksElement.value;
        
        // Find subject ID from name
        let subject = this.specManager.specifications.find(spec => spec.name === subjectName);
        
        // If subject doesn't exist, create it
        if (!subject) {
            const subjectId = this.specManager.createSpecification({
                name: subjectName,
                level: 'a-level', // Default level, should be made selectable in the form
                link: '#'
            });
            subject = this.specManager.getSpecificationById(subjectId);
        }
        
        // Add topic to subject
        this.specManager.addTopic(subject.id, {
            name: topicName,
            description: topicDescription,
            resources: resourceLinks
        });
        
        // Hide form and re-render
        this.hideSpecificationForm();
        this.renderSpecifications();
        this.updateOverallProgress();
        
        // Show success message
        this.showMessage('Topic added successfully!', 'success');
    }
    
    /**
     * Handle topic status change
     */
    handleTopicStatusChange(subjectId, topicId, completed) {
        // Update topic status
        this.specManager.updateTopicStatus(subjectId, topicId, completed);
        
        // Update UI checkboxes for subtopics if they exist
        const topicItem = document.querySelector(`.topic-checkbox[data-subject="${subjectId}"][data-topic="${topicId}"]`).closest('.topic-item');
        const subtopicCheckboxes = topicItem.querySelectorAll('.subtopic-checkbox');
        
        subtopicCheckboxes.forEach(checkbox => {
            checkbox.checked = completed;
        });
        
        // Also update subsubtopic checkboxes
        const subsubtopicCheckboxes = topicItem.querySelectorAll('.subsubtopic-checkbox');
        
        subsubtopicCheckboxes.forEach(checkbox => {
            checkbox.checked = completed;
        });
        
        // Update subject progress display
        this.updateSubjectProgress(subjectId);
        
        // Update overall progress
        this.updateOverallProgress();
    }
    
    /**
     * Handle subtopic status change
     */
    handleSubtopicStatusChange(subjectId, topicId, subtopicId, completed) {
        // Update subtopic status
        this.specManager.updateSubtopicStatus(subjectId, topicId, subtopicId, completed);
        
        // Update UI checkboxes for subsubtopics if they exist
        const subtopicItem = document.querySelector(`.subtopic-checkbox[data-subject="${subjectId}"][data-topic="${topicId}"][data-subtopic="${subtopicId}"]`).closest('.subtopic-item');
        const subsubtopicCheckboxes = subtopicItem.querySelectorAll('.subsubtopic-checkbox');
        
        subsubtopicCheckboxes.forEach(checkbox => {
            checkbox.checked = completed;
        });
        
        // Check if all subtopics are completed to update parent topic checkbox
        const topic = this.specManager.getTopic(subjectId, topicId);
        if (topic && topic.subtopics) {
            const allSubtopicsCompleted = topic.subtopics.every(subtopic => subtopic.completed);
            const topicCheckbox = document.querySelector(`.topic-checkbox[data-subject="${subjectId}"][data-topic="${topicId}"]`);
            if (topicCheckbox) {
                topicCheckbox.checked = allSubtopicsCompleted;
            }
        }
        
        // Update subject progress display
        this.updateSubjectProgress(subjectId);
        
        // Update overall progress
        this.updateOverallProgress();
    }
    
    /**
     * Handle subsubtopic status change
     */
    handleSubsubtopicStatusChange(subjectId, topicId, subtopicId, subsubtopicId, completed) {
        // Update subsubtopic status
        this.specManager.updateSubsubtopicStatus(subjectId, topicId, subtopicId, subsubtopicId, completed);
        
        // Check if all subsubtopics are completed to update parent subtopic checkbox
        const subtopic = this.specManager.getSubtopic(subjectId, topicId, subtopicId);
        if (subtopic && subtopic.subsubtopics) {
            const allSubsubtopicsCompleted = subtopic.subsubtopics.every(subsubtopic => subsubtopic.completed);
            const subtopicCheckbox = document.querySelector(`.subtopic-checkbox[data-subject="${subjectId}"][data-topic="${topicId}"][data-subtopic="${subtopicId}"]`);
            if (subtopicCheckbox) {
                subtopicCheckbox.checked = allSubsubtopicsCompleted;
            }
        }
        
        // Check if all subtopics are completed to update parent topic checkbox
        const topic = this.specManager.getTopic(subjectId, topicId);
        if (topic && topic.subtopics) {
            const allSubtopicsCompleted = topic.subtopics.every(subtopic => subtopic.completed);
            const topicCheckbox = document.querySelector(`.topic-checkbox[data-subject="${subjectId}"][data-topic="${topicId}"]`);
            if (topicCheckbox) {
                topicCheckbox.checked = allSubtopicsCompleted;
            }
        }
        
        // Update subject progress display
        this.updateSubjectProgress(subjectId);
        
        // Update overall progress
        this.updateOverallProgress();
    }
    
    /**
     * Toggle topic details visibility
     */
    toggleTopicDetails(topicItem) {
        const topicDetails = topicItem.querySelector('.topic-details');
        
        // Use display property instead of just toggling classes
        if (topicDetails.style.display === 'block') {
            topicDetails.style.display = 'none';
            topicItem.classList.remove('expanded');
        } else {
            topicDetails.style.display = 'block';
            topicItem.classList.add('expanded');
        }
    }
    
    /**
     * Toggle subtopic details visibility
     */
    toggleSubtopicDetails(subtopicItem) {
        const subtopicDetails = subtopicItem.querySelector('.subtopic-details');
        if (subtopicDetails) {
            subtopicDetails.classList.toggle('expanded');
            subtopicItem.classList.toggle('expanded');
        }
    }
    
    /**
     * Toggle subject content visibility
     */
    toggleSubjectContent(subjectContainer) {
        const subjectContent = subjectContainer.querySelector('.subject-content');
        subjectContent.classList.toggle('expanded');
    }
    
    /**
     * Render specifications based on selected level
     */
    renderSpecifications() {
        const selectedLevel = this.collectionSelect.value;
        const specifications = this.specManager.getSpecificationsByLevel(selectedLevel);
        
        // Clear existing content
        this.specificationsContainer.innerHTML = '';
        
        // Check if there are specifications to display
        if (specifications.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        // Render each specification
        specifications.forEach(spec => {
            const subjectContainer = document.createElement('div');
            subjectContainer.className = 'subject-container';
            
            // Calculate progress for this subject
            const progress = this.specManager.calculateSubjectProgress(spec.id);
            
            // Render subject header
            subjectContainer.innerHTML = `
                <div class="subject-header">
                    <h2><a href="${spec.link}" target="_blank">${spec.name}</a></h2>
                    <div class="subject-progress">
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${progress}%</div>
                    </div>
                </div>
                <div class="subject-content">
                    <ul class="topic-list"></ul>
                </div>
            `;
            
            // Add subjects to container
            this.specificationsContainer.appendChild(subjectContainer);
            
            // Get topic list element
            const topicList = subjectContainer.querySelector('.topic-list');
            
            // Render topics
            spec.topics.forEach(topic => {
                const topicItem = document.createElement('li');
                topicItem.className = 'topic-item';
                
                // Check if topic has subtopics
                const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
                const subtopicCount = hasSubtopics ? topic.subtopics.length : 0;
                
                // Create topic header
                const topicHeader = `
                    <div class="topic-header">
                        <div class="topic-name">${topic.name}</div>
                        <div class="topic-status">
                            ${hasSubtopics ? `<span class="subtopic-count">${subtopicCount} subtopics</span>` : ''}
                            <input type="checkbox" class="topic-checkbox" 
                                data-subject="${spec.id}" data-topic="${topic.id}" 
                                ${topic.completed ? 'checked' : ''}>
                        </div>
                    </div>
                `;
                
                // Create base topic details
                let topicDetails = `
                    <div class="topic-details">
                        <p class="topic-description">${topic.description}</p>
                        ${this.renderTopicResources(topic.resources)}
                `;
                
                // Add subtopics if they exist
                if (hasSubtopics) {
                    topicDetails += `
                        <div class="subtopics-container">
                            <h4>Subtopics:</h4>
                            <ul class="subtopic-list">
                    `;
                    
                    topic.subtopics.forEach(subtopic => {
                        // Check if subtopic has subsubtopics
                        const hasSubsubtopics = subtopic.subsubtopics && subtopic.subsubtopics.length > 0;
                        
                        topicDetails += `
                            <li class="subtopic-item">
                                <div class="subtopic-header">
                                    <div class="subtopic-name">${subtopic.name}</div>
                                    <div class="subtopic-status">
                                        <input type="checkbox" class="subtopic-checkbox" 
                                            data-subject="${spec.id}" 
                                            data-topic="${topic.id}" 
                                            data-subtopic="${subtopic.id}" 
                                            ${subtopic.completed ? 'checked' : ''}>
                                    </div>
                                </div>
                        `;
                        
                        // Add subsubtopics if they exist
                        if (hasSubsubtopics) {
                            topicDetails += `
                                <div class="subtopic-details">
                                    <ul class="subsubtopic-list">
                            `;
                            
                            subtopic.subsubtopics.forEach(subsubtopic => {
                                topicDetails += `
                                    <li class="subsubtopic-item">
                                        <div class="subsubtopic-header">
                                            <div class="subsubtopic-name">${subsubtopic.name}</div>
                                            <div class="subsubtopic-status">
                                                <input type="checkbox" class="subsubtopic-checkbox" 
                                                    data-subject="${spec.id}" 
                                                    data-topic="${topic.id}" 
                                                    data-subtopic="${subtopic.id}" 
                                                    data-subsubtopic="${subsubtopic.id}" 
                                                    ${subsubtopic.completed ? 'checked' : ''}>
                                            </div>
                                        </div>
                                    </li>
                                `;
                            });
                            
                            topicDetails += `
                                    </ul>
                                </div>
                            `;
                        }
                        
                        topicDetails += `</li>`;
                    });
                    
                    topicDetails += `
                            </ul>
                        </div>
                    `;
                }
                
                // Close topic details
                topicDetails += `</div>`;
                
                // Combine topic header and details
                topicItem.innerHTML = topicHeader + topicDetails;
                
                // Add topic to list
                topicList.appendChild(topicItem);
                
                // Add notes section if there are notes
                if (topic.notes && topic.notes.trim() !== '') {
                    const topicDetailsElement = topicItem.querySelector('.topic-details');
                    const notesSection = document.createElement('div');
                    notesSection.className = 'topic-notes';
                    notesSection.innerHTML = `
                        <h4>Notes:</h4>
                        <div class="notes-content">${topic.notes}</div>
                    `;
                    topicDetailsElement.appendChild(notesSection);
                }
            });
        });
    }
    
    /**
     * Render topic resources
     */
    renderTopicResources(resources) {
        if (!resources || resources.length === 0) {
            return '';
        }
        
        let resourcesHtml = `
            <div class="topic-resources">
                <h4>Resources:</h4>
                <ul class="resources-list">
        `;
        
        resources.forEach(resource => {
            resourcesHtml += `
                <li><a href="${resource.url}" target="_blank">${resource.name}</a></li>
            `;
        });
        
        resourcesHtml += `
                </ul>
            </div>
        `;
        
        return resourcesHtml;
    }
    
    /**
     * Render settings dropdown content
     */
    renderSettingsContent() {
        // Create container for specification settings
        const container = document.createElement('div');
        
        // Add export/import section
        container.innerHTML = `
            <h2>Specification Management</h2>
            <div class="export-import-container">
                <button id="export-specs-btn" class="settings-button">Export</button>
                <button id="import-specs-btn" class="settings-button">Import</button>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            </div>
            <div class="form-group">
                <button id="create-subject-btn" class="action-button">Create New Subject</button>
            </div>
            <div id="subjects-list" class="edit-list">
                <!-- Subject list will be populated here -->
            </div>
        `;
        
        // Replace existing content
        this.settingsDropdown.innerHTML = '';
        this.settingsDropdown.appendChild(container);
        
        // Populate subject list
        const subjectsList = document.getElementById('subjects-list');
        this.specManager.specifications.forEach(spec => {
            const subjectItem = document.createElement('div');
            subjectItem.className = 'edit-item';
            subjectItem.innerHTML = `
                <span>${spec.name}</span>
                <div class="edit-buttons">
                    <button class="edit-btn" data-subject-id="${spec.id}">Edit</button>
                    <button class="delete-btn" data-subject-id="${spec.id}">Delete</button>
                </div>
            `;
            subjectsList.appendChild(subjectItem);
        });
        
        // Add event listeners for settings buttons
        this.setupSettingsEventListeners();
    }
    
    /**
     * Set up event listeners for settings options
     */
    setupSettingsEventListeners() {
        // Export button
        const exportBtn = document.getElementById('export-specs-btn');
        exportBtn.addEventListener('click', () => {
            this.exportSpecifications();
        });
        
        // Import button
        const importBtn = document.getElementById('import-specs-btn');
        const importFile = document.getElementById('import-file');
        
        importBtn.addEventListener('click', () => {
            importFile.click();
        });
        
        importFile.addEventListener('change', (event) => {
            this.importSpecifications(event.target.files[0]);
        });
        
        // Create subject button
        const createSubjectBtn = document.getElementById('create-subject-btn');
        createSubjectBtn.addEventListener('click', () => {
            this.showCreateSubjectModal();
        });
        
        // Edit and delete subject buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const subjectId = btn.dataset.subjectId;
                this.showEditSubjectModal(subjectId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const subjectId = btn.dataset.subjectId;
                this.confirmDeleteSubject(subjectId);
            });
        });
    }
    
    /**
     * Export specifications
     */
    exportSpecifications() {
        const jsonData = this.specManager.exportSpecifications();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = 'revision-specifications.json';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
    
    /**
     * Import specifications from file
     */
    importSpecifications(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonData = e.target.result;
            const success = this.specManager.importSpecifications(jsonData);
            
            if (success) {
                this.showMessage('Specifications imported successfully!', 'success');
                this.renderSpecifications();
                this.updateOverallProgress();
                this.settingsDropdown.classList.remove('show');
            } else {
                this.showMessage('Failed to import specifications. Invalid format.', 'error');
            }
        };
        
        reader.readAsText(file);
    }
    
    /**
     * Show create subject modal
     */
    showCreateSubjectModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('subject-modal')) {
            const modal = document.createElement('div');
            modal.id = 'subject-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="subject-modal-title">Create New Subject</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="subject-form">
                            <div class="form-group">
                                <label for="subject-name">Subject Name:</label>
                                <input type="text" id="subject-name" required>
                            </div>
                            <div class="form-group">
                                <label for="subject-level">Level:</label>
                                <select id="subject-level" required>
                                    <option value="a-level">A-Level</option>
                                    <option value="as-level">AS-Level</option>
                                    <option value="gcse">GCSE</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="subject-link">Resource Link (optional):</label>
                                <input type="url" id="subject-link" placeholder="https://example.com">
                            </div>
                            <input type="hidden" id="subject-id">
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="save-subject-btn" class="action-button">Save Subject</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close when clicking outside the modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Save button event listener
            const saveBtn = document.getElementById('save-subject-btn');
            saveBtn.addEventListener('click', () => {
                this.handleSaveSubject();
            });
        }
        
        // Update modal for creating a new subject
        const modal = document.getElementById('subject-modal');
        const titleElement = document.getElementById('subject-modal-title');
        const subjectIdInput = document.getElementById('subject-id');
        const subjectNameInput = document.getElementById('subject-name');
        const subjectLevelSelect = document.getElementById('subject-level');
        const subjectLinkInput = document.getElementById('subject-link');
        
        titleElement.textContent = 'Create New Subject';
        subjectIdInput.value = '';
        subjectNameInput.value = '';
        subjectLevelSelect.value = 'a-level';
        subjectLinkInput.value = '';
        
        // Display the modal
        modal.style.display = 'flex';
    }
    
    /**
     * Show edit subject modal
     */
    showEditSubjectModal(subjectId) {
        const subject = this.specManager.getSpecificationById(subjectId);
        if (!subject) return;
        
        // Ensure modal exists
        this.showCreateSubjectModal();
        
        // Update modal content for editing
        const modal = document.getElementById('subject-modal');
        const titleElement = document.getElementById('subject-modal-title');
        const subjectIdInput = document.getElementById('subject-id');
        const subjectNameInput = document.getElementById('subject-name');
        const subjectLevelSelect = document.getElementById('subject-level');
        const subjectLinkInput = document.getElementById('subject-link');
        
        titleElement.textContent = 'Edit Subject';
        subjectIdInput.value = subject.id;
        subjectNameInput.value = subject.name;
        subjectLevelSelect.value = subject.level;
        subjectLinkInput.value = subject.link || '';
        
        // Display the modal
        modal.style.display = 'flex';
    }
    
    /**
     * Handle saving subject (create or update)
     */
    handleSaveSubject() {
        const subjectIdInput = document.getElementById('subject-id');
        const subjectNameInput = document.getElementById('subject-name');
        const subjectLevelSelect = document.getElementById('subject-level');
        const subjectLinkInput = document.getElementById('subject-link');
        
        const subjectId = subjectIdInput.value;
        const subjectName = subjectNameInput.value;
        const subjectLevel = subjectLevelSelect.value;
        const subjectLink = subjectLinkInput.value || '#';
        
        if (!subjectName) {
            this.showMessage('Subject name is required', 'error');
            return;
        }
        
        if (subjectId) {
            // Update existing subject
            const subject = this.specManager.getSpecificationById(subjectId);
            if (subject) {
                subject.name = subjectName;
                subject.level = subjectLevel;
                subject.link = subjectLink;
                this.specManager.saveToLocalStorage();
            }
        } else {
            // Create new subject
            this.specManager.createSpecification({
                name: subjectName,
                level: subjectLevel,
                link: subjectLink
            });
        }
        
        // Close modal
        const modal = document.getElementById('subject-modal');
        modal.style.display = 'none';
        
        // Update UI
        this.renderSettingsContent();
        this.renderSpecifications();
        this.updateOverallProgress();
        
        // Show success message
        this.showMessage(`Subject ${subjectId ? 'updated' : 'created'} successfully!`, 'success');
    }
    
    /**
     * Confirm delete subject
     */
    confirmDeleteSubject(subjectId) {
        const subject = this.specManager.getSpecificationById(subjectId);
        if (!subject) return;
        
        if (confirm(`Are you sure you want to delete the subject "${subject.name}" and all its topics?`)) {
            this.specManager.deleteSpecification(subjectId);
            
            // Update UI
            this.renderSettingsContent();
            this.renderSpecifications();
            this.updateOverallProgress();
            
            // Show success message
            this.showMessage('Subject deleted successfully!', 'success');
        }
    }
    
    /**
     * Update subject progress display
     */
    updateSubjectProgress(subjectId) {
        const progress = this.specManager.calculateSubjectProgress(subjectId);
        const subjectContainers = document.querySelectorAll(`.subject-container`);
        
        subjectContainers.forEach(container => {
            const topicCheckboxes = container.querySelectorAll(`.topic-checkbox[data-subject="${subjectId}"]`);
            if (topicCheckboxes.length > 0) {
                const progressBar = container.querySelector('.progress-bar');
                const progressText = container.querySelector('.progress-text');
                
                if (progressBar && progressText) {
                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${progress}%`;
                }
            }
        });
    }
    
    /**
     * Update overall progress display
     */
    updateOverallProgress() {
        const selectedLevel = this.collectionSelect.value;
        let progress;
        
        if (selectedLevel === 'all') {
            progress = this.specManager.calculateOverallProgress();
        } else {
            progress = this.specManager.calculateLevelProgress(selectedLevel);
        }
        
        const progressBar = document.getElementById('overall-progress');
        const progressText = document.getElementById('progress-percentage');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = progress;
    }
    
    /**
     * Show message
     */
    showMessage(message, type = 'success') {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = type === 'error' ? 'error-message' : 'success-message';
        
        // Show message
        messageElement.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
});
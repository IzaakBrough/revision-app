document.addEventListener('DOMContentLoaded', function() {
    // Subject resources data
    const resources = {
        'comp-sci': [
            {
                icon: 'fas fa-laptop',
                title: 'Ada computer science',
                description: 'A comprehensive resource for A-Level Computer Science, including past papers, mark schemes, and revision notes.',
                url: 'https://www.adacomputerscience.org/'
            },
            {
                icon: 'fas fa-book-open',
                title: 'Physics & Maths Tutor (PMT)',
                description: 'Comprehensive revision materials including past papers, mark schemes and revision notes for OCR A-Level Computer Science.',
                url: 'https://www.physicsandmathstutor.com/computer-science-revision/a-level-ocr/'
            },
            {
                icon: 'fas fa-laptop-code',
                title: 'Isaac Computer Science',
                description: 'Free online platform with high-quality learning materials for A-Level Computer Science students.',
                url: 'https://isaaccomputerscience.org/'
            },
            {
                icon: 'fab fa-youtube',
                title: 'Craig \'n\' Dave',
                description: 'YouTube channel with excellent video tutorials covering the entire Computer Science A-Level syllabus.',
                url: 'https://www.youtube.com/c/craigndave'
            },
            {
                icon: 'fas fa-chalkboard-teacher',
                title: '101 Computing',
                description: 'A resource for teachers and students with a focus on practical programming skills and theory.',
                url: 'https://www.101computing.net/ocr-h446-computer-science-a-level/'
            },
            {
                icon: 'fas fa-code',
                title: 'Teach Computer Science',
                description: 'Comprehensive resources covering all aspects of Computer Science curricula.',
                url: 'https://teachcomputerscience.com/a-level/'
            }
        ],
        'maths': [
            {
                icon: 'fas fa-calculator',
                title: 'MathsGenie',
                description: 'Free GCSE and A-Level mathematics revision resources including past papers, mark schemes and model solutions.',
                url: 'https://www.mathsgenie.co.uk/'
            },
            {
                icon: 'fas fa-square-root-alt',
                title: 'ExamSolutions',
                description: 'Video tutorials and papers for mathematics revision at different levels.',
                url: 'https://app.examsolutions.net/courses/A2%20Pure?tab=overview&useWpRedirect=true&examBoard=Edexcel'
            },
            {
                icon: 'fas fa-book',
                title: 'Physics & Maths Tutor (PMT)',
                description: 'Comprehensive maths revision resources including notes, past papers and mark schemes.',
                url: 'https://www.physicsandmathstutor.com/maths-revision/'
            },
            {
                icon: 'fas fa-infinity',
                title: 'Dr. Frost Maths',
                description: 'Collection of resources and worksheets for all levels of mathematics.',
                url: 'https://www.drfrostmaths.com/'
            },
            {
                icon: 'fab fa-youtube',
                title: 'HegartyMaths',
                description: 'Interactive video lessons and quizzes covering all maths topics from KS3 to A-Level.',
                url: 'https://hegartymaths.com/'
            },
            {
                icon: 'fas fa-graduation-cap',
                title: 'madasmaths',
                description: 'Free Resources for Students and Teachers of Mathematics.',
                url: 'https://www.madasmaths.com/'
            }

        ],
        'business': [
            {
                icon: 'fas fa-chart-line',
                title: 'Tutor2u Business',
                description: 'Leading provider of Business Studies teaching resources and revision materials.',
                url: 'https://www.tutor2u.net/business/store/revision-guides'
            },
            {
                icon: 'fas fa-book',
                title: 'Business Studies Notes',
                description: 'Comprehensive revision notes for A-Level Business Studies students.',
                url: 'https://www.savemyexams.com/a-level/business/edexcel/17/revision-notes/'
            },
            {
                icon: 'fas fa-briefcase',
                title: 'Business Case Studies',
                description: 'Real business case studies for students to analyze and learn from.',
                url: 'https://businesscasestudies.co.uk/'
            },
            {
                icon: 'fab fa-youtube',
                title: 'TakingTheBiz',
                description: 'YouTube channel with tutorials covering the Business Studies curriculum.',
                url: 'https://www.youtube.com/c/takingthebiz'
            },
            {
                icon: 'fas fa-chart-pie',
                title: 'BBC Business',
                description: 'Latest business news and analysis from the BBC.',
                url: 'https://www.bbc.co.uk/news/business'
            },
            {
                icon: 'fas fa-newspaper',
                title: 'The Financial Times',
                description: 'Current business news and analysis to support studies with real-world examples.',
                url: 'https://www.ft.com/'
            }
        ]

    };

    // Get the select element
    const subjectSelect = document.getElementById('collection-select');
    const resourcesContainer = document.querySelector('.resources-container');

    // Function to create a resource card
    function createResourceCard(resource) {
        return `
            <div class="resource-card" onclick="window.open('${resource.url}', '_blank')">
                <div class="resource-icon"><i class="${resource.icon}"></i></div>
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <a href="${resource.url}" class="resource-link" target="_blank">Visit Resource</a>
            </div>
        `;
    }

    // Function to update resources based on selected subject
    function updateResources() {
        const selectedSubject = subjectSelect.value;
        const subjectResources = resources[selectedSubject];
        
        // Clear existing resources
        resourcesContainer.innerHTML = '';
        
        // Add new resources
        if (subjectResources) {
            subjectResources.forEach(resource => {
                resourcesContainer.innerHTML += createResourceCard(resource);
            });
        }
    }

    // Listen for changes on the select element
    subjectSelect.addEventListener('change', updateResources);

    updateResources();
});

const portfolioData = {
    "profile": {
        "name": "Mohammed",
        "lastName": "Isham",
        "subtitle": "",
        "description": "A lone coder looking to break into the competitive tech industry. Not just someone who codes—I'm a builder with a wide range of skills ready to apply. Containers? HDFS? Building Android apps? Just name it, and I'll give it my best shot. I'm a fresher who knows a lot and is hungry to learn even more.",
        "email": "ishammohammedper10@gmail.com",
        "phone": "+91 8088653147",
        "social": {
            "github": "https://github.com/Dexterisham",
            "linkedin": "https://www.linkedin.com/in/mohammed-isham-6b6274208"
        }
    },
    "experience": [
        {
            "role": "Intern/Developer",
            "company": "Abhimo Technologies",
            "date": "Dec 2024 - Feb 2025",
            "details": [
                "Developed mock UI for corporate bank applications using React, modernizing the user interface and improving user experience.",
                "Assisted in database migration from Oracle SQL to MySQL, ensuring data integrity and optimizing query performance.",
                "Collaborated with the development team to implement responsive design patterns for banking applications."
            ]
        }
    ],
    "education": [
        {
            "degree": "Master of Computer Application",
            "school": "Mangalore Institute of Technology and Engineering, Badaga Mijar",
            "date": "Feb 2024 - Oct 2025",
            "grade": "CGPA: 8.07"
        },
        {
            "degree": "Bachelors of Computer Application",
            "school": "Vijaya College, Mulki",
            "date": "June 2020 - Aug 2023",
            "grade": "CGPA: 7.16"
        }
    ],
    "skills": {
        "languages": [
            "C",
            "C++",
            "Java",
            "JavaScript",
            "Python"
        ],
        "web": [
            "MERN Stack",
            "React",
            "HTML/CSS"
        ],
        "tools": [
            "Unity",
            "Godot",
            "Android Studio",
            "Hadoop",
            "Git",
            "Docker"
        ]
    },
    "projects": [
        {
            "title": "Branch LLM",
            "description": "Developed a local branching memory interface for exploratory AI conversations, enabling users to fork conversation branches while preserving context.",
            "tags": [
                "AI",
                "LLM",
                "Research"
            ],
            "details": "<strong>Focus:</strong> Explored context compression techniques to optimize token usage in branched conversations."
        },
        {
            "title": "File Organizer",
            "description": "Designed a Python-based tool to automatically organize and categorize files in a directory based on file type, size, or custom rules.",
            "tags": [
                "Python",
                "Automation",
                "Tool"
            ],
            "details": "Implemented features to reduce manual file management effort, improving productivity and directory cleanliness."
        },
        {
            "title": "SiteSentinel",
            "description": "Developed a browser extension to retrieve and save URLs of visited pages.",
            "tags": [
                "Browser Extension",
                "JavaScript",
                "Privacy"
            ],
            "details": "Implemented features to enhance user experience, such as a timer and tab blurring."
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
}
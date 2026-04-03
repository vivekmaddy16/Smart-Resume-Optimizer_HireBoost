// Quick test to verify LaTeX output
const { generateLaTeX } = require('./server/services/latexGenerator');

const sampleResume = `Vivek Maddheshiya
Email: vivekmaddheshiya19@gmail.com
Github: github.com/vivekmaddy16 Mobile: +91-7237900686

Professional Summary
LinkedIn: linkedin.com/in/vivekm007 Third-year B.Tech Computer Science student with strong foundations in data structures, algorithms, and object-oriented programming. Hands-on experience in designing, developing, and optimizing scalable web applications through academic and personal projects. Passionate about learning new technologies and contributing to reliable, high-quality software in collaborative team environments.

Education
• BBD University Lucknow, India
B.Tech in Computer Science; CGPA: 7.89 2023 - Present
• Board of High School and Intermediate Education Uttar Pradesh
Intermediate (Class XII); 73.4% 2022
• Board of High School and Intermediate Education Uttar Pradesh
High School (Class X); 69% 2020

Technical Skills
• Programming Languages: C++, Java, Python, SQL
• Web Technologies: HTML5, CSS3, JavaScript
• CS Fundamentals: Data Structures, Algorithms, OOPs, DBMS, OS Basics
• Tools: Git, React, React Router DOM, TanStack Query

Projects
Smart Resume Optimizer (HireBoost) - React, Node.js, Gemini API
- Developed an AI-powered platform to optimize resumes according to job descriptions
- Implemented keyword extraction and ATS scoring to enhance resume-job alignment
- Automated content rewriting to generate achievement-oriented bullet points using AI
Wedding Planner Website - HTML, CSS, JavaScript
- Built a responsive web application for seamless cross-device experience
- Designed interactive UI with animations and dynamic sliders to improve user engagement
- Enhanced usability through intuitive navigation and visually appealing layouts

Relevant Coursework
Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Software Engineering.

Certifications
MongoDB Developer's Toolkit
Tata Group - Data Visualisation
J.P. Morgan Software Engineering Simulation
Walmart USA Advanced Software Engineering
Udemy - C++ Programming: Beginner to Advanced

Additional Information
Strong time management skills, quick learner, comfortable working in collaborative engineering teams.`;

const latex = generateLaTeX({ resumeText: sampleResume }, 'professional');
console.log(latex);

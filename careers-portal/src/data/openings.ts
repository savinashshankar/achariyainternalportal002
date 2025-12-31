export interface Opening {
    id: string;
    category: 'School' | 'College' | 'Corporate';
    roleTitle: string;
    department: string;
    location: string;
    description: string;
    responsibilities: string[];
    eligibility: string[];
}

export const mockOpenings: Opening[] = [
    // School Openings
    {
        id: 'SCH001',
        category: 'School',
        roleTitle: 'Primary Teacher (English)',
        department: 'Primary Education',
        location: 'Bangalore',
        description: 'Seeking an enthusiastic Primary English Teacher to inspire young learners and develop foundational language skills.',
        responsibilities: [
            'Plan and deliver engaging English lessons for primary students',
            'Assess student progress and provide constructive feedback',
            'Create a positive and inclusive classroom environment',
            'Collaborate with colleagues on curriculum developm ent'
        ],
        eligibility: [
            'B.Ed or equivalent teaching qualification',
            '2+ years of teaching experience in primary education',
            'Strong communication and classroom management skills',
            'Passion for nurturing young minds'
        ]
    },
    {
        id: 'SCH002',
        category: 'School',
        roleTitle: 'Math Teacher (Grades 6-8)',
        department: 'Middle School',
        location: 'Bangalore',
        description: 'Looking for a dedicated Math Teacher to make mathematics accessible and engaging for middle school students.',
        responsibilities: [
            'Teach mathematics to students in grades 6-8',
            'Develop innovative teaching methods and materials',
            'Monitor student performance and provide remedial support',
            'Participate in parent-teacher meetings'
        ],
        eligibility: [
            'MSc/BSc in Mathematics with B.Ed',
            '3+ years of teaching experience',
            'Ability to simplify complex concepts',
            'Strong analytical and problem-solving skills'
        ]
    },
    {
        id: 'SCH003',
        category: 'School',
        roleTitle: 'Science Teacher',
        department: 'Sciences',
        location: 'Bangalore',
        description: 'Join our team as a Science Teacher to ignite curiosity and scientific thinking in students.',
        responsibilities: [
            'Conduct theory and practical science classes',
            'Maintain laboratory equipment and safety standards',
            'Organize science fairs and projects',
            'Prepare students for competitive exams'
        ],
        eligibility: [
            'MSc in Physics/Chemistry/Biology with B.Ed',
            '2+ years of experience in CBSE curriculum',
            'Hands-on lab experience',
            'Enthusiasm for experimental learning'
        ]
    },
    {
        id: 'SCH004',
        category: 'School',
        roleTitle: 'Physical Education Teacher',
        department: 'Sports & Wellness',
        location: 'Bangalore',
        description: 'Passionate PE Teacher needed to promote fitness, sportsmanship, and healthy lifestyles among students.',
        responsibilities: [
            'Plan and conduct PE classes and sports activities',
            'Coach students for inter-school competitions',
            'Ensure student safety during physical activities',
            'Promote wellness and healthy habits'
        ],
        eligibility: [
            'Degree in Physical Education or Sports Science',
            'Experience in coaching sports/athletics',
            'First aid certification preferred',
            'Energetic and motivational personality'
        ]
    },
    {
        id: 'SCH005',
        category: 'School',
        roleTitle: 'School Counselor',
        department: 'Student Wellness',
        location: 'Bangalore',
        description: 'Seeking a compassionate School Counselor to support student well-being and personal development.',
        responsibilities: [
            'Provide individual and group counseling to students',
            'Address academic, social, and emotional challenges',
            'Conduct workshops on life skills and mental health',
            'Collaborate with teachers and parents'
        ],
        eligibility: [
            'Masters in Psychology/Counseling',
            '2+ years of counseling experience',
            'Strong listening and empathy skills',
            'Knowledge of adolescent psychology'
        ]
    },
    {
        id: 'SCH006',
        category: 'School',
        roleTitle: 'Academic Coordinator',
        department: 'Administration',
        location: 'Bangalore',
        description: 'Experienced Academic Coordinator required to oversee curriculum implementation and teacher development.',
        responsibilities: [
            'Coordinate curriculum planning and execution',
            'Monitor teaching quality and student performance',
            'Conduct teacher training and development programs',
            'Liaise with management and parents'
        ],
        eligibility: [
            '5+ years of teaching experience with administrative role',
            'Strong leadership and organizational skills',
            'Knowledge of CBSE/ICSE curriculum',
            'Excellent communication abilities'
        ]
    },

    // College Openings
    {
        id: 'COL001',
        category: 'College',
        roleTitle: 'Assistant Professor (Computer Science)',
        department: 'Engineering',
        location: 'Bangalore',
        description: 'Seeking an Assistant Professor in Computer Science to teach, mentor, and contribute to research.',
        responsibilities: [
            'Teach undergraduate and postgraduate CS courses',
            'Guide student projects and research',
            'Publish research papers in reputed journals',
            'Participate in curriculum development'
        ],
        eligibility: [
            'PhD in Computer Science or related field',
            'Strong programming and theoretical knowledge',
            'Publications in peer-reviewed journals preferred',
            'Passion for teaching and research'
        ]
    },
    {
        id: 'COL002',
        category: 'College',
        roleTitle: 'Assistant Professor (Management)',
        department: 'Business Administration',
        location: 'Bangalore',
        description: 'Join our Management department to shape future business leaders with practical and theoretical expertise.',
        responsibilities: [
            'Deliver lectures on management subjects (Marketing, HR, Finance)',
            'Conduct case studies and industry projects',
            'Mentor MBA students on career development',
            'Engage in academic research'
        ],
        eligibility: [
            'PhD/MBA from reputed institution',
            'Industry experience preferred',
            'Strong analytical and presentation skills',
            'Ability to connect theory with practice'
        ]
    },
    {
        id: 'COL003',
        category: 'College',
        roleTitle: 'Lab Assistant (Engineering)',
        department: 'Laboratory Services',
        location: 'Bangalore',
        description: 'Lab Assistant needed to support engineering lab activities and maintain equipment.',
        responsibilities: [
            'Assist in conducting lab experiments',
            'Maintain and calibrate lab equipment',
            'Ensure lab safety and cleanliness',
            'Support faculty and students during practical sessions'
        ],
        eligibility: [
            'Diploma/Degree in relevant engineering field',
            '1-2 years of lab experience',
            'Hands-on technical skills',
            'Attention to detail and safety protocols'
        ]
    },
    {
        id: 'COL004',
        category: 'College',
        roleTitle: 'Librarian',
        department: 'Library Services',
        location: 'Bangalore',
        description: 'Experienced Librarian required to manage library operations and promote a culture of reading and research.',
        responsibilities: [
            'Manage library catalog and digital resources',
            'Assist students and faculty with research',
            'Organize book fairs and reading programs',
            'Maintain library inventory and subscriptions'
        ],
        eligibility: [
            'Degree in Library Science (BLISc/MLISc)',
            'Knowledge of library management systems',
            '2+ years of experience in academic library',
            'Strong organizational skills'
        ]
    },
    {
        id: 'COL005',
        category: 'College',
        roleTitle: 'Dean of Students',
        department: 'Student Affairs',
        location: 'Bangalore',
        description: 'Seeking a dynamic Dean of Students to lead student development, welfare, and discipline initiatives.',
        responsibilities: [
            'Oversee student affairs and campus activities',
            'Address student grievances and disciplinary matters',
            'Coordinate placement and career guidance',
            'Foster a positive campus culture'
        ],
        eligibility: [
            '10+ years of experience in academia',
            'Strong leadership and conflict resolution skills',
            'Masters degree in relevant field',
            'Empathy and commitment to student success'
        ]
    },
    {
        id: 'COL006',
        category: 'College',
        roleTitle: 'Placement Officer',
        department: 'Career Services',
        location: 'Bangalore',
        description: 'Placement Officer needed to connect students with career opportunities and build industry partnerships.',
        responsibilities: [
            'Coordinate campus recruitment drives',
            'Build relationships with corporate recruiters',
            'Conduct employability skill workshops',
            'Track and report placement statistics'
        ],
        eligibility: [
            'MBA or relevant degree',
            '3+ years of experience in placements/HR',
            'Excellent networking and communication skills',
            'Knowledge of industry trends'
        ]
    },

    // Corporate Openings
    {
        id: 'CORP001',
        category: 'Corporate',
        roleTitle: 'HR Executive',
        department: 'Human Resources',
        location: 'Bangalore',
        description: 'HR Executive needed to manage recruitment, employee engagement, and HR operations.',
        responsibilities: [
            'Handle end-to-end recruitment process',
            'Manage employee onboarding and orientation',
            'Coordinate training and development programs',
            'Maintain HR records and compliance'
        ],
        eligibility: [
            'MBA/PG Diploma in HR',
            '2-4 years of HR experience in education sector preferred',
            'Strong interpersonal and organizational skills',
            'Knowledge of labor laws'
        ]
    },
    {
        id: 'CORP002',
        category: 'Corporate',
        roleTitle: 'Finance Manager',
        department: 'Finance & Accounts',
        location: 'Bangalore',
        description: 'Experienced Finance Manager required to oversee financial planning, budgeting, and reporting.',
        responsibilities: [
            'Prepare budgets and financial forecasts',
            'Oversee accounts payable and receivable',
            'Ensure compliance with accounting standards',
            'Generate financial reports for management'
        ],
        eligibility: [
            'CA/CMA/MBA in Finance',
            '5+ years of experience in finance management',
            'Strong analytical and Excel skills',
            'Familiarity with ERP systems'
        ]
    },
    {
        id: 'CORP003',
        category: 'Corporate',
        roleTitle: 'Purchase Officer',
        department: 'Procurement',
        location: 'Bangalore',
        description: 'Purchase Officer needed to manage vendor relationships and procurement operations.',
        responsibilities: [
            'Source and negotiate with suppliers',
            'Manage purchase orders and inventory',
            'Ensure timely delivery and quality of goods',
            'Maintain vendor database and contracts'
        ],
        eligibility: [
            'Graduate in Commerce/Management',
            '3+ years of procurement experience',
            'Strong negotiation skills',
            'Knowledge of supply chain management'
        ]
    },
    {
        id: 'CORP004',
        category: 'Corporate',
        roleTitle: 'ERP/LMS Support Engineer',
        department: 'Information Technology',
        location: 'Bangalore',
        description: 'Tech-savvy professional needed to support ERP and LMS systems across the organization.',
        responsibilities: [
            'Provide technical support for ERP/LMS platforms',
            'Configure and customize system modules',
            'Train staff and students on system usage',
            'Troubleshoot and resolve technical issues'
        ],
        eligibility: [
            'BTech/MCA or equivalent',
            '2+ years of ERP/LMS experience',
            'Strong problem-solving skills',
            'Knowledge of SQL and system administration'
        ]
    },
    {
        id: 'CORP005',
        category: 'Corporate',
        roleTitle: 'Digital Marketing Manager',
        department: 'Marketing',
        location: 'Bangalore',
        description: 'Creative Digital Marketing Manager required to drive online presence and lead generation.',
        responsibilities: [
            'Plan and execute digital marketing campaigns',
            'Manage social media, SEO, and content strategy',
            'Analyze campaign performance and ROI',
            'Collaborate with design and content teams'
        ],
        eligibility: [
            'Degree in Marketing/Communications',
            '4+ years of digital marketing experience',
            'Proficiency in Google Ads, Analytics, and social platforms',
            'Creative thinking and data-driven approach'
        ]
    },
    {
        id: 'CORP006',
        category: 'Corporate',
        roleTitle: 'Operations Head',
        department: 'Operations',
        location: 'Bangalore',
        description: 'Senior Operations Head needed to streamline processes and ensure smooth functioning of all departments.',
        responsibilities: [
            'Oversee daily operations across departments',
            'Implement process improvements and efficiencies',
            'Ensure compliance with policies and regulations',
            'Coordinate with academic and administrative teams'
        ],
        eligibility: [
            '10+ years of operations management experience',
            'Strong leadership and project management skills',
            'Experience in education sector preferred',
            'Strategic thinking and execution ability'
        ]
    }
];

export const getCategoryCount = (category: 'School' | 'College' | 'Corporate') => {
    // Try localStorage first (admin-managed)
    const stored = localStorage.getItem('job_openings');
    if (stored) {
        const openings: Opening[] = JSON.parse(stored);
        return openings.filter(o => o.category === category).length;
    }
    // Fallback to mock data
    return mockOpenings.filter(o => o.category === category).length;
};

export const getOpeningsByCategory = (category: 'School' | 'College' | 'Corporate'): Opening[] => {
    // Try localStorage first (admin-managed)
    const stored = localStorage.getItem('job_openings');
    if (stored) {
        const openings: Opening[] = JSON.parse(stored);
        return openings.filter(o => o.category === category);
    }
    // Fallback to mock data
    return mockOpenings.filter(o => o.category === category);
};

export const getOpeningById = (id: string): Opening | undefined => {
    // Try localStorage first (admin-managed)
    const stored = localStorage.getItem('job_openings');
    if (stored) {
        const openings: Opening[] = JSON.parse(stored);
        return openings.find(o => o.id === id);
    }
    // Fallback to mock data
    return mockOpenings.find(o => o.id === id);
};

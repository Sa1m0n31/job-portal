// Type = 1
const userTranslateObject = {
    extraLanguages: '',
    courses: '',
    certificates: '',
    skills: '',
    situationDescription: '',
    jobs: '',
    schools: ''
}

// Type = 2
const agencyTranslateObject = {
    description: '',
    recruitmentProcess: '',
    benefits: '',
    roomDescription: ''
}

// Type = 3 (normal) and 4 (fast)
const offerTranslateObject = {
    title: '',
    keywords: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    additionalInfo: ''
}

const userTranslateFields = ['extraLanguages', 'courses', 'certificates', 'skills',
'situationDescription', 'jobs', 'schools'];

const agencyTranslateFields = ['description', 'recruitmentProcess',
    'benefits', 'roomDescription'
];

const offerTranslateFields = ['title', 'keywords', 'description',
    'responsibilities', 'requirements', 'benefits', 'additionalInfo'
]

export { userTranslateObject, offerTranslateObject, agencyTranslateObject,
    offerTranslateFields, agencyTranslateFields, userTranslateFields
}

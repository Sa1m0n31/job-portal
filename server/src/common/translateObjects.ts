// Type = 1
const userTranslateObject = {
    extraLanguages: '',
    courses: '',
    certificates: '',
    situationDescription: '',
    jobTitles: '', // []
    jobResponsibilities: '' // [ [], [] ]
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
    benefits: ''
}

const userTranslateFields = ['extraLanguages', 'courses', 'certificates',
'situationDescription', 'jobTitles', 'jobResponsibilities'];

const agencyTranslateFields = ['description', 'recruitmentProcess',
    'benefits', 'roomDescription'
];

const offerTranslateFields = ['title', 'keywords', 'description',
    'responsibilities', 'requirements', 'benefits'
]

export { userTranslateObject, offerTranslateObject, agencyTranslateObject,
    offerTranslateFields, agencyTranslateFields, userTranslateFields
}

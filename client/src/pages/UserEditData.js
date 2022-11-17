import React, {useContext, useEffect, useState} from 'react';
import logo from '../static/img/logo-biale.png'
import backArrow from '../static/img/back-arrow-grey.svg'
import homeIcon from '../static/img/home-icon.svg'
import LanguageSwitcher from "../components/LanguageSwitcher";
import UserForm1 from "../components/UserForm1";
import UserForm2 from "../components/UserForm2";
import UserForm3 from "../components/UserForm3";
import UserForm4A from "../components/UserForm4a";
import {getLoggedUserEmail, isElementInArray, parseUserData} from "../helpers/others";
import UserForm4B from "../components/UserForm4b";
import UserForm5b from "../components/UserForm5b";
import UserForm5a from "../components/UserForm5a";
import UserForm5C from "../components/UserForm5c";
import UserForm5D from "../components/UserForm5d";
import MobileHeader from "../components/MobileHeader";
import {getUserData, updateUser} from "../helpers/user";
import UserFormSummary from "../components/UserFormSummary";
import settings from "../static/settings";
import {LanguageContext} from "../App";

const UserDataContext = React.createContext(null);

const UserEditData = () => {
    const [userData, setUserData] = useState({
        // 1. Personal data
        profileImage: null,
        profileImageUrl: '',
        firstName: '',
        lastName: '',
        birthdayDay: 0,
        birthdayMonth: 0,
        birthdayYear: 2000,
        country: 0,
        city: '',
        postalCode: '',
        address: '',
        phoneNumberCountry: 'PL +48',
        phoneNumber: '',
        email: '',
        // 2. Education
        education: 0,
        schools: [],
        // 3. Experience
        jobs: [],
        // 4.1. Skills
        languages: [],
        extraLanguages: '',
        drivingLicence: null,
        drivingLicenceCategories: [],
        // 4.2. Skills
        courses: [],
        certificates: [],
        skills: [],
        // 5.1 Additional info
        currentCountry: 0,
        currentPostalCode: '',
        currentCity: '',
        hasBsnNumber: false,
        bsnNumber: '',
        bsnNumberDocument: null,
        availabilityDay: 0,
        availabilityMonth: 0,
        availabilityYear: new Date().getFullYear(),
        longTermJobSeeker: null,
        ownTransport: null,
        ownTransportType: 0,
        // 5.2 Additional info
        ownAccommodation: null,
        accommodationPlace: '',
        ownTools: null,
        ownToolsDescription: '',
        salaryType: 0,
        salaryFrom: null,
        salaryTo: null,
        salaryCurrency: 0,
        categories: ['-'],
        // 5.3 Additional info
        situationDescription: '',
        attachments: [],
        oldAttachments: [],
        checkbox: false,
        // 5.4 Additional info
        friendLink: '',
        whereYouFindOurApp: ''
    });
    const [step, setStep] = useState(0);
    const [substep, setSubstep] = useState(0);
    const [currentForm, setCurrentForm] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [daysVisible, setDaysVisible] = useState(false);
    const [monthsVisible, setMonthsVisible] = useState(false);
    const [yearsVisible, setYearsVisible] = useState(false);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [phoneNumbersCountriesVisible, setPhoneNumbersCountriesVisible] = useState(false);
    const [educationVisible, setEducationVisible] = useState(false);
    const [levelsVisible, setLevelsVisible] = useState(-1);
    const [drivingLicenceVisible, setDrivingLicenceVisible] = useState(false);
    const [bsnVisible, setBsnVisible] = useState(false);
    const [currenciesVisible, setCurrenciesVisible] = useState(false);
    const [categoriesVisible, setCategoriesVisible] = useState(-1);
    const [transportTypesVisible, setTransportTypesVisible] = useState(false);
    const [errorFields, setErrorFields] = useState([]);
    const [step1Error, setStep1Error] = useState(false);
    const [step2Error, setStep2Error] = useState(false);
    const [step3Error, setStep3Error] = useState(false);
    const [step5Error, setStep5Error] = useState(false);
    const [schoolErrorIndex, setSchoolErrorIndex] = useState(-1);
    const [schoolErrorField, setSchoolErrorField] = useState(-1);
    const [jobErrorIndex, setJobErrorIndex] = useState(-1);
    const [jobErrorField, setJobErrorField] = useState(-1);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                hideAllDropdowns();
            }
        });
    }, []);

    useEffect(() => {
        switch(step) {
            case 0:
                setCurrentForm(<UserForm1 daysVisible={daysVisible}
                                          setDaysVisible={setDaysVisible}
                                          monthsVisible={monthsVisible}
                                          setMonthsVisible={setMonthsVisible}
                                          yearsVisible={yearsVisible}
                                          setYearsVisible={setYearsVisible}
                                          countriesVisible={countriesVisible}
                                          setCountriesVisible={setCountriesVisible}
                                          handleFileUpload={handleFileUpload}
                                          removeProfileImage={removeProfileImage}
                                          phoneNumbersCountriesVisible={phoneNumbersCountriesVisible}
                                          setPhoneNumbersCountriesVisible={setPhoneNumbersCountriesVisible}
                />);
                break;
            case 1:
                setCurrentForm(<UserForm2 addNewSchool={addNewSchool}
                                          deleteSchool={deleteSchool}
                                          setEducationVisible={setEducationVisible}
                                          schoolErrorIndex={schoolErrorIndex}
                                          schoolErrorField={schoolErrorField}
                                          toggleSchoolInProgress={toggleSchoolInProgress} />);
                break;
            case 2:
                setCurrentForm(<UserForm3 addNewJob={addNewJob}
                                          deleteJob={deleteJob}
                                          addNewResponsibility={addNewResponsibility}
                                          updateJobResponsibilities={updateJobResponsibility}
                                          deleteResponsibility={deleteResponsibility}
                                          jobErrorIndex={jobErrorIndex}
                                          jobErrorField={jobErrorField}
                                          toggleJobInProgress={toggleJobInProgress} />);
                break;
            case 3:
                if(substep === 0) {
                    setCurrentForm(<UserForm4A toggleLanguage={toggleLanguage}
                                               updateLanguageLvl={updateLanguageLvl}
                                               setLevelsVisible={setLevelsVisible}
                                               setDrivingLicenceVisible={setDrivingLicenceVisible}
                                               toggleDrivingLicenceCategory={toggleDrivingLicenceCategory}
                    />);
                }
                if(substep === 1) {
                    setCurrentForm(<UserForm4B addNewCourse={addNewCourse}
                                               addNewCertificate={addNewCertificate}
                                               addNewSkill={addNewSkill}
                                               deleteSkill={deleteSkill}
                                               deleteCourse={deleteCourse}
                                               deleteCertificate={deleteCertificate}

                    />);
                }
                break;
            case 4:
                if(substep === 0) {
                    setCurrentForm(<UserForm5a setDaysVisible={setDaysVisible}
                                               setMonthsVisible={setMonthsVisible}
                                               setYearsVisible={setYearsVisible}
                                               setCountriesVisible={setCountriesVisible}
                                               setBsnVisible={setBsnVisible}
                                               setTransportTypesVisible={setTransportTypesVisible}
                    />);
                }
                if(substep === 1) {
                    setCurrentForm(<UserForm5b addNewCategory={addNewCategory}
                                               deleteCategory={deleteCategory}
                                               setCategoriesVisible={setCategoriesVisible}
                                               setCurrenciesVisible={setCurrenciesVisible}
                    />);
                }
                if(substep === 2) {
                    setCurrentForm(<UserForm5C />);
                }
                if(substep === 3) {
                    setCurrentForm(<UserForm5D submitUserData={submitUserData}
                                               loading={loading}
                                               error={error}
                                               changeAttachmentName={changeAttachmentName}
                                               removeAttachment={removeAttachment}
                                               removeOldAttachment={removeOldAttachment}
                    />);
                }
                break;
            case 5:
                setCurrentForm(<UserFormSummary />);
                break;
            default:
                break;
        }

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    }, [step, substep]);

    useEffect(() => {
        setUserData(prevState => ({
            ...prevState,
            email: getLoggedUserEmail()
        }));

        getUserData()
            .then((res) => {
                if(res?.status === 200) {
                    const data = JSON.parse(res.data.data);
                    if(Object.keys(data).length > 0) {
                        console.log(parseUserData(data));
                        setUserData({
                            ...parseUserData(data),
                            skills: data.skills ? data.skills : [],
                            profileImage: null,
                            profileImageUrl: data.profileImage ? `${settings.API_URL}/${data.profileImage}` : null,
                            bsnNumberDocument: data.bsnNumberDocument ? data.bsnNumberDocument : null,
                            oldAttachments: data.attachments ? data.attachments : [],
                            attachments: []
                        });
                    }
                }
            });
    }, []);

    const changeAttachmentName = (i, val, old = false) => {
        if(old) {
            setUserData(prevState => ({
                ...prevState,
                oldAttachments: prevState.oldAttachments.map((item, index) => {
                    if(index === i) {
                        return {
                            name: val,
                            path: item.path
                        }
                    }
                    else {
                        return item;
                    }
                })
            }));
        }
        else {
            setUserData(prevState => ({
                ...prevState,
                attachments: prevState.attachments.map((item, index) => {
                    if(index === i) {
                        return {
                            name: val,
                            file: item.file
                        }
                    }
                    else {
                        return item;
                    }
                })
            }));
        }
    }

    useEffect(() => {
        if(window.innerWidth < 996) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [step, substep]);

    const dateValidation = (str) => {
        const dateElements = str?.split('-');
        if (dateElements?.length !== 2) return false;
        if (dateElements[0]?.length !== 4) return false;
        return dateElements[1]?.length;
    }

    const schoolsValidation = (data, job) => {
        if(data) {
            if(!data.length) {
                return -1;
            }
            else {
                let nameError = false;
                const schoolIndex = data.findIndex((item, index) => {
                    if(item.inProgress) {
                        if(!item.name) {
                            nameError = true;
                            return true;
                        }
                        if(!dateValidation(item.from)) {
                            if(job) {
                                setJobErrorIndex(index);
                                setJobErrorField(1);
                            }
                            else {
                                setSchoolErrorIndex(index);
                                setSchoolErrorField(1);
                            }
                            return true;
                        }
                        return false;
                    }
                    else {
                        if(!item.name) {
                            nameError = true;
                            return true;
                        }
                        if(!dateValidation(item.from)) {
                            if(job) {
                                setJobErrorIndex(index);
                                setJobErrorField(1);
                            }
                            else {
                                setSchoolErrorIndex(index);
                                setSchoolErrorField(1);
                            }
                            return true;
                        }
                        if(!dateValidation(item.to)) {
                            if(job) {
                                setJobErrorIndex(index);
                                setJobErrorField(2);
                            }
                            else {
                                setSchoolErrorIndex(index);
                                setSchoolErrorField(2);
                            }
                            return true;
                        }
                        return false;
                    }
                });

                if(schoolIndex === -1) {
                    return 1;
                }
                else {
                    if(nameError) return -1;
                    else return -2;
                }
            }
        }
        else {
            return 0;
        }
    }

    const validateUserData = () => {
        const fields = [];

        if(!userData.firstName) {
            setStep1Error(true);
            fields.push(c.firstName);
        }
        if(!userData.lastName) {
            setStep1Error(true);
            fields.push(c.lastName);
        }
        if(!userData.city) {
            setStep1Error(true);
            fields.push(c.city);
        }
        if(!userData.postalCode) {
            setStep1Error(true);
            fields.push(c.postalCode);
        }
        if(!userData.address) {
            setStep1Error(true);
            fields.push(c.streetAndBuilding);
        }
        if(!userData.phoneNumber) {
            setStep1Error(true);
            fields.push(c.phoneNumber);
        }
        const schoolsError = schoolsValidation(userData.schools, false);

        if(schoolsError !== 1) {
            setStep2Error(true);
            if(schoolsError === -1) {
                fields.push(c.finishedSchools);
            }
            else {
                fields.push(`${c.finishedSchools} (${c.dateError})`);
            }
        }

        if(userData?.jobs?.length) {
            const experienceError = schoolsValidation(userData.jobs, true);

            if(experienceError !== 1) {
                setStep3Error(true);

                if(experienceError === -1) {
                    fields.push(c.jobExperience);
                }
                else {
                    fields.push(`${c.jobExperience} (${c.dateError})`);
                }
            }
        }

        if(!userData.currentCity || !userData.currentPostalCode) {
            setStep5Error(true);
            fields.push(c.currentLivingPlace);
        }
        if(userData.longTermJobSeeker === null) {
            setStep5Error(true);
            fields.push(c.longTermQuestion);
        }
        if(userData.ownTransport === null) {
            setStep5Error(true);
            fields.push(c.ownTransportQuestion);
        }
        if(!userData.ownAccommodation && userData.ownAccommodation !== false) {
            setStep5Error(true);
            fields.push(c.ownAccommodationQuestion);
        }
        if(!userData.salaryFrom || !userData.salaryTo) {
            setStep5Error(true);
            fields.push(c.salary);
        }
        if(userData.categories[0] === '-' || userData?.categories?.length === 0) {
            setStep5Error(true);
            fields.push(c.mainCategories);
        }
        if(!userData.whereYouFindOurApp) {
            setStep5Error(true);
            fields.push(c.whereYouFindOurApp);
        }

        if(fields.length) {
            setErrorFields(fields);
            return false;
        }
        else {
            return true;
        }
    }

    const submitUserData = async (userData) => {
        if(validateUserData()) {
            setLoading(true);
            setError('');
            setErrorFields([]);

            try {
                const res = await updateUser(userData);

                if(res?.status === 201) {
                    setLoading(false);
                    setSubstep(0);
                    setStep(5);
                }
                else {
                    setError(JSON.parse(c.formErrors)[1]);
                    setLoading(false);
                }
            }
            catch(err) {
                if(err?.response?.status === 415) {
                    setError(c.unsupportedMediaTypeInfo);
                }
                else {
                    setError(JSON.parse(c.formErrors)[1]);
                }
                setLoading(false);
            }
        }
        else {
            setError(JSON.parse(c.formErrors)[0]);
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 500);
        }
    }

    const removeProfileImage = () => {
        setUserData(prevState => ({
            ...prevState,
            profileImage: null,
            profileImageUrl: null
        }));
    }

    const handleFileUpload = (e) => {
        const file = e?.target?.files[0];
        if(file) {
            setUserData(prevState => ({
                ...prevState,
                profileImage: file,
                profileImageUrl: window.URL.createObjectURL(file)
            }));
        }
    }

    const hideAllDropdowns = () => {
        setDaysVisible(false);
        setMonthsVisible(false);
        setYearsVisible(false);
        setCountriesVisible(false);
        setPhoneNumbersCountriesVisible(false);
        setEducationVisible(false);
        setLevelsVisible(-1);
        setDrivingLicenceVisible(false);
        setBsnVisible(false);
        setCategoriesVisible(-1);
        setCurrenciesVisible(false);
    }

    const removeAttachment = (i) => {
        setUserData(prevState => ({
            ...prevState,
            attachments: Array.from(prevState.attachments).filter((item, index) => {
                return i !== index;
            })
        }))
    }

    const removeOldAttachment = (i) => {
        setUserData(prevState => ({
            ...prevState,
            oldAttachments: Array.from(prevState.oldAttachments).filter((item, index) => {
                return i !== index;
            })
        }))
    }

    const addNewCategory = () => {
        setUserData(prevState => ({
            ...prevState,
            categories: Array.isArray(prevState.categories) ? [...prevState.categories, c.chooseCategory] : [c.chooseCategory]
        }));
    }

    const deleteCategory = (i) => {
        setUserData(prevState => ({
            ...prevState,
            categories: prevState.categories.filter((item, index) => (index !== i))
        }));
    }

    const addNewCourse = () => {
        setUserData(prevState => ({
            ...prevState,
            courses: [...prevState.courses, '']
        }));
    }

    const addNewCertificate = () => {
        setUserData(prevState => ({
            ...prevState,
            certificates: [...prevState.certificates, '']
        }));
    }

    const addNewSkill = () => {
        setUserData(prevState => ({
            ...prevState,
            skills: [...prevState.skills, '']
        }));
    }

    const deleteCourse = (i) => {
        setUserData(prevState => ({
            ...prevState,
            courses: prevState.courses.filter((item, index) => (index !== i))
        }));
    }

    const deleteCertificate = (i) => {
        setUserData(prevState => ({
            ...prevState,
            certificates: prevState.certificates.filter((item, index) => (index !== i))
        }));
    }

    const deleteSkill = (i) => {
        setUserData(prevState => ({
            ...prevState,
            skills: prevState.skills.filter((item, index) => (index !== i))
        }));
    }

    const toggleLanguage = (i) => {
        setUserData(prevState => ({
            ...prevState,
            languages: isElementInArray(i, prevState.languages.map((item) => (item.language))) ? prevState.languages.filter((item) => {
                return item.language !== i;
            }) : [...prevState.languages, {
                language: i,
                lvl: 'A1'
            }]
        }));
    }

    const toggleDrivingLicenceCategory = (i) => {
        setUserData(prevState => ({
            ...prevState,
            drivingLicenceCategories: !isElementInArray(i, prevState.drivingLicenceCategories) ?
                [...prevState.drivingLicenceCategories, i] : prevState.drivingLicenceCategories.filter((item) => (item !== i))
        }));
    }

    const updateLanguageLvl = (lang, lvl) => {
        setUserData(prevState => ({
            ...prevState,
            languages: prevState.languages.map((item) => {
                if(item.language === lang) {
                    return {
                        language: lang,
                        lvl: lvl
                    }
                }
                else {
                    return item;
                }
            })
        }));
    }

    const addNewSchool = () => {
        if(userData?.schools?.length < 3 || !userData?.schools) {
            setUserData(prevState => {
                if(prevState?.schools?.length < 3 || !userData?.schools) {
                    return {
                        ...prevState,
                        schools: Array.isArray(prevState.schools) ? [...prevState.schools, {
                            name: '',
                            title: '',
                            from: null,
                            to: null,
                            inProgress: false
                        }] : [{
                            name: '',
                            title: '',
                            from: null,
                            to: null,
                            inProgress: false
                        }]
                    }
                }
                else {
                    return prevState;
                }
            });
        }
    }

    const addNewResponsibility = (jobIndex) => {
        setUserData(prevState => ({
            ...prevState,
            jobs: prevState.jobs.map((item, index) => {
                if(index === jobIndex) {
                    return {
                        ...item,
                        responsibilities: [...prevState.jobs[index].responsibilities, '']
                    }
                }
                else {
                    return item;
                }
            })
        }));
    }

    const addNewJob = () => {
        setUserData(prevState => ({
            ...prevState,
            jobs: [...prevState.jobs, {
                name: '',
                title: '',
                from: null,
                to: null,
                inProgress: false,
                responsibilities: ['']
            }]
        }));
    }

    const updateJobResponsibility = (jobIndex, resIndex, value) => {
        setUserData(prevState => ({
            ...prevState,
            jobs: prevState.jobs.map((item, index) => {
                if(index === jobIndex) {
                    return {
                        ...item,
                        responsibilities: item.responsibilities.map((item, index) => {
                            if(index === resIndex) {
                                return value;
                            }
                            else {
                                return item;
                            }
                        })
                    }
                }
                else {
                    return item;
                }
            })
        }));
    }

    const deleteSchool = (i) => {
        setUserData(prevState => ({
            ...prevState,
            schools: prevState.schools.filter((item, index) => {
                return index !== i;
            })
        }));
    }

    const deleteJob = (i) => {
        setUserData(prevState => ({
            ...prevState,
            jobs: prevState.jobs.filter((item, index) => {
                return index !== i;
            })
        }));
    }

    const deleteResponsibility = (jobIndex, resIndex) => {
        setUserData(prevState => ({
            ...prevState,
            jobs: prevState.jobs.map((item, index) => {
                if(index === jobIndex) {
                    return {
                        ...item,
                        responsibilities: item.responsibilities.filter((item, index) => {
                            return index !== resIndex;
                        })
                    }
                }
                else {
                    return item;
                }
            })
        }));
    }

    const toggleSchoolInProgress = (i) => {
        setUserData((prevState => (
            {
                ...prevState,
                schools: prevState.schools.map((item, index) => {
                    if(index === i) {
                        return {
                            ...item,
                            inProgress: !item.inProgress
                        }
                    }
                    else {
                        return item;
                    }
                })
            }
        )));
    }

    const toggleJobInProgress = (i) => {
        setUserData((prevState => (
            {
                ...prevState,
                jobs: prevState.jobs.map((item, index) => {
                    if(index === i) {
                        return {
                            ...item,
                            inProgress: !item.inProgress
                        }
                    }
                    else {
                        return item;
                    }
                })
            }
        )));
    }

    const handleChange = (field, value, subfield = null, fieldIndex = null) => {
        hideAllDropdowns();

        if(field === 'phoneNumber') {
            if((value.length && isNaN(parseInt(value[value.length-1]))) || value.length > 12) {
                return 0;
            }
        }
        if(field === 'schools' || field === 'jobs') {
            let newValue =  value;

            const currentValue = userData[field][fieldIndex][subfield];

            if(subfield === 'from' || subfield === 'to') {
                if(value.length > 0 && value.length < 4) {
                    const valueNumber = parseInt(value);

                    if(!valueNumber || isNaN(value)) {
                        return false;
                    }
                }
                else if(value.length === 4) {
                    if(currentValue.length > 4) {
                        newValue = value.slice(0, 4);
                    }
                    else {
                        if(!isNaN(value)) {
                            newValue += '-';
                        }
                        else {
                            return false;
                        }
                    }
                }
                else if(value.length === 5) {
                    if(currentValue.length > 5) {
                        newValue = value.slice(0, 4);
                    }
                    else {
                        if(value.slice(-1) !== '-') {
                            newValue = `${value.slice(0, -1)}-${value.slice(-1)}`;
                        }
                    }
                }
                else if(value.length > 5 && value.length <= 7) {
                    const month = value.split('-')[1];
                    if(month) {
                        if(!isNaN(month)) {
                            if(parseInt(month) > 12) {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else if(value.length > 7) {
                    return false;
                }

            }

            setUserData({
                ...userData,
                [field]: userData[field].map((item, index) => {
                    if(index === fieldIndex) {
                        return {
                            ...item,
                            [subfield]: newValue
                        }
                    }
                    else {
                        return item;
                    }
                })
            });
            return 0;
        }
        if(field === 'courses' || field === 'certificates' || field === 'skills' || field === 'categories') {
            if(Array.isArray(userData[field])) {
                setUserData(prevState => ({
                    ...prevState,
                    [field]: prevState[field].map((item, index) => {
                        if(index === fieldIndex) {
                            return value
                        }
                        else {
                            return item;
                        }
                    })
                }));
            }
            return 0;
        }
        if(field === 'attachments') {
            setUserData(prevState => ({
                ...prevState,
                attachments: [...prevState.attachments, Array.from(value).map((item) => {
                    return {
                        name: item.name,
                        file: item
                    }
                })].flat()
            }));
            return 0;
        }

        setUserData({
            ...userData,
            [field]: value
        });
    }

    const prevStep = () => {
        if(step === 3) {
            if(substep === 0) {
                setStep(2);
            }
            else {
                setSubstep(0);
            }
        }
        else if(step === 4) {
            if(substep === 0) {
                setStep(3);
                setSubstep(1);
            }
            else {
                setSubstep(prevState => (prevState-1));
            }
        }
        else if(step === 0) {
            window.location = '/';
        }
        else {
            setStep(prevState => (prevState-1));
        }
    }

    useEffect(() => {
        const stepsParents = Array.from(document.querySelectorAll('.editData__step'));
        const steps = Array.from(document.querySelectorAll('.editData__step>.editData__left__step__text'));

        if(step1Error) {
            steps[0].style.color = 'red';
            stepsParents[0].style.opacity = '1';
        }
        else {
            steps[0].style.color = '#fff';
            stepsParents[0].style.opacity = '.5';
        }
    }, [step1Error]);

    useEffect(() => {
        const stepsParents = Array.from(document.querySelectorAll('.editData__step'));
        const steps = Array.from(document.querySelectorAll('.editData__step>.editData__left__step__text'));

        if(step2Error) {
            steps[1].style.color = 'red';
            stepsParents[1].style.opacity = '1';
        }
        else {
            steps[1].style.color = '#fff';
            stepsParents[1].style.opacity = '.5';
        }
    }, [step2Error]);

    useEffect(() => {
        const stepsParents = Array.from(document.querySelectorAll('.editData__step'));
        const steps = Array.from(document.querySelectorAll('.editData__step>.editData__left__step__text'));

        if(step3Error) {
            steps[2].style.color = 'red';
            stepsParents[2].style.opacity = '1';
        }
        else {
            steps[2].style.color = '#fff';
            stepsParents[2].style.opacity = '.5';
        }
    }, [step3Error]);

    useEffect(() => {
        const stepsParents = Array.from(document.querySelectorAll('.editData__step'));
        const steps = Array.from(document.querySelectorAll('.editData__step>.editData__left__step__text'));

        if(step5Error) {
            steps[4].style.color = 'red';
            stepsParents[4].style.opacity = '1';
        }
        else {
            steps[4].style.color = '#fff';
            stepsParents[4].style.opacity = '.5';
        }
    }, [step5Error]);

    useEffect(() => {
        if(userData.firstName && userData.lastName && userData.city && userData.postalCode && userData.address
            && userData.phoneNumber) {
            setStep1Error(false);
        }

        if(schoolsValidation(userData?.schools, false)) {
            setStep2Error(false);
        }

        if(!userData?.jobs?.length) {
            setStep3Error(false);
        }
        else if(schoolsValidation(userData?.jobs, true)) {
            setStep3Error(false);
        }

        if(userData.currentCity && userData.currentPostalCode && userData.longTermJobSeeker !== null && userData.ownTransport !== null
            && userData.ownAccommodation !== null && userData.salaryFrom && userData.salaryTo && userData.categories?.length && userData.categories[0] !== '-') {
            setStep5Error(false);
        }
    }, [userData]);

    return <UserDataContext.Provider value={{
        setStep, setSubstep, daysVisible, monthsVisible, yearsVisible, countriesVisible, phoneNumbersCountriesVisible,
        educationVisible, transportTypesVisible,
        levelsVisible, drivingLicenceVisible,
        bsnVisible, error, loading, errorFields,
        categoriesVisible, currenciesVisible,
        userData, handleChange
    }}>
        <div className="container container--editData flex" onClick={(e) => { hideAllDropdowns(); }}>
            <div className="editData__left noscroll">
                <a href="/" className="editData__left__logo">
                    <img className="img" src={logo} alt="portal-z-ofertami-pracy" />
                </a>

                <h2 className="editData__left__header">
                    {JSON.parse(c.stepsContent)[step][substep].header}
                </h2>
                <p className="editData__left__text">
                    {JSON.parse(c.stepsContent)[step][substep].text}
                </p>

                <div className="editData__left__steps">
                    {JSON.parse(c.steps).map((item, index) => {
                        return <button className={step === index ? "flex editData__step editData__step--current" : "flex editData__step"}
                                       onClick={() => { if(index !== 5) setStep(index); setSubstep(0) }}
                                       key={index}>
                        <span className="editData__left__step__number center">
                            {index+1}
                        </span>
                            <span className="editData__left__step__text">
                            {item}
                        </span>
                        </button>
                    })}
                </div>
            </div>

            <MobileHeader back={true} backFunction={prevStep} />

            <main className="editData__main">
                <header className="editData__main__header flex">
                    <div className="editData__main__header__left">
                        <a href="/" className="editData__main__header__left__link flex">
                            <img className="img" src={homeIcon} alt="home" />
                            {c.homepage}
                        </a>
                        <button onClick={() => { prevStep(); }}
                            className="editData__main__header__left__link flex">
                            <img className="img" src={backArrow} alt="logowanie" />
                            {c.back}
                        </button>
                    </div>

                    <LanguageSwitcher />
                </header>

                <div className="editData__formWrapper">
                    <div className="editData__steps flex">
                        {JSON.parse(c.stepsContent)?.map((item, index) => {
                            return <span key={index} className={step === index ? "step step--current flex" : "step flex"}>
                            {item.map((item, index) => {
                                return <span key={index} className={substep === index ? "substep substep--current" : "substep"}>
                                    </span>
                            })}
                        </span>
                        })}
                    </div>

                    <h1 className="editData__formWrapper__header">
                        {JSON.parse(c.stepsMainContent)[step][substep].header}
                    </h1>
                    <h2 className="editData__formWrapper__subheader">
                        {JSON.parse(c.stepsMainContent)[step][substep].text}
                    </h2>

                    {currentForm}
                </div>
            </main>

            <footer className="mobileLanguageFooter">
                <LanguageSwitcher />
            </footer>
        </div>
    </UserDataContext.Provider>
};

export default UserEditData;
export { UserDataContext }

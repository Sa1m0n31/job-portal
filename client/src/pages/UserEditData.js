import React, {useEffect, useState} from 'react';
import logo from '../static/img/logo-biale.png'
import backArrow from '../static/img/back-arrow-grey.svg'
import homeIcon from '../static/img/home-icon.svg'
import {formErrors, steps, stepsContent, stepsMainContent} from "../static/content";
import LanguageSwitcher from "../components/LanguageSwitcher";
import UserForm1 from "../components/UserForm1";
import UserForm2 from "../components/UserForm2";
import UserForm3 from "../components/UserForm3";
import UserForm4A from "../components/UserForm4a";
import {isElementInArray} from "../helpers/others";
import UserForm4B from "../components/UserForm4b";
import UserForm5b from "../components/UserForm5b";
import UserForm5a from "../components/UserForm5a";
import UserForm5C from "../components/UserForm5c";
import UserForm5D from "../components/UserForm5d";
import MobileHeader from "../components/MobileHeader";
import {updateUser} from "../helpers/user";
import UserFormSummary from "../components/UserFormSummary";

const UserDataContext = React.createContext(null);

const UserEditData = () => {
    const [userData, setUserData] = useState({
        // 1. Personal data
        firstName: '',
        lastName: '',
        birthdayDay: 0,
        birthdayMonth: 0,
        birthdayYear: new Date().getFullYear()-14,
        country: 0,
        city: '',
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
        // 5.2 Additional info
        ownAccommodation: null,
        accommodationPlace: '',
        ownTools: null,
        salaryType: 0,
        salaryFrom: null,
        salaryTo: null,
        salaryCurrency: 'EUR',
        categories: ['Wybierz branżę'],
        // 5.3 Additional info
        situationDescription: '',
        attachments: [],
        checkbox: false,
        // 5.4 Additional info
        friendLink: ''
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
                                          phoneNumbersCountriesVisible={phoneNumbersCountriesVisible}
                                          setPhoneNumbersCountriesVisible={setPhoneNumbersCountriesVisible}
                />);
                break;
            case 1:
                setCurrentForm(<UserForm2 addNewSchool={addNewSchool}
                                          deleteSchool={deleteSchool}
                                          setEducationVisible={setEducationVisible}
                                          toggleSchoolInProgress={toggleSchoolInProgress} />);
                break;
            case 2:
                setCurrentForm(<UserForm3 addNewJob={addNewJob}
                                          deleteJob={deleteJob}
                                          addNewResponsibility={addNewResponsibility}
                                          updateJobResponsibilities={updateJobResponsibility}
                                          deleteResponsibility={deleteResponsibility}
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
                                               removeAttachment={removeAttachment}
                    />);
                }
                break;
            case 5:
                setCurrentForm(<UserFormSummary />);
                break;
            default:
                break;
        }
    }, [step, substep]);

    const submitUserData = async () => {
        setLoading(true);
        const res = await updateUser(userData);
        setSubstep(0);
        setStep(5);
        // if(res?.status === 201) {
        //     setLoading(false);
        //     setStep(5);
        // }
        // else {
        //     setError(formErrors[1]);
        //     setLoading(false);
        // }
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

    const addNewCategory = () => {
        setUserData(prevState => ({
            ...prevState,
            categories: [...prevState.categories, 'Wybierz branżę']
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
        setUserData(prevState => ({
            ...prevState,
            schools: [...prevState.schools, {
                name: '',
                title: '',
                from: null,
                to: null,
                inProgress: false
            }]
        }));
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
            setUserData({
                ...userData,
                [field]: userData[field].map((item, index) => {
                    if(index === fieldIndex) {
                        return {
                            ...item,
                            [subfield]: value
                        }
                    }
                    else {
                        return item;
                    }
                })
            });
            return 0;
        }
        if(field === 'courses' || field === 'certificates' || field === 'categories') {
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
            return 0;
        }

        setUserData({
            ...userData,
            [field]: value
        });
    }

    return <UserDataContext.Provider value={{
        setStep, setSubstep, daysVisible, monthsVisible, yearsVisible, countriesVisible, phoneNumbersCountriesVisible,
        educationVisible,
        levelsVisible, drivingLicenceVisible,
        bsnVisible,
        categoriesVisible, currenciesVisible,
        userData, handleChange
    }}>
        <div className="container container--editData flex" onClick={(e) => { hideAllDropdowns(); }}>
            <div className="editData__left noscroll">
                <a href="/" className="editData__left__logo">
                    <img className="img" src={logo} alt="portal-z-ofertami-pracy" />
                </a>

                <h2 className="editData__left__header">
                    {stepsContent[step][substep].header}
                </h2>
                <p className="editData__left__text">
                    {stepsContent[step][substep].text}
                </p>

                <div className="editData__left__steps">
                    {steps.map((item, index) => {
                        return <div className={step === index ? "flex editData__step editData__step--current" : "flex editData__step"} key={index}>
                        <span className="editData__left__step__number center">
                            {index+1}
                        </span>
                            <span className="editData__left__step__text">
                            {item}
                        </span>
                        </div>
                    })}
                </div>
            </div>

            <MobileHeader />

            <main className="editData__main">
                <header className="editData__main__header flex">
                    <div className="editData__main__header__left">
                        <a href="/" className="editData__main__header__left__link flex">
                            <img className="img" src={homeIcon} alt="home" />
                            Strona główna
                        </a>
                        {/* TODO: logowanie tu nie ma sensu, trzeba dac cos innego */}
                        <a href="/strefa-pracownika" className="editData__main__header__left__link flex">
                            <img className="img" src={backArrow} alt="logowanie" />
                            Ekran logowania
                        </a>
                    </div>

                    <LanguageSwitcher />
                </header>

                <div className="editData__formWrapper">
                    <div className="editData__steps flex">
                        {stepsContent?.map((item, index) => {
                            return <span key={index} className={step === index ? "step step--current flex" : "step flex"}>
                            {item.map((item, index) => {
                                return <span key={index} className={substep === index ? "substep substep--current" : "substep"}>
                                    </span>
                            })}
                        </span>
                        })}
                    </div>

                    <h1 className="editData__formWrapper__header">
                        {stepsMainContent[step][substep].header}
                    </h1>
                    <h2 className="editData__formWrapper__subheader">
                        {stepsMainContent[step][substep].text}
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

import React, {useEffect, useState} from 'react';
import logo from '../static/img/logo-biale.png'
import backArrow from '../static/img/back-arrow-grey.svg'
import homeIcon from '../static/img/home-icon.svg'
import {steps, stepsContent, stepsMainContent} from "../static/content";
import LanguageSwitcher from "../components/LanguageSwitcher";
import UserForm1 from "../components/UserForm1";
import UserForm2 from "../components/UserForm2";
import UserForm3 from "../components/UserForm3";

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
        drivingLicence: false,
        drivingLicenceCategories: [],
        // 4.2. Skills
        courses: [],
        certificates: [],
        // 5.1 Additional info
        currentCountry: 0,
        currentPostalCode: '',
        currentCity: '',
        haveBsnNumber: false,
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
        salaryCurrency: 0,
        category: 0,
        // 5.3 Additional info
        situationDescription: '',
        attachments: [],
        checkbox: false
    });
    const [step, setStep] = useState(2);
    const [substep, setSubstep] = useState(0);
    const [currentForm, setCurrentForm] = useState(null);

    useEffect(() => {
        switch(step) {
            case 0:
                setCurrentForm(<UserForm1 />);
                break;
            case 1:
                setCurrentForm(<UserForm2 addNewSchool={addNewSchool}
                                          deleteSchool={deleteSchool}
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
            default:
                break;
        }
    }, [step, substep]);

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

        setUserData({
            ...userData,
            [field]: value
        });
    }

    return <UserDataContext.Provider value={{
        setStep, setSubstep,
        userData, handleChange
    }}>
        <div className="container container--editData flex">
            <div className="editData__left">
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
        </div>
    </UserDataContext.Provider>
};

export default UserEditData;
export { UserDataContext }

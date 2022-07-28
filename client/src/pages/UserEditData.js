import React, {useEffect, useState} from 'react';
import logo from '../static/img/logo-biale.png'
import backArrow from '../static/img/back-arrow-grey.svg'
import homeIcon from '../static/img/home-icon.svg'
import {steps, stepsContent, stepsMainContent} from "../static/content";
import LanguageSwitcher from "../components/LanguageSwitcher";
import UserForm1 from "../components/UserForm1";

const UserDataContext = React.createContext(null);

const UserEditData = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        birthdayDay: 0,
        birthdayMonth: 0,
        birthdayYear: new Date().getFullYear()-14,
        country: 0,
        city: '',
        address: '',
        phoneNumberCountry: '',
        phoneNumber: '',
        email: ''
    });
    const [step, setStep] = useState(0);
    const [substep, setSubstep] = useState(0);
    const [currentForm, setCurrentForm] = useState(null);

    useEffect(() => {
        switch(step) {
            case 0:
                setCurrentForm(<UserForm1 />);
                break;
            default:
                break;
        }
    }, [step, substep]);

    const handleChange = (field, value) => {
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

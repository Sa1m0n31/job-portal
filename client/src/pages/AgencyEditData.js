import React, {useEffect, useState} from 'react';
import logo from "../static/img/logo-biale.png";
import {
    steps,
    stepsAgency,
    stepsAgencyContent,
    stepsAgencyMainContent,
    stepsContent,
    stepsMainContent
} from "../static/content";
import MobileHeader from "../components/MobileHeader";
import homeIcon from "../static/img/home-icon.svg";
import backArrow from "../static/img/back-arrow-grey.svg";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AgencyForm1 from "../components/AgencyForm1";

const AgencyDataContext = React.createContext(null);

const AgencyEditData = () => {
    const [agencyData, setAgencyData] = useState({
        // 1. Company data
        name: '',
        country: 0,
        postalCode: '',
        city: '',
        address: '',
        nipCountry: 'PL',
        nip: '',
        phoneNumberCountry: 'PL +48',
        phoneNumber: '',
        email: '',
        // 2. Description
        logo: null,
        logoUrl: '',
        gallery: [],
        galleryUrls: [],
        description: '',
        // 3.1 Additional info
        recruitmentProcess: '',
        benefits: '',
        // 3.2 Links
        website: '',
        facebook: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        // 4.1 Employees info
        roomType: null,
        houseType: null,
        roomDescription: '',
        parking: null,
        // 4.2 Employees info
        car: null,
        carPrice: null,
        carPriceCurrency: 0,
        bike: null,
        bikePrice: null,
        bikePriceCurrency: 0,
        costReturnWithOwnTransport: null,
        // 4.3 Employees info
        pensionContributions: null,
        holidayBenefits: null,
        holidayBenefitsFrequency: null,
        holidayBenefitsDay: null,
        holidayBenefitsMonth: null,
        salaryFrequency: 0,
        paycheckDay: 0,
        healthInsurance: null,
        healthInsuranceCost: null,
        healthInsuranceCurrency: 0
    });
    const [step, setStep] = useState(0);
    const [substep, setSubstep] = useState(0);
    const [currentForm, setCurrentForm] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [countriesVisible, setCountriesVisible] = useState(false);
    const [phoneNumbersCountriesVisible, setPhoneNumbersCountriesVisible] = useState(false);
    const [nipCountriesVisible, setNipCountriesVisible] = useState(false);

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
                setCurrentForm(<AgencyForm1 setCountriesVisible={setCountriesVisible}
                                            setPhoneNumbersCountriesVisible={setPhoneNumbersCountriesVisible}
                                            setNipCountriesVisible={setNipCountriesVisible}
                />);
                break;
            default:
                break;
        }
    }, [step, substep]);

    const prevStep = () => {

    }

    const hideAllDropdowns = () => {
        setCountriesVisible(false);
        setPhoneNumbersCountriesVisible(false);
    }

    const handleChange = (field, value) => {
        hideAllDropdowns();

        setAgencyData({
            ...agencyData,
            [field]: value
        });
    }

    return <AgencyDataContext.Provider value={{
        setStep, setSubstep, agencyData, handleChange,
        countriesVisible, phoneNumbersCountriesVisible, nipCountriesVisible
    }}>
        <div className="container container--editData flex" onClick={(e) => { hideAllDropdowns(); }}>
            <div className="editData__left noscroll">
                <a href="/" className="editData__left__logo">
                    <img className="img" src={logo} alt="portal-z-ofertami-pracy" />
                </a>

                <h2 className="editData__left__header">
                    {stepsAgencyContent[step][substep].header}
                </h2>
                <p className="editData__left__text">
                    {stepsAgencyContent[step][substep].text}
                </p>

                <div className="editData__left__steps">
                    {stepsAgency.map((item, index) => {
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

            <MobileHeader back="/" />

            <main className="editData__main">
                <header className="editData__main__header flex">
                    <div className="editData__main__header__left">
                        <a href="/" className="editData__main__header__left__link flex">
                            <img className="img" src={homeIcon} alt="home" />
                            Strona główna
                        </a>
                        <button onClick={() => { prevStep(); }}
                                className="editData__main__header__left__link flex">
                            <img className="img" src={backArrow} alt="logowanie" />
                            Wróć
                        </button>
                    </div>

                    <LanguageSwitcher />
                </header>

                <div className="editData__formWrapper">
                    <div className="editData__steps flex">
                        {stepsAgencyContent?.map((item, index) => {
                            return <span key={index} className={step === index ? "step step--current flex" : "step flex"}>
                            {item.map((item, index) => {
                                return <span key={index} className={substep === index ? "substep substep--current" : "substep"}>
                                    </span>
                            })}
                        </span>
                        })}
                    </div>

                    <h1 className="editData__formWrapper__header">
                        {stepsAgencyMainContent[step][substep].header}
                    </h1>
                    <h2 className="editData__formWrapper__subheader">
                        {stepsAgencyMainContent[step][substep].text}
                    </h2>

                    {currentForm}
                </div>
            </main>

            <footer className="mobileLanguageFooter">
                <LanguageSwitcher />
            </footer>
        </div>
    </AgencyDataContext.Provider>
};

export default AgencyEditData;
export { AgencyDataContext }

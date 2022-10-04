import React, {useContext, useEffect, useState} from 'react';
import logo from "../static/img/logo-biale.png";
import MobileHeader from "../components/MobileHeader";
import homeIcon from "../static/img/home-icon.svg";
import backArrow from "../static/img/back-arrow-grey.svg";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AgencyForm1 from "../components/AgencyForm1";
import AgencyForm2 from "../components/AgencyForm2";
import AgencyForm3a from "../components/AgencyForm3a";
import AgencyForm3b from "../components/AgencyForm3b";
import AgencyForm4a from "../components/AgencyForm4a";
import AgencyForm4b from "../components/AgencyForm4b";
import AgencyForm4c from "../components/AgencyForm4c";
import AgencyFormSummary from "../components/AgencyFormSummary";
import {getAgencyData, updateAgency} from "../helpers/agency";
import {getLoggedUserEmail} from "../helpers/others";
import settings from "../static/settings";
import {LanguageContext} from "../App";
import AgencyForm3C from "../components/AgencyForm3c";

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
        // 3.2 Where you find us
        whereYouFindOurApp: '',
        // 4.1 Employees info
        roomType: 0,
        houseType: 0,
        roomDescription: '',
        parking: null,
        // 4.2 Employees info
        carAvailable: false,
        car: null,
        carPrice: null,
        carPriceCurrency: 0,
        bikeAvailable: false,
        bike: null,
        bikePrice: null,
        bikePriceCurrency: 0,
        costReturnWithOwnTransport: 0,
        // 4.3 Employees info
        pensionContributionsAvailable: false,
        pensionContributions: null,
        holidayAllowanceType: null,
        holidayAllowanceFrequency: 0,
        holidayAllowanceDay: 0,
        holidayAllowanceMonth: 0,
        paycheckFrequency: 0,
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
    const [roomVisible, setRoomVisible] = useState(false);
    const [houseVisible, setHouseVisible] = useState(false);
    const [parkingVisible, setParkingVisible] = useState(false);
    const [carVisible, setCarVisible] = useState(false);
    const [carCurrencyVisible, setCarCurrencyVisible] = useState(false);
    const [bikeVisible, setBikeVisible] = useState(false);
    const [bikeCurrencyVisible, setBikeCurrencyVisible] = useState(false);
    const [transportCostReturnVisible, setTransportCostReturnVisible] = useState(false);
    const [pensionVisible, setPensionVisible] = useState(false);
    const [holidayAllowanceTypeVisible, setHolidayAllowanceTypeVisible] = useState(false);
    const [holidayAllowanceFrequencyVisible, setHolidayAllowanceFrequencyVisible] = useState(false);
    const [dayVisible, setDayVisible] = useState(false);
    const [monthVisible, setMonthVisible] = useState(false);
    const [paycheckFrequencyVisible, setPaycheckFrequencyVisible] = useState(false);
    const [paycheckDayVisible, setPaycheckDayVisible] = useState(false);
    const [healthInsuranceVisible, setHealthInsuranceVisible] = useState(false);
    const [healthInsuranceCurrencyVisible, setHealthInsuranceCurrencyVisible] = useState(false);
    const [carAvailableVisible, setCarAvailableVisible] = useState(false);
    const [bikeAvailableVisible, setBikeAvailableVisible] = useState(false);
    const [pensionContributionsVisible, setPensionContributionsVisible] = useState(false);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                hideAllDropdowns();
            }
        });
    }, []);

    useEffect(() => {
        setAgencyData(prevState => ({
            ...prevState,
            email: getLoggedUserEmail()
        }));

        getAgencyData()
            .then((res) => {
                if(res?.status === 200) {
                    const data = JSON.parse(res.data.data);
                    if(Object.keys(data).length > 0) {
                        setAgencyData({
                            ...data,
                            logo: null,
                            logoUrl: data.logo ? `${settings.API_URL}/${data.logo}` : null,
                            gallery: data.gallery ? data.gallery?.map((item) => {
                                return {
                                    url: item,
                                    file: null
                                }
                            }) : []
                        });
                    }
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
            case 1:
                setCurrentForm(<AgencyForm2 removeLogo={removeLogo}
                                            removeGalleryImage={removeGalleryImage}
                                            handleFileUpload={handleFileUpload}
                />);
                break;
            case 2:
                if(substep === 0) {
                    setCurrentForm(<AgencyForm3a />);
                }
                else if(substep === 1) {
                    setCurrentForm(<AgencyForm3b />);
                }
                else {
                    setCurrentForm(<AgencyForm3C />);
                }
                break;
            case 3:
                if(substep === 0) {
                    setCurrentForm(<AgencyForm4a setRoomVisible={setRoomVisible}
                                                 setHouseVisible={setHouseVisible}
                                                 setParkingVisible={setParkingVisible}
                    />);
                }
                else if(substep === 1) {
                    setCurrentForm(<AgencyForm4b setBikeCurrencyVisible={setBikeCurrencyVisible}
                                                 setCarCurrencyVisible={setCarCurrencyVisible}
                                                 setBikeVisible={setBikeVisible}
                                                 setCarVisible={setCarVisible}
                                                 setCarAvailableVisible={setCarAvailableVisible}
                                                 setBikeAvailableVisible={setBikeAvailableVisible}
                                                 setTransportCostReturnVisible={setTransportCostReturnVisible}
                    />);
                }
                else {
                    setCurrentForm(<AgencyForm4c setDayVisible={setDayVisible}
                                                 setPensionContributionsVisible={setPensionContributionsVisible}
                                                 setHealthInsuranceCurrencyVisible={setHealthInsuranceCurrencyVisible}
                                                 setHealthInsuranceVisible={setHealthInsuranceVisible}
                                                 setHolidayAllowanceFrequencyVisible={setHolidayAllowanceFrequencyVisible}
                                                 setHolidayAllowanceTypeVisible={setHolidayAllowanceTypeVisible}
                                                 setMonthVisible={setMonthVisible}
                                                 setPaycheckDayVisible={setPaycheckDayVisible}
                                                 setPaycheckFrequencyVisible={setPaycheckFrequencyVisible}
                                                 setPensionVisible={setPensionVisible}
                                                 submitAgencyData={submitAgencyData}
                    />);
                }
                break;
            case 4:
                setCurrentForm(<AgencyFormSummary />);
                break;
            default:
                break;
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [step, substep]);

    const submitAgencyData = async (agencyData) => {
        setLoading(true);

        try {
            const res = await updateAgency(agencyData);

            if(res?.status === 201) {
                setLoading(false);
                setSubstep(0);
                setStep(4);
            }
            else {
                setError(JSON.parse(c.formErrors)[1]);
                setLoading(false);
            }
        }
        catch(err) {
            setError(JSON.parse(c.formErrors)[1]);
            setLoading(false);
        }
    }

    const prevStep = () => {
        if(step === 2) {
            if(substep === 0) {
                setStep(1);
            }
            else {
                setSubstep(0);
            }
        }
        else if(step === 3) {
            if(substep === 0) {
                setStep(2);
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

    const removeGalleryImage = (i) => {
        setAgencyData(prevState => ({
            ...prevState,
            gallery: Array.from(prevState.gallery).filter((item, index) => {
                return i !== index;
            })
        }));
    }

    const removeLogo = () => {
        setAgencyData(prevState => ({
            ...prevState,
            logo: null,
            logoUrl: null
        }));
    }

    const handleFileUpload = (e) => {
        const file = e?.target?.files[0];
        if(file) {
            setAgencyData(prevState => ({
                ...prevState,
                logo: file,
                logoUrl: window.URL.createObjectURL(file)
            }));
        }
    }

    const hideAllDropdowns = () => {
        setCountriesVisible(false);
        setPhoneNumbersCountriesVisible(false);
        setNipCountriesVisible(false);
        setRoomVisible(false);
        setHouseVisible(false);
        setParkingVisible(false);
        setCarVisible(false);
        setCarCurrencyVisible(false);
        setBikeVisible(false);
        setBikeCurrencyVisible(false);
        setTransportCostReturnVisible(false);
        setPensionVisible(false);
        setHolidayAllowanceFrequencyVisible(false);
        setHolidayAllowanceTypeVisible(false);
        setDayVisible(false);
        setMonthVisible(false);
        setPaycheckFrequencyVisible(false);
        setPaycheckDayVisible(false);
        setHealthInsuranceVisible(false);
        setHealthInsuranceCurrencyVisible(false);
    }

    const handleChange = (field, value) => {
        hideAllDropdowns();

        if(field === 'gallery') {
            setAgencyData(prevState => ({
                ...prevState,
                gallery: [...prevState.gallery,
                    Array.from(value).map((item) => {
                        return {
                            url: window.URL.createObjectURL(item),
                            file: item
                        }
                    })
                ].flat()
            }))
            return 0;
        }

        setAgencyData({
            ...agencyData,
            [field]: value
        });
    }

    return <AgencyDataContext.Provider value={{
        setStep, setSubstep, agencyData, handleChange,
        countriesVisible, phoneNumbersCountriesVisible, nipCountriesVisible, pensionContributionsVisible,
        roomVisible, houseVisible, parkingVisible, loading, carAvailableVisible, bikeAvailableVisible,
        carVisible, carCurrencyVisible, bikeVisible, bikeCurrencyVisible, transportCostReturnVisible,
        pensionVisible, holidayAllowanceTypeVisible, holidayAllowanceFrequencyVisible, dayVisible, monthVisible,
        paycheckFrequencyVisible, paycheckDayVisible, healthInsuranceVisible, healthInsuranceCurrencyVisible
    }}>
        <div className="container container--editData flex" onClick={(e) => { hideAllDropdowns(); }}>
            <div className="editData__left noscroll">
                <a href="/" className="editData__left__logo">
                    <img className="img" src={logo} alt="portal-z-ofertami-pracy" />
                </a>

                <h2 className="editData__left__header">
                    {JSON.parse(c.stepsAgencyContent)[step][substep].header}
                </h2>
                <p className="editData__left__text">
                    {JSON.parse(c.stepsAgencyContent)[step][substep].text}
                </p>

                <div className="editData__left__steps">
                    {JSON.parse(c.stepsAgency).map((item, index) => {
                        return <button className={step === index ? "flex editData__step editData__step--current" : "flex editData__step"}
                                       onClick={() => { if(index !== 4) setStep(index); setSubstep(0) }}
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

            <MobileHeader back="/" />

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
                        {JSON.parse(c.stepsAgencyContent)?.map((item, index) => {
                            return <span key={index} className={step === index ? "step step--current flex" : "step flex"}>
                            {item.map((item, index) => {
                                return <span key={index} className={substep === index ? "substep substep--current" : "substep"}>
                                    </span>
                            })}
                        </span>
                        })}
                    </div>

                    <h1 className="editData__formWrapper__header">
                        {JSON.parse(c.stepsAgencyMainContent)[step][substep].header}
                    </h1>
                    <h2 className="editData__formWrapper__subheader">
                        {JSON.parse(c.stepsAgencyMainContent)[step][substep].text}
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

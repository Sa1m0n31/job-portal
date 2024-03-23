import React, {useContext, useEffect, useState} from 'react';
import background from '../static/img/register-background.png'
import logo from '../static/img/logo-czarne.png'
import arrowWhite from '../static/img/small-white-arrow.svg'
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import AfterRegister from "../components/AfterRegister";
import LoginAndRegisterAside from "../components/LoginAndRegisterAside";
import {isElementInArray, isEmail, isPasswordStrength, numberRange} from "../helpers/others";
import {registerUser, updateCvInRegister} from "../helpers/user";
import {registerAgency} from "../helpers/agency";
import Loader from "../components/Loader";
import MobileHeader from "../components/MobileHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {LanguageContext} from "../App";
import {Tooltip} from "react-tippy";
import UserOwnCvEdition from "../components/UserOwnCvEdition";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currentCity, setCurrentCity] = useState('');
    const [availabilityDay, setAvailabilityDay] = useState(0);
    const [availabilityMonth, setAvailabilityMonth] = useState(0);
    const [availabilityYear, setAvailabilityYear] = useState(new Date().getFullYear());
    const [longTermJobSeeker, setLongTermJobSeeker] = useState(false);
    const [drivingLicence, setDrivingLicence] = useState(false);
    const [ownTransport, setOwnTransport] = useState(false);
    const [ownAccommodation, setOwnAccommodation] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [situationDescription, setSituationDescription] = useState('');
    const [whereYouFindOurApp, setWhereYouFindOurApp] = useState('');

    const [daysVisible, setDaysVisible] = useState(false);
    const [monthsVisible, setMonthsVisible] = useState(false);
    const [yearsVisible, setYearsVisible] = useState(false);
    const [drivingLicenceVisible, setDrivingLicenceVisible] = useState(false);
    const [longTermJobSeekerVisible, setLongTermJobSeekerVisible] = useState(false);
    const [ownTransportVisible, setOwnTransportVisible] = useState(false);
    const [ownAccommodationVisible, setOwnAccommodationVisible] = useState(false);
    const [ownCv, setOwnCv] = useState(null);

    const [role, setRole] = useState(0);
    const [dropdownRoleVisible, setDropdownRoleVisible] = useState(false);
    const [checkbox, setCheckbox] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [allCheckboxes, setAllCheckboxes] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState('');

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        setYears(numberRange(new Date().getFullYear(), new Date().getFullYear()+3));
    }, []);

    useEffect(() => {
        const m = availabilityMonth;
        const y = availabilityYear;

        if(m === 0 || m === 2 || m === 4 || m === 6 || m === 7 || m === 9 || m === 11) {
            setDays(Array.from(Array(31).keys()));
        }
        else if(m === 1 && ((y % 4 === 0) && (y % 100 !== 0))) {
            setDays(Array.from(Array(29).keys()));
        }
        else if(m === 1) {
            setDays(Array.from(Array(28).keys()));
        }
        else {
            setDays(Array.from(Array(30).keys()));
        }
    }, [availabilityMonth, availabilityYear]);

    useEffect(() => {
        setDaysVisible(false);
    }, [availabilityDay]);

    useEffect(() => {
        setMonthsVisible(false);
    }, [availabilityMonth]);

    useEffect(() => {
        setYearsVisible(false);
    }, [availabilityYear]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('typ');

        if(type === 'pracodawca') {
            setRole(1);
        }
    }, []);

    useEffect(() => {
        setDropdownRoleVisible(false);
    }, [role]);

    useEffect(() => {
        if(allCheckboxes) {
            setNewsletter(true);
            setCheckbox(true);
        }
        else {
            setNewsletter(false);
            setCheckbox(false);
        }
    }, [allCheckboxes]);

    useEffect(() => {
        setError('');
    }, [email, password, repeatPassword, checkbox]);

    const dropdownRole = () => {
        setDropdownRoleVisible(!dropdownRoleVisible);
    }

    const toggleLanguage = (i) => {
        setLanguages(prevState => {
            return isElementInArray(i, prevState.map((item) => (item.language))) ? prevState.filter((item) => {
                return item.language !== i;
            }) : [...prevState, {
                language: i,
                lvl: 'A1'
            }]
        })
    }

    const validateData = () => {
        if(!isEmail(email)) {
            setError(c.registerError1);
            return false;
        }
        if(!isPasswordStrength(password)) {
            setError(c.passwordError3);
            return false;
        }
        if(password !== repeatPassword) {
            setError(c.passwordError2);
            return false;
        }
        if(!checkbox) {
            setError(c.registerError2);
            return false;
        }

        if((role === 0) && (!phoneNumber || !currentCity || !firstName || !lastName)) {
            setError(c.passwordError1);
            return false;
        }

        return true;
    }

    const register = () => {
        if(validateData()) {
            setLoading(true);
            const registerFunc = role === 0 ? registerUser : registerAgency;

            const mailContent = JSON.stringify([
                c.mail1, c.mail2, c.mail3, c.mail4
            ]);

            const dataToSend = JSON.stringify({
                // 1. Personal data
                profileImage: null,
                profileImageUrl: '',
                firstName: firstName,
                lastName: lastName,
                birthdayDay: 0,
                birthdayMonth: 0,
                birthdayYear: 2000,
                country: 34,
                city: '',
                postalCode: '',
                address: '',
                phoneNumberCountry: 'PL +48',
                phoneNumber: phoneNumber,
                email: email,
                // 2. Education
                education: 0,
                schools: [],
                // 3. Experience
                jobs: [],
                // 4.1. Skills
                languages: languages,
                extraLanguages: '',
                drivingLicence: drivingLicence,
                drivingLicenceCategories: [],
                // 4.2. Skills
                courses: [],
                certificates: [],
                skills: [],
                // 5.1 Additional info
                currentCountry: 0,
                currentPostalCode: '',
                currentCity: currentCity,
                hasBsnNumber: false,
                bsnNumber: '',
                bsnNumberDocument: null,
                availabilityDay: availabilityDay,
                availabilityMonth: availabilityMonth,
                availabilityYear: availabilityYear,
                longTermJobSeeker: longTermJobSeeker,
                ownTransport: ownTransport,
                ownTransportType: 0,
                // 5.2 Additional info
                ownAccommodation: ownAccommodation,
                accommodationPlace: '',
                ownTools: null,
                ownToolsDescription: '',
                salaryType: 0,
                salaryFrom: null,
                salaryTo: null,
                salaryCurrency: 0,
                categories: ['-'],
                // 5.3 Additional info
                situationDescription: situationDescription,
                attachments: [],
                oldAttachments: [],
                checkbox: false,
                // 5.4 Additional info
                friendLink: '',
                whereYouFindOurApp: ''
            });

            registerFunc(email, password, newsletter, mailContent, dataToSend)
                .then((res) => {
                    setLoading(false);
                    if(res?.status === 201) {
                        if(ownCv) {
                            updateCvInRegister(ownCv, email)
                                .then((res) => {
                                    setError('');
                                    setRegistered(true);
                                })
                                .catch(() => {
                                    setError(JSON.parse(c.formErrors)[1]);
                                });
                        }
                        else {
                            setError('');
                            setRegistered(true);
                        }
                    }
                    else {
                        setError(JSON.parse(c.formErrors)[1]);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    if(err?.response?.status === 400) {
                        setError(c.emailAlreadyExists);
                    }
                    else {
                        setError(JSON.parse(c.formErrors)[1]);
                    }
                });
        }
    }

    return <div className="container container--register center"
                onClick={() => { setDropdownRoleVisible(false); }}>
        <img className="registerImg" src={background} alt="rejestracja" />

        <MobileHeader back="/" />

        {registered ? <AfterRegister type={role} /> : (loading ? <Loader /> : <main className="register page--50">
            <img className="register__logo" src={logo} alt="portal-pracy" />
            <h1 className="register__header">
                {c.quickRegister}
            </h1>
            {/*<h2 className="register__subheader">*/}
            {/*    {c.quickRegisterDescription}*/}
            {/*</h2>*/}

            <label className="label">
                {c.accountType}
                <button className="register__accountType flex" onClick={(e) => { e.stopPropagation(); dropdownRole(); }}>
                    {role === 0 ? c.accountTypeUser : c.accountTypeAgency}
                    <img className="img" src={dropdownArrow} alt="rozwiń" />
                </button>
                {dropdownRoleVisible ? <button className="register__accountType register__accountType--dropdown flex"
                                               onClick={(e) => { e.stopPropagation(); setRole(role === 0 ? 1 : 0); }}
                >
                    {role === 1 ? c.accountTypeUser : c.accountTypeAgency}
                </button> : ''}
            </label>

            {role === 0 ? <>
                <div className={'formFlex'}>
                    <label className="label">
                        {c.firstName} *
                        <input className="input"
                               value={firstName}
                               onChange={(e) => { setFirstName(e.target.value); }} />
                    </label>
                    <label className="label">
                        {c.lastName} *
                        <input className="input"
                               value={lastName}
                               onChange={(e) => { setLastName(e.target.value); }} />
                    </label>
                </div>
                <div className={'formFlex'}>
                    <label className="label">
                        {c.email} *
                        <input className="input"
                               value={email}
                               onChange={(e) => { setEmail(e.target.value); }} />
                    </label>
                    <label className="label">
                        {c.phoneNumber} *
                        <input className="input"
                               value={phoneNumber}
                               onChange={(e) => { setPhoneNumber(e.target.value); }} />
                    </label>
                </div>
                <div className={'formFlex'}>
                    <label className="label">
                        {c.password} *
                        <input className="input"
                               type={"password"}
                               value={password}
                               onChange={(e) => { setPassword(e.target.value); }} />
                    </label>
                    <label className="label">
                        {c.repeatPassword} *
                        <input className="input"
                               type={"password"}
                               value={repeatPassword}
                               onChange={(e) => { setRepeatPassword(e.target.value); }} />
                    </label>
                </div>
                <label className="label">
                    {c.currentLivingPlace} *
                    <input className="input"
                           value={currentCity}
                           onChange={(e) => { setCurrentCity(e.target.value); }} />
                </label>

                <div className={'formFlex'}>
                    <div>
                        <p className="label--extraInfo">
                            {c.drivingLicenceDescription} *
                        </p>
                        <div className="label--date__input label--date__input--bool">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.stopPropagation(); setDrivingLicenceVisible(p => !p); }}>
                                {drivingLicence ? c.yes : c.no}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {drivingLicenceVisible ? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={() => { setDrivingLicenceVisible(false); setDrivingLicence(p => !p); }}>
                                    {drivingLicence ? c.no : c.yes}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                    <div>
                        <p className="label--extraInfo">
                            {c.longTermQuestion} *
                        </p>
                        <div className="label--date__input label--date__input--bool">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.stopPropagation(); setLongTermJobSeekerVisible(p => !p); }}>
                                {longTermJobSeeker ? c.yes : c.no}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {longTermJobSeekerVisible ? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={() => { setLongTermJobSeekerVisible(false); setLongTermJobSeeker(p => !p); }}>
                                    {longTermJobSeeker ? c.no : c.yes}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                </div>
                <div className={'formFlex'} style={{marginTop: '20px'}}>
                    <div>
                        <p className="label--extraInfo">
                            {c.ownTransport} *
                        </p>
                        <div className="label--date__input label--date__input--bool">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.stopPropagation(); setOwnTransportVisible(p => !p); }}>
                                {ownTransport ? c.yes : c.no}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {ownTransportVisible ? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={() => { setOwnTransportVisible(false); setOwnTransport(p => !p); }}>
                                    {ownTransport ? c.no : c.yes}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                    <div>
                        <p className="label--extraInfo">
                            {c.ownAccommodationInNetherlands} *
                        </p>
                        <div className="label--date__input label--date__input--bool">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.stopPropagation(); setOwnAccommodationVisible(p => !p); }}>
                                {ownAccommodation ? c.yes : c.no}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {ownAccommodationVisible ? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={() => { setOwnAccommodationVisible(false); setOwnAccommodation(p => !p); }}>
                                    {ownAccommodation ? c.no : c.yes}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                </div>

                <div className={'register__foreignLanguages'}>
                    <div className={"label"}>
                        {c.foreignLanguages.charAt(0).toUpperCase() + c.foreignLanguages.slice(1)} *
                        <div className="languagesWrapper flex">
                            {JSON.parse(c.languages).map((item, index) => {
                                if(index < 3) {
                                    return <label className={isElementInArray(index, Array.isArray(languages) ? languages.map((item) => (item.language)) : []) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                                        <button className={isElementInArray(index, Array.isArray(languages) ? languages.map((item) => (item.language)) : []) ? "checkbox checkbox--selected center" : "checkbox center"}
                                                onClick={() => { toggleLanguage(index); }}>
                                            <span></span>
                                        </button>
                                        {item}
                                    </label>
                                }
                            })}
                        </div>
                    </div>
                </div>

                <div className="label label--date label--date--register">
                    <p className="label--extraInfo label--extraInfo--marginBottom">
                        {c.whenAreYouReady} *
                    </p>
                    <div className="label--flex">
                        {/* DAY */}
                        <div className="label--date__input">
                            <button className="datepicker datepicker--day"
                                    onClick={(e) => { e.stopPropagation(); setDaysVisible(!daysVisible); }}
                            >
                                {availabilityDay ? availabilityDay+1 : 1}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {daysVisible ? <div className="datepickerDropdown noscroll">
                                {days?.map((item, index) => {
                                    return <button className="datepickerBtn center" key={index}
                                                   onClick={() => { setDaysVisible(false); setAvailabilityDay(item); }}>
                                        {item+1}
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                        {/* MONTH */}
                        <div className="label--date__input">
                            <button className="datepicker datepicker--month"
                                    onClick={(e) => { e.stopPropagation(); setMonthsVisible(!monthsVisible); }}
                            >
                                {JSON.parse(c.months)[availabilityMonth] ? JSON.parse(c.months)[availabilityMonth] : c.month}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {monthsVisible ? <div className="datepickerDropdown noscroll">
                                {JSON.parse(c.months)?.map((item, index) => {
                                    return <button className="datepickerBtn center" key={index}
                                                   onClick={() => { setMonthsVisible(false); setAvailabilityMonth(index); }}>
                                        {item}
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                        {/* YEARS */}
                        <div className="label--date__input">
                            <button className="datepicker datepicker--year"
                                    onClick={(e) => { e.stopPropagation(); setYearsVisible(!yearsVisible); }}
                            >
                                {availabilityYear ? availabilityYear : c.year}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {yearsVisible ? <div className="datepickerDropdown noscroll">
                                {years?.map((item, index) => {
                                    return <button className="datepickerBtn center" key={index}
                                                   onClick={(e) => { e.stopPropagation(); setYearsVisible(false); setAvailabilityYear(item); }}>
                                        {item}
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                    </div>
                </div>

                <label className="label label--rel certificatesWrapper flex">
                    <span>
                        {c.currentSituationDescription}
                        <Tooltip
                            html={<span className="tooltipVisible">
                                {c.situationTooltip}
                                        </span>}
                            followCursor={true}
                            position="right"
                        >
                            <div className="tooltip">
                                ?
                            </div>
                        </Tooltip>
                    </span>
                    <span className="letterCounter">
                        {situationDescription.length} / 1000
                    </span>
                    <textarea className="input input--textarea input--situation"
                              value={situationDescription}
                              onChange={(e) => { setSituationDescription(e.target.value); }}
                              placeholder={c.currentSituationPlaceholder} />
                </label>

                <UserOwnCvEdition ownCv={ownCv}
                                  setOwnCv={setOwnCv} />
            </> : <>
                <label className="label">
                    {c.email}
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }} />
                </label>
                <label className="label">
                    {c.password}
                    <input className="input"
                           type={"password"}
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }} />
                </label>
                <label className="label">
                    {c.repeatPassword}
                    <input className="input"
                           type={"password"}
                           value={repeatPassword}
                           onChange={(e) => { setRepeatPassword(e.target.value); }} />
                </label>
            </>}

            <label className="label label--flex label--checkbox">
                <button className={checkbox ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { setCheckbox(!checkbox); }}>
                    <span></span>
                </button>
                <span>
                    {c.accept} <a href="/regulamin">{c.termsOfServiceHeader}</a> {c.and} <a href="/polityka prywatności">{c.privacyPolicyHeader2}</a> *.
                </span>
            </label>
            <label className="label label--flex label--checkbox newsletterCheckbox">
                <button className={newsletter ? "checkbox checkbox--newsletter checkbox--selected center" : "checkbox checkbox--newsletter center"} onClick={() => { setNewsletter(!newsletter); }}>
                    <span></span>
                </button>
                <span>
                    {c.newsletterCheckbox}
                </span>
            </label>
            <label className="label label--flex label--checkbox">
                <button className={allCheckboxes ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { setAllCheckboxes(!allCheckboxes); }}>
                    <span></span>
                </button>
                <span>
                    {c.allCheckboxes}
                </span>
            </label>

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            <button className="btn btn--login" onClick={register}>
                {c.createAccount}
                <img className="img" src={arrowWhite} alt="przejdź-dalej" />
            </button>
            <a className="register__link" href={role === 0 ? "/strefa-pracownika" : "/strefa-pracodawcy"}>
                {c.haveAccountQuestion}
            </a>
            <LoginAndRegisterAside />
        </main>)}

        <LoggedUserFooter />
    </div>
};

export default Register;

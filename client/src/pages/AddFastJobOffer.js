import React, {useContext, useEffect, useRef, useState} from 'react';
import logo from '../static/img/logo-czarne.png'
import backIcon from '../static/img/back-arrow-grey.svg'
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {
    currencies,
    phoneNumbers
} from "../static/content";
import trashIcon from "../static/img/trash.svg";
import {Tooltip} from "react-tippy";
import plusIcon from "../static/img/plus-in-circle.svg";
import plusGrey from '../static/img/plus-icon-opacity.svg'
import {getLoggedUserEmail, isElementInArray, numberRange} from "../helpers/others";
import fileIcon from "../static/img/doc.svg";
import checkIcon from '../static/img/green-check.svg'
import arrowIcon from '../static/img/small-white-arrow.svg'
import {
    addFastOffer,
    getActiveFastOffers, getFastOfferById,
    updateFastOffer
} from "../helpers/offer";
import settings from "../static/settings";
import xIcon from '../static/img/x-button.svg'
import MobileHeader from "../components/MobileHeader";
import Loader from "../components/Loader";
import {LanguageContext} from "../App";

const AddFastJobOffer = ({updateMode}) => {
    const { c } = useContext(LanguageContext);

    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [accommodationCountriesVisible, setAccommodationCountriesVisible] = useState(false);
    const [currenciesVisible, setCurrenciesVisible] = useState(false);
    const [timeBoundedVisible, setTimeBoundedVisible] = useState(false);
    const [dayVisible, setDayVisible] = useState(false);
    const [monthVisible, setMonthVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);
    const [startDayVisible, setStartDayVisible] = useState(false);
    const [startMonthVisible, setStartMonthVisible] = useState(false);
    const [startYearVisible, setStartYearVisible] = useState(false);
    const [numberVisible, setNumberVisible] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(-1);
    const [keywords, setKeywords] = useState('');
    const [country, setCountry] = useState(-1);
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [accommodationCountry, setAccommodationCountry] = useState(-1);
    const [accommodationPostalCode, setAccommodationPostalCode] = useState('');
    const [accommodationCity, setAccommodationCity] = useState('');
    const [accommodationStreet, setAccommodationStreet] = useState('');
    const [description, setDescription] = useState('');
    const [responsibilities, setResponsibilities] = useState(['']);
    const [requirements, setRequirements] = useState(['']);
    const [benefits, setBenefits] = useState(['']);
    const [salaryType, setSalaryType] = useState(-1);
    const [salaryFrom, setSalaryFrom] = useState(null);
    const [salaryTo, setSalaryTo] = useState(null);
    const [salaryCurrency, setSalaryCurrency] = useState(0);
    const [contractType, setContractType] = useState([]);
    const [timeBounded, setTimeBounded] = useState(true);
    const [day, setDay] = useState(-1);
    const [month, setMonth] = useState(-1);
    const [year, setYear] = useState(-1);
    const [hour, setHour] = useState('');
    const [startDay, setStartDay] = useState(-1);
    const [startMonth, setStartMonth] = useState(-1);
    const [startYear, setStartYear] = useState(-1);
    const [startHour, setStartHour] = useState('');
    const [image, setImage] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [oldAttachments, setOldAttachments] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [showAgencyInfo, setShowAgencyInfo] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactNumberCountry, setContactNumberCountry] = useState(0);
    const [contactNumber, setContactNumber] = useState('');
    const [companyName, setCompanyName] = useState('');

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);
    const [startDays, setStartDays] = useState([]);
    const [error, setError] = useState('');

    const [numberOfFastOffers, setNumberOfFastOffers] = useState(0);
    const [limitExceeded, setLimitExceeded] = useState(-1); // 1 - global limit, 2 - user limit

    const addOfferForm = useRef(null);
    const addOfferSuccess = useRef(null);

    const setInitialData = (data) => {
        setOldAttachments(data.o_attachments ? JSON.parse(data.o_attachments) : []);
        setBenefits(JSON.parse(data.o_benefits));
        setCategory(parseInt(data.o_category));
        setCity(data.o_city);
        setContractType(data.o_contractType);
        setCountry(data.o_country);
        setDescription(data.o_description);
        setDay(data.o_accommodationDay);
        setMonth(data.o_accommodationMonth);
        setYear(data.o_accommodationYear);
        setHour(data.o_accommodationHour);
        setId(data.o_id);
        setImage(null);
        setImageUrl(data.o_image);
        setKeywords(data.o_keywords);
        setPostalCode(data.o_postalCode);
        setRequirements(JSON.parse(data.o_requirements));
        setResponsibilities(JSON.parse(data.o_responsibilities));
        setSalaryCurrency(data.o_salaryCurrency);
        setSalaryFrom(data.o_salaryFrom);
        setSalaryTo(data.o_salaryTo);
        setSalaryType(data.o_salaryType);
        setTimeBounded(data.o_timeBounded);
        setTitle(data.o_title);
        setStreet(data.o_street);
        setAccommodationStreet(data.o_accommodationStreet);
        setAccommodationCountry(data.o_accommodationCountry);
        setAccommodationCity(data.o_accommodationCity);
        setAccommodationPostalCode(data.o_accommodationPostalCode);
        setStartYear(data.o_startYear);
        setStartMonth(data.o_startMonth);
        setStartDay(data.o_startDay);
        setStartHour(data.o_startHour);
        setContactPerson(data.o_contactPerson);
        setContactNumberCountry(data.o_contactNumberCountry);
        setContactNumber(data.o_contactNumber);
    }

    useEffect(() => {
        setYears(numberRange(new Date().getFullYear(), new Date().getFullYear()+4));

        getActiveFastOffers()
            .then((res) => {
               if(res?.status === 200) {
                   let n = res?.data?.length;
                   setNumberOfFastOffers(n);
                   if(n >= 15) {
                       setLimitExceeded(1);
                   }
                   else {
                       const agencyEmail = getLoggedUserEmail();
                       if(res?.data?.filter((item) => {
                           return item.a_email === agencyEmail;
                       })?.length >= 2) {
                           setLimitExceeded(2);
                       }
                       else {
                           setLimitExceeded(0);
                       }
                   }
               }
            });
    }, []);

    useEffect(() => {
        if(updateMode) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if(id) {
                getFastOfferById(id)
                    .then((res) => {
                       if(res?.status === 200) {
                           setInitialData(res?.data[0]);
                       }
                       else {
                           window.location = '/';
                       }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            }
            else {
                window.location = '/';
            }
        }
    }, [updateMode]);

    useEffect(() => {
        const m = month;
        const y = year;

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
    }, [month, year]);

    useEffect(() => {
        const m = startMonth;
        const y = startYear;

        if(m === 0 || m === 2 || m === 4 || m === 6 || m === 7 || m === 9 || m === 11) {
            setStartDays(Array.from(Array(31).keys()));
        }
        else if(m === 1 && ((y % 4 === 0) && (y % 100 !== 0))) {
            setStartDays(Array.from(Array(29).keys()));
        }
        else if(m === 1) {
            setStartDays(Array.from(Array(28).keys()));
        }
        else {
            setStartDays(Array.from(Array(30).keys()));
        }
    }, [startMonth, startYear]);

    const hideAllDropdowns = () => {
        setCountriesVisible(false);
        setCategoriesVisible(false);
        setCurrenciesVisible(false);
        setTimeBoundedVisible(false);
        setDayVisible(false);
        setMonthVisible(false);
        setYearVisible(false);
        setAccommodationCountriesVisible(false);
        setStartDayVisible(false);
        setStartMonthVisible(false);
        setStartYearVisible(false);
        setNumberVisible(false);
    }

    const updateResponsibilities = (value, i) => {
        setResponsibilities(prevState => (prevState.map((item, index) => {
            if(index === i) {
                return value;
            }
            else {
                return item;
            }
        })));
    }

    const deleteResponsibility = (i) => {
        setResponsibilities(prevState => (prevState.filter((item, index) => (index !== i))));
    }

    const addNewResponsibility = () => {
        setResponsibilities(prevState => ([...prevState, '']));
    }

    const updateRequirements = (value, i) => {
        setRequirements(prevState => (prevState.map((item, index) => {
            if(index === i) {
                return value;
            }
            else {
                return item;
            }
        })));
    }

    const deleteRequirement = (i) => {
        setRequirements(prevState => (prevState.filter((item, index) => (index !== i))));
    }

    const addNewRequirement = () => {
        setRequirements(prevState => ([...prevState, '']));
    }

    const updateBenefits = (value, i) => {
        setBenefits(prevState => (prevState.map((item, index) => {
            if(index === i) {
                return value;
            }
            else {
                return item;
            }
        })));
    }

    const deleteBenefit = (i) => {
        setBenefits(prevState => (prevState.filter((item, index) => (index !== i))));
    }

    const addNewBenefit = () => {
        setBenefits(prevState => ([...prevState, '']));
    }

    const handleImageUpload = (e) => {
        const file = e?.target?.files[0];
        if(file) {
            setImage(file);
            setImageUrl(window.URL.createObjectURL(file));
        }
    }

    const removeImage = () => {
        setImage(null);
        setImageUrl(null);
    }

    const handleAttachments = (e) => {
        e.preventDefault();

        if(e.target.files.length + oldAttachments.length > 5) {
            e.preventDefault();
            setError(JSON.parse(c.attachmentsErrors)[0]);
        }
        else {
            setError('');
            setAttachments(Array.from(e.target.files).map((item) => {
                return {
                    name: item.name,
                    file: item
                }
            }));
        }
    }

    const changeAttachmentName = (i, val, old = false) => {
        if(old) {
            setOldAttachments(prevState => (prevState.map((item, index) => {
                if(index === i) {
                    return {
                        name: val,
                        path: item.path
                    }
                }
                else {
                    return item;
                }
            })));
        }
        else {
            setAttachments(prevState => (prevState.map((item, index) => {
                if(index === i) {
                    return {
                        name: val,
                        file: item.file
                    }
                }
                else {
                    return item;
                }
            })));
        }
    }

    const removeAttachment = (i, old = false) => {
        if(old) {
            setOldAttachments(prevState => (prevState.filter((item, index) => (index !== i))));
        }
        else {
            setAttachments(prevState => (prevState.filter((item, index) => (index !== i))));
        }
    }

    const jobOfferValidation = () => {
        if(!title || category === -1 || country === -1 || !postalCode || !city ||
            !description || !responsibilities.length || !requirements.length || !benefits.length ||
            salaryType === -1 || salaryFrom === null || salaryTo === null ||
            day === -1 || month === -1 || !hour ||
            startDay === -1 || startMonth === -1 || !startHour ||
            accommodationCountry === -1 || !accommodationPostalCode || !accommodationCity ||
            !contactPerson || !contactNumber || (!image && !imageUrl)
        ) {
            setError(JSON.parse(c.jobOfferErrors)[0]);
            return 0;
        }
        return 1;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(jobOfferValidation()) {
            setLoading(true);
            try {
                if(updateMode) {
                    const offerResult = await updateFastOffer({
                        id, title, category, keywords, country, postalCode, city, street, description,
                        accommodationCountry, accommodationPostalCode, accommodationCity, accommodationStreet,
                        accommodationDay: day,
                        accommodationMonth: month,
                        accommodationYear: year,
                        accommodationHour: hour,
                        startDay, startMonth, startYear, startHour,
                        responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
                        salaryCurrency, contractType, contactPerson, contactNumberCountry, contactNumber,
                        image, attachments, oldAttachments, extraInfo,
                        show_agency_info: showAgencyInfo
                    });
                    if(offerResult.status === 200) {
                        setSuccess(true);
                        setLoading(false);
                    }
                    else {
                        setError(JSON.parse(c.formErrors)[1]);
                        setLoading(false);
                    }
                }
                else {
                    const offerResult = await addFastOffer({
                        title, category, keywords, country, postalCode, city, street, description,
                        accommodationCountry, accommodationPostalCode, accommodationCity, accommodationStreet,
                        accommodationDay: day,
                        accommodationMonth: month,
                        accommodationYear: year,
                        accommodationHour: hour,
                        startDay, startMonth, startYear, startHour,
                        responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
                        salaryCurrency, contractType, contactPerson, contactNumberCountry, contactNumber,
                        image, attachments, extraInfo,
                        show_agency_info: showAgencyInfo
                    });
                    if(offerResult.status === 201) {
                        setSuccess(true);
                        setLoading(false);
                    }
                    else {
                        setError(JSON.parse(c.formErrors)[1]);
                        setLoading(false);
                    }
                }
            }
            catch(err) {
                if(err.response.data.statusCode === 415) {
                    setError(c.unsupportedMediaTypeInfo);
                }
                else {
                    setError(JSON.parse(c.formErrors)[1]);
                }
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if(success) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            addOfferForm.current.style.opacity = '0';
            addOfferSuccess.current.style.opacity = '1';
            addOfferSuccess.current.style.height = 'auto';
            addOfferSuccess.current.style.visibility = 'visible';
        }
    }, [success]);

    const toggleContract = (i) => {
        if(isElementInArray(i, contractType)) {
            setContractType(prevState => (prevState.filter((item) => (item !== i))));
        }
        else {
            setContractType(prevState => ([...prevState, i]));
        }
    }

    return <div className="container container--addOffer container--addFastOffer" onClick={() => { hideAllDropdowns(); }}>
        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{c.agencyZone}</span>
                </span>
            <a href="/konto-agencji"
               className="userAccount__top__btn">
                <img className="img" src={backIcon} alt="edytuj" />
                {c.comeback}
            </a>
        </aside>

        <MobileHeader back="/" />

        <a className="addOffer__logo" href="/konto-agencji">
            <img className="img" src={logo} alt="logo" />
        </a>
        <div className="addOfferSuccess" ref={addOfferSuccess}>
            <img className="img" src={checkIcon} alt="check" />
            <h3 className="addOfferSuccess__header">
                {updateMode ? c.fastOfferUpdated : c.fastOfferAdded}
            </h3>
            <div className="flex">
                <a className="btn" href="/">
                    {c.homepage}
                </a>
                <a className="btn btn--white" href="/moje-blyskawiczne-oferty-pracy">
                    {c.myFastOffers}
                </a>
            </div>
        </div>
        {!limitExceeded ? <form className="addOffer" ref={addOfferForm}>
            <h1 className="addOffer__header">
                {updateMode ? c.fastOfferEdition : c.fastOfferAdding}
            </h1>
            <p className="addOffer__text">
                {c.fastOfferAddingDescription}
            </p>
            <p className="addOffer__text addOffer__text--fast">
                {c.fastOfferLimitInfo}
            </p>
            <p className="addOffer__text addOffer__text--fast addOffer__text--fast--limitInfo">
                {c.limitInfo}: <span className="red">{numberOfFastOffers}/15</span>
            </p>

            <label className="label">
                {c.post}
                <input className="input"
                       value={title}
                       onChange={(e) => { setTitle(e.target.value); }} />
            </label>
            <div className="label label--responsibility label--category">
                {c.category}
                <div className="label--date__input label--date__input--country label--date__input--category">
                    <button className="datepicker datepicker--country datepicker--category"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCategoriesVisible(!categoriesVisible); }}
                    >
                        {category !== -1 ? JSON.parse(c.categories)[category] : c.chooseCategory}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {categoriesVisible ? <div className="datepickerDropdown noscroll">
                        {JSON.parse(c.categories)?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation(); setCategoriesVisible(false); setCategory(index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>

            <div className="label label--special">
                <span className="flex flex--start">
                    <span>
                        {c.keywords}
                    </span>
                    <Tooltip
                        html={<span className="tooltipVisible">
                            {c.keywordsTooltip}
                                    </span>}
                        followCursor={true}>
                            <span className="tooltip">
                                ?
                            </span>
                    </Tooltip>
                </span>
                <input className="input--special"
                       value={keywords}
                       onChange={(e) => { setKeywords(e.target.value); }}
                       placeholder={c.keywordsPlaceholder} />
            </div>

            <div className="label label--date label--date--address">
                {c.jobPlace}
                <div className="flex flex-wrap flex--fastOffer">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                        >
                            {country !== -1 ? JSON.parse(c.countries)[country] : c.chooseCountry}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {countriesVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.countries)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault();
                                               setCountry(index);
                                               setCountriesVisible(false); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label--city">
                        <input className="input input--address"
                               value={city}
                               onChange={(e) => { setCity(e.target.value); }}
                               placeholder={c.city} />
                    </label>
                    <label className="label--postalCode">
                        <input className="input input--city"
                               value={postalCode}
                               onChange={(e) => { setPostalCode(e.target.value); }}
                               placeholder={c.postalCode} />
                    </label>

                    <label className="label--postalCode">
                        <input className="input input--city"
                               value={companyName}
                               onChange={(e) => { setCompanyName(e.target.value); }}
                               placeholder={c.companyNameShort} />
                    </label>
                    {/*<label className="label--street">*/}
                    {/*    <input className="input input--address"*/}
                    {/*           value={street}*/}
                    {/*           onChange={(e) => { setStreet(e.target.value); }}*/}
                    {/*           placeholder={c.streetAndBuilding} />*/}
                    {/*</label>*/}
                </div>
            </div>

            <div className="label label--date label--date--address">
                {c.accommodationPlace}
                <div className="flex flex-wrap flex--fastOffer">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAccommodationCountriesVisible(!accommodationCountriesVisible); }}
                        >
                            {accommodationCountry !== -1 ? JSON.parse(c.countries)[accommodationCountry] : 'Wybierz kraj'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {accommodationCountriesVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.countries)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); setAccommodationCountry(index); setAccommodationCountriesVisible(false); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label--city">
                        <input className="input input--address"
                               value={accommodationCity}
                               onChange={(e) => { setAccommodationCity(e.target.value); }}
                               placeholder={c.city} />
                    </label>
                    <label className="label--postalCode">
                        <input className="input input--city"
                               value={accommodationPostalCode}
                               onChange={(e) => { setAccommodationPostalCode(e.target.value); }}
                               placeholder={c.postalCode} />
                    </label>
                    {/*<label className="label--street">*/}
                    {/*    <input className="input input--address"*/}
                    {/*           value={accommodationStreet}*/}
                    {/*           onChange={(e) => { setAccommodationStreet(e.target.value); }}*/}
                    {/*           placeholder={c.streetAndBuilding} />*/}
                    {/*</label>*/}
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                {c.accommodationDate}
                <div className="flex flex-wrap flex--fastOffer">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--day"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDayVisible(!dayVisible); }}
                        >
                            {day !== -1 ? day+1 : c.day}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {dayVisible ? <div className="datepickerDropdown noscroll">
                            {days?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); setDayVisible(false); setDay(item); }}>
                                    {item+1}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* MONTH */}
                    <div className="label--date__input label--city">
                        <button className="datepicker datepicker--month"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMonthVisible(!monthVisible); }}
                        >
                            {month !== -1 ? JSON.parse(c.months)[month] : c.month}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {monthVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.months)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMonthVisible(false); setMonth(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* YEARS */}
                    {/*<div className="label--date__input label--postalCode">*/}
                    {/*    <button className="datepicker datepicker--year"*/}
                    {/*            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setYearVisible(!yearVisible); }}*/}
                    {/*    >*/}
                    {/*        {year !== -1 ? year : c.year}*/}
                    {/*        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />*/}
                    {/*    </button>*/}
                    {/*    {yearVisible ? <div className="datepickerDropdown noscroll">*/}
                    {/*        {years?.map((item, index) => {*/}
                    {/*            return <button className="datepickerBtn center" key={index}*/}
                    {/*                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); setYearVisible(false); setYear(item); }}>*/}
                    {/*                {item}*/}
                    {/*            </button>*/}
                    {/*        })}*/}
                    {/*    </div> : ''}*/}
                    {/*</div>*/}
                    <label className="label--street">
                        <input className="input input--address"
                               value={hour}
                               onChange={(e) => { setHour(e.target.value); }}
                               placeholder={c.hour} />
                    </label>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                {c.startWorkDate}
                <div className="flex flex-wrap flex--fastOffer">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--day"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartDayVisible(!startDayVisible); }}
                        >
                            {startDay !== -1 ? startDay+1 : c.day}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {startDayVisible ? <div className="datepickerDropdown noscroll">
                            {startDays?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); setStartDayVisible(false); setStartDay(item); }}>
                                    {item+1}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* MONTH */}
                    <div className="label--date__input label--city">
                        <button className="datepicker datepicker--month"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartMonthVisible(!startMonthVisible); }}
                        >
                            {startMonth !== -1 ? JSON.parse(c.months)[startMonth] : c.month}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {startMonthVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.months)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartMonthVisible(false); setStartMonth(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* YEARS */}
                    {/*<div className="label--date__input label--postalCode">*/}
                    {/*    <button className="datepicker datepicker--year"*/}
                    {/*            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartYearVisible(!startYearVisible); }}*/}
                    {/*    >*/}
                    {/*        {startYear !== -1 ? startYear : c.year}*/}
                    {/*        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />*/}
                    {/*    </button>*/}
                    {/*    {startYearVisible ? <div className="datepickerDropdown noscroll">*/}
                    {/*        {years?.map((item, index) => {*/}
                    {/*            return <button className="datepickerBtn center" key={index}*/}
                    {/*                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartYearVisible(false); setStartYear(item); }}>*/}
                    {/*                {item}*/}
                    {/*            </button>*/}
                    {/*        })}*/}
                    {/*    </div> : ''}*/}
                    {/*</div>*/}
                    <label className="label--street">
                        <input className="input input--address"
                               value={startHour}
                               onChange={(e) => { setStartHour(e.target.value); }}
                               placeholder={c.hour} />
                    </label>
                </div>
            </div>

            <label className="label label--rel">
                {c.postDescriotion}
                <textarea className="input input--textarea input--situation"
                          value={description}
                          onChange={(e) => { setDescription(e.target.value); }}
                          placeholder={c.postDescriptionPlaceholder} />
            </label>

            <div className="label">
                {c.responsibilities}
                {responsibilities.map((item, index) => {
                    return <label className="label label--responsibility" key={index}>
                        <input className="input"
                               value={item}
                               onChange={(e) => { e.preventDefault(); updateResponsibilities(e.target.value, index); }} />
                        <button className="deleteSchoolBtn" onClick={(e) => { e.preventDefault(); deleteResponsibility(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                    </label>
                })}

                <button className="addNewBtn addNewBtn--responsibility flex" onClick={(e) => { e.preventDefault(); addNewResponsibility(); }}>
                    {c.addResponsibility}
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>
            <div className="label">
                {c.requirements}
                {requirements.map((item, index) => {
                    return <label className="label label--responsibility" key={index}>
                        <input className="input"
                               value={item}
                               onChange={(e) => { e.preventDefault(); updateRequirements(e.target.value, index); }} />
                        <button className="deleteSchoolBtn" onClick={(e) => { e.preventDefault(); deleteRequirement(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                    </label>
                })}

                <button className="addNewBtn addNewBtn--responsibility flex" onClick={(e) => { e.preventDefault(); addNewRequirement(); }}>
                    {c.addRequirement}
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>
            <div className="label">
                {c.whatYouOffer}
                {benefits.map((item, index) => {
                    return <label className="label label--responsibility" key={index}>
                        <input className="input"
                               value={item}
                               onChange={(e) => { e.preventDefault(); updateBenefits(e.target.value, index); }} />
                        <button className="deleteSchoolBtn" onClick={(e) => { e.preventDefault(); deleteBenefit(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                    </label>
                })}

                <button className="addNewBtn addNewBtn--responsibility flex" onClick={(e) => { e.preventDefault(); addNewBenefit(); }}>
                    {c.addWhatYouOffer}
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>

            <div className="label drivingLicenceWrapper drivingLicenceWrapper--salary">
                {c.salary}
                <div className="flex flex--start">
                    <label className={salaryType === 1 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); setSalaryType(1); }}>
                            <span></span>
                        </button>
                        {c.weekly}
                    </label>
                    <label className={salaryType === 0 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); setSalaryType(0); }}>
                            <span></span>
                        </button>
                        {c.monthly}
                    </label>
                </div>
                <div className="flex flex--start salaryInputsWrapper">
                    <label className="label">
                        <input className="input"
                               type="number"
                               value={salaryFrom}
                               onChange={(e) => { setSalaryFrom(e.target.value); }} />
                    </label>
                    -
                    <label className="label">
                        <input className="input"
                               type="number"
                               value={salaryTo}
                               onChange={(e) => { setSalaryTo(e.target.value); }} />
                    </label>
                    <div className="label--date__input">
                        <button className="datepicker datepicker--currency"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrenciesVisible(!currenciesVisible); }}
                        >
                            {currencies[salaryCurrency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {currenciesVisible ? <div className="datepickerDropdown noscroll">
                            {currencies?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation();
                                                   setCurrenciesVisible(false);
                                                   setSalaryCurrency(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                {c.contractType}
                <div className="languagesWrapper languagesWrapper--contracts flex">
                    {JSON.parse(c.contracts).map((item, index) => {
                        return <label className={isElementInArray(index, contractType) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                            <button className={isElementInArray(index, contractType) ? "checkbox checkbox--selected center" : "checkbox center"}
                                    onClick={(e) => { e.preventDefault(); toggleContract(index); }}>
                                <span></span>
                            </button>
                            {item}
                        </label>
                    })}
                </div>
            </div>

            <div className="label label--phoneNumber">
                {c.recruitmentPersonData}
                <label className="label label--normal">
                    <input className="input"
                           value={contactPerson}
                           onChange={(e) => { setContactPerson(e.target.value); }} />
                </label>

                <button className="phoneNumberBtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNumberVisible(!numberVisible); }}>
                    {phoneNumbers[contactNumberCountry]}
                </button>
                {numberVisible ? <div className="datepickerDropdown datepickerDropdown--phoneNumbers noscroll">
                    {phoneNumbers?.map((item, index) => {
                        return <button className="datepickerBtn center" key={index}
                                       onClick={(e) => { e.preventDefault(); setNumberVisible(false); setContactNumberCountry(index); }}>
                            {item}
                        </button>
                    })}
                </div> : ''}
                <input className="input"
                       value={contactNumber}
                       onChange={(e) => { setContactNumber(e.target.value); }} />
            </div>

            <div className="label">
                {c.backgroundImage}
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    {c.backgroundImageDescription}
                </p>
                <div className={!image ? "filesUploadLabel center" : "filesUploadLabel filesUploadLabel--noBorder center"}>
                    {!imageUrl ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : <div className="filesUploadLabel__profileImage">
                        <button className="removeProfileImageBtn" onClick={(e) => { e.preventDefault(); removeImage(); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={image ? imageUrl : `${settings.API_URL}/${imageUrl}`} alt="zdjecie-profilowe" />
                    </div>}
                    <input className="input input--file"
                           type="file"
                           multiple={false}
                           onChange={(e) => { handleImageUpload(e); }} />
                </div>
            </div>

            <div className="label">
                {c.attachments}
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    {c.offerAttachmentsDescription}
                </p>
                <label className="filesUploadLabel center">
                    {attachments?.length === 0 ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : ''}
                    <input className="input input--file"
                           type="file"
                           multiple={true}
                           maxLength={5}
                           onChange={(e) => { handleAttachments(e); }} />
                </label>

                {oldAttachments?.map((item, index) => {
                    return <div className="filesUploadLabel__item" key={index}>
                        <button className="removeAttachmentBtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAttachment(index, true); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={fileIcon} alt={`file-${index}`} />
                        <input className="fileName"
                               onChange={(e) => { changeAttachmentName(index, e.target.value, true); }}
                               value={item.name}
                        >
                        </input>
                    </div>
                })}

                {Array.from(attachments)?.map((item, index) => {
                    return <div className="filesUploadLabel__item" key={index}>
                        <button className="removeAttachmentBtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAttachment(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={fileIcon} alt={`file-${index}`} />
                        <input className="fileName"
                               onChange={(e) => { changeAttachmentName(index, e.target.value); }}
                               value={item.name}
                        >
                        </input>
                    </div>
                })}
            </div>

            <label className="label label--rel">
                {c.additionalInfo}
                <textarea className="input input--textarea input--situation"
                          value={extraInfo}
                          onChange={(e) => { setExtraInfo(e.target.value); }}
                          placeholder={c.additionalInfoPlaceholder} />
            </label>

            <div className="label drivingLicenceWrapper drivingLicenceWrapper--noMarginTop">
                <div className="languagesWrapper languagesWrapper--contracts flex">
                    <label className={showAgencyInfo ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className={showAgencyInfo ? "checkbox checkbox--selected center" : "checkbox center"}
                                onClick={(e) => { e.preventDefault(); setShowAgencyInfo(prevState => (!prevState)); }}>
                            <span></span>
                        </button>
                        {c.showAgencyInfo}
                    </label>
                </div>
            </div>

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            {!loading ? <button className="btn btn--login center"
                                onClick={(e) => { handleSubmit(e); }}>
                {updateMode ? c.editOffer : c.addNewOffer}
                <img className="img" src={arrowIcon} alt="dodaj-oferte-pracy" />
            </button> : <div className="center">
                <Loader />
            </div> }
        </form> : (limitExceeded === 1 ? <div className="limitWarning">
            <img className="img" src={xIcon} alt="przekroczony-limit" />
            <h3 className="limitWarning__header">
                {c.dailyLimitExceeded}
            </h3>
            <h3 className="limitWarning__header">
                {c.dailyLimitExceededInfo}
            </h3>
        </div> : (limitExceeded === 2 ? <div className="limitWarning">
            <img className="img" src={xIcon} alt="przekroczony-limit" />
            <h3 className="limitWarning__header">
                {c.personalLimitExeeded}
            </h3>
            <h3 className="limitWarning__header">
                {c.personalLimitExeededInfo}
            </h3>
            <a className="btn" href="/">
                {c.homepage}
            </a>
        </div> : <div className="center">
            <Loader />
        </div>))}
    </div>
};

export default AddFastJobOffer;

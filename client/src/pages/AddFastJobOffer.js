import React, {useEffect, useRef, useState} from 'react';
import logo from '../static/img/logo-niebieskie.png'
import backIcon from '../static/img/back-arrow-grey.svg'
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {
    attachmentsErrors,
    categories,
    contracts,
    countries,
    currencies, formErrors, jobOfferErrors,
    months,
    pensionFrequency,
    pensionType, phoneNumbers
} from "../static/content";
import trashIcon from "../static/img/trash.svg";
import {Tooltip} from "react-tippy";
import plusIcon from "../static/img/plus-in-circle.svg";
import plusGrey from '../static/img/plus-icon-opacity.svg'
import {getLoggedUserEmail, numberRange} from "../helpers/others";
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

const AddFastJobOffer = ({updateMode}) => {
    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [accommodationCountriesVisible, setAccommodationCountriesVisible] = useState(false);
    const [currenciesVisible, setCurrenciesVisible] = useState(false);
    const [contractTypeVisible, setContractTypeVisible] = useState(false);
    const [timeBoundedVisible, setTimeBoundedVisible] = useState(false);
    const [dayVisible, setDayVisible] = useState(false);
    const [monthVisible, setMonthVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);
    const [startDayVisible, setStartDayVisible] = useState(false);
    const [startMonthVisible, setStartMonthVisible] = useState(false);
    const [startYearVisible, setStartYearVisible] = useState(false);
    const [numberVisible, setNumberVisible] = useState(false);
    const [success, setSuccess] = useState(false);

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
    const [contractType, setContractType] = useState(0);
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
    const [imageUrl, setImageUrl] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactNumberCountry, setContactNumberCountry] = useState(0);
    const [contactNumber, setContactNumber] = useState('');

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
                    .catch((err) => {
                        console.log(err);
                        // window.location = '/';
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
        setContractTypeVisible(false);
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
            setError(attachmentsErrors[0]);
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
        if(!title || category === -1 || country === -1 || !postalCode || !city || !street ||
            !description || !responsibilities.length || !requirements.length || !benefits.length ||
            salaryType === -1 || salaryFrom === null || salaryTo === null ||
            day === -1 || month === -1 || year === -1 || !hour ||
            startDay === -1 || startMonth === -1 || startYear === -1 || !startHour ||
            accommodationCountry === -1 || !accommodationPostalCode || !accommodationCity || !accommodationStreet ||
            !contactPerson || !contactNumber
        ) {
            setError(jobOfferErrors[0]);
            return 0;
        }
        return 1;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(jobOfferValidation()) {
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
                        image, attachments, oldAttachments
                    });
                    if(offerResult.status === 200) {
                        setSuccess(true);
                    }
                    else {
                        setError(formErrors[1]);
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
                        image, attachments
                    });
                    if(offerResult.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(formErrors[1]);
                    }
                }
            }
            catch(err) {
                if(err.response.data.statusCode === 415) {
                    setError('Dozwolone są tylko pliki w następujących formatach: jpg, txt, pages, png, svg, pdf, docx');
                }
                else {
                    setError(formErrors[1]);
                }
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

    return <div className="container container--addOffer container--addFastOffer" onClick={() => { hideAllDropdowns(); }}>
        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
                </span>
            <a href="/konto-agencji"
               className="userAccount__top__btn">
                <img className="img" src={backIcon} alt="edytuj" />
                Powrót
            </a>
        </aside>

        <MobileHeader back="/" />

        <a className="addOffer__logo" href="/konto-agencji">
            <img className="img" src={logo} alt="logo" />
        </a>
        <div className="addOfferSuccess" ref={addOfferSuccess}>
            <img className="img" src={checkIcon} alt="check" />
            <h3 className="addOfferSuccess__header">
                {updateMode ? 'Twoja błyskawiczna oferta została zaktualizowana' : 'Twoja błyskawiczna oferta pracy została dodana!'}
            </h3>
            <div className="flex">
                <a className="btn" href="/">
                    Strona główna
                </a>
                <a className="btn btn--white" href="/moje-blyskawiczne-oferty-pracy">
                    Moje błyskawiczne oferty pracy
                </a>
            </div>
        </div>
        {!limitExceeded ? <form className="addOffer" ref={addOfferForm}>
            <h1 className="addOffer__header">
                {updateMode ? 'Edycja błyskawicznej oferty pracy' : 'Dodawanie nowej błyskawicznej oferty pracy'}
            </h1>
            <p className="addOffer__text">
                Oferta błyskawiczna pozwoli Ci na znalezienie kandydatów dostępnych od ręki, którzy będą gotowi do podjęcia pracy natychmiastowo.
            </p>
            <p className="addOffer__text addOffer__text--fast">
                Spiesz się! Dobowa ilość ofert jest ograniczona.
            </p>
            <p className="addOffer__text addOffer__text--fast addOffer__text--fast--limitInfo">
                Dobowy limit ofert: <span className="red">{numberOfFastOffers}/15</span>
            </p>

            <label className="label">
                Stanowisko
                <input className="input"
                       value={title}
                       onChange={(e) => { setTitle(e.target.value); }} />
            </label>
            <div className="label label--responsibility label--category">
                Branża
                <div className="label--date__input label--date__input--country label--date__input--category">
                    <button className="datepicker datepicker--country datepicker--category"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCategoriesVisible(!categoriesVisible); }}
                    >
                        {category !== -1 ? categories[category] : 'Wybierz branżę'}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {categoriesVisible ? <div className="datepickerDropdown noscroll">
                        {categories?.map((item, index) => {
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
                        Słowa kluczowe
                    </span>
                    <Tooltip
                        html={<span className="tooltipVisible">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie ipsum metus. Nullam vitae turpis tellus. Nullam vel gravida nunc, et hendrerit dolor. Integer posuere nisl eu porta cursus.
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
                       placeholder="np. produkcja, magazyn, przemysł" />
            </div>

            <div className="label label--date label--date--address">
                Miejsce pracy
                <div className="flex flex-wrap flex--fastOffer">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                        >
                            {country !== -1 ? countries[country] : 'Wybierz kraj'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {countriesVisible ? <div className="datepickerDropdown noscroll">
                            {countries?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); setCountry(index); setCountriesVisible(false); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label--city">
                        <input className="input input--address"
                               value={city}
                               onChange={(e) => { setCity(e.target.value); }}
                               placeholder="Miejscowość" />
                    </label>
                    <label className="label--postalCode">
                        <input className="input input--city"
                               value={postalCode}
                               onChange={(e) => { setPostalCode(e.target.value); }}
                               placeholder="Kod pocztowy" />
                    </label>
                    <label className="label--street">
                        <input className="input input--address"
                               value={street}
                               onChange={(e) => { setStreet(e.target.value); }}
                               placeholder="Ulica i nr budynku" />
                    </label>
                </div>
            </div>

            <div className="label label--date label--date--address">
                Miejsce zakwaterowania
                <div className="flex flex-wrap flex--fastOffer">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAccommodationCountriesVisible(!accommodationCountriesVisible); }}
                        >
                            {accommodationCountry !== -1 ? countries[accommodationCountry] : 'Wybierz kraj'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {accommodationCountriesVisible ? <div className="datepickerDropdown noscroll">
                            {countries?.map((item, index) => {
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
                               placeholder="Miejscowość" />
                    </label>
                    <label className="label--postalCode">
                        <input className="input input--city"
                               value={accommodationPostalCode}
                               onChange={(e) => { setAccommodationPostalCode(e.target.value); }}
                               placeholder="Kod pocztowy" />
                    </label>
                    <label className="label--street">
                        <input className="input input--address"
                               value={accommodationStreet}
                               onChange={(e) => { setAccommodationStreet(e.target.value); }}
                               placeholder="Ulica i nr budynku" />
                    </label>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                Data zameldowania (od kiedy)
                <div className="flex flex-wrap flex--fastOffer">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--day"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDayVisible(!dayVisible); }}
                        >
                            {day !== -1 ? day+1 : 'Dzień'}
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
                            {month !== -1 ? months[month] : 'Miesiąc'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {monthVisible ? <div className="datepickerDropdown noscroll">
                            {months?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMonthVisible(false); setMonth(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* YEARS */}
                    <div className="label--date__input label--postalCode">
                        <button className="datepicker datepicker--year"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setYearVisible(!yearVisible); }}
                        >
                            {year !== -1 ? year : 'Rok'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {yearVisible ? <div className="datepickerDropdown noscroll">
                            {years?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setYearVisible(false); setYear(item); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label--street">
                        <input className="input input--address"
                               value={hour}
                               onChange={(e) => { setHour(e.target.value); }}
                               placeholder="Godzina" />
                    </label>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                Data i godzina rozpoczęcia pracy
                <div className="flex flex-wrap flex--fastOffer">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--day"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartDayVisible(!startDayVisible); }}
                        >
                            {startDay !== -1 ? startDay+1 : 'Dzień'}
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
                            {startMonth !== -1 ? months[startMonth] : 'Miesiąc'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {startMonthVisible ? <div className="datepickerDropdown noscroll">
                            {months?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartMonthVisible(false); setStartMonth(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* YEARS */}
                    <div className="label--date__input label--postalCode">
                        <button className="datepicker datepicker--year"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartYearVisible(!startYearVisible); }}
                        >
                            {startYear !== -1 ? startYear : 'Rok'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {startYearVisible ? <div className="datepickerDropdown noscroll">
                            {years?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStartYearVisible(false); setStartYear(item); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label--street">
                        <input className="input input--address"
                               value={startHour}
                               onChange={(e) => { setStartHour(e.target.value); }}
                               placeholder="Godzina" />
                    </label>
                </div>
            </div>

            <label className="label label--rel">
                Opis stanowiska
                <textarea className="input input--textarea input--situation"
                          value={description}
                          onChange={(e) => { setDescription(e.target.value); }}
                          placeholder="Opisz swoją ofertę oraz podaj najważniejsze cechy stanowiska, które oferujesz." />
            </label>

            <div className="label">
                Zakres obowiązków
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
                    Dodaj obowiązek
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>
            <div className="label">
                Wymagania
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
                    Dodaj obowiązek
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>
            <div className="label">
                Co oferujesz
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
                    Dodaj obowiązek
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>

            <div className="label drivingLicenceWrapper drivingLicenceWrapper--salary">
                Wynagrodzenie
                <div className="flex flex--start">
                    <label className={salaryType === 1 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); setSalaryType(1); }}>
                            <span></span>
                        </button>
                        tygodniowo
                    </label>
                    <label className={salaryType === 0 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); setSalaryType(0); }}>
                            <span></span>
                        </button>
                        miesięcznie
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
                Typ umowy
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setContractTypeVisible(!contractTypeVisible); }}
                        >
                            {contractType !== -1 ? contracts[contractType] : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {contractTypeVisible ? <div className="datepickerDropdown noscroll">
                            {contracts?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.preventDefault(); setContractType(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label label--phoneNumber">
                Dane osoby rekrutującej
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
                Zdjęcie w tle oferty
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    Załącz zdjęcie w tle oferty. Zalecane wymiary to 1600 x 350px.
                </p>
                <div className={!image ? "filesUploadLabel filesUploadLabel--image center" : "filesUploadLabel filesUploadLabel--image filesUploadLabel--noBorder center"}>
                    {!imageUrl ? <img className="img" src={plusGrey} alt="dodaj-pliki" /> : <div className="filesUploadLabel__profileImage">
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
                Załączniki
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    Tutaj możesz dodać dodatkowe załączniki, dostępne do pobrania na stronie oferty pracy.
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

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            <button className="btn btn--login center"
                    onClick={(e) => { handleSubmit(e); }}>
                {updateMode ? 'Edytuj ofertę' : 'Dodaj nową ofertę'}
                <img className="img" src={arrowIcon} alt="dodaj-oferte-pracy" />
            </button>
        </form> : (limitExceeded === 1 ? <div className="limitWarning">
            <img className="img" src={xIcon} alt="przekroczony-limit" />
            <h3 className="limitWarning__header">
                Przekroczony został dzienny limit ofert błyskawicznych.
            </h3>
            <h3 className="limitWarning__header">
                Oferty resetują się o północy. Spróbuj dodać swoją ofertę jutro!
            </h3>
        </div> : (limitExceeded === 2 ? <div className="limitWarning">
            <img className="img" src={xIcon} alt="przekroczony-limit" />
            <h3 className="limitWarning__header">
                Przekroczony został Twój dzienny limit ofert błyskawicznych.
            </h3>
            <h3 className="limitWarning__header">
                Jednej doby możesz dodać maksymalnie dwie oferty błyskawiczne.
            </h3>
            <a className="btn" href="/">
                Strona główna
            </a>
        </div> : <div className="center">
            <Loader />
        </div>))}
    </div>
};

export default AddFastJobOffer;

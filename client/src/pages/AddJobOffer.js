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
    pensionType
} from "../static/content";
import trashIcon from "../static/img/trash.svg";
import {Tooltip} from "react-tippy";
import plusIcon from "../static/img/plus-in-circle.svg";
import plusGrey from '../static/img/plus-icon-opacity.svg'
import {numberRange} from "../helpers/others";
import fileIcon from "../static/img/doc.svg";
import checkIcon from '../static/img/green-check.svg'
import arrowIcon from '../static/img/small-white-arrow.svg'
import {addOffer} from "../helpers/offer";

const AddJobOffer = () => {
    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [currenciesVisible, setCurrenciesVisible] = useState(false);
    const [contractTypeVisible, setContractTypeVisible] = useState(false);
    const [timeBoundedVisible, setTimeBoundedVisible] = useState(false);
    const [dayVisible, setDayVisible] = useState(false);
    const [monthVisible, setMonthVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);
    const [success, setSuccess] = useState(false);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(-1);
    const [keywords, setKeywords] = useState('');
    const [country, setCountry] = useState(-1);
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
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
    const [image, setImage] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [imageUrl, setImageUrl] = useState('')

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);
    const [error, setError] = useState('');

    const addOfferForm = useRef(null);
    const addOfferSuccess = useRef(null);

    useEffect(() => {
        setYears(numberRange(new Date().getFullYear(), new Date().getFullYear()+4));
    }, []);

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

    const hideAllDropdowns = () => {
        setCountriesVisible(false);
        setCategoriesVisible(false);
        setCurrenciesVisible(false);
        setTimeBoundedVisible(false);
        setDayVisible(false);
        setMonthVisible(false);
        setYearVisible(false);
        setContractTypeVisible(false);
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

        if(e.target.files.length > 5) {
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

    const changeAttachmentName = (i, val) => {
        setAttachments(prevState => (prevState.map((item, index) => {
            if(index === i) {
                return {
                    name: val,
                    file: item
                }
            }
            else {
                return item;
            }
        })));
    }

    const removeAttachment = (i) => {
        setAttachments(prevState => (prevState.filter((item, index) => (index !== i))));
    }

    const jobOfferValidation = () => {
        if(!title || category === -1 || country === -1 || !postalCode || !city ||
            !description || !responsibilities.length || !requirements.length || !benefits.length ||
            salaryType === -1 || salaryFrom === null || salaryTo === null || (
                timeBounded && (day === -1 || month === -1 || year === -1)
            )
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
                const offerResult = await addOffer({
                    title, category, keywords, country, postalCode, city, description,
                    responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
                    salaryCurrency, contractType, timeBounded, expireDay: day, expireMonth: month,
                    expireYear: year,
                    image, attachments
                });
                if(offerResult.status === 201) {
                    setSuccess(true);
                }
                else {
                    setError(formErrors[1]);
                }
            }
            catch(err) {
                setError(formErrors[1]);
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

    return <div className="container container--addOffer" onClick={() => { hideAllDropdowns(); }}>
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
        <a className="addOffer__logo" href="/konto-agencji">
            <img className="img" src={logo} alt="logo" />
        </a>
        <div className="addOfferSuccess" ref={addOfferSuccess}>
            <img className="img" src={checkIcon} alt="check" />
            <h3 className="addOfferSuccess__header">
                Twoja oferta pracy została dodana!
            </h3>
            <div className="flex">
                <a className="btn" href="/">
                    Strona główna
                </a>
                <a className="btn btn--white" href="/moje-oferty-pracy">
                    Moje oferty pracy
                </a>
            </div>
        </div>
        <form className="addOffer" ref={addOfferForm}>
            <h1 className="addOffer__header">
                Dodawanie nowej oferty pracy
            </h1>
            <p className="addOffer__text">
                Podziel się szczegółami na temat Twojej oferty i wyczekuj aplikacji ze strony zainteresowanych kandydatów.
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
                <div className="flex">
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
                    <label>
                        <input className="input input--city"
                               value={postalCode}
                               onChange={(e) => { setPostalCode(e.target.value); }}
                               placeholder="Kod pocztowy" />
                    </label>
                    <label>
                        <input className="input input--address"
                               value={city}
                               onChange={(e) => { setCity(e.target.value); }}
                               placeholder="Miejscowość" />
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
                                               onClick={(e) => { e.stopPropagation();
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
                                               onClick={(e) => { setContractType(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                Ważność oferty
                <div className="flex flex--start flex--start--contractType">
                    <div className="flex flex--start">
                        <div className="label--date__input label--date__input--drivingLicence">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTimeBoundedVisible(!timeBoundedVisible); }}
                            >
                                {timeBounded ? 'Terminowa' : 'Bezterminowa'}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {timeBoundedVisible? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={(e) => { e.preventDefault(); setTimeBoundedVisible(false); setTimeBounded(!timeBounded); }}>
                                    {!timeBounded ? 'Terminowa' : 'Bezterminowa'}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                </div>
                <div className="label--flex flex--start">
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
                    <div className="label--date__input">
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
                    <div className="label--date__input">
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
                </div>
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
                        <img className="img" src={imageUrl} alt="zdjecie-profilowe" />
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
                Dodaj nową ofertę
                <img className="img" src={arrowIcon} alt="dodaj-oferte-pracy" />
            </button>
        </form>
    </div>
};

export default AddJobOffer;

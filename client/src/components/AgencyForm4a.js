import React, {useContext} from 'react';
import {countries, currencies, houses, nipCountries, paymentTypes, phoneNumbers, rooms} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";

const AgencyForm4a = ({setRoomVisible, setHouseVisible, setParkingVisible}) => {
    const { setStep, setSubstep, agencyData, handleChange, roomVisible, houseVisible, parkingVisible } = useContext(AgencyDataContext);


    return <>
        <div className="userForm userForm--4a userForm--4a--agency">
            <div className="label label--date label--date--address">
                Zakwaterowanie
                <div className="flex">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setRoomVisible(!roomVisible); }}
                        >
                            {agencyData.roomType ? rooms[agencyData.roomType] : 'Wybierz pokój'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {roomVisible ? <div className="datepickerDropdown noscroll">
                            {rooms?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('roomType', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <div className="label--date__input label--date__input--country label--date__input--houseType">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setHouseVisible(!houseVisible); }}
                        >
                            {agencyData.houseType ? houses[agencyData.houseType] : 'Wybierz budynek'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {houseVisible ? <div className="datepickerDropdown noscroll">
                            {houses?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('houseType', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label label--special">
                Wyposażenie zakwaterowania
                <input className="input--special"
                       value={agencyData.roomDescription}
                       onChange={(e) => { handleChange('roomDescription', e.target.value); }}
                       placeholder="np. osobna łazienka, TV, Internet" />
            </div>


            <div className="label drivingLicenceWrapper">
                Parking
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setParkingVisible(!parkingVisible); }}
                        >
                            {agencyData.parking ? 'Tak' : 'Nie'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {parkingVisible? <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setParkingVisible(false); handleChange('parking', !agencyData.parking); }}>
                                {agencyData.parking ? 'Nie' : 'Tak'}
                            </button>
                        </div> : ''}
                    </div>
                </div>
            </div>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(2); setSubstep(1); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
                Dalej
            </button>
        </div>
    </>
};

export default AgencyForm4a;

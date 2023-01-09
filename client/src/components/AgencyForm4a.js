import React, {useContext} from 'react';
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";
import {LanguageContext} from "../App";
import {isElementInArray} from "../helpers/others";

const AgencyForm4a = ({setRoomVisible, toggleHouses}) => {
    const { setStep, setSubstep, agencyData, handleChange, roomVisible, houseVisible, parkingVisible } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm--4a userForm--4a--agency">
            <div className="label label--date label--date--address">
                {c.accommodation} *
                <div className="flex flex-wrap">
                    <div className="label--date__input label--date__input--country label--date__input--roomType">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setRoomVisible(!roomVisible); }}
                        >
                            {agencyData.roomType >= 0 ? JSON.parse(c.roomsTypes)[agencyData.roomType] : c.chooseRoom}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {roomVisible ? <div className="datepickerDropdown datepickerDropdown--roomType noscroll">
                            {JSON.parse(c.roomsTypes)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('roomType', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>

                    {/*<div className="label--date__input label--date__input--country label--date__input--houseType">*/}
                    {/*    <button className="datepicker datepicker--country"*/}
                    {/*            onClick={(e) => { e.stopPropagation(); setHouseVisible(!houseVisible); }}*/}
                    {/*    >*/}
                    {/*        {agencyData.houseType >= 0 ? JSON.parse(c.houses)[agencyData.houseType] : c.chooseBuilding}*/}
                    {/*        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />*/}
                    {/*    </button>*/}
                    {/*    {houseVisible ? <div className="datepickerDropdown noscroll">*/}
                    {/*        {JSON.parse(c.houses)?.map((item, index) => {*/}
                    {/*            return <button className="datepickerBtn center" key={index}*/}
                    {/*                           onClick={(e) => { handleChange('houseType', index); }}>*/}
                    {/*                {item}*/}
                    {/*            </button>*/}
                    {/*        })}*/}
                    {/*    </div> : ''}*/}
                    {/*</div>*/}

                    <div className="label drivingLicenceCategoriesWrapper drivingLicenceCategoriesWrapper--agency">
                        {JSON.parse(c.houses).map((item, index) => {
                            return <label className={isElementInArray(index, Array.isArray(agencyData.houseType) ? agencyData.houseType : []) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}
                                          key={index}>
                                <button className="checkbox center"
                                        onClick={() => { toggleHouses(index); }}>
                                    <span></span>
                                </button>
                                {item}
                            </label>
                        })}
                    </div>
                </div>
            </div>

            <div className="label label--special">
                {c.accommodationEquipment}
                <input className="input--special"
                       value={agencyData.roomDescription}
                       onChange={(e) => { handleChange('roomDescription', e.target.value); }}
                       placeholder={c.accommodationEquipmentPlaceholder} />
            </div>


            {/*<div className="label drivingLicenceWrapper">*/}
            {/*    {c.parking}*/}
            {/*    <div className="flex flex--start">*/}
            {/*        <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">*/}
            {/*            <button className="datepicker datepicker--country"*/}
            {/*                    onClick={(e) => { e.stopPropagation(); setParkingVisible(!parkingVisible); }}*/}
            {/*            >*/}
            {/*                {agencyData.parking ? c.yes : c.no}*/}
            {/*                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />*/}
            {/*            </button>*/}
            {/*            {parkingVisible? <div className="datepickerDropdown noscroll">*/}
            {/*                <button className="datepickerBtn center"*/}
            {/*                        onClick={() => { setParkingVisible(false); handleChange('parking', !agencyData.parking); }}>*/}
            {/*                    {agencyData.parking ? c.no : c.yes}*/}
            {/*                </button>*/}
            {/*            </div> : ''}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(2); setSubstep(2); }}>
                {c.back}
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
                {c.next}
            </button>
        </div>
    </>
};

export default AgencyForm4a;

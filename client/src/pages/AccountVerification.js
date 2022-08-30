import React, {useContext, useEffect, useState} from 'react';
import background from '../static/img/register-background.png'
import logo from "../static/img/logo-niebieskie.png";
import check from '../static/img/green-check.svg'
import arrowIcon from '../static/img/small-white-arrow.svg'
import LoginAndRegisterAside from "../components/LoginAndRegisterAside";
import {verifyUser} from "../helpers/user";
import Loader from "../components/Loader";
import {verifyAgency} from "../helpers/agency";
import {LanguageContext} from "../App";

const AccountVerification = () => {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(0);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if(token) {
            verifyUser(token)
                .then((res) => {
                    if(res?.status === 201) {
                        setLoading(false);
                    }
                    else {
                        verifyAgency(token)
                            .then((res) => {
                                if(res?.status === 201) {
                                    setLoading(false);
                                    setRole(1);
                                }
                                else {
                                   window.location = '/';
                                }
                            })
                            .catch(() => {
                                window.location = '/';
                            });
                    }
                })
                .catch((err) => {
                    verifyAgency(token)
                        .then((res) => {
                            if(res?.status === 201) {
                                setLoading(false);
                                setRole(1);
                            }
                            else {
                                window.location = '/';
                            }
                        })
                        .catch(() => {
                            window.location = '/';
                        });
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    return <div className="container container--register container--register--accountVerification center">
        <img className="registerImg" src={background} alt="rejestracja" />
        {loading ? <Loader /> : <main className="register register--verification">
            <img className="register__logo" src={logo} alt="portal-pracy" />
            <h1 className="register__header register__header--accountVerification">
                {c.yourAccountIsActive}
                <img className="check" src={check} alt="potwierdzenie" />
            </h1>
            <h2 className="register__subheader">
                {c.nowYouCan} <span className="bold">{role === 0 ? c.registerSubheader5 : c.registerSubheader6}</span>.
            </h2>
            <a className="btn btn--login center" href={role === 0 ? "/strefa-pracownika" : "/strefa-pracodawcy"}>
                {c.fillProfile} {role === 0 ? c.andGenerateCV : ''}
                <img className="img" src={arrowIcon} alt="uzupelnienie-danych" />
            </a>
            <a className="btn btn--neutral center" href="/">
                {c.homepage}
            </a>
            <LoginAndRegisterAside />
        </main>}
    </div>
};

export default AccountVerification;

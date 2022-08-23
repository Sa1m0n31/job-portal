import React, {useEffect, useState} from 'react';
import turkey from '../static/img/turkey.svg'
import {authUser, getUserData} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import Cookies from "universal-cookie";
import Loader from "../components/Loader";
import GoogleTranslate from "../components/GoogleTranslate";
import AdsSection from "../components/AdsSection";
import HomeBenefits from "../components/HomeBenefits";
import Partners from "../components/Partners";
import Tools from "../components/Tools";
import Footer from "../components/Footer";
import HomepageTop from "../components/HomepageTop";

const Homepage = () => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    getUserData()
                        .then((res) => {
                            if(res?.status === 200) {
                                window.location = '/oferty-pracy';
                            }
                            else {
                                setRender(true);
                            }
                        })
                        .catch(() => {
                            setRender(true);
                        });
                }
                else {
                    setRender(true);
                }
            })
            .catch(() => {
                authAgency()
                    .then((res) => {
                        if(res?.status === 201) {
                            getAgencyData()
                                .then((res) => {
                                    if(res?.status === 200) {
                                        window.location = '/konto-agencji';
                                    }
                                    else {
                                        setRender(true);
                                    }
                                })
                                .catch(() => {
                                    setRender(true);
                                });
                        }
                        else {
                            setRender(true);
                        }
                    })
                    .catch(() => {
                        setRender(true);
                    })
            })
    }, []);

    return render ? <div className="container container--home">

        <HomepageTop />
        <AdsSection />
        <HomeBenefits />
        <Partners />
        <Tools />
        <Footer />

    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default Homepage;

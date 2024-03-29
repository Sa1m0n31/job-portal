import React, {useEffect, useState} from 'react';
import {authUser, getUserData} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import Loader from "../components/Loader";
import AdsSection from "../components/AdsSection";
import HomeBenefits from "../components/HomeBenefits";
import Partners from "../components/Partners";
import Tools from "../components/Tools";
import Footer from "../components/Footer";
import HomepageTop from "../components/HomepageTop";
import ExampleJobOffers from "../components/ExampleJobOffers";

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

    useEffect(() => {
        if(render) {
            setTimeout(() => {
                const href = window.location.href.split('/');
                if(href?.length === 4) {
                    if(href[3] === '#funkcje') {
                        document.getElementById('funkcje').scrollIntoView({
                            behavior: 'smooth',
                            top: 0
                        });
                    }
                    if(href[3] === '#partnerzy') {
                        document.getElementById('partnerzy').scrollIntoView({
                            behavior: 'smooth',
                            top: 0
                        });
                    }
                }
            }, 500);
        }
    }, [render]);

    return render ? <div className="container container--home">
        <HomepageTop />
        <AdsSection />
        <HomeBenefits />
        <ExampleJobOffers />
        <Partners />
        <Tools />
        <Footer />
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default Homepage;

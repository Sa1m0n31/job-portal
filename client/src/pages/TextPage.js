import React, {useEffect, useState} from 'react';
import {authUser, getUserData} from "../helpers/user";
import LoggedUserHeader from "../components/LoggedUserHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {authAgency, getAgencyData} from "../helpers/agency";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";

const TextPage = ({content, header}) => {
    const [data, setData] = useState(null);
    const [agency, setAgency] = useState(false);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    getUserData()
                        .then((res) => {
                            if(res?.status === 200) {
                                setData(JSON.parse(res?.data?.data));
                            }
                        });
                }
            })
            .catch(() => {
                authAgency()
                    .then((res) => {
                        if(res?.status === 201) {
                            getAgencyData()
                                .then((res) => {
                                    if(res?.status === 200) {
                                        setAgency(true);
                                        setData(JSON.parse(res?.data?.data));
                                    }
                                });
                        }
                    });
            });
    }, []);

    return <div className="container">
        {data ? <LoggedUserHeader data={data} agency={agency} /> : <PageHeader />}

        <main className={data ? "page" : "page page--narrow"}>
            <h1 className="page__header">
                {header}
            </h1>

            {content === 'termsOfService' ? <div className="termsOfService"><script src='https://www.rzetelnyregulamin.pl/pl/rr,kod-c4c2dda87d2ee10792e7bea5ea271587'></script><div id="rr_xss_cert"></div></div>
             : <div className="termsOfService"><script src='https://www.rzetelnyregulamin.pl/pl/rr,kod-2c0ee0feeceb893bb56fd0aae5417366'></script><div id="rr_xss_cert"></div></div>}

        </main>

        {data ? <LoggedUserFooter /> : <Footer />}
    </div>
};

export default TextPage;

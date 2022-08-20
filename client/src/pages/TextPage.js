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
            {content?.map((item, index) => {
                return <p key={index}>
                    {item}
                </p>
            })}
        </main>

        {data ? <LoggedUserFooter /> : <Footer />}
    </div>
};

export default TextPage;

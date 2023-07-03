import React, {useEffect, useState} from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import {getAllAgencies, getAllApprovedAgencies} from "../helpers/agency";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import AgencyPreviewAdmin from "../components/AgencyPreviewAdmin";
import Modal from "../components/Modal";
import {acceptAgency, blockAgency, unblockAgency} from "../helpers/admin";

const AdminAgencies = () => {
    const [agencies, setAgencies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [blockCandidate, setBlockCandidate] = useState(0);
    const [unblockCandidate, setUnblockCandidate] = useState(0);
    const [acceptCandidate, setAcceptCandidate] = useState(0);
    const [blockSuccess, setBlockSuccess] = useState(0);
    const [unblockSuccess, setUnblockSuccess] = useState(0);
    const [acceptSuccess, setAcceptSuccess] = useState(0);
    const [numberOfAgencies, setNumberOfAgencies] = useState(0);
    const [search, setSearch] = useState('');
    const [filteredAgencies, setFilteredAgencies] = useState([]);

    useEffect(() => {
        setHasMore(false);

        getAllAgencies()
            .then((res) => {
                if(res?.status === 200) {
                    setNumberOfAgencies(res?.data?.length);
                    setAgencies(res?.data);
                }
            });
    }, [blockSuccess, unblockSuccess, acceptSuccess]);

    useEffect(() => {
        if(search) {
            setFilteredAgencies(agencies.filter((item) => {
                return item.email.toLowerCase().includes(search.toLowerCase());
            }));
        }
        else {
            setFilteredAgencies(agencies);
        }
    }, [search]);

    useEffect(() => {
        if(agencies?.length) {
            setFilteredAgencies(agencies);
        }
    }, [agencies]);

    const getAgencies = async () => {
        const newAgenciesResponse = await getAllAgencies(page);
        const newAgencies = newAgenciesResponse.data;

        if(newAgencies.length) {
            await setAgencies(prevState => ([...prevState, ...newAgencies]));
        }
        else {
            await setHasMore(false);
        }
        await setPage(prevState => (prevState+1));
    }

    const blockAgencyById = async () => {
        const res = await blockAgency(blockCandidate);
        if(res?.status === 201) {
            setBlockSuccess(1);
        }
        else {
            setBlockSuccess(-1);
        }
    }

    const unblockAgencyById = async () => {
        const res = await unblockAgency(unblockCandidate);
        if(res?.status === 201) {
            setUnblockSuccess(1);
        }
        else {
            setUnblockSuccess(-1);
        }
    }

    const acceptAgencyById = async () => {
        const res = await acceptAgency(acceptCandidate);
        if(res?.status === 201) {
            setAcceptSuccess(1);
        }
        else {
            setAcceptSuccess(-1);
        }
    }

    useEffect(() => {
        setBlockSuccess(0);
    }, [blockCandidate]);

    useEffect(() => {
        setUnblockSuccess(0);
    }, [unblockCandidate]);

    useEffect(() => {
        setAcceptSuccess(0);
    }, [acceptCandidate]);

    return <div className="container">
        <LoggedAdminHeader />

        {blockCandidate ? <Modal header="Czy na pewno chcesz zablokować tę agencję?"
                                modalAction={blockAgencyById}
                                 block="Zablokuj"
                                 success={blockSuccess === 1}
                                 closeModal={() => { setBlockCandidate(0); }}
                                 message={blockSuccess ? "Agencja została zablokowana" : ''}
        /> : ''}

        {unblockCandidate ? <Modal header="Czy na pewno chcesz odblokować tę agencję?"
                                 modalAction={unblockAgencyById}
                                 block="Odblokuj"
                                 closeModal={() => { setUnblockCandidate(0); }}
                                 success={unblockSuccess === 1}
                                 message={unblockSuccess ? "Agencja została odblokowana" : ''}
        /> : ''}

        {acceptCandidate ? <Modal header="Czy na pewno chcesz akceptować tę agencję?"
                                   modalAction={acceptAgencyById}
                                   block="Akceptuj"
                                   closeModal={() => { setAcceptCandidate(0); }}
                                   success={acceptSuccess === 1}
                                   message={acceptSuccess ? "Agencja została zaakceptowana" : ''}
        /> : ''}

        <main className="adminMain">
            <PanelMenu menuOpen={1} />
            <div className="adminMain__main">
                <h1 className="adminMain__header">
                    Zarejestrowane agencje ({numberOfAgencies})

                    <input className="input input--searchEmail"
                           value={search}
                           onChange={(e) => { setSearch(e.target.value); }}
                           placeholder="Wyszukaj wg e-maila..." />
                </h1>
                <div className="agenciesList agenciesList--admin flex">
                    <InfiniteScroll
                        dataLength={agencies.length ? agencies.length : 10}
                        next={getAgencies}
                        hasMore={hasMore}
                        loader={<div className="center w-100">
                            <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                        </div>}
                        endMessage={<span></span>}
                    >
                        {filteredAgencies?.map((item, index) => {
                            return <AgencyPreviewAdmin key={index}
                                                       id={item.id}
                                                       email={item.email}
                                                       registerDate={item.register_datetime}
                                                       accepted={item.accepted}
                                                       blocked={item.blocked}
                                                       setBlockCandidate={setBlockCandidate}
                                                       setUnblockCandidate={setUnblockCandidate}
                                                       setAcceptCandidate={setAcceptCandidate}
                                                       data={JSON.parse(item.data)} />
                        })}
                    </InfiniteScroll>
                </div>
            </div>
        </main>
    </div>
};

export default AdminAgencies;

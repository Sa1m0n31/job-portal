import React, {useEffect, useState} from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "../components/Modal";
import {blockUser,unblockUser} from "../helpers/admin";
import {getAllUsers} from "../helpers/user";
import UserPreviewAdmin from "../components/UserPreviewAdmin";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [blockCandidate, setBlockCandidate] = useState(0);
    const [unblockCandidate, setUnblockCandidate] = useState(0);
    const [blockSuccess, setBlockSuccess] = useState(0);
    const [unblockSuccess, setUnblockSuccess] = useState(0);
    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setHasMore(false);

        getAllUsers(null, true)
            .then((res) => {
               if(res?.status === 200) {
                   setNumberOfUsers(res?.data?.length);
                   setUsers(res?.data);
               }
            });
    }, [blockSuccess, unblockSuccess]);

    useEffect(() => {
        if(search) {
            setFilteredUsers(users.filter((item) => {
                return item.email.toLowerCase().includes(search.toLowerCase());
            }));
        }
        else {
            setFilteredUsers(users);
        }
    }, [search]);

    useEffect(() => {
        if(users?.length) {
            setFilteredUsers(users);
        }
    }, [users]);

    const getAgencies = async () => {
        const newAgenciesResponse = await getAllUsers(page, true);
        const newAgencies = newAgenciesResponse.data;

        if(newAgencies.length) {
            await setUsers(prevState => ([...prevState, ...newAgencies]));
        }
        else {
            await setHasMore(false);
        }
        await setPage(prevState => (prevState+1));
    }

    const blockUserById = async () => {
        const res = await blockUser(blockCandidate);
        if(res?.status === 201) {
            setBlockSuccess(1);
        }
        else {
            setBlockSuccess(-1);
        }
    }

    const unblockUserById = async () => {
        const res = await unblockUser(unblockCandidate);
        if(res?.status === 201) {
            setUnblockSuccess(1);
        }
        else {
            setUnblockSuccess(-1);
        }
    }

    useEffect(() => {
        setBlockSuccess(0);
    }, [blockCandidate]);

    useEffect(() => {
        setUnblockSuccess(0);
    }, [unblockCandidate]);

    return <div className="container">
        <LoggedAdminHeader />

        {blockCandidate ? <Modal header="Czy na pewno chcesz zablokować tego użytkownika??"
                                modalAction={blockUserById}
                                 block="Zablokuj"
                                 success={blockSuccess === 1}
                                 closeModal={() => { setBlockCandidate(0); }}
                                 message={blockSuccess ? "Użytkownik został zablokowany" : ''}
        /> : ''}

        {unblockCandidate ? <Modal header="Czy na pewno chcesz odblokować tego użytkownika?"
                                 modalAction={unblockUserById}
                                 block="Odblokuj"
                                 closeModal={() => { setUnblockCandidate(0); }}
                                 success={unblockSuccess === 1}
                                 message={unblockSuccess ? "Użytkownik został odblokowany" : ''}
        /> : ''}

        <main className="adminMain">
            <PanelMenu menuOpen={2} />
            <div className="adminMain__main">
                <h1 className="adminMain__header">
                    Zarejestrowani użytkownicy ({numberOfUsers})

                    <input className="input input--searchEmail"
                           value={search}
                           onChange={(e) => { setSearch(e.target.value); }}
                           placeholder="Wyszukaj wg e-maila..." />
                </h1>
                <div className="agenciesList agenciesList--admin flex">
                    <InfiniteScroll
                        dataLength={users.length ? users.length : 10}
                        next={getAgencies}
                        hasMore={hasMore}
                        loader={<div className="center w-100">
                            <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                        </div>}
                        endMessage={<span></span>}
                    >
                        {filteredUsers?.map((item, index) => {
                            return <UserPreviewAdmin key={index}
                                                       id={item.id}
                                                       email={item.email}
                                                       registerDate={item.register_datetime}
                                                       blocked={item.blocked}
                                                       setBlockCandidate={setBlockCandidate}
                                                       setUnblockCandidate={setUnblockCandidate}
                                                       data={JSON.parse(item.data)} />
                        })}
                    </InfiniteScroll>
                </div>
            </div>
        </main>
    </div>
};

export default AdminUsers;

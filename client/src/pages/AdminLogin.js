import React, {useEffect, useState} from 'react';
import userIcon from '../static/img/user-icon.svg'
import passwordIcon from '../static/img/password-icon.svg'
import {authAdmin, loginAdmin} from "../helpers/admin";
import Cookies from 'universal-cookie';
import logo from '../static/img/logo-czarne.png'
import Loader from "../components/Loader";

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [render, setRender] = useState(false);

    useEffect(() => {
        authAdmin()
            .then((res) => {
                if(res?.status === 201) {
                    window.location = '/panel';
                }
                else {
                    setRender(true);
                }
            })
            .catch(() => {
                setRender(true);
            });
    }, []);

    useEffect(() => {
        setError('');
    }, [username, password]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if(username && password) {
            try {
                const loginResult = await loginAdmin(username, password);
                if(loginResult.status === 201) {
                    const jwt = loginResult?.data?.access_token;
                    if(jwt) {
                        const cookies = new Cookies();
                        cookies.set('access_token_admin', jwt, { path: '/' });
                        cookies.set('username', username, { path: '/' });
                        cookies.set('role', 'admin', { path: '/' });
                        window.location = '/panel';
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                }
                else {
                    setError('Niepoprawny login lub hasło');
                }
            }
            catch(err) {
                setError('Niepoprawny login lub hasło');
            }
        }
        else {
            setError('Wpisz swój login i hasło');
        }
    }

    return render ? <div className="container container--loginAdmin center">
        <div className="container--login__headerLogo">
            <img className="img" src={logo} alt="logo" />
        </div>
        <form className="loginForm">
            <label className="loginForm__label">
                Login
                <figure className="labelIconWrapper">
                    <img className="labelIcon" src={userIcon} alt="login" />
                </figure>
                <input className="input"
                       value={username}
                       onChange={(e) => { setUsername(e.target.value); }}
                       placeholder="Twoja nazwa użytkownika" />
            </label>
            <label className="loginForm__label">
                Hasło
                <figure className="labelIconWrapper">
                    <img className="labelIcon" src={passwordIcon} alt="hasło" />
                </figure>
                <input className="input"
                       type="password"
                       value={password}
                       onChange={(e) => { setPassword(e.target.value); }}
                       placeholder="Twoje hasło" />
            </label>
            {error ? <span className="info info--error">
                {error}
            </span> : ''}
            <button className="btn btn--submitAdminLogin"
                    onClick={(e) => { handleLogin(e); }}
            >
                Zaloguj się
            </button>
        </form>
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default AdminLogin;

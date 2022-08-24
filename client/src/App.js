import React, {useEffect, useState} from "react";
import './static/style/style.css'
import './static/style/mobile.css'
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import AccountVerification from "./pages/AccountVerification";
import UserWrapper from "./components/UserWrapper";
import AgencyWrapper from "./components/AgencyWrapper";
import TextPage from "./pages/TextPage";
import {privacyPolicy, termsOfService} from "./static/content";
import Notifications from "./pages/Notifications";
import ContactPage from "./pages/ContactPage";
import RemindPassword from "./pages/RemindPassword";
import SetNewPassword from "./pages/SetNewPassword";
import ChangePassword from "./pages/ChangePassword";
import SingleOffer from "./pages/SingleOffer";
import SingleFastOffer from "./pages/SingleFastOffer";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import CandidateProfile from "./pages/CandidateProfile";
import {getSiteContent} from "./helpers/translation";
import Loader from "./components/Loader";

const LanguageContext = React.createContext(null);

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'PL');
  const [c, setC] = useState({});

  useEffect(() => {
    getSiteContent(language)
        .then((res) => {
          if(res?.data?.length) {
            setC(res.data.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), {}));
          }
        });
  }, [language]);

  return c?.partnersContent ? <LanguageContext.Provider value={{language, setLanguage, c}}>
    <Router>
      {/* PUBLIC ROUTES */}
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route path="/strefa-pracownika">
        <LoginPage type={0} />
      </Route>
      <Route path="/strefa-pracodawcy">
        <LoginPage type={1} />
      </Route>
      <Route path="/rejestracja">
        <Register />
      </Route>
      <Route path="/weryfikacja">
        <AccountVerification />
      </Route>
      <Route path="/regulamin">
        <TextPage header="Regulamin" content={termsOfService} />
      </Route>
      <Route path="/polityka-prywatnosci">
        <TextPage header="Polityka prywatności" content={privacyPolicy} />
      </Route>
      <Route path="/przypomnienie-hasla">
        <RemindPassword />
      </Route>
      <Route path="/ustaw-nowe-haslo">
        <SetNewPassword />
      </Route>

      {/* COMMON ROUTES */}
      <Route path="/kontakt">
        <ContactPage />
      </Route>

      {/* COMMON LOGGED ROUTER */}
      <Route path="/powiadomienia">
        <Notifications />
      </Route>
      <Route path="/zmiana-hasla">
        <ChangePassword />
      </Route>
      <Route path="/oferta-pracy">
        <SingleOffer />
      </Route>
      <Route path="/blyskawiczna-oferta-pracy">
        <SingleFastOffer />
      </Route>
      <Route path="/profil-kandydata">
        <CandidateProfile />
      </Route>

      {/* USER ROUTES */}
      <Route path="/edycja-danych">
        <UserWrapper page={1} />
      </Route>
      <Route path="/konto-pracownika">
        <UserWrapper page={2} />
      </Route>
      <Route path="/oferty-pracy">
        <UserWrapper page={3} />
      </Route>
      <Route path="/aplikuj">
        <UserWrapper page={5} />
      </Route>
      <Route path="/pracodawcy">
        <UserWrapper page={6} />
      </Route>
      <Route path="/oferty-blyskawiczne">
        <UserWrapper page={7} />
      </Route>
      <Route path="/moje-wiadomosci">
        <UserWrapper page={8} />
      </Route>
      <Route path="/napisz-wiadomosc">
        <UserWrapper page={9} />
      </Route>
      <Route path="/profil-agencji">
        <UserWrapper page={10} />
      </Route>

      {/* AGENCY ROUTES */}
      <Route path="/edycja-danych-agencji">
        <AgencyWrapper page={1} />
      </Route>
      <Route path="/konto-agencji">
        <AgencyWrapper page={2} />
      </Route>
      <Route path="/dodaj-oferte-pracy">
        <AgencyWrapper page={3} />
      </Route>
      <Route path="/moje-oferty-pracy">
        <AgencyWrapper page={4} />
      </Route>
      <Route path="/edycja-oferty-pracy">
        <AgencyWrapper page={5} />
      </Route>
      <Route path="/dodaj-blyskawiczna-oferte-pracy">
        <AgencyWrapper page={6} />
      </Route>
      <Route path="/moje-blyskawiczne-oferty-pracy">
        <AgencyWrapper page={7} />
      </Route>
      <Route path="/edycja-blyskawicznej-oferty-pracy">
        <AgencyWrapper page={8} />
      </Route>
      <Route path="/kandydaci">
        <AgencyWrapper page={9} />
      </Route>
      <Route path="/wiadomosci">
        <AgencyWrapper page={11} />
      </Route>
      <Route path="/nowa-wiadomosc">
        <AgencyWrapper page={12} />
      </Route>
      <Route path="/zgloszenia">
        <AgencyWrapper page={13} />
      </Route>
    </Router>
  </LanguageContext.Provider> : <div className="container container--height100 center">
    <Loader />
  </div>
}

export default App;
export { LanguageContext }

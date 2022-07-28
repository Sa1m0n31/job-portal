import React, {useState} from "react";
import './static/style/style.css'
import './static/style/mobile.css'
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import AccountVerification from "./pages/AccountVerification";
import UserWrapper from "./components/UserWrapper";

const LanguageContext = React.createContext(null);

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'PL');

  return <LanguageContext.Provider value={{language, setLanguage}}>
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

      {/* USER ROUTES */}
      <Route path="/edycja-danych">
        <UserWrapper page={1} />
      </Route>
      <Route path="/konto-pracownika">
        <UserWrapper page={2} />
      </Route>
    </Router>
  </LanguageContext.Provider>
}

export default App;
export { LanguageContext }

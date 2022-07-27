import React, {useState} from "react";
import './static/style/style.css'
import './static/style/mobile.css'
import Homepage from "./pages/Homepage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";

const LanguageContext = React.createContext(null);

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'PL');

  return <LanguageContext.Provider value={{language, setLanguage}}>
    <Router>
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route path="/strefa-pracownika">
        <LoginPage />
      </Route>
      <Route path="/rejestracja">
        <Register />
      </Route>
    </Router>
  </LanguageContext.Provider>
}

export default App;
export { LanguageContext }

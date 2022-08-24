import React, {useContext} from 'react';
import logo from '../static/img/logo-czarne.png'
import linkedInIcon from '../static/img/linedin-icon.svg'
import instagramIcon from '../static/img/instagram-icon.svg'
import youtubeIcon from '../static/img/youtube-icon.svg'
import facebookIcon from '../static/img/facebook-icon.svg'
import {LanguageContext} from "../App";

const socialMedia = [
    {
        icon: linkedInIcon,
        link: 'https://linkedin.com'
    },
    {
        icon: instagramIcon,
        link: 'https://instagram.com'
    },
    {
        icon: youtubeIcon,
        link: 'https://youtube.com'
    },
    {
        icon: facebookIcon,
        link: 'https://facebook.com'
    }
]

const Footer = () => {
    const { c } = useContext(LanguageContext);

    return <footer className="footer">
        <div className="footer__inner flex">
            <div className="footer__col footer__col--big">
                <a href="/" className="footer__col__logo">
                    <img className="img" src={logo} alt="jooob.eu" />
                </a>
                <p className="footer__col__text">
                    {c.footerText}
                </p>
                <h5 className="footer__header">
                    {c.contact}
                </h5>
                <p className="footer__data">
                    {c.serviceAndHelp}: +48 234 938 283
                </p>
                <p className="footer__data">
                    {c.availableInHours} 8:00 - 16:00
                </p>
                <p className="footer__data">
                    {c.emailShortcut}: kontakt@jooob.eu
                </p>
            </div>
            <div className="footer__col">
                <h5 className="footer__header">
                    {c.info}
                </h5>
                <a className="footer__data" href="/regulamin">
                    {c.termsOfServiceHeader}
                </a>
                <a className="footer__data" href="/regulamin">
                    {c.privacyPolicyHeader}
                </a>
            </div>
            <div className="footer__col">
                <h5 className="footer__header">
                    {c.navigation.charAt(0).toUpperCase() + c.navigation.slice(1)}
                </h5>
                <a className="footer__data" href="/strefa-pracownika">
                    {c.userZone}
                </a>
                <a className="footer__data" href="/strefa-pracodawcy">
                    {c.agencyZone}
                </a>
                <a className="footer__data" href="/#funkcje">
                    {c.appFunctions}
                </a>
                <a className="footer__data" href="/#partnerzy">
                    {c.partners}
                </a>
                <a className="footer__data" href="/kontakt">
                    {c.contact}
                </a>
            </div>
            <div className="footer__col">
                <h5 className="footer__header">
                    {c.data.charAt(0).toUpperCase() + c.data.slice(1)}
                </h5>
                <p className="footer__data">
                    <span>
                        Jooob.eu Sp.z.o.o.
                    </span>
                    <span>
                        NIP 23 234 234 23
                    </span>
                </p>
                <p className="footer__data">
                    <span>
                        ul. Warszawska 1/1
                    </span>
                    <span>
                        23-234 Bydgoszcz
                    </span>
                </p>
                <p className="footer__data">
                    <span>
                        Bank ING
                    </span>
                    <span>
                        23 2342 2344 2345 8989 0000 12
                    </span>
                </p>
                <h5 className="footer__header footer__header--socialMedia">
                    {c.socialMedia}
                </h5>
                <span className="footer__socialMedia flex flex--start">
                    <span>
                        {c.youWillFindUs}:
                    </span>
                    {socialMedia.map((item, index) => {
                        return <a href={item.link}
                                  key={index}
                                  className="footer__socialMedia__link"
                                  rel="noreferrer"
                                  target="_blank">
                            <img className="img" src={item.icon} alt="social-media-link" />
                        </a>
                    })}
                </span>
            </div>
        </div>
        <h6 className="loggedUserFooter__bottom">
            &copy; {new Date().getFullYear()} Jooob.eu
        </h6>
    </footer>
};

export default Footer;

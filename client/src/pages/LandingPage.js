import React from 'react';
import backgroundImg from '../static/img/landing-tlo.png'
import mainImg from '../static/img/landing-image.png'
import arrowIcon from '../static/img/arrow-white.svg'
import image1 from '../static/img/deal.svg'
import image2 from '../static/img/landing-2.png'
import icon3 from '../static/img/speech-bubble.svg'
import icon2 from '../static/img/instant-message.svg'
import icon1 from '../static/img/resume.svg'
import logo from '../static/img/logo-biale.png'
import logoFooter from '../static/img/logo-czarne.png'
import linkedInIcon from "../static/img/linedin-icon.svg";
import facebookIcon from "../static/img/facebook-icon.svg";

const points = [
    `Increasing the efficiency of inside recruiters - <b>access to an extensive profile of candidates</b>.`,
    `<b>Instant offers</b> - candidates ready to work immediately.`,
    `Notifications about matching a candidate to an offer - <b>a simple algorithm that searches for potential candidates</b> for a job offer.`,
    `<b>Analyzes, reports, forecasts</b> - collecting data and reacting to the changing labor market.`,
    `<b>Openness</b> to individual needs.`,
    `<b>Common exploration</b> of new industries and countries.`
]

const socialMedia = [
    {
        icon: linkedInIcon,
        link: 'https://www.linkedin.com/company/jooob-eu/?viewAsMember=true '
    },
    {
        icon: facebookIcon,
        link: 'https://www.facebook.com/Jooob.eu'
    }
]

const bottomSection = [
    {
        header: 'Free trial',
        text: 'Free access for a trial period to the publication of job offers and company presentations in the extended employer profile.'
    },
    {
        header: 'Accessibility',
        text: 'Access to an extensive and transparent profile of candidates from various industries.'
    },
    {
        header: 'We listen you',
        text: 'Adapting the website to the most demanding users in the constantly changing labor market based on user feedback.'
    }
]

const LandingPage = () => {
    return <div className="container">
        <div className="landing__top flex">
            <a href="/" className="landing__logo">
                <img className="img" src={logo} alt="jooob.eu-logo" />
            </a>
            <img className="img" src={backgroundImg} alt="background" />
            <div className="landing__left">
                <h1 className="landing__header">
                    What works in the real world is <span className="underline">cooperation</span>
                </h1>
                <p className="landing__text landing__text--1">
                    Supporting partner providing selected candidates from all over Europe. A tool built on the basis of experience, analysis and observation of the recruitment market in the Netherlands.
                </p>
                <p className="landing__text landing__text--2">
                    Vision and common development with <span className="bold">jooob.eu</span>.
                </p>
                <a href="/" className="landing__btn">
                    Find out more <img className="img" src={arrowIcon} alt="more" />
                </a>
            </div>
            <figure className="landing__right">
                <img className="img" src={mainImg} alt="jooob.eu" />
            </figure>
        </div>

        <div className="w-1400">
            <h2 className="landing__afterTopHeader">
                We are not able to predict the future on the labor market, but <span className="bold blue">we can create</span> it so that it is the best.
            </h2>
        </div>

        <div className="flex w-1400 home__benefit--landing">
            <div className="home__benefit flex">
                <figure className="home__benefit__figure center">
                    <img className="img" src={icon1} alt="korzyść" />
                </figure>
                <div className="home__benefit__content">
                    <h4 className="home__benefit__header">
                        CV generator
                    </h4>
                    <p className="home__benefit__text">
                        Document ready for presentation at the customer.
                    </p>
                </div>
            </div>
            <div className="home__benefit flex">
                <figure className="home__benefit__figure center">
                    <img className="img" src={icon2} alt="korzyść" />
                </figure>
                <div className="home__benefit__content">
                    <h4 className="home__benefit__header">
                        Original function "instant offers"
                    </h4>
                    <p className="home__benefit__text">
                        Candidates ready to work immediately.
                    </p>
                </div>
            </div>
            <div className="home__benefit flex">
                <figure className="home__benefit__figure center">
                    <img className="img" src={icon3} alt="korzyść" />
                </figure>
                <div className="home__benefit__content">
                    <h4 className="home__benefit__header">
                        Constant and quick contact
                    </h4>
                    <p className="home__benefit__text">
                        Get in touch with the candidates via an communicator.
                    </p>
                </div>
            </div>
        </div>

        <div className="landing__section w-1400">
            <h3 className="landing__header landing__header--2">
                What is jooob.eu portal?
            </h3>

            <div className="flex">
                <figure className="landing__section__img">
                    <img className="img" src={image2} alt="image" />
                </figure>
                <div className="landing__section__points">
                    {points.map((item, index) => {
                        return <p className="landing__section__points__item" dangerouslySetInnerHTML={{
                            __html: item
                        }}>
                        </p>
                    })}
                </div>
            </div>
        </div>

        <div className="landing__section w-1400 flex">
            <div className="landing__section__left">
                {bottomSection.map((item, index) => {
                    return <div className="landing__section__left__item" key={index}>
                        <h4 className="landing__section__left__item__header">
                            {item.header}
                        </h4>
                        <p className="landing__section__left__item__text">
                            {item.text}
                        </p>
                    </div>
                })}
            </div>
            <figure className="landing__section__right">
                <img className="img" src={image1} alt="jooob.eu" />
            </figure>
        </div>

        <div className="landing__bottom flex">
            <h5 className="landing__bottom__header">
                Try free access and register NOW!
            </h5>
            <a href="/strefa-pracodawcy" className="landing__bottom__btn">
                Register
            </a>
        </div>

        <footer className="footer">
            <div className="footer__inner flex">
                <div className="footer__col footer__col--big">
                    <a href="/" className="footer__col__logo">
                        <img className="img" src={logoFooter} alt="jooob.eu" />
                    </a>
                    <p className="footer__col__text">
                        The Jooob.eu portal is a place connecting employees and employers from all over Europe. Simple tools and functionality of the website will help you find direct employment abroad.
                    </p>
                    <h5 className="footer__header">
                        Contact
                    </h5>
                    <p className="footer__data">
                        Service and assistance: contact@jooob.eu
                    </p>
                    <p className="footer__data">
                        8:00 - 16:00
                    </p>
                </div>
                <div className="footer__col">
                    <h5 className="footer__header">
                        Info
                    </h5>
                    <a className="footer__data" href="/regulamin">
                        Terms of service
                    </a>
                    <a className="footer__data" href="/regulamin">
                        Privacy policy
                    </a>
                </div>
                <div className="footer__col">
                    <h5 className="footer__header">
                        Navigation
                    </h5>
                    <a className="footer__data" href="/strefa-pracownika">
                        Employee zone
                    </a>
                    <a className="footer__data" href="/strefa-pracodawcy">
                        Employer zone
                    </a>
                    <a className="footer__data" href="/#funkcje">
                        Portal functions
                    </a>
                    <a className="footer__data" href="/#partnerzy">
                        Partners
                    </a>
                    <a className="footer__data" href="/kontakt">
                        Contact
                    </a>
                </div>
                <div className="footer__col">
                    <h5 className="footer__header">
                        Data
                    </h5>
                    <p className="footer__data">
                    <span>
                        AMB Sp.z.o.o.
                    </span>
                        <span>
                        NIP 5542998776
                    </span>
                    </p>
                    <p className="footer__data">
                    <span>
                        Marii Curie Skłodowskiej 62/46
                    </span>
                        <span>
                        85-733 Bydgoszcz, Poland
                    </span>
                    </p>
                    <h5 className="footer__header footer__header--socialMedia">
                        Social media
                    </h5>
                    <span className="footer__socialMedia flex flex--start">
                    <span>
                        You can find us on:
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
    </div>
};

export default LandingPage;

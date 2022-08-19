import React from 'react';
import HomeSectionHeader from "./HomeSectionHeader";
import logo from '../static/img/google.png'
import arrow from '../static/img/right-blue-arrow.svg'

const items = [
    {
        logo: logo,
        name: 'Google Inc.',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur',
        link: 'https://google.com'
    },
    {
        logo: logo,
        name: 'Google Inc.',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur',
        link: 'https://google.com'
    },
    {
        logo: logo,
        name: 'Google Inc.',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur',
        link: 'https://google.com'
    },
    {
        logo: logo,
        name: 'Google Inc.',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur',
        link: 'https://google.com'
    }
]

const Partners = () => {
    return <div className="homeSection homeSection--partners" id="partnerzy">
        <HomeSectionHeader content="Partnerzy serwisu" />

        <div className="partners flex">
            {items?.map((item, index) => {
                return <div className="partners__item flex flex--start" key={index}>
                    <figure className="partners__figure center">
                        <img className="img" src={item.logo} alt="logo" />
                    </figure>
                    <div className="partners__content">
                        <h4 className="partners__header">
                            {item.name}
                        </h4>
                        <p className="partners__text">
                            {item.text}
                        </p>
                        <a href={item.link}
                           className="partners__link"
                           target="+_blank" rel="noreferrer">
                            Dowiedz się więcej
                            <img className="img" src={arrow} alt="arrow" />
                        </a>
                    </div>
                </div>
            })}
        </div>
    </div>
};

export default Partners;

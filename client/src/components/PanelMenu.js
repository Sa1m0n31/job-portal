import React from 'react'

const PanelMenu = ({menuOpen}) => {
    const menu = [
        {
            name: 'Home',
            link: '/panel'
        },
        {
            name: 'Agencje',
            link: '/panel/agencje'
        },
        {
            name: 'Pracownicy',
            link: '/panel/pracownicy'
        },
        {
            name: 'Oferty',
            link: '/panel/oferty'
        },
        {
            name: 'Oferty błyskawiczne',
            link: '/panel/oferty-blyskawiczne'
        }
    ]

    return <menu className="panelMenu">
        <ul className="panelMenu__list">
            {menu.map((item, index) => {
                return <li className="panelMenu__list__item" key={index}>
                    <a className={menuOpen === index ? "panelMenu__list__item__link panelMenu__list__item__link--selected"
                        : "panelMenu__list__item__link"}
                    href={item.link}>
                        {item.name}
                    </a>
                </li>
            })}
        </ul>
    </menu>
}

export default PanelMenu;

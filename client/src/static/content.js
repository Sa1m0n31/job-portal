const steps = [
    'Dane osobowe', 'Wykształcenie', 'Doświadczenie zawodowe', 'Umiejętności',
    'Dodatkowe informacje', 'Podsumowanie'
];

const stepsContent = [
    [
        {
            header: '1. Dane osobowe',
            text: 'Podaj swoje dane osobowe, aby potencjalny pracodawca mógł w łatwy sposób nawiązać z Tobą kontakt.'
        }
    ],
    [
        {
            header: '2. Wykształcenie',
            text: 'Wskaż stopień swojego wykształcenia oraz dodaj listę szkół, które ukończyłeś lub w których jesteś w trakcie nauki.'
        }
    ],
    [
        {
            header: '3. Doświadczenie',
            text: 'Wskaż stopień swojego wykształcenia oraz dodaj listę szkół, które ukończyłeś lub w których jesteś w trakcie nauki.'
        }
    ],
    [
        {
            header: '4.1 Umiejętności',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: '4.2 Umiejętności',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        }
    ],
    [
        {
            header: '5.1 Dodatkowe informacje',
            text: 'Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy.'
        },
        {
            header: '5.2 Dodatkowe informacje',
            text: 'Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy.'
        },
        {
            header: '5.3 Dodatkowe informacje',
            text: 'Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy.'
        },
        {
            header: '5.4 Dodatkowe informacje',
            text: 'Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy.'
        }
    ],
    [
        {
            header: '6. Podsumowanie',
            text: 'Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy.'
        }
    ]
];

const stepsMainContent = [
    [
        {
            header: 'Uzupełnij dane osobowe',
            text: 'Podstawowe dane osobowe oraz kontaktowe.'
        }
    ],
    [
        {
            header: 'Wykształcenie, ukończone szkoły',
            text: 'Uzupełnij listę ukończonych szkół oraz wykształcenie lub zawód, które zdobyłeś.'
        }
    ],
    [
        {
            header: 'Doświadczenie zawodowe',
            text: 'Wskaż firmy, w których zdobywałeś swoje doświadczenie. Jeśli dotąd nie byłeś/aś zatrudniony/a, przejdź do następnego kroku.'
        }
    ],
    [
        {
            header: 'Umiejętności, kursy, szkolenia',
            text: 'Umiejętności są zawsze mile widziane u potencjalnego pracodawcy. Pochwal się dodatkowymi kwalifikacjami, np. certyfikatami szkoleń.'
        },
        {
            header: 'Umiejętności, kursy, szkolenia',
            text: 'Umiejętności są zawsze mile widziane u potencjalnego pracodawcy. Pochwal się dodatkowymi kwalifikacjami, np. certyfikatami szkoleń.'
        }
    ],
    [
        {
            header: 'Dodatkowe informacje',
            text: 'Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji.'
        },
        {
            header: 'Dodatkowe informacje',
            text: 'Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji.'
        },
        {
            header: 'Dodatkowe informacje',
            text: 'Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji.'
        },
        {
            header: 'Dodatkowe informacje',
            text: 'Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji.'
        }
    ],
    [
        {
            header: 'Podsumowanie',
            text: 'Twój profil został uzupełniony! Możesz pobrać swoje CV lub przejść do przeglądania najnowszych ofert pracy.'
        }
    ]
];

const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień',
    'Październik', 'Listopad', 'Grudzień'
];

const countries = [
    'Polska', 'Niemcy', 'Holandia', 'Norwegia'
];

const phoneNumbers = [
    'PL +48', 'DE +49', 'BE +32', 'GB +44', 'SE +46', 'NO +47', 'UA +42'
];

const educationLevels = [
    'podstawowe', 'średnie', 'wyższe', 'zawodowe'
];

const languages = [
    'angielski', 'niemiecki', 'holenderski', 'hiszpański', 'francuski', 'włoski',
    'norweski', 'szwedzki', 'belgijski', 'ukraiński'
];

const drivingLicences = [
    'kat. A', 'kat. B', 'kat. B+E', 'kat. C', 'kat. C+E', 'kat. D'
];

const languageLevels = [
    'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
];

const formErrors = [
    'Uzupełnij wymagane pola'
];

const currencies = [
    'EUR', 'PLN'
];

const categories = [
    'Transport', 'Budownictwo', 'IT', 'Handel', 'Rolnictwo'
];

export { steps, stepsContent, stepsMainContent, months, countries, phoneNumbers, formErrors, educationLevels, languages, drivingLicences,
    languageLevels, currencies, categories
}

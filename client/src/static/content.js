import poland from '../static/img/poland.svg'

const steps = [
    'Dane osobowe', 'Wykształcenie', 'Doświadczenie zawodowe', 'Umiejętności',
    'Dodatkowe informacje', 'Podsumowanie'
];

const stepsAgency = [
    'Dane agencji', 'Opis agencji', 'Dodatkowe informacje', 'Informacje dla pracownika',
    'Podsumowanie'
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

const stepsAgencyContent = [
    [
        {
            header: '1. Dane firmy',
            text: 'Podaj swoje dane osobowe, aby potencjalny pracodawca mógł w łatwy sposób nawiązać z Tobą kontakt.'
        }
    ],
    [
        {
            header: '2. Opis firmy',
            text: 'Wskaż stopień swojego wykształcenia oraz dodaj listę szkół, które ukończyłeś lub w których jesteś w trakcie nauki.'
        }
    ],
    [
        {
            header: '3.1. Dodatkowe informacje',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: '3.2. Linki',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        }
    ],
    [
        {
            header: '4.1 Informacje dla pracowników',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: '4.2 Informacje dla pracowników',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: '4.3 Informacje dla pracowników',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        }
    ],
    [
        {
            header: '5. Podsumowanie',
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

const stepsAgencyMainContent = [
    [
        {
            header: 'Dane firmy',
            text: 'Podaj swoje dane osobowe, aby potencjalny pracodawca mógł w łatwy sposób nawiązać z Tobą kontakt.'
        }
    ],
    [
        {
            header: 'Opis firmy',
            text: 'Wskaż stopień swojego wykształcenia oraz dodaj listę szkół, które ukończyłeś lub w których jesteś w trakcie nauki.'
        }
    ],
    [
        {
            header: 'Dodatkowe informacje',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: 'Linki',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        }
    ],
    [
        {
            header: 'Informacje dla pracowników',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: 'Informacje dla pracowników',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        },
        {
            header: 'Informacje dla pracowników',
            text: 'Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie.'
        }
    ],
    [
        {
            header: 'Podsumowanie',
            text: 'Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy.'
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
    'Uzupełnij wymagane pola',
    'Coś poszło nie tak... Prosimy spróbować później'
];

const attachmentsErrors = [
    'Możesz dodać maksymalnie 5 załączników'
];

const currencies = [
    'EUR', 'PLN'
];

const categories = [
    'Transport', 'Budownictwo', 'IT', 'Handel', 'Rolnictwo'
];

const nipCountries = [
    'PL', 'DE', 'NL'
];

const flags = [
    poland
];

const rooms = [
    'Pokój 1-osobowy', 'Pokój 2-osobowy', 'Pokój 3-osobowy'
];

const houses = [
    'Blok mieszkalny', 'Dom jednorodzinny', 'Szeregowiec', 'Bungalow', 'Camping'
];

const paymentTypes = [
    'Płatny dodatkowo', 'Bezpłatny'
];

const pensionType = [
    'Wypłacane z pensji', 'Wypłacane osobno'
];

const paycheckFrequency = [
    'Wypłacane co tydzień', 'Wypłacane co miesiąc'
];

const pensionFrequency = [
    'Wypłacane jednorazowo', 'Co tydzień'
];

const paycheckDay = [
    'W każdy poniedziałek', 'W każdy wtorek', 'W każdą środę', 'W każdy czwartek', 'W każdy piątek'
];

const healthInsuranceOptions = [
    'Płatne dodatkowo', 'Darmowe'
];

const noInfo = 'Brak informacji';

const contracts = [
    'Umowa o pracę', 'Umowa zlecenie', 'B2B'
];

const jobOfferErrors = [
    'Uzupełnij wymagane pola',
    ''
]

const myJobOffersFilter = [
    'Aktualne',
    'Nieaktualne',
    'Wszystkie'
]

const distances = [
    '+100 km', '+50 km', '+40 km', '+30 km', '+20 km', '+10 km', '+5 km'
];

const preferableContactForms = [
    'telefonicznie',
    'mailowo',
    'prywatna wiadomość przez Jooob.eu',
    'brak'
]

const privacyPolicy = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.',
    'Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.',
    'Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
    'Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.',
    'Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.',
    'Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.',
    'Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
    'Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.',
    'Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl.'
]

const termsOfService = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.',
    'Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.',
    'Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
    'Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.',
    'Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.',
    'Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.',
    'Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
    'Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.',
    'Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl.'
]

const notificationTitles = [
    'Nowa oferta pracy dla Ciebie',
    'Nowa błyskawiczna oferta pracy dla Ciebie',
    'aplikował/a na Twoją ofertę pracy',
    'Znaleźliśmy kandydata pasującego do Twojej oferty pracy'
];

const homeMenu = [
    {
        label: 'Strona główna',
        link: '/'
    },
    {
        label: 'Funkcje portalu',
        link: '/#funkcje'
    },
    {
        label: 'Partnerzy',
        link: '/#partnerzy'
    },
    {
        label: 'Kontakt',
        link: '/kontakt'
    }
];

const userMenu = [
    {
        label: 'Aktywne oferty pracy',
        link: '/oferty-pracy'
    },
    {
        label: 'Oferty błyskawiczne',
        link: '/oferty-blyskawiczne'
    },
    {
        label: 'Pracodawcy',
        link: '/pracodawcy'
    },
    {
        label: 'Kontakt',
        link: '/kontakt'
    }
]

const agencyMenu = [
    {
        label: 'Zgłoszenia',
        link: '/zgloszenia'
    },
    {
        label: 'Moje oferty',
        link: '/moje-oferty-pracy'
    },
    {
        label: 'Moje oferty błyskawiczne',
        link: '/moje-oferty-blyskawiczne'
    },
    {
        label: 'Kandydaci',
        link: '/kandydaci'
    }
]

export { steps, stepsContent, stepsMainContent, months, countries, phoneNumbers, formErrors, educationLevels, languages, drivingLicences,
    languageLevels, currencies, categories, attachmentsErrors, flags, stepsAgency, stepsAgencyContent, stepsAgencyMainContent, nipCountries,
    rooms, houses, paymentTypes, pensionType, paycheckFrequency, pensionFrequency, paycheckDay, healthInsuranceOptions, noInfo, contracts,
    jobOfferErrors, myJobOffersFilter, distances, preferableContactForms, privacyPolicy, termsOfService, notificationTitles,
    homeMenu, userMenu, agencyMenu
}

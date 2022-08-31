const steps = [
    "Dane osobowe", "Wykształcenie", "Doświadczenie zawodowe", "Umiejętności",
    "Dodatkowe informacje", "Podsumowanie"
];

const stepsAgency = [
    "Dane agencji", "Opis agencji", "Dodatkowe informacje", "Informacje dla pracownika",
    "Podsumowanie"
];

const unsupportedMediaTypeInfo = "Dozwolone są tylko pliki w następujących formatach: jpg, txt, pages, png, svg, pdf, docx, odt";

const stepsContent = [
    [
        {
            header: "1. Dane osobowe",
            text: "Podaj swoje dane osobowe, aby potencjalny pracodawca mógł w łatwy sposób nawiązać z Tobą kontakt."
        }
    ],
    [
        {
            header: "2. Wykształcenie",
            text: "Wskaż stopień swojego wykształcenia oraz dodaj listę szkół, które ukończyłeś lub w których jesteś w trakcie nauki."
        }
    ],
    [
        {
            header: "3. Doświadczenie",
            text: "Wskaż firmy, w których pracowałeś i pochwal się swoim doświadczeniem zawodowym."
        }
    ],
    [
        {
            header: "4.1 Umiejętności",
            text: "Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie."
        },
        {
            header: "4.2 Umiejętności",
            text: "Zaprezentuj swoje umiejętności, które podnoszą Twoje kwalifikacje i przydają się w zawodzie."
        }
    ],
    [
        {
            header: "5.1 Dodatkowe informacje",
            text: "Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy."
        },
        {
            header: "5.2 Dodatkowe informacje",
            text: "Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy."
        },
        {
            header: "5.3 Dodatkowe informacje",
            text: "Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy."
        },
        {
            header: "5.4 Dodatkowe informacje",
            text: "Uzupełnij swój profil o dodatkowe wiadomości, które pomogą potencjalnemu pracodawcy."
        }
    ],
    [
        {
            header: "6. Podsumowanie",
            text: "Udało się! Zakończyłeś uzupełnianie swojego profilu."
        }
    ]
];

const stepsAgencyContent = [
    [
        {
            header: "1. Dane firmy",
            text: "Podaj swoje dane osobowe, aby potencjalny pracodawca mógł w łatwy sposób nawiązać z Tobą kontakt."
        }
    ],
    [
        {
            header: "2. Opis firmy",
            text: "Dodaj opis firmy, aby potencjalny pracownik mógł lepiej zapoznać się z Waszą agencją."
        }
    ],
    [
        {
            header: "3.1. Dodatkowe informacje",
            text: "Uzupełnij profil firmy o dodatkowe informacje."
        },
        {
            header: "3.2. Linki",
            text: "Uzupełnij linki do strony internetowej oraz social mediów Waszej agencji."
        }
    ],
    [
        {
            header: "4.1 Informacje dla pracowników",
            text: "Uzupełnij odpowiednie informacje dla pracowników."
        },
        {
            header: "4.2 Informacje dla pracowników",
            text: "Uzupełnij odpowiednie informacje dla pracowników."
        },
        {
            header: "4.3 Informacje dla pracowników",
            text: "Uzupełnij odpowiednie informacje dla pracowników."
        }
    ],
    [
        {
            header: "5. Podsumowanie",
            text: "Udało się! Zakończyłeś uzupełnianie swojego profilu."
        }
    ]
];

const stepsMainContent = [
    [
        {
            header: "Uzupełnij dane osobowe",
            text: "Podstawowe dane osobowe oraz kontaktowe."
        }
    ],
    [
        {
            header: "Wykształcenie, ukończone szkoły",
            text: "Uzupełnij listę ukończonych szkół oraz wykształcenie lub zawód, które zdobyłeś."
        }
    ],
    [
        {
            header: "Doświadczenie zawodowe",
            text: "Wskaż firmy, w których zdobywałeś swoje doświadczenie. Jeśli dotąd nie byłeś/aś zatrudniony/a, przejdź do następnego kroku."
        }
    ],
    [
        {
            header: "Umiejętności, kursy, szkolenia",
            text: "Umiejętności są zawsze mile widziane u potencjalnego pracodawcy. Pochwal się dodatkowymi kwalifikacjami, np. certyfikatami szkoleń."
        },
        {
            header: "Umiejętności, kursy, szkolenia",
            text: "Umiejętności są zawsze mile widziane u potencjalnego pracodawcy. Pochwal się dodatkowymi kwalifikacjami, np. certyfikatami szkoleń."
        }
    ],
    [
        {
            header: "Dodatkowe informacje",
            text: "Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji."
        },
        {
            header: "Dodatkowe informacje",
            text: "Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji."
        },
        {
            header: "Dodatkowe informacje",
            text: "Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji."
        },
        {
            header: "Dodatkowe informacje",
            text: "Uzupełnij pola z dodatkowymi danymi, aby Twój potencjalny pracodawca mógł dowiedzieć się więcej na temat Twojej sytuacji."
        }
    ],
    [
        {
            header: "Podsumowanie",
            text: "Twój profil został uzupełniony! Możesz pobrać swoje CV lub przejść do przeglądania najnowszych ofert pracy."
        }
    ]
];

const stepsAgencyMainContent = [
    [
        {
            header: "Dane firmy",
            text: "Podaj dane firmy, aby potencjalny pracownik mógł w łatwy sposób nawiązać z Tobą kontakt."
        }
    ],
    [
        {
            header: "Opis firmy",
            text: "Dodaj opis firmy, aby potencjalny pracownik mógł lepiej zapoznać się z Waszą agencją."
        }
    ],
    [
        {
            header: "Dodatkowe informacje",
            text: "Uzupełnij profil firmy o dodatkowe informacje."
        },
        {
            header: "Linki",
            text: "Uzupełnij profil firmy o linki do strony internetowej oraz social mediów."
        }
    ],
    [
        {
            header: "Informacje dla pracowników",
            text: "Uzupełnij profil firmy o odpowiednie informacje dla pracowników"
        },
        {
            header: "Informacje dla pracowników",
            text: "Uzupełnij profil firmy o odpowiednie informacje dla pracowników"
        },
        {
            header: "Informacje dla pracowników",
            text: "Uzupełnij profil firmy o odpowiednie informacje dla pracowników"
        }
    ],
    [
        {
            header: "Podsumowanie",
            text: "Udało się! Twój profil został uzupełniony."
        }
    ]
];

const months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień",
    "Październik", "Listopad", "Grudzień"
];

const phoneNumbers = [
    'AL +355', 'AD +376', 'AM +374', 'AT +43', 'AZ +994', 'BY +375', 'BE +32',
    'BA +387', 'BG +359', 'HR +385', 'CY +387', 'CZ +420', 'DK +45', 'EE +376',
    'FI +358', 'FR +33', 'GE +995', 'DE +49', 'GR +30', 'HU +36', 'IS +354', 'IE +353',
    'IT +39', 'LV +371', 'LI +423', 'LT +370', 'LU +352', 'MK +389', 'MT +356',
    'MD +373', 'MC +377', 'ME +352', 'NL +31', 'NO +47', 'PL +48', 'PT +351',
    'RO +40', 'RU +7', 'SM +378', 'RS +381', 'SK +421', 'SI +386', 'ES +34', 'SE +46',
    'CH +41', 'TR +90', 'UA +380', 'GB +44'
];

const educationLevels = [
    "podstawowe", "średnie", "wyższe", "zawodowe"
];

const languages = [
    "angielski", "niemiecki", "holenderski", "hiszpański", "francuski", "włoski",
    "norweski", "szwedzki", "belgijski", "ukraiński"
];

const drivingLicences = [
    "kat. A", "kat. B", "kat. B+E", "kat. C", "kat. C+E", "kat. D"
];

const languageLevels = [
    "A1", "A2", "B1", "B2", "C1", "C2"
];

const formErrors = [
    "Uzupełnij wymagane pola",
    "Coś poszło nie tak... Prosimy spróbować później"
];

const attachmentsErrors = [
    "Możesz dodać maksymalnie 5 załączników"
];

const currencies = [
    "EUR", "USD", "GBP", "CHF", "PLN"
];

const categories = [
    "Transport", "Budownictwo", "IT", "Handel", "Rolnictwo"
];

const nipCountries = [
    "BG", "HR", "CZ", "DK", "DE", "GB", "EE", "FI", "FR", "NL",
    "GR", "HU", "IT", "LV", "LT", "MT", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE", "NO", "UA", "TR", "BY"
]

const countries = [
    "Albania", "Andora", "Armenia", "Austria", "Azerbejdżan",
    "Białoruś", "Belgia", "Bośnia i Hercegowina", "Bułgaria", "Chorwacja",
    "Cypr", "Republika Czeska", "Dania", "Estonia", "Finlandia",
    "Francja", "Gruzja", "Niemcy", "Grecja", "Węgry",
    "Islandia", "Irlandia", "Włochy", "Łotwa", "Liechtenstein",
    "Litwa", "Luksemburg", "Macedonia", "Malta", "Moldova",
    "Monako", "Czarnogóra", "Holandia", "Norwegia", "Polska",
    "Portugalia", "Rumunia", "Rosja", "San Marino", "Serbia",
    "Słowacja", "Słowenia", "Hiszpania", "Szwecja", "Szwajcaria",
    "Turcja", "Ukraina", "Wielka Brytania"
];

const flags = [
    'al', 'ad', 'am', 'at', 'az',
    'by', 'be', 'ba', 'bg', 'cr',
    'cy', 'cz', 'dk', 'ee', 'fi',
    'fr', 'ge', 'de', 'gr', 'hu',
    'is', 'ie', 'it', 'lv', 'li',
    'lt', 'lu', 'mk', 'mt', 'md',
    'mc', 'me', 'nl', 'no', 'pl',
    'pt', 'ro', 'ru', 'sm', 'rs',
    'sk', 'si', 'es', 'se', 'ch',
    'tr', 'ua', 'gb'
];

const rooms = [
    "Pokój 1-osobowy", "Pokój 2-osobowy", "Pokój 3-osobowy"
];

const houses = [
    "Blok mieszkalny", "Dom jednorodzinny", "Szeregowiec", "Bungalow", "Camping"
];

const paymentTypes = [
    "Płatny dodatkowo", "Bezpłatny"
];

const pensionType = [
    "Wypłacane z pensji", "Wypłacane osobno"
];

const paycheckFrequency = [
    "Wypłacane co tydzień", "Wypłacane co miesiąc"
];

const pensionFrequency = [
    "Wypłacane jednorazowo", "Co tydzień"
];

const paycheckDay = [
    "W każdy poniedziałek", "W każdy wtorek", "W każdą środę", "W każdy czwartek", "W każdy piątek"
];

const healthInsuranceOptions = [
    "Płatne dodatkowo", "Darmowe"
];

const noInfo = "Brak informacji";

const contracts = [
    "Umowa o pracę", "Umowa zlecenie", "B2B"
];

const jobOfferErrors = [
    "Uzupełnij wymagane pola",
    ""
]

const myJobOffersFilter = [
    "Aktualne",
    "Nieaktualne",
    "Wszystkie"
]

const distances = [
    "+100 km", "+50 km", "+40 km", "+30 km", "+20 km", "+10 km", "+5 km"
];

const preferableContactForms = [
    "telefonicznie",
    "mailowo",
    "prywatna wiadomość przez Jooob.eu",
    "brak"
]

const privacyPolicy = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.",
    "Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.",
    "Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;",
    "Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.",
    "Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.",
    "Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.",
    "Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;",
    "Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.",
    "Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl."
]

const termsOfService = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.",
    "Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.",
    "Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;",
    "Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.",
    "Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula lacinia orci in vestibulum. Suspendisse dapibus tempus dapibus. Nulla vitae sollicitudin tortor. Cras sodales metus id sapien sagittis, ac lobortis ipsum dapibus. Integer justo ipsum, fringilla quis purus sed, interdum ullamcorper est. Sed non erat quis sem accumsan dapibus. Nunc hendrerit rutrum sapien, vitae fermentum nibh volutpat at. Fusce auctor laoreet aliquet. Nulla fermentum ut orci ac porta. Maecenas id mauris vel ex feugiat vulputate sed id nisl. Ut cursus dui nec elit rhoncus, sed condimentum dui pellentesque. Suspendisse et tortor gravida, molestie augue non, ornare ex. Etiam condimentum ipsum augue. Nunc lorem sem, accumsan consequat tristique ut, consequat quis magna.",
    "Donec libero lorem, aliquam vitae nisi eu, venenatis mattis mi. Cras sed velit vitae odio facilisis laoreet. Phasellus pharetra justo vitae nisl dignissim, vitae feugiat lectus mattis. Donec cursus dolor purus. Vestibulum tellus ante, faucibus eget sem a, finibus finibus lacus. Pellentesque placerat scelerisque libero vel molestie. Integer suscipit rhoncus velit, eget tempor turpis luctus ut. Cras bibendum fringilla egestas. Sed semper orci felis, eu commodo nibh consequat sed. Sed eleifend in erat vel tempor.",
    "Praesent molestie mattis felis et porttitor. Donec ut dignissim tellus. Praesent lobortis lorem sed ex porta lobortis. Sed odio ipsum, malesuada et risus a, bibendum euismod enim. Integer consequat, sapien nec pellentesque ultricies, magna purus ultricies libero, in aliquam elit metus ac neque. Morbi sit amet bibendum eros. Aliquam id cursus mi. Fusce viverra massa sapien, eu condimentum est congue quis. Integer lectus lacus, efficitur lacinia interdum id, tincidunt sed nulla. Nullam tempor vehicula sem, ac fringilla nunc consectetur vel. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;",
    "Ut tincidunt orci vitae posuere faucibus. Nunc imperdiet mauris a nisl placerat auctor. Suspendisse in ultrices risus, eget ultrices justo. Vestibulum tempus ornare justo. Maecenas sodales lorem et velit porttitor, eget mattis nunc eleifend. Donec fermentum facilisis mi ac sodales. Vestibulum ullamcorper efficitur tellus non feugiat. Ut mollis lectus nec sem tincidunt ullamcorper. Morbi dapibus iaculis iaculis. Nam malesuada libero justo, eu vehicula elit mollis ac.",
    "Quisque eget tortor interdum, tincidunt nulla a, tempor nunc. Duis vel nisi volutpat, ullamcorper ligula non, pellentesque augue. Vivamus faucibus dictum nibh, eu blandit elit accumsan eu. Vestibulum tempus sapien velit, vitae aliquet lectus dapibus sed. In congue hendrerit tortor, vitae dapibus enim volutpat ut. Praesent mollis lectus nec mi tincidunt, sed accumsan dolor laoreet. Curabitur id faucibus neque, sed ultrices leo. Sed commodo tortor felis, ac faucibus quam suscipit quis. Sed convallis, est in fermentum mollis, lectus velit sagittis lectus, quis rhoncus sapien dolor non sem. Etiam sit amet enim arcu. Praesent pulvinar, est nec sagittis scelerisque, enim tellus sodales purus, et sagittis est tellus eget diam. Donec a sagittis sem. Praesent ultricies dapibus magna quis laoreet. Nam sit amet accumsan enim. Praesent nec purus at neque bibendum vehicula. Fusce eu laoreet nisl."
]

const notificationTitles = [
    "Nowa oferta pracy dla Ciebie",
    "Nowa błyskawiczna oferta pracy dla Ciebie",
    "aplikował/a na Twoją ofertę pracy",
    "Znaleźliśmy kandydata pasującego do Twojej oferty pracy"
];

const homeMenu = [
    {
        label: "Strona główna",
        link: "/"
    },
    {
        label: "Funkcje portalu",
        link: "/#funkcje"
    },
    {
        label: "Partnerzy",
        link: "/#partnerzy"
    },
    {
        label: "Kontakt",
        link: "/kontakt"
    }
];

const adminMenu = [
    {
        label: 'Home',
        link: '/panel'
    },
    {
        label: 'Agencje',
        link: '/panel/agencje'
    },
    {
        label: 'Pracownicy',
        link: '/panel/pracownicy'
    },
    {
        label: 'Oferty',
        link: '/panel/oferty'
    },
    {
        label: 'Oferty błyskawiczne',
        link: '/panel/oferty-blyskawiczne'
    }
]

const adminMenuLabels = ['Home', 'Agencje', 'Pracownicy', 'Oferty', 'Oferty błyskawiczne'];

const userMenu = [
    {
        label: "Moje konto",
        link: "/konto-pracownika"
    },
    {
        label: "Aktywne oferty pracy",
        link: "/oferty-pracy"
    },
    {
        label: "Oferty błyskawiczne",
        link: "/oferty-blyskawiczne"
    },
    {
        label: "Pracodawcy",
        link: "/pracodawcy"
    },
    {
        label: "Kontakt",
        link: "/kontakt"
    },
    {
        label: "Zmień hasło",
        link: "/zmiana-hasla"
    }
]

const agencyMenu = [
    {
        label: "Moje konto",
        link: "/konto-agencji"
    },
    {
        label: "Zgłoszenia",
        link: "/zgloszenia"
    },
    {
        label: "Moje oferty",
        link: "/moje-oferty-pracy"
    },
    {
        label: "Moje oferty błyskawiczne",
        link: "/moje-blyskawiczne-oferty-pracy"
    },
    {
        label: "Dodaj ofertę pracy",
        link: "/dodaj-oferte-pracy"
    },
    {
        label: "Dodaj błyskawiczną ofertę pracy",
        link: "/dodaj-blyskawiczna-oferte-pracy"
    },
    {
        label: "Kandydaci",
        link: "/kandydaci"
    },
    {
        label: "Zmień hasło",
        link: "/zmiana-hasla"
    }
]

const languageVersions = [
    "BG", "HR", "CZ", "DK", "DE", "GB", "EE", "FI", "FR", "NL",
    "GR", "HU", "IT", "LV", "LT", "MT", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE", "NO", "UA", "TR", "BY"
]

export { steps, stepsContent, stepsMainContent, months, countries, phoneNumbers, formErrors, educationLevels, languages, drivingLicences,
    languageLevels, currencies, categories, attachmentsErrors, flags, stepsAgency, stepsAgencyContent, stepsAgencyMainContent, nipCountries,
    rooms, houses, paymentTypes, pensionType, paycheckFrequency, pensionFrequency, paycheckDay, healthInsuranceOptions, noInfo, contracts,
    jobOfferErrors, myJobOffersFilter, distances, preferableContactForms, privacyPolicy, termsOfService, notificationTitles,
    homeMenu, userMenu, agencyMenu, unsupportedMediaTypeInfo, languageVersions, adminMenu, adminMenuLabels
}

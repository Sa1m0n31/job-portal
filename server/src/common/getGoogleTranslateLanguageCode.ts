const getGoogleTranslateLanguageCode = (lang) => {
    const flagCodes = ["BG", "HR", "CZ", "DK", "DE", "GB", "EE", "FI", "FR", "NL",
        "GR", "HU", "IT", "LV", "LT", "MT", "PT", "RO", "SK",
        "SI", "ES", "SE", "NO", "UA", "TR", "BY", "PL"].map((item) => (item.toLowerCase()));
    const googleCodes = ['bg', 'hr', 'cs', 'da', 'de', 'en', 'et', 'fi', 'fr', 'nl', 'el', 'hu', 'it', 'lv', 'lt', 'mt', 'pt',
        'ro', 'sk', 'si', 'es', 'sv', 'no', 'uk', 'tr', 'be', 'pl'];

    return googleCodes[flagCodes.findIndex((item) => (item === lang))];
}

export { getGoogleTranslateLanguageCode }

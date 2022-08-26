const removeLanguageSpecificCharacters = (str) => {
    return str
        .replace('«', '"')
        .replace('»', '"')
        .replace('“', '"')
        .replace('„', '"')
        .replace('‘', '"')
        .replace('\`', '"');
}

export { removeLanguageSpecificCharacters }

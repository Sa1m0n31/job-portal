const removeLanguageSpecificCharacters = (str) => {
    if(str) {
        return str
            .replace('«', '"')
            .replace('»', '"')
            .replace('“', '"')
            .replace('„', '"')
            .replace('‘', '"')
            .replace('\`', '"');
    }
    else {
        return '';
    }
}

export { removeLanguageSpecificCharacters }

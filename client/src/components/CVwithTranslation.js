import React, {useEffect, useState} from 'react';
import {Page, Text, Font, View, Document, StyleSheet, Image} from '@react-pdf/renderer';
import {addLeadingZero} from "../helpers/others";
import {getUserData} from "../helpers/user";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
            fontWeight: 700
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
            fontWeight: 400
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
            fontWeight: 300
        }
    ]
});

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        fontFamily: 'Roboto',
        padding: '5% 10%'
    },
    block: {
      display: 'block',
    },
    column: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    sectionHeader: {
        fontWeight: 700,
        textAlign: 'left',
        fontSize: '12px',
        textTransform: 'uppercase',
        borderTop: '1px solid #C1C1C1',
        borderBottom: '1px solid #C1C1C1',
        padding: '7px 0',
        margin: '0 0 5px',
        width: '100%'
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    profileImage: {
        width: '150px',
        height: 'auto',
        border: '5px solid #F9F9F9',
        borderRadius: '3px'
    },
    mainSection: {
        width: '100%',
        marginBottom: '20px'
    },
    text: {
        fontSize: '11px',
        fontWeight: 300,
    },
    descText: {
        marginTop: '7px',
        fontSize: '11px',
        fontWeight: 300,
        whiteSpace: 'pre-wrap'
    },
    textWithMarginBottom: {
        fontSize: '11px',
        fontWeight: 300,
        marginBottom: '8px'
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    textBig: {
        fontSize: '21px',
        fontWeight: 700,
        textAlign: 'center',
        margin: '20px auto 0'
    },
    textBigCompany: {
        fontSize: '21px',
        fontWeight: 700,
        textAlign: 'left',
        margin: '20px 0 0'
    },
    categories: {
        fontSize: '12px',
        fontWeight: 300,
        textAlign: 'center',
        color: '#888888',
        margin: '5px auto 25px'
    },
    categoriesCompany: {
        fontSize: '12px',
        fontWeight: 300,
        textAlign: 'left',
        color: '#888888',
        margin: '5px 0 25px'
    },
    icon: {
        width: '15px',
        marginRight: '10px'
    },
    textSmall: {
        color: '#888888',
        fontSize: '10px',
        marginRight: '5px',
        display: 'block',
        width: '100%',
        marginTop: '8px'
    },
    schoolName: {
        textTransform: 'uppercase',
        fontSize: '12px',
        marginTop: '5px'
    },
    schoolDate: {
        color: '#888888',
        fontSize: '11px',
        fontWeight: 300,
        marginBottom: '5px'
    },
    schoolTitle: {
        color: '#888888',
        fontSize: '11px',
        margin: '4px 0'
    },
    topRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%'
    },
    topRowRight: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    logo: {
        width: '50px'
    },
    companyName: {
        color: '#888888',
        fontSize: '9px',
        margin: '8px 0 2px',
        textAlign: 'right'
    },
    date: {
        color: '#888888',
        fontSize: '6px',
        textAlign: 'right'
    }
});

const CVwithTranslation = ({profileImage, fullName, phoneNumber, email, location, categories, birthday, schools, jobs, languages, additionalLanguages,
                translate, drivingLicence, certs, desc, companyLogo, companyName, currentPlace, availability, ownAccommodation, ownTools, salary, c}) => {
    const [user, setUser] = useState({});
    const [render, setRender] = useState(false);

    useEffect(() => {
        if(translate) {
            getUserData(email)
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    setRender(true);
                });
        }
        else {
            setRender(true);
        }
    }, [translate]);

    useEffect(() => {
        if(user) {
            setRender(true);
        }
    }, [user]);

    return render ? <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.column}>
                <Text>
                    Witam 123
                </Text>
            </View>
        </Page>
    </Document> : <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.column}>
                <Text>
                    Dupa 2
                </Text>
            </View>
        </Page>
    </Document>
};

export default CVwithTranslation;

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

const CV = ({profileImage, fullName, phoneNumber, email, location, categories, birthday, schools, jobs, languages, additionalLanguages,
                translate, drivingLicence, certs, desc, companyLogo, companyName, currentPlace, availability, ownAccommodation, ownTools, salary, c}) => {
    const [user, setUser] = useState({});
    const [render, setRender] = useState(false);

    useEffect(() => {
        if(translate) {
            getUserData(email)
                .then((res) => {
                    setUser(JSON.parse(res.data.data));
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
                {companyLogo ? <View style={styles.topRow}>
                    <View>
                        <Image src={profileImage} style={styles.profileImage}>

                        </Image>
                        <Text style={styles.textBigCompany}>
                            {fullName}
                        </Text>
                        <Text style={styles.categoriesCompany}>
                            {categories?.map((item, index, array) => {
                                if(index === array.length - 1) {
                                    return JSON.parse(c.categories)[item];
                                }
                                else {
                                    return `${JSON.parse(c.categories)[item]}, `;
                                }
                            })}
                        </Text>
                    </View>
                    <View style={styles.topRowRight}>
                        <Image src={companyLogo} style={styles.logo}>

                        </Image>
                        <Text style={styles.companyName}>
                            {companyName}
                        </Text>
                        <Text style={styles.date}>
                            {c.generated}: {addLeadingZero(new Date().getDate())}.{addLeadingZero(new Date().getMonth()+1)}.{new Date().getFullYear()}
                        </Text>
                    </View>
                </View> : <>
                    <Image src={profileImage} style={styles.profileImage}>

                    </Image>
                    <Text style={styles.textBig}>
                        {fullName}
                    </Text>
                    <Text style={styles.categories}>
                        {categories?.map((item, index, array) => {
                            if(index === array.length - 1) {
                                return JSON.parse(c.categories)[item];
                            }
                            else {
                                return `${JSON.parse(c.categories)[item]}, `;
                            }
                        })}
                    </Text>
                </>
                }

                <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.mainData}
                    </Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.textSmall}>{c.birthday?.toLowerCase()}: </Text>
                        <Text style={styles.text}>
                            {birthday}
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textSmall}>{c.telShortcut}: </Text>
                        <Text style={styles.text}>
                            {phoneNumber}
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textSmall}>{c.emailShortcut}: </Text>
                        <Text style={styles.text}>
                            {email}
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textSmall}>{c.livingLocation}: </Text>
                        <Text style={styles.text}>
                            {location}
                        </Text>
                    </View>
                </View>

                {schools?.length ? <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.education}
                    </Text>
                    {schools?.map((item) => {
                        return <View style={styles.textContainer}>
                            <Text style={styles.schoolName}>
                                {item.name}
                            </Text>
                            <Text style={styles.schoolTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.schoolDate}>
                                {item.from} - {item.to ? item.to : c.during}
                            </Text>
                        </View>
                    })}
                </View> : ''}

                {jobs?.length ? <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.jobExperience}
                    </Text>
                    {user?.jobs ? user.jobs?.map((item) => {
                        return <View style={styles.textContainer}>
                            <Text style={styles.schoolName}>
                                {item.name}
                            </Text>
                            <Text style={styles.schoolTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.schoolDate}>
                                {item.from} - {item.to ? item.to : c.during}
                            </Text>
                            {Array.isArray(item?.responsibilities) ? item.responsibilities.map((item, index) => {
                                return <Text style={styles.textWithMarginBottom}
                                             key={index}>
                                    &bull; {item}
                                </Text>
                            }) : ''}
                        </View>
                    }) : jobs?.map((item) => {
                        return <View style={styles.textContainer}>
                            <Text style={styles.schoolName}>
                                {item.name}
                            </Text>
                            <Text style={styles.schoolTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.schoolDate}>
                                {item.from} - {item.to ? item.to : c.during}
                            </Text>
                            {Array.isArray(item?.responsibilities) ? item.responsibilities.map((item, index) => {
                                return <Text style={styles.textWithMarginBottom}
                                             key={index}>
                                    &bull; {item}
                                </Text>
                            }) : ''}
                        </View>
                    })}
                </View> : ''}

                {languages?.length || drivingLicence?.length ? <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.skills}
                    </Text>
                    {languages?.length ? <View style={styles.textContainer}>
                        <Text style={styles.textSmall}>{c.foreignLanguages}: </Text>
                        <Text style={styles.text}>
                            {languages.map((item, index, array) => {
                                if(index === array.length-1 && !additionalLanguages) {
                                    return `${JSON.parse(c.languages)[item.language]} - ${item.lvl}`;
                                }
                                else {
                                    return `${JSON.parse(c.languages)[item.language]} - ${item.lvl}, `;
                                }
                            })}
                            <Text style={styles.block}>
                                {additionalLanguages}
                            </Text>
                        </Text>
                    </View> : ""}
                    {drivingLicence?.length ? <View style={styles.textContainer}>
                        <Text style={styles.textSmall}>{c.drivingLicence}: </Text>
                        <Text style={styles.text}>
                            {drivingLicence.map((item, index, array) => {
                                if(index === array.length-1) {
                                    return `${JSON.parse(c.drivingLicences)[item]}`;
                                }
                                else {
                                    return `${JSON.parse(c.drivingLicences)[item]}, `;
                                }
                            })}
                        </Text>
                    </View> : ""}
                </View> : ''}

                {certs?.length ? <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.coursesAndCertificates}
                    </Text>
                    {user?.certificates ? user.certificates?.map((item) => {
                        return <View style={styles.textContainer}>
                            <Text style={styles.textWithMarginBottom}>
                                &bull; {item}
                            </Text>
                        </View>
                    }) : certs?.map((item) => {
                        return <View style={styles.textContainer}>
                            <Text style={styles.textWithMarginBottom}>
                                &bull; {item}
                            </Text>
                        </View>
                    })}
                </View> : ''}

                {desc ? <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.currentSituationDescription}
                    </Text>
                    <Text style={styles.descText}>
                        {user?.situationDescription ? user.situationDescription : desc}
                    </Text>
                </View> : ''}

                <View style={styles.mainSection}>
                    <Text style={styles.sectionHeader}>
                        {c.additionalInfo}
                    </Text>
                    <Text style={styles.textSmall}>{c.currentLivingPlace}: </Text>
                    <Text style={styles.text}>
                        {currentPlace}
                    </Text>

                    <Text style={styles.textSmall}>{c.availabilityFrom}: </Text>
                    <Text style={styles.text}>
                        {availability}
                    </Text>

                    <Text style={styles.textSmall}>{c.salaryExpectations}: </Text>
                    <Text style={styles.text}>
                        {salary}
                    </Text>

                    {ownAccommodation ? <>
                        <Text style={styles.textSmall}>{c.ownAccommodationInNetherlands}: </Text>
                        <Text style={styles.text}>
                            {ownAccommodation}
                        </Text>
                    </> : ''}

                    {ownTools ? <>
                        <Text style={styles.textSmall}>{c.ownTools}: </Text>
                        <Text style={styles.text}>
                            {c.yes}
                        </Text>
                    </>: ''}
                </View>
            </View>
        </Page>
    </Document> : <Document>
        <Page size="A4" style={styles.page}>
            Something went wrong...
        </Page>
    </Document>
};

export default CV;

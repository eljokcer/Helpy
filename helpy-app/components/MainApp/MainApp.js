import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { NavigationActions } from 'react-navigation';
import MenuButton from '../General/MenuButton';
import ExistingReport from '../Reports/ExistingReprot';
import ExistingReprotOnMap from '../Reports/ExistingReprotOnMap';
import LogoApp from '../General/LogoApp';
import SQL from "../../Handlers/SQL";

import { LinearGradient, MapView, Location, Permissions } from 'expo';
const { Marker } = MapView;


class MainApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.navigation.state.params,
            location: null,
            loading: true,
            report: null,
        }
    }

    componentDidMount = async () => {
        console.log('userid=', this.state.userId)
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log('Permission to access location was denied')
        }

        const location = await Location.getCurrentPositionAsync({});
        //console.log(location);
        this.setState({ location }, async () => {
            if (this.state.location) {
                //let reverseGC = await Location.reverseGeocodeAsync(this.state.location.coords);
                //console.log('reversGC=', reverseGC)
                //this.setState({ reverseGC: reverseGC });
            } else {
                alert('You must push the Location button first in order to get the location before you can get the reverse geocode for the latitude and longitude!');
            }
        });

        const Report = await SQL.GetDailyReportsByLocation(this.state.location.coords.latitude, this.state.location.coords.longitude);

        //console.log("report=", Report);
        const report = await JSON.parse(Report);
        console.log("report=", report);
        this.setState({
            report: report,
            loading: false
        });
    }

    _handlePressAddReport = async () => {

        const navigateAction = NavigationActions.navigate({
            routeName: 'ReportType',
            params: this.state.userId,
        });
        this.props.navigation.dispatch(navigateAction)
    }

    render() {

        if (this.state.report == null || this.state.loading) {
            return (
                <View style={{ flex: 1 }}>

                    <LinearGradient
                        colors={['#358FE2', '#2C0A8C']}
                        start={[0.1, 0.1]}
                        style={{
                            flex: 1,
                            left: 0,
                            right: 0,
                            top: 0,
                        }}
                    >
                        <ActivityIndicator style={{ paddingTop: 150 }} size="large" color="#ff0000" />
                    </LinearGradient>
                </View>
            )
        }

        else {
            //console.log('lat=', this.state.report[0])
            const existingReport = this.state.report.map((r, id) => {
                //console.log('r=', r);
                return (
                    <ExistingReport key={id} report={r} />
                )
            });

            const existingReprotOnMap = this.state.report.map((r, id) => {
                return (
                    <ExistingReprotOnMap key={id} report={r} />
                )
            });
            return (
                <View style={{ flex: 1 }}>

                    <LinearGradient
                        colors={['#358FE2', '#2C0A8C']}
                        start={[0.1, 0.1]}
                        style={{
                            flex: 1,
                            left: 0,
                            right: 0,
                            top: 0,
                        }}
                    >

                        <MenuButton />
                        <LogoApp styles={[styles.logo, styles.image]} />

                        <View style={styles.btnStatus}>
                            <TouchableOpacity
                                style={styles.btnSubmitTH2}
                                onPress={() => { console.log('clicked') }}

                            >
                                <Text style={styles.txtSubmit3}>מצב דיווח</Text>
                            </TouchableOpacity >
                        </View>

                        <View style={styles.content}>
                            <View style={{
                                borderColor: '#fff',
                                borderWidth: 2,
                                height: 300,
                            }}>

                                <MapView
                                    style={{
                                        flex: 2,
                                        width: Dimensions.get('window').width - 30,
                                        height: 300,
                                    }}
                                    region={{
                                        latitude: this.state.location.coords.latitude,
                                        longitude: this.state.location.coords.longitude,
                                        latitudeDelta: 0.00822,
                                        longitudeDelta: 0.00821,
                                    }}
                                >

                                    <Marker
                                        coordinate={{
                                            latitude: this.state.location.coords.latitude,
                                            longitude: this.state.location.coords.longitude
                                        }}
                                        title='my place:)'
                                        description='here i am'
                                    >
                                    </Marker>
                                    {existingReprotOnMap}
                                </MapView>

                            </View>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.headerReport}>דיווחים קיימים</Text>

                            <ScrollView style={{ height: 150, paddingTop: 12 }}>
                                {existingReport}
                            </ScrollView>

                            <View style={styles.btnSubmitView}>
                                <TouchableOpacity
                                    style={styles.btnSubmitTH}
                                    onPress={this._handlePressAddReport}
                                >
                                    <Text style={styles.txtSubmit2}>הוסף דיווח</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </LinearGradient>
                </View>

            );
        }
    }
}
export default MainApp;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        marginBottom: 30,
    },
    btnTouchOpacity: {
        padding: 14,
        paddingTop: 10,
        paddingHorizontal: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
    },
    btnView: {
        margin: 0,
        paddingTop: 20,
        alignItems: 'center',
    },
    logo: {
        alignItems: 'center',
        paddingTop: 50,
    },
    image: {
        width: 55,
        height: 55,
    },
    btnSubmitView: {
        width: 120,
        paddingTop: 25,
        paddingBottom: 50,
        alignItems: 'center',
    },
    btnSubmitTH: {
        width: 120,
        padding: 14,
        paddingBottom: 5,
        paddingTop: 5,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    txtSubmit2: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btnStatus: {
        width: 120,
        zIndex: 9,
        position: 'absolute',
        top: 55,
        left: 20,
    },
    btnSubmitTH2: {
        width: 120,
        padding: 14,
        paddingBottom: 5,
        paddingTop: 5,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    txtSubmit3: {
        fontSize: 12,
        color: 'black',
        textAlign: 'center',
    },
    headerReport: {
        color: '#F6E8E8',
        fontSize: 24,
        textAlign: 'center',

    },
    contentContainer: {
        flex: 1,
        paddingVertical: 20
    }
});


import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    TextInput
} from 'react-native';
import SearchInput from './serachInput'

import getImageForWeather from './getImageForWeather'

export default class App extends React.Component {

    constructor(context, props) {
        super(context, props)

        this.state = {
            searchText: 'London',
            location: 'London',
            loading: false,
            error: false,
            temperature: 0,
            weather: ''
        }
    }


    async componentDidMount() {
        const a = await this._onSubmit();
    }

    _fetchLocationId = async () => {

        try {
            const response = await fetch(`https://www.metaweather.com/api/location/search/?query=${this.state.location}`)
            const locations = await response.json();

            if (locations[0]) {
                return locations[0]['woeid'];
            }

            return -1;
        } catch (e) {
            return -1;
        }
    }

    _fetchCurrentWeather = async (locationId) => {

        const response = await fetch(`https://www.metaweather.com/api/location/${locationId}/`);

        const {title, consolidated_weather} = await response.json();

        const {weather_state_name, the_temp} = consolidated_weather[0];

        return {
            location: title,
            weather: weather_state_name,
            temperature: the_temp,
        }

    }

    _onChangeText = (searchText) => {
        this.setState({searchText})
    }

    _onSubmit = async () => {
        const {searchText} = this.state

        if (!searchText || searchText.length === 0) {
            return;
        }

        this.setState({
            loading: true,
            location: searchText,
            searchText: ''
        }, async () => {
            try {

                const locationId = await this._fetchLocationId(this.state.location);

                if (locationId === -1) {
                    throw Error('unable to get weather');
                }

                const {location, weather, temperature} = await this._fetchCurrentWeather(locationId);

                this.setState({
                    loading: false,
                    error: false,
                    location,
                    weather,
                    temperature
                })

            } catch (err) {
                this.setState({
                    error: true,
                    loading: false
                })
            }
        })
    }

    render() {
        const {loading, error, searchText, weather, temperature, location} = this.state;

        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding'>

                <StatusBar barStyle='light-content'/>

                <ImageBackground
                    source={getImageForWeather(weather)}
                    style={styles.imageContainer}
                    imageStyle={styles.image}/>

                <View style={styles.detailsContainer}>

                    <ActivityIndicator animating={loading} color='white' size='large'/>

                    {!loading &&

                    (<View>

                        {error &&
                        (<Text style={[styles.textStyle, styles.smallText]}>Couldn't load weather
                            for <Text style={styles.textDanger}>{location}</Text>. Please try
                            a different city.</Text>)
                        }

                        {!error && (
                            <View>
                                <Text style={[styles.textStyle, styles.largeText]}>{location}</Text>
                                <Text style={[styles.textStyle, styles.smallText]}>{weather}</Text>
                                <Text style={[styles.textStyle, styles.largeText]}>{`${Math.round(temperature)}`}</Text>
                            </View>)
                        }

                    </View>)

                    }

                    <SearchInput
                        placeholder='Search for city'
                        searchValue={searchText}
                        onChangeText={this._onChangeText}
                        onSubmit={this._onSubmit}
                    />

                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495E'
    },
    imageContainer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0, .1)',
        paddingHorizontal: 20,
    },
    textStyle: {
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
        color: 'white',
    },
    largeText: {
        fontSize: 44,
    },
    smallText: {
        fontSize: 18
    },
    textDanger: {
        color: 'red'
    }
});

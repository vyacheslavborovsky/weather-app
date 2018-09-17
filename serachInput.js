import React, { PureComponent } from 'react'

import { View, TextInput, StyleSheet } from 'react-native'


export default class SearchInput extends PureComponent {


    render() {

        const { placeholder, onChangeText, searchValue, onSubmit } = this.props;

        return (
            <View style={styles.container}>
                <TextInput
                    autoCorrect={false}
                    placeholder={placeholder}
                    placeholderTextColor='white'
                    style={styles.textInput}
                    value={searchValue}
                    underlineColorAndroid='transparent'
                    clearButtonMode='always'
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmit}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: 20,
        backgroundColor: '#aaaeee',
        marginHorizontal: 40,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    textInput: {
        flex: 1,
        color: 'black'
    }
})

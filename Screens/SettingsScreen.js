import React, { PureComponent } from 'react';
import { View, Text, Switch } from 'react-native';

export class SettingsScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            OnSearchItemPressedPlay: false,
        };
    }

    toggleSwitchOnSearchItemPressedPlay = () => {
        this.setState({ OnSearchItemPressedPlay: !this.state.OnSearchItemPressedPlay });
    };

    SettingsContainer = ({children}) => {
        return (
            <View style={{ height: 50, borderColor: 'purple', borderWidth: 1, marginBottom: 5, borderRadius: 25 }}>
                <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center' }}>
                    {children}
                </View>
            </View>
        );
    }

    SearchItemSwitch = ({onValueChange, value, text}) => {
        return (
            <>
                <Text style={{marginLeft : 10, color : value ? 'purple': 'white'}}>{text}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "purple" }}
                    thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onValueChange}
                    value={value}
                    style={{marginRight : 10}}
                />
            </>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                {this.SettingsContainer({
                    children: this.SearchItemSwitch({
                        onValueChange: this.toggleSwitchOnSearchItemPressedPlay,
                        value: this.state.OnSearchItemPressedPlay,
                        text: 'Play when search item is pressed'
                    })
                })}
            </View>
        )
    }
}

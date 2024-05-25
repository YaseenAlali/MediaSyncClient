import { View } from "react-native";
import { useEffect, useState } from "react";
import TrackPlayer, { useProgress } from "react-native-track-player";
import Slider from "@react-native-community/slider";
export const PlayerSlider = () => {
    const { position, duration } = useProgress();
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        setSliderValue(position);
    }, [position]);

    return (
        <View>
            <Slider
                value={sliderValue}
                maximumValue={duration}
                onValueChange={(value) => setSliderValue(value)}
                onSlidingComplete={(value) => {
                    TrackPlayer.seekTo(value);
                }}
                style={{borderColor : 'white'}}
            />
        </View>
    );
};

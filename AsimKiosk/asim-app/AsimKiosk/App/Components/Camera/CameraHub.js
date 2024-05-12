import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, } from 'react-native';
import { RNCamera } from 'react-native-camera';
import StaticData from '../../Variables/StaticData';
const CameraHub = () => {

  const cameraRef = useRef(null);
  const [isMorning, setIsMorning] = React.useState(true);

  useEffect(() => {
    StaticData.cameraServices = cameraRef;
    const updateIsMorning = () => {
      const currentHour = new Date().getHours();
      setIsMorning(currentHour >= 6 && currentHour < 18); // Assume morning is from 6:00 to 17:59
    };

    setInterval(updateIsMorning, 3600000); // Update every minute
    updateIsMorning(); // Initialize value

  }, []);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        style={styles.preview}
        // type={RNCamera.Constants.Type.back}
        type={isMorning ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 1,
    height: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    width: 1,
    height: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export default CameraHub;
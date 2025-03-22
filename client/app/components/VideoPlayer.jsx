import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, Platform } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VideoPlayer = ({ videoId, visible, onClose }) => {
  const [playing, setPlaying] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      setDimensions(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', updateLayout);

    return () => {
      // Clean up event listener
      const dimensionsEventEmitter = Dimensions.removeEventListener?.('change', updateLayout);
      if (dimensionsEventEmitter?.remove) {
        dimensionsEventEmitter.remove();
      }
    };
  }, []);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      setIsFullScreen(false);
    }
  }, []);

  const handleFullScreenChange = useCallback((fullScreen) => {
    setIsFullScreen(fullScreen);
  }, []);

  const isPortrait = dimensions.height > dimensions.width;

  const calculateVideoHeight = () => {
    if (isPortrait) {
      // In portrait mode, use 16:9 aspect ratio
      return dimensions.width * (9/16);
    } else {
      // In landscape mode, use almost full height
      return dimensions.height - 20;
    }
  };

  const calculateVideoWidth = () => {
    if (isPortrait) {
      // In portrait mode, use full width
      return dimensions.width;
    } else {
      // In landscape mode, maintain 16:9 aspect ratio
      return (dimensions.height - 20) * (16/9);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => {
        setIsFullScreen(false);
        onClose();
      }}>
      <View style={[
        styles.modalContainer,
        !isPortrait && styles.modalContainerLandscape
      ]}>
        <View style={[
          styles.videoContainer,
          {
            height: calculateVideoHeight(),
            width: calculateVideoWidth(),
            alignSelf: 'center',
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.closeButton,
              !isPortrait && styles.closeButtonLandscape
            ]} 
            onPress={() => {
              setIsFullScreen(false);
              onClose();
            }}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <YoutubePlayer
            height={calculateVideoHeight()}
            width={calculateVideoWidth()}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            onFullScreenChange={handleFullScreenChange}
            webViewProps={{
              androidLayerType: Platform.OS === 'android' ? 'hardware' : undefined,
              androidHardwareAccelerationDisabled: false,
            }}
            forceAndroidAutoplay={true}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerLandscape: {
    backgroundColor: '#000',
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeButtonLandscape: {
    top: 20,
    right: 20,
  },
});

export default VideoPlayer; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import VideoPlayer from '../components/VideoPlayer';
import { getCachedTutorials } from '../services/youtubeService';
import { colors, shadows, semantic } from '../theme/colors';

export default function SkillTutorialsScreen() {
  const { skill } = useLocalSearchParams();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  useEffect(() => {
    loadTutorials();
  }, [skill]);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      const skillTutorials = await getCachedTutorials(skill);
      setTutorials(skillTutorials);
    } catch (error) {
      console.error('Error loading tutorials:', error);
      setError('Failed to load tutorials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (videoId) => {
    setSelectedVideo(videoId);
    setVideoModalVisible(true);
  };

  const renderTutorialItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tutorialCard}
      onPress={() => handleVideoPress(item.id)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
      />
      <View style={styles.playButton}>
        <MaterialCommunityIcons name="play-circle" size={40} color="#fff" />
      </View>
      <View style={styles.tutorialInfo}>
        <Text style={styles.tutorialTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.tutorialMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="account" size={14} color={semantic.text.secondary} />
            <Text style={styles.metaText}>{item.channelTitle}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading tutorials...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={60} color={colors.status.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadTutorials}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tutorials}
        renderItem={renderTutorialItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="video-off" size={60} color={colors.primary.main} />
            <Text style={styles.emptyText}>No tutorials available for {skill}</Text>
          </View>
        }
      />

      <VideoPlayer
        videoId={selectedVideo}
        visible={videoModalVisible}
        onClose={() => {
          setVideoModalVisible(false);
          setSelectedVideo(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.paper,
  },
  listContainer: {
    padding: 16,
  },
  tutorialCard: {
    backgroundColor: semantic.background.paper,
    borderRadius: 12,
    marginBottom: 16,
    ...shadows.small,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  tutorialInfo: {
    padding: 16,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 8,
  },
  tutorialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: semantic.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: semantic.text.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: semantic.text.secondary,
    textAlign: 'center',
  },
}); 
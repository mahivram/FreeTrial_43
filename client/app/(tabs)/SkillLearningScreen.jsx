import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import VideoPlayer from '../components/VideoPlayer';
import SkillsEditor from '../components/SkillsEditor';
import { getCachedTutorials } from '../services/youtubeService';
import { colors, shadows, semantic, components } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const skillCategories = [
  {
    category: 'Culinary Arts',
    skills: [
      { id: 1, name: 'Baking & Pastry', icon: 'cake-variant' },
      { id: 2, name: 'Traditional Cooking', icon: 'pot-steam' },
      { id: 3, name: 'Food Preservation', icon: 'food-variant' },
      { id: 4, name: 'Catering Business', icon: 'food-fork-drink' },
      { id: 5, name: 'International Cuisine', icon: 'earth' },
    ],
  },
  {
    category: 'Textile & Crafts',
    skills: [
      { id: 6, name: 'Tailoring', icon: 'scissors-cutting' },
      { id: 7, name: 'Embroidery', icon: 'needle' },
      { id: 8, name: 'Knitting', icon: 'yarn' },
      { id: 9, name: 'Fashion Design', icon: 'tshirt-crew' },
      { id: 10, name: 'Jewelry Making', icon: 'diamond-stone' },
    ],
  },
  {
    category: 'Home & Lifestyle',
    skills: [
      { id: 11, name: 'Interior Design', icon: 'home-variant' },
      { id: 12, name: 'Garden & Agriculture', icon: 'sprout' },
      { id: 13, name: 'Home Organization', icon: 'home-heart' },
      { id: 14, name: 'Event Planning', icon: 'calendar-star' },
      { id: 15, name: 'Beauty & Wellness', icon: 'spa' },
    ],
  },
  {
    category: 'Digital & Tech',
    skills: [
      { id: 16, name: 'Social Media', icon: 'instagram' },
      { id: 17, name: 'Basic Web Design', icon: 'web' },
      { id: 18, name: 'Digital Marketing', icon: 'trending-up' },
      { id: 19, name: 'Content Creation', icon: 'video' },
      { id: 20, name: 'Online Business', icon: 'shopping' },
    ],
  },
  {
    category: 'Education & Care',
    skills: [
      { id: 21, name: 'Teaching', icon: 'school' },
      { id: 22, name: 'Child Care', icon: 'baby-face' },
      { id: 23, name: 'Elder Care', icon: 'account-child' },
      { id: 24, name: 'Counseling', icon: 'heart-pulse' },
      { id: 25, name: 'Life Coaching', icon: 'lightbulb-on' },
    ],
  },
  {
    category: 'Professional Tech',
    skills: [
      { id: 26, name: 'Data Entry', icon: 'keyboard' },
      { id: 27, name: 'MS Office', icon: 'microsoft-office' },
      { id: 28, name: 'Email Management', icon: 'email' },
      { id: 29, name: 'Virtual Assistant', icon: 'desktop-mac' },
      { id: 30, name: 'Customer Service', icon: 'headset' },
    ],
  },
];

const SkillLearningScreen = () => {
  const router = useRouter();
  const { userSkills, setUserSkills } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [skillsEditorVisible, setSkillsEditorVisible] = useState(false);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [tutorials, setTutorials] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userSkills && userSkills.length > 0) {
      setCurrentSkills(userSkills);
    }
  }, [userSkills]);

  const loadTutorials = useCallback(async (skills) => {
    if (!skills || skills.length === 0) {
      setTutorials({});
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const tutorialsData = {};

    try {
      for (const skill of skills) {
        console.log('Loading tutorials for skill:', skill);
        const skillTutorials = await getCachedTutorials(skill);
        if (skillTutorials && skillTutorials.length > 0) {
          tutorialsData[skill] = skillTutorials;
          console.log(`Loaded ${skillTutorials.length} tutorials for ${skill}`);
        } else {
          console.log(`No tutorials found for ${skill}`);
        }
      }
      setTutorials(tutorialsData);
    } catch (error) {
      console.error('Error loading tutorials:', error);
      setError('Failed to load tutorials. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadTutorials(currentSkills);
  }, [currentSkills, loadTutorials]);

  const handleVideoPress = useCallback((videoId) => {
    setSelectedVideo(videoId);
    setVideoModalVisible(true);
  }, []);

  const handleSkillsUpdate = useCallback(async (newSkills) => {
    try {
      await setUserSkills(newSkills);
      setCurrentSkills(newSkills);
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  }, [setUserSkills]);

  const handleViewAll = useCallback((skill) => {
    router.push({
      pathname: '/(screens)/skillTutorials',
      params: { skill }
    });
  }, [router]);

  const getSkillIcon = (skillName) => {
    const skill = skillCategories
      .flatMap(category => category.skills)
      .find(s => s.name === skillName);
    return skill ? skill.icon : 'code-tags';
  };

  const getSkillCategory = (skillName) => {
    const category = skillCategories.find(cat => 
      cat.skills.some(s => s.name === skillName)
    );
    return category ? category.category : 'Other';
  };

  const renderSkillSection = ({ item: skill }) => {
    const skillTutorials = tutorials[skill] || [];
    if (skillTutorials.length === 0) return null;

    return (
      <View style={styles.skillSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.skillTitleContainer}>
            <MaterialCommunityIcons 
              name={getSkillIcon(skill)} 
              size={24} 
              color={colors.primary.main} 
              style={styles.skillIcon}
            />
            <View>
              <Text style={styles.categoryTitle}>{getSkillCategory(skill)}</Text>
              <Text style={styles.skillTitle}>{skill}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => handleViewAll(skill)}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary.main} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={skillTutorials}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
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
          )}
          contentContainerStyle={styles.tutorialList}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Learning</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.editSkillsButton}
              onPress={() => setSkillsEditorVisible(true)}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.primary.main} />
              <Text style={styles.editSkillsText}>Edit Skills</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton}>
              <MaterialCommunityIcons name="magnify" size={24} color={semantic.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.skillChipsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.skillChips}>
            {currentSkills && currentSkills.length > 0 ? (
              currentSkills.map((skill) => (
                <TouchableOpacity 
                  key={skill} 
                  style={styles.skillChip}>
                  <MaterialCommunityIcons 
                    name={getSkillIcon(skill)} 
                    size={16} 
                    color={colors.primary.main} 
                    style={styles.chipIcon}
                  />
                  <Text style={styles.skillChipText}>{skill}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noSkillChip}>
                <MaterialCommunityIcons name="information" size={20} color={semantic.text.secondary} />
                <Text style={styles.noSkillChipText}>
                  Select skills to see tutorials
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Loading tutorials...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={60} color={colors.status.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
              }}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={Object.keys(tutorials)}
            renderItem={renderSkillSection}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.noSkillsContainer}>
                <MaterialCommunityIcons name="school-outline" size={60} color={colors.primary.main} />
                <Text style={styles.noSkillsText}>
                  {currentSkills.length === 0
                    ? "Please select skills to see relevant tutorials"
                    : "No tutorials available for selected skills"}
                </Text>
                <TouchableOpacity
                  style={styles.selectSkillsButton}
                  onPress={() => setSkillsEditorVisible(true)}>
                  <Text style={styles.selectSkillsText}>Select Skills</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </ScrollView>

      <VideoPlayer
        videoId={selectedVideo}
        visible={videoModalVisible}
        onClose={() => {
          setVideoModalVisible(false);
          setSelectedVideo(null);
        }}
      />

      <SkillsEditor
        visible={skillsEditorVisible}
        onClose={() => setSkillsEditorVisible(false)}
        selectedSkills={currentSkills}
        onSkillsUpdate={handleSkillsUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.paper,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: semantic.background.paper,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editSkillsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  editSkillsText: {
    color: colors.primary.main,
    fontSize: 14,
    marginLeft: 4,
  },
  searchButton: {
    padding: 8,
  },
  progressSection: {
    padding: 20,
    backgroundColor: semantic.background.card,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 15,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginTop: 4,
  },
  skillSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  skillTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillIcon: {
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginBottom: 4,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary.main,
    marginRight: 4,
  },
  tutorialList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  tutorialCard: {
    width: 280,
    backgroundColor: semantic.background.paper,
    borderRadius: 12,
    marginRight: 15,
    ...shadows.sm,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tutorialInfo: {
    padding: 12,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 8,
  },
  tutorialMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginLeft: 4,
  },
  playButton: {
    position: 'absolute',
    top: '25%',
    left: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
  },
  noSkillsContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  noSkillsText: {
    fontSize: 16,
    color: semantic.text.secondary,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  skillChipsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  skillChips: {
    paddingRight: 20,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  chipIcon: {
    marginRight: 6,
  },
  skillChipText: {
    color: colors.primary.main,
    fontSize: 14,
  },
  noSkillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.background.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  noSkillChipText: {
    color: semantic.text.secondary,
    fontSize: 14,
    marginLeft: 6,
  },
  selectSkillsButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  selectSkillsText: {
    color: semantic.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    color: semantic.text.secondary,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.status.error,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: colors.status.error,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  retryText: {
    color: semantic.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SkillLearningScreen; 
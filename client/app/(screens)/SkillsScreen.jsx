import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic, components, shadows } from '../theme/colors';
import { router } from 'expo-router';
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

const SkillsScreen = ({ onComplete, onSkip }) => {
  const { setUserSkills } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState([]);

  const toggleSkill = (skillName) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skillName)
        ? prevSkills.filter((s) => s !== skillName)
        : [...prevSkills, skillName]
    );
  };

  const handleComplete = async () => {
    if (selectedSkills.length === 0) {
      Alert.alert(
        'No Skills Selected',
        'Are you sure you want to continue without selecting any skills?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: handleSkip,
          },
        ]
      );
      return;
    }

    try {
      await setUserSkills(selectedSkills);
      if (onComplete) {
        await onComplete(selectedSkills);
      } else {
        router.replace('/(tabs)/SkillLearningScreen');
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      Alert.alert('Error', 'Failed to save skills. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      await setUserSkills([]);
      if (onSkip) {
        await onSkip();
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error('Error skipping skills:', error);
      Alert.alert('Error', 'Failed to skip. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={semantic.text.primary} />
        </TouchableOpacity>
        <Icon name="star-circle" size={60} color={colors.primary.main} />
        <Text style={styles.title}>Select Your Skills</Text>
        <Text style={styles.subtitle}>
          Choose the skills you want to learn or improve
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {skillCategories.map((category) => (
          <View key={category.category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            <View style={styles.skillsGrid}>
              {category.skills.map((skill) => (
                <TouchableOpacity
                  key={skill.id}
                  style={[
                    styles.skillButton,
                    selectedSkills.includes(skill.name) && styles.selectedSkillButton,
                  ]}
                  onPress={() => toggleSkill(skill.name)}>
                  <Icon
                    name={skill.icon}
                    size={24}
                    color={selectedSkills.includes(skill.name) ? semantic.text.white : colors.primary.main}
                    style={styles.skillIcon}
                  />
                  <Text
                    style={[
                      styles.skillButtonText,
                      selectedSkills.includes(skill.name) && styles.selectedSkillButtonText,
                    ]}>
                    {skill.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleComplete}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={handleSkip}>
          <Text style={[styles.buttonText, styles.skipButtonText]}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.paper,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: semantic.background.paper,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: semantic.text.secondary,
    textAlign: 'center',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skillButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.background.paper,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: semantic.border.light,
    ...shadows.sm,
  },
  selectedSkillButton: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  skillIcon: {
    marginRight: 8,
  },
  skillButtonText: {
    flex: 1,
    fontSize: 14,
    color: semantic.text.primary,
    fontWeight: '500',
  },
  selectedSkillButtonText: {
    color: semantic.text.white,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: semantic.background.paper,
    borderTopWidth: 1,
    borderTopColor: semantic.border.light,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    ...shadows.sm,
  },
  completeButton: {
    backgroundColor: components.button.primary.background,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: components.button.primary.text,
  },
  skipButtonText: {
    color: semantic.text.secondary,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
});

export default SkillsScreen; 
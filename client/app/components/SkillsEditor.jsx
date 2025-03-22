import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';

const SkillsEditor = ({ visible, onClose, selectedSkills, onSkillsUpdate }) => {
  const [localSelectedSkills, setLocalSelectedSkills] = React.useState(selectedSkills);

  const skillCategories = [
    {
      category: 'Culinary Arts',
      skills: [
        'Baking & Pastry',
        'Traditional Cooking',
        'Food Preservation',
        'Catering Business',
        'International Cuisine',
      ],
    },
    {
      category: 'Textile & Crafts',
      skills: [
        'Tailoring',
        'Embroidery',
        'Knitting',
        'Fashion Design',
        'Jewelry Making',
      ],
    },
    {
      category: 'Home & Lifestyle',
      skills: [
        'Interior Design',
        'Garden & Agriculture',
        'Home Organization',
        'Event Planning',
        'Beauty & Wellness',
      ],
    },
    {
      category: 'Digital & Tech',
      skills: [
        'Social Media',
        'Basic Web Design',
        'Digital Marketing',
        'Content Creation',
        'Online Business',
      ],
    },
    {
      category: 'Professional',
      skills: [
        'Content Writing',
        'Customer Service',
        'Business Planning',
        'Sales & Marketing',
        'Public Speaking',
      ],
    },
  ];

  const toggleSkill = (skill) => {
    setLocalSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else {
        if (prev.length >= 5) {
          return prev;
        }
        return [...prev, skill];
      }
    });
  };

  const handleSave = () => {
    onSkillsUpdate(localSelectedSkills);
    onClose();
  };

  const renderSkillCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <View style={styles.skillsGrid}>
        {item.skills.map((skill) => (
          <TouchableOpacity
            key={skill}
            style={[
              styles.skillChip,
              localSelectedSkills.includes(skill) && styles.selectedSkillChip,
            ]}
            onPress={() => toggleSkill(skill)}>
            <Text
              style={[
                styles.skillText,
                localSelectedSkills.includes(skill) && styles.selectedSkillText,
              ]}>
              {skill}
            </Text>
            {localSelectedSkills.includes(skill) && (
              <Icon name="check" size={16} color="#fff" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Skills</Text>
            <Text style={styles.headerSubtitle}>
              Select up to 5 skills you want to learn
            </Text>
            <Text style={styles.skillCount}>
              {localSelectedSkills.length}/5 skills selected
            </Text>
          </View>

          <FlatList
            data={skillCategories}
            renderItem={renderSkillCategory}
            keyExtractor={(item) => item.category}
            contentContainerStyle={styles.categoriesList}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: semantic.background.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginTop: 4,
  },
  skillCount: {
    fontSize: 12,
    color: colors.primary.main,
    marginTop: 8,
  },
  categoriesList: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
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
    marginHorizontal: -5,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.background.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  selectedSkillChip: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  skillText: {
    fontSize: 14,
    color: semantic.text.primary,
  },
  selectedSkillText: {
    color: semantic.text.inverse,
  },
  checkIcon: {
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: semantic.border.light,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: semantic.background.card,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primary.main,
  },
  cancelButtonText: {
    color: semantic.text.primary,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButtonText: {
    color: semantic.text.inverse,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SkillsEditor; 
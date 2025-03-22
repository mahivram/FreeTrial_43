import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from 'react-native';
import { Link, router } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, semantic } from '../theme/colors';

const languages = [
  { code: 'en', name: 'English', icon: 'EN' },
  { code: 'hi', name: 'हिंदी', icon: 'हि' },
  { code: 'te', name: 'తెలుగు', icon: 'తె' },
  { code: 'ta', name: 'தமிழ்', icon: 'த' },
  { code: 'gu', name: 'ગુજરાતી', icon: 'ગુ' },
];

const DashboardScreen = ({ userSkills = [] }) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false);
    // Here you would typically update the app's language context/state
  };

  const mainCategories = [
    {
      id: '1',
      title: 'Financial Education',
      description: 'Learn smart money management',
      icon: 'school',
      color: '#4F46E5',
      bgColor: '#EEF2FF',
      screen: 'FinancialEducationScreen',
    },
    {
      id: '2',
      title: 'Financial Tools',
      description: 'Budget planning & tracking',
      icon: 'calculator',
      color: '#2563EB',
      bgColor: '#DBEAFE',
      screen: 'BudgetToolsScreen',
    },
    {
      id: '3',
      title: 'Self Care',
      description: 'Mental & physical wellness tips',
      icon: 'heart-pulse',
      color: '#059669',
      bgColor: '#ECFDF5',
      screen: 'SelfCareScreen',
    },
    {
      id: '4',
      title: 'Jobs',
      description: 'Learn new skills and enhance your capabilities',
      icon: 'lightbulb-on',
      color: '#9333EA',
      bgColor: '#F3E8FF',
      screen: 'JobsScreen',
    },
  ];

  const renderCategoryCard = ({ item }) => (
    <Link href={`/(screens)/${item.screen}`} asChild>
      <TouchableOpacity 
        style={StyleSheet.flatten([styles.categoryCard, { backgroundColor: item.bgColor }])}
        activeOpacity={0.7}>
        <View style={StyleSheet.flatten([styles.categoryIconContainer, { backgroundColor: item.color + '20' }])}>
          <Icon name={item.icon} size={32} color={item.color} />
        </View>
        <Text style={StyleSheet.flatten([styles.categoryTitle, { color: item.color }])}>{item.title}</Text>
        <Text style={styles.categoryDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryArrow}>
          <Icon name="arrow-right" size={20} color={item.color} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={() => setShowLanguageModal(true)}>
              <Icon name="translate" size={22} color={colors.primary.main} />
            </TouchableOpacity>
            <Link href="/(screens)/ProfileScreen" asChild>
              <TouchableOpacity style={styles.profileButton}>
                <Icon name="account-circle" size={40} color={colors.primary.main} />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage.code === language.code && styles.selectedLanguage,
                  ]}
                  onPress={() => handleLanguageSelect(language)}>
                  <View style={styles.languageIconContainer}>
                    <Text style={styles.languageIconText}>{language.icon}</Text>
                  </View>
                  <Text style={styles.languageName}>{language.name}</Text>
                  {selectedLanguage.code === language.code && (
                    <Icon name="check" size={20} color={colors.primary.main} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          {mainCategories.map((category) => (
            <View key={category.id} style={styles.categoryWrapper}>
              {renderCategoryCard({ item: category })}
            </View>
          ))}
        </View>

        {/* Government Schemes Button */}
        <View style={styles.additionalResourcesContainer}>
          <Link href="/(screens)/SchemesScreen" asChild>
            <TouchableOpacity 
              style={styles.schemesButton}
              activeOpacity={0.7}>
              <View style={styles.schemesContent}>
                <View style={styles.schemesIconContainer}>
                  <Icon name="bank" size={32} color="#7C3AED" />
                </View>
                <View style={styles.schemesTextContainer}>
                  <Text style={styles.schemesTitle}>Government Schemes</Text>
                  <Text style={styles.schemesDescription}>
                    Access government schemes & benefits
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#7C3AED" />
            </TouchableOpacity>
          </Link>

          {/* Saheli AI Button */}
          <Link href="/(screens)/SaheliAi" asChild>
            <TouchableOpacity
              style={styles.aiButton}
              activeOpacity={0.7}>
              <View style={styles.aiContent}>
                <View style={styles.aiIconContainer}>
                  <Icon name="robot" size={32} color="#0284C7" />
                </View>
                <View style={styles.aiTextContainer}>
                  <Text style={styles.aiTitle}>Saheli AI</Text>
                  <Text style={styles.aiDescription}>
                    Get personalized help and guidance
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#0284C7" />
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.default,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: semantic.background.paper,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  dateText: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  categoryWrapper: {
    width: '48%',

    marginBottom: 21,
  },
  categoryCard: {
    
    width: '96%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 180,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 13,
    color: semantic.text.secondary,
    lineHeight: 18,
  },
  categoryArrow: {
    position: 'absolute',
    bottom: 9,
    right: 15,
  },
  additionalResourcesContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  schemesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 16,
  },
  schemesContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schemesIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  schemesTextContainer: {
    flex: 1,
  },
  schemesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 4,
  },
  schemesDescription: {
    fontSize: 14,
    color: '#7C3AED',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButton: {
    backgroundColor: colors.primary.light,
    padding: 4,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: semantic.text.primary,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedLanguage: {
    backgroundColor: colors.primary.light + '20',
  },
  languageIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  languageIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.light + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  languageIconText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  languageName: {
    fontSize: 16,
    color: semantic.text.primary,
    flex: 1,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
   
    borderColor: '#BAE6FD',
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
   
    borderColor: '#7DD3FC',
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 4,
  },
  aiDescription: {
    fontSize: 14,
    color: '#0EA5E9',
  },
});

export default DashboardScreen; 
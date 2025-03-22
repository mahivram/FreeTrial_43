import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  Linking,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SelfCareScreen = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState(null);
  const router = useRouter();

  const healthTopics = [
    {
      id: '1',
      title: 'Mental Wellness',
      description: 'Comprehensive mental health support and resources',
      icon: 'brain',
      color: '#60A5FA',
      topics: [
        {
          id: '1-1',
          title: 'Stress & Anxiety Management',
          content: 'Comprehensive techniques for managing stress and anxiety:\n\nDaily Management:\n• Deep breathing exercises\n• Progressive muscle relaxation\n• Mindfulness meditation\n• Grounding techniques\n• Time management skills\n• Setting healthy boundaries\n\nAnxiety-Specific Techniques:\n• 5-4-3-2-1 sensory exercise\n• Thought challenging worksheets\n• Worry time scheduling\n• Exposure therapy principles\n• Panic attack management\n\nLifestyle Changes:\n• Regular exercise routine\n• Sleep hygiene\n• Nutrition for mental health\n• Social support building\n• Work-life balance\n\nProfessional Support:\n• When to seek help\n• Types of therapy available\n• Finding a mental health professional\n• Crisis resources and hotlines',
        },
        {
          id: '1-2',
          title: 'Depression Support',
          content: 'Understanding and managing depression:\n\nRecognizing Symptoms:\n• Emotional changes\n• Physical symptoms\n• Behavioral changes\n• Cognitive symptoms\n• Warning signs\n\nSelf-Help Strategies:\n• Daily routine establishment\n• Activity scheduling\n• Pleasant activity planning\n• Social connection maintenance\n• Goal setting techniques\n\nTreatment Options:\n• Different therapy types\n• Medication information\n• Alternative treatments\n• Lifestyle modifications\n• Support group benefits\n\nCrisis Management:\n• Safety planning\n• Emergency contacts\n• Crisis hotlines\n• Support resources\n• When to seek immediate help',
        },
        {
          id: '1-3',
          title: 'Emotional Intelligence',
          content: 'Building emotional awareness and resilience:\n\nSelf-Awareness:\n• Emotion identification\n• Trigger recognition\n• Personal pattern awareness\n• Values clarification\n• Strength assessment\n\nEmotional Regulation:\n• Coping strategies\n• Mood management\n• Anger management\n• Stress reduction\n• Emotional expression\n\nSocial Skills:\n• Active listening\n• Assertive communication\n• Conflict resolution\n• Empathy building\n• Relationship boundaries\n\nPersonal Growth:\n• Goal setting\n• Resilience building\n• Self-compassion\n• Mindset development\n• Continuous learning',
        }
      ]
    },
    {
      id: '2',
      title: 'Self Defence',
      description: 'Essential safety techniques and emergency preparedness',
      icon: 'shield-account',
      color: '#DC2626',
      topics: [
        {
          id: '2-1',
          title: 'Personal Safety',
          content: 'Essential safety awareness tips:\n\nStaying Alert:\n• Be aware of surroundings\n• Trust your instincts\n• Avoid distractions while walking\n• Stay in well-lit areas\n• Walk confidently\n\nSafe Travel:\n• Plan your route in advance\n• Share location with trusted contacts\n• Use verified transportation\n• Keep emergency contacts handy\n• Avoid isolated areas\n\nHome Safety:\n• Secure doors and windows\n• Install proper lighting\n• Know your neighbors\n• Have emergency plans\n• Regular security checks',
        },
        {
          id: '2-2',
          title: 'Basic Self-Defence Moves',
          content: 'Fundamental self-defense techniques:\n\nStance & Position:\n• Proper defensive stance\n• Creating distance\n• Quick escape moves\n• Safe falling techniques\n• Body positioning\n\nBasic Moves:\n• Palm strike\n• Knee strike\n• Elbow defense\n• Wrist grab escape\n• Basic blocks\n\nEmergency Response:\n• Voice commands\n• Quick reaction drills\n• Breaking free techniques\n• Running safely\n• Calling for help',
        },
        {
          id: '2-3',
          title: 'Emergency Preparedness',
          content: 'Emergency readiness guide:\n\nEmergency Contacts:\n• Police: 100\n• Women\'s Helpline: 1091\n• Ambulance: 102\n• Local police station\n• Trusted contacts\n\nSafety Tools:\n• Personal alarm devices\n• Emergency apps\n• Whistle\n• Flashlight\n• First aid kit\n\nEmergency Plans:\n• Safe meeting points\n• Escape routes\n• Code words with family\n• Local safe zones\n• Community resources',
        }
      ]
    },
    {
      id: '3',
      title: 'Women\'s Health Guide',
      description: 'Essential information about women\'s health and wellness',
      icon: 'human-female',
      color: '#EC4899',
      topics: [
        {
          id: '2-1',
          title: 'Pregnancy Guide',
          content: 'Comprehensive pregnancy care information:\n\nFirst Trimester Care:\n• Prenatal vitamins and nutrition\n• Common symptoms management\n• Exercise guidelines\n• Foods to avoid\n• Medical check-ups schedule\n\nSecond Trimester:\n• Physical changes\n• Exercise modifications\n• Sleep positioning\n• Travel guidelines\n• Pregnancy tests and screenings\n\nThird Trimester:\n• Birth preparation\n• Labor signs\n• Hospital bag checklist\n• Birth plan creation\n• Pain management options\n\nPostpartum Care:\n• Physical recovery\n• Emotional wellbeing\n• Breastfeeding support\n• Newborn care\n• Self-care strategies\n\nPregnancy Complications:\n• Warning signs\n• Emergency symptoms\n• When to call doctor\n• Gestational diabetes\n• Preeclampsia awareness',
        },
        {
          id: '2-2',
          title: 'Menstrual Health',
          content: 'Comprehensive menstrual health guide:\n\nCycle Understanding:\n• Menstrual cycle phases\n• Hormonal changes\n• Tracking methods\n• Normal vs. abnormal\n• Fertility awareness\n\nMenstrual Care:\n• Product options\n• Hygiene practices\n• Sustainable alternatives\n• Pain management\n• Exercise considerations\n\nCommon Conditions:\n• PCOS symptoms and management\n• Endometriosis awareness\n• Fibroids\n• Heavy periods\n• Irregular cycles\n\nLifestyle Management:\n• Diet recommendations\n• Exercise adaptations\n• Stress management\n• Sleep optimization\n• Supplement guidance\n\nWhen to Seek Help:\n• Abnormal symptoms\n• Medical conditions\n• Treatment options\n• Finding specialists\n• Support resources',
        },
        {
          id: '2-3',
          title: 'Reproductive Health',
          content: 'Comprehensive reproductive health information:\n\nPreventive Care:\n• Regular check-ups\n• Cancer screenings\n• Vaccination schedule\n• STI prevention\n• Sexual health\n\nFamily Planning:\n• Contraception options\n• Natural family planning\n• Fertility awareness\n• Preconception health\n• Genetic counseling\n\nGynecological Health:\n• Common conditions\n• Treatment options\n• Self-examination\n• Warning signs\n• Preventive measures\n\nMenopause:\n• Understanding stages\n• Symptom management\n• Treatment options\n• Lifestyle adjustments\n• Support resources',
        }
      ]
    },
    {
      id: '4',
      title: 'Physical Wellness',
      description: 'Holistic approach to physical health and fitness',
      icon: 'heart-pulse',
      color: '#059669',
      topics: [
        {
          id: '3-1',
          title: 'Exercise Guide',
          content: 'Comprehensive fitness program:\n\nCardiovascular Health:\n• Types of cardio\n• Heart rate zones\n• Training progression\n• Safety guidelines\n• Equipment options\n\nStrength Training:\n• Basic exercises\n• Proper form\n• Progressive overload\n• Recovery tips\n• Equipment guide\n\nFlexibility & Mobility:\n• Stretching routines\n• Yoga basics\n• Joint mobility\n• Injury prevention\n• Recovery techniques\n\nWorkout Planning:\n• Program design\n• Schedule creation\n• Goal setting\n• Progress tracking\n• Adaptation strategies',
        },
        {
          id: '3-2',
          title: 'Nutrition Guide',
          content: 'Comprehensive nutrition information:\n\nBasic Nutrition:\n• Macronutrients\n• Micronutrients\n• Portion control\n• Meal timing\n• Hydration needs\n\nMeal Planning:\n• Balanced meals\n• Grocery shopping\n• Meal prep tips\n• Healthy recipes\n• Snack options\n\nSpecial Diets:\n• Vegetarian/Vegan\n• Gluten-free\n• Low-carb\n• Mediterranean\n• DASH diet\n\nNutrition Goals:\n• Weight management\n• Muscle building\n• Energy optimization\n• Sports nutrition\n• Recovery nutrition',
        },
        {
          id: '3-3',
          title: 'Sleep Optimization',
          content: 'Comprehensive sleep guide:\n\nSleep Basics:\n• Sleep cycles\n• Optimal duration\n• Quality indicators\n• Common issues\n• Impact on health\n\nSleep Hygiene:\n• Bedroom environment\n• Evening routine\n• Morning routine\n• Technology usage\n• Light exposure\n\nSleep Solutions:\n• Natural remedies\n• Relaxation techniques\n• Sleep positions\n• Travel adjustments\n• Shift work strategies\n\nTroubleshooting:\n• Insomnia management\n• Sleep tracking\n• When to seek help\n• Treatment options\n• Professional resources',
        }
      ]
    },
    {
      id: '5',
      title: 'Meditation Guide',
      description: 'Comprehensive meditation practices for mind and body',
      icon: 'meditation',
      color: '#8B5CF6',
      topics: [
        {
          id: '4-1',
          title: 'Meditation Basics',
          content: 'Foundation of meditation practice:\n\nGetting Started:\n• Proper posture guide\n• Breathing techniques\n• Setting up meditation space\n• Best times to meditate\n• Duration guidelines\n\nTypes of Meditation:\n• Mindfulness meditation\n• Focused meditation\n• Movement meditation\n• Loving-kindness meditation\n• Transcendental meditation\n\nCommon Challenges:\n• Dealing with distractions\n• Managing restlessness\n• Overcoming sleepiness\n• Maintaining consistency\n• Building regular practice\n\nMeditation Tools:\n• Meditation apps\n• Timer options\n• Guided recordings\n• Music and sounds\n• Meditation cushions',
        },
        {
          id: '4-2',
          title: 'Meditation Techniques',
          content: 'Detailed meditation practices:\n\nBreathing Meditation:\n• Box breathing\n• 4-7-8 technique\n• Alternate nostril breathing\n• Breath awareness\n• Ocean breath\n\nBody-Based Meditation:\n• Body scan meditation\n• Progressive relaxation\n• Walking meditation\n• Eating meditation\n• Hand meditation\n\nVisualization Practices:\n• Nature visualization\n• Light visualization\n• Chakra meditation\n• Safe place meditation\n• Goal visualization\n\nSound Meditation:\n• Mantra meditation\n• Sound bath practice\n• Binaural beats\n• Nature sounds\n• Silence meditation',
        },
        {
          id: '4-3',
          title: 'Advanced Practices',
          content: 'Deeper meditation practices:\n\nMindfulness Techniques:\n• Open awareness\n• Choiceless awareness\n• Insight meditation\n• Contemplative inquiry\n• Self-observation\n\nSpiritual Practices:\n• Heart-centered meditation\n• Energy meditation\n• Higher self connection\n• Gratitude meditation\n• Forgiveness practice\n\nIntegration Methods:\n• Daily life mindfulness\n• Mindful communication\n• Emotional awareness\n• Thought observation\n• Present moment living\n\nMeditation Retreats:\n• Types of retreats\n• Preparation guide\n• What to expect\n• Integration after\n• Finding retreats',
        }
      ]
    },
    {
      id: '6',
      title: 'Lifestyle Balance',
      description: 'Creating harmony in daily life',
      icon: 'balance-scale',
      color: '#D97706',
      topics: [
        {
          id: '5-1',
          title: 'Time Management',
          content: 'Effective time management strategies:\n\nPlanning Techniques:\n• Priority setting\n• Goal breakdown\n• Time blocking\n• Task batching\n• Schedule optimization\n\nProductivity Tools:\n• Digital calendars\n• Task managers\n• Time tracking\n• Focus techniques\n• Automation tips\n\nWork-Life Balance:\n• Boundary setting\n• Energy management\n• Stress reduction\n• Leisure planning\n• Family time',
        },
        {
          id: '5-2',
          title: 'Self-Care Rituals',
          content: 'Building meaningful self-care practices:\n\nDaily Rituals:\n• Morning routine\n• Evening wind-down\n• Mindful breaks\n• Digital detox\n• Nature connection\n\nSelf-Care Activities:\n• Meditation\n• Journaling\n• Creative expression\n• Movement practices\n• Relaxation techniques\n\nEnvironmental Care:\n• Home organization\n• Workspace setup\n• Nature exposure\n• Decluttering\n• Sacred space creation',
        },
        {
          id: '5-3',
          title: 'Social Wellness',
          content: 'Building and maintaining relationships:\n\nSocial Connections:\n• Friend relationships\n• Family bonds\n• Professional networks\n• Community involvement\n• Support systems\n\nCommunication Skills:\n• Active listening\n• Conflict resolution\n• Boundary setting\n• Emotional expression\n• Digital communication\n\nSocial Activities:\n• Group activities\n• Volunteer work\n• Social events\n• Hobby groups\n• Online communities'
        }
      ]
    }
  ];

  const toggleTopic = (topicId) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
      setExpandedSubtopic(null);
    } else {
      setExpandedTopic(topicId);
      setExpandedSubtopic(null);
    }
  };

  const toggleSubtopic = (subtopicId) => {
    setExpandedSubtopic(expandedSubtopic === subtopicId ? null : subtopicId);
  };

  const renderSubtopics = (topics) => {
    return topics.map((topic) => (
      <View key={topic.id} style={styles.subtopicContainer}>
        <TouchableOpacity 
          style={styles.subtopicHeader}
          onPress={() => toggleSubtopic(topic.id)}>
          <Text style={styles.subtopicTitle}>{topic.title}</Text>
          <Icon 
            name={expandedSubtopic === topic.id ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={semantic.text.secondary} 
          />
        </TouchableOpacity>
        {expandedSubtopic === topic.id && (
          <View style={styles.subtopicContent}>
            <Text style={styles.subtopicText}>{topic.content}</Text>
          </View>
        )}
      </View>
    ));
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerWrapper}>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
          translucent={false}
        />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}>
              <Icon name="arrow-left" size={20} color={colors.primary.main} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Self Care</Text>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>
      </View>
    );
  };

  const renderResource = ({ item }) => (
    <TouchableOpacity 
      style={[styles.resourceCard, { borderLeftColor: item.color }]}
      onPress={() => {
        if (item.link) {
          router.push(item.link);
        } else if (item.phone) {
          Linking.openURL(`tel:${item.phone}`);
        }
      }}>
      <View style={[styles.resourceIcon, { backgroundColor: `${item.color}15` }]}>
        <Icon name={item.icon} size={26} color={item.color} />
      </View>
      <View style={styles.resourceContent}>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>
      </View>
      <Icon name="chevron-right" size={22} color={item.color} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wellness Resources</Text>
            <Text style={styles.sectionDescription}>
              Access comprehensive guides and resources for your overall well-being
            </Text>
            {healthTopics.map((topic) => (
              <View key={topic.id}>
                <TouchableOpacity 
                  style={styles.topicCard}
                  onPress={() => toggleTopic(topic.id)}>
                  <View style={styles.topicHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${topic.color}15` }]}>
                      <Icon name={topic.icon} size={24} color={topic.color} />
                    </View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicDescription}>{topic.description}</Text>
                    </View>
                    <Icon 
                      name={expandedTopic === topic.id ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={topic.color} 
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedTopic === topic.id && renderSubtopics(topic.topics)}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: semantic.background.paper,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: semantic.text.secondary,
    lineHeight: 20,
  },
  subtopicContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subtopicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  subtopicTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: semantic.text.primary,
    flex: 1,
  },
  subtopicContent: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  subtopicText: {
    fontSize: 14,
    lineHeight: 22,
    color: semantic.text.secondary,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default SelfCareScreen; 
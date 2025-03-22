import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic, shadows } from '../theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Default skills to show all jobs if no skills are selected
const DEFAULT_SKILLS = [
  'Digital Marketing', 'Social Media', 'Content Creation',
  'Baking & Pastry', 'Traditional Cooking', 'Food Preservation',
  'Fashion Design', 'Tailoring', 'Embroidery',
  'Teaching', 'MS Office', 'Virtual Assistant',
  'Life Coaching', 'Counseling', 'Beauty & Wellness'
];

// Mock job data - In real app, this would come from an API
const MOCK_JOBS = [
  {
    id: 1,
    company: 'TechCraft Solutions',
    logo: 'https://example.com/logo1.png',
    role: 'Digital Marketing Specialist',
    location: 'Remote',
    salary: '₹30,000 - ₹45,000',
    type: 'Full-time',
    requiredSkills: ['Digital Marketing', 'Social Media', 'Content Creation'],
    description: 'Looking for a creative digital marketer to manage social media and content strategy.',
  },
  {
    id: 2,
    company: 'FoodieHub',
    logo: 'https://example.com/logo2.png',
    role: 'Culinary Trainer',
    location: 'Mumbai',
    salary: '₹25,000 - ₹40,000',
    type: 'Part-time',
    requiredSkills: ['Baking & Pastry', 'Traditional Cooking', 'Food Preservation'],
    description: 'Seeking experienced chef to train aspiring cooks in various cuisines.',
  },
  {
    id: 3,
    company: 'StyleCraft',
    logo: 'https://example.com/logo3.png',
    role: 'Fashion Designer',
    location: 'Delhi',
    salary: '₹35,000 - ₹50,000',
    type: 'Full-time',
    requiredSkills: ['Fashion Design', 'Tailoring', 'Embroidery'],
    description: 'Join our creative team to design trendy and traditional fashion pieces.',
  },
  {
    id: 4,
    company: 'EduTech India',
    logo: 'https://example.com/logo4.png',
    role: 'Online Tutor',
    location: 'Remote',
    salary: '₹20,000 - ₹35,000',
    type: 'Flexible',
    requiredSkills: ['Teaching', 'MS Office', 'Virtual Assistant'],
    description: 'Teach students online and help create educational content.',
  },
  {
    id: 5,
    company: 'WellnessPro',
    logo: 'https://example.com/logo5.png',
    role: 'Wellness Coach',
    location: 'Bangalore',
    salary: '₹40,000 - ₹60,000',
    type: 'Full-time',
    requiredSkills: ['Life Coaching', 'Counseling', 'Beauty & Wellness'],
    description: 'Guide clients in their wellness journey with personalized coaching.',
  },
];

const JOB_INSIGHTS = [
  {
    id: 1,
    title: 'Remote Jobs',
    value: '40%',
    trend: '+5%',
    icon: 'home-variant',
    color: colors.primary.main,
    description: 'of new positions'
  },
  {
    id: 2,
    title: 'Avg. Salary',
    value: '₹35K',
    trend: '+8%',
    icon: 'trending-up',
    color: colors.primary.main,
    description: 'monthly'
  },
  {
    id: 3,
    title: 'Job Growth',
    value: '250+',
    trend: '+12%',
    icon: 'chart-line',
    color: colors.primary.main,
    description: 'new openings'
  },
  {
    id: 4,
    title: 'Skills in Demand',
    value: '5',
    trend: 'New',
    icon: 'lightning-bolt',
    color: colors.primary.main,
    description: 'trending skills'
  }
];

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();
  const { selectedSkills = [] } = useLocalSearchParams();
  
  // Convert selectedSkills from string to array if needed
  const userSkills = React.useMemo(() => 
    typeof selectedSkills === 'string' ? [selectedSkills] : selectedSkills,
    [selectedSkills]
  );

  // Memoize the skills to use
  const skillsToUse = React.useMemo(() => 
    userSkills.length > 0 ? userSkills : DEFAULT_SKILLS,
    [userSkills]
  );

  // Memoize the filtered jobs
  const filteredJobs = React.useMemo(() => 
    MOCK_JOBS.filter(job => 
      job.requiredSkills.some(skill => skillsToUse.includes(skill))
    ),
    [skillsToUse]
  );

  // Update jobs state only when filtered jobs change
  useEffect(() => {
    setJobs(filteredJobs);
  }, [filteredJobs]);

  const getMatchingSkills = React.useCallback((jobSkills) => {
    return jobSkills.filter(skill => skillsToUse.includes(skill));
  }, [skillsToUse]);

  const renderJobCard = (job) => {
    const matchingSkills = getMatchingSkills(job.requiredSkills);

    return (
      <TouchableOpacity 
        key={job.id} 
        style={styles.jobCard}
        onPress={() => router.push({
          pathname: "/(screens)/JobDetails",
          params: { job: JSON.stringify(job) }
        })}>
        <View style={styles.jobHeader}>
          <View style={styles.companyLogo}>
            <Icon name="office-building" size={30} color="#666" />
          </View>
          <View style={styles.jobTitleContainer}>
            <Text style={styles.companyName}>{job.company}</Text>
            <Text style={styles.jobRole}>{job.role}</Text>
          </View>
          <Icon name="bookmark-outline" size={24} color="#666" />
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{job.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="currency-inr" size={16} color="#666" />
            <Text style={styles.detailText}>{job.salary}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{job.type}</Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>{job.description}</Text>

        <View style={styles.skillsContainer}>
          {matchingSkills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Icon name="check-circle" size={14} color="#059669" />
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderInsightCard = (insight) => (
    <View key={insight.id} style={styles.insightCard}>
      <View style={[styles.insightIconContainer, { backgroundColor: `${insight.color}15` }]}>
        <Icon name={insight.icon} size={24} color={insight.color} />
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <View style={styles.insightValueContainer}>
          <Text style={styles.insightValue}>{insight.value}</Text>
          <View style={styles.trendContainer}>
            <Icon 
              name={insight.trend.includes('+') ? 'trending-up' : 'trending-down'} 
              size={12} 
              color={insight.trend.includes('+') ? '#059669' : '#DC2626'} 
            />
            <Text style={[
              styles.trendText,
              { color: insight.trend.includes('+') ? '#059669' : '#DC2626' }
            ]}>{insight.trend}</Text>
          </View>
        </View>
        <Text style={styles.insightDescription}>{insight.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Matches</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Job Market Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Job Market Insights</Text>
          <View style={styles.insightsGrid}>
            {JOB_INSIGHTS.map(insight => renderInsightCard(insight))}
          </View>
        </View>

        {/* Job Listings */}
        <View style={styles.jobsSection}>
          <Text style={styles.sectionTitle}>Available Positions</Text>
          {jobs.length > 0 ? (
            jobs.map(job => renderJobCard(job))
          ) : (
            <View style={styles.noJobsContainer}>
              <Icon name="briefcase-search" size={60} color="#666" />
              <Text style={styles.noJobsText}>No matching jobs found</Text>
              <Text style={styles.noJobsSubText}>Try selecting different skills or check back later</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  filterButton: {
    padding: 6,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  jobCard: {
    backgroundColor: semantic.background.paper,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: semantic.border.light,
    ...shadows.sm
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  jobTitleContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginBottom: 2,
  },
  jobRole: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 4,
    color: semantic.text.secondary,
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 12,
    color: semantic.text.secondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    marginLeft: 3,
    color: colors.primary.main,
    fontSize: 11,
    fontWeight: '500',
  },
  noJobsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: semantic.background.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  noJobsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginTop: 12,
  },
  noJobsSubText: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginTop: 6,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginBottom: 12,
  },
  insightsSection: {
    marginBottom: 16,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  insightCard: {
    width: '50%',
    padding: 6,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: colors.primary.light,
  },
  insightContent: {
    backgroundColor: semantic.background.paper,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: semantic.border.light,
    ...shadows.sm
  },
  insightTitle: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  insightValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  insightDescription: {
    fontSize: 10,
    color: semantic.text.secondary,
  },
  jobsSection: {
    flex: 1,
  },
});

export default JobsScreen;
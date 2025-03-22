import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ toggleSaheliButton, showSaheliButton }) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://i.pravatar.cc/150?img=48"
  };

  const settingsOptions = [
    {
      title: 'Account Settings',
      icon: 'account-cog',
      onPress: () => router.push('/(screens)/settings')
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-lock',
      onPress: () => router.push('/(screens)/privacy')
    },
    {
      title: 'Notifications',
      icon: 'bell',
      onPress: () => router.push('/(screens)/notifications')
    },
    {
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => router.push('/(screens)/support')
    },
    {
      title: 'About',
      icon: 'information',
      onPress: () => router.push('/(screens)/about')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={semantic.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userProfile.avatar }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.email}>{userProfile.email}</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/(screens)/editProfile')}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Saheli Assistant Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assistant Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="flower-tulip" size={24} color={colors.primary.main} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Show Saheli Assistant</Text>
              <Text style={styles.settingDescription}>Toggle the floating Saheli button</Text>
            </View>
          </View>
          <Switch
            value={showSaheliButton}
            onValueChange={toggleSaheliButton}
            trackColor={{ false: '#767577', true: colors.primary.main }}
            thumbColor={showSaheliButton ? colors.primary.light : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Other Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={option.onPress}
          >
            <View style={styles.settingLeft}>
              <Icon name={option.icon} size={24} color={colors.primary.main} />
              <Text style={styles.settingLabel}>{option.title}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={semantic.text.secondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={signOut}>
        <Icon name="logout" size={24} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginLeft: 8,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: semantic.text.secondary,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primary.main,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: semantic.text.primary,
    marginLeft: 12,
  },
  settingDescription: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 
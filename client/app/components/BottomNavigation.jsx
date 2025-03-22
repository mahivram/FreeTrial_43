import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows } from '../theme/colors';

const BottomNavigation = ({ activeTab, onTabPress, onHomeTabLongPress }) => {
  const tabs = [
    {
      id: 'skills',
      label: 'Skills',
      icon: 'school',
    },
    {
      id: 'marketplace',
      label: 'Market',
      icon: 'store',
    },
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
    },
    {
      id: 'community',
      label: 'Community',
      icon: 'account-group',
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: 'phone-alert',
    },
  ];

  const getIconColor = (tabId) => {
    if (tabId === 'home') {
      return colors.common.white; // Home icon always white
    }
    return activeTab === tabId ? colors.primary.main : colors.gray[500];
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              tab.id === 'home' && styles.homeButton,
              activeTab === tab.id && tab.id !== 'home' && styles.activeTab,
            ]}
            onPress={() => onTabPress(tab.id)}
            onLongPress={() => tab.id === 'home' && onHomeTabLongPress && onHomeTabLongPress()}>
            <View
              style={[
                styles.iconContainer,
                tab.id === 'home' && styles.homeIconContainer,
              ]}>
              <Icon
                name={tab.icon}
                size={tab.id === 'home' ? 32 : 24}
                color={getIconColor(tab.id)}
              />
            </View>
            {tab.id !== 'home' && (
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.activeLabel,
                ]}>
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.common.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    ...shadows.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  homeButton: {
    marginTop: -30,
    backgroundColor: 'transparent',
    height: 60,
    width: 70,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    alignItems: 'center',
    shadowOpacity: 0,
    shadowColor: 'transparent',
    elevation: 0,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIconContainer: {
    backgroundColor: colors.primary.main,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: -1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.common.white,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
  },
  activeLabel: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: colors.primary.light + '20',
    borderRadius: 12,
  },
});

export default BottomNavigation; 
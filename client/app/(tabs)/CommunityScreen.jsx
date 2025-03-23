import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
  Alert,
  Modal as RNModal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows, semantic, components } from '../theme/colors';
import { storeAuthToken, isAuthenticated } from '../services/auth';
import {io} from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import {
  createCommunityPost,
  getCommunityPosts,
  getPostsByHeading,
  addComment,
  likePost,
  deletePost,
} from '../services/community';

const SOCKET_URL = "https://07ab-14-139-122-82.ngrok-free.app/";
const socket = io(SOCKET_URL);


const CommunityScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    heading: '',
    heading_name: '',
    description: '',
    labels: [],
    communityPic: null
  });
  const [labelInput, setLabelInput] = useState('');

  // Add timeout ref
  const timeoutRef = React.useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    socket.connect(); // Connect when the component mounts

    socket.on("message", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetCreatePostState = () => {
    setIsLoading(false);
    setNewPost({
      heading: '',
      heading_name: '',
      description: '',
      labels: [],
      communityPic: null
    });
  };

  const handleModalClose = () => {
    if (isLoading) {
      Alert.alert(
        'Warning',
        'Are you sure you want to cancel the post creation?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => {
              resetCreatePostState();
              setShowNewPostModal(false);
            },
          },
        ]
      );
    } else {
      resetCreatePostState();
      setShowNewPostModal(false);
    }
  };

  // Store JWT token and check authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Store the token
        // await storeAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiam9obmRvZUBleGFtcGxlIiwibW9fdXNlciI6IjA5ODc2NTQzMjEiLCJfaWQiOiI2N2QzMTQxOTY3YjAzODFkODQwMDQ5NjAifSwiaWF0IjoxNzQyNjIzNjQyLCJleHAiOjE3NDI3MTAwNDJ9.uFDWveaUojPFCtyp3fLs2ZDteDS-PT-0jEiYf5mTpMw');
        
        // Verify authentication
        const isAuth = await isAuthenticated();
        if (!isAuth) {
          Alert.alert('Error', 'Authentication failed');
          navigation.navigate('Login'); // Navigate to login if not authenticated
          return;
        }

        // If authenticated, fetch posts
        fetchPosts();
      } catch (error) {
        console.error('Authentication error:', error);
        Alert.alert('Error', 'Failed to initialize authentication');
      }
    };

    initializeAuth();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let response;
      if (activeTab === 'all') {
        response = await getCommunityPosts();
      } else {
        response = await getPostsByHeading(activeTab);
      }
      
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      
      setPosts(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setNewPost(prev => ({
          ...prev,
          communityPic: {
            uri: selectedAsset.uri,
            type: 'image/jpeg',
            name: 'community-post-image.jpg'
          }
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.heading_name.trim() || !newPost.description.trim() || !newPost.heading) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          Alert.alert('Error', 'Request timed out. Please try again.');
        }
      }, 15000);

      const formData = new FormData();
      formData.append('heading', newPost.heading);
      formData.append('heading_name', newPost.heading_name);
      formData.append('description', newPost.description);
      
      // Send labels as a single array
      formData.append('labels', newPost.labels);

      if (newPost.communityPic) {
        formData.append('communityPic', {
          uri: newPost.communityPic.uri,
          type: 'image/jpeg',
          name: 'community-post-image.jpg'
        });
      }

      const response = await createCommunityPost(formData);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      setShowNewPostModal(false);
      resetCreatePostState();
      fetchPosts();
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Create post error:', error);
      Alert.alert('Error', 'Failed to create post. Please check your connection and try again.');
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await likePost(postId);
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      fetchPosts(); // Refresh posts to update likes
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deletePost(postId);
              if (response.error) {
                Alert.alert('Error', response.error);
                return;
              }
              fetchPosts(); // Refresh posts
              Alert.alert('Success', 'Post deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  const handleAddLabel = () => {
    if (labelInput.trim()) {
      setNewPost(prev => ({
        ...prev,
        labels: [...prev.labels, labelInput.trim()]
      }));
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (indexToRemove) => {
    setNewPost(prev => ({
      ...prev,
      labels: prev.labels.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Mock data for categories
  const categories = [
    { id: '1', name: 'All', icon: 'view-grid' },
    { id: '2', name: 'Success Stories', icon: 'trophy' },
    { id: '3', name: 'Career', icon: 'briefcase' },
    { id: '4', name: 'Mental Health', icon: 'brain' },
    { id: '5', name: 'Relationships', icon: 'heart' },
    { id: '6', name: 'Safety', icon: 'shield-check' },
  ];

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postCard}
      >
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image 
            source={{ uri: item.createdBy?.profilePic || 'https://picsum.photos/200' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.authorName}>{item.createdBy?.name || 'Anonymous'}</Text>
            <Text style={styles.timeAgo}>
              {new Date(item.createdAt).toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.categoryBadge}>
          <Icon 
            name={categories.find(c => c.name === item.heading)?.icon || 'tag'} 
            size={14} 
            color={colors.primary.main} 
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryText}>{item.heading}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.postTitle}>{item.heading_name}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.description}
      </Text>

      {item.communityPic && (
        <Image 
          source={{ uri: `${item.communityPic}` }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.tagsContainer}>
        {Array.isArray(item.labels) && item.labels.length > 0 ? (
          item.labels.map((label, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{label}</Text>
            </View>
          ))
        ) : null}
      </View>

      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => handleLikePost(item._id)}>
          <Icon 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={item.isLiked ? colors.error.main : colors.primary.main} 
          />
          <Text style={styles.footerButtonText}>{item.likes?.length || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('PostDetail', { post: item })}>
          <Icon name="comment-outline" size={22} color={colors.primary.main} />
          <Text style={styles.footerButtonText}>{item.comments?.length || 0}</Text>
        </TouchableOpacity>
        {item.isAuthor && (
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => handleDeletePost(item._id)}>
            <Icon name="delete-outline" size={22} color={colors.error.main} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => setShowNewPostModal(true)}>
          <Icon name="plus" size={20} color={semantic.text.inverse} />
          <Text style={styles.newPostButtonText}>Share Story</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                activeTab === category.name.toLowerCase() && styles.activeCategoryChip,
              ]}>
              <Icon 
                name={category.icon} 
                size={20} 
                color={activeTab === category.name.toLowerCase() ? semantic.text.inverse : colors.primary.main} 
              />
              <Text
                style={[
                  styles.categoryChipText,
                  activeTab === category.name.toLowerCase() && styles.activeCategoryChipText,
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Stories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllButton}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // New Post Modal
  const renderNewPostModal = () => (
    <RNModal
      visible={showNewPostModal}
      animationType="slide"
      transparent
      onRequestClose={handleModalClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.modalCloseButton}>
              <Icon name="arrow-left" size={24} color={semantic.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TouchableOpacity
              style={[
                styles.modalPostButton,
                (!newPost.heading_name || !newPost.description || !newPost.heading) && styles.modalPostButtonDisabled
              ]}
              disabled={!newPost.heading_name || !newPost.description || !newPost.heading || isLoading}
              onPress={handleCreatePost}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.modalPostButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <Text style={styles.sectionLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categorySelectorScroll}>
                <View style={styles.categorySelector}>
                  {categories.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        newPost.heading === category.name && styles.activeCategoryChip,
                      ]}
                      onPress={() => setNewPost(prev => ({ ...prev, heading: category.name }))}>
                      <Icon 
                        name={category.icon} 
                        size={20} 
                        color={newPost.heading === category.name ? semantic.text.inverse : colors.primary.main} 
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          newPost.heading === category.name && styles.activeCategoryChipText,
                        ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Write a title for your post..."
                placeholderTextColor={semantic.text.secondary}
                value={newPost.heading_name}
                onChangeText={(text) => setNewPost(prev => ({ ...prev, heading_name: text }))}
                maxLength={100}
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Share your story..."
                placeholderTextColor={semantic.text.secondary}
                value={newPost.description}
                onChangeText={(text) => setNewPost(prev => ({ ...prev, description: text }))}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionLabel}>Labels</Text>
              <View style={styles.labelInputContainer}>
                <TextInput
                  style={styles.labelInput}
                  placeholder="Add labels (e.g., motivation, career)"
                  placeholderTextColor={semantic.text.secondary}
                  value={labelInput}
                  onChangeText={setLabelInput}
                  onSubmitEditing={handleAddLabel}
                  returnKeyType="done"
                />
                <TouchableOpacity 
                  style={styles.addLabelButton}
                  onPress={handleAddLabel}>
                  <Icon name="plus" size={20} color={colors.primary.main} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.labelsContainer}>
                {newPost.labels.map((label, index) => (
                  <View key={index} style={styles.labelChip}>
                    <Text style={styles.labelChipText}>#{label}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveLabel(index)}
                      style={styles.removeLabelButton}>
                      <Icon name="close" size={16} color={semantic.text.secondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <View style={styles.mediaHeaderContainer}>
                <Text style={styles.sectionLabel}>Media</Text>
                <TouchableOpacity onPress={pickImage} style={styles.addMediaButton}>
                  <Icon name="image-plus" size={20} color={colors.primary.main} />
                  <Text style={styles.addMediaText}>Add Photo</Text>
                </TouchableOpacity>
              </View>
              
              {newPost.communityPic ? (
                <View style={styles.selectedImageContainer}>
                  <Image 
                    source={{ uri: newPost.communityPic.uri }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setNewPost(prev => ({ ...prev, communityPic: null }))}>
                    <Icon name="close-circle" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage} style={styles.uploadPlaceholder}>
                  <Icon name="image-plus" size={32} color={colors.primary.main} />
                  <Text style={styles.uploadText}>Add Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        ListHeaderComponent={renderHeader}
        refreshing={isLoading}
        onRefresh={fetchPosts}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowNewPostModal(true)}>
        <Icon name="plus" size={24} color={semantic.text.inverse} />
      </TouchableOpacity>

      {renderNewPostModal()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.text.primary,
    letterSpacing: 0.5,
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    
  },
  newPostButtonText: {
    color: semantic.text.inverse,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoriesWrapper: {
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
    ...shadows.sm,
  },
  categoriesContainer: {
    backgroundColor: semantic.background.paper,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    
  },
  activeCategoryChip: {
    backgroundColor: colors.primary.main,
  },
  categoryChipText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeCategoryChipText: {
    color: semantic.text.inverse,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.text.primary,
    letterSpacing: 0.5,
  },
  seeAllButton: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  postsList: {
    paddingBottom: 90,
  },
  postCard: {
    backgroundColor: semantic.background.paper,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: semantic.text.secondary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    color: colors.primary.main,
    fontSize: 12,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 14,
    color: semantic.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: semantic.background.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: semantic.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: semantic.border.light,
    paddingTop: 12,
    marginTop: 4,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  footerButtonText: {
    marginLeft: 6,
    color: semantic.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: semantic.background.paper,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalPostButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalPostButtonDisabled: {
    backgroundColor: semantic.background.disabled,
  },
  modalPostButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalScrollContent: {
    flex: 1,
  },
  modalSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 12,
  },
  categorySelectorScroll: {
    marginHorizontal: -16,
  },
  categorySelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  titleInput: {
    fontSize: 18,
    color: semantic.text.primary,
    padding: 0,
    marginTop: 4,
  },
  descriptionInput: {
    fontSize: 16,
    color: semantic.text.primary,
    padding: 0,
    marginTop: 4,
    minHeight: 120,
  },
  mediaHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary.main}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addMediaText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  uploadPlaceholder: {
    height: 200,
    backgroundColor: `${colors.primary.main}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary.main}30`,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  selectedImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  labelInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelInput: {
    flex: 1,
    fontSize: 16,
    color: semantic.text.primary,
    padding: 12,
    backgroundColor: semantic.background.default,
    borderRadius: 8,
    marginRight: 8,
  },
  addLabelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary.main}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary.main}15`,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 16,
  },
  labelChipText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  removeLabelButton: {
    padding: 2,
  },
});

export default CommunityScreen; 
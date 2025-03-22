import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows, semantic, components } from '../theme/colors';

const MarketplaceScreen = () => {
  const [activeTab, setActiveTab] = useState('buyer'); // 'buyer' or 'myshop'
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollY = useRef(new Animated.Value(0)).current;

  const categoryTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -70],
    extrapolate: 'clamp',
  });

  const categoryOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Mock data for products
  const products = [
    {
      id: '1',
      title: 'Handmade Jewelry Set',
      price: '₹1,200',
      image: 'https://picsum.photos/200/200',
      vendor: 'Craft Studio',
      category: 'Jewelry',
      rating: 4.5,
      sales: 28,
      badge: 'Featured',
    },
    {
      id: '2',
      title: 'Traditional Embroidered Dress',
      price: '₹2,500',
      image: 'https://picsum.photos/200/201',
      vendor: 'Fashion Hub',
      category: 'Clothing',
      rating: 4.8,
      sales: 45,
      badge: 'Bestseller',
    },
    {
      id: '3',
      title: 'Handwoven Bamboo Basket',
      price: '₹899',
      image: 'https://picsum.photos/200/202',
      vendor: 'EcoArt Crafts',
      category: 'Home Decor',
      rating: 4.3,
      sales: 15,
    },
    {
      id: '4',
      title: 'Organic Honey Set',
      price: '₹750',
      image: 'https://picsum.photos/200/203',
      vendor: 'Nature\'s Best',
      category: 'Food',
      rating: 4.9,
      sales: 67,
      badge: 'Organic',
    },
    {
      id: '5',
      title: 'Hand-painted Pottery Set',
      price: '₹1,800',
      image: 'https://picsum.photos/200/204',
      vendor: 'ArtisanCrafts',
      category: 'Home Decor',
      rating: 4.7,
      sales: 23,
    },
    {
      id: '6',
      title: 'Traditional Silk Saree',
      price: '₹5,999',
      image: 'https://picsum.photos/200/205',
      vendor: 'Heritage Weaves',
      category: 'Clothing',
      rating: 4.6,
      sales: 12,
      badge: 'Premium',
    },
    {
      id: '7',
      title: 'Handmade Leather Wallet',
      price: '₹999',
      image: 'https://picsum.photos/200/206',
      vendor: 'LeatherCraft',
      category: 'Accessories',
      rating: 4.4,
      sales: 34,
    },
    {
      id: '8',
      title: 'Homemade Pickle Set',
      price: '₹450',
      image: 'https://picsum.photos/200/207',
      vendor: 'Granny\'s Kitchen',
      category: 'Food',
      rating: 4.8,
      sales: 89,
      badge: 'Popular',
    },
    {
      id: '9',
      title: 'Beaded Necklace Set',
      price: '₹1,499',
      image: 'https://picsum.photos/200/208',
      vendor: 'Bead Beauty',
      category: 'Jewelry',
      rating: 4.3,
      sales: 19,
    },
    {
      id: '10',
      title: 'Handwoven Cotton Stole',
      price: '₹799',
      image: 'https://picsum.photos/200/209',
      vendor: 'Weaver\'s Tale',
      category: 'Clothing',
      rating: 4.5,
      sales: 56,
    },
    {
      id: '11',
      title: 'Brass Wall Decor',
      price: '₹2,999',
      image: 'https://picsum.photos/200/210',
      vendor: 'Heritage Arts',
      category: 'Home Decor',
      rating: 4.7,
      sales: 8,
      badge: 'New',
    },
    {
      id: '12',
      title: 'Organic Spice Box',
      price: '₹1,299',
      image: 'https://picsum.photos/200/211',
      vendor: 'Spice Garden',
      category: 'Food',
      rating: 4.9,
      sales: 78,
      badge: 'Bestseller',
    }
  ];

  // Mock data for shop dashboard
  const shopStats = {
    totalSales: '₹15,400',
    totalOrders: 24,
    pendingOrders: 3,
    rating: 4.6,
  };

  // Categories array
  const categories = ['All', 'Clothing', 'Jewelry', 'Home Decor', 'Food', 'Crafts', 'Accessories'];

  // Filter products based on active category
  const filteredProducts = products.filter(product => 
    activeCategory === 'All' ? true : product.category === activeCategory
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.badge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.vendorName}>{item.vendor}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Icon name="star" size={12} color={colors.secondary.amber} />
          <Text style={styles.salesText}>({item.sales})</Text>
        </View>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBuyerView = () => (
    <View style={styles.contentContainer}>
      <Animated.View style={[
        styles.categorySection,
        {
          transform: [{ translateY: categoryTranslateY }],
          opacity: categoryOpacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }
      ]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category} 
              style={[
                styles.categoryChip,
                activeCategory === category && styles.activeCategoryChip
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText
              ]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productGrid,
          { paddingTop: 50 }
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={() => (
          <Animated.View style={[styles.sectionHeader, { opacity: headerOpacity }]}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'All' ? 'Featured Products' : `${activeCategory} Products`}
            </Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="filter-variant" size={22} color={semantic.text.secondary} />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyStateContainer}>
            <Icon name="package-variant" size={48} color={semantic.text.disabled} />
            <Text style={[styles.emptyStateText, { color: semantic.text.secondary }]}>
              No products found in this category
            </Text>
          </View>
        )}
      />
    </View>
  );

  const renderMyShopView = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.dashboardContainer}>
        <Text style={styles.welcomeText}>Welcome to Your Shop!</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shopStats.totalSales}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shopStats.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shopStats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shopStats.rating}</Text>
            <Text style={styles.statLabel}>Shop Rating</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addProductButton}>
        <Icon name="plus" size={24} color={semantic.text.inverse} />
        <Text style={styles.addProductText}>Add New Product</Text>
      </TouchableOpacity>

      <View style={styles.myProductsSection}>
        <Text style={styles.sectionTitle}>My Products</Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          scrollEnabled={false}
          contentContainerStyle={styles.productGrid}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={24} color={semantic.text.secondary} />
            <Text style={{ color: components.input.placeholder, marginLeft: 8 }}>Search products...</Text>
          </View>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setActiveTab(activeTab === 'buyer' ? 'myshop' : 'buyer')}>
            <Icon 
              name="store" 
              size={22} 
              color={activeTab === 'myshop' ? colors.primary.main : semantic.text.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="cart-outline" size={22} color={semantic.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'buyer' ? renderBuyerView() : renderMyShopView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.default,
    paddingTop: 15,
  },
  header: {
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: components.input.background,
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: components.input.border,
  },
  iconButton: {
    padding: 8,
    backgroundColor: components.input.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: components.input.border,
    marginLeft: 6,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: semantic.background.default,
  },
  categorySection: {
    backgroundColor: semantic.background.paper,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
    ...shadows.md,
    height: 52,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  productGrid: {
    paddingBottom: 15,
    paddingTop: 45,
  },
  productRow: {
    paddingHorizontal: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: semantic.background.paper,
    borderWidth: 1,
    borderColor: semantic.border.light,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 8,
  },
  vendorName: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    color: semantic.text.primary,
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: semantic.text.primary,
    marginRight: 2,
    fontWeight: '500',
  },
  salesText: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: semantic.text.inverse,
    fontSize: 10,
    fontWeight: '600',
  },
  dashboardContainer: {
    padding: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: semantic.background.card,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: semantic.text.secondary,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  addProductText: {
    color: semantic.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: semantic.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  myProductsSection: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: semantic.background.paper,
    borderTopWidth: 1,
    borderTopColor: semantic.border.light,
    marginTop: 10,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginTop: 0,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryChip: {
    backgroundColor: semantic.background.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  activeCategoryChip: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  categoryText: {
    color: semantic.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: semantic.text.inverse,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: semantic.background.card,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
});

export default MarketplaceScreen; 
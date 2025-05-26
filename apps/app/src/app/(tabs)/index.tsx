import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/services/authService';
import { useRouter } from 'expo-router';
import COLORS from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const IS_MOBILE = width < 600;
const POST_WIDTH = width; // Suppression du padding pour utiliser toute la largeur

// Mock data for posts
const MOCK_POSTS = [
  {
    id: 1,
    user: {
      name: 'Pauline Durant',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    timeAgo: 'Il y a 2h',
    location: 'Chamonix, France',
    content: 'Exploring the mountains this summer! 🏔️',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    likes: 128,
    comments: 8,
  },
  {
    id: 2,
    user: {
      name: 'Yohann Robert',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    timeAgo: 'Il y a 1 jour',
    location: 'Barcelone, Espagne',
    content: 'City break à Barcelone 👌',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
    likes: 98,
    comments: 2,
  }
];

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  timeAgo: string;
  location: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
}

const Post = ({ post }: { post: Post }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <View style={styles.userInfo}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{post.user.name}</Text>
          <Text style={styles.location}>{post.location}</Text>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>

    <View style={styles.imageWrapper}>
      <Image source={{ uri: post.image }} style={styles.postImage} />
    </View>

    <View style={styles.postContent}>
      <Text style={styles.likes}>{post.likes} j'aime</Text>
      <Text style={styles.caption}>{post.content}</Text>
    </View>

    <View style={styles.postActions}>
      <View style={styles.leftActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="repeat-variant" size={28} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paper-plane-outline" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const MOCK_USER = {
  name: 'Pauline Durant',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
};
const getFirstName = (fullName: string) => fullName.split(' ')[0];

// Mock projet de voyage
const MOCK_PROJECT = {
  destination: 'Islande',
  dates: '15-22 août 2024',
  image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  participants: [
    { name: 'Pauline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
    { name: 'Yohann', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    { name: 'Sophie', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  ],
};

const MOCK_TIPS = [
  {
    title: '5 astuces pour voyager léger',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    description: 'Découvrez comment optimiser votre valise pour partir l\'esprit tranquille.'
  },
  {
    title: 'Découvrir la Slovénie en 7 jours',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    description: 'Un itinéraire nature et culture pour explorer ce joyau méconnu.'
  },
  {
    title: 'Voyager en train en Europe',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    description: 'Conseils pour profiter du rail pass et voyager écolo.'
  }
];

// Types pour le carousel
interface ProjectItem {
  type: 'project';
  destination: string;
  dates: string;
  image: string;
  participants: { name: string; avatar: string }[];
}
interface TipItem {
  type: 'tip';
  title: string;
  image: string;
  description: string;
}
type CarouselItem = ProjectItem | TipItem;

export default function HomeScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasProject = true; // Passe à false pour tester le mode "conseil"
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Préparer les slides du carousel
  const carouselData: CarouselItem[] = hasProject
    ? [{ type: 'project', ...MOCK_PROJECT }, ...MOCK_TIPS.map(tip => ({ type: 'tip' as const, ...tip }))]
    : MOCK_TIPS.map(tip => ({ type: 'tip' as const, ...tip }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Nouveau Header */}
      <View style={styles.headerNew}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: MOCK_USER.avatar }} style={styles.headerAvatar} />
          <Text style={styles.headerPseudo}>{getFirstName(MOCK_USER.name)}</Text>
        </View>
        <TouchableOpacity style={styles.headerSearch} onPress={() => router.replace('/(tabs)/explore')}>
          <Ionicons name="search" size={18} color={COLORS.placeholder} style={{ marginRight: 4 }} />
          <Text style={styles.headerSearchText}>Rechercher...</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="paper-plane-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        </View>

      {/* Carousel compact projet + conseils */}
      <View style={{ paddingTop: 12, paddingBottom: 8 }}>
        <FlatList
          data={carouselData}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
          snapToInterval={364}
          decelerationRate="fast"
          onScroll={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / 364);
            setActiveIndex(idx);
          }}
          renderItem={({ item, index }) => {
            const isActive = index === activeIndex;
            const cardWidth = 340;
            const cardStyle = {
              backgroundColor: '#fff',
              borderRadius: 14,
              marginLeft: 12,
              marginRight: 12,
              width: cardWidth,
              minWidth: cardWidth,
              maxWidth: cardWidth,
              padding: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isActive ? 0.13 : 0.07,
              shadowRadius: isActive ? 8 : 4,
              elevation: isActive ? 4 : 1,
              transform: [{ scale: isActive ? 1 : 0.97 }],
              opacity: isActive ? 1 : 0.85,
              height: 92,
              overflow: 'hidden' as const,
              flexDirection: 'row' as const,
              alignItems: 'stretch' as const,
              justifyContent: 'flex-start' as const,
            };
            return (
              <TouchableOpacity
                style={[cardStyle, { padding: 0, alignItems: 'stretch', flexDirection: 'row' }]}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.type === 'project') {
                    router.push('/(tabs)/project');
                  } else {
                    router.push('/(tabs)/explore');
                  }
                }}
              >
                <Image source={{ uri: item.image }} style={styles.carouselImageSide} />
                <View style={styles.carouselContentSideBetter}>
                  <View style={styles.carouselTopRowBetter}>
                    <Text style={item.type === 'project' ? styles.carouselBadgeText : styles.carouselBadgeTextTip}>
                      {item.type === 'project' ? 'Projet en cours' : 'Conseil voyage'}
              </Text>
                    {item.type === 'project' ? (
                      <View style={styles.carouselAvatarsRowSideBetter}>
                        {item.participants.map((p: { name: string; avatar: string }, i: number) => (
                          <View key={p.name} style={styles.carouselAvatarWrapper}>
                            <Image source={{ uri: p.avatar }} style={styles.carouselAvatarSide} />
            </View>
                        ))}
            </View>
                    ) : null}
            </View>
                  <View style={styles.carouselMainContent}>
                    <Text style={styles.carouselTitleSideBetter} numberOfLines={1}>
                      {item.type === 'project' ? item.destination : item.title}
              </Text>
                    {item.type === 'project' ? (
                      <Text style={styles.carouselDatesSideBetter}>{item.dates}</Text>
                    ) : (
                      <Text style={styles.carouselDescSideBetter} numberOfLines={1}>{item.description}</Text>
                    )}
            </View>
          </View>
                <View style={styles.carouselArrowContainer}>
                  <MaterialCommunityIcons name="chevron-right-circle" size={28} color={COLORS.primary} />
        </View>
              </TouchableOpacity>
            );
          }}
        />
        </View>
      <View style={styles.sectionSeparator} />

      {/* Feed */}
      <ScrollView style={styles.feed}>
        {MOCK_POSTS.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={COLORS.secondary} />
          <Text style={[styles.navLabel, { color: COLORS.secondary }]}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color={COLORS.text} />
          <Text style={styles.navLabel}>Explorer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton}>
          <LinearGradient
            colors={[COLORS.secondary, COLORS.secondaryDark]}
            style={styles.createButtonGradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={24} color={COLORS.text} />
          <Text style={styles.navLabel}>Activités</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color={COLORS.text} />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    marginBottom: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerPseudo: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerIcon: {
    padding: 6,
    marginLeft: 4,
  },
  headerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flex: 1,
    minWidth: 90,
    maxWidth: 220,
    marginHorizontal: 8,
  },
  headerSearchText: {
    color: COLORS.placeholder,
    fontSize: 14,
  },
  feed: {
    flex: 1,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  postContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  username: {
    fontWeight: '600',
    color: COLORS.text,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
  imageWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginBottom: 0,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  postImage: {
    width: POST_WIDTH - 16,
    height: (POST_WIDTH - 16) * 0.65,
    resizeMode: 'cover',
    borderRadius: 24,
  },
  captionOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 169, 77, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  captionOverlayText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  location: {
    color: COLORS.accent,
    fontWeight: '500',
    fontSize: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionButton: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 32,
  },
  postContent: {
    padding: 12,
  },
  likes: {
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.text,
  },
  viewComments: {
    color: COLORS.placeholder,
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: COLORS.text,
  },
  createButton: {
    marginTop: -20,
  },
  createButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  caption: {
    marginBottom: 4,
    color: COLORS.text,
    fontSize: 15,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
    marginHorizontal: 0,
  },
  carouselImageSide: {
    width: 92,
    height: 92,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: 0,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  carouselContentSideBetter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: 0,
    paddingRight: 16,
    paddingTop: 0,
    marginTop: 0,
  },
  carouselTopRowBetter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: 0,
    paddingTop: 0,
  },
  carouselMainContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  carouselAvatarsRowSideBetter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 8,
    marginTop: 0,
    paddingTop: 0,
  },
  carouselAvatarWrapper: {
    marginLeft: -8,
    padding: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 0,
  },
  carouselAvatarSide: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  carouselArrowContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -14 }],
  },
  carouselBadgeText: {
    backgroundColor: 'rgba(0, 137, 123, 0.13)',
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 6,
    marginTop: 0,
  },
  carouselBadgeTextTip: {
    backgroundColor: 'rgba(255, 169, 77, 0.13)',
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 10,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 6,
    marginTop: 0,
  },
  carouselTitleSideBetter: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
    color: COLORS.secondary,
  },
  carouselDatesSideBetter: {
    color: COLORS.text,
    fontSize: 11,
    marginBottom: 0,
  },
  carouselDescSideBetter: {
    color: COLORS.text,
    fontSize: 11,
    marginBottom: 0,
  },
}); 
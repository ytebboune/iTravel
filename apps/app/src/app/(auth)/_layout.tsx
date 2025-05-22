import { Stack } from 'expo-router'
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import COLORS from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isDesktop = width >= 1024;

function LogoTitle() {
  if (Platform.OS === 'web') {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: 48,
              fontFamily: 'MontserratAlternates-Bold',
              color: COLORS.textLight,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 0,
              // @ts-ignore
              textShadow: '0px 2px 8px rgba(0,0,0,0.18)',
            }}
          >
            iTravel
          </Text>
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: COLORS.birdBrown,
            marginLeft: 10,
            marginBottom: 4,
          }} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 52,
          fontFamily: 'MontserratAlternates-Bold',
          color: COLORS.primaryLight,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        iTravel
      </Text>
      <View style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.birdBrown,
        marginLeft: 10,
        marginBottom: 8,
      }} />
    </View>
  );
}

export function AuthHeader({ subtitle, showBackButton = false }: { subtitle: string, showBackButton?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, Platform.OS === 'ios' && { marginTop: insets.top + 20 }]}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack?.()) {
              router.back();
            } else {
              router.replace('/(auth)/login');
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <LogoTitle />
      <View style={styles.subtitleRow}>
        <MaterialCommunityIcons name="airplane" size={24} color={COLORS.accent} style={{ marginRight: 8, marginTop: 2 }} />
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function AuthDivider() {
  const { t } = require('react-i18next');
  return (
    <View style={styles.orRow}>
      <View style={styles.orLine} />
      <Text style={styles.orText}>{t ? t('auth.login.or', 'OU') : 'OU'}</Text>
      <View style={styles.orLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === 'ios' ? 30 : 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -10 : -5,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.accent,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.or,
  },
  orText: {
    marginHorizontal: 8,
    color: COLORS.orText,
    fontWeight: 'bold',
  },
});

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
} 
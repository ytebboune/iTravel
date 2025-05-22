import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import COLORS from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');

function LogoTitle() {
  if (Platform.OS === 'web') {
    // Web : effet épuré, pro, accent graphique cercle
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="airplane" size={32} color={COLORS.accent} style={{ marginRight: 8, marginTop: 2 }} />
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
  // Mobile : gradient, même accent graphique
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name="airplane" size={36} color={COLORS.accent} style={{ marginRight: 8, marginTop: 2 }} />
      <MaskedView
        maskElement={
          <Text
            style={{
              fontSize: 52,
              fontFamily: 'MontserratAlternates-Bold',
              color: 'black',
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            iTravel
          </Text>
        }
      >
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 60, justifyContent: 'center' }}
        >
          <Text
            style={{
              opacity: 0,
              fontSize: 52,
              fontFamily: 'MontserratAlternates-Bold',
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            iTravel
          </Text>
        </LinearGradient>
      </MaskedView>
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

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Background image */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={require('../../assets/images/background_2.png')}
          style={styles.background}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <LogoTitle />
        <Text style={styles.subtitle}>Envolons nous</Text>
      </View>

      {/* Card centering wrapper */}
      <View style={styles.centerWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.cardWrapper}
        >
          <View style={styles.cardOuter}>
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            <View style={styles.cardContent}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={COLORS.placeholder}
              />
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry
                />
                <TouchableOpacity style={styles.eyeButton}>
                  <Ionicons name="eye-outline" size={22} color={COLORS.placeholder} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot password?</Text>
              </TouchableOpacity>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="google" size={20} color="#4285F4" />
                <Text style={styles.socialText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="apple1" size={20} color={COLORS.text} />
                <Text style={styles.socialText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        {/* Create account link juste sous la card */}
        <View style={styles.bottomLinkWrapper}>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.createAccountText}>Create an account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const CARD_WIDTH = width > 440 ? 380 : width * 0.92;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    marginTop: height * 0.06,
    marginBottom: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textAlign: 'center',
    letterSpacing: 2.5,
    marginBottom: 6,
    fontFamily: 'Manrope-ExtraBold',
    textShadowColor: 'rgba(0,0,0,0.22)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 32,
    color: COLORS.accent,
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
    fontWeight: '700',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.10)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  cardOuter: {
    width: CARD_WIDTH,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.35)',
    position: 'relative',
  },
  cardContent: {
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 0,
    color: COLORS.text,
    fontFamily: 'Inter',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
  },
  inputPassword: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    borderWidth: 0,
    color: COLORS.text,
    fontFamily: 'Inter',
  },
  eyeButton: {
    height: 48,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -40,
  },
  loginButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 32,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  forgot: {
    color: 'rgba(34,46,58,0.7)',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
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
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  socialButton: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  bottomLinkWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  createAccountText: {
    color: COLORS.createAccount,
    fontSize: 18,
    textDecorationLine: 'none',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
}); 
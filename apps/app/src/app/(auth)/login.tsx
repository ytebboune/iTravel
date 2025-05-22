import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import COLORS from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useState } from 'react';
import { AuthHeader, AuthDivider } from './_layout';

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [showPassword, setShowPassword] = useState(false);

  // Fonction pour obtenir l'image de fond en fonction des dimensions actuelles
  const getBackgroundImage = () => {
    let imageSource;
    
    // Desktop
    if (windowWidth >= 1024) {
      imageSource = require('../../assets/images/background-login/desktop_large.png');
      console.log('Using desktop_large.png - Width:', windowWidth, 'Height:', windowHeight);
    }
    // Tablet
    else if (windowWidth >= 768) {
      imageSource = isLandscape 
        ? require('../../assets/images/background-login/tablette_paysage.png')
        : require('../../assets/images/background-login/tablette_portrait.png');
      console.log('Using tablette_' + (isLandscape ? 'paysage' : 'portrait') + '.png - Width:', windowWidth, 'Height:', windowHeight);
    }
    // Mobile
    else {
      imageSource = isLandscape
        ? require('../../assets/images/background-login/mobile_paysage.png')
        : require('../../assets/images/background-login/test_mobile_portrait.png');
      console.log('Using mobile_' + (isLandscape ? 'paysage' : 'test_portrait') + '.png - Width:', windowWidth, 'Height:', windowHeight);
    }

    return imageSource;
  };

  // Calculer CARD_WIDTH avant de l'utiliser dans les styles
  const CARD_WIDTH = isLandscape 
    ? Math.min(windowWidth * 0.4, 380) // En paysage, on prend 40% de la largeur max 380px
    : Math.min(windowWidth * 0.92, 380); // En portrait, on prend 92% de la largeur max 380px

  // Mettre à jour les dimensions pour les styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
    background: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: 'absolute',
    },
    header: {
      marginTop: Platform.select({
        ios: isLandscape ? windowHeight * 0.04 : windowHeight * 0.06,
        android: isLandscape ? windowHeight * 0.03 : windowHeight * 0.04,
        default: isLandscape ? windowHeight * 0.04 : windowHeight * 0.06,
      }),
      marginBottom: isLandscape ? 12 : 18,
      alignItems: 'center',
      paddingHorizontal: 16,
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
      paddingHorizontal: 16,
      paddingBottom: Platform.select({
        ios: isLandscape ? 16 : 20,
        android: isLandscape ? 12 : 16,
        default: isLandscape ? 16 : 20,
      }),
    },
    cardWrapper: {
      width: '100%',
      alignItems: 'center',
      maxWidth: 440,
    },
    cardOuter: {
      width: CARD_WIDTH,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: 'rgba(255,255,255,0.35)',
      position: 'relative',
      maxWidth: '100%',
    },
    cardContent: {
      paddingVertical: Math.min(24, windowHeight * 0.03),
      paddingHorizontal: Math.min(18, windowWidth * 0.04),
      alignItems: 'center',
    },
    input: {
      width: '100%',
      backgroundColor: COLORS.background,
      borderRadius: 18,
      padding: Math.min(16, windowHeight * 0.02),
      fontSize: Math.min(16, windowWidth * 0.04),
      marginBottom: Math.min(14, windowHeight * 0.02),
      borderWidth: 0,
      color: COLORS.text,
      fontFamily: 'Inter',
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: Math.min(14, windowHeight * 0.02),
    },
    inputPassword: {
      flex: 1,
      backgroundColor: COLORS.background,
      borderRadius: 18,
      padding: Math.min(16, windowHeight * 0.02),
      fontSize: Math.min(16, windowWidth * 0.04),
      borderWidth: 0,
      color: COLORS.text,
      fontFamily: 'Inter',
    },
    eyeButton: {
      height: Math.min(48, windowHeight * 0.06),
      width: Math.min(40, windowWidth * 0.1),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -Math.min(40, windowWidth * 0.1),
    },
    loginButton: {
      width: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: 32,
      padding: Math.min(16, windowHeight * 0.02),
      alignItems: 'center',
      marginBottom: Math.min(12, windowHeight * 0.015),
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: Math.min(18, windowWidth * 0.045),
      fontFamily: 'Inter-Medium',
    },
    forgot: {
      color: 'rgba(34,46,58,0.7)',
      marginBottom: Math.min(16, windowHeight * 0.02),
      textAlign: 'center',
      fontWeight: '600',
      fontSize: Math.min(15, windowWidth * 0.038),
      fontFamily: 'Inter-Medium',
    },
    orRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Math.min(12, windowHeight * 0.015),
      width: '100%',
    },
    orLine: {
      flex: 1,
      height: 1,
      backgroundColor: COLORS.or,
    },
    orText: {
      marginHorizontal: Math.min(8, windowWidth * 0.02),
      color: COLORS.orText,
      fontWeight: 'bold',
      fontSize: Math.min(15, windowWidth * 0.038),
      fontFamily: 'Inter-Medium',
    },
    socialButton: {
      width: '100%',
      backgroundColor: COLORS.surface,
      borderRadius: 14,
      padding: Math.min(16, windowHeight * 0.02),
      alignItems: 'center',
      marginBottom: Math.min(12, windowHeight * 0.015),
      borderWidth: 1,
      borderColor: '#eee',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    socialText: {
      color: COLORS.text,
      fontWeight: 'bold',
      fontSize: Math.min(16, windowWidth * 0.04),
      marginLeft: Math.min(8, windowWidth * 0.02),
      fontFamily: 'Inter',
    },
    bottomLinkWrapper: {
      width: '100%',
      alignItems: 'center',
      marginTop: Math.min(18, windowHeight * 0.025),
      paddingBottom: Platform.select({
        ios: 20,
        android: 16,
        default: 20,
      }),
    },
    createAccountText: {
      color: COLORS.createAccount,
      fontSize: Math.min(18, windowWidth * 0.045),
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
    },
  });

  return (
    <View style={styles.container}>
      {/* Background image */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={getBackgroundImage()}
          style={styles.background}
        />
      </View>

      {/* Header */}
      <AuthHeader 
        subtitle="Envolons nous" 
        showBackButton={false}
      />

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
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={COLORS.placeholder} 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgot}>
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
              <Text style={styles.createAccountText}>Don't have an account?</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
} 
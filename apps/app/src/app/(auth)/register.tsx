import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import COLORS from '../../theme/colors';
import { AuthHeader, AuthDivider } from './_layout';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fonction pour obtenir l'image de fond en fonction des dimensions actuelles
  const getBackgroundImage = () => {
    let imageSource;
    // Desktop
    if (windowWidth >= 1024) {
      imageSource = require('../../assets/images/background-login/desktop_large.png');
    }
    // Tablet
    else if (windowWidth >= 768) {
      imageSource = isLandscape
        ? require('../../assets/images/background-login/tablette_paysage.png')
        : require('../../assets/images/background-login/tablette_portrait.png');
    }
    // Mobile
    else {
      imageSource = isLandscape
        ? require('../../assets/images/background-login/test_mobile_portrait.png')
        : require('../../assets/images/background-login/test_mobile_portrait.png');
    }
    return imageSource;
  };

  const isDesktopStandard = windowWidth >= 1280;

  return (
    <View style={styles.container}>
      {/* Background image dynamique */}
      <Image
        source={getBackgroundImage()}
        style={styles.background}
        resizeMode="cover"
      />
      {/* Header */}
      <AuthHeader 
        subtitle="Créez votre compte" 
        showBackButton={true}
      />

      {/* Form Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.cardWrapper}
      >
        <View style={styles.card}>
          {isDesktopStandard ? (
            <View style={styles.inputsRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.placeholder}
                />
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Password"
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={!showPassword}
                    autoComplete="off"
                    autoCorrect={false}
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
              </View>
              <View style={styles.inputColumnRight}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.placeholder}
                />
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="off"
                    autoCorrect={false}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={24} 
                      color={COLORS.placeholder} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={COLORS.placeholder}
              />
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
                  autoComplete="off"
                  autoCorrect={false}
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
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="off"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={COLORS.placeholder} 
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Create Account</Text>
          </TouchableOpacity>
          <AuthDivider />
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={20} color="#4285F4" />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="apple1" size={20} color={COLORS.text} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
        {/* Login link juste sous la card */}
        <View style={styles.bottomLinkWrapper}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.createAccountText}>Déjà un compte ?</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const CARD_WIDTH = width * 0.9 > 480 ? 480 : width * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    minWidth: '100%',
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  cardWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    overflow: 'hidden',
  },
  inputsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 0,
  },
  inputColumn: {
    flex: 1,
    minWidth: 0,
  },
  inputColumnRight: {
    flex: 1,
    minWidth: 0,
    marginLeft: 16,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  passwordRow: {
    width: '100%',
    marginBottom: 16,
    height: 56,
    position: 'relative',
    justifyContent: 'center',
  },
  inputPassword: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 2,
  },
  loginButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  socialButton: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
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
  },
  bottomLinkWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
    paddingBottom: Platform.select({
      ios: 20,
      android: 16,
      default: 20,
    }),
  },
  createAccountText: {
    color: COLORS.createAccount,
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  spacer: {
    height: 16,
  },
  swipeBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  swipeBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
}); 
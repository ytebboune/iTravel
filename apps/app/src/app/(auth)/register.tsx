import React, { useRef } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import COLORS from '../../theme/colors';
import { AuthHeader, AuthDivider } from './_layout';
import { getAuthBackgroundImage } from '../../utils/getAuthBackgroundImage';
import { useRouter } from 'expo-router';
import { register as registerApi } from '../../services/authService';
import { validateEmail, validatePassword, validateConfirmPassword } from '@/utils/validation';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, setLoading, setError } from '@/store/authSlice';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setErrorState] = useState<string | null>(null);
  const loading = useAppSelector(state => state.auth.loading);
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const isDesktopStandard = windowWidth >= 1280;

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const CARD_WIDTH = isLandscape
    ? Math.min(windowWidth * 0.4, 380)
    : Math.min(windowWidth * 0.92, 380);

  // Validation des champs
  const isFormValid = 
    username.trim().length > 0 && 
    validateEmail(email) && 
    validatePassword(password) && 
    validateConfirmPassword(password, confirmPassword);

  const handleRegister = async () => {
    setErrorState(null);
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrorState(emailValidation.message);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrorState(passwordValidation.message);
      return;
    }

    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      setErrorState(confirmPasswordValidation.message);
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await registerApi(username, email, password);
      dispatch(setCredentials({ 
        user: response.user, 
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }));
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      dispatch(setError(errorMessage));
      setErrorState(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      paddingHorizontal: 16,
      flex: 1,
    },
    card: {
      width: CARD_WIDTH,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: 'rgba(255,255,255,0.6)',
      position: 'relative',
      maxWidth: '100%',
      alignItems: 'center',
      paddingVertical: Math.min(24, windowHeight * 0.03),
      paddingHorizontal: Math.min(18, windowWidth * 0.04),
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
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
      opacity: isFormValid ? 1 : 0.5,
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

  return (
    <View style={{ flex: 1 }}>
      <LanguageSelector />
      <View style={styles.container}>
        {/* Background image dynamique */}
        <Image
          source={getAuthBackgroundImage(windowWidth, windowHeight)}
          style={styles.background}
          resizeMode="cover"
        />
        {/* Header */}
        <AuthHeader 
          subtitle={t('auth.register.title')} 
          showBackButton={true}
        />
        {/* Form Card */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.cardWrapper}
        >
          <View style={styles.card}>
            {isDesktopStandard ? (
              <>
                {/* Ligne 1 : username | email */}
                <View style={styles.inputsRow}>
                  <View style={styles.inputColumn}>
                    <TextInput
                      ref={emailRef}
                      style={styles.input}
                      placeholder={t('auth.register.username')}
                      placeholderTextColor={COLORS.placeholder}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </View>
                  <View style={styles.inputColumnRight}>
                    <TextInput
                      ref={emailRef}
                      style={styles.input}
                      placeholder={t('auth.register.email')}
                      placeholderTextColor={COLORS.placeholder}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  </View>
                </View>
                {/* Ligne 2 : password | confirm password */}
                <View style={styles.inputsRow}>
                  <View style={styles.inputColumn}>
                    <View style={styles.passwordRow}>
                      <TextInput
                        ref={passwordRef}
                        style={styles.inputPassword}
                        placeholder={t('auth.register.password')}
                        placeholderTextColor={COLORS.placeholder}
                        secureTextEntry={!showPassword}
                        autoComplete="off"
                        autoCorrect={false}
                        value={password}
                        onChangeText={setPassword}
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        accessible={false}
                        {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
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
                    <View style={styles.passwordRow}>
                      <TextInput
                        ref={confirmPasswordRef}
                        style={styles.inputPassword}
                        placeholder={t('auth.register.confirmPassword')}
                        placeholderTextColor={COLORS.placeholder}
                        secureTextEntry={!showConfirmPassword}
                        autoComplete="off"
                        autoCorrect={false}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        accessible={false}
                        {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
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
              </>
            ) : (
              <>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder={t('auth.register.username')}
                  placeholderTextColor={COLORS.placeholder}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder={t('auth.register.email')}
                  placeholderTextColor={COLORS.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                <View style={styles.passwordRow}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.inputPassword}
                    placeholder={t('auth.register.password')}
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={!showPassword}
                    autoComplete="off"
                    autoCorrect={false}
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    accessible={false}
                    {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
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
                    ref={confirmPasswordRef}
                    style={styles.inputPassword}
                    placeholder={t('auth.register.confirmPassword')}
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="off"
                    autoCorrect={false}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    accessible={false}
                    {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
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
            {error ? (
              <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{error}</Text>
            ) : null}
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleRegister} 
              disabled={loading || !isFormValid}
            >
              <Text style={styles.loginButtonText}>
                {loading ? t('auth.register.loading') : t('auth.register.submit')}
              </Text>
            </TouchableOpacity>
            <AuthDivider />
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={20} color="#4285F4" />
              <Text style={styles.socialText}>{t('auth.register.continueWithGoogle')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="apple1" size={20} color={COLORS.text} />
              <Text style={styles.socialText}>{t('auth.register.continueWithApple')}</Text>
            </TouchableOpacity>
          </View>
          {/* Login link juste sous la card */}
          <View style={styles.bottomLinkWrapper}>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.createAccountText}>{t('auth.register.haveAccount')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
} 
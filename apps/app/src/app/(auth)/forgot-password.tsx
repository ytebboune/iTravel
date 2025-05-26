import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import COLORS from '../../theme/colors';
import { AuthHeader, AuthDivider } from './_layout';
import { getAuthBackgroundImage } from '../../utils/getAuthBackgroundImage';
import { forgotPassword } from '../../services/authService';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const { t, i18n } = useTranslation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsI18nReady(true);
      });
    }
  }, [i18n]);

  const CARD_WIDTH = isLandscape
    ? Math.min(windowWidth * 0.4, 380)
    : Math.min(windowWidth * 0.92, 380);

  // Validation des champs
  const isFormValid = email.trim().length > 0 && validateEmail(email).isValid;

  const handleSubmit = async () => {
    if (!isFormValid) {
      setError(t('auth.login.errors.emailInvalid'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

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
    loginButton: {
      width: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: 32,
      padding: Math.min(16, windowHeight * 0.02),
      alignItems: 'center',
      marginBottom: Math.min(12, windowHeight * 0.015),
      opacity: isFormValid ? 1 : 0.5,
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: Math.min(18, windowWidth * 0.045),
      fontFamily: 'Inter-Medium',
    },
    info: {
      color: COLORS.primary,
      textAlign: 'center',
      marginTop: 16,
      fontSize: 16,
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 8,
    },
    success: {
      color: COLORS.primary,
      textAlign: 'center',
      marginBottom: 16,
      fontSize: 16,
    },
    description: {
      color: COLORS.text,
      textAlign: 'center',
      marginBottom: 24,
      fontSize: 16,
      opacity: 0.8,
    },
    bottomLinkWrapper: {
      // ... existing code ...
    },
  });

  if (!isI18nReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LanguageSelector />
      <View style={styles.container}>
        {/* Background image */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={getAuthBackgroundImage(windowWidth, windowHeight)}
            style={styles.background}
          />
        </View>
        {/* Header */}
        <AuthHeader 
          subtitle={t('auth.forgotPassword.title')} 
          showBackButton={true}
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
                {!sent ? (
                  <>
                    <Text style={styles.description}>
                      {t('auth.forgotPassword.desc')}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.forgotPassword.email')}
                      placeholderTextColor={COLORS.placeholder}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!loading}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                    {error ? (
                      <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{error}</Text>
                    ) : null}
                    <TouchableOpacity 
                      style={styles.loginButton} 
                      onPress={handleSubmit}
                      disabled={loading || !isFormValid}
                    >
                      {loading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                          <Text style={styles.loginButtonText}>{t('auth.forgotPassword.loading')}</Text>
                        </View>
                      ) : (
                        <Text style={styles.loginButtonText}>{t('auth.forgotPassword.submit')}</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.info}>{t('auth.forgotPassword.success')}</Text>
                    <TouchableOpacity 
                      style={[styles.loginButton, { marginTop: 16 }]} 
                      onPress={() => router.replace('/(auth)/login')}
                    >
                      <Text style={styles.loginButtonText}>{t('auth.forgotPassword.backToLogin')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
} 
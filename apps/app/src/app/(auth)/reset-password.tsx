import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, useWindowDimensions, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthHeader, AuthDivider } from './_layout';
import COLORS from '../../theme/colors';
import { resetPassword } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';
import { getAuthBackgroundImage } from '../../utils/getAuthBackgroundImage';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string;
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const isDesktopStandard = windowWidth >= 1280;

  const CARD_WIDTH = isLandscape
    ? Math.min(windowWidth * 0.4, 380)
    : Math.min(windowWidth * 0.92, 380);

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
    button: {
      width: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
      alignSelf: 'stretch',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    error: {
      color: 'red',
      marginBottom: 8,
      textAlign: 'center',
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
      width: '100%',
      alignItems: 'center',
      marginTop: 18,
      paddingBottom: Platform.select({
        ios: 20,
        android: 16,
        default: 20,
      }),
    },
    backToLoginText: {
      color: COLORS.primary,
      fontSize: 18,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
  });

  const handleSubmit = async () => {
    setError('');
    if (!password || password.length < 8) {
      setError(t('auth.reset.errorLength') || 'Le mot de passe doit faire au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.reset.errorMatch') || 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      console.log('Reset password response:', res);
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        setSuccess(true);
      } else {
        console.error('Unexpected status:', res.status);
        setError(t('auth.reset.error') || 'Erreur lors de la réinitialisation.');
      }
    } catch (e) {
      console.error('Reset password error:', e);
      setError(t('auth.reset.error') || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LanguageSelector />
      <View style={styles.container}>
        <Image
          source={getAuthBackgroundImage(windowWidth, windowHeight)}
          style={styles.background}
          resizeMode="cover"
        />
        <AuthHeader 
          subtitle={t('auth.reset.title')} 
          showBackButton={true}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.cardWrapper}
        >
          <View style={styles.card}>
            {success ? (
              <>
                <Text style={styles.success}>{t('auth.reset.success')}</Text>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={() => router.replace('/(auth)/login')}
                >
                  <Text style={styles.buttonText}>{t('auth.reset.backToLogin')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.description}>
                  {t('auth.reset.desc')}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.reset.password')}
                  placeholderTextColor={COLORS.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />
                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.input}
                  placeholder={t('auth.reset.confirm')}
                  placeholderTextColor={COLORS.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? t('auth.reset.loading') : t('auth.reset.submit')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
} 
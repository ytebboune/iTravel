import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import COLORS from '../../theme/colors';
import { AuthHeader, AuthDivider } from './_layout';
import { getAuthBackgroundImage } from '../../utils/getAuthBackgroundImage';
import { forgotPassword } from '../../services/authService';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const CARD_WIDTH = isLandscape
    ? Math.min(windowWidth * 0.4, 380)
    : Math.min(windowWidth * 0.92, 380);

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
  });

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.ok) {
        setSent(true);
      } else {
        setError(t('auth.forgot.error') || 'Erreur lors de la demande.');
      }
    } catch (e) {
      setError(t('auth.forgot.error') || 'Erreur lors de la demande.');
    } finally {
      setLoading(false);
    }
  };

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
        <AuthHeader subtitle={t('auth.forgot.title') || 'Mot de passe oublié'} showBackButton={true} />
        {/* Card centering wrapper */}
        <View style={styles.centerWrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.cardWrapper}
          >
            <View style={styles.cardOuter}>
              <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
              <View style={styles.cardContent}>
                {sent ? (
                  <Text style={styles.info}>{t('auth.forgot.sent') || 'Si cet email existe, un lien de réinitialisation a été envoyé.'}</Text>
                ) : (
                  <>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 20,
                        marginTop: 4,
                        fontFamily: 'Inter-Medium',
                        fontSize: Math.min(18, windowWidth * 0.05),
                        color: 'rgba(34,46,58,0.7)',
                        textShadowColor: 'rgba(0,0,0,0.06)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                        maxWidth: 340,
                        alignSelf: 'center',
                      }}
                    >
                      {t('auth.forgot.desc')}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.forgot.email') || 'Adresse email'}
                      placeholderTextColor={COLORS.placeholder}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={loading || !email}>
                      <Text style={styles.loginButtonText}>{loading ? t('auth.forgot.loading') || 'Envoi...' : t('auth.forgot.submit') || 'Envoyer'}</Text>
                    </TouchableOpacity>
                    <AuthDivider />
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                      <Text style={{ color: 'rgba(34,46,58,0.7)', fontWeight: '600', fontSize: Math.min(15, windowWidth * 0.038), fontFamily: 'Inter-Medium', textAlign: 'center' }}>{t('auth.forgot.back')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
} 
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { AuthHeader } from './_layout';
import COLORS from '../../theme/colors';
import { resetPassword } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.token as string;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    input: {
      width: '100%',
      backgroundColor: COLORS.background,
      borderRadius: 18,
      padding: 16,
      fontSize: 16,
      marginBottom: 16,
      borderWidth: 0,
      color: COLORS.text,
    },
    button: {
      width: '100%',
      backgroundColor: COLORS.primary,
      borderRadius: 32,
      padding: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 18,
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
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(t('auth.reset.error') || 'Erreur lors de la réinitialisation.');
      }
    } catch (e) {
      setError(t('auth.reset.error') || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LanguageSelector />
      <View style={styles.container}>
        <AuthHeader subtitle={t('auth.reset.title') || 'Nouveau mot de passe'} showBackButton={true} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.card}>
            {success ? (
              <Text style={styles.info}>{t('auth.reset.success') || 'Votre mot de passe a bien été réinitialisé.'}</Text>
            ) : (
              <>
                <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                  {t('auth.reset.desc') || 'Choisissez un nouveau mot de passe.'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.reset.password') || 'Nouveau mot de passe'}
                  placeholderTextColor={COLORS.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.reset.confirm') || 'Confirmer le mot de passe'}
                  placeholderTextColor={COLORS.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? t('auth.reset.loading') || 'Envoi...' : t('auth.reset.submit') || 'Réinitialiser'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
} 
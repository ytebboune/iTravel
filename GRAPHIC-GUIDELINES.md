# 🎨 Charte graphique iTravel — prompt complet pour Cursor/ChatGPT

**Utilise strictement la charte graphique suivante pour tous les écrans, composants, boutons, cartes, textes, etc. de l'app iTravel :**

## Palette de couleurs

- Primaire : #00897B (vert action principal)
- Primaire Dark : #00695C (vert foncé pour hover/accent)
- Primaire Light : #2D9560 (vert doux pour logo/accents)
- Secondaire : #FFA94D (orange doux pour accents/survols)
- Secondaire Dark : #FF7F11 (orange plus soutenu)
- Accent : #FFD580 (jaune pastel pour petits accents)
- Fond : rgba(255,255,255,0.92) (fond des inputs - glass)
- Surface : rgba(255,255,255,0.7) (fond des cards - glass)
- Texte : #222E3A (texte principal - gris bleuté foncé)
- Texte Light : #FFFFFF (texte sur fond foncé/coloré)
- Or : #E0B97B (ligne séparateur - beige/orangé)
- Or Text : #B88A44 (texte "OR" - marron doré)
- Forgot : #00897B (lien action)
- Create Account : #FFFFFF (lien bas de page)
- Placeholder : #A9A9A9 (placeholder inputs)
- Border : rgba(0,0,0,0.07) (bordures très discrètes)
- Bird Brown : #8B5C2A (marron doré plus clair - ailes oiseau)

> **Utilise ces couleurs comme tokens Tailwind et respecte-les dans tous les styles.**

---

## Typographie

- Font principale : `Manrope` ou `Inter` (Google Fonts)
- Fallback : `sans-serif`
- Hiérarchie :
    - Titre principal (H1) : 32px, Bold
    - Sous-titre (H2) : 24px, SemiBold
    - Sous-titre (H3) : 20px, Medium
    - Texte principal : 16px, Regular
    - Texte secondaire/caption : 13px

---

## Icônes

- Style : linéaires, arrondis, modernes
- Utilise Lucide, Heroicons ou Feather (importables sur web/mobile)
- Icônes à placer sur boutons, navigation, badges, empty states, alertes

---

## Boutons

- **Bouton principal :**
    - Fond `primary` (#00897B), texte blanc, radius 32px, font Inter-Medium 600, padding horizontal 16px
    - Effet hover/focus (`primaryDark`), effet ripple ou opacity sur mobile
    - Hauteur minimale 56px pour une meilleure accessibilité
- **Bouton secondaire :**
    - Fond `surface` (glass), bordure fine `border`, texte `text`, radius 14px, font Inter 600
    - Icône à gauche du texte (Google, Apple, etc.)
- **Désactivé :**
    - Opacité 0.5, interaction bloquée
- **Icon button :**
    - Icône centrée, fond transparent, taille 24px
    - Utilisé pour les actions de visibilité (œil) dans les champs de mot de passe

---

## Inputs & Champs

- Fond `background` (glass), pas de bordure, radius 18px
- Hauteur fixe 56px, padding 16px
- Police Inter 16px, couleur `text`
- Placeholder en `placeholder` (#A9A9A9)
- Icône de visibilité (œil) en suffixe, couleur `placeholder`
- Message d'erreur en rouge sous le champ
- Support du clavier adapté (email, password, etc.)
- Auto-capitalization désactivée pour email/username
- Return key adaptée au contexte (next, done, etc.)

---

## Cards & Surfaces

- Fond `surface` (glass), radius 24px
- Padding vertical adaptatif (24px ou 3% de la hauteur de l'écran)
- Padding horizontal adaptatif (18px ou 4% de la largeur de l'écran)
- Shadow doux (#000, opacité 12%, radius 16px, offset y: 8px)
- Utilisées pour : formulaires d'authentification, cartes de voyage, profils

## Badges

- Forme : arrondie (radius max), padding horizontal 16–20px
- Couleurs :
    - Success : `#27AE60`
    - Error : `#EB5757`
    - Alert : `#FFD66B`
    - Status : `primary`, `secondary`, `accent` selon contexte
- Texte en blanc ou foncé selon contraste

## Avatars

- Forme : cercle, taille 40–48px
- Fond `accent`, initiales ou photo, mini-bordure si actif

## Navigation & Tabs

- Tabs arrondis, fond `surface`, active en `primary`
- Bottom bar mobile : icônes et labels, item actif en `primary`
- Drawer : fond `surface`, texte `text`

## Animation & Micro-interactions

- Transitions douces (0.15s–0.25s), hover/focus/press visibles
- Feedback visuel immédiat (snackbar, toast, checkmark, badge animé)
- Loader : animation style voyage (valise, boussole, carte)

## Responsive & Mobile

- UI pensée mobile-first, paddings 16–24px, radius marqués
- Tous les composants doivent être parfaitement responsive et tactiles
- Touch targets >44px
- Layout flexible (colonne sur mobile, grille sur desktop)

## Accessibilité

- Contraste AA min (boutons, textes, surfaces)
- Police min 16px
- Focus visible sur tous les inputs/boutons
- Labels et aria-labels partout

## Dark Mode

- Palette dédiée (voir ci-dessus), switch automatique selon préférence système
- Textes, icônes, ombres adaptés pour fond sombre

## Exemples d'utilisation :

### Bouton principal

```tsx
<Button
  backgroundColor="$primary"
  color="$textLight"
  borderRadius={32}
  fontWeight="600"
  fontSize={18}
  paddingHorizontal={16}
  paddingVertical={16}
  height={56}
  hoverStyle={{ backgroundColor: "$primaryDark" }}
>
  Créer un projet
</Button>
```

### Input

```tsx
<TextInput
  style={{
    width: '100%',
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
    color: COLORS.text,
  }}
  placeholder="Email"
  placeholderTextColor={COLORS.placeholder}
  autoCapitalize="none"
  keyboardType="email-address"
/>
```
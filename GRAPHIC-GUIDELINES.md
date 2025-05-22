# 🎨 Charte graphique iTravel — prompt complet pour Cursor/ChatGPT

**Utilise strictement la charte graphique suivante pour tous les écrans, composants, boutons, cartes, textes, etc. de l’app iTravel :**

## Palette de couleurs

- Primaire : #33B9CB (clair), #1C7289 (dark)
- Secondaire : #FFA561 (clair), #E26218 (dark)
- Accent : #80CFA9, #2D9560
- Fond : #F7FAFC (clair), #222E3A (dark)
- Surface : #FFFFFF, #273043
- Texte : #222E3A, #F7FAFC
- Success : #27AE60, #15803D
- Error : #EB5757, #A31232
- Alert : #FFD66B, #B19500
- Disabled : #D1D5DB, #3C4A5C

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
    - Fond `primary`, texte blanc, radius 16–20px, font SemiBold, padding horizontal généreux (24px min)
    - Effet hover/focus (`secondary`), effet ripple ou opacity sur mobile
- **Bouton secondaire :**
    - Bordure et texte `secondary`, fond blanc, radius identique, font SemiBold
- **Désactivé :**
    - Fond `disabled`, texte `#888`, interaction bloquée
- **Icon button :**
    - Icône centrée, fond `surface` ou transparent, bordure radius max

---

## Inputs & Champs

- Fond clair `#F7FAFC` ou `surface`, bordure fine `primary` ou `disabled`
- Radius 12–16px, placeholder `accent`
- Label visible, message d’erreur sous le champ en rouge
- Icône d’aide/visibilité en suffixe

---

## Cards & Surfaces

- Fond `surface`, radius 20px, padding 20–32px
- Shadow doux (#000, opacité <8%), marge extérieure 16px min
- Utilisées pour : projet, hébergement, transport, activités, dépenses, messages chat

---

## Badges

- Forme : arrondie (radius max), padding horizontal 16–20px
- Couleurs :
    - Success : `#27AE60`
    - Error : `#EB5757`
    - Alert : `#FFD66B`
    - Status : `primary`, `secondary`, `accent` selon contexte
- Texte en blanc ou foncé selon contraste

---

## Avatars

- Forme : cercle, taille 40–48px
- Fond `accent`, initiales ou photo, mini-bordure si actif

---

## Navigation & Tabs

- Tabs arrondis, fond `surface`, active en `primary`
- Bottom bar mobile : icônes et labels, item actif en `primary`
- Drawer : fond `surface`, texte `text`

---

## Animation & Micro-interactions

- Transitions douces (0.15s–0.25s), hover/focus/press visibles
- Feedback visuel immédiat (snackbar, toast, checkmark, badge animé)
- Loader : animation style voyage (valise, boussole, carte)

---

## Responsive & Mobile

- UI pensée mobile-first, paddings 16–24px, radius marqués
- Tous les composants doivent être parfaitement responsive et tactiles
- Touch targets >44px
- Layout flexible (colonne sur mobile, grille sur desktop)

---

## Accessibilité

- Contraste AA min (boutons, textes, surfaces)
- Police min 16px
- Focus visible sur tous les inputs/boutons
- Labels et aria-labels partout

---

## Dark Mode

- Palette dédiée (voir ci-dessus), switch automatique selon préférence système
- Textes, icônes, ombres adaptés pour fond sombre

---

## Exemples d’utilisation :

### Bouton principal

```tsx
<Button
  backgroundColor="$primary"
  color="$text"
  borderRadius={16}
  fontWeight="600"
  fontSize={18}
  paddingHorizontal={24}
  paddingVertical={12}
  hoverStyle={{ backgroundColor: "$secondary" }}
>
  Créer un projet
</Button>

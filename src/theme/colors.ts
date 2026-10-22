// Waya Brand Colors & Design System Tokens
// Rooted in African Aesthetics: Deep forest greens, warm cream/ivory, terracotta, and gold

export const Colors = {
  light: {
    // Primary Brand
    primary: '#0C3823', // Deep Forest Green (Trust, Growth, African landscape)
    primaryLight: '#185B3C',
    primaryDark: '#072416',
    primaryContainer: '#E8F5EE',

    // Cultural Accents
    accent: '#C8522C', // Terracotta / Burnt Orange (Warm earth, pottery, Ankara warmth)
    accentLight: '#E06D46',
    accentDark: '#99391A',
    accentContainer: '#FCEFEA',

    // Highlight & Action
    gold: '#F5B731', // Golden Yellow (Nigerian sunshine, wealth, vitality)
    goldLight: '#FBD46E',
    goldDark: '#C98F15',
    goldContainer: '#FEF8E7',

    // Afro-Futuristic High-tech Glows
    glowGreen: '#00E676',
    glowCyan: '#00E5FF',
    glowGold: '#FFD700',

    // Backgrounds
    background: '#FAF6EF', // Warm Cream / Ivory
    surface: '#FFFFFF',
    surfaceSubtle: '#F4EFE6',
    surfaceElevated: '#FFFFFF',

    // Text & Surfaces
    textPrimary: '#151917', // Deep Charcoal
    textSecondary: '#5C6560',
    textMuted: '#8E9993',
    textInverse: '#FFFFFF',

    // Borders & Dividers
    border: '#E8E1D5',
    borderFocus: '#0C3823',
    divider: '#EEE7DC',

    // Status Colors
    success: '#13864D',
    successBg: '#EAF8F0',
    warning: '#D97706',
    warningBg: '#FEF3C7',
    error: '#D32F2F',
    errorBg: '#FDF2F2',
    info: '#0284C7',
    infoBg: '#E0F2FE',

    // Card & Shadow
    cardShadow: 'rgba(12, 56, 35, 0.08)',
    bottomSheetBg: '#FFFFFF',
    backdrop: 'rgba(12, 28, 20, 0.6)',
  },
  dark: {
    // Primary Brand in Dark Mode
    primary: '#1ED77E', // Glowing Forest Jade
    primaryLight: '#3BE698',
    primaryDark: '#0F7845',
    primaryContainer: '#123122',

    // Cultural Accents
    accent: '#FF7043', // Vibrant Terracotta
    accentLight: '#FF8A65',
    accentDark: '#D84315',
    accentContainer: '#381A12',

    // Highlight & Action
    gold: '#FFCA28', // Radiant Gold
    goldLight: '#FFE082',
    goldDark: '#FFA000',
    goldContainer: '#3B3010',

    // Afro-Futuristic Glows
    glowGreen: '#00FF88',
    glowCyan: '#26E6FF',
    glowGold: '#FFDF00',

    // Backgrounds
    background: '#0B110E', // Obsidian Earth
    surface: '#131B16',
    surfaceSubtle: '#1A251F',
    surfaceElevated: '#212E27',

    // Text & Surfaces
    textPrimary: '#F5F7F6',
    textSecondary: '#A2ABA6',
    textMuted: '#68736E',
    textInverse: '#0B110E',

    // Borders & Dividers
    border: '#25352C',
    borderFocus: '#1ED77E',
    divider: '#1E2A23',

    // Status Colors
    success: '#22C55E',
    successBg: '#0F2F1C',
    warning: '#F59E0B',
    warningBg: '#342306',
    error: '#EF4444',
    errorBg: '#361111',
    info: '#38BDF8',
    infoBg: '#0C2A3D',

    // Card & Shadow
    cardShadow: 'rgba(0, 0, 0, 0.45)',
    bottomSheetBg: '#131B16',
    backdrop: 'rgba(0, 0, 0, 0.8)',
  },
};

export type ThemeColors = typeof Colors.light;

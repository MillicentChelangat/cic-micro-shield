/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#17202A',
    tint: '#D2232A',

    // Core surfaces
    background: '#F7F4EF',
    foreground: '#17202A',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#17202A',

    // Primary action color (buttons, links, active states)
    primary: '#D2232A',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#F1EDE6',
    secondaryForeground: '#17202A',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#E8E2D9',
    mutedForeground: '#6D756F',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FDB913',
    accentForeground: '#17202A',

    // Destructive actions (delete, error states)
    destructive: '#B4232A',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#DED8CF',
    input: '#D4CDC2',
    navy: '#17202A',
    inkSoft: '#46504B',
    success: '#2A8B68',
    warning: '#B87900',
    successSoft: '#E4F2EC',
    warningSoft: '#FFF3D6',
    dangerSoft: '#FDE8E8',
    gold: '#FDB913',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 16,
};

export default colors;

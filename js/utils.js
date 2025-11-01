function generateColorPalette(count) {
  const base = [
    '#ff595e', '#1982c4', '#ffca3a', '#8ac926', '#6a4c93',
    '#00a896', '#f9844a', '#577590', '#ff6f91', '#1f8efd',
    '#ffd166', '#118ab2', '#ef476f', '#06d6a0', '#073b4c',
    '#ff9f1c', '#2ec4b6', '#e71d36', '#4a4e69', '#9a031e'
  ];

  if (count <= base.length) return base.slice(0, count);

  const colors = [...base];
  for (let i = base.length; i < count; i++) {
    const reference = base[i % base.length];
    const [r, g, b] = hexToRgb(reference);
    const factor = 0.85 + 0.15 * ((i - base.length) % 2);
    colors.push(rgbToHex(r * factor, g * factor, b * factor));
  }
  return colors;
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function decideWinningSlot(slotLabels) {
  const index = Math.floor(Math.random() * slotLabels.length);
  return { index, label: slotLabels[index] };
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

window.Utils = { generateColorPalette, decideWinningSlot, mapRange, easeOutCubic };

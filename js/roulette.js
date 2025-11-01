// 角度はラジアン。画面上部を 0 度基準にする。
(function () {
  const PALETTE = window.Utils.generateColorPalette(20);

  function drawRoulette(canvas, slotLabels) {
    const slotCount = slotLabels.length;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 20;
    const anglePer = (2 * Math.PI) / slotCount;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments with gradient and gloss effect
    for (let i = 0; i < slotCount; i++) {
      const start = i * anglePer - Math.PI / 2;
      const end = start + anglePer;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();

      const label = slotLabels[i];
      const fillColor = PALETTE[(label - 1) % PALETTE.length];

      // Create radial gradient for glossy effect
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(0.7, fillColor);
      gradient.addColorStop(1, shadeColor(fillColor, -20));

      ctx.fillStyle = gradient;
      ctx.fill();

      // Gold borders
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Add subtle highlight
      ctx.save();
      ctx.globalAlpha = 0.15;
      const highlightGradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
      highlightGradient.addColorStop(0, '#ffffff');
      highlightGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = highlightGradient;
      ctx.fill();
      ctx.restore();
    }

    // Draw gold outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Inner gold ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#f4d03f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Outer decorative ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, 2 * Math.PI);
    ctx.strokeStyle = '#b8942c';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw numbers
    for (let i = 0; i < slotCount; i++) {
      const start = i * anglePer - Math.PI / 2;
      const textAngle = start + anglePer / 2;
      const tx = cx + Math.cos(textAngle) * (radius * 0.7);
      const ty = cy + Math.sin(textAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(textAngle + Math.PI / 2);

      // Gold text shadow
      ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(slotLabels[i]), 0, 0);
      ctx.restore();
    }

    // Draw center medallion
    const medallionRadius = radius * 0.15;

    // Outer gold circle
    const medallionGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, medallionRadius);
    medallionGradient.addColorStop(0, '#f4d03f');
    medallionGradient.addColorStop(0.5, '#d4af37');
    medallionGradient.addColorStop(1, '#b8942c');

    ctx.beginPath();
    ctx.arc(cx, cy, medallionRadius, 0, 2 * Math.PI);
    ctx.fillStyle = medallionGradient;
    ctx.fill();

    // Medallion border
    ctx.strokeStyle = '#8b7320';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, medallionRadius * 0.7, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center highlight
    ctx.beginPath();
    ctx.arc(cx, cy, medallionRadius * 0.3, 0, 2 * Math.PI);
    const centerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, medallionRadius * 0.3);
    centerGradient.addColorStop(0, 'rgba(244, 208, 63, 0.6)');
    centerGradient.addColorStop(1, 'rgba(212, 175, 55, 0.2)');
    ctx.fillStyle = centerGradient;
    ctx.fill();
  }

  // Helper function to darken/lighten colors
  function shadeColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  window.Roulette = { drawRoulette };
})();

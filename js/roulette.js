<<<<<<< Updated upstream
// 角度はラジアン。画面上部を 0 度基準にする。
(function () {
  const PALETTE = window.Utils.generateColorPalette(20);

  function drawRoulette(canvas, slotLabels) {
    const slotCount = slotLabels.length;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 12;
    const anglePer = (2 * Math.PI) / slotCount;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < slotCount; i++) {
      const start = i * anglePer - Math.PI / 2;
      const end = start + anglePer;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();

      const label = slotLabels[i];
      // Map identical labels (even duplicated) to the same color.
      const fillColor = PALETTE[(label - 1) % PALETTE.length];
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const textAngle = start + anglePer / 2;
      const tx = cx + Math.cos(textAngle) * (radius * 0.7);
      const ty = cy + Math.sin(textAngle) * (radius * 0.7);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(slotLabels[i]), 0, 0);
      ctx.restore();
    }
  }

  window.Roulette = { drawRoulette };
})();
=======
// 角度はラジアン。画面上部を 0 度基準にする。
(function () {
  const PALETTE = window.Utils.generateColorPalette(20);

  function drawRoulette(canvas, slotLabels) {
    const slotCount = slotLabels.length;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 12;
    const anglePer = (2 * Math.PI) / slotCount;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < slotCount; i++) {
      const start = i * anglePer - Math.PI / 2;
      const end = start + anglePer;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();

      const label = slotLabels[i];
      // Map identical labels (even duplicated) to the same color.
      const fillColor = PALETTE[(label - 1) % PALETTE.length];
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const textAngle = start + anglePer / 2;
      const tx = cx + Math.cos(textAngle) * (radius * 0.7);
      const ty = cy + Math.sin(textAngle) * (radius * 0.7);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(slotLabels[i]), 0, 0);
      ctx.restore();
    }
  }

  window.Roulette = { drawRoulette };
})();
>>>>>>> Stashed changes

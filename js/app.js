(function () {
  const SLOT_EXPANSION_RULES = {
    2: 10,
    3: 12,
    4: 16,
    5: 15,
    6: 12,
    7: 14,
    8: 16,
    9: 18
  };

  const canvas = document.getElementById('roulette-canvas');
  const selectEl = document.getElementById('slot-count');
  const resultEl = document.getElementById('result-text');
  const spinBtn = document.getElementById('spin-button');

  let isSpinning = false;
  let baseSlotCount = 4;
  let slots = buildSlots(baseSlotCount);
  let currentRotation = 0;
  let pointerStart = null;

  function buildSlots(baseCount) {
    const expandedCount = SLOT_EXPANSION_RULES[baseCount] || baseCount;
    const labels = Array.from({ length: expandedCount }, (_, idx) => (idx % baseCount) + 1);
    return { baseCount, expandedCount, labels };
  }

  function setupCanvasSize() {
    const size = canvas.clientWidth || canvas.parentElement.clientWidth;
    const pxSize = Math.max(1, Math.floor(size));
    if (canvas.width !== pxSize || canvas.height !== pxSize) {
      canvas.width = pxSize;
      canvas.height = pxSize;
    }
  }

  function setRotation(deg) {
    currentRotation = deg;
    canvas.style.transform = `rotate(${deg}deg)`;
  }

  function drawWheel() {
    window.Roulette.drawRoulette(canvas, slots.labels);
    setRotation(currentRotation);
  }

  function resetResult() {
    resultEl.textContent = 'ルーレットを回してください';
  }

  function populateSelect() {
    for (let i = 2; i <= 20; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${i}枠`;
      if (i === baseSlotCount) opt.selected = true;
      selectEl.appendChild(opt);
    }
  }

  function computeOffset(segmentCount, index) {
    const anglePer = 360 / segmentCount;
    return ((90 - anglePer * (index + 0.5)) % 360 + 360) % 360;
  }

  function performSpin(durationMs, spins) {
    if (isSpinning) return;
    isSpinning = true;
    selectEl.disabled = true;
    spinBtn.disabled = true;

    const { index: winningIndex, label: winningLabel } = window.Utils.decideWinningSlot(slots.labels);
    const offset = computeOffset(slots.labels.length, winningIndex);
    const startRotation = currentRotation;
    const normalizedStart = ((startRotation % 360) + 360) % 360;
    const deltaToOffset = ((offset - normalizedStart) + 360) % 360;
    const finalRotation = startRotation + spins * 360 + deltaToOffset;
    const startTime = performance.now();

    function frame(ts) {
      const elapsed = ts - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = window.Utils.easeOutCubic(progress);
      const rotation = startRotation + (finalRotation - startRotation) * eased;
      setRotation(rotation);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        // アニメーション完了時は、最後のフレームのrotationをそのまま使用
        // 正規化は0-360度の範囲に収めるためのみ
        currentRotation = ((rotation % 360) + 360) % 360;
        setRotation(currentRotation);
        onSpinComplete(winningLabel);
      }
    }

    requestAnimationFrame(frame);
  }

  function onSpinComplete(label) {
    isSpinning = false;
    selectEl.disabled = false;
    spinBtn.disabled = false;
    resultEl.textContent = `当選: ${label}`;
  }

  selectEl.addEventListener('change', (e) => {
    if (isSpinning) return;
    baseSlotCount = parseInt(e.target.value, 10);
    slots = buildSlots(baseSlotCount);
    currentRotation = 0;
    setupCanvasSize();
    drawWheel();
    resetResult();
  });

  spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    const duration = 5000 + Math.random() * 15000;
    const spins = 5 + Math.random() * 3;
    performSpin(duration, spins);
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (isSpinning) return;
    pointerStart = { y: e.clientY, time: performance.now() };
  }, { passive: true });

  canvas.addEventListener('pointerup', (e) => {
    if (isSpinning || !pointerStart) return;
    const distance = Math.abs(e.clientY - pointerStart.y);
    const duration = Math.max(1, performance.now() - pointerStart.time);
    const velocity = distance / duration;
    const MIN_V = 0.2;
    const MAX_V = 2.5;
    const clampedV = Math.max(MIN_V, Math.min(MAX_V, velocity));
    const spinMs = window.Utils.mapRange(clampedV, MIN_V, MAX_V, 20000, 5000);
    const spins = window.Utils.mapRange(clampedV, MIN_V, MAX_V, 5, 8);
    pointerStart = null;
    performSpin(spinMs, spins);
  }, { passive: true });

  canvas.addEventListener('pointercancel', () => {
    pointerStart = null;
  });

  populateSelect();
  setupCanvasSize();
  drawWheel();
  resetResult();

  window.addEventListener('resize', () => {
    setupCanvasSize();
    drawWheel();
  });
})();

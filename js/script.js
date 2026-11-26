(function () {
    const STORAGE_KEY = 'gralgunea_a11y_v1';
    const DEFAULT_STATE = {
        theme: 'dark',
        fontScale: 1,
        highContrast: false,
        colorblind: 'none'
    };

    const MIN_SCALE = 0.85;
    const MAX_SCALE = 1.45;
    const STEP_SCALE = 0.1;

    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');
    const fontDecBtn = document.getElementById('btn-font-dec');
    const fontResetBtn = document.getElementById('btn-font-reset');
    const fontIncBtn = document.getElementById('btn-font-inc');
    const contrastBtn = document.getElementById('btn-contrast-toggle');
    const colorblindSelect = document.getElementById('select-colorblind');
    const resetAllBtn = document.getElementById('btn-a11y-reset');

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...DEFAULT_STATE };
            return { ...DEFAULT_STATE, ...JSON.parse(raw) };
        } catch (_) {
            return { ...DEFAULT_STATE };
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (_) {
            // Ignorar localStorage errorea
        }
    }

    let state = loadState();

    function applyState() {
        // 1. Modu argia / iluna
        htmlEl.setAttribute('data-bs-theme', state.theme === 'dark' ? 'dark' : 'light');
        if (themeIcon && themeLabel) {
            if (state.theme === 'dark') {
                themeIcon.textContent = '☀️';
                themeLabel.textContent = 'Modu argia';
            } else {
                themeIcon.textContent = '🌙';
                themeLabel.textContent = 'Modu iluna';
            }
        }

        // 2. Letra tamaina
        const cleanScale = Number(state.fontScale.toFixed(2));
        htmlEl.style.setProperty('--font-scale', cleanScale);
        htmlEl.classList.toggle('a11y-font-large', cleanScale >= 1.2);

        // 3. Kontraste handia
        htmlEl.classList.toggle('a11y-high-contrast', Boolean(state.highContrast));
        if (contrastBtn) {
            contrastBtn.setAttribute('aria-pressed', String(Boolean(state.highContrast)));
            contrastBtn.classList.toggle('active', Boolean(state.highContrast));
            contrastBtn.textContent = state.highContrast
                ? '✓ Kontraste altua aktibo'
                : '◐ Kontraste handia';
        }

        // 4. Daltonismo mota
        htmlEl.classList.remove(
            'a11y-vision-protanopia',
            'a11y-vision-deuteranopia',
            'a11y-vision-tritanopia'
        );
        if (['protanopia', 'deuteranopia', 'tritanopia'].includes(state.colorblind)) {
            htmlEl.classList.add(`a11y-vision-${state.colorblind}`);
        }
        if (colorblindSelect) {
            colorblindSelect.value = state.colorblind;
        }

        saveState(state);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            applyState();
        });
    }

    if (fontDecBtn) {
        fontDecBtn.addEventListener('click', () => {
            state.fontScale = Math.max(MIN_SCALE, state.fontScale - STEP_SCALE);
            applyState();
        });
    }

    if (fontResetBtn) {
        fontResetBtn.addEventListener('click', () => {
            state.fontScale = 1;
            applyState();
        });
    }

    if (fontIncBtn) {
        fontIncBtn.addEventListener('click', () => {
            state.fontScale = Math.min(MAX_SCALE, state.fontScale + STEP_SCALE);
            applyState();
        });
    }

    if (contrastBtn) {
        contrastBtn.addEventListener('click', () => {
            state.highContrast = !state.highContrast;
            applyState();
        });
    }

    if (colorblindSelect) {
        colorblindSelect.addEventListener('change', (e) => {
            state.colorblind = e.target.value;
            applyState();
        });
    }

    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            state = { ...DEFAULT_STATE };
            applyState();
        });
    }

    applyState();
})();
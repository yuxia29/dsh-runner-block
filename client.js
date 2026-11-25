window.__ModuleLoader__.load({
  id: 'dsh-huakuai',
  factory(require) {
    const { createElement: h, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } = require('react');
    const { createPortal } = require('react-dom');
    const slot = 'conversation.input.model';
    const optionsSlot = 'conversation.input.model.options';
    const caption = new Map([['off', 'Off'], ['low', 'Low'], ['high', 'High'], ['max', 'Max']]);
    const effortOrder = [...caption.keys()];
    const nativeProviders = new Map([
      ['deepseek-account', { label: 'DeepSeek 账号', order: 0 }],
      ['deepseek-official', { label: 'DeepSeek API', order: 1 }],
    ]);
    const rangeKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);
    const thumbSize = 31;
    const progressProperty = '--dsh-hk-progress';
    const maxNotice = '消耗额度更快';

    function isTrusted(event) {
      return event.nativeEvent?.isTrusted === true;
    }

    function anchorNameFor(id) {
      return `--dsh-hk-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    }

    const styles = `
      @property --dsh-hk-progress {
        syntax:"<number>";
        inherits:true;
        initial-value:0;
      }
      .dsh-hk {
        --hk-fg:var(--dsw-alias-label-primary,#1a263b);
        --hk-muted:var(--dsw-alias-label-secondary,#53617a);
        --hk-panel:var(--dsw-alias-bg-layer-2,#f7f9fe);
        --hk-edge:var(--dsw-alias-border-l2,#d9e0ef);
        --hk-focus:var(--dsw-focus-ring-color,#5382df);
        --hk-max-text:#7b3ecf;
        box-sizing:border-box;
        min-width:0;
        color:var(--hk-fg);
        font:inherit;
      }
      [data-ds-dark-theme] .dsh-hk {--hk-max-text:#c6a3ff}
      .dsh-hk * {box-sizing:border-box}
      .dsh-hk,.dsh-hk *,.dsh-hk *::before,.dsh-hk *::after {corner-shape:round}
      .dsh-hk-seat {position:relative;min-width:0}
      .dsh-hk-popup {
        --hk-popup-width:min(315px,calc(100vw - 24px));
        position:fixed;
        position-anchor:var(--hk-anchor);
        left:clamp(12px,calc(anchor(center,50vw) - var(--hk-popup-width) / 2),calc(100vw - 12px - var(--hk-popup-width)));
        right:auto;
        top:max(12px,var(--dsh-frame-overlay-top,12px));
        bottom:calc(anchor(top) + 8px);
        align-self:safe end;
        z-index:1105;
        margin:0;
        width:var(--hk-popup-width);
        height:max-content;
        max-height:min(390px,calc(100dvh - 28px));
        overflow:auto;
        padding:13px 14px 9px;
        border:1px solid var(--hk-edge);
        border-radius:16px;
        background:var(--hk-panel);
        box-shadow:var(--dsw-elevation-prominent,0 10px 32px #16234524);
        font-family:var(--dsw-font-family,system-ui,sans-serif);
      }
      .dsh-hk-popup[data-view="effort"] {overflow:visible}
      .dsh-hk .dsh-hk-trigger {
        display:flex;
        align-items:center;
        gap:5px;
        min-width:0;
        max-width: min(260px,52vw);
        height:28px;
        padding:0 6px 0 8px;
        border-radius:7px;
        color:var(--hk-muted);
        font-size:13px;
      }
      .dsh-hk-off-anchor {
        position:absolute;
        top:0;
        right:0;
        width:max-content;
        opacity:0;
        pointer-events:none;
      }
      .dsh-hk-trigger[aria-expanded=true] {background:var(--dsw-alias-interactive-bg-hover,#869ac426)}
      .dsh-hk-trigger-name {
        display:var(--dsh-composer-model-text-display,inline);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .dsh-hk-trigger-effort {display:var(--dsh-composer-model-text-display,inline);font-size:12px}
      .dsh-hk-compact {display:var(--dsh-composer-model-icon-display,none)}
      .dsh-hk-expand,.dsh-hk-check {
        display:block;
        flex:none;
        fill:none;
        stroke:currentColor;
        stroke-linecap:round;
        stroke-linejoin:round;
      }
      .dsh-hk-expand {
        width:14px;
        height:14px;
        stroke-width:1;
        color:var(--dsw-alias-label-caption,#939eaf);
      }
      .dsh-hk-check {width:15px;height:15px;stroke-width:1.4}
      .dsh-hk-trigger[aria-expanded=true] .dsh-hk-expand {transform:rotate(180deg)}
      .dsh-hk-model-list {display:grid;gap:3px}
      .dsh-hk-model-heading {
        display:flex;
        align-items:center;
        gap:6px;
        margin:0 0 4px;
        font-size:14px;
        line-height:26px;
        font-weight:600;
        user-select:none;
      }
      .dsh-hk-popup button.dsh-hk-back {
        display:grid;
        place-items:center;
        flex:none;
        width:26px;
        height:26px;
        padding:0;
        border-radius:6px;
      }
      .dsh-hk-back .dsh-hk-expand {transform:rotate(90deg);color:inherit}
      .dsh-hk-model-group {margin:6px 0 1px;padding:0 5px;color:var(--hk-muted);font-size:11px}
      .dsh-hk-model-source-title {
        margin:10px 0 2px;
        padding:0 5px;
        color:var(--hk-fg);
        font-size:12px;
        font-weight:650;
      }
      .dsh-hk-model-list [data-dsh-hk-pick] {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        width:100%;
        padding:6px;
        border-radius:6px;
        text-align:start;
        font-size:13px;
      }
      .dsh-hk-model-list [aria-pressed=true] {background:var(--dsw-alias-interactive-bg-hover,#869ac426)}
      .dsh-hk-model-list span:first-child,.dsh-hk-model-name {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .dsh-hk-empty,.dsh-hk-popup [role=alert] {margin:6px 0;font-size:12px;color:var(--hk-muted)}
      .dsh-hk-popup button.dsh-hk-model-name {
        max-width:100%;
        padding:2px 3px;
        border-radius:4px;
        color:var(--hk-muted);
        font-size:12px;
      }
      .dsh-hk-confirm {
        display:grid;
        gap:6px;
        margin-top:9px;
        padding:8px;
        border:1px solid var(--hk-edge);
        border-radius:7px;
        font-size:12px;
      }
      .dsh-hk-confirm p {margin:0;color:var(--hk-muted)}
      .dsh-hk-confirm-actions {display:flex;justify-content:flex-end;gap:4px}
      .dsh-hk-confirm-actions button {padding:4px 5px;border-radius:4px}
      .dsh-hk button {
        border:0;
        background:transparent;
        color:inherit;
        font:inherit;
        cursor:pointer;
      }
      .dsh-hk button:disabled {cursor:default;opacity:.52}
      .dsh-hk button:hover:not(:disabled) {
        background:var(--dsw-alias-interactive-bg-hover,#869ac426);
      }
      .dsh-hk button:focus-visible,.dsh-hk-rail:has(input:focus-visible) {
        outline:2px solid var(--hk-focus);
        outline-offset:1px;
      }
      .dsh-hk-head {
        display:grid;
        grid-template-columns:28px minmax(0,1fr) 28px;
        align-items:start;
        gap:6px;
        min-height:30px;
      }
      .dsh-hk-value {
        display:block;
        font-size:19px;
        line-height:23px;
        font-weight:650;
      }
      .dsh-hk-meta {grid-area:1/2;min-width:0;text-align:center}
      .dsh-hk-head[data-effort="max"] .dsh-hk-value {color:var(--hk-max-text)}
      .dsh-hk-max-notice {
        --hk-notice-blue:#2549cc;
        --hk-notice-purple:#7342d7;
        display:inline-block;
        color:transparent;
        background:linear-gradient(100deg,var(--hk-notice-blue),var(--hk-notice-purple) 35%,#5d53da 50%,var(--hk-notice-blue) 70%,var(--hk-notice-purple));
        background-size:240% 100%;
        background-clip:text;
        animation:dsh-hk-notice-flow 1.65s ease-in-out infinite alternate;
      }
      [data-ds-dark-theme] .dsh-hk-max-notice {--hk-notice-blue:#87a8ff;--hk-notice-purple:#d4a5ff}
      @keyframes dsh-hk-notice-flow {from {background-position:0 50%} to {background-position:100% 50%}}
      .dsh-hk-announcement {
        position:absolute;
        width:1px;
        height:1px;
        overflow:hidden;
        clip-path:inset(50%);
        white-space:nowrap;
      }
      .dsh-hk button.dsh-hk-restore {
        width:100%;
        min-height:32px;
        padding:4px 8px;
        text-align:start;
        border-radius:6px;
        font-size:13px;
      }
      .dsh-hk-tip-anchor {position:relative;display:inline-flex}
      .dsh-hk-head>.dsh-hk-team {grid-area:1/1;justify-self:start}
      .dsh-hk-head>.dsh-hk-native {grid-area:1/3;justify-self:end}
      .dsh-hk button.dsh-hk-bolt {
        display:grid;
        width:28px;
        height:28px;
        place-items:center;
        border-radius:8px;
        padding:0;
        color:var(--hk-muted);
      }
      .dsh-hk button.dsh-hk-bolt[aria-checked=true] {
        color:var(--hk-max-text);
      }
      .dsh-hk button.dsh-hk-bolt:hover:not(:disabled),.dsh-hk button.dsh-hk-bolt:focus-visible {
        background:var(--dsw-alias-interactive-bg-hover,#869ac426);
      }
      .dsh-hk-bolt svg {width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.65;stroke-linejoin:round}
      .dsh-hk-bolt[aria-checked=true] svg {fill:currentColor}
      .dsh-hk-tip {
        --hk-tip-width:96px;
        display:none;
        position:fixed;
        z-index:5;
        inset:auto auto calc(anchor(top) + 5px) clamp(6px,calc(anchor(center) - var(--hk-tip-width) / 2),calc(100vw - 6px - var(--hk-tip-width)));
        position-try-fallbacks:flip-block;
        width:var(--hk-tip-width);
        padding:7px 10px;
        border:1px solid #ffffff17;
        border-radius:16px;
        background:#1b1e21;
        color:#fff;
        box-shadow:0 6px 18px #0004;
        line-height:1.4;
        white-space:nowrap;
        pointer-events:none;
      }
      .dsh-hk-tip strong,.dsh-hk-tip small {display:block}
      .dsh-hk-tip strong {font-size:13px;font-weight:600}
      .dsh-hk-tip small {color:#b1b1b1;font-size:11px}
      .dsh-hk-native .dsh-hk-tip {--hk-tip-width:104px;text-align:center}
      .dsh-hk-tip-anchor:hover .dsh-hk-tip,.dsh-hk-tip-anchor:has(button:focus-visible) .dsh-hk-tip {display:block}
      .dsh-hk-rail {
        position:relative;
        height:39px;
        margin-top:7px;
        border-radius:20px;
        cursor:grab;
        touch-action:none;
        --hk-thumb-size:${thumbSize}px;
        --hk-thumb-x:calc(11px + (100% - 22px) * var(--dsh-hk-progress));
        --hk-step:calc(var(--dsh-hk-progress) * var(--hk-steps));
        --hk-high-mix:clamp(0,min(
          calc(var(--hk-step) - var(--hk-high-stop) + 1),
          calc(var(--hk-high-stop) - var(--hk-step) + 1)),1);
        --hk-max-mix:clamp(0,min(
          calc(var(--hk-step) - var(--hk-max-stop) + 1),
          calc(var(--hk-max-stop) - var(--hk-step) + 1)),1);
        transition:--dsh-hk-progress 100ms ease-out;
      }
      .dsh-hk-rail::before {
        content:"";
        position:absolute;
        inset:0 calc(11px - var(--hk-thumb-size) / 2);
      }
      .dsh-hk-lane {
        position:absolute;
        inset:5px 0;
        isolation:isolate;
        overflow:hidden;
        border-radius:999px;
        background:var(--hk-edge);
      }
      .dsh-hk-fill {
        position:absolute;
        inset:0 auto 0 0;
        z-index:1;
        width:var(--hk-thumb-x);
        overflow:hidden;
        background:#367ed8;
        opacity:clamp(0,calc(var(--dsh-hk-progress) * 60),1);
      }
      .dsh-hk-fill [data-layer] {position:absolute;inset:0}
      .dsh-hk-fill [data-layer="high"] {
        opacity:var(--hk-high-mix);
        background:linear-gradient(96deg,#2876c9 0%,#4487dd 62%,#5b60be 100%);
      }
      .dsh-hk-fill [data-layer="max"] {
        opacity:var(--hk-max-mix);
        background:radial-gradient(ellipse at 55% 35%,#e3acfa9c,transparent 58%),
          linear-gradient(100deg,#2549cc 0%,#544cdf 29%,#aa6de7 59%,#7446df 81%,#5846d5 100%);
      }
      .dsh-hk-stars {
        position:absolute;
        inset:0;
        overflow:hidden;
      }
      .dsh-hk-star {
        position:absolute;
        top:var(--hk-y);
        inset-inline:0;
        height:var(--hk-size);
        color:#f0faff;
        opacity:var(--hk-opacity);
        animation:dsh-hk-drift var(--hk-duration) var(--hk-delay) infinite linear;
      }
      .dsh-hk-star::before {
        content:"";
        display:block;
        width:var(--hk-size);
        height:100%;
        border-radius:50%;
        corner-shape:round;
        background:currentColor;
      }
      .dsh-hk-fill [data-layer="max"] .dsh-hk-star::before {box-shadow:0 0 4px currentColor}
      .dsh-hk-fill [data-layer="max"]::after {
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(106deg,transparent 30%,#e9deff50 51%,transparent 72%);
        animation:dsh-hk-sheen 3.6s infinite alternate ease-in-out;
      }
      @keyframes dsh-hk-drift {
        from {transform:translateX(-7px)}
        to {transform:translateX(calc(100% + 7px))}
      }
      @keyframes dsh-hk-sheen {from {transform:translateX(-65%)} to {transform:translateX(65%)}}
      .dsh-hk-burst {
        position:absolute;
        top:50%;
        left:calc(11px + (100% - 22px) * var(--hk-max-stop) / var(--hk-steps));
        pointer-events:none;
        z-index:1;
      }
      .dsh-hk-burst i {
        position:absolute;
        width:3px;
        height:3px;
        border-radius:50%;
        background:#9380ee;
        animation:dsh-hk-spark .48s ease-out both;
      }
      @keyframes dsh-hk-spark {
        0% {opacity:0;transform:rotate(var(--hk-angle)) translateX(9px)}
        18% {opacity:.85}
        100% {opacity:0;transform:rotate(var(--hk-angle)) translateX(var(--hk-radius))}
      }
      .dsh-hk-tick {
        position:absolute;
        left:calc(11px + (100% - 22px) * var(--hk-stop));
        transform:translateX(-50%);
        top:calc(50% - 2px);
        width:4px;
        height:4px;
        border-radius:50%;
        background:var(--hk-muted);
        opacity:.65;
        transition:transform 150ms ease-out,opacity 150ms ease-out;
      }
      .dsh-hk-tick[data-hovered] {transform:translateX(-50%) scale(1.8);opacity:1}
      .dsh-hk-thumb {
        position:absolute;
        top:calc((100% - var(--hk-thumb-size)) / 2);
        left:var(--hk-thumb-x);
        width:var(--hk-thumb-size);
        height:var(--hk-thumb-size);
        transform:translateX(-50%);
        border:1px solid #98a9c3;
        border-radius:50%;
        background:#f9fbff;
        color:#5a7195;
        box-shadow:0 2px 6px #111d3e43;
      }
      .dsh-hk-thumb::after {
        content:"";
        position:absolute;
        inset:4px;
        border:1px solid #b4c0eb45;
        border-radius:50%;
      }
      .dsh-hk-rail[data-tap] {
        transition-duration:205ms;
        transition-timing-function:cubic-bezier(.22,.72,.28,1);
      }
      .dsh-hk-rail[data-drag] {transition:none}
      .dsh-hk-range {
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        margin:0;
        opacity:0;
        pointer-events:none;
      }
      .dsh-hk-rail[data-drag] {cursor:grabbing}
      .dsh-hk-rail[data-node-hover] {cursor:pointer}
      .dsh-hk-rail:has(.dsh-hk-range:disabled) {cursor:default}
      .dsh-hk-head button[data-dsh-hk-native] {
        display:grid;
        place-items:center;
        width:28px;height:28px;border-radius:8px;color:var(--hk-muted);padding:0
      }
      .dsh-hk-native-icon {
        display:block;width:16px;height:16px;fill:none;stroke:currentColor;
        stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round;
      }
      @media (prefers-reduced-motion:reduce) {
        .dsh-hk-star,.dsh-hk-burst,.dsh-hk-fill [data-layer]::after {display:none;animation:none!important}
        .dsh-hk-rail,.dsh-hk-tick {transition:none!important}
        .dsh-hk-max-notice {animation:none}
      }
      @media (forced-colors:active) {
        .dsh-hk-lane {outline:1px solid CanvasText;outline-offset:-1px}
        .dsh-hk-thumb {border-color:CanvasText}
        .dsh-hk-tick {background:CanvasText;forced-color-adjust:none}
        .dsh-hk-max-notice {color:CanvasText;background:none}
      }
    `;

    function Mark({ checked = false }) {
      // Chevron path follows the rc.5 native icon geometry from ui-primitives/src/icons/artwork.ts.
      return h('svg', {
        className: checked ? 'dsh-hk-check' : 'dsh-hk-expand',
        viewBox: '0 0 16 16', 'aria-hidden': true, focusable: false,
      }, h('path', {
        d: checked ? 'M2.7 8.6 6.3 12 13.3 3.7' : 'M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6',
      }));
    }

    function labelText(name, fallback) {
      return (typeof name === 'string' && name.replace(/[\p{Cc}\p{Bidi_Control}]/gu, '').trim()) || fallback;
    }

    function isRouteId(value) {
      return typeof value === 'string' && value.length > 0;
    }

    function modelSnapshot(store) {
      const snapshots = new WeakMap();
      const catalogs = new WeakMap();
      function selectionOf(selection) {
        if (!isRouteId(selection?.provider) || !isRouteId(selection?.model)) return null;
        return {
          provider: selection.provider, model: selection.model,
          reasoningEffort: isRouteId(selection.reasoningEffort) ? selection.reasoningEffort : undefined,
        };
      }
      return () => {
        const source = store.getSnapshot();
        if (snapshots.has(source)) return snapshots.get(source);
        const catalog = source.groups;
        let groups = catalogs.get(catalog);
        if (!groups) {
          groups = (Array.isArray(catalog) ? catalog : []).filter(group => isRouteId(group?.id) && Array.isArray(group.models)).map(group => ({
            id: group.id, name: labelText(group.name, '未命名提供商'),
            models: group.models.filter(option => isRouteId(option?.id)).map(option => {
              const raw = option.reasoning;
              const reasoning = Array.isArray(raw?.efforts) ? {
                defaultEffort: isRouteId(raw.defaultEffort) ? raw.defaultEffort : undefined,
                efforts: raw.efforts.filter(level => isRouteId(level?.id)).map(level => ({
                  id: level.id, name: labelText(level.name, '自定义档位'),
                })),
              } : undefined;
              return { id: option.id, name: labelText(option.name, '未命名模型'), reasoning };
            }),
          }));
          if (Array.isArray(catalog)) catalogs.set(catalog, groups);
        }
        // Diagnostics, task contents, and provider connection settings are outside the UI contract.
        const snapshot = {
          groups, current: selectionOf(source.current), pending: selectionOf(source.pending),
          loading: source.status === 'loading',
        };
        snapshots.set(source, snapshot);
        return snapshot;
      };
    }

    function getModel(state) {
      const current = state.current;
      if (!current) return null;
      const model = state.groups.find(group => group.id === current.provider)
        ?.models.find(candidate => candidate.id === current.model);
      const reasoning = model?.reasoning;
      if (!Array.isArray(reasoning?.efforts) || reasoning.efforts.length === 0) return null;
      const entries = new Map();
      if (reasoning.defaultEffort === undefined) entries.set(undefined, '默认');
      for (const entry of reasoning.efforts) {
        if (typeof entry?.id === 'string' && entry.id) {
          entries.set(entry.id, caption.get(entry.id) ?? entry.name);
        }
      }
      const ids = [...entries.keys()];
      if (ids.length > 0 && ids.every(id => caption.has(id))) {
        ids.sort((a, b) => effortOrder.indexOf(a) - effortOrder.indexOf(b));
      }
      const effort = current.reasoningEffort ?? reasoning.defaultEffort;
      if (!entries.has(effort)) return null;
      return {
        provider: current.provider,
        model: current.model,
        ids,
        entries,
        effort,
        defaultEffort: reasoning.defaultEffort,
      };
    }

    function TeamSwitch({ enabled, disabled, needsDisableConfirmation, teamActions, reportFailure, close }) {
      const tooltipId = useId();
      const anchorName = anchorNameFor(tooltipId);
      const saving = useRef(false);
      const [pending, setPending] = useState(false);
      async function toggle(event) {
        if (!isTrusted(event) || disabled || saving.current) return;
        try {
          const actions = teamActions();
          if (!actions) throw new Error('Native team control unavailable');
          if (enabled && needsDisableConfirmation) {
            if (typeof actions.requestDisableConfirmation !== 'function') {
              throw new Error('Native team confirmation unavailable');
            }
            close();
            actions.requestDisableConfirmation();
            return;
          }
          saving.current = true;
          setPending(true);
          const failure = await actions.selectTeamMode(!enabled);
          if (failure !== null) reportFailure('未能保存智能体团队状态，请重试。');
        } catch {
          reportFailure('无法操作智能体团队，请重试或切回原生样式。');
        } finally {
          saving.current = false;
          setPending(false);
        }
      }
      return h('span', { className: 'dsh-hk-team dsh-hk-tip-anchor', style: { anchorName } },
        h('button', {
          type: 'button', role: 'switch', className: 'dsh-hk-bolt', 'data-dsh-hk-team': '',
          'aria-label': '智能体团队', 'aria-checked': enabled, 'aria-describedby': tooltipId,
          disabled: disabled || pending, onClick: toggle,
        }, h('svg', { viewBox: '0 0 20 20', 'aria-hidden': true },
          h('path', { d: 'M11.8 1.8 4.2 11h4.5l-.6 7.2 7.7-9.7h-4.5z' }),
        )),
        h('span', { className: 'dsh-hk-tip', id: tooltipId, role: 'tooltip', style: { positionAnchor: anchorName } },
          h('strong', null, '智能体团队'), h('small', null, enabled ? '开启' : '关闭'),
        ),
      );
    }

    function Stars({ level }) {
      const count = level === 'max' ? 14 : 7;
      return h('span', { className: 'dsh-hk-stars', 'aria-hidden': true },
        ...Array.from({ length: count }, (_, index) => {
          const duration = (level === 'max' ? 3.1 : 8.4) + (index % 4) * 0.44;
          return h('i', {
            key: index, className: 'dsh-hk-star',
            style: {
              '--hk-y': `${12 + (index * 31) % 72}%`,
              '--hk-size': `${index % 5 === 0 ? 3 : 2}px`,
              '--hk-opacity': 0.38 + (index % 4) * 0.15,
              '--hk-duration': `${duration}s`,
              '--hk-delay': `-${duration * (index + 0.4) / count}s`,
            },
          });
        }),
      );
    }

    function NativeStyleButton({ onClick }) {
      const tooltipId = useId();
      const anchorName = anchorNameFor(tooltipId);
      return h('span', { className: 'dsh-hk-native dsh-hk-tip-anchor', style: { anchorName } },
        h('button', {
          type: 'button', 'data-dsh-hk-native': '',
          'aria-label': '切回原生样式', 'aria-describedby': tooltipId,
          onClick: event => { if (isTrusted(event)) onClick(); },
        }, h('svg', {
          className: 'dsh-hk-native-icon', viewBox: '0 0 16 16',
          'aria-hidden': true, focusable: false,
        }, h('path', { d: 'M2.7 6.4a5.5 5.5 0 1 1-.1 3.1M2.5 3v3.6h3.6' }))),
        h('span', { className: 'dsh-hk-tip', id: tooltipId, role: 'tooltip', style: { positionAnchor: anchorName } },
          h('strong', null, '切回原生样式'),
        ),
      );
    }

    function PanelBody({ model, directory, state, select, locked, reportFailure, team, modelName, showModels, showNative }) {
      const input = useRef(null);
      const rail = useRef(null);
      const gesture = useRef(null);
      const saving = useRef(false);
      const pendingMax = useRef(false);
      const cueSequence = useRef(0);
      const [draft, setDraft] = useState(null);
      const [maxCue, setMaxCue] = useState(null);
      const [hoveredNode, setHoveredNode] = useState(null);
      const [nodeTravel, setNodeTravel] = useState(false);
      const signature = JSON.stringify([model.provider, model.model, model.ids, model.effort]);
      const last = model.ids.length - 1;
      const denominator = Math.max(1, last);
      const maxIndex = model.ids.indexOf('max');
      const maxPosition = maxIndex / denominator;
      const pending = state.pending?.provider === model.provider && state.pending?.model === model.model;
      const pendingEffort = pending ? state.pending.reasoningEffort ?? model.defaultEffort : model.effort;
      const savedIndex = Math.max(0, model.ids.indexOf(pendingEffort));
      const dragging = !locked && !state.pending && draft?.signature === signature;
      const index = dragging ? Math.round(draft.position * last) : savedIndex;
      const position = dragging ? draft.position : index / denominator;
      const effort = model.ids[index];
      const name = model.entries.get(effort);
      const blocked = locked || state.pending != null;
      const noticeShowing = maxCue !== null && effort === 'max';

      function cancelGesture() {
        const active = gesture.current;
        if (!active) return;
        gesture.current = null;
        pendingMax.current = false;
        setDraft(null);
        setMaxCue(null);
        if (active.target.hasPointerCapture?.(active.id)) active.target.releasePointerCapture(active.id);
      }

      useLayoutEffect(() => {
        if (blocked || gesture.current?.signature !== signature) cancelGesture();
      }, [blocked, signature]);
      useEffect(() => {
        const visibilityChanged = () => { if (document.visibilityState === 'hidden') cancelGesture(); };
        window.addEventListener('blur', cancelGesture);
        document.addEventListener('visibilitychange', visibilityChanged);
        return () => {
          window.removeEventListener('blur', cancelGesture);
          document.removeEventListener('visibilitychange', visibilityChanged);
        };
      }, []);

      function showMaxAtArrival() {
        const element = rail.current;
        if (!pendingMax.current || !element || effort !== 'max' || position !== maxPosition) return;
        const progress = Number.parseFloat(window.getComputedStyle(element).getPropertyValue(progressProperty));
        if (!Number.isFinite(progress) || Math.abs(progress - maxPosition) > 0.000001 ||
            element.getAnimations().some(animation => animation.transitionProperty === progressProperty &&
              (animation.pending || animation.playState === 'running'))) return;
        pendingMax.current = false;
        if (dragging && gesture.current) gesture.current.reachedMax = true;
        setMaxCue(++cueSequence.current);
      }

      useLayoutEffect(showMaxAtArrival, [position, effort, dragging]);

      useEffect(() => {
        if (effort !== 'max') setMaxCue(null);
      }, [effort]);
      useEffect(() => {
        if (maxCue === null) return;
        const timeout = setTimeout(() => setMaxCue(null), 3000);
        return () => clearTimeout(timeout);
      }, [maxCue]);

      async function commit(nextIndex, fromNode = false, cueAtMax = fromNode) {
        if (blocked || saving.current || !Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex > last) return;
        const current = directory.getSnapshot();
        const latest = getModel(current);
        if (current.pending || !latest || latest.provider !== model.provider || latest.model !== model.model ||
            latest.effort !== model.effort || !latest.entries.has(model.ids[nextIndex])) return;
        const next = model.ids[nextIndex];
        pendingMax.current = next === 'max' && cueAtMax && (!fromNode || latest.effort !== next);
        if (latest.effort === next) return;
        setNodeTravel(fromNode);
        saving.current = true;
        try {
          const result = await select({
            provider: latest.provider, model: latest.model,
            ...(next === undefined ? {} : { reasoningEffort: next }),
          });
          if (!result?.ok) throw new Error('Unable to select effort');
        } catch {
          pendingMax.current = false;
          setMaxCue(null);
          reportFailure('未能保存推理等级，请重试。');
        } finally {
          saving.current = false;
        }
      }

      function pointAt(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (![event.clientX, event.clientY, rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) ||
            rect.width <= 22 || rect.height <= 0) return null;
        const span = Math.max(1, rect.width - 22);
        const offset = event.clientX - rect.left - 11;
        const position = Math.min(1, Math.max(0, offset / span));
        const nearest = Math.round(position * last);
        const step = span / denominator;
        const distance = Math.hypot(offset - nearest * step, event.clientY - rect.top - rect.height / 2);
        const node = last > 0 && distance <= thumbSize / 2
          ? nearest
          : null;
        return { position, nearest, node };
      }

      function start(event) {
        if (!isTrusted(event) || !event.isPrimary || !Number.isInteger(event.pointerId) || blocked || saving.current ||
            last < 1 || event.button !== 0 || gesture.current) return;
        const point = pointAt(event);
        if (!point) return;
        event.preventDefault();
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch { return; }
        gesture.current = {
          id: event.pointerId, type: event.pointerType, target: event.currentTarget, signature, startX: event.clientX,
          position, node: point.node, dragging: false, reachedMax: false,
        };
        pendingMax.current = false;
        setHoveredNode(null);
      }

      function move(event) {
        if (!isTrusted(event) || !event.isPrimary) return;
        const point = pointAt(event);
        const active = gesture.current;
        if (!active) {
          setHoveredNode(blocked || event.pointerType === 'touch' ? null : point?.node ?? null);
          return;
        }
        if (active.id !== event.pointerId || active.type !== event.pointerType || active.signature !== signature || blocked || !point) return;
        if (!active.dragging) {
          if (Math.abs(event.clientX - active.startX) < 3) return;
          active.dragging = true;
          setNodeTravel(false);
          input.current?.focus({ preventScroll: true });
        }
        const { position: nextPosition } = point;
        if (nextPosition !== maxPosition) {
          pendingMax.current = false;
        } else if (!active.reachedMax && active.position !== maxPosition) {
          pendingMax.current = true;
        }
        active.position = nextPosition;
        setDraft({ signature, position: nextPosition });
      }

      function finish(event, accept) {
        if (!isTrusted(event)) return;
        const active = gesture.current;
        if (!active || active.id !== event.pointerId || active.type !== event.pointerType) return;
        const point = accept && event.isPrimary && !blocked && active.signature === signature ? pointAt(event) : null;
        if (!point) {
          cancelGesture();
          return;
        }
        gesture.current = null;
        setDraft(null);
        const { nearest, node } = point;
        if (!active.dragging) {
          if (node !== null && node === active.node) {
            input.current?.focus({ preventScroll: true });
            void commit(node, true);
          }
          return;
        }
        const cueAtMax = !active.reachedMax && (active.position !== maxPosition || pendingMax.current);
        pendingMax.current = false;
        void commit(nearest, false, cueAtMax);
      }

      function settled(event) {
        if (!isTrusted(event) || event.target !== event.currentTarget || event.propertyName !== progressProperty) return;
        setNodeTravel(false);
        showMaxAtArrival();
      }

      return h('div', null,
        h('div', { className: 'dsh-hk-head', 'data-effort': caption.has(effort) ? effort : undefined },
          team,
          h('div', { className: 'dsh-hk-meta' },
            h('strong', { className: 'dsh-hk-value', 'aria-hidden': true }, name),
            h('button', {
              type: 'button', className: 'dsh-hk-model-name', 'data-dsh-hk-model': '',
              title: modelName, 'aria-label': `切换模型，当前 ${modelName}`, onClick: showModels,
            }, noticeShowing ? h('span', { className: 'dsh-hk-max-notice', 'aria-hidden': true }, maxNotice) : `${modelName} ›`),
            h('span', { className: 'dsh-hk-announcement', role: 'status' }, noticeShowing ? maxNotice : ''),
          ),
          h(NativeStyleButton, { onClick: showNative }),
        ),
        h('div', {
          ref: rail, className: 'dsh-hk-rail', 'data-effort': caption.has(effort) ? effort : undefined,
          'data-drag': dragging ? '' : undefined,
          'data-tap': nodeTravel ? '' : undefined,
          'data-node-hover': !blocked && hoveredNode !== null ? '' : undefined,
          style: {
            [progressProperty]: position,
            '--hk-steps': denominator,
            '--hk-high-stop': model.ids.indexOf('high'),
            '--hk-max-stop': maxIndex,
          },
          onPointerDown: start, onPointerMove: move,
          onPointerLeave: () => setHoveredNode(null),
          onPointerUp: event => finish(event, true),
          onPointerCancel: event => finish(event, false),
          onLostPointerCapture: event => finish(event, false),
          onTransitionEnd: settled, onTransitionCancel: settled,
        },
          h('span', { className: 'dsh-hk-lane', 'aria-hidden': true },
            ...model.ids.map((id, stop) => h('i', {
              key: id ?? 'provider-default', className: 'dsh-hk-tick', 'aria-hidden': true,
              'data-hovered': !blocked && stop === hoveredNode ? '' : undefined,
              style: { '--hk-stop': stop / denominator },
            })),
            h('span', { className: 'dsh-hk-fill' },
              ...['high', 'max'].map(level => h('span', { key: level, 'data-layer': level },
                model.ids.includes(level) && h(Stars, { level }),
              )),
            ),
          ),
          noticeShowing && h('span', { key: maxCue, className: 'dsh-hk-burst', 'aria-hidden': true },
            ...Array.from({ length: 10 }, (_, spark) => h('i', {
              key: spark,
              style: { '--hk-angle': `${spark * 36}deg`, '--hk-radius': `${22 + spark % 3 * 3}px` },
            })),
          ),
          h('span', { className: 'dsh-hk-thumb', 'aria-hidden': true }),
          h('input', {
            type: 'range', className: 'dsh-hk-range', ref: input,
            min: 0, max: last, step: 1, value: index, disabled: blocked || last < 1,
            'aria-label': '推理等级', 'aria-valuetext': name,
            onKeyDown: event => {
              if (rangeKeys.has(event.key)) event.stopPropagation();
            },
            onChange: event => {
              if (isTrusted(event) && !gesture.current) {
                void commit(event.currentTarget.valueAsNumber);
              }
            },
          }),
        ),
      );
    }

    function Seat(props) {
      const { directory, available, load, loadProviderKinds, useSession, useSessions, useProjection, sessionId } = props;
      const state = useSyncExternalStore(directory.subscribe, directory.getSnapshot);
      const addressedChild = useSession(snapshot => snapshot.subagent !== null);
      const listedChild = useSessions(snapshot => snapshot.byId[sessionId]?.origin === 'subagent');
      const allowed = available && !addressedChild && !listedChild;
      const teamEnabled = useProjection('agentTeam', value => value?.enabled);
      const needsDisableConfirmation = useProjection('modelSelection', value => value == null ? undefined : value.lastUsed !== null);
      const model = getModel(state);
      const saved = state.current;
      const active = state.groups.find(group => group.id === saved?.provider)
        ?.models.find(option => option.id === saved?.model);
      const modelName = active?.name ?? '选择模型';
      const trigger = useRef(null);
      const popup = useRef(null);
      const choosing = useRef(false);
      const writableSession = useRef(null);
      const activePane = useRef(null);
      const dialogId = useId();
      const anchorName = anchorNameFor(dialogId);
      const [pane, setPane] = useState(null);
      const [error, setError] = useState(null);
      const [saving, setSaving] = useState(false);
      const [providerKinds, setProviderKinds] = useState(() => new Map());
      const locked = props.locked || state.pending != null || saving;
      const open = pane !== null;
      const view = pane?.view;
      const isCurrentPane = () => pane !== null && activePane.current === pane;
      const canWrite = () => isCurrentPane() && writableSession.current === sessionId;
      const reportFailure = message => { if (isCurrentPane()) setError(message); };

      function select(selection) {
        if (!canWrite()) return Promise.resolve(undefined);
        return props.select(selection);
      }

      function close(returnFocus = true) {
        if (!isCurrentPane()) return;
        activePane.current = null;
        setPane(null);
        setError(null);
        if (returnFocus) trigger.current?.focus({ preventScroll: true });
      }
      function changeView(next) {
        const shown = { view: next };
        activePane.current = shown;
        setError(null);
        setPane(shown);
        return shown;
      }
      function launch(event) {
        if (!isTrusted(event) || !allowed) return;
        if (open) {
          close();
          return;
        }
        if (props.locked) return;
        const shown = changeView(active ? 'effort' : 'models');
        void load().catch(() => {
          if (activePane.current === shown) setError('未能加载模型目录，请重试。');
        });
      }

      function handleDialogKeys(event) {
        if (!isTrusted(event) || !isCurrentPane()) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          if (view === 'models' && active) changeView('effort');
          else close();
          return;
        }
        if (view !== 'models' || event.altKey || event.ctrlKey || event.metaKey ||
            !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        const choices = Array.from(popup.current?.querySelectorAll('[data-dsh-hk-pick]:not([disabled])') ?? []);
        if (choices.length === 0) return;
        const current = choices.indexOf(document.activeElement);
        let next = 0;
        if (event.key === 'End' || (event.key === 'ArrowUp' && current === -1)) next = choices.length - 1;
        else if (event.key === 'ArrowDown') next = (current + 1) % choices.length;
        else if (event.key === 'ArrowUp') next = (current - 1 + choices.length) % choices.length;
        event.preventDefault();
        event.stopPropagation();
        choices[next].focus();
      }

      useLayoutEffect(() => {
        if (open) popup.current?.focus({ preventScroll: true });
      }, [pane]);
      useLayoutEffect(() => {
        writableSession.current = allowed && !props.locked ? sessionId : null;
        return () => { writableSession.current = null; };
      }, [allowed, props.locked, sessionId]);
      useLayoutEffect(() => () => { activePane.current = null; }, []);
      useEffect(() => {
        if (!open) return;
        const outside = event => {
          if (event.isTrusted && !trigger.current?.contains(event.target) && !popup.current?.contains(event.target)) close(false);
        };
        document.addEventListener('pointerdown', outside, true);
        return () => document.removeEventListener('pointerdown', outside, true);
      }, [pane]);
      useEffect(() => {
        setProviderKinds(new Map());
        if (!allowed || view !== 'models') return;
        const providerIds = new Set(state.groups.filter(group => !nativeProviders.has(group.id) && group.models.length > 0)
          .map(group => group.id));
        if (providerIds.size === 0) return;
        let active = true;
        void loadProviderKinds(providerIds).then(kinds => {
          if (active && isCurrentPane()) setProviderKinds(kinds);
        }).catch(() => { /* Leave providers under their catalog names. */ });
        return () => { active = false; };
      }, [allowed, pane, state.groups, loadProviderKinds]);

      async function choose(providerId, modelId) {
        if (!canWrite() || locked || choosing.current) return;
        const current = directory.getSnapshot();
        const picked = current.groups.find(group => group.id === providerId)?.models.find(option => option.id === modelId);
        if (!picked || current.pending) return;
        if (current.current?.provider === providerId && current.current.model === modelId) {
          changeView('effort');
          return;
        }
        const choice = { provider: providerId, model: modelId };
        if (typeof picked.reasoning?.defaultEffort === 'string') choice.reasoningEffort = picked.reasoning.defaultEffort;
        choosing.current = true;
        setSaving(true);
        reportFailure(null);
        try {
          const result = await select(choice);
          if (result?.ok) {
            if (isCurrentPane()) changeView('effort');
          } else {
            reportFailure('未能切换模型，请重试。');
          }
        } catch {
          reportFailure('未能切换模型，请重试。');
        } finally {
          choosing.current = false;
          setSaving(false);
        }
      }

      if (!allowed) return null;
      const team = typeof teamEnabled === 'boolean'
        ? h(TeamSwitch, {
          enabled: teamEnabled, disabled: locked || needsDisableConfirmation === undefined,
          needsDisableConfirmation,
          teamActions: () => canWrite() ? props.teamActions() : undefined,
          reportFailure, close,
        }) : null;
      const showModels = event => { if (isTrusted(event) && isCurrentPane()) changeView('models'); };
      const showNative = () => { if (isCurrentPane()) props.showNative(); };
      const groups = view === 'models' ? state.groups.filter(group => group.models.length > 0)
        .toSorted((left, right) => (nativeProviders.get(left.id)?.order ?? 2) - (nativeProviders.get(right.id)?.order ?? 2)) : [];
      function renderProvider(group) {
        const label = nativeProviders.get(group.id)?.label ?? group.name;
        return h('div', { key: group.id, role: 'group', 'aria-label': label },
          h('div', { className: 'dsh-hk-model-group' }, label),
          ...group.models.map(option => {
            const checked = group.id === saved?.provider && option.id === saved?.model;
            return h('button', {
              key: option.id, type: 'button', 'data-dsh-hk-pick': '',
              disabled: locked, 'aria-pressed': checked, title: option.name,
              onClick: event => { if (isTrusted(event)) void choose(group.id, option.id); },
            }, h('span', null, option.name), checked && h(Mark, { checked: true }));
          }),
        );
      }
      const catalogGroups = groups.filter(group => !nativeProviders.has(group.id));
      function renderSource(kind, title) {
        const matches = catalogGroups.filter(group => providerKinds.get(group.id) === kind);
        return matches.length > 0 && h('section', { 'aria-label': title },
          h('h3', { className: 'dsh-hk-model-source-title' }, title),
          ...matches.map(renderProvider),
        );
      }
      const panel = view === 'models'
        ? h('div', { className: 'dsh-hk-model-list' },
          h('h2', { className: 'dsh-hk-model-heading' },
            h('button', {
              type: 'button', className: 'dsh-hk-back', 'aria-label': '返回',
              onClick: event => {
                if (!isTrusted(event) || !isCurrentPane()) return;
                if (active) changeView('effort');
                else close();
              },
            }, h(Mark)),
            '选择模型',
          ),
          groups.length === 0 && h('p', { className: 'dsh-hk-empty' }, state.loading ? '正在加载模型…' : '暂无可用模型'),
          ...groups.filter(group => nativeProviders.has(group.id)).map(renderProvider),
          renderSource('thirdParty', '第三方模型提供商'),
          renderSource('custom', '自定义模型 API'),
          ...catalogGroups.filter(group => !providerKinds.get(group.id)).map(renderProvider),
        )
        : model
          ? h(PanelBody, {
            key: JSON.stringify([model.provider, model.model]),
            model, state, directory, team, select, locked, reportFailure, modelName, showModels, showNative,
          })
          : h('div', { className: 'dsh-hk-head' },
            team,
            h('div', { className: 'dsh-hk-meta' },
              h('button', {
                type: 'button', className: 'dsh-hk-model-name', 'data-dsh-hk-model': '', onClick: showModels,
              }, modelName, ' ›'),
              h('p', { className: 'dsh-hk-empty' }, '此模型没有可调的推理档位。'),
            ),
            h(NativeStyleButton, { onClick: showNative }),
          );

      function triggerContents(effortLabel) {
        return [
          h('span', { key: 'compact', className: 'dsh-hk-compact', 'aria-hidden': true }, '◈'),
          h('span', { key: 'model', className: 'dsh-hk-trigger-name' }, modelName),
          model && h('span', { key: 'effort', className: 'dsh-hk-trigger-effort' }, effortLabel),
          h(Mark, { key: 'chevron' }),
        ];
      }

      return h('div', { className: 'dsh-hk dsh-hk-seat' },
        h('button', {
          ref: trigger, type: 'button', className: 'dsh-hk-trigger', 'data-dsh-hk-trigger': '',
          'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': open ? dialogId : undefined,
          'aria-label': model ? `${modelName} ${model.entries.get(model.effort)}` : modelName,
          disabled: props.locked && !open,
          onClick: launch,
          onKeyDown: event => { if (isTrusted(event) && event.key === 'Escape' && open) { event.stopPropagation(); close(); } },
        }, ...triggerContents(model?.entries.get(model.effort))),
        // Match the button's Off geometry without changing its visible caption or its hit target.
        h('span', {
          className: 'dsh-hk-trigger dsh-hk-off-anchor', 'aria-hidden': true, style: { anchorName },
        }, ...triggerContents('Off')),
        open && createPortal(h('section', {
          id: dialogId, ref: popup, className: 'dsh-hk dsh-hk-popup', 'data-dsh-hk-popup': '', 'data-view': view,
          role: 'dialog', tabIndex: -1, 'aria-label': view === 'models' ? '切换模型' : '推理滑块',
          style: { '--hk-anchor': anchorName },
          onBlur: event => {
            if (isTrusted(event) && event.relatedTarget && !trigger.current?.contains(event.relatedTarget) &&
                !popup.current?.contains(event.relatedTarget)) close(false);
          },
          onKeyDown: handleDialogKeys,
        },
          panel,
          error && h('p', { role: 'alert' }, error),
        ), document.body),
      );
    }

    function NativeOption({ restore, dismiss }) {
      return h('div', { className: 'dsh-hk' },
        h('button', {
          type: 'button', role: 'menuitem', className: 'dsh-hk-restore',
          onClick: event => {
            if (!isTrusted(event)) return;
            dismiss();
            restore();
          },
        }, '启用推理滑块'),
      );
    }

    return {
      inject: ['slots', 'modelDirectories', 'sessions'],
      apply(ctx) {
        let active = true;
        let stopSeat;
        let stopRestore;
        let readProviderDirectory;
        const writingSessions = new Set();
        ctx.inject(['remote', 'remote.llm'], scope => {
          scope.effect(() => {
            readProviderDirectory = () => scope.remote.llm.listConfigurableProviders();
            return () => { readProviderDirectory = undefined; };
          }, 'dsh-huakuai: provider directory');
        });
        async function loadProviderKinds(providerIds) {
          // Keep only classifications for providers present in this session's catalog.
          const result = await readProviderDirectory?.();
          if (!result?.ok || !Array.isArray(result.value)) return new Map();
          const kinds = new Map();
          for (const entry of result.value) {
            const provider = entry?.provider;
            if (typeof provider !== 'string' || !providerIds.has(provider) || typeof entry.declared !== 'boolean') continue;
            const kind = entry.declared ? 'custom' : 'thirdParty';
            // Conflicting declarations use the normal unclassified display.
            kinds.set(provider, kinds.has(provider) && kinds.get(provider) !== kind ? null : kind);
          }
          return kinds;
        }
        function registerSeat() {
          let registered = true;
          const unregister = ctx.slots.register({
            name: slot,
            id: 'dsh-huakuai',
            priority: -10,
            inject(sessionId) {
              const directory = ctx.modelDirectories.directoryFor(sessionId);
              const getSnapshot = modelSnapshot(directory.store);
              const available = ctx.sessions.subagentAddress(sessionId) === undefined;
              const canUse = () => active && registered && available && ctx.sessions.subagentAddress(sessionId) === undefined;
              const canWrite = () => canUse() && !writingSessions.has(sessionId) && directory.store.getSnapshot().pending == null;
              async function write(operation) {
                if (!canWrite()) return undefined;
                writingSessions.add(sessionId);
                try {
                  return await operation();
                } finally {
                  writingSessions.delete(sessionId);
                }
              }
              return {
                available,
                directory: {
                  subscribe: callback => directory.store.subscribe(callback),
                  getSnapshot,
                },
                async load() { if (canUse()) await directory.load(); },
                loadProviderKinds: providerIds => canUse() ? loadProviderKinds(providerIds) : Promise.resolve(new Map()),
                select: ({ provider, model, reasoningEffort }) => write(() => {
                  const target = getSnapshot().groups.find(group => group.id === provider)?.models.find(option => option.id === model);
                  if (!target || (reasoningEffort !== undefined && !target.reasoning?.efforts.some(level => level.id === reasoningEffort) &&
                      target.reasoning?.defaultEffort !== reasoningEffort)) return undefined;
                  const route = { provider, model };
                  if (reasoningEffort !== undefined) route.reasoningEffort = reasoningEffort;
                  return directory.select(route);
                }),
                teamActions() {
                  if (!canWrite()) return undefined;
                  // Pinned rc.5 native contribution owns both the save and the confirmation.
                  const native = ctx.slots.entriesOfSlot(optionsSlot).find(entry =>
                    entry.options.id === 'agent-team' && entry.locale === 'agent-team' &&
                    (entry.options.priority ?? 0) === 0,
                  );
                  const confirmation = ctx.slots.entriesOfSlot('shell.overlay').some(entry =>
                    entry.options.id === 'agent-team.disable' && entry.locale === 'agent-team' &&
                    (entry.options.priority ?? 0) === 0,
                  );
                  const actions = native?.inject?.(sessionId);
                  if (typeof actions?.selectTeamMode !== 'function') return undefined;
                  return {
                    selectTeamMode: enabled => write(() => actions.selectTeamMode(enabled)),
                    requestDisableConfirmation: confirmation && typeof actions.requestDisableConfirmation === 'function'
                      ? () => { if (canWrite()) actions.requestDisableConfirmation(); }
                      : undefined,
                  };
                },
                showNative,
              };
            },
          }, Seat);
          return () => {
            registered = false;
            unregister();
          };
        }
        function restore() {
          if (!active) return;
          stopRestore?.();
          stopRestore = undefined;
          stopSeat ??= ctx.slots.inject(slot, registerSeat);
        }
        function showNative() {
          if (!active) return;
          stopSeat?.();
          stopSeat = undefined;
          stopRestore ??= ctx.slots.inject(optionsSlot, () => ctx.slots.register({
            name: optionsSlot,
            id: 'dsh-huakuai.restore',
            inject: () => ({ restore }),
          }, NativeOption));
        }
        ctx.effect(() => {
          const stylesheet = document.createElement('style');
          stylesheet.textContent = styles;
          document.head.append(stylesheet);
          return () => {
            active = false;
            stylesheet.remove();
          };
        }, 'dsh-huakuai: styles');
        restore();
      },
    };
  },
});

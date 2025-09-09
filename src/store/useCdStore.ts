import { create } from 'zustand';

export const useCdStore = create<CdHoverState>((set) => ({
  hoveredCd: null,
  setHoveredCd: (cd) => set({ hoveredCd: cd }),

  phase: 0,
  setPhase: (p) => set({ phase: p }),

  activeIndex: 0,
  setActiveIndex: (i) => set({ activeIndex: i }),
}));

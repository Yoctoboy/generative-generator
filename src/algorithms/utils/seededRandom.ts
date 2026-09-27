// A drop-in for Math.random that gives the same sequence for the same seed (mulberry32),
// for sketches not built on p5 (see seedRandomnessModules for p5 ones).
// Each call creates an independent generator, so separate parts of a sketch don't shift each
// other's sequences
export const createSeededRandom = (seed: number) => {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

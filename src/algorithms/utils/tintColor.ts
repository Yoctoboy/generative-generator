import p5, { Color } from 'p5';

/*
 * For a given color channel, will transform the initial channel the following way:
 * 0 becomes 0 (so black stays black)
 * 255 becomes target value
 * 100 becomes target value * 100/255
 *
 * Using this, target value can only decrease from initial.
 *
 * SO:
 * we need to account for the fact that the obtained color will be darker. So we scale it back
 * so that the sum of r+g+b in target color is equal to initial color's r+g+b.
 */
export const tintColor = ({
    p5,
    initialColor,
    targetColor,
    amount = 0.3,
}: {
    p5: p5;
    initialColor: Color;
    targetColor: Color;
    amount?: number;
}): Color => {
    if (amount < 0 || amount > 1) {
        throw new Error('tinting color amount should be between 0 & 1');
    }
    // @ts-expect-error method is actually defined but not visible in type declarations
    const initialRed = initialColor._getRed();
    // @ts-expect-error method is actually defined but not visible in type declarations
    const initialGreen = initialColor._getGreen();
    // @ts-expect-error method is actually defined but not visible in type declarations
    const initialBlue = initialColor._getBlue();
    // @ts-expect-error method is actually defined but not visible in type declarations
    const initialAlpha = initialColor._getAlpha();

    // @ts-expect-error method is actually defined but not visible in type declarations
    const targetRed = targetColor._getRed();
    // @ts-expect-error method is actually defined but not visible in type declarations
    const targetGreen = targetColor._getGreen();
    // @ts-expect-error method is actually defined but not visible in type declarations
    const targetBlue = targetColor._getBlue();
    // @ts-expect-error method is actually defined but not visible in type declarations
    const targetAlpha = targetColor._getAlpha();

    const tintedRed = initialRed + amount * (targetRed - initialRed);
    const tintedGreen = initialGreen + amount * (targetGreen - initialGreen);
    const tintedBlue = initialBlue + amount * (targetBlue - initialBlue);
    const tintedAlpha = initialAlpha + amount * (targetAlpha - initialAlpha);

    return p5.color(tintedRed, tintedGreen, tintedBlue, tintedAlpha);
};

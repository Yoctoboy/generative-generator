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
}: {
    p5: p5;
    initialColor: Color;
    targetColor: Color;
}): Color => {
    const initialRed = initialColor._getRed();
    const initialGreen = initialColor._getGreen();
    const initialBlue = initialColor._getBlue();
    const initialAlpha = initialColor._getAlpha();
    const initialSum =
        (initialRed + initialGreen + initialBlue) * (initialAlpha / 255);

    const targetRed = targetColor._getRed();
    const targetGreen = targetColor._getGreen();
    const targetBlue = targetColor._getBlue();
    const targetAlpha = targetColor._getAlpha();

    const tintedRed = initialRed * (targetRed / 255);
    const tintedGreen = initialGreen * (targetGreen / 255);
    const tintedBlue = initialBlue * (targetBlue / 255);
    const tintedAlpha = initialAlpha * (targetAlpha / 255);

    return p5.color(tintedRed, tintedGreen, tintedBlue, tintedAlpha);
};

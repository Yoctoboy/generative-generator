// Creates a new, empty sketch, registers it in src/algorithms/availableSketches.ts and makes it the default one
// Usage: pnpm run new-sketch [p5|three] [Sketch Name]
// Missing arguments are asked for interactively
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const algorithmsDir = join(rootDir, 'src', 'algorithms');
const availableSketchesFile = join(algorithmsDir, 'availableSketches.ts');

const SKETCH_TYPES = ['p5', 'three'];

const ask = async (question) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(question);
    rl.close();
    return answer.trim();
};

const fail = (message) => {
    console.error(`Error: ${message}`);
    process.exit(1);
};

// "The Big River" -> "the-big-river" / "TheBigRiver"
const toKebabCase = (name) =>
    name
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
const toPascalCase = (name) =>
    toKebabCase(name)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

const p5SketchTemplate = (
    componentName,
    sketchName,
) => `import { P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react';
import { ParameterValues } from '../../components/Parameter';
import { SketchType } from '../Sketch';
import { seedRandomnessModules } from '../utils/seedRandomnessModules';
import { parameters, setup } from './setup';

const Sketch = ({ paramValues }: { paramValues: ParameterValues<typeof parameters> }) => {
    const sketch = (p5: P5CanvasInstance) => {
        seedRandomnessModules(p5, paramValues['Random Seed']);
        p5.setup = setup(p5, paramValues);
    };
    return <ReactP5Wrapper sketch={sketch} />;
};

const ${componentName}: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: '${sketchName}',
};

export default ${componentName};
`;

const p5SetupTemplate = () => `import { P5CanvasInstance } from '@p5-wrapper/react';
import { Parameter, ParameterValues, randomSeedParameter } from '../../components/Parameter';

export const parameters = [randomSeedParameter] as const satisfies Parameter[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const setup = (p5: P5CanvasInstance, paramValues: ParameterValues<typeof parameters>) => {
    return () => {
        const size = 1024;
        p5.createCanvas(size, size);
        p5.background(0);
    };
};
`;

const threeSketchTemplate = (componentName, sketchName) => `import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Parameter, ParameterValues, randomSeedParameter } from '../../components/Parameter';
import { SketchType } from '../Sketch';

const parameters = [randomSeedParameter] as const satisfies Parameter[];

const sceneSize = 1000;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Sketch = ({ paramValues }: { paramValues: ParameterValues<typeof parameters> }) => {
    const cameraControlRef = useRef<CameraControls | null>(null);

    // created once: a new camera on each render would make react-three-fiber swap cameras
    const camera = useMemo(
        () => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000),
        [],
    );

    // CameraControls owns the camera orientation (camera.lookAt gets overridden),
    // so the initial view is set on the controls, once, when they are created
    const initCameraControls = useCallback((controls: CameraControls | null) => {
        cameraControlRef.current = controls;
        controls?.setLookAt(sceneSize, sceneSize * 0.6, sceneSize, 0, 0, 0, false);
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={camera}>
                <color attach="background" args={['black']} />
                <CameraControls ref={initCameraControls} />
                <ambientLight intensity={Math.PI} />
            </Canvas>
        </div>
    );
};

const ${componentName}: SketchType<typeof parameters> = {
    sketch: Sketch,
    parameters,
    sketchName: '${sketchName}',
    type: 'THREE',
};
export default ${componentName};
`;

// Adds the import after the last sketch import, and the sketch at the end of availableSketches
const registerSketch = (componentName, folderName) => {
    let sketches = readFileSync(availableSketchesFile, 'utf8');
    const importLine = `import ${componentName} from './${folderName}/${componentName}';`;

    const sketchImports = [...sketches.matchAll(/^import \w+ from '\.\/[^']+';$/gm)];
    if (sketchImports.length === 0) {
        return false;
    }
    const lastImport = sketchImports[sketchImports.length - 1];
    const importEnd = lastImport.index + lastImport[0].length;
    sketches = `${sketches.slice(0, importEnd)}\n${importLine}${sketches.slice(importEnd)}`;

    const listMatch = sketches.match(/export const availableSketches = \[[\s\S]*?\n\];/);
    if (!listMatch) {
        return false;
    }
    const listEnd = listMatch.index + listMatch[0].length - '\n];'.length;
    sketches = `${sketches.slice(0, listEnd)}\n    ${componentName},${sketches.slice(listEnd)}`;

    writeFileSync(availableSketchesFile, sketches);
    return true;
};

// Makes the sketch the one displayed when the app loads
const setAsDefaultSketch = (componentName) => {
    const sketches = readFileSync(availableSketchesFile, 'utf8');
    const defaultSketchRegex = /(export const defaultSketch: SketchType = )\w+;/;
    if (!defaultSketchRegex.test(sketches)) {
        return false;
    }
    writeFileSync(availableSketchesFile, sketches.replace(defaultSketchRegex, `$1${componentName};`));
    return true;
};

const main = async () => {
    let [type, ...nameParts] = process.argv.slice(2);
    let sketchName = nameParts.join(' ');

    if (!type) {
        type = await ask(`Sketch type (${SKETCH_TYPES.join('/')}): `);
    }
    type = type.toLowerCase();
    if (!SKETCH_TYPES.includes(type)) {
        fail(`unknown sketch type "${type}", expected one of: ${SKETCH_TYPES.join(', ')}`);
    }

    if (!sketchName) {
        sketchName = await ask('Sketch name (e.g. "The River"): ');
    }
    const folderName = toKebabCase(sketchName);
    if (!folderName) {
        fail('the sketch name must contain at least one letter or digit');
    }
    if (/^[0-9]/.test(folderName)) {
        fail('the sketch name cannot start with a digit');
    }
    const componentName = `${toPascalCase(sketchName)}Sketch`;
    const escapedSketchName = sketchName.trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    const sketchDir = join(algorithmsDir, folderName);
    if (existsSync(sketchDir)) {
        fail(`${relative(rootDir, sketchDir)} already exists`);
    }

    const files =
        type === 'p5'
            ? {
                  [`${componentName}.tsx`]: p5SketchTemplate(componentName, escapedSketchName),
                  'setup.ts': p5SetupTemplate(),
              }
            : {
                  [`${componentName}.tsx`]: threeSketchTemplate(componentName, escapedSketchName),
              };

    mkdirSync(sketchDir);
    for (const [fileName, content] of Object.entries(files)) {
        writeFileSync(join(sketchDir, fileName), content);
        console.log(`Created ${relative(rootDir, join(sketchDir, fileName))}`);
    }

    const availableSketchesPath = relative(rootDir, availableSketchesFile);
    if (registerSketch(componentName, folderName)) {
        console.log(`Registered ${componentName} in ${availableSketchesPath}`);
    } else {
        console.warn(
            `Could not register the sketch automatically, add ${componentName} to ${availableSketchesPath} yourself`,
        );
    }

    if (setAsDefaultSketch(componentName)) {
        console.log(`Set ${componentName} as the default sketch in ${availableSketchesPath}`);
    } else {
        console.warn(`Could not set ${componentName} as the default sketch in ${availableSketchesPath}`);
    }
};

main();

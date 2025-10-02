import { ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SketchType } from './algorithms/Sketch';
import BaseSketch from './algorithms/base/BaseSketch';
import DiamondSquareSketch from './algorithms/diamond-square/DiamondSquareSketch';
import GlitchyVHSSketch from './algorithms/glitchy-vhs/GlitchyVHSSketch';
import SortedFaceSketch from './algorithms/sorted-face/SortedFaceSketch';
import SquareCloudsSketch from './algorithms/square-clouds/SquareCloudsSketch';
import WarpedSketch from './algorithms/warped/WarpedSketch';
import { PageContainer } from './components/PageContainer';
import {
    getParametersInitialValues,
    ParameterType,
    ParameterValues,
} from './components/Parameter';
import { ParameterCheckbox } from './components/ParameterCheckbox';
import { ParameterSlider } from './components/ParameterSlider';
import { Sidebar } from './components/Sidebar';
import { SketchContainer } from './components/SketchContainer';
import { SketchError } from './components/SketchError';
import { SketchSelector } from './components/SketchSelector';
import { theme } from './theme';
import { ParameterSeed } from './components/ParameterSeed';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const availableSketches = [
    BaseSketch,
    DiamondSquareSketch,
    SortedFaceSketch,
    SquareCloudsSketch,
    GlitchyVHSSketch,
    WarpedSketch,
];

const sketchesNames = availableSketches.map((sketch) => sketch.sketchName);

function App() {
    const [CurrentSketch, setCurrentSketch] =
        useState<SketchType>(WarpedSketch);

    const [currentSketchName, setCurrentSketchName] = useState<string>(
        CurrentSketch.sketchName,
    );
    useEffect(() => {
        const newCurrentSketch = availableSketches.find(
            (sketch) => sketch.sketchName === currentSketchName,
        );
        if (newCurrentSketch === undefined) {
            throw new Error(`No sketch found with name ${currentSketchName}`);
        }
        setCurrentSketch(newCurrentSketch);

        setParamValues(getParametersInitialValues(newCurrentSketch.parameters));

        document.title = `${currentSketchName} [Generative Generator]`;
    }, [currentSketchName]);

    const [paramValues, setParamValues] = useState<
        ParameterValues<typeof CurrentSketch.parameters>
    >(getParametersInitialValues(CurrentSketch.parameters));

    const setSingleParameterSliderValue = (
        paramName: (typeof CurrentSketch.parameters)[number]['name'],
    ) => {
        return (value: number) =>
            setParamValues({ ...paramValues, [paramName]: value });
    };

    const setSingleParameterCheckboxValue = (
        paramName: (typeof CurrentSketch.parameters)[number]['name'],
    ) => {
        return (value: boolean) =>
            setParamValues({ ...paramValues, [paramName]: value });
    };

    return (
        <ThemeProvider theme={theme}>
            <PageContainer>
                <SketchContainer>
                    <ErrorBoundary FallbackComponent={SketchError}>
                        <TransformWrapper>
                            <TransformComponent
                                wrapperStyle={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <CurrentSketch.sketch
                                    paramValues={paramValues}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </ErrorBoundary>
                </SketchContainer>
                <Sidebar>
                    <SketchSelector
                        allSketchesNames={sketchesNames}
                        currentSketchName={currentSketchName}
                        setCurrentSketchName={setCurrentSketchName}
                    />
                    <Sidebar.Divider />
                    {CurrentSketch.parameters.map((parameter) => {
                        if (parameter.type === ParameterType.SEED) {
                            return (
                                <ParameterSeed
                                    value={
                                        paramValues[parameter.name] as number
                                    }
                                    setValue={setSingleParameterSliderValue(
                                        parameter.name,
                                    )}
                                    key={parameter.name}
                                    {...parameter}
                                />
                            );
                        } else if (parameter.type === ParameterType.SLIDER) {
                            return (
                                <ParameterSlider
                                    value={
                                        paramValues[parameter.name] as number
                                    }
                                    setValue={setSingleParameterSliderValue(
                                        parameter.name,
                                    )}
                                    key={parameter.name}
                                    {...parameter}
                                />
                            );
                        } else if (parameter.type === ParameterType.CHECKBOX) {
                            return (
                                <ParameterCheckbox
                                    checked={
                                        paramValues[parameter.name] as boolean
                                    }
                                    setValue={setSingleParameterCheckboxValue(
                                        parameter.name,
                                    )}
                                    key={parameter.name}
                                    {...parameter}
                                />
                            );
                        }
                    })}
                </Sidebar>
            </PageContainer>
        </ThemeProvider>
    );
}

export default App;

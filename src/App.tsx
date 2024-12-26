import { ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SketchType } from './algorithms/Sketch'
import BaseSketch from './algorithms/base/BaseSketch'
import DiamondSquareSketch from './algorithms/diamond-square/DiamondSquareSketch'
import SortedFaceSketch from './algorithms/sorted-face/SortedFaceSketch'
import SquareCloudsSketch from './algorithms/square-clouds/SquareCloudsSketch'
import { PageContainer } from './components/PageContainer'
import {
    getParametersInitialValues,
    ParameterValues,
} from './components/Parameter'
import { ParameterSlider } from './components/ParameterSlider'
import { Sidebar } from './components/Sidebar'
import { SketchContainer } from './components/SketchContainer'
import { SketchError } from './components/SketchError'
import { SketchSelector } from './components/SketchSelector'
import { theme } from './theme'

const availableSketches = [
    BaseSketch,
    DiamondSquareSketch,
    SortedFaceSketch,
    SquareCloudsSketch,
]

function App() {
    const [CurrentSketch, setCurrentSketch] =
        useState<SketchType>(DiamondSquareSketch)
    const [paramValues, setParamValues] = useState<
        ParameterValues<typeof CurrentSketch.parameters>
    >(getParametersInitialValues(CurrentSketch.parameters))

    useEffect(() => {
        setParamValues(getParametersInitialValues(CurrentSketch.parameters))
    }, [CurrentSketch])

    const setSingleParamValue = (
        paramName: (typeof CurrentSketch.parameters)[number]['name']
    ) => {
        return (value: number) =>
            setParamValues({ ...paramValues, [paramName]: value })
    }

    return (
        <ThemeProvider theme={theme}>
            <PageContainer>
                <SketchContainer>
                    <ErrorBoundary FallbackComponent={SketchError}>
                        <CurrentSketch.sketch paramValues={paramValues} />
                    </ErrorBoundary>
                </SketchContainer>
                <Sidebar>
                    <SketchSelector
                        allSketches={availableSketches}
                        currentSketch={CurrentSketch}
                        setCurrentSketch={setCurrentSketch}
                    />
                    <Sidebar.Divider />
                    {CurrentSketch.parameters.map((parameter) => (
                        <ParameterSlider
                            value={paramValues[parameter.name]}
                            setValue={setSingleParamValue(parameter.name)}
                            key={parameter.name}
                            {...parameter}
                        />
                    ))}
                </Sidebar>
            </PageContainer>
        </ThemeProvider>
    )
}

export default App

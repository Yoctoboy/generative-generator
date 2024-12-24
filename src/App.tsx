import { ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import {
    getParametersInitialValues,
    ParameterValues,
} from './algorithms/Parameter'
import { SketchType } from './algorithms/Sketch'
import BaseSketch from './algorithms/base/BaseSketch'
import DiamondSquareSketch from './algorithms/diamond-square/DiamondSquareSketch'
import SortedFaceSketch from './algorithms/sorted-face/SortedFaceSketch'
import { PageContainer } from './components/PageContainer'
import { ParameterSlider } from './components/ParameterSlider'
import { Sidebar } from './components/Sidebar'
import { SketchContainer } from './components/SketchContainer'
import { SketchSelector } from './components/SketchSelector'
import { theme } from './theme'

const availableSketches = [BaseSketch, DiamondSquareSketch, SortedFaceSketch]

function App() {
    const [CurrentSketch, setCurrentSketch] =
        useState<SketchType>(SortedFaceSketch)
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
                    <CurrentSketch.sketch paramValues={paramValues} />
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

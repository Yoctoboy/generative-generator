import { useState } from 'react'
import { Parameter, ParameterValues } from './algorithms/Parameter'
import { SketchType } from './algorithms/Sketch'
import BaseSketch from './algorithms/base/BaseSketch'
import DiamondSquareSketch from './algorithms/diamond-square/DiamondSquareSketch'
import { getParametersInitialValues } from './algorithms/getParametersInitialValues'
import { PageContainer } from './components/PageContainer'
import { ParameterSlider } from './components/ParameterSlider'
import { Sidebar } from './components/Sidebar'
import { SketchContainer } from './components/SketchContainer'
import { SketchSelector } from './components/SketchSelector'

const availableSketches = [BaseSketch, DiamondSquareSketch]

function App() {
    const [CurrentSketch, setCurrentSketch] = useState<SketchType>(
        availableSketches[0]
    )
    const [paramValues, setParamValues] = useState<
        ParameterValues<Parameter[]>
    >(getParametersInitialValues(DiamondSquareSketch.parameters))
    const setSingleParamValue = (
        paramName: (typeof DiamondSquareSketch.parameters)[number]['name']
    ) => {
        return (value: number) =>
            setParamValues({ ...paramValues, [paramName]: value })
    }

    return (
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
                <Sidebar.SketchTitle>
                    {CurrentSketch.sketchName}
                </Sidebar.SketchTitle>
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
    )
}

export default App

import { useState } from 'react'
import { Parameter, ParameterValues } from './algorithms/Parameter'
import Sketch from './algorithms/base/Sketch'
import { getParametersInitialValues } from './algorithms/getParametersInitialValues'
import { PageContainer } from './components/PageContainer'
import { ParameterSlider } from './components/ParameterSlider'
import { Sidebar } from './components/Sidebar'
import { SketchContainer } from './components/SketchContainer'

function App() {
    const [paramValues, setParamValues] = useState<
        ParameterValues<Parameter[]>
    >(getParametersInitialValues(Sketch.parameters))
    const setSingleParamValue = (
        paramName: (typeof Sketch.parameters)[number]['name']
    ) => {
        return (value: number) =>
            setParamValues({ ...paramValues, [paramName]: value })
    }

    return (
        <PageContainer>
            <SketchContainer>
                <Sketch paramValues={paramValues} />
            </SketchContainer>
            <Sidebar>
                <Sidebar.SketchTitle>{Sketch.sketchName}</Sidebar.SketchTitle>
                <Sidebar.Divider />
                {Sketch.parameters.map((parameter) => (
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

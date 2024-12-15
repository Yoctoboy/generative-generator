import './App.css'
import { ReactP5Wrapper } from '@p5-wrapper/react'
import { baseSketch } from './algorithms/base/sketch'
import { ParameterSlider } from './components/ParameterSlider'

function App() {
    return (
        <>
            <ReactP5Wrapper sketch={baseSketch.sketch} />
            {baseSketch.parameters.map((parameter) => (
                <ParameterSlider key={parameter.name} {...parameter} />
            ))}
        </>
    )
}

export default App

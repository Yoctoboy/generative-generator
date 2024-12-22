import { Divider } from './Divider'
import { SketchTitle } from './SketchTitle'

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                width: '26%',
                backgroundColor: 'var(--sidebar-background)',
                height: '100vh',
                padding: '2rem 1rem',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
            }}
        >
            {children}
        </div>
    )
}

Sidebar.Divider = Divider
Sidebar.SketchTitle = SketchTitle

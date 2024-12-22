export const SketchContainer = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <div
            style={{
                flex: 1,
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'var(--background-grey)',
            }}
        >
            {children}
        </div>
    )
}

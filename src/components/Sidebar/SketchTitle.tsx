export const SketchTitle = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                color: 'var(--white-title)',
                fontSize: 20,
                textAlign: 'center',
            }}
        >
            {children}
        </div>
    )
}

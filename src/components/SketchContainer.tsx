export const SketchContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div
            style={{
                flex: 1,
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                backgroundColor: 'var(--background-grey)',
                overflow: 'auto',
                padding: '60px',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </div>
    );
};

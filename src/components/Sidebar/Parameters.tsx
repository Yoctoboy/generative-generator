export const Parameters = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: '1.5rem',
                overflow: 'scroll',
                paddingBottom: '40px'
            }}
        >
            {children}
        </div>
    );
};
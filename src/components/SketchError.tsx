export const SketchError = ({ error }: { error: Error }) => {
    return (
        <div
            style={{
                borderRadius: '8px',
                backgroundColor: 'var(--error-background)',
                padding: '25px',
                margin: '80px',
            }}
        >
            <p
                style={{
                    fontWeight: '800',
                    fontSize: '20px',
                    color: 'var(--error-text)',
                }}
            >{`ERROR: ${error.name}`}</p>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>
                {error.message}
            </p>
            <p style={{ fontWeight: '600', fontSize: '14px' }}>
                {error.stack?.split('\n').map((s) => <p key={s}>{s}</p>)}
            </p>
        </div>
    );
};

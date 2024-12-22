export const PageContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
            {children}
        </div>
    )
}

export const WhiteText = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ color: 'var(--white-title)', fontSize: 18 }}>
            {children}
        </div>
    )
}

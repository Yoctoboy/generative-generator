import { DownloadButton } from '../DownloadButton';
import { Divider } from './Divider';

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                width: '26%',
                backgroundColor: 'var(--sidebar-background)',
                height: '100vh',
                padding: '2rem 1.5rem',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
            }}
        >
            <div
                style={{
                    backgroundColor: 'var(--sidebar-background)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: '2.5rem',
                }}
            >
                {children}
            </div>
            <DownloadButton />
        </div>
    );
};

Sidebar.Divider = Divider;

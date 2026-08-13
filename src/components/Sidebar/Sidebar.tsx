import { DownloadButton } from '../DownloadButton';
import { Divider } from './Divider';
import { Parameters } from './Parameters';

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
                gap: '1.5rem',
            }}
        >
            {children}
            <DownloadButton />
        </div>
    );
};

Sidebar.Divider = Divider;
Sidebar.Parameters = Parameters;


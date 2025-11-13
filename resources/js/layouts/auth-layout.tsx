import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({ children, title, description, showHeader, ...props }: { children: React.ReactNode; title: string; description: string; showHeader?: boolean }) {
    return (
        <AuthLayoutTemplate title={title} description={description} showHeader={showHeader} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}

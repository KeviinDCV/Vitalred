import { type ComponentProps } from 'react';

interface AppLogoIconProps extends ComponentProps<'img'> {
    size?: number;
}

export default function AppLogoIcon({ size = 36, className, ...props }: AppLogoIconProps) {
    return (
        <img
            src="/images/logo.png"
            alt="Vital Red Logo"
            width={size}
            height={size}
            className={className}
            {...props}
        />
    );
}

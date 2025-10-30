import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="size-8" />
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-slate-700 text-base">
                    HERMES
                </span>
            </div>
        </>
    );
}

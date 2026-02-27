export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="size-6 object-contain"
                />
            </div>
            <div className="ms-2 grid flex-1 text-start text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Edge Curve
                </span>
            </div>
        </>
    );
}

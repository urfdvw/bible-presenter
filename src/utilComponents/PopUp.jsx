import NewWindow from "react-new-window";

export default function PopUp({
    children,
    altChildren = <></>,
    popped,
    setPopped,
    title = "",
    parentStyle,
    handlePopupOpen = () => {},
}) {
    return popped ? (
        <>
            {altChildren}
            <NewWindow
                title={title}
                onUnload={() => {
                    setPopped(false);
                    handlePopupOpen(null);
                }}
                onOpen={handlePopupOpen}
            >
                {children}
            </NewWindow>
        </>
    ) : (
        <div style={parentStyle}>{children}</div>
    );
}

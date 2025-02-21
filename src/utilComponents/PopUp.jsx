import NewWindow from "react-new-window";
import { Button, Typography } from "@mui/material";

export default function PopUp({
    children,
    altChildren = null,
    popChildren = null,
    popped,
    setPopped,
    title = "",
    parentStyle,
    handlePopupOpen = () => {},
}) {
    if (!altChildren) {
        altChildren = (
            <Typography>
                <p>此窗口已弹出</p>
                <Button
                    onClick={() => {
                        setPopped(false);
                    }}
                    style={{
                        textTransform: "none",
                    }}
                    variant="contained"
                >
                    收回窗口
                </Button>
            </Typography>
        );
    }
    if (!popChildren) {
        popChildren = children;
    }

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
                {popChildren}
            </NewWindow>
        </>
    ) : (
        <div style={parentStyle}>{children}</div>
    );
}

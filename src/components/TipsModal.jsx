import { useEffect, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MarkdownExtended from "../utilComponents/MarkdownExtended";

function getRandomIndex(length, currentIndex = -1) {
    if (!length) {
        return -1;
    }
    if (length === 1) {
        return 0;
    }
    let next = Math.floor(Math.random() * length);
    while (next === currentIndex) {
        next = Math.floor(Math.random() * length);
    }
    return next;
}

export default function TipsModal({ tips, showOnStartup = true }) {
    const safeTips = useMemo(() => (Array.isArray(tips) ? tips : []), [tips]);
    const [open, setOpen] = useState(false);
    const [tipIndex, setTipIndex] = useState(-1);

    useEffect(() => {
        if (!showOnStartup || !safeTips.length) {
            setOpen(false);
            return;
        }
        setTipIndex(getRandomIndex(safeTips.length));
        setOpen(true);
    }, [safeTips, showOnStartup]);

    const handleNext = () => {
        setTipIndex((current) => getRandomIndex(safeTips.length, current));
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!safeTips.length || tipIndex < 0) {
        return null;
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(720px, 92vw)",
                    maxHeight: "80vh",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h6">小贴士 💡</Typography>
                <Box sx={{ overflowY: "auto", minHeight: 120 }}>
                    <MarkdownExtended>{safeTips[tipIndex]}</MarkdownExtended>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={handleNext} variant="outlined">
                        下一个
                    </Button>
                    <Button onClick={handleClose} variant="contained">
                        知道了
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

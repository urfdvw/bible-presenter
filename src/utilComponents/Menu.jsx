import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

export default function Menu({ label, options, color }) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (event?.target && anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                style={{
                    textTransform: "none",
                    color: color,
                    minWidth: "30px",
                }}
            >
                {label}
            </Button>
            <Popover
                open={open}
                anchorEl={anchorRef.current}
                disablePortal
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{ paper: { style: { zIndex: 200 } } }}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                        >
                            {options.map((opt) => (
                                <MenuItem
                                    onClick={(event) => {
                                        handleClose(event);
                                        opt.handler();
                                    }}
                                    key={"item_key_" + opt.text}
                                >
                                    {opt.text}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popover>
        </>
    );
}

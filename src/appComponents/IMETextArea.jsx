import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextField, Paper, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { styled } from "@mui/system";

//
// Styles
//
const Container = styled("div")({
    position: "relative",
    width: "100%",
});

const Mirror = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden", // keep it hidden from the user
    whiteSpace: "pre-wrap", // matches TextField multiline behavior
    wordWrap: "break-word",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: 1.5,
    padding: "16.5px 14px", // match MUI TextField internal padding
    border: "1px solid transparent",
    boxSizing: "border-box",
    width: "100%",
    overflowWrap: "break-word",
});

const RecommendationBox = styled(Paper)(({ top, left }) => ({
    position: "absolute",
    top,
    left,
    width: 300,
    overflowY: "auto",
    zIndex: 99999,
}));

//
// Scoring function: more matched prefix => higher score; tiebreak by shorter candidate.
//
function computeScore(input, candidate) {
    let matchCount = 0;
    for (let i = 0; i < candidate.length && i < input.length; i++) {
        if (candidate[i] === input[i]) {
            matchCount++;
        } else {
            break;
        }
    }
    // Example weighting: matchCount * 10 - candidate.length
    return matchCount * 10 - candidate.length;
}

/**
 * Return partial matches for the last word, sorted by score,
 * then remove duplicates by dictionary value (keeping top-scoring one).
 */
function getRecommendations(inputValue, dictionary) {
    const words = inputValue.split(/\s+/);
    const lastWord = words[words.length - 1].toLowerCase();

    if (!lastWord) return [];

    // Collect all keys whose prefix matches lastWord
    const candidates = [];
    for (const key of Object.keys(dictionary)) {
        if (key.toLowerCase().startsWith(lastWord)) {
            candidates.push(key);
        }
    }

    // Sort by score (descending)
    candidates.sort((a, b) => {
        const scoreA = computeScore(lastWord, a.toLowerCase());
        const scoreB = computeScore(lastWord, b.toLowerCase());
        return scoreB - scoreA;
    });

    // Remove duplicates by dictionary value
    // Keep only the first occurrence (which is the highest score).
    const seenValues = new Set();
    const uniqueCandidates = [];
    for (const candidate of candidates) {
        const value = dictionary[candidate];
        if (!seenValues.has(value)) {
            seenValues.add(value);
            uniqueCandidates.push(candidate);
        }
    }

    // Return the top 10 unique candidates
    return uniqueCandidates.slice(0, 10);
}

export default function IMETextArea({ text, setText, DICTIONARY, onDisplay, onPreview, onAddToNote }) {
    const [recommendations, setRecommendations] = useState([]);
    const [anchorCoords, setAnchorCoords] = useState({ top: 0, left: 0 });
    const [selectionStart, setSelectionStart] = useState(0);

    const textFieldRef = useRef(null);
    const mirrorRef = useRef(null);

    //
    // Whenever text changes, recompute recommendations.
    //
    useEffect(() => {
        const newRecs = getRecommendations(text, DICTIONARY);
        setRecommendations(newRecs);
    }, [text, DICTIONARY]);

    //
    // Keep track of the caret's position (selectionStart).
    //
    const updateSelectionStart = useCallback(() => {
        if (textFieldRef.current) {
            setSelectionStart(textFieldRef.current.selectionStart);
        }
    }, []);

    //
    // Use a hidden <span> in the "mirror" to measure the exact caret location.
    // We'll replicate the entire text, inserting a zero-width space at selectionStart.
    //
    const updateCaretPosition = useCallback(() => {
        if (!mirrorRef.current || !textFieldRef.current) return;

        const mirror = mirrorRef.current;
        // Sync the mirror's scroll positions if the TextField can scroll
        mirror.scrollTop = textFieldRef.current.scrollTop;
        mirror.scrollLeft = textFieldRef.current.scrollLeft;

        // Replicate the entire text. Insert a span at selectionStart.
        const beforeCaret = text.slice(0, selectionStart);
        const afterCaret = text.slice(selectionStart);

        mirror.innerHTML = "";

        const beforeTextNode = document.createTextNode(beforeCaret);
        mirror.appendChild(beforeTextNode);

        // Insert a <span> with a zero-width space
        const caretSpan = document.createElement("span");
        caretSpan.textContent = "\u200B"; // zero-width space
        mirror.appendChild(caretSpan);

        const afterTextNode = document.createTextNode(afterCaret);
        mirror.appendChild(afterTextNode);

        // Measure bounding rect of the caretSpan
        const spanRect = caretSpan.getBoundingClientRect();
        const containerRect = mirror.getBoundingClientRect();

        const top = spanRect.top - containerRect.top;
        const left = spanRect.left - containerRect.left;

        // Offset downward so the pop-up doesn't overlap the text line
        setAnchorCoords({
            top: top + 24,
            left,
        });
    }, [text, selectionStart]);

    //
    // Update caret position whenever text or selectionStart changes.
    //
    useEffect(() => {
        updateCaretPosition();
    }, [text, selectionStart, updateCaretPosition]);

    //
    // Text changes
    //
    const handleChange = (event) => {
        setText(event.target.value);
        updateSelectionStart();
    };

    // HANDLER: Enter
    const handleEnter = (event) => {
        event.preventDefault();
        setText("");
        console.log("Enter pressed");
        onDisplay();
        // You can handle the normal Enter action here if desired
    };

    // HANDLER: Shift+Enter
    const handleShiftEnter = (event) => {
        event.preventDefault();
        console.log("Shift-Enter pressed");
        onPreview();
        // Handle multi-line break, for example, if you want special logic
    };

    // HANDLER: Ctrl/Cmd+Enter
    const handleCtrlEnter = (event) => {
        event.preventDefault();
        setText("");
        console.log("Ctrl/Cmd-Enter pressed");
        onAddToNote();
        // Possibly handle form submission or something else
    };

    //
    // If we have recommendations, pressing 1..9 picks that item.
    //
    const handleKeyDown = (event) => {
        // Detect Enter variants first
        if (event.key === "Enter") {
            if (event.shiftKey) {
                handleShiftEnter(event);
            } else if (event.ctrlKey || event.metaKey) {
                handleCtrlEnter(event);
            } else {
                handleEnter(event);
            }
        }

        // Now handle numeric recommendation picks
        if (recommendations.length === 0) return;
        const num = parseInt(event.key, 10);
        if (!isNaN(num) && num >= 1 && num <= recommendations.length) {
            // Replace last word with dictionary value
            const chosenKey = recommendations[num - 1];
            const chosenValue = DICTIONARY[chosenKey];

            const words = text.split(/\s+/);
            words[words.length - 1] = chosenValue;
            const newText = words.join(" ");
            setText(newText);

            event.preventDefault();

            // Move the caret to the end of the replaced text
            requestAnimationFrame(() => {
                if (textFieldRef.current) {
                    textFieldRef.current.setSelectionRange(newText.length, newText.length);
                    setSelectionStart(newText.length);
                }
            });
        }
    };

    //
    // Mouse down on a recommendation -> replace last word
    // Prevent default to avoid losing focus, then re-focus text field.
    //
    const handleRecommendationClick = (candidate) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const words = text.split(/\s+/);
        words[words.length - 1] = DICTIONARY[candidate];
        const newText = words.join(" ");
        setText(newText);

        requestAnimationFrame(() => {
            textFieldRef.current?.focus();
            textFieldRef.current?.setSelectionRange(newText.length, newText.length);
            setSelectionStart(newText.length);
        });
    };

    return (
        <Container>
            <TextField
                inputRef={textFieldRef}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onClick={updateSelectionStart}
                onSelect={updateSelectionStart}
                onKeyUp={updateSelectionStart}
                variant="outlined"
                fullWidth
            />

            {/* Hidden mirror for caret measurement */}
            <Mirror ref={mirrorRef} />

            {recommendations.length > 0 && (
                <RecommendationBox top={anchorCoords.top} left={anchorCoords.left}>
                    <List dense>
                        {recommendations.slice(0, 9).map((candidate, index) => (
                            <ListItem key={candidate} disablePadding>
                                <ListItemButton onMouseDown={handleRecommendationClick(candidate)}>
                                    <Typography variant="body2">
                                        <strong>{index + 1}.</strong> {DICTIONARY[candidate]}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </RecommendationBox>
            )}
        </Container>
    );
}

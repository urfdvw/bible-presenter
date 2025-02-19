import React from "react";

export default function HighlightedSpan({ longString, shortString }) {
    // If there's no short string or it's empty, just render the longString as-is
    if (!shortString) {
        return <span>{longString}</span>;
    }

    // Build a case-insensitive regex to find all occurrences of shortString
    const regex = new RegExp(`(${shortString})`, "gi");

    // Split the longString on every match of shortString.
    // The split array will include the matched string as separate elements.
    const parts = longString.split(regex);

    return (
        <span>
            {parts.map((part, index) =>
                // Check if this part of the split is the highlighted text
                part.toLowerCase() === shortString.toLowerCase() ? (
                    // Highlight match
                    <span
                        key={index}
                        style={{
                            backgroundColor: "#ff9090",
                            fontWeight: "bold",
                        }}
                    >
                        {part}
                    </span>
                ) : (
                    // Normal text
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
}

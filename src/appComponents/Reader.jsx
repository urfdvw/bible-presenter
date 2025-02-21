import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

// Utility function to compare two arrays for equality.
const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

export default function Reader({ data, currentPosition, setFirstIndexes, pageUp, pageDown }) {
    const containerRef = useRef(null);
    // Store the previously computed indexes to avoid redundant state updates.
    const prevFirstIndexesRef = useRef([]);

    // Helper function to compute the first index in each column.
    const computeFirstIndexes = () => {
        if (containerRef.current) {
            const children = containerRef.current.children;
            const newIndexes = [];
            const seenOffsets = new Set();
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const offsetLeft = child.offsetLeft;
                // If this offsetLeft is not yet seen, it's the first in its column.
                if (!seenOffsets.has(offsetLeft)) {
                    seenOffsets.add(offsetLeft);
                    newIndexes.push(i + 1);
                }
            }
            // Only update external state if the computed indexes have changed.
            if (!arraysEqual(prevFirstIndexesRef.current, newIndexes)) {
                prevFirstIndexesRef.current = newIndexes;
                setFirstIndexes(newIndexes);
                console.log("setFirstIndexes", newIndexes);
            }
        }
    };

    // Run computeFirstIndexes on mount and whenever 'data' changes.
    useEffect(() => {
        computeFirstIndexes();
    }, [data]);

    // Setup a ResizeObserver on the container to listen for size changes.
    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) return;

        const resizeObserver = new ResizeObserver(() => {
            computeFirstIndexes();
        });
        resizeObserver.observe(containerElement);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                height: "100%",
            }}
        >
            {data.map((string, index) => (
                <Box key={index} sx={{ border: "solid 1px", width: "calc(100% - 2px)" }}>
                    {string}
                </Box>
            ))}
        </Box>
    );
}

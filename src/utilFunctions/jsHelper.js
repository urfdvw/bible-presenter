/**
 * Compare two arrays (arr1, arr2) in a Python-like lexicographical manner.
 * Returns:
 *  -1 if arr1 < arr2
 *   0 if arr1 == arr2
 *   1 if arr1 > arr2
 */
export function compareLists(arr1, arr2) {
    const len = Math.min(arr1.length, arr2.length);

    for (let i = 0; i < len; i++) {
        if (arr1[i] < arr2[i]) {
            return -1;
        }
        if (arr1[i] > arr2[i]) {
            return 1;
        }
        // if equal, move on to the next element
    }

    // If all compared elements are equal, then the shorter array is "less"
    if (arr1.length < arr2.length) {
        return -1;
    }
    if (arr1.length > arr2.length) {
        return 1;
    }
    return 0; // same length and same elements
}

export function sortAndUnique(array) {
    // Use Set to remove duplicates, then spread into an array and sort
    return [...new Set(array)].sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
}

export function removeAllDuplicatesKeepLast(data) {
    // A helper to generate a unique key for each object
    const getKey = (obj) => `${obj.book}:${obj.chapter}:${obj.verse}:${obj.endChapter}:${obj.endVerse}`;

    const seen = new Set();
    const result = [];

    // Loop from end to start
    for (let i = data.length - 1; i >= 0; i--) {
        const item = data[i];
        const key = getKey(item);

        // If we haven't seen this exact object shape yet,
        // add it to the result and mark as seen
        if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }

    // The result is in reverse order, so reverse it back
    return result.reverse();
}

export function downloadFile(content, name) {
    // 1. Create a Blob object from the text content
    const blob = new Blob([content], { type: "text/plain" });

    // 2. Generate a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // 3. Create a hidden <a> element programmatically
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "untitled.txt";

    // 4. Programmatically click the link to trigger the download
    link.click();

    // 5. Release the object URL
    URL.revokeObjectURL(url);
}

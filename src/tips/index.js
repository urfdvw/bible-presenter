import tipsMarkdown from "./tips.md?raw";

function parseTips(markdownText) {
    return markdownText
        .split(/\n\s*---+\s*\n/g)
        .map((tip) => tip.trim())
        .filter((tip) => tip.length > 0);
}

const tips = parseTips(tipsMarkdown);

export { parseTips, tips };

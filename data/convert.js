// Import the necessary modules
import { promises as fs } from "fs";
import path from "path";

const templatePath = path.join(process.cwd(), "./", "./asv.json");
const templateContent = await fs.readFile(templatePath, "utf8");
const template = JSON.parse(templateContent);

const esvPath = path.join(process.cwd(), "./", "./esvdata.json");
const esvContent = await fs.readFile(esvPath, "utf8");
const esv = JSON.parse(esvContent);

for (var i = 0; i < template.verses.length; i++) {
    try {
        template.verses[i].text = "";
        template.verses[i].text =
            esv["" + template.verses[i].book]["" + template.verses[i].chapter]["" + template.verses[i].verse];
    } catch {
        console.log(template.verses[i]);
        template.verses[i].text = "";
    }
}

console.log(template.verses.length);

function countLeaves(obj) {
    // If `obj` is null or not an object (string, number, boolean, etc.),
    // we consider it a leaf node.
    if (obj === null || typeof obj !== "object") {
        return 1;
    }

    let count = 0;

    // If `obj` is an array, recurse for each element
    if (Array.isArray(obj)) {
        for (const item of obj) {
            count += countLeaves(item);
        }
    }
    // If `obj` is an object, recurse for each key
    else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                count += countLeaves(obj[key]);
            }
        }
    }

    return count;
}
console.log(countLeaves(esv));

for (var b in esv) {
    for (var c in esv[b]) {
        for (var v in esv[b][c]) {
            const matched = template.verses.filter(
                (verse) => "" + verse.book === b && "" + verse.chapter === c && "" + verse.verse === v
            );
            if (matched.length !== 1) {
                console.log([b, c, v], esv[b][c][v], matched);
            }
        }
    }
}

const outputPath = path.join(process.cwd(), ".", "esv.json");
await fs.writeFile(outputPath, JSON.stringify(template));

import about from "./about.md";
import home from "./home.md";
import hotkeys from "./hotkeys.md";
import notes from "./notes.md";
import quick_locate from "./quick_locate.md";
import preview from "./preview.md";
import workflows from "./workflows.md";

const docs = [
    {
        name: "home",
        title: "帮助首页",
        body: home,
    },
    {
        name: "quick_locate",
        title: "快速定位",
        body: quick_locate,
    },
    {
        name: "preview",
        title: "预览",
        body: preview,
    },
    {
        name: "notes",
        title: "笔记",
        body: notes,
    },
    {
        name: "hotkeys",
        title: "快捷键",
        body: hotkeys,
    },
    {
        name: "workflows",
        title: "应用场景",
        body: workflows,
    },
    {
        name: "about",
        title: "关于",
        body: about,
    },
];
export default docs;

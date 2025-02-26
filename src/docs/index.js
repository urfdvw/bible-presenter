import about from "./about.md";
import home from "./home.md";
import quick_locate from "./quick_locate.md";

const docs = [
    {
        name: "home",
        title: "帮助首页",
        body: home,
    },
    {
        name: "quick_locate",
        title: "快速投影",
        body: quick_locate,
    },
    {
        name: "about",
        title: "关于",
        body: about,
    },
];
export default docs;

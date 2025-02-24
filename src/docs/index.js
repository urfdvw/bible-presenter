import about from "./about.md";
import home from "./home.md";
import quick_locate from "./quick_locate.md";

const docs = [
    {
        name: "home",
        title: "简介",
        body: home,
    },
    {
        name: "quick_locate",
        title: "快速投影",
        body: quick_locate,
    },
    {
        name: "about",
        title: "作者信息",
        body: about,
    },
];
export default docs;

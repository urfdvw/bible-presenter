import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import supersub from "remark-supersub";

export default function MarkdownExtended({ children }) {
    return (
        <Typography component="div">
            <Markdown
                className="markdown-body"
                remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath, supersub]}
                components={{
                    a: (props) => {
                        return props.href.startsWith("http") ? (
                            <a href={props.href} target="_blank" rel="noreferrer">
                                {props.children}
                            </a>
                        ) : (
                            <a href={props.href}>{props.children}</a>
                        );
                    },
                }}
            >
                {children}
            </Markdown>
        </Typography>
    );
}

MarkdownExtended.propTypes = {
    children: PropTypes.elementType,
};

import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { Box, TextField, Button, Typography } from "@mui/material";
import { SearchVerseBox } from "./VerseBox";

export default function TextSearch() {
    const { getSelectedVersions } = useContext(AppContext);
    const data = getSelectedVersions();

    // State for the input text
    const [searchTerm, setSearchTerm] = useState("");
    // State for the filtered results
    const [filteredResults, setFilteredResults] = useState([]);
    // Current page state (1-based index)
    const [currentPage, setCurrentPage] = useState(1);
    // Warning message if the input is too short
    const [warning, setWarning] = useState("");

    // Number of items (verses) per page
    const resultsPerPage = 10;

    // Flatten all verses from the data
    const allVerses = data.flatMap((item) => item.verses);

    // Handle search logic
    const handleSearch = () => {
        // Check if input is pure English letters only
        const isPureEnglish = /^[a-zA-Z]*$/.test(searchTerm);

        if (searchTerm.length === 0) {
            // If pure English but shorter than 2 characters
            setWarning("请输入需要搜索的文字。");
            setFilteredResults([]);
            return;
        } else if (isPureEnglish && searchTerm.length < 2) {
            // If pure English but shorter than 2 characters
            setWarning("如要搜索英文经文，请输入至少2个字母。");
            setFilteredResults([]);
            return;
        } else {
            setWarning("");
        }

        // Filter verses that include the searchTerm in their text (case-insensitive)
        const results = allVerses.filter((verse) => verse.text.toLowerCase().includes(searchTerm.toLowerCase()));

        setFilteredResults(results);
        setCurrentPage(1); // Reset to first page when new search
    };

    // Trigger search on pressing 'Enter'
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // Pagination: compute the current page's slice
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentPageResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

    // Total number of pages
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

    // Handlers for page navigation
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // A simple pagination control you can style/expand
    const renderPaginationControls = () => (
        <Box display="flex" alignItems="center" justifyContent="center" my={2}>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                上一页
            </Button>
            <Typography variant="body1">
                第{currentPage}页，共{totalPages || 1}页
            </Typography>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                下一页
            </Button>
        </Box>
    );

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            {/* Search input and button */}
            <Box display="flex" sx={{ flexGrow: 0 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button variant="outlined" onClick={handleSearch}>
                    搜索
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {/* Warning message if needed */}
                {warning && (
                    <Typography color="error" mb={2}>
                        {warning}
                    </Typography>
                )}

                {/* Display the current page of results */}
                {currentPageResults.map((verse, index) => (
                    <SearchVerseBox
                        verseObj={verse}
                        keyWords={searchTerm}
                        key={`${verse.book}-${verse.chapter}-${verse.verse}-${index}`}
                    />
                ))}

                {filteredResults.length == 0 && searchTerm && <Typography mb={2}>无相关经文</Typography>}
            </Box>

            {/* Bottom pagination controls */}
            {renderPaginationControls()}
        </Box>
    );
}

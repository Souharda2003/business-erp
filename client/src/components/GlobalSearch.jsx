import { useState } from "react";

import "../css/search.css";

function GlobalSearch() {

    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {

        alert("Searching : " + keyword);

    };

    const clearSearch = () => {

        setKeyword("");

    };

    return (

        <div className="search-container">

            <input

                className="search-input"

                type="text"

                placeholder="Search Purchase, Sales, Stock, LC..."

                value={keyword}

                onChange={(e) =>

                    setKeyword(e.target.value)

                }

            />

            <button

                className="search-btn"

                onClick={handleSearch}

            >

                Search

            </button>

            <button

                className="clear-btn"

                onClick={clearSearch}

            >

                Clear

            </button>

        </div>

    );

}

export default GlobalSearch;
import { useState } from "react";

import "../css/search.css";

function SearchBar({ onSearch }) {

    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {

        if (onSearch) {

            onSearch(keyword);

        }

    };

    return (

        <div className="search-container">

            <input

                className="search-input"

                type="text"

                placeholder="Search..."

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

        </div>

    );

}

export default SearchBar;
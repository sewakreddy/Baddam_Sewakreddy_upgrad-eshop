import React, { useState, useContext, useEffect } from "react";
import { SearchContext } from "../../common/search/SearchContext";
import { InputAdornment, OutlinedInput } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //To set the search term in SearchContext so that it can be used in Home component to filter products
  const { setSearchQuery } = useContext(SearchContext);

  const containerStyle = {
    textAlign: "center",
    width: "30%",
    position: "relative",
  };

  const iconWrappedStyle = {
    width: "100%",
    height: "50px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    color: "#FFFFF",
    borderRadius: "5px",
  };

  useEffect(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  return (
    <div style={containerStyle}>
      <OutlinedInput
        id="search"
        style={iconWrappedStyle}
        value={searchTerm}
        placeholder={"Search..."}
        onChange={handleInputChange}
        inputProps={{ "aria-label": "search" }}
        startAdornment={
          <InputAdornment position="start">
            <Search style={{ color: "#FFFFFF" }} />
          </InputAdornment>
        }
      />
    </div>
  );
};

export default SearchBar;

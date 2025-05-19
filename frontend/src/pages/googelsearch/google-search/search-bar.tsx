import * as React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,Card
} from "@mui/material";
import { Layout } from "antd";
const { Content, Sider } = Layout;

const SearchBar = (props: any) => {
  const handleReset = async (event: any) => {
    if (event) {
      event.preventDefault();
    }
    props.resetSearchRequest();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    props.handleSearch();
  };

  return (
    <>
        <Layout >
      
        
        <form onSubmit={handleSearch}>
          <div
            className="form-container"
            style={{
              fontFamily: "Bookman Old Style",
              fontSize: "12px",
            }}
          >
            <TextField
              className="form-item"
              label="Name"
              type="text"
              variant="outlined"
              autoComplete="off"
              onChange={(e) =>
                props.handleQueryParamsChange("query", e.target.value)
              }
              value={props.searchRequest.query}
              size="small"
              sx={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
              }}
            />

            <TextField
              className="form-item"
              label="Company"
              value={props.searchRequest.company}
              autoComplete="off"
              size="small"
              onChange={(e) =>
                props.handleQueryParamsChange("company", e.target.value)
              }
              sx={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
              }}
            />

            <TextField
              className="form-item"
              label="Location"
              value={props.searchRequest.location}
              autoComplete="off"
              size="small"
              onChange={(e) =>
                props.handleQueryParamsChange("location", e.target.value)
              }
              sx={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
              }}
            />

            <FormControl
              className="form-item"
              variant="outlined"
              sx={{ width: "15%", marginTop: "3px" }}
            >
              <InputLabel
                id="date-range-label"
                sx={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
              >
                Date Range
              </InputLabel>
              <Select
                labelId="date-range-label"
                id="date-range"
                size="small"
                value={props.searchRequest.dateRestrict}
                onChange={(e) =>
                  props.handleQueryParamsChange("dateRestrict", e.target.value)
                }
                label="Date Range:"
                sx={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
              >
                <MenuItem value="at">Any time</MenuItem>
                <MenuItem value="d1">Past hour</MenuItem>
                <MenuItem value="d24">Past 24 hours</MenuItem>
                <MenuItem value="w1">Past week</MenuItem>
                <MenuItem value="w2">Past 2 weeks</MenuItem>
                <MenuItem value="m1">Past month</MenuItem>
                <MenuItem value="m6">Past 6 months</MenuItem>
                <MenuItem value="y1">Past 1 year</MenuItem>
                <MenuItem value="y2">Past 2 years</MenuItem>
                <MenuItem value="y5">Past 5 years</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="form-item"
              sx={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
                marginTop: "2px",
                marginBottom: "8px",
              }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="form-item"
              onClick={handleReset}
              sx={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
                marginTop: "2px",
                marginBottom: "8px",
              }}
            >
              Reset
            </Button>

            <FormControl
              className="form-item"
              variant="outlined"
              sx={{ marginBottom: "3px", marginTop: "3px", width: "15%" }}
            >
              <InputLabel
                id="sort-by-label"
                sx={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
              >
                Sort by
              </InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={props.searchRequest.sort}
                onChange={(e) =>
                  props.handleQueryParamsChange("sort", e.target.value)
                }
                label="Sort by:"
                size="small"
                sx={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="title">title</MenuItem>
                <MenuItem value="viewCount">viewCount</MenuItem>
                <MenuItem value="rating">rating</MenuItem>
              </Select>
            </FormControl>
          </div>
        </form>
    
     
      </Layout>
    </>
  );
};

export default SearchBar;

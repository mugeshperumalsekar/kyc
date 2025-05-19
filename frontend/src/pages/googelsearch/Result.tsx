import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Result.css';
import { useLocation } from 'react-router-dom';
import stringSimilarity from 'string-similarity';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography } from '@mui/material';
import Header from '../../layouts/header/header';


interface APIParams {
    q: string;
    secondary: string;
    sort: string;
    tbm: string;
    news?: string;
    startIndex: number;
    accuracy: number;
    filter: string;
    after?: string;
    before?: string;
    sortOrder: string;
    dateBias: string;
    startDate?: string;
    endDate?: string;
    crime?: string;
    spam?: string;
    fraud?: string;
}
interface SearchResult {
    title: string;
    link: string;
    details?: {
        paragraphs: string[];
    };
    // Add other properties if needed
}

interface SearchResults {
    searchInformation: {
        totalResults: number;
        // Add other properties if needed
    };
    items: SearchResult[];
    // Add other properties if needed
}


function Search() {
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>({ searchInformation: { totalResults: 0 }, items: [] });

    const [currentPage, setCurrentPage] = useState(1);
    const [isNews, setIsNews] = useState(false); // define isNews state variable
    const resultsPerPage = 10; // number of results to show per page
    const [searchType, setSearchType] = useState('');
    const [secondaryquery, setSecondaryQuery] = useState('');
    const [secondarySearchQuery, setSecondarySearchQuery] = useState('');
    const [suggestedQuery, setSuggestedQuery] = useState('');
    const [sortBy, setSortBy] = useState('relevance');
    const [spamChecked, setSpamChecked] = useState(false);
    const [fraudChecked, setFraudChecked] = useState(false);
    const [crimeChecked, setCrimeChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [items, setItems] = useState([]);
    const [websiteOptions, setWebsiteOptions] = useState([]);
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [showPagination, setShowPagination] = useState(false);
    const [website, setWebsite] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [constWebsite, setConstWebsite] = useState([]);
    const [afterDate, setAfterDate] = useState('');
    const [beforeDate, setBeforeDate] = useState('');
    const [dateBias, setDateBias] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterBy, setFilterBy] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [similarityThreshold, setSimilarityThreshold] = useState(0);

    const handleSubmit = async (event: any) => {
        if (event) {
            event.preventDefault();
        }
        // event.preventDefault();
        try {
            let modifiedquery = query;
            if (isNews) {
                modifiedquery += ' newspaper';
            }
            if (selectedYear) {
                modifiedquery += ` ${selectedYear}`;
            }
            if (selectedWebsite) {
                modifiedquery += ` site:${selectedWebsite}`;
            }
            const startIndex = (currentPage - 1) * resultsPerPage;

            const params: APIParams = {
                q: `${modifiedquery} ${secondarySearchQuery}`,
                secondary: secondaryquery,
                sort: sortBy,
                tbm: 'nws',
                startIndex: startIndex,
                accuracy: accuracy,
                filter: filterBy,
                sortOrder: sortOrder,
                dateBias: dateBias,
            };
            if (crimeChecked) {
                params.crime = 'true';
            }
            if (spamChecked) {
                params.spam = 'true';
            }
            if (fraudChecked) {
                params.fraud = 'true';
            }
            if (afterDate) {
                params.after = new Date(afterDate).toISOString().slice(0, 10);
            }
            if (beforeDate) {
                params.before = new Date(beforeDate).toISOString().slice(0, 10);
            }

            const response = await axios.get('http://localhost:5000/api/search', {
                params: params,
            });
            const data = response.data;
            setResults(data);

            const similarityScores = data.items.map((item: { title: string; }) => {
                const similarityScore = stringSimilarity.compareTwoStrings(
                    query.toLowerCase(),
                    item.title.toLowerCase()
                );
                return similarityScore;
            });

            const filteredResults = data.items.filter((item: any, index: string | number) => {
                return similarityScores[index] >= similarityThreshold / 100;
            });
            setSearchResults(filteredResults);
            //   setSearchResults(data.items || []);
            setSearchPerformed(true);
            setShowResults(true);

            if (response.data.items) {
                if (data.spelling && data.spelling.correctedQuery !== searchQuery) {
                    setSuggestedQuery(data.spelling.correctedQuery);
                } else {
                    setSuggestedQuery('');
                }
            }
        } catch (error) {
            console.error(error);
            setSearchResults([]);
            setSuggestedQuery('');
        }
    };



    const handleQueryChange = (newQuery: React.SetStateAction<string>) => {
        setQuery(newQuery);
        handleSubmit(new Event('submit'));
    };


    const handleSortChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSortBy(event.target.value);
        handleSubmit(new Event('submit'));
    };


    const handleWebsiteChange = (event: { target: { value: React.SetStateAction<null>; }; }) => {
        setSelectedWebsite(event.target.value);
    };
    const handleSelect = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedOption(event.target.value);
        setWebsite(event.target.value);
    };
    const handleWebsiteSelect = (url: React.SetStateAction<null>) => {
        setSelectedWebsite(url);
    };
    const handleSearchTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchType(event.target.value);
    };

    if (results && results.items && results.items.length > 0) {
        const totalPages = Math.ceil(results.items.length / resultsPerPage);


    } else {

    }

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
        setStartIndex(startIndex - 20);
        handleSubmit(null); // Call handleSubmit with null argument
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        setStartIndex(startIndex + 20);
        handleSubmit(null); // Call handleSubmit with null argument
    };


    //     const handleResultClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: string | null) => {
    //     e.preventDefault();
    //     if (item && typeof item !== 'string') { // Check if item is not null and not a string
    //         axios
    //             .get(`http://localhost:5000/api/scrape?url=${item.link}`)
    //             .then((response) => {
    //                 setSelectedResult({
    //                     ...item,
    //                     details: {
    //                         paragraphs: response.data,
    //                     },
    //                 });
    //             })
    //             .catch((err) => console.error(err));
    //     } else {
    //         console.error("Invalid item or item is null.");
    //     }
    // };
    const handleResultClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: any) => {
        e.preventDefault();
        if (item && typeof item === 'object' && 'link' in item) {
            axios
                .get(`http://localhost:5000/api/scrape?url=${item.link}`)
                .then((response) => {
                    setSelectedResult({
                        ...item,
                        details: {
                            paragraphs: response.data,
                        },
                    });
                })
                .catch((err) => console.error(err));
        } else {
            console.error("Invalid item or item is null.");
        }
    };


    useEffect(() => {
        if (showResults) { // only fetch results if showResults is true
            handleSubmit(null);
        }
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) {
            setQuery(decodeURIComponent(q));
            setShowResults(true); // set showResults to true if there's a query parameter in the URL
        }
    }, [location, showResults, crimeChecked, spamChecked, fraudChecked]);


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <div className='frame'>
                            <div className='container'>

                                <form onSubmit={handleSubmit}>
                                    <br />
                                    <h1 className='multi-color' >Google Search Name</h1>

                                    <div className='app'>
                                        <input className='input_textapi' type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='ENHANCED BY Google' />
                                        <button className='search_button' type='submit'>Search</button>

                                        <input className='input_textapi'
                                            type='text'
                                            value={secondarySearchQuery}
                                            onChange={(e) => setSecondarySearchQuery(e.target.value)} placeholder='Secondary search'
                                        />

                                        <label htmlFor="after-date" >After:</label>
                                        <input className='after_data' type="date" value={afterDate} onChange={(e) => setAfterDate(e.target.value)} />
                                        <label htmlFor="before-date">Before:</label>
                                        <input className='after_data' type="date" value={beforeDate} onChange={(e) => setBeforeDate(e.target.value)} />

                                        <label className='label' style={{marginLeft:'55px'}}>
                                            Crime:
                                            <input type="checkbox" checked={crimeChecked} onChange={e => setCrimeChecked(e.target.checked)} />
                                        </label>
                                        <label className='label'>
                                            Spam:
                                            <input type="checkbox" checked={spamChecked} onChange={e => setSpamChecked(e.target.checked)} />
                                        </label>

                                        <label className='label'>
                                            Fraud:
                                            <input type="checkbox" checked={fraudChecked} onChange={e => setFraudChecked(e.target.checked)} />
                                        </label>

                                    </div>
                                    <label htmlFor='similarityThreshold'>Similarity Threshold:</label>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        step='1'
                                        value={similarityThreshold}
                                        onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                                        id='similarityThreshold'
                                    />
                                    <span>{similarityThreshold}%</span>

                                </form>

                                <div className='Sort by' style={{ textAlign: "right" , color:' white'}}>
                                    <span>Sort by:</span>
                                    <select value={sortBy} onChange={handleSortChange}>
                                        <option value="relevance">Date</option>
                                        <option value="date">Relevance</option>
                                    </select>
                                </div>
                                {results && results.items && results.items.length > 0 && results.searchInformation && (
                                    <p className='result' >
                                        Number of results: {results.searchInformation.totalResults} Search Time:{' '}
                                        {results.searchInformation.totalResults}
                                    </p>
                                )}


                                <hr />
                                {searchPerformed && (
                                    <div className='split-pane'>
                                        <div className='left-pane'>
                                            <div>
                                                {results && (
                                                    <div>

                                                        {suggestedQuery && (
                                                            <p>
                                                                Did you mean:{' '}
                                                                <a href='#' onClick={() => handleQueryChange(suggestedQuery)}>
                                                                    {suggestedQuery}
                                                                </a>
                                                            </p>
                                                        )}


                                                        {searchPerformed && (
                                                            <div>
                                                                {searchResults.length > 0 ? (
                                                                    <div>
                                                                        {searchResults.map((item: any) => {
                                                                            const regex = new RegExp(`(${query})`, 'gi');
                                                                            const title = item.title;
                                                                            const snippet = item.snippet ? item.snippet.replace(regex, '<mark>$1</mark>') : '';

                                                                            return (
                                                                                <div key={item.cacheId} onClick={() => setSelectedResult(item)}>
                                                                                    <a href={item.link} onClick={(e) => handleResultClick(e, item)} dangerouslySetInnerHTML={{ __html: title }} />
                                                                                    <p style={{ color: '#093' }}>{item.displayLink} </p>
                                                                                    <p style={{ color: '#093' }}>{item.category}</p>
                                                                                    {item.pagemap?.cse_thumbnail && (
                                                                                        <a href={item.link}>
                                                                                            <img src={item.pagemap.cse_thumbnail[0].src} alt={item.title} />
                                                                                        </a>
                                                                                    )}
                                                                                    <p dangerouslySetInnerHTML={{ __html: snippet }} />
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <p>No results found.</p>
                                                                )}
                                                            </div>
                                                        )}

                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        {selectedResult && (
                                            <div className='right-pane'>
                                                <div>
                                                    <h2>{selectedResult.title}</h2>
                                                    <p className='link'>
                                                        <a href={selectedResult.link}>{selectedResult.link}</a>
                                                    </p>
                                                    <div style={{ height: '1000px', overflow: 'auto' }}>
                                                        {selectedResult.details?.paragraphs &&
                                                            selectedResult.details.paragraphs.map((p: any, i: React.Key | null | undefined) => (
                                                                <p
                                                                    key={i}
                                                                    dangerouslySetInnerHTML={{ __html: p }}
                                                                ></p>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                            </div>
                            <div className='number' >
                                {results && results.searchInformation && results.searchInformation.totalResults > resultsPerPage && (
                                    <div className="gsc-cursor">
                                        {currentPage > 1 && (
                                            <a href="#" onClick={handlePrevPage}>Prev</a>
                                        )}
                                        {results.searchInformation.totalResults > 0 && (
                                            <a
                                                className={`gsc-cursor-page ${currentPage === 1 ? "gsc-cursor-current-page" : ""}`}
                                                aria-label="Page 1"
                                                href="#"
                                                onClick={() => {
                                                    setCurrentPage(1);
                                                    setStartIndex(0);
                                                    handleSubmit(null);
                                                }}
                                            >
                                                1
                                            </a>
                                        )}
                                        {results.items &&
                                            Array.from({ length: Math.min(10, Math.ceil(results.searchInformation.totalResults / resultsPerPage) - 1) }, (_, i) => i + 2).map((page, index) => (
                                                <a
                                                    key={index}
                                                    className={`gsc-cursor-page ${page === currentPage ? "gsc-cursor-current-page" : ""}`}
                                                    aria-label={`Page ${page}`}
                                                    href="#"
                                                    onClick={() => {
                                                        setCurrentPage(page);
                                                        setStartIndex((page - 1) * resultsPerPage);
                                                        handleSubmit(null);
                                                    }}
                                                >
                                                    {page}
                                                </a>
                                            ))}
                                        {results.searchInformation.totalResults > 10 * resultsPerPage && currentPage <= Math.ceil(results.searchInformation.totalResults / resultsPerPage) - 10 && (
                                            <span className="gsc-cursor-ellipsis">...</span>
                                        )}

                                        {currentPage < Math.ceil(results.searchInformation.totalResults / resultsPerPage) && (
                                            <a href="#" onClick={handleNextPage}>Next</a>
                                        )}
                                    </div>

                                )}
                            </div>
                            <div className='footer'>©&nbsp;2024&nbsp;Google</div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Search;




import "react-datepicker/dist/react-datepicker.css";
import 'simplebar-react/dist/simplebar.min.css';
import React, { useEffect, useState } from 'react';
import { Box, TextField, FormControl, InputLabel, MenuItem, Card, Select, Button, Grid, Typography, Checkbox, FormControlLabel,Chip  } from '@mui/material';




const ResultContent = (props:any) => {
  const [searchPerformed, setSearchPerformed] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [suggestedQuery, setSuggestedQuery] = useState('');
  const [query, setQuery] = useState('');



  const handleQueryChange = (newQuery: React.SetStateAction<string>) => {
    setQuery(newQuery);
  };

  
const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return 'N/A';

  const numStr = num.toString();
  const lastThree = numStr.slice(-3);
  const others = numStr.slice(0, -3);

  if (others !== '') {
      return others.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
};

  return (
    <>

       <div style={{ position: 'relative', width: '100%' }}>
                {props.resultData.totalSearchResults && (
                    <p className='results-nu' style={{ fontFamily: 'Bookman Old Style', fontSize: '12px', marginTop: '10px' }}>
                        Number of results: {formatNumber(props.resultData.totalSearchResults)}
                    </p>
                )}
                {searchPerformed && showResults && (
                    <Box>
                        {props.resultData.items && props.resultData.items.length === 0 ? (
                            <p style={{ fontFamily: 'Bookman Old Style', fontSize: '12px', marginTop: '10px' }}>No data available</p>
                        ) : (
                            <div>
                                {suggestedQuery && (
                                    <p style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                        Did you mean:{' '}
                                        <a href='#' onClick={() => handleQueryChange(suggestedQuery)} style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                            {suggestedQuery}
                                        </a>
                                    </p>
                                )}

                                <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 230px)' }}>
                                    {props.resultData.items && props.resultData.items.map((result:any, index:any) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Card className="search-result-card" sx={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                                <Box sx={{ display: 'flex' }}>
                                                    {result.image && (
                                                        <Box
                                                            sx={{
                                                                width: 60,
                                                                height: 60,
                                                                flexShrink: 0,
                                                                mr: 2,
                                                                backgroundImage: `url(${result.image})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                            }}
                                                        />
                                                    )}
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                                            {result.title}
                                                        </Typography>
                                                        <p style={{ color: '#093', margin: '1px', fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                                            {result.category}
                                                        </p>
                                                        {result.details && result.details.map((paragraph:any, index:any) => (
                                                            <Typography variant="body2" key={index} sx={{ marginTop: '10px', marginLeft: '1%', fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                                                {paragraph.paragraphs}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                                <Button
                                                    href={result.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                                                >
                                                    Read More
                                                </Button>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                               
                            </div>
                        )}
                    </Box>
                )}
            </div>
            
    {/* </Card> */}
  </>
  );
  
};

export default ResultContent;


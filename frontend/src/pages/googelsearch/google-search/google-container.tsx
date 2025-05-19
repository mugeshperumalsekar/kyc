


import React, { useState, useEffect } from "react";
import FilterSidebar from "./filter-sidebar";
import ResultContent from "./result-content";
// import GoogleSearchApiService from "../../data/services/google-search/google-search-api-service";
// import { CreateGoogleSearchRequest } from "../../data/services/google-search/google-search-payload";
// import AppLayout from "../../components/Layout";
import "./SearchResult.css";
import SearchBar from "./search-bar";
import { Box, Card, Pagination } from '@mui/material';
import { toast } from "react-toastify";
import { Layout } from "antd";
import GoogleSearchApiService from "../../../data/services/google-search/google-search-api-service";
import { CreateGoogleSearchRequest } from "../../../data/services/google-search/google-search-payload";
import AppLayout from "../../../components/Layout";

const GoogleContainer = () => {
  const { Content, Sider } = Layout;

  const [resultData, setResultData] = useState<{
    items: any[];
    totalSearchResults: number;
  }>({
    items: [],
    totalSearchResults: 0,
  });
  const [searchRequest, setSearchRequest] = useState<CreateGoogleSearchRequest>(
    {
      clientId: 0,
      userId: 0,
      query: "",
      company: "",
      location: "",
      startIndex: 1,
      perPage: 10,
      page: 1, // Initialize page to 1
      filter: "",
      dateRestrict: "at",
      sort: "",
      afterDate: "",
      beforeDate: "",
      news: "",
      onlySocialMedia: false,
      excludeSocialMedia: false,
      noneOfTheseWords: "",
      country: "",
      excludeTheseSites: [],
      filters: [],
      groupIds: [],
      onlyFromTheseSites: [],
      keywords: []
    });
  const googleSearchApiService = new GoogleSearchApiService();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    const page = parseInt(params.get('page') || '1', 10);

    setSearchRequest(prevState => ({
      ...prevState,
      query,
      page,
      startIndex: (page - 1) * prevState.perPage + 1,
    }));

    if (query) {
      handleSearch();
    }
  }, []);  
  useEffect(() => {
    if (searchRequest.query) {
      handleSearch(searchRequest.page, searchRequest.dateRestrict,searchRequest.filters,searchRequest.onlyFromTheseSites,searchRequest.excludeTheseSites,searchRequest.keywords);
    }
  }, [searchRequest.page, searchRequest.dateRestrict,searchRequest.filters,searchRequest.onlyFromTheseSites,searchRequest.excludeTheseSites,searchRequest.keywords]);


  const handleSearch = async (page: number = 1, dateRestrict: string = searchRequest.dateRestrict, filters: string[] = searchRequest.filters, onlyFromTheseSites: string[] = searchRequest.onlyFromTheseSites, excludeTheseSites: string[] = searchRequest.excludeTheseSites, keywords: string[]=searchRequest.keywords) => {
    const params = new URLSearchParams(window.location.search);
    params.set('q', searchRequest.query);
    params.set('page', searchRequest.page.toString()); // Update URL with current page
    window.history.replaceState(null, '', `?${params.toString()}`);
  
    try {
      if (!searchRequest.query) {
        toast.error("Name field should not be empty !");
        return;
      }
      const res = await googleSearchApiService.googleSearch(
        searchRequest.query,
        { ...searchRequest, dateRestrict ,filters,onlyFromTheseSites,excludeTheseSites,keywords} // Ensure dateRestrict is included in the request
      );
  
      setResultData({
        items: res.items || [],
        totalSearchResults: res.totalSearchResults || 0,
      });
    } catch (error) {
      console.error("Error fetching Data:", error);
    }
  };
  
  

  const handleQueryParamsChange = (key: any, value: any) => {
    setSearchRequest((prevState) => ({ ...prevState, [key]: value }));
    console.log('searchRequest', searchRequest);
  };

  const resetSearchRequest = () => {
    setSearchRequest({
      clientId: 0,
      userId: 0,
      query: "",
      company: "",
      location: "",
      startIndex: 1,
      perPage: 10,
      page: 1, // Reset page to 1
      filter: "",
      dateRestrict: "Any time",
      sort: "",
      afterDate: "",
      beforeDate: "",
      news: "",
      onlySocialMedia: false,
      excludeSocialMedia: false,
      noneOfTheseWords: "",
      country: "",
      excludeTheseSites: [],
      filters: [],
      groupIds: [],
      onlyFromTheseSites: [],
      keywords: []
    });
    setResultData({
      items: [],
      totalSearchResults: 0,
    });
    window.history.replaceState(null, '', window.location.pathname);

  };
  

  const handlePageChange = (event: any, page: number) => {
    setSearchRequest((prevState) => ({
      ...prevState,
      page: page,
      startIndex: (page - 1) * prevState.perPage + 1,
    }));
    handleSearch();
  };

  // Calculate total pages and limit to 10
  const totalPages = Math.ceil(resultData.totalSearchResults / searchRequest.perPage);
  const pagesToShow = Math.min(totalPages, 10);

  return (
    <>
      <AppLayout>
        <Box>
          <Layout style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <Sider width={200} className="site-layout-background" style={{ overflow: 'auto', height: '90vh', position: 'fixed', backgroundColor: 'lightblue' }}>
              <FilterSidebar handleSearch={handleSearch} handleQueryParamsChange={handleQueryParamsChange} searchRequest={searchRequest} />
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <Card className='card' sx={{ marginBottom: 2, padding: 2 }}>
                  <SearchBar
                    handleSearch={handleSearch} searchRequest={searchRequest} handleQueryParamsChange={handleQueryParamsChange} resetSearchRequest={resetSearchRequest} />
                  <ResultContent resultData={resultData} />

                  <Pagination
                    count={pagesToShow}
                    page={searchRequest.page}
                    onChange={handlePageChange}
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                  />
                </Card>
              </Content>
            </Layout>
          </Layout>
        </Box>
      </AppLayout>
    </>
  );
};

export default GoogleContainer;


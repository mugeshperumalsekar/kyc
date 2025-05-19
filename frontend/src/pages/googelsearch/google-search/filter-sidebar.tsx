

import React, { useState, useEffect } from 'react';
import { Layout, Typography, Form, Checkbox, Select, Button, DatePicker, Input, Tag } from 'antd';
import { countries } from '../../../json-data';
import GroupApiService from '../../../data/services/google-search/master/Group/group-api-service';
// import { countries } from '../../json-data';
// import GroupApiService from '../../data/services/master/Group/group-api-service';

const { Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

const FilterSidebar = (props: any) => {
  const [selectedWebsite, setSelectedWebsite] = useState<{ selectedWebsite: string }[]>([{ selectedWebsite: "" }]);
  const [onlyFromTheseSites, setOnlyFromTheseSites] = useState<string[]>([]);
  const [excludeTheseSites, setExcludeTheseSites] = useState<string[]>([]);
  const [keywordChips, setKeywordChips] = useState<string[]>([]);
  const [currentSite, setCurrentSite] = useState<string>('');
  const [currentExcludeSite, setCurrentExcludeSite] = useState<string>('');
  const [currentKeyword, setCurrentKeyword] = useState<string>('');

  const [entireInternet, setEntireInternet] = useState(true);
  const [cr, setCr] = useState("");
  const [updatedFilters, setUpdatedFilters] = useState<any[]>([]);
  const [updatedKeyWords, setUpdatedKeyWords] = useState<string[]>([]);
  const groupApiSrvices = new GroupApiService();

  const handleSiteChange = (value: string) => {
    setCurrentSite(value);
  };

  const handleAddSite = () => {
    if (currentSite && !onlyFromTheseSites.includes(currentSite)) {
      setOnlyFromTheseSites([...onlyFromTheseSites, currentSite]);
      props.handleQueryParamsChange('onlyFromTheseSites', [...onlyFromTheseSites, currentSite]);
      setCurrentSite(''); // Clear the input field
    }
  };

  const handleSiteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSite(e.target.value);
  };

  const handleKeywordChipChange = (value: string[]) => {
    setKeywordChips(value);
    props.handleQueryParamsChange('keywords', value);
  };

  const handleExcludeSiteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentExcludeSite(e.target.value);
  };

  const handleExcludeSite = () => {
    if (currentExcludeSite && !excludeTheseSites.includes(currentExcludeSite)) {
      setExcludeTheseSites([...excludeTheseSites, currentExcludeSite]);
      props.handleQueryParamsChange('excludeTheseSites', [...excludeTheseSites, currentExcludeSite]);
      setCurrentExcludeSite(''); // Clear the input field
    }
  };
  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentKeyword(e.target.value);
  };

  const handleKeywordChipAdd = () => {
    if (currentKeyword) {
      const newKeywords = currentKeyword.split(',').map(item => item.trim()).filter(item => item);
      setKeywordChips([...keywordChips, ...newKeywords]);
      props.handleQueryParamsChange('keywords', [...keywordChips, ...newKeywords]);
      setCurrentKeyword(''); // Clear the input field
    }
  };

  const updateFiltersChange = (value: boolean, idx: number) => {
    const newFilters = [...updatedFilters];
    newFilters[idx].value = value;
    setUpdatedFilters(newFilters);

    const selectedFilters = newFilters.filter(filter => filter.value).map(filter => ({
      groupId: filter.id
    }));

    props.handleQueryParamsChange('groupIds', selectedFilters);
  };

  const handleSubmit = async (event: any) => {
    if (event) {
      event.preventDefault();
    }
    props.handleSearch();
  };

  const handleResets = () => {
    const resetFilters = updatedFilters.map((filter) => ({
      ...filter,
      value: false,
    }));
    setUpdatedFilters(resetFilters);

    setOnlyFromTheseSites([]);
    setExcludeTheseSites([]);
    setKeywordChips([]);
  
    setCr("");

    props.handleQueryParamsChange("afterDate", null);
    props.handleQueryParamsChange("beforeDate", null);
    props.handleQueryParamsChange("onlyFromTheseSites", []);
    props.handleQueryParamsChange("excludeTheseSites", []);
    props.handleQueryParamsChange("keywords", []);
    props.handleQueryParamsChange('groupIds', []);
  };

  const fetchTemplateData = async () => {
    try {
      const templateData = await groupApiSrvices.getGroupOptions();
      setUpdatedFilters(templateData);
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  return (
    <div>
      <Sider width={200} className="site-layout-background" style={{ overflow: 'auto', height: '90vh', position: 'fixed', backgroundColor: '#e6f4ff' }}>
        <Form style={{ padding: '5px' }}>
          <Title level={5} style={{ fontFamily: 'Bookman Old Style', fontSize: '14px' }}>
            Filters
          </Title>

          {updatedFilters && updatedFilters.map((item: any, index: number) => (
            !item.isOffence && (
              <Checkbox
                key={index}
                checked={item.value}
                onChange={(e) => updateFiltersChange(e.target.checked, index)}
                style={{ fontFamily: "Bookman Old Style", fontSize: "12px", marginBottom: '0px' }}
              >
                {item.name}
              </Checkbox>
            )
          ))}

          <Title level={5} style={{ fontFamily: "Bookman Old Style", fontSize: "14px", marginTop: "10px" }}>
            Region
          </Title>
          <Form.Item>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select a region"
              value={props.searchRequest.country}
              onChange={(value) => props.handleQueryParamsChange('country', value)}
            >
              {countries.map((country) => (
                <Option key={country.name} value={country.name}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Title level={5} style={{ fontFamily: "Bookman Old Style", fontSize: "14px", marginTop: "10px" }}>
            Site
          </Title>
          <Form.Item>
            <Input
              placeholder="Enter site or domain"
              value={currentSite}
              onChange={handleSiteInputChange}
              onPressEnter={handleAddSite}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: 10 }}>
              {onlyFromTheseSites.map(site => (
                <Tag
                  key={site}
                  closable
                  onClose={() => setOnlyFromTheseSites(onlyFromTheseSites.filter(item => item !== site))}
                >
                  {site}
                </Tag>
              ))}
            </div>
          </Form.Item>

          <Title level={5} style={{ fontFamily: "Bookman Old Style", fontSize: "14px", marginTop: "10px" }}>
            Exclude These Sites
          </Title>
          <Form.Item>
            <Input
              placeholder="Enter site to exclude"
              value={currentExcludeSite}
              onChange={handleExcludeSiteInputChange}
              onPressEnter={handleExcludeSite}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: 10 }}>
              {excludeTheseSites.map(site => (
                <Tag
                  key={site}
                  closable
                  onClose={() => setExcludeTheseSites(excludeTheseSites.filter(item => item !== site))}
                >
                  {site}
                </Tag>
              ))}
            </div>
          </Form.Item>

          <Title level={5} style={{ fontFamily: "Bookman Old Style", fontSize: "14px", marginTop: "10px" }}>
            Keywords
          </Title>
          <Form.Item>
            <Input
              placeholder="Enter keywords"
              value={currentKeyword}
              onChange={handleKeywordInputChange}
              onPressEnter={handleKeywordChipAdd} 
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: 10 }}>
              {keywordChips.map(keyword => (
                <Tag
                  key={keyword}
                  closable
                  onClose={() => handleKeywordChipChange(keywordChips.filter(item => item !== keyword))}
                >
                  {keyword}
                </Tag>
              ))}
            </div>
          </Form.Item>

          <Title level={5} style={{ fontFamily: "Bookman Old Style", fontSize: "14px", marginTop: "10px" }}>
            Custom Date
          </Title>
          <Form.Item>
            <DatePicker
              style={{ width: "100%" }}
              value={props.searchRequest.afterDate}
              onChange={(date) => props.handleQueryParamsChange('afterDate', date)}
              placeholder="After"
            />
          </Form.Item>
          <Form.Item>
            <DatePicker
              style={{ width: "100%" }}
              value={props.searchRequest.beforeDate}
              onChange={(date) => props.handleQueryParamsChange('beforeDate', date)}
              placeholder="Before"
            />
          </Form.Item>

          <Title level={5} style={{ fontFamily: "Bookman Old Style", fontSize: "14px", marginTop: "10px" }}>
            Predicate Offence
          </Title>
          {updatedFilters &&
            updatedFilters.map((item: any, index: number) => (
              item.isOffence && (
                // <Form.Item key={index} >
                <Checkbox
                  checked={item.value}
                  onChange={(e) => updateFiltersChange(e.target.checked, index)}
                >
                  {item.name}
                </Checkbox>
                // </Form.Item>
              )
            ))}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>


            <Button
              type="primary"
              onClick={handleResets}
              style={{
                // margin: '20px auto', 
                display: 'block',
                // backgroundColor: 'green',
                color: 'white',
                borderRadius: '50px',
                // padding: '8px 30px', 
                border: 'none',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontFamily: 'Bookman Old Style'
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{
                // margin: '20px auto', 
                display: 'block',
                // backgroundColor: 'green',
                color: 'white',
                borderRadius: '50px',
                // padding: '8px 30px', 
                border: 'none',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontFamily: 'Bookman Old Style'
              }}
            >
              Go
            </Button>
          </div>
        </Form>
      </Sider>
    </div>
  );
};

export default FilterSidebar;
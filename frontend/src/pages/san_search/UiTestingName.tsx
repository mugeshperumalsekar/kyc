import React, { useEffect, useState } from 'react';
import { Input, DatePicker, Slider, Button, Table, Tag, message, Select } from 'antd';
import { Box, Card, Typography } from '@mui/material';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import UiTestingCountryService from '../../data/services/san_search/uitestingcountry/uitestingcountry-api-service';
import UiTestingNameService from '../../data/services/san_search/uitestingname/uitestingname-api-service';
import Header from '../../layouts/header/header';

interface MultiParaSearchData {
  id: string;
  name: string;
  country: string;
  dob: string;
  score: number;
};

interface SingleRecord {
  id: string;
  onsideMultiPara: string[];
  name: string;
  dob: string;
  country: string;
};

interface Country {
  id: number;
  name: string;
};

const MultiParaSearch: React.FC = () => {

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [results, setResults] = useState<SingleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uicountry, setCountry] = useState<Country[]>([]);

  const countryService = new UiTestingCountryService();
  const name = new UiTestingNameService();

  useEffect(() => {
    fetchCountry();
  }, []);

  const fetchCountry = async () => {
    try {
      const countryData = await countryService.getUICountry();
      const formattedCountryData = countryData.map((name: any, index: number) => ({
        id: index + 1,
        name,
      }));
      setCountry(formattedCountryData);
    } catch (error) {
      console.error('Error fetching country list:', error);
    }
  };

  const [searchData, setSearchData] = useState<MultiParaSearchData>({
    id: '',
    name: '',
    country: '',
    dob: '',
    score: 80,
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchDTO: MultiParaSearchData = {
        id: searchData.id,
        name: searchData.name,
        country: searchData.country,
        dob: selectedDates.join(','),
        score: searchData.score,
      };
      const response = await name.getUISearchSinglemultiParaSearchData(searchDTO);
      console.log("API Response:", response);
      setResults(response.length > 0 ? [response[0]] : []);
    } catch (error) {
      message.error('Error fetching records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      if (!selectedDates.includes(formattedDate)) {
        setSelectedDates([...selectedDates, formattedDate]);
      }
    }
  };

  const removeDate = (dateToRemove: string) => {
    setSelectedDates(selectedDates.filter((date) => date !== dateToRemove));
  };

  const columns: ColumnsType<SingleRecord> = [
    {
      title: 'S.No',
      key: 'sno',
      render: (_text, _record, index) => index + 1,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'DOB', dataIndex: 'dob', key: 'dob' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    {
      title: 'Onside MultiPara',
      dataIndex: 'onsideMultiPara',
      key: 'onsideMultiPara',
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box m={2} style={{ marginTop: '3%' }}>
          <Card style={{ padding: '2%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
            <Typography variant="h5" component="div" style={{ marginBottom: '1rem' }}>
              UI Testing Name
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography>ID</Typography>
                <Input
                  placeholder="Enter ID"
                  value={searchData.id}
                  onChange={(e) => setSearchData({ ...searchData, id: e.target.value })}
                  style={{ width: 200 }}
                />
              </Box>
              <Box>
                <Typography>Name</Typography>
                <Input
                  placeholder="Enter Name"
                  value={searchData.name}
                  onChange={(e) => setSearchData({ ...searchData, name: e.target.value })}
                  style={{ width: 200 }}
                />
              </Box>
              <Box>
                <Typography>Country</Typography>
                <Select
                  placeholder="Select Country"
                  style={{ width: 200 }}
                  value={searchData.country}
                  onChange={(value) => setSearchData({ ...searchData, country: value })}
                >
                  {uicountry.map((c) => (
                    <Select.Option key={c.id} value={c.name}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography>DOB</Typography>
                <DatePicker style={{ width: 200 }} placeholder="Select DOB" onChange={handleDateChange} />
              </Box>
              <Box>
                <Typography>Score</Typography>
                <Slider
                  min={0}
                  max={100}
                  value={searchData.score}
                  onChange={(value) => setSearchData({ ...searchData, score: value })}
                  style={{ width: 200 }}
                />
              </Box>
              <Box mt={3}>
                <Button
                  type="primary"
                  style={{ width: 200 }}
                  onClick={handleSearch}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Box>
            </Box>
            <Box mt={2}>
              {selectedDates.map((date) => (
                <Tag key={date} closable onClose={() => removeDate(date)} color="blue">
                  {date}
                </Tag>
              ))}
            </Box>
          </Card>
          <Box mt={4}>
            <Typography variant="h6" component="div" gutterBottom>
              Search Results
            </Typography>
            <Table dataSource={results} columns={columns} rowKey="id" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MultiParaSearch;
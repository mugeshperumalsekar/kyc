import { Card, Container } from 'react-bootstrap';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import DocumentApiService from '../../../data/services/kyc/master/document/Document_api_service';
import IconButton from '@mui/material/IconButton';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface Bank {
    answer: string;
    id: number;
}

const detalpathId: { [key: string]: number } = {
    pep: 1,
    san: 2,
    crm: 3,
    aml: 4,
}

function Document() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails?.loginDetails;
    const documentApiService = new DocumentApiService();
    const { kycId }: { kycId?: string | number } = useParams();
    const kycIdNumber = typeof kycId === 'number' ? kycId : parseInt(kycId || '', 10);

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const [banks, setBanks] = useState<Bank[]>([]);
    const [bankToKycId, setBankToKycId] = useState<{ [key: string]: number }>({});
    const [bankStates, setBankStates] = useState<{ [bank: string]: { [category: string]: { file: File[], checked: boolean } } }>({});

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const banksData = await documentApiService.getName(kycIdNumber);
                setBanks(banksData);
                const bankIdMapping = banksData.reduce((acc: { [key: string]: number }, bank: Bank) => {
                    acc[bank.answer] = bank.id;
                    return acc;
                }, {});
                setBankToKycId(bankIdMapping);
                const initialBankStates = banksData.reduce((acc: { [key: string]: { [category: string]: { file: File[], checked: boolean } } }, bank: Bank) => {
                    acc[bank.answer] = {
                        pep: { file: [], checked: false },
                        san: { file: [], checked: false },
                        crm: { file: [], checked: false },
                        aml: { file: [], checked: false },
                    };
                    return acc;
                }, {});
                setBankStates(initialBankStates);
            } catch (error) {
                console.error('Error fetching banks data:', error);
            }
        };
        fetchBanks();
    }, [kycIdNumber]);

    const handleChangeCheckbox = (bank: string, category: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setBankStates((prevBankStates) => ({
            ...prevBankStates,
            [bank]: {
                ...prevBankStates[bank],
                [category]: {
                    ...prevBankStates[bank][category],
                    checked: event.target.checked,
                },
            },
        }));
    };

    const handleChooseImagesClick = (bank: string, category: string) => {
        document.getElementById(`image-upload-input-${bank}-${category}`)?.click();
    };

    const handleFileChange = (bank: string, category: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files) as File[];
            setBankStates((prevBankStates) => ({
                ...prevBankStates,
                [bank]: {
                    ...prevBankStates[bank],
                    [category]: {
                        ...prevBankStates[bank][category],
                        file: filesArray,
                    },
                },
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submission started');
        try {
            for (const bank of banks) {
                console.log(`Processing bank: ${bank.answer}`);
                const bankState = bankStates[bank.answer];
                for (const category in bankState) {
                    const file = bankState[category].file[0];
                    const isChecked = bankState[category].checked ? 1 : 0;
                    if (file && file.name) {
                        console.log(`Selected file for category ${category}: ${file.name}`);
                        const files = [file];
                        const pathId = detalpathId[category];
                        if (kycIdNumber && pathId) {
                            await documentApiService.uploadFiles(files, kycIdNumber, [pathId], [isChecked]);
                            console.log(`Files uploaded successfully for bank: ${bank.answer}, category: ${category}`);
                        } else {
                            console.error(`KYC ID or Path ID not found for bank: ${bank.answer}, category: ${category}`);
                        }
                    } else {
                        console.log(`No file selected for category ${category}`);
                    }

                    console.log(`Sending checkbox state for bank: ${bank.answer}, category: ${category}: ${isChecked}`);
                }
            }
            alert('Files uploaded successfully!');
        } catch (error) {
            console.error('Error submitting files:', error);
            alert('Error uploading files');
        }
        console.log('Form submission completed');
    };

    return (
        <>
            <Box m={6}>
                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                    <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
                                <div>S.No</div>
                                <div>Name</div>
                                <div>Pep</div>
                                <div>Sanctions</div>
                                <div>Criminal</div>
                                <div>Adverse Media</div>
                            </div>
                            {banks.map((bank, index) => (
                                <div key={bank.id} style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center', marginBottom: '10px' }}>
                                    <div>{index + 1}</div>
                                    <div>{bank.answer}</div>
                                    {['pep', 'san', 'crm', 'aml'].map((category) => (
                                        <div key={category} style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <IconButton onClick={() => handleChooseImagesClick(bank.answer, category)} color="primary" >
                                                    <CloudUploadIcon />
                                                </IconButton>
                                                <FormControlLabel control={<Checkbox checked={bankStates[bank.answer]?.[category]?.checked || false} onChange={handleChangeCheckbox(bank.answer, category)} name={category} color="primary" />} label={''} />
                                            </div>
                                            <input type="file" id={`image-upload-input-${bank.answer}-${category}`} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(event) => handleFileChange(bank.answer, category, event)} style={{ display: 'none' }} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="contained" color="primary">Save</Button>
                            </div>
                        </form>
                    </Container>
                </Card>
            </Box>
        </>
    );
}

export default Document;


// import { Card, Container } from 'react-bootstrap';
// import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
// import { useSelector } from 'react-redux';
// import React, { useEffect, useState } from 'react';
// import Header from '../../layouts/header/header';
// import DocumentApiService from '../../data/services/master/document/Document_api_service';
// import axios from 'axios';

// interface Image {
//     name: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// }

// interface Bank {
//     answer: string;
//     id: number;
// }

// const detalpathId: { [key: string]: number } = {
//     pep: 1,
//     san: 2,
//     crm: 3,
//     aml: 4,
// };

// const kycIds = 1;

// function Document() {
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails?.loginDetails;
//     const documentApiService = new DocumentApiService();

//     const initialImageState: Image = {
//         name: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const [banks, setBanks] = useState<Bank[]>([]);
//     const [bankToKycId, setBankToKycId] = useState<{ [key: string]: number }>({});
//     const [bankStates, setBankStates] = useState<{ [bank: string]: { [category: string]: { file: File[], checked: boolean } } }>({});

//     useEffect(() => {
//         const fetchBanks = async () => {
//             try {
//                 const banksData = await documentApiService.getName(kycIds);
//                 setBanks(banksData);

//                 const bankIdMapping = banksData.reduce((acc: { [key: string]: number }, bank: Bank) => {
//                     acc[bank.answer] = bank.id;
//                     return acc;
//                 }, {});

//                 setBankToKycId(bankIdMapping);

//                 const initialBankStates = banksData.reduce((acc: { [key: string]: { [category: string]: { file: File[], checked: boolean } } }, bank: Bank) => {
//                     acc[bank.answer] = {
//                         pep: { file: [], checked: false },
//                         san: { file: [], checked: false },
//                         crm: { file: [], checked: false },
//                         aml: { file: [], checked: false },
//                     };
//                     return acc;
//                 }, {});

//                 setBankStates(initialBankStates);
//             } catch (error) {
//                 console.error('Error fetching banks data:', error);
//             }
//         };

//         fetchBanks();
//     }, []);

//     const handleChangeCheckbox = (bank: string, category: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//         setBankStates((prevBankStates) => ({
//             ...prevBankStates,
//             [bank]: {
//                 ...prevBankStates[bank],
//                 [category]: {
//                     ...prevBankStates[bank][category],
//                     checked: event.target.checked,
//                 },
//             },
//         }));
//     };

//     const handleChooseImagesClick = (bank: string, category: string) => {
//         document.getElementById(`image-upload-input-${bank}-${category}`)?.click();
//     };

//     const handleFileChange = (bank: string, category: string, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const filesArray = Array.from(event.target.files) as File[];
//             setBankStates((prevBankStates) => ({
//                 ...prevBankStates,
//                 [bank]: {
//                     ...prevBankStates[bank],
//                     [category]: {
//                         ...prevBankStates[bank][category],
//                         file: filesArray,
//                     },
//                 },
//             }));
//         }
//     };

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         console.log('Form submission started');
//         try {
//             for (const bank of banks) {
//                 console.log(`Processing bank: ${bank.answer}`);
//                 const bankState = bankStates[bank.answer];
//                 for (const category in bankState) {
//                     const file = bankState[category].file[0];
//                     const isChecked = bankState[category].checked ? 1 : 0;
//                     if (file && file.name) {
//                         console.log(`Selected file for category ${category}: ${file.name}`);
//                         const files = [file];
//                         // const kycId = bankToKycId[bank.answer];
//                         const kycId = kycIds;
//                         const pathId = detalpathId[category];
//                         if (kycId && pathId) {
//                             await documentApiService.uploadFiles(files, kycId, pathId,isChecked);
//                             console.log(`Files uploaded successfully for bank: ${bank.answer}, category: ${category}`);
//                         } else {
//                             console.error(`KYC ID or Path ID not found for bank: ${bank.answer}, category: ${category}`);
//                         }
//                     } else {
//                         console.log(`No file selected for category ${category}`);
//                     }

//                     // Send the checkbox state
//                     console.log(`Sending checkbox state for bank: ${bank.answer}, category: ${category}: ${isChecked}`);
//                     // Assuming there is a method to send checkbox state
//                     // await documentApiService.sendCheckboxState(bank.name, category, isChecked);
//                 }
//             }
//             alert('Files uploaded successfully!');
//         } catch (error) {
//             console.error('Error submitting files:', error);
//             alert('Error uploading files');
//         }
//         console.log('Form submission completed');
//     };

//     return (
//         <>
//             {/* <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}
//                     <Box m={6}>
//                         <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
//                                 <form onSubmit={handleSubmit} encType="multipart/form-data">
//                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
//                                         <div>S.No</div>
//                                         <div>Name</div>
//                                         <div>Pep</div>
//                                         <div>San</div>
//                                         <div>Crm</div>
//                                         <div>Adverse Media</div>
//                                     </div>
//                                     {banks.map((bank, index) => (
//                                         <div key={bank.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center', marginBottom: '10px' }}>
//                                             <div>{index + 1}</div>
//                                             <div>{bank.answer}</div>
//                                             {['pep', 'san', 'crm', 'aml'].map((category) => (
//                                                 <div key={category} style={{ display: 'flex', alignItems: 'center', gap:'7%'}}>
//                                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,gap:'7%'}}>
//                                                         <Button variant="outlined" onClick={() => handleChooseImagesClick(bank.answer, category)}>Document</Button>
//                                                         <FormControlLabel control={<Checkbox checked={bankStates[bank.answer]?.[category]?.checked || false} onChange={handleChangeCheckbox(bank.answer, category)} name={category} color="primary" />} label={''} />
//                                                     </div>
//                                                     <input type="file" id={`image-upload-input-${bank.answer}-${category}`} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(event) => handleFileChange(bank.answer, category, event)} style={{ display: 'none' }} />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ))}
//                                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                         <Button type="submit" variant="contained" color="primary">Submit</Button>
//                                     </div>
//                                 </form>
//                             </Container>
//                         </Card>
//                     </Box>
//                 {/* </Box>
//             </Box> */}
//         </>
//     );
// }

// export default Document;
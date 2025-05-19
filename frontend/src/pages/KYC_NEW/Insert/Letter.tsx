import React, { ChangeEvent, useState } from 'react';
import { Box, Button } from '@mui/material';
import Header from '../../../layouts/header/header';
import { Card } from 'react-bootstrap';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';

export const App = (props:any) => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfFileError, setPdfFileError] = useState('');
    const applicationfrome = new ApplicationfromeService();
    const [viewPdf, setViewPdf] = useState<string | ArrayBuffer | null>(null);
    const fileType = ['application/pdf'];
    const [successMessage, setSuccessMessage] = useState('');
    const [saveClicked, setSaveClicked] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const handlePdfFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPdfFile(event.target.files[0]);
        }
    };

    const handlePdfFileSubmit = async () => {
        if (pdfFile) {
            try {
                const response = await applicationfrome.InsertPdf([pdfFile]);  // Pass as array
                console.log('File uploaded successfully', response);
                setViewPdf(URL.createObjectURL(pdfFile));
                showSuccessMessage('Upload added successfully.');
            } catch (error) {
                console.error('File upload failed', error);
            }
        } else {
            setViewPdf(null);
        }
    };

    return (
        <>
            {/* <Box sx={{ display: 'flex' }}>
                <Header /> */}
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '1%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className='container'>
                                <br />
                                <form className='form-group'>
                                    <input type="file" className='form-control' required onChange={handlePdfFileChange} />
                                    {pdfFileError &&
                                        <div className='pdf-container' style={{ color: 'red' }}>{pdfFileError}</div>}
                                    <br />
                                    <Button type="button" onClick={handlePdfFileSubmit}>
                                        UPLOAD
                                    </Button>
                                </form>
                                <br />
                                
                            </div>
                        </Card>
                        <Snackbar
                            open={isSuccessOpen}
                            autoHideDuration={5000}
                            onClose={() => setIsSuccessOpen(false)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MuiAlert
                                elevation={6}
                                variant="filled"
                                severity="success"
                                onClose={() => setIsSuccessOpen(false)}
                            >
                                {successMessage}
                            </MuiAlert>
                        </Snackbar>
                        <Snackbar
                            open={isErrorOpen}
                            autoHideDuration={5000}
                            onClose={() => setIsErrorOpen(false)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MuiAlert
                                elevation={6}
                                variant="filled"
                                severity="error"
                                onClose={() => setIsErrorOpen(false)}
                            >
                                {errorMessage}
                            </MuiAlert>
                        </Snackbar>
                    </Box>
                </Box>
            {/* </Box> */}
        </>
    );
};

export default App;


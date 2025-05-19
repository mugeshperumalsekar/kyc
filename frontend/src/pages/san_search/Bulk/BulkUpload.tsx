
import { useState } from "react";
import { Box, Button, Grid, TextField, IconButton, Typography, Card } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import DocumentApiService from "../../../data/services/document/Document_api_service";
import Header from "../../../layouts/header/header";
import React from "react";

function BulkUpload() {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const documentApiService = new DocumentApiService();

    const handleChooseFileClick = () => {
        document.getElementById('file-upload-input')?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFileName(file.name);
            setExcelFile(file);
            setFileError(null);
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!excelFile) {
            setFileError("Please upload a file");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("file", excelFile);

        try {
            const response = await documentApiService.saveExcelRequest(excelFile);

            if (response?.status === 200) {
                setSuccess("Upload successful!");
            } else {
                console.log("Upload successful, response:", response);
                setSuccess("Upload successful!");
            }
        } catch (error: any) {
            if (error?.response) {
                const status = error.response.status;
                let errorMessage = "Error uploading file. Please try again.";

                if (status === 500) {
                    errorMessage = "Excel Column Mismatch. Please upload a proper Excel file.";
                } else if (status === 400) {
                    errorMessage = "Bad Request. Please check your input.";
                } else if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                }
                setError(errorMessage);
            } else {
                console.error("Unknown error uploading Excel:", error);
                setError("Error uploading file. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setExcelFile(null);
        setFileName('');
        setFileError(null);

        const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f5f5f5' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box m={2} sx={{ mt: 5 }}>
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={10} md={8} lg={6}>
                            <Typography variant="h5" align="center" className="allHeading" gutterBottom sx={{ mb: 2, }}>
                                Bulk Upload
                            </Typography>
                            <Card sx={{ p: 3, boxShadow: 3, bgcolor: '#fff' }}>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                            gap: 2
                                        }}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload-input"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={handleChooseFileClick}
                                            className="commonButton"
                                            startIcon={<FontAwesomeIcon icon={faUpload} />}
                                            sx={{
                                                borderRadius: '4px',
                                                borderColor: '#1976d2',
                                                color: '#1976d2',
                                                '&:hover': {
                                                    borderColor: '#1565c0',
                                                    color: '#1565c0',
                                                    backgroundColor: '#e3f2fd',
                                                },
                                                padding: '10px',
                                                textTransform: 'none',
                                                width: '200px',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            Choose File
                                        </Button>
                                        <TextField
                                            label="Selected File"
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            value={fileName}
                                            disabled
                                            fullWidth
                                            className="allHeading"
                                            sx={{ backgroundColor: '#f0f0f0' }}
                                        />
                                        {excelFile && (
                                            <IconButton
                                                onClick={handleRemoveFile}
                                                aria-label="remove"
                                                sx={{ ml: 2, color: 'red' }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </IconButton>
                                        )}

                                    </Box>
                                    {fileError && (
                                        <Typography color="error" align="left" sx={{ mb: 2 }}>
                                            {fileError}
                                        </Typography>
                                    )}
                                    {error && (
                                        <Typography color="error" align="left" sx={{ mb: 2 }}>
                                            {typeof error === 'string' ? error : "An unexpected error occurred."}
                                        </Typography>
                                    )}

                                    {success && (
                                        <Typography color="success" align="left" sx={{ mb: 2 }}>
                                            <span>{success}</span>
                                        </Typography>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            className="commonButton"
                                            sx={{
                                                bgcolor: '#1976d2',
                                                '&:hover': { bgcolor: '#1565c0' },
                                            }}
                                        >
                                            {loading ? 'Uploading...' : 'Upload File'}
                                        </Button>
                                    </Box>
                                </form>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

export default BulkUpload;
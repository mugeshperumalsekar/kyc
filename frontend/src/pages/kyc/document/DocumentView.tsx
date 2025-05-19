import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Box } from '@mui/material';
import DocumentApiService from '../../../data/services/kyc/master/document/Document_api_service';
import defaultImageUrl from '../../../assets/bluefolder.png';
import defaultImage from '../../../assets/Avatar.png';
import { useParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import PDFModal from './PDFModal'; // Import the PDFModal component
import Header from '../../../layouts/header/header';

interface Bank {
    answer: string;
    id: number;
};

interface Filepath {
    imgId: string;
    pathId: string;
};

interface Images {
    [category: string]: Array<{ type: string; data: string }>;
};

const DocumentView = () => {

    const documentApiService = new DocumentApiService();
    const { kycId } = useParams<{ kycId: string }>();
    const [banks, setBanks] = useState<Bank[]>([]);
    const [filepaths, setFilepaths] = useState<Filepath[]>([]);

    const [images, setImages] = useState<Images>({
        pep: [],
        san: [],
        crm: [],
        adversemedia: []
    });

    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        const CHUNK_SIZE = 0x8000; // 32768
        for (let i = 0; i < len; i += CHUNK_SIZE) {
            const subarray = bytes.subarray(i, i + CHUNK_SIZE);
            binary += String.fromCharCode.apply(null, Array.from(subarray));
        }
        return btoa(binary);
    };

    useEffect(() => {
        fetchData();
    }, [kycId]);

    const fetchData = async () => {
        try {
            if (kycId) {
                const parsedKycId = parseInt(kycId, 10);
                if (!isNaN(parsedKycId)) {
                    const banksData = await documentApiService.getName(parsedKycId);
                    setBanks(banksData);
                    const filepathsData = await documentApiService.getFilepath(parsedKycId);
                    const filepathsFormatted: Filepath[] = filepathsData.map((filepath: string) => {
                        const [imgId, pathId] = filepath.split(',');
                        return { imgId, pathId };
                    });
                    setFilepaths(filepathsFormatted);
                    const imagesData: Images = {
                        pep: [],
                        san: [],
                        crm: [],
                        adversemedia: []
                    };
                    for (const { imgId, pathId } of filepathsFormatted) {
                        try {
                            const fileBuffer = await documentApiService.getFiles(Number(imgId), Number(pathId));
                            if (fileBuffer) {
                                const base64String = arrayBufferToBase64(fileBuffer);
                                const fileType = getFileType(fileBuffer);
                                if (fileType === 'application/pdf') {
                                    imagesData.pep.push({ type: 'pdf', data: `data:application/pdf;base64,${base64String}` });
                                } else {
                                    imagesData.pep.push({ type: 'image', data: `data:image/jpeg;base64,${base64String}` });
                                }
                            } else {
                                imagesData.pep.push({ type: 'image', data: defaultImageUrl });
                            }
                        } catch (error) {
                            console.error(`Error fetching files for imgId ${imgId} and pathId ${pathId}:`, error);
                            imagesData.pep.push({ type: 'image', data: defaultImageUrl });
                        }
                    }
                    setImages(imagesData);
                } else {
                    console.error('Invalid kycId:', kycId);
                }
            } else {
                console.error('kycId is undefined');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getFileType = (buffer: ArrayBuffer): string => {
        const arr = new Uint8Array(buffer).subarray(0, 4);
        let header = '';
        for (let i = 0; arr.length > i; i++) {
            header += arr[i].toString(16);
        }
        let type = '';
        switch (header) {
            case '25504446':
                type = 'application/pdf';
                break;
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
            case 'ffd8ffe8':
                type = 'image/jpeg';
                break;
            default:
                type = 'unknown';
                break;
        }
        return type;
    };

    const handlePdfClick = (fileData: string, fileType: string) => {
        if (fileType === 'pdf') {
            setSelectedPdf(fileData);
            setIsModalOpen(true);
        } else {
            setSelectedPdf(null);
            setIsModalOpen(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPdf(null);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={6}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', marginBottom: '20px' }}>
                            <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr', alignItems: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
                                    <div>S.No</div>
                                    <div>Name</div>
                                </div>
                                {banks.map((bank, index) => (
                                    <div key={bank.id}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr', alignItems: 'center', marginBottom: '10px' }}>
                                            <div style={{ fontWeight: '600' }}>{index + 1}</div>
                                            <div style={{ fontWeight: '600' }}>{bank.answer}</div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', marginBottom: '10px' }}>
                                            <div>Pep</div>
                                            <div style={{ marginLeft: '-42%' }}>Sanction</div>
                                            <div style={{ marginLeft: '-87%' }}>Criminal</div>
                                            <div style={{ marginLeft: '-133%' }}>AdverseMedia</div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', marginBottom: '10px' }}>
                                            {Object.keys(images).map((category, categoryIndex) => (
                                                <div key={categoryIndex}>
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        {images[category].slice(index * 4, (index + 1) * 4).map((file, fileIndex) => (
                                                            <div key={fileIndex} style={{ margin: '10px' }}>
                                                                {file.type === 'image' ? (
                                                                    <img src={file.data} alt={`Preview ${category}`} style={{ maxHeight: '250px', maxWidth: '150px' }} />
                                                                ) : (
                                                                    <div onClick={() => handlePdfClick(file.data, file.type)} style={{ cursor: 'pointer' }}>
                                                                        {file.data ? (
                                                                            <img src={defaultImageUrl} alt={`Preview ${category}`} style={{ maxHeight: '250px', maxWidth: '150px' }} />
                                                                        ) : (
                                                                            <img src={defaultImage} alt={`Default Preview ${category}`} style={{ maxHeight: '250px', maxWidth: '150px' }} />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Container>
                        </Card>
                    </Box>
                </Box>
            </Box>
            <PDFModal open={isModalOpen} onClose={handleCloseModal} pdfData={selectedPdf} />
        </>
    );
};

export default DocumentView;
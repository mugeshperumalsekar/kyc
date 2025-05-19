
import { TextField, TextFieldProps } from "@mui/material";
import { Button, Card, Container } from "react-bootstrap";
import './Demo.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ChangeEvent, useState } from "react";
import DatePicker from 'react-datepicker';
import { MobileDatePicker } from "@mui/x-date-pickers";


interface Details {
    id: number;
    name: string;
    dob: Date | null; // Use Date type here
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
}

function Demo() {
    const [addFormData, setAddFormData] = useState<Details>({
        id: 0,
        name: '',
        dob: null,
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
    });
    const [date, setDate] = useState<Date | null>(new Date());



    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: value,
        });
    }

    const handleDateChange = (newDate: Date | null) => {
        setDate(newDate);
        setAddFormData({
            ...addFormData,
            dob: newDate,
        });
    };
    
    const handleSubmit = () => {
        console.log("AddedFormValues", addFormData)
    }
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Container>
                    <h4 style={{ textAlign: 'center' }}>Insert Page</h4>
                    <Card style={{ padding: '1%' }}>
                        <div className="row" style={{ margin: '1%' }}>
                            <div className="col-6">
                                <TextField  id="outlined-basic" label="Name" variant="outlined" fullWidth name="name"
                                    value={addFormData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-6">
                                <MobileDatePicker  label="Dob"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ margin: '1%' }}>
                            <div className="col-6">
                                <TextField id="outlined-basic"  label="Gender" variant="outlined" fullWidth name="gender"
                                    value={addFormData.gender}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-6">
                                <TextField id="outlined-basic" label="Phone Number" variant="outlined" fullWidth name="phoneNumber"
                                    value={addFormData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ margin: '1%' }}>
                            <div className="col-6">
                                <TextField label="Email"  variant="outlined" fullWidth name="email"
                                    value={addFormData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-6">
                                <TextField id="outlined-basic" label="Address"variant="outlined" fullWidth name="address"
                                    value={addFormData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Button style={{ marginLeft: 'auto' }} onClick={handleSubmit}>Submit</Button>
                        </div>
                    </Card>
                </Container>
            </LocalizationProvider>
        </>
    )
}
export default Demo;

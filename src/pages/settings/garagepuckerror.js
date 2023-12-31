// src/pages/settings.js
import { useState, useCallback } from 'react';
import Head from 'next/head';
import {
    Box, Container, Stack, Typography, Button, Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Grid,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ChromePicker } from 'react-color';


const Page = () => {

    const [buzzerData, setBuzzerData] = useState({
        onTime: '',
        offTime: '',
        duration: '',
    });

    const [chargeControlData, setChargeControlData] = useState({
        minBatteryPercentage: '',
    });

    const handleInputChange = (event, section, field) => {
        const value = event.target.value;
        switch (section) {
            case 'beacon':
                setBeaconData((prevData) => ({
                    ...prevData,
                    [field]: value,
                }));
                break;
            case 'buzzer':
                setBuzzerData((prevData) => ({
                    ...prevData,
                    [field]: value,
                }));
                break;
            case 'chargeControl':
                setChargeControlData((prevData) => ({
                    ...prevData,
                    [field]: value,
                }));
                break;
            default:
                break;
        }
    };

    const handleSave = (section) => {
        // Handle saving data or API calls here based on section
        switch (section) {
            case 'beacon':
                alert('Saving Beacon Data:' + beaconData.color);
                console.log('Saving Beacon Data:', beaconData);
                break;
            case 'buzzer':
                alert('Saving Buzzer Data: ' + "On-Time: " + buzzerData.onTime);
                console.log('Saving Buzzer Data:', buzzerData);
                break;
            case 'chargeControl':
                alert('Saving Charge Control Data: ' + chargeControlData.minBatteryPercentage + "%");
                console.log('Saving Charge Control Data:', chargeControlData.minBatteryPercentage);
                break;
            default:
                break;
        }
    };


    const handleSubmit = useCallback((event) => {
        event.preventDefault();
    }, []);


    return (
        <>
            <Head>
                <title>
                    Settings | MyHomeBeacon
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <Typography variant="h4">
                            Garage Puck Settings
                        </Typography>
                        <Card>
                            <CardHeader title="Buzzer" />
                            <Divider />
                            <CardContent>
                                <Stack spacing={2} sx={{ maxWidth: 400 }}>
                                    <TextField
                                        label="On-Time (ms)"
                                        value={buzzerData.onTime}
                                        onChange={(e) => handleInputChange(e, 'buzzer', 'onTime')}
                                    />
                                    <TextField
                                        label="Off-Time (ms)"
                                        value={buzzerData.offTime}
                                        onChange={(e) => handleInputChange(e, 'buzzer', 'offTime')}
                                    />
                                    <TextField
                                        label="Duration"
                                        value={buzzerData.duration}
                                        onChange={(e) => handleInputChange(e, 'buzzer', 'duration')}
                                    />
                                </Stack>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={() => handleSave('buzzer')}>
                                    Save
                                </Button>
                            </CardActions>
                        </Card>
                        <Card spacing={1}>
                            <CardHeader title="Charge Control" />
                            <Divider />
                            <CardContent>
                                <Stack spacing={2} sx={{ maxWidth: 400 }}>
                                    <TextField
                                        label="Minimum battery percentage to start charge"
                                        value={chargeControlData.minBatteryPercentage}
                                        onChange={(e) =>
                                            handleInputChange(e, 'chargeControl', 'minBatteryPercentage')
                                        }
                                    />
                                    {/* <Typography variant="h6">
                  {chargeControlData.minBatteryPercentage}
        </Typography> */}

                                </Stack>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={() => handleSave('chargeControl')}>
                                    Save
                                </Button>
                            </CardActions>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;

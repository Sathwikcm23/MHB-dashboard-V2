// src/pages/settings.js
import { useState, useCallback } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, Button, Grid } from '@mui/material';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { ChromePicker } from 'react-color';
import Slider from '@mui/material/Slider';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';

const Page = () => {
  const router = useRouter();

  const handleBeconClick = () => {
    router.push('/settings/beacon');
  };

  const handleGaragePuckClick = () => {
    router.push('/settings/garagepuck');
  };

  const handleUserSettingsClick = () => {
    router.push('/settings/usersetting');
  };

  const [beaconData, setBeaconData] = useState({
    color: { r: 0, g: 0, b: 0, a: 1 },
    onTime: '',
    offTime: '',
    duration: '',
  });

  const [buzzerData, setBuzzerData] = useState({
    onTime: '',
    offTime: '',
    duration: '',
  });

  const handleColorChange = (color) => {
    setBeaconData((prevData) => ({
      ...prevData,
      color: color.rgb,
    }));
  };

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
        alert('Saving Buzzer Data: ' + buzzerData);
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
          <Stack spacing={3} >
            <Typography variant="h4">
              Settings
            </Typography>
            {/* <Stack spacing={4} direction="row" sx={{ width: '100%' }}> */}
              {/* Buttons to navigate */}
              {/* <Button variant="contained" color="primary" onClick={handleBeconClick}>
                Beacon Settings
              </Button> */}

              {/* <Button variant="contained" color="primary" onClick={handleUserSettingsClick}>
                User Settings
              </Button> */}
            {/* </Stack> */}
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <AccountProfileDetails />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                {/* <AccountProfile /> */}
              </Grid>

            </Grid>
            {/* <SettingsNotifications /> */}
            {/* <SettingsPassword /> */}
          </Stack>
          {/* <Stack spacing={3} sx={{marginTop: '20px'}}> */}
            {/* <Typography variant="h4">
                            Beacon Settings
                        </Typography> */}
            {/* <Card>
              <CardHeader title="Beacon" />
              <Divider />
              <CardContent>
                <Stack spacing={2} sx={{ maxWidth: 400 }}>
                  <ChromePicker color={beaconData.color} onChange={handleColorChange} />
                  <Box sx={{ width: 300 }}>
                    <Typography >Brightness:</Typography>
                    <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                  </Box>
                  <TextField
                    label="Pattern On-Time (ms)"
                    value={beaconData.onTime}
                    onChange={(e) => handleInputChange(e, 'beacon', 'onTime')}
                  />
                  <TextField
                    label="Pattern Off-Time (ms)"
                    value={beaconData.offTime}
                    onChange={(e) => handleInputChange(e, 'beacon', 'offTime')}
                  />
                  <TextField
                    label="Active Duration (sec)"
                    value={beaconData.duration}
                    onChange={(e) => handleInputChange(e, 'beacon', 'duration')}
                  />
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => handleSave('beacon')}>
                  Save
                </Button>
              </CardActions>
            </Card> */}
            {/* <Card>
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
            </Card> */}
            {/* <Card spacing={1}>
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
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => handleSave('chargeControl')}>
                  Save
                </Button>
              </CardActions>
            </Card> */}
          {/* </Stack> */}
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

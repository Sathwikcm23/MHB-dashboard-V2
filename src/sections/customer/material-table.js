import { useMemo, useEffect, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

import {
    Box, Typography, Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Divider,
    Stack
} from '@mui/material';


import { useRouter } from 'next/router';

import ExpandableRowGrid from './table';
import ExpandTable from './table';
import axios from 'axios';

export let latitude = '';
export let longitude = '';


const Materialtable = () => {
    const [data, setData] = useState([]);
    const [dropdownData, setDropdownData] = useState(null);
    const [dropdownDataMap, setDropdownDataMap] = useState({});
    const [loadingMap, setLoadingMap] = useState({});

    const fetchData = async () => {
        try {
            const idToken = localStorage.getItem('idToken');
            const response = await axios.get('https://m1kiyejux4.execute-api.us-west-1.amazonaws.com/dev/api/v1/users/getUsers', {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const data = response.data;
            console.log('Data:', data);
            setData(data['AWS-result']);
            let userId;
            data['AWS-result'].forEach(user => {
                userId = user.sub;
            })
            data['AWS-result'].forEach(user => {
                if (user.address) {
                    const address = user.address;
                    const pinCodePattern = /\b\d{6}\b/;
                    const match = address.match(pinCodePattern);
                    const pinCode = match ? match[0] : null;
                    const addressWithoutPinCode = address.replace(pinCodePattern, '').trim();
                    // console.log(`Pin Code for ${user.first_name} ${user.last_name}:`, pinCode);
                    user.pinCode = pinCode;
                    user.address = addressWithoutPinCode;

                    const cityPattern = /(?:[^,]+,\s*){3}([^,]+)(?=(,|$))/;
                    const matchcity = address.match(cityPattern);
                    const city = matchcity ? matchcity[1].trim() : null;
                    user.city = city;
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const fetchDropdownData = async (userId) => {
        try {
            const idToken = localStorage.getItem('idToken');
            const secondApiResponse = await axios.post(
                `https://m1kiyejux4.execute-api.us-west-1.amazonaws.com/dev/api/v1/devices/getAllProp/${userId}`,
                { user_id: userId },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const dropdownData = secondApiResponse.data;
            console.log('Data:', dropdownData);
            // setDropdownData(dropdownData.tuya_data);
            // return dropdownData.tuya_data;
            setDropdownDataMap((prevDataMap) => ({
                ...prevDataMap,
                [userId]: dropdownData.tuya_data || null,
            }));
        } catch (error) {
            console.error('Error fetching dropdown data:', error.message);
            setDropdownDataMap((prevDataMap) => ({
                ...prevDataMap,
                [userId]: null,
            }));
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


    const router = useRouter();

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'given_name',
                header: 'Firstname',
            },
            {
                accessorKey: 'family_name',
                header: 'Lastname',
            },
            {
                accessorKey: 'address',
                header: 'Address'
            },
            {
                accessorKey: 'city',
                header: 'City'
            },
            {
                accessorKey: 'pinCode',
                header: 'ZipCode',
            },
            {
                accessorKey: 'email',
                header: 'Email',
                // selector: row => row.email,
            },
            {
                accessorKey: 'phone_number',
                header: 'Contact number',
            },
            {
                // accessorFn: (originalRow) => new Date(originalRow.birthdate), //convert to date for sorting and filtering
                accessorKey: 'birthdate',
                header: 'Date of Birth',
                // filterVariant: 'date-range',
                // Cell: ({ cell }) => cell.getValue().toLocaleDateString(), // convert back to string for display
                filterVariant: 'range',
            },
            {
                accessorKey: 'os',
                header: 'Operating system',
            },



        ],
        [],
        //end
    );

    function getSubByEmail(email) {
        for (const entry of data) {
            if (entry.email === email) {
                return { sub: entry.sub, lat: entry['custom:latitude'], lon: entry['custom:longitude'] };
            }
        }
        return null;
    }

    const handleRowClick = (row) => {
        const username = row.original.family_name;
        const email = row.original.email;
        const body = getSubByEmail(email);
        console.log(email, body);
        latitude = body.lat;
        longitude = body.lon;
        router.push(`/user/${username}`);
    };

    const getBackgroundColor = (family_name) => {
        if (family_name === 'Kumar' || family_name === 'C M') {
            return 'rgba(217, 30, 24, 0.5)';
        }
        return 'inherit';
    };

    const renderDetailPanel = ({ row }) => {
        useEffect(() => {
            if (row.original.sub) {
                fetchDropdownData(row.original.sub);
            }
        }, [row.original.sub]);

        const dropdownData = dropdownDataMap[row.original.sub];

        return (
            <Box
                sx={{
                    width: '100%',
                }}
            >
                {dropdownData ? (
                    <Stack direction="row" spacing={5}>

                        <Stack sx={{ width: "25%", overflowX: "scroll" }} textAlign='center'>
                            <Typography variant="h6" sx={{ fontSize: "14px" }} gutterBottom component="div">
                                {"User Provided Name"}
                            </Typography>
                            <Divider />
                            <Typography sx={{ fontSize: "12px" }} >
                                Home Hub
                            </Typography>

                            <Table size="small">
                                <TableRow >
                                    <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>ID</TableCell>
                                    <TableCell>{dropdownData.hh_id || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Slaves Connected</TableCell>
                                    <TableCell>{dropdownData.slaves_connected || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Firmware Version</TableCell>
                                    <TableCell >{dropdownData.hh_fw_ver}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Landline</TableCell>
                                    <TableCell >{dropdownData.landline}</TableCell>
                                </TableRow>
                            </Table>
                        </Stack>
                        <Stack sx={{ width: "25%", overflowX: "scroll" }} textAlign='center'>
                            <Box sx={{}}>
                                <Typography variant="h6" sx={{ fontSize: "14px" }} gutterBottom component="div">
                                    {"User Provided Name"}
                                </Typography>
                                <Divider />
                                <Typography sx={{ fontSize: "12px" }} >
                                    Beacon
                                </Typography>

                                <Table size="small" align="center">

                                    <TableRow >
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>ID</TableCell>
                                        <TableCell>   {dropdownData.b_id}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Battery Level</TableCell>
                                        <TableCell> {dropdownData.b_batt_lvl}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Solar Level</TableCell>
                                        <TableCell>{dropdownData.b_solar_lvl}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Temprature</TableCell>
                                        <TableCell> {dropdownData.b_temp}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>RSSI</TableCell>
                                        <TableCell> {dropdownData.b_rssi}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Firmware Version</TableCell>
                                        <TableCell> {dropdownData.b_fw_ver}</TableCell>

                                    </TableRow>
                                </Table>
                            </Box>
                        </Stack>
                        <Stack sx={{ width: "25%", overflowX: "scroll" }} textAlign='center'>
                            <Box sx={{}}>
                                <Typography variant="h6" sx={{ fontSize: "14px" }} gutterBottom component="div">
                                    {"User Provided Name"}
                                </Typography>
                                <Divider />
                                <Typography sx={{ fontSize: "12px" }} >
                                    Puck
                                </Typography>
                                <Table size="small">

                                    <TableRow >
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>ID</TableCell>
                                        <TableCell>{dropdownData.gp_id}</TableCell>

                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Battery Level</TableCell>
                                        <TableCell>{dropdownData.g_batt_lvl}</TableCell>
                                    </TableRow>

                                    {/* <TableRow>
                                <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Accelermeter</TableCell>
                                <TableCell>{row.original.puck[0].Accelerometer}</TableCell>
                            </TableRow> */}

                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>RSSI</TableCell>
                                        <TableCell>{dropdownData.g_rssi}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell variant="head" sx={{ backgroundColor: '#f3f3f3' }}>Firmware Version</TableCell>
                                        <TableCell >
                                            {dropdownData.g_fw_ver}
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </Box>
                        </Stack>
                    </Stack>
                ): (
                    <Typography variant="body2" color="textSecondary">
                        No data available.
                    </Typography>
                )}
            </Box >
        );
    }

    const table = useMaterialReactTable({
        columns,
        data,
        enableExpandAll: true, //hide expand all double arrow in column header
        enableExpanding: true,
        filterFromLeafRows: true, //apply filtering to all rows instead of just parent rows
        initialState: { expanded: false }, //expand all rows by default
        paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
        filterFromLeafRows: true,
        enableFullScreenToggle: false,
        columnFilterDisplayMode: 'popover',
        muiTableBodyRowProps: ({ row }) => ({
            onClick: (event) => {
                handleRowClick(row);
            },
            sx: {
                cursor: 'pointer', //you might want to change the cursor too when adding an onClick
                backgroundColor: getBackgroundColor(row.original.family_name),
                color: 'red',

            },
        }),
        renderDetailPanel,

    });

    return <MaterialReactTable table={table} />;
};

export default Materialtable;

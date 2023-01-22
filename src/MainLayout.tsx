import * as React from 'react';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import CurrentOrders from './CurrentOrders';
import FinishedOrders from './FinishedOrders';
import Header from './Header'
import Order from './Order';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


type Props = {}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const router = createBrowserRouter([
    {
      path: "/",
      element: <Order/>,
    },
    {
        path: "/currentOrders",
        element: <CurrentOrders/>,
      },
      {
        path: "/finishedOrders",
        element: <FinishedOrders/>,
      },
  ]);

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function MainLayout({}: Props) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
            <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Make Order" {...a11yProps(0)} />
              <Tab label="Current Orders" {...a11yProps(1)} />
              <Tab label="Finished Orders" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
          <Order/>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <CurrentOrders/>
          </TabPanel>
          <TabPanel value={value} index={2}>
          <FinishedOrders/>
          </TabPanel>
        </Box>
        <ToastContainer />

    </div>
  )
}
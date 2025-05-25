import {
  Add as AddIcon,
  AdminPanelSettings as AdminPanelIcon,
  CheckCircle as CheckCircleIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  ExitToApp as ExitToAppIcon,
  LightMode as LightModeIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  styled
} from '@mui/material';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentVerificationPage from './DocumentVerficationPage';
import ManageCourses from './ManageCourse';
import PendingEnrollmentsPage from './PendingEnrollmentsPage';
import Signup from './Signup';
import TeacherSignupPage from './TeacherSignupPage';
import UsersPage from './UsersPage';
import VerifyPaymentsPage from './VerifyPaymentsPage';
// Themes
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const drawerWidth = 260;

// Styled Components
const Sidebar = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

const NavItem = styled(ListItemButton)(({ theme, selected }) => ({
  margin: '4px 8px',
  borderRadius: 4,
  backgroundColor: selected ? theme.palette.action.selected : 'transparent'
}));

const MainContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: drawerWidth,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}));

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
    <CardContent sx={{ textAlign: 'center', py: 4 }}>
      <Icon sx={{ fontSize: 48, color }} />
      <Typography variant="h5" mt={1} fontWeight={600}>
        {value}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const theme = themeMode === 'light' ? lightTheme : darkTheme;
  const navigate = useNavigate(); 
  
const handleLogout = () => {
  localStorage.removeItem('authToken'); 
  navigate('/'); 
};

  const screens = [
    <DashboardHome key="home" setSelectedIndex={setSelectedIndex} />,
    <UsersPage key="users" />,
    <TeacherSignupPage key="teacher" />,
    <PendingEnrollmentsPage key="pending-enrollments" />,
    <Signup key="admin-signup" />,
    <ManageCourses key="manage-courses" />,
    <DocumentVerificationPage key="document-verification" />,
    <VerifyPaymentsPage key="verify-payments" />
  ];

  const titles = [
    'Dashboard',
    'Dashboard',
    'Dashboard',
    'Dashboard',
    'Dashboard',
    'Dashboard',
    'Dashboard',
    'Dashboard'
  ];

  const navItems = [
    { icon: <DashboardIcon />, label: 'Dashboard' },
    { icon: <PeopleIcon />, label: 'Users' },
    { icon: <PersonIcon />, label: 'Register Teacher' },
    { icon: <PersonAddIcon />, label: 'Pending Enrollments' },
    { icon: <PersonIcon />, label: 'Register Admin' },
    { icon: <SchoolIcon />, label: 'Manage Courses' },
    { icon: <CheckCircleIcon />, label: 'Document Verification' },
    { icon: <CheckCircleIcon />, label: 'Verify Payments' }
  ];

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const toggleTheme = () => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar variant="permanent" anchor="left">
          <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
              <AdminPanelIcon fontSize="large" />
            </Avatar>
          </Toolbar>
          <Divider />
          <List>
            {navItems.map((item, idx) => (
              <NavItem
                key={item.label}
                selected={selectedIndex === idx}
                onClick={() => setSelectedIndex(idx)}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </NavItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <List>
            <NavItem onClick={toggleTheme}>
              <ListItemIcon>
                {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </ListItemIcon>
              <ListItemText primary={themeMode === 'light' ? 'Dark Mode' : 'Light Mode'} />
            </NavItem>
            <NavItem onClick={() => { handleLogout() }}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </NavItem>
          </List>
        </Sidebar>

        <MainContainer>
          <AppBar
            position="fixed"
            color="inherit"
            elevation={1}
            sx={{ ml: drawerWidth, width: `calc(100% - ${drawerWidth}px)` }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" noWrap>{titles[selectedIndex]}</Typography>
              <Box>
                <IconButton onClick={toggleTheme} sx={{ mr: 1 }}>
                  {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                  <Avatar><PersonAddIcon /></Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
                  <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ mt: 8, flexGrow: 1, p: 3 }}>
            {screens[selectedIndex]}
          </Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};

// DashboardHome with Quick Actions
const DashboardHome = ({ setSelectedIndex }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    enrolledUsers: 0,
    totalCourses: 0,
    pendingEnrollments: 0,
    pendingDocuments: 0,
    pendingPayments: 0,
    verifiedUsers: 0,
    totalTeachers: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/stats/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats({
          ...response.data.stats,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard statistics'
        }));
      }
    };

    fetchDashboardStats();
  }, []);

  if (stats.loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Loading Dashboard...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  if (stats.error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Alert severity="error">{stats.error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Admin Overview</Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={PeopleIcon} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Users currently taking courses" value={stats.enrolledUsers} icon={SchoolIcon} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Users with verified document" value={stats.verifiedUsers} icon={CheckCircleIcon} color="#009688" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Teachers" value={stats.totalTeachers} icon={SchoolIcon} color="#673ab7" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Courses" value={stats.totalCourses} icon={SchoolIcon} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Enrollments" value={stats.pendingEnrollments} icon={PersonAddIcon} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Documents" value={stats.pendingDocuments} icon={DescriptionIcon} color="#f44336" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Payments" value={stats.pendingPayments} icon={PaymentIcon} color="#3f51b5" />
        </Grid>
      </Grid>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip icon={<AddIcon />} label="New Course" clickable onClick={() => setSelectedIndex(5)} />
            <Chip icon={<CheckCircleIcon />} label="Verify Documents" clickable onClick={() => setSelectedIndex(6)} />
            <Chip icon={<PaymentIcon />} label="Process Payments" clickable onClick={() => setSelectedIndex(7)} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;

// Manage Users Screen
// Admin user management interface
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Chip,
  InputAdornment,
  Pagination,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useAdmin } from '../../contexts/admin/AdminContextProvider';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { formatDate } from '../../utils/FormatUtils';

/**
 * Manage Users Screen
 * Admin interface for user management
 */
function ManageUsersScreen() {
  const {
    users,
    usersMeta,
    isLoading,
    listUsers,
    changeUserRole,
    disableUser,
    enableUser,
    deleteUser,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'role', 'disable', 'enable', 'delete'
  const [roleValue, setRoleValue] = useState('');
  const [reasonValue, setReasonValue] = useState('');

  useEffect(() => {
    handleListUsers(1);
  }, []);

  const handleListUsers = (page = 1) => {
    listUsers({
      page,
      limit: 10,
      search: searchQuery || undefined,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    handleListUsers(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handlePageChange = (event, page) => {
    handleListUsers(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openDialog = (type) => {
    setDialogType(type);
    if (type === 'role' && selectedUser) {
      setRoleValue(selectedUser.role || 'user');
    }
    setReasonValue('');
    handleMenuClose();
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedUser(null);
    setRoleValue('');
    setReasonValue('');
  };

  const handleChangeRole = async () => {
    if (selectedUser && roleValue) {
      const response = await changeUserRole(selectedUser.id, roleValue);
      if (response.success) {
        closeDialog();
        handleListUsers(usersMeta.currentPage);
      }
    }
  };

  const handleDisableUser = async () => {
    if (selectedUser) {
      const response = await disableUser(selectedUser.id, reasonValue);
      if (response.success) {
        closeDialog();
        handleListUsers(usersMeta.currentPage);
      }
    }
  };

  const handleEnableUser = async () => {
    if (selectedUser) {
      const response = await enableUser(selectedUser.id);
      if (response.success) {
        closeDialog();
        handleListUsers(usersMeta.currentPage);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const response = await deleteUser(selectedUser.id);
      if (response.success) {
        closeDialog();
        handleListUsers(usersMeta.currentPage);
      }
    }
  };

  if (isLoading && users.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
          }}
        >
          Manage Users
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
            textAlign: 'center',
          }}
        >
          View and manage all users in the system
        </Typography>

        {/* Search Card */}
        <Card sx={{ mb: 3, p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={handleSearchSubmit}
                    sx={{
                      background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Card>

        {/* Results Count */}
        {usersMeta.total > 0 && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 2,
              textAlign: 'center',
            }}
          >
            {usersMeta.total} user{usersMeta.total !== 1 ? 's' : ''} found
          </Typography>
        )}

        {/* Users Table */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email Verified</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name || 'N/A'}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role || 'user'}
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.email_verified ? 'Verified' : 'Unverified'}
                          color={user.email_verified ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.enabled ? 'Enabled' : 'Disabled'}
                          color={user.enabled ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, user)} size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {usersMeta.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination
                count={usersMeta.totalPages}
                page={usersMeta.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Card>

        {/* Actions Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => openDialog('role')}>Change Role</MenuItem>
          {selectedUser?.enabled ? (
            <MenuItem onClick={() => openDialog('disable')}>Disable User</MenuItem>
          ) : (
            <MenuItem onClick={() => openDialog('enable')}>Enable User</MenuItem>
          )}
          <MenuItem onClick={() => openDialog('delete')} sx={{ color: 'error.main' }}>
            Delete User
          </MenuItem>
        </Menu>

        {/* Change Role Dialog */}
        <Dialog open={dialogType === 'role'} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              Change role for <strong>{selectedUser?.name || selectedUser?.email}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleValue}
                label="Role"
                onChange={(e) => setRoleValue(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleChangeRole} variant="contained">
              Change Role
            </Button>
          </DialogActions>
        </Dialog>

        {/* Disable User Dialog */}
        <Dialog open={dialogType === 'disable'} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Disable User</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              Disable user <strong>{selectedUser?.name || selectedUser?.email}</strong>?
            </Typography>
            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={3}
              value={reasonValue}
              onChange={(e) => setReasonValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleDisableUser} variant="contained" color="warning">
              Disable User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enable User Dialog */}
        <Dialog open={dialogType === 'enable'} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Enable User</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Enable user <strong>{selectedUser?.name || selectedUser?.email}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleEnableUser} variant="contained" color="success">
              Enable User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={dialogType === 'delete'} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: 'error.main' }}>Delete User</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              Are you sure you want to delete{' '}
              <strong>{selectedUser?.name || selectedUser?.email}</strong>?
            </Typography>
            <Typography variant="body2" color="error">
              Warning: This action cannot be undone. All user data will be permanently deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleDeleteUser} variant="contained" color="error">
              Delete User
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ManageUsersScreen;

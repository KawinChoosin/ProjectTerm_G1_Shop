import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, Select, MenuItem, FormHelperText
} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Loadingcompo from "../../components/loading";
import { useForm, Controller } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface Customer {
  C_id: number;
  C_name: string;
  C_password: string;
  C_email: string;
  C_gender: string;
  C_age: number;
  T_pnum: string;
  C_Role: boolean;
}

function User() {
  const [user, setUser] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [changePass, setChangePass] = useState<boolean>(false);
  const [password, setPassword] = useState({ O_pass: '', N_pass: '', RN_pass: '' });
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showRetypePassword, setShowRetypePassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { C_id, setC_id } = useContext<any>(UserContext);

  // Initialize React Hook Form
  const { control, handleSubmit, reset, trigger, watch, formState: { errors } } = useForm({
    defaultValues: {
      C_name: '',
      C_email: '',
      T_pnum: '',
      C_gender: '',
      C_age: '',
    },
  });

  useEffect(() => {
    if (C_id !== null) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/profile?C_id=${C_id}`);
          setUser([response.data[0]]);
          reset(response.data[0]); // Set the fetched user data into the form
          setLoading(false);
        } catch (err) {
          setError('Error fetching user data.');
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      navigate('/login');
    }
  }, [C_id, reset, navigate, editMode]);

  const handleLogout = () => {
    setC_id(null);
    setUser([]);
    sessionStorage.removeItem("C_id"); // Clear the session storage
    navigate('/login');
  };

  if (loading) {
    return <Loadingcompo />;
  }

  if (error) {
    return <Typography variant="h5" color="error" sx={{ fontFamily: 'Montserrat' }}>{error}</Typography>;
  }

  const handleEditClick = (u: any) => {
    reset({
      C_name: u.C_name,
      C_email: u.C_email,
      T_pnum: u.T_pnum,
      C_gender: u.C_gender,
      C_age: u.C_age,
    });
    setEditMode(true);
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.put(`http://localhost:3000/profile?C_id=${C_id}`, data);
      setEditMode(false);
      alert('User updated successfully');
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleChangePass = async () => {
    try {
      if (password.O_pass === user[0]?.C_password) {
        if (password.N_pass === password.RN_pass) {
          await axios.put(`http://localhost:3000/profile/pass/${user[0].C_id}`, { C_password: password.N_pass });
          setChangePass(false);
          alert('Password updated successfully');
        } else {
          alert('Retyped password does not match the new password.');
        }
      } else {
        alert('Incorrect old password.');
      }
    } catch (err) {
      alert('Error updating password');
    }
  };

  function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name: string) {
    const nameParts = name.split(' ');

    let initials = '';
    if (nameParts.length === 1) {
      initials = `${nameParts[0][0]}`; 
    } else if (nameParts.length >= 2) {
      initials = `${nameParts[0][0]}${nameParts[1][0]}`;
    }

    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 120,
        height: 120,
        fontSize: 40,
        fontFamily: 'Montserrat',
      },
      children: initials.toUpperCase(),
    };
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'left', mt: 5, fontFamily: 'Montserrat' }}>
      {user.length === 0 ? (
        <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>No user data available</Typography>
      ) : (
        user.map((u: any) => (
          <Paper key={u.C} sx={{ width: '600px', padding: 4, borderRadius: 3, fontFamily: 'Montserrat' }}>
            <Grid container spacing={2}>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar {...stringAvatar(u.C_name)} />
              </Grid>
              <Grid size={12}>
                <Typography variant="h5" sx={{ textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 600 }}>
                  My Profile
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Username:</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>{u.C_name}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Email:</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>{u.C_email}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Phone:</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>{u.T_pnum}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Gender:</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>{u.C_gender}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Age:</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>{u.C_age}</Typography>
              </Grid>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'left', gap: '5%' }}>
                <Button variant="contained" color="success" onClick={() => handleEditClick(u)}>Edit</Button>
                <Button variant="contained" onClick={() => setChangePass(true)}>Change Password</Button>
                <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Controller
            name="C_name"
            control={control}
            rules={{
              required: 'Name is required',
              validate: (value) => !/\s/.test(value) || 'Name should not contain spaces',
            }}
            render={({ field }) => (
              <>
                <TextField
                fullWidth
                  sx={{ mb: 2,mt:1 }}
                  label="Username"
                  variant="outlined"
                  {...field}
                  error={Boolean(errors.C_name)}
                  helperText={errors.C_name?.message}
                />
              </>
            )}
          />
          {/* <Controller
            name="C_email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field }) => (
              <>
                <TextField
                fullWidth
                  sx={{ mb: 2 }}
                  label="Email"
                  variant="outlined"
                  {...field}
                  error={Boolean(errors.C_email)}
                  helperText={errors.C_email?.message}
                />
              </>
            )}
          /> */}
          <Controller
            name="T_pnum"
            control={control}
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]*$/,
                message: 'Phone number must be numeric',
              },
            }}
            render={({ field }) => (
              <>
                <TextField
                fullWidth
                  sx={{ mb: 2 }}
                  label="Phone"
                  variant="outlined"
                  {...field}
                  error={Boolean(errors.T_pnum)}
                  helperText={errors.T_pnum?.message}
                />
              </>
            )}
          />
          <Controller
            name="C_gender"
            control={control}
            rules={{ required: 'Gender is required' }}
            render={({ field }) => (
              <>
                <Select
                fullWidth
                  sx={{ mb: 2 }}
                  label="Gender"
                  {...field}
                  error={Boolean(errors.C_gender)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                <FormHelperText error={Boolean(errors.C_gender)}>{errors.C_gender?.message}</FormHelperText>
              </>
            )}
          />
          <Controller
            name="C_age"
            control={control}
            rules={{
              required: 'Age is required',
              pattern: {
                value: /^[0-9]*$/,
                message: 'Age must be numeric',
              },
            }}
            render={({ field }) => (
              <>
                <TextField
                fullWidth
                  
                  label="Age"
                  variant="outlined"
                  {...field}
                  error={Boolean(errors.C_age)}
                  helperText={errors.C_age?.message}
                />
              </>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ mb: 2 }} onClick={() => setEditMode(false)}>Cancel</Button>
          <Button sx={{ mb: 2 }} onClick={handleSubmit(onSubmit)}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePass} onClose={() => setChangePass(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
          fullWidth
            sx={{ mb: 2,mt:1 }}
            label="Old Password"
            type={showOldPassword ? 'text' : 'password'}
            variant="outlined"
            value={password.O_pass}
            onChange={(e) => setPassword({ ...password, O_pass: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword((prev) => !prev)}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            sx={{ mb: 2,mt:1 }}
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            variant="outlined"
            value={password.N_pass}
            onChange={(e) => setPassword({ ...password, N_pass: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
          fullWidth
            sx={{ mt:1 }}
            label="Retype New Password"
            type={showRetypePassword ? 'text' : 'password'}
            variant="outlined"
            value={password.RN_pass}
            onChange={(e) => setPassword({ ...password, RN_pass: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowRetypePassword((prev) => !prev)}>
                    {showRetypePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ mb: 2 }} onClick={() => setChangePass(false)}>Cancel</Button>
          <Button sx={{ mb: 2}} onClick={handleChangePass}>Change Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default User;

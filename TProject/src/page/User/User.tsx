import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,  InputAdornment} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Loadingcompo from "../../components/loading"

function User() {
  const [user, setUser] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [changePass, setChangePass] = useState<boolean>(false);
  const [formData, setFormData] = useState({ C_name: '', C_email: '', T_pnum: 0, C_gender: '', C_age: '' });
  const [password, setPassword] = useState({ O_pass: '', N_pass: '', RN_pass: '' });
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showRetypePassword, setShowRetypePassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { C_id,setC_id } = useContext<any>(UserContext);



  useEffect(() => {
    if ( C_id !== null) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/profile?C_id=${C_id}`);
          setUser([response.data[0]]);
          setLoading(false);
        } catch (err) {
          setError('Error fetching user data.');
          setLoading(false);
        }
      };
      fetchUser();
    }else{
      navigate('/login');
    }
  }, [ C_id, editMode,navigate]);

  const handleLogout = () => {
    setC_id(null);
    setUser([]);
    sessionStorage.removeItem("C_id"); // Clear the session storage
    navigate('/login');
  };
  
  console.log(C_id)

  if (loading) {
    return <Loadingcompo/>;
  }

  if (error) {
    return <Typography variant="h5" color="error" sx={{ fontFamily: 'Montserrat' }}>{error}</Typography>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'O_pass' || name === 'N_pass' || name === 'RN_pass') {
      setPassword((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'T_pnum' ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleEditClick = (u: any) => {
    setFormData({
      C_name: u.C_name,
      C_email: u.C_email,
      T_pnum: u.T_pnum,
      C_gender: u.C_gender,
      C_age: u.C_age,
    });
    setEditMode(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/profile?C_id=${C_id}`, formData);
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
  
    // Check if there are two or more parts to the name
    let initials = '';
    if (nameParts.length === 1) {
      initials = `${nameParts[0][0]}`; // If only one part, use the first letter
    } else if (nameParts.length >= 2) {
      initials = `${nameParts[0][0]}${nameParts[1][0]}`; // Use the first letter of the first two parts
    }
  
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 120,
        height: 120,
        fontSize: 40,
        fontFamily: 'Montserrat',
      },
      children: initials.toUpperCase(), // Ensure the initials are in uppercase
    };
  }
  


  return (
    <Box sx={{ display: 'flex', justifyContent: 'left', mt: 5, fontFamily: 'Montserrat' }}>
      {user.length === 0 ? (
        <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>No user data available</Typography>
      ) : (
        user.map((u: any) => (
          <Paper key={u.C_email} sx={{ width: '600px', padding: 4, borderRadius: 3, fontFamily: 'Montserrat' }}>
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
                <Button variant="outlined" color="error" onClick={() => handleEditClick(u)}>Edit</Button>
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
        <DialogContent >
          <TextField sx={{mt:'20px'}} fullWidth name="C_name" label="Name" value={formData.C_name} onChange={handleInputChange} />
          <TextField sx={{mt:'20px'}} fullWidth name="C_email" label="Email" value={formData.C_email} onChange={handleInputChange} />
          <TextField sx={{mt:'20px'}} fullWidth name="T_pnum" label="Phone" value={formData.T_pnum} onChange={handleInputChange} />
          <TextField sx={{mt:'20px'}} fullWidth name="C_gender" label="Gender" value={formData.C_gender} onChange={handleInputChange} />
          <TextField sx={{mt:'20px'}} fullWidth name="C_age" label="Age" value={formData.C_age} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button sx={{mb:'20px'}}  onClick={() => setEditMode(false)}>Cancel</Button>
          <Button sx={{mb:'20px',mr:"20px"}} onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePass} onClose={() => setChangePass(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            sx={{mb:'20px'}}
            fullWidth
            label="Old Password"
            type={showOldPassword ? 'text' : 'password'}
            name="O_pass"
            value={password.O_pass}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{fontSize:'14px'}} onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? 'Hide' : 'Show'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            sx={{mb:'20px'}}
            fullWidth
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            name="N_pass"
            value={password.N_pass}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{fontSize:'14px'}} onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? 'Hide' : 'Show'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
 
            fullWidth
            label="Retype New Password"
            type={showRetypePassword ? 'text' : 'password'}
            name="RN_pass"
            value={password.RN_pass}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{fontSize:'14px'}}  onClick={() => setShowRetypePassword(!showRetypePassword)}>
                    {showRetypePassword ? 'Hide' : 'Show'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{mb:'20px'}} onClick={() => setChangePass(false)}>Cancel</Button>
          <Button sx={{mb:'20px',mr:"20px"}} onClick={handleChangePass}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default User;

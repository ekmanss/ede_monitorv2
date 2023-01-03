import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../slices/AuthSlice";
import { close } from "../../../slices/MessagesSlice";

export default function LoginForm() {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const initialValues = {
        username: "",
        password: "",
    };

    const [values, setValues] = useState(initialValues);

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = (values) => {
      console.log("values", values);
      setLoading(true);
      const { username, password } = values;
      dispatch(login({ username, password }))
          .unwrap()
          .then(() => {
              navigate("/dashboard/esbtuser");
              // window.location.reload();
          })
          .catch(() => {
              setLoading(false);
          });
    // navigate('/dashboard', { replace: true });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="user name" onChange={
            (e) => {
                setValues({
                    ...values,
                    username: e.target.value,
                });
            }
        } />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={
            (e) => {
                setValues({
                    ...values,
                    password: e.target.value,
                });
            }
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/*<Checkbox name="remember" label="Remember me" />*/}
        {/*<Link variant="subtitle2" underline="hover">*/}
        {/*  Forgot password?*/}
        {/*</Link>*/}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={()=>{
          handleClick(values);
      }
      }>
        Login
      </LoadingButton>
    </>
  );
}

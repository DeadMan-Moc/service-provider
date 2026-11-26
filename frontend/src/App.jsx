import { useState } from 'react';
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Divider, Link, Paper,
  Stack, TextField, Typography,
} from '@mui/material';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', password: '' };

async function submitAuth(mode, form) {
  const response = await fetch(`/api/v1/auth/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mode === 'register' ? form : { email: form.email, password: form.password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || body.message || 'We could not complete that request. Please try again.');
  return body;
}

function Brand() {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Avatar variant="rounded" sx={{ bgcolor: 'primary.main', width: 38, height: 38, borderRadius: 2 }}>
        <VerifiedUserRoundedIcon fontSize="small" />
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-.04em' }}>ServiceHub</Typography>
    </Stack>
  );
}

function AccountStatus({ session, onSignOut }) {
  const status = session.user.status;
  const steps = [
    ['Account created', true],
    ['Email verification', status !== 'PENDING_EMAIL_VERIFICATION'],
    ['Identity review', status === 'VERIFIED'],
    ['Request a service', status === 'VERIFIED'],
  ];
  return (
    <Paper elevation={0} sx={{ width: 'min(100%, 650px)', p: { xs: 3, sm: 5 }, border: '1px solid #e6eaf2' }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Brand />
          <Button onClick={onSignOut} color="inherit">Sign out</Button>
        </Stack>
        <Box>
          <Chip size="small" color={status === 'VERIFIED' ? 'success' : 'warning'} label={status.replaceAll('_', ' ')} />
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 750 }}>Welcome, {session.user.firstName}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {status === 'VERIFIED'
              ? 'Your account is verified. Service requests will be available in your workspace.'
              : 'Your account is created. Complete verification to unlock service requests.'}
          </Typography>
        </Box>
        <Divider />
        <Stack spacing={2}>
          {steps.map(([label, complete], index) => (
            <Stack key={label} direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 30, height: 30, bgcolor: complete ? '#e8f6ef' : '#f0f2f7', color: complete ? '#25835f' : '#667085', fontSize: 14 }}>
                {complete ? <CheckCircleRoundedIcon sx={{ fontSize: 19 }} /> : index + 1}
              </Avatar>
              <Typography fontWeight={600}>{label}</Typography>
              {complete && <Chip size="small" label="Done" color="success" variant="outlined" />}
            </Stack>
          ))}
        </Stack>
        {status !== 'VERIFIED' && (
          <Alert severity="info" icon={<ShieldRoundedIcon />}>
            Email delivery and government ID/selfie review need to be connected before verification can be completed.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}

export default function App() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await submitAuth(mode === 'register' ? 'register' : 'login', form);
      setSession(result);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (session) return (
    <Box className="page-shell" sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', p: 2 }}>
      <AccountStatus session={session} onSignOut={() => { setSession(null); setForm(emptyForm); }} />
    </Box>
  );

  return (
    <Box className="page-shell" sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr .95fr' } }}>
      <Box className="brand-panel" sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', p: { md: 6, lg: 9 }, color: 'white' }}>
        <Brand />
        <Box sx={{ maxWidth: 520, py: 5 }}>
          <Chip label="A safer way to get things done" sx={{ mb: 3, color: 'white', borderColor: 'rgba(255,255,255,.35)' }} variant="outlined" />
          <Typography variant="h2" sx={{ fontSize: { md: 44, lg: 56 }, lineHeight: 1.08 }}>
            Trusted services, from request to completion.
          </Typography>
          <Typography sx={{ mt: 2.5, color: 'rgba(255,255,255,.77)', fontSize: 17, lineHeight: 1.7 }}>
            A clear, secure place to request professional services and follow every step along the way.
          </Typography>
          <Stack spacing={2} sx={{ mt: 5 }}>
            {['Verified client accounts', 'Transparent request progress', 'Protected payment workflow'].map((item) => (
              <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                <CheckCircleRoundedIcon sx={{ color: '#9ce0c6' }} />
                <Typography sx={{ color: 'rgba(255,255,255,.92)' }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.6)' }}>ServiceHub · South Africa</Typography>
      </Box>

      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2.5, sm: 5 }, position: 'relative' }}>
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 5 }}><Brand /></Box>
        <Box sx={{ width: 'min(100%, 430px)' }}>
          <Chip icon={<LockOutlinedIcon />} label="Secure client access" size="small" variant="outlined" sx={{ mb: 2.5, borderColor: '#dbe1ed' }} />
          <Typography variant="h4" sx={{ fontWeight: 760, letterSpacing: '-.04em' }}>
            {mode === 'register' ? 'Create your account' : 'Welcome back'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {mode === 'register' ? 'Start by creating a secure client account.' : 'Sign in to continue to your ServiceHub account.'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3.5 }}>
            <Stack spacing={2}>
              {mode === 'register' && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="First name" autoComplete="given-name" value={form.firstName} onChange={update('firstName')} required fullWidth />
                  <TextField label="Last name" autoComplete="family-name" value={form.lastName} onChange={update('lastName')} required fullWidth />
                </Stack>
              )}
              <TextField label="Email address" type="email" autoComplete="email" value={form.email} onChange={update('email')} required fullWidth />
              {mode === 'register' && <TextField label="Phone number" autoComplete="tel" value={form.phone} onChange={update('phone')} required fullWidth />}
              <TextField label="Password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={form.password} onChange={update('password')} required fullWidth inputProps={mode === 'register' ? { minLength: 12, maxLength: 72 } : {}} helperText={mode === 'register' ? 'Use at least 12 characters.' : ''} />
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" size="large" endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardRoundedIcon />} disabled={loading} sx={{ py: 1.35 }}>
                {mode === 'register' ? 'Create account' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Typography align="center" sx={{ mt: 3, color: 'text.secondary' }}>
            {mode === 'register' ? 'Already have an account?' : 'New to ServiceHub?'}{' '}
            <Link component="button" type="button" underline="hover" fontWeight={700} onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>
              {mode === 'register' ? 'Sign in' : 'Create an account'}
            </Link>
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 5, color: 'text.secondary' }}>
            <ShieldRoundedIcon sx={{ fontSize: 17 }} />
            <Typography variant="caption">Your account details are protected.</Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

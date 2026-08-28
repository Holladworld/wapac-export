import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { validateEmail, validateRequired } from '../../lib/validation';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetting, setResetting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) e.email = emailCheck.message!;
    const passCheck = validateRequired(password, 'Password');
    if (!passCheck.valid) e.password = passCheck.message!;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setServerError(result.error || 'Login failed');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSent(false);
    
    const emailCheck = validateEmail(resetEmail);
    if (!emailCheck.valid) {
      setResetError(emailCheck.message || 'Invalid email');
      return;
    }
    
    setResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: window.location.origin + '/admin',
      });
      
      if (error) throw error;
      
      setResetSent(true);
      setResetEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
      }, 4000);
    } catch (error: any) {
      setResetError(error.message || 'Failed to send reset email. Please try again.');
    }
    setResetting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--tcf-bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>
            {showForgotPassword ? 'Reset Password' : 'Admin Login'}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--tcf-secondary-text)' }}>
            {showForgotPassword 
              ? 'Enter your email to receive a password reset link' 
              : 'Sign in to manage Wapac Export'}
          </p>
        </div>

        <div className="p-8" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
          {showForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {resetSent ? (
                <div className="p-4 text-center" style={{ backgroundColor: 'rgba(22,163,74,0.1)', border: '1px solid #16a34a' }}>
                  <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: '#16a34a' }} />
                  <p className="text-sm font-medium" style={{ color: '#16a34a' }}>Reset link sent!</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>
                    Check your email for the password reset link.
                  </p>
                </div>
              ) : (
                <>
                  {resetError && (
                    <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
                      <AlertCircle size={16} /> {resetError}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center border" style={{ borderColor: resetError ? '#dc2626' : 'var(--tcf-border)' }}>
                      <Mail size={16} className="ml-3" style={{ color: 'var(--tcf-secondary-text)' }} />
                      <input
                        type="email"
                        placeholder="Admin Email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-3 py-3 text-sm bg-transparent outline-none"
                        style={{ color: 'var(--tcf-text)' }}
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={resetting}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                    style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
                  >
                    {resetting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {resetting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetError('');
                  setResetSent(false);
                }}
                className="w-full text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--tcf-secondary-text)' }}
              >
                ← Back to Login
              </button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {serverError && (
                <div className="p-3 flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
                  <AlertCircle size={16} /> {serverError}
                </div>
              )}
              <div>
                <div className="flex items-center border" style={{ borderColor: errors.email ? '#dc2626' : 'var(--tcf-border)' }}>
                  <Mail size={16} className="ml-3" style={{ color: 'var(--tcf-secondary-text)' }} />
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                    className="w-full px-3 py-3 text-sm bg-transparent outline-none"
                    style={{ color: 'var(--tcf-text)' }}
                  />
                </div>
                {errors.email && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.email}</span>}
              </div>
              <div>
                <div className="flex items-center border" style={{ borderColor: errors.password ? '#dc2626' : 'var(--tcf-border)' }}>
                  <Lock size={16} className="ml-3" style={{ color: 'var(--tcf-secondary-text)' }} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                    className="w-full px-3 py-3 text-sm bg-transparent outline-none"
                    style={{ color: 'var(--tcf-text)' }}
                  />
                </div>
                {errors.password && <span className="text-xs mt-1 block" style={{ color: '#dc2626' }}>{errors.password}</span>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-xs transition-colors hover:opacity-80"
                style={{ color: 'var(--tcf-secondary-text)' }}
              >
                Forgot Password?
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
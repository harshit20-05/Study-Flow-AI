import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, BookOpen } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength += 30;
    if (pass.length > 8) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 15;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 15;
    return Math.min(100, strength);
  };
  
  const strength = calculateStrength(formData.password);
  
  const getStrengthColor = () => {
    if (strength < 40) return 'var(--warn2)';
    if (strength < 70) return '#ffd23c';
    return 'var(--accent3)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email,
          password: formData.password,
          remember_me: true
        });
        localStorage.setItem('lifeos_token', res.data.access_token);
        onLogin(res.data.user);
      } else {
        const res = await axios.post(`${API_BASE_URL}/signup`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('lifeos_token', res.data.access_token);
        onLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication Failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Animated Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="logo-dot" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><BookOpen size={24} /></div>
          <h1 className="auth-title">Welcome to <span className="glow-text">StudyFlow AI</span></h1>
          <p className="auth-subtitle">{isLogin ? "Access Your Intelligence Engine" : "Initialize Your Control Center"}</p>
        </div>

        {error && <div className="auth-error fade-in">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="Full Name" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input type="email" placeholder="Email Address" required
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input type={showPassword ? "text" : "password"} placeholder="Password" required
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLogin && (
            <>
              <div className="pwd-strength">
                <div className="pwd-bar"><div className="pwd-fill" style={{ width: `${strength}%`, backgroundColor: getStrengthColor() }}></div></div>
                <span style={{ color: getStrengthColor(), fontSize: 11 }}>
                  {strength < 40 ? "Weak" : strength < 70 ? "Good" : "Strong"}
                </span>
              </div>
              <div className="input-group">
                <ShieldCheck size={18} className="input-icon" />
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" required
                  value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </>
          )}

          {isLogin && (
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-pwd" onClick={(e) => { e.preventDefault(); setError("Reset link sent to your email!"); }}>Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <span className="spinner auth-spinner"></span> : (isLogin ? "Sign In \u2192" : "Create Engine \u2192")}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "New to StudyFlow?" : "Already have an engine?"} 
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({name: '', email: '', password: '', confirmPassword: ''}) }}>
            {isLogin ? "Deploy Now" : "Sign In"}
          </button>
        </div>
      </div>
      <div className="auth-footer">
        Powered by Advanced Neural Architectures
      </div>
    </div>
  );
}

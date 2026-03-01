import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // Đổi username thành email cho khớp với BE
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi API thật từ Backend
      const response = await authApi.login({ email, password });

      // Lưu thông tin vào LocalStorage (Bao gồm token, refreshToken và user info)
      const authData = response.data;
      localStorage.setItem('user', JSON.stringify({
        token: authData.token,
        role: authData.user.role, // Lưu Role ra ngoài cùng cho dễ check
        info: authData.user       // Lưu các thông tin khác vào info
      }));

      // Điều hướng dựa trên Role từ BE trả về
      const role = authData.user.role.toUpperCase();
      switch (role) {
        case 'ADMIN':
        case 'MANAGER':
          navigate('/admin');
          break;
        case 'KITCHEN':
          navigate('/kitchen');
          break;
        case 'STAFF':
          navigate('/staff');
          break;
        default:
          navigate('/menu');
      }
    } catch (err: any) {
      // Hiển thị lỗi từ BE trả về (ApiResponse.message)
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-light-gray relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://picsum.photos/seed/restaurant/1920/1080")', backgroundSize: 'cover' }}></div>
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10">

        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-12 bg-[#800020] text-white"> {/* burgundy color hex */}
          <div>
            <div className="flex items-center gap-2 mb-12">
              <span className="material-symbols-outlined text-4xl">restaurant</span>
              <h1 className="text-2xl font-bold tracking-tight">RestoManager</h1>
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight mb-6">
              Excellence in every <span className="text-[#FFD700]">service</span>. {/* cheese color hex */}
            </h2>
            <p className="text-white/70 text-lg">The complete kitchen and floor management system.</p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FFD700] animate-pulse"></span>
              <span className="text-sm font-semibold uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Login</h3>
          <p className="text-gray-500 mb-8">Enter your credentials to access the system.</p>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Email Address</label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 h-14 px-4 focus:ring-2 focus:ring-[#800020] outline-none transition-all"
                placeholder="admin@restomanager.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase mb-2">Password</label>
              <input
                className="w-full rounded-xl border border-gray-200 h-14 px-4 focus:ring-2 focus:ring-[#800020] outline-none transition-all"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-red-600 text-sm font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`h-14 bg-[#FFD700] hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 uppercase tracking-wide ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span>{loading ? 'Authenticating...' : 'Log In'}</span>
              {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
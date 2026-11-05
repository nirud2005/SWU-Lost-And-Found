import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Data State
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('อาคารเรียนรวมมล.ปิ่น มาลากุล (ตึก 300 ปี)');
  const [type, setType] = useState('lost');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const mockItems = [
    {
      id: 1,
      title: 'กระเป๋าตังค์หนังสีดำ',
      location: 'อาคารเรียนรวมมล.ปิ่น มาลากุล (ตึก 300 ปี)',
      type: 'lost',
      description: 'ทำตกไว้แถวใต้ตึก มีบัตรนิสิต มศว อยู่ข้างใน',
      contact: '081-234-5678',
      date: '5 พ.ย. 2026',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      title: 'พบหูฟัง AirPods Pro',
      location: 'โรงอาหารกลาง (ตึก 21)',
      type: 'found',
      description: 'เก็บได้ที่โต๊ะกินข้าว ฝากไว้ที่เคาน์เตอร์ประชาสัมพันธ์',
      contact: 'IG: student_swu',
      date: '5 พ.ย. 2026',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=60'
    }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        setItems(mockItems);
      } else {
        setItems(data);
      }
    } catch (e) {
      setItems(mockItems);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const newItem = {
      title,
      location,
      type,
      description,
      contact,
      date: new Date().toLocaleDateString('th-TH'),
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60'
    };

    try {
      await supabase.from('items').insert([newItem]);
    } catch (err) {
      console.log('Local update fallback');
    }

    setItems([newItem, ...items]);
    setActiveTab('feed');
    setTitle('');
    setDescription('');
    setContact('');
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' ? true : item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-[6px] border-slate-800">
        
        {/* Status Bar */}
        <div className="bg-[#C8102E] text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span>SWU Wi-Fi</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>
        </div>

        {/* HEADER */}
        <div className="bg-[#C8102E] text-white px-5 py-3 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white text-[#C8102E] flex items-center justify-center font-black text-sm shadow">
              SWU
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Smart Lost & Found</h1>
              <p className="text-[10px] text-red-100">มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
            </div>
          </div>
          {isLoggedIn && (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-[11px] bg-red-800/80 px-2.5 py-1 rounded-full text-red-100 hover:bg-red-800"
            >
              ออกจากระบบ
            </button>
          )}
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
          
          {/* SCREEN 1: LOGIN FORM (เมื่อยังไม่ได้เข้าสู่ระบบ) */}
          {!isLoggedIn ? (
            <div className="p-6 flex flex-col justify-center min-h-[680px]">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center mx-auto mb-3 border-2 border-[#C8102E]/20 shadow-sm">
                  <span className="font-black text-2xl">SWU</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">เข้าสู่ระบบ</h2>
                <p className="text-xs text-slate-500 mt-1">SWU Smart Lost & Found</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">อีเมลมหาวิทยาลัย</label>
                  <input
                    type="email"
                    required
                    placeholder="name@g.swu.ac.th"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">รหัสผ่าน</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPass"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showPass" className="text-xs text-slate-600 cursor-pointer">แสดงรหัสผ่าน</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all text-sm mt-2"
                >
                  เข้าสู่ระบบ
                </button>

                <button
                  type="button"
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full border-2 border-blue-600 text-blue-600 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm"
                >
                  สมัครสมาชิก
                </button>
              </form>

              {/* SOCIAL LOGIN BUTTONS WITH ICONS */}
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 font-medium mb-4">หรือเข้าสู่ระบบด้วย</p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button 
                    onClick={() => setIsLoggedIn(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 transition-all"
                  >
                    <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span className="text-xs font-bold text-blue-700">Google</span>
                  </button>

                  {/* Apple */}
                  <button 
                    onClick={() => setIsLoggedIn(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 transition-all"
                  >
                    <svg className="w-6 h-6 mb-1 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.95c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.16-.57 2.81-1.37z"/>
                    </svg>
                    <span className="text-xs font-bold text-blue-700">Apple</span>
                  </button>

                  {/* SWU OAuth */}
                  <button 
                    onClick={() => setIsLoggedIn(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 transition-all"
                  >
                    <div className="w-6 h-6 mb-1 rounded-full bg-[#C8102E] text-white flex items-center justify-center text-[10px] font-black">
                      🎓
                    </div>
                    <span className="text-xs font-bold text-blue-700">มศว</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* SCREEN 2: MAIN APP (เมื่อเข้าสู่ระบบแล้ว) */
            <div className="p-4 space-y-4">
              {activeTab === 'feed' && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ค้นหาของหาย, สถานที่..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl text-xs border border-slate-200 shadow-sm focus:outline-none"
                    />
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === 'all' ? 'bg-[#C8102E] text-white' : 'bg-white text-slate-600'}`}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      onClick={() => setFilter('lost')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === 'lost' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600'}`}
                    >
                      🔴 ตามหาของหาย
                    </button>
                    <button
                      onClick={() => setFilter('found')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === 'found' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}
                    >
                      🟢 เก็บได้
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-3">
                        <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {item.type === 'lost' ? 'ตามหาของหาย' : 'เก็บได้'}
                          </span>
                          <h3 className="font-bold text-slate-800 text-xs mt-1">{item.title}</h3>
                          <p className="text-[11px] text-slate-500">📍 {item.location}</p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{item.description}</p>
                          <p className="text-[11px] text-[#C8102E] font-medium mt-1">ติดต่อ: {item.contact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'post' && (
                <form onSubmit={handlePost} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                  <h2 className="text-sm font-bold text-slate-800">ลงประกาศใหม่</h2>
                  <div>
                    <label className="block text-xs font-semibold mb-1">ชื่อสิ่งของ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น บัตรนิสิต, ร่ม, AirPods"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">สถานที่พบ / หาย *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น ตึก 300 ปี, โรงอาหารกลาง"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">รายละเอียดเพิ่มเติม</label>
                    <textarea
                      rows="3"
                      placeholder="ระบุจุดสังเกต..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">ข้อมูลติดต่อ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เบอร์โทร / LINE ID"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#C8102E] text-white py-2 rounded-xl text-xs font-bold">
                    เผยแพร่ประกาศ
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION (เมื่อเข้าสู่ระบบแล้ว) */}
        {isLoggedIn && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-2 flex justify-around items-center">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center text-[10px] ${activeTab === 'feed' ? 'text-[#C8102E] font-bold' : 'text-slate-400'}`}
            >
              <span className="text-base">📋</span>
              <span>รายการ</span>
            </button>
            <button 
              onClick={() => setActiveTab('post')}
              className={`flex flex-col items-center text-[10px] ${activeTab === 'post' ? 'text-[#C8102E] font-bold' : 'text-slate-400'}`}
            >
              <span className="text-base">➕</span>
              <span>แจ้งโพสต์</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

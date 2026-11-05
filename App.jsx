import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Credentials (ดึงจาก Environment Variables บน Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'นิสิต มศว', email: 'student@g.swu.ac.th' });

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('กระเป๋า/กระเป๋าสตางค์');
  const [location, setLocation] = useState('อาคาร 400 ปี (หอประชุม)');
  const [type, setType] = useState('lost');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  // Mock initial data if Supabase is empty
  const mockItems = [
    {
      id: 1,
      title: 'กระเป๋าตังค์หนังสีดำ',
      category: 'กระเป๋า/กระเป๋าสตางค์',
      location: 'อาคารเรียนรวมมล.ปิ่น มาลากุล (ตึก 300 ปี)',
      type: 'lost',
      description: 'ทำตกไว้แถวใต้ตึก มีบัตรนิสิต มศว อยู่ข้างในค่ะ',
      contact: 'IG: student_swu',
      date: '5 พ.ย. 2026',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      title: 'พบหูฟัง AirPods Pro',
      category: 'อุปกรณ์ไอที/อิเล็กทรอนิกส์',
      location: 'โรงอาหารกลาง (ตึก 21)',
      type: 'found',
      description: 'เก็บได้ที่โต๊ะกินข้าวฝั่งร้านน้ำ ล็อกไว้ที่เคาน์เตอร์ประชาสัมพันธ์',
      contact: '081-234-5678',
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

  const handlePost = async (e) => {
    e.preventDefault();
    const newItem = {
      title,
      category,
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
      console.log('Using local state update');
    }

    setItems([newItem, ...items]);
    setActiveTab('feed');
    // Reset form
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
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border-[8px] border-slate-900 relative">
        
        {/* Status Bar Decorator (Mobile Look) */}
        <div className="bg-[#C8102E] text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span>SWU Wi-Fi</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
        </div>

        {/* Header App Bar */}
        <div className="bg-[#C8102E] text-white px-5 pb-4 pt-1 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white text-[#C8102E] flex items-center justify-center font-bold text-lg shadow-inner">
              SWU
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-tight tracking-wide">Smart Lost & Found</h1>
              <p className="text-[11px] text-red-100 opacity-90">มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
            </div>
          </div>
          {!isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md transition-all font-medium"
            >
              เข้าสู่ระบบ
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-800 border-2 border-white flex items-center justify-center text-xs font-bold">
              นิสิต
            </div>
          )}
        </div>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
          
          {/* TAB 1: FEED (หน้าแรกรายการของหาย) */}
          {activeTab === 'feed' && (
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาของหาย, สถานที่ (ตึก 300 ปี, โรงอาหาร)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === 'all' 
                      ? 'bg-[#C8102E] text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  ทั้งหมด ({items.length})
                </button>
                <button
                  onClick={() => setFilter('lost')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === 'lost' 
                      ? 'bg-rose-600 text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  🔴 ตามหาของหาย
                </button>
                <button
                  onClick={() => setFilter('found')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === 'found' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  🟢 เก็บได้แจ้งเจ้าของ
                </button>
              </div>

              {/* Feed Items List */}
              <div className="space-y-3.5">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex gap-3.5 hover:shadow-md transition-all">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-24 h-24 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.type === 'lost' ? 'ตามหาของหาย' : 'เก็บของได้'}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">📍 {item.location}</p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                        <span className="text-[11px] text-[#C8102E] font-medium">ติดต่อ: {item.contact}</span>
                        <button className="bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg font-medium">
                          รายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: POST (แจ้งของหาย / ประกาศเก็บได้) */}
          {activeTab === 'post' && (
            <div className="p-5">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-1">ลงประกาศใหม่</h2>
                <p className="text-xs text-slate-500 mb-4">แจ้งของหายหรือของที่เก็บได้เพื่อให้เพื่อนๆ มศว ช่วยตามหา</p>

                <form onSubmit={handlePost} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ประเภทประกาศ</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setType('lost')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          type === 'lost' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        🔴 ตามหาของหาย
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('found')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          type === 'found' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        🟢 พบสิ่งของ (แจ้งหาเจ้าของ)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อสิ่งของ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น บัตรนิสิต, ร่มสีฟ้า, หูฟังไร้สาย"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">สถานที่พบ / หาย *</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    >
                      <option>อาคาร 400 ปี (หอประชุม)</option>
                      <option>อาคารเรียนรวมมล.ปิ่น มาลากุล (ตึก 300 ปี)</option>
                      <option>โรงอาหารกลาง (ตึก 21)</option>
                      <option>สำนักหอสมุดกลาง (ตึก 24)</option>
                      <option>สนามเทนนิส / สนามกีฬา</option>
                      <option>อาคาร

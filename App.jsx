import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, map, post, calendar, profile, notifications, scan
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({ name: 'นิริน', email: 'nirin@g.swu.ac.th', verified: false });

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('กระเป๋า');
  const [location, setLocation] = useState('อาคารเรียนรวม (Learning Tower)');
  const [type, setType] = useState('lost');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const mockItems = [
    {
      id: 1,
      title: 'กล่องดินสอสีเขียว',
      category: 'อุปกรณ์การเรียน',
      location: 'อาคารเรียนรวม (Learning Tower)',
      type: 'lost',
      date: '5 พ.ย. 2569 23:25 น.',
      icon: '✏️',
      color: 'bg-rose-100 text-rose-500'
    },
    {
      id: 2,
      title: 'กระเป๋าสตางค์',
      category: 'กระเป๋า',
      location: 'สำนักหอสมุดกลาง',
      type: 'lost',
      date: '4 พ.ย. 2569 23:25 น.',
      icon: '👜',
      color: 'bg-rose-100 text-rose-500'
    },
    {
      id: 3,
      title: 'โทรศัพท์มือถือ',
      category: 'มือถือ',
      location: 'โรงอาหาร',
      type: 'found',
      date: '3 พ.ย. 2569 23:25 น.',
      icon: '📱',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      id: 4,
      title: 'กุญแจ',
      category: 'กุญแจ',
      location: 'ทางเข้า ซอยสุขุมวิท 23',
      type: 'found',
      date: '2 พ.ย. 2569 23:25 น.',
      icon: '🔑',
      color: 'bg-emerald-100 text-emerald-600'
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

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      title,
      category,
      location,
      type,
      description,
      contact,
      date: '5 พ.ย. 2569 23:25 น.',
      icon: category === 'กระเป๋า' ? '👜' : category === 'มือถือ' ? '📱' : category === 'กุญแจ' ? '🔑' : '✏️'
    };

    try {
      await supabase.from('items').insert([newItem]);
    } catch (err) {
      console.log('Using local fallback');
    }

    setItems([newItem, ...items]);
    setActiveTab('home');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#EBF3FF] flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#F4F8FE] min-h-screen sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-[8px] border-slate-800">

        {/* Dynamic Top Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          
          {/* HEADER (Always visible except Scan) */}
          {activeTab !== 'scan' && (
            <div className="bg-white px-5 pt-5 pb-3 flex justify-between items-center shadow-sm">
              <h1 className="text-lg font-extrabold text-[#1E293B]">Smart Lost & Found</h1>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('scan')} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  📷
                </button>
                <button onClick={() => setActiveTab('notifications')} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center relative text-slate-600">
                  🔔
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: HOME (หน้าหลัก) */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              {/* Banner Notice */}
              <div className="bg-[#FEF6E6] border border-[#FDE6B5] rounded-2xl p-3.5 text-xs text-[#92400E]">
                <p className="font-bold mb-0.5">โหมดทดลอง</p>
                <p className="text-[11px] leading-relaxed">ตอนนี้ประกาศเก็บในเครื่องนี้เท่านั้น เพื่อนยังไม่เห็น ต้องเปิดฐานข้อมูลก่อน (ดู README)</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔎 ค้นหาของหาย / ของที่เก็บได้"
                  className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-slate-700 shadow-sm border border-slate-100 focus:outline-none"
                />
              </div>

              {/* Broadcast Card */}
              <div className="bg-[#3B82F6] text-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1 opacity-90">
                  <span>📢</span> ประชาสัมพันธ์
                </div>
                <p className="text-sm font-bold">ประกาศ: พบกระเป๋าสตางค์ ที่สำนักหอสมุดกลาง ชั้น 1</p>
                <p className="text-[10px] opacity-80 mt-1">5 พ.ย. 2569</p>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { name: 'กระเป๋า', icon: '👜', bg: 'bg-purple-100' },
                  { name: 'มือถือ', icon: '📱', bg: 'bg-indigo-100' },
                  { name: 'กุญแจ', icon: '🔑', bg: 'bg-amber-100' },
                  { name: 'บัตรนักศึกษา', icon: '🪪', bg: 'bg-sky-100' },
                  { name: 'เอกสาร', icon: '📓', bg: 'bg-purple-100' },
                  { name: 'เครื่องแต่งกาย', icon: '👕', bg: 'bg-emerald-100' },
                  { name: 'อุปกรณ์การเรียน', icon: '✏️', bg: 'bg-rose-100' },
                  { name: 'อื่นๆ', icon: '💬', bg: 'bg-slate-200' },
                ].map((cat, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`w-12 h-12 ${cat.bg} rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-medium text-slate-600">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Feed List Header */}
              <div className="flex justify-between items-center pt-2">
                <h2 className="font-bold text-slate-800 text-sm">ของหายล่าสุด</h2>
                <button className="text-xs text-[#2563EB] font-semibold">ดูทั้งหมด</button>
              </div>

              {/* Items Feed Cards */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3.5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon || '📦'}
                    </div>
                    <div className="flex-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.type === 'lost' ? 'bg-[#FFEBEB] text-[#EF4444]' : 'bg-[#E6F9F0] text-[#10B981]'
                      }`}>
                        {item.type === 'lost' ? 'ของหาย' : 'ของที่เก็บได้'}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm mt-1">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">พบที่: {item.location}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MAP (แผนที่ มศว ประสานมิตร) */}
          {activeTab === 'map' && (
            <div className="p-4 space-y-3">
              <h2 className="font-bold text-slate-800 text-sm mb-1">แผนที่ มศว ประสานมิตร</h2>
              
              {/* Map Preview Box */}
              <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 overflow-hidden relative">
                <div className="h-64 rounded-2xl bg-slate-200 overflow-hidden relative flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=60" 
                    alt="SWU Map" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                    Leaflet | © OpenStreetMap
                  </div>
                  {/* Pin Markers */}
                  <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md animate-bounce"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                </div>

                <div className="flex gap-4 p-2 text-[11px] font-medium text-slate-600 justify-center">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>ของหาย</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>ของที่เก็บได้</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>สถานที่ในมหาวิทยาลัย</div>
                </div>
              </div>

              {/* Map Action Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm whitespace-nowrap">ทั้งหมด</button>
                <button className="bg-white text-slate-700 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 whitespace-nowrap">สำนักหอสมุดกลาง 1</button>
                <button className="bg-white text-slate-700 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 whitespace-nowrap">อาคารเรียนรวม 1</button>
              </div>

              <button className="w-full bg-[#2563EB] text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md">
                🧭 เปิดใน Google Maps / นำทาง
              </button>
              <p className="text-[10px] text-center text-slate-400">ถ้าแผนที่ด้านบนไม่ขึ้น ให้กดปุ่มนี้แทน</p>

              {/* Feed Items under map */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-800 text-xs">รายการล่าสุด</h3>
                {items.slice(0, 2).map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.type === 'lost' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.type === 'lost' ? 'ของหาย' : 'ของที่เก็บได้'}
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs mt-0.5">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">พบที่: {item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR (ปฏิทิน) */}
          {activeTab === 'calendar' && (
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-3">
                  <span>อา</span><span>จ</span><span>อ</span><span>พ</span><span>พฤ</span><span>ศ</span><span>ส</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`py-2 rounded-full font-medium ${
                        i + 1 === 5 ? 'bg-[#2563EB] text-white font-bold shadow-md' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                      {[2, 3, 4].includes(i + 1) && <div className="w-1 h-1 bg-amber-400 rounded-full mx-auto mt-0.5"></div>}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  มีรายการของหาย/ของที่เก็บได้
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-xs">รายการตามหาวันนี้</h3>
                <span className="text-xs text-[#2563EB] font-semibold">ดูทั้งหมด</span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3.5">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-xl text-rose-500">
                  ✏️
                </div>
                <div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-500">ของหาย</span>
                  <h4 className="font-bold text-slate-800 text-xs mt-0.5">กล่องดินสอสีเขียว</h4>
                  <p className="text-[10px] text-slate-400">พบที่: อาคารเรียนรวม (Learning Tower)</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE (โปรไฟล์นิสิต) */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-3">
              <div className="bg-white rounded-3xl p-5 text-center shadow-sm border border-slate-100 relative">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-3xl mb-2 relative">
                  🎓
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#2563EB] rounded-full text-white flex items-center justify-center text-xs">📷</div>
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">{user.name}</h3>
                <p className="text-xs text-slate-400">นักศึกษา มศว · {user.email}</p>
              </div>

              {/* Stats Box */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-3 text-center">
                <div>
                  <p className="text-xl font-black text-[#2563EB]">2</p>
                  <p className="text-[10px] text-slate-500">ประกาศของหาย</p>
                </div>
                <div className="border-x border-slate-100">
                  <p className="text-xl font-black text-[#2563EB]">2</p>
                  <p className="text-[10px] text-slate-500">ของที่เก็บได้</p>
                </div>
                <div>
                  <p className="text-xl font-black text-[#2563EB]">0</p>
                  <p className="text-[10px] text-slate-500">ได้คืนแล้ว</p>
                </div>
              </div>

              {/* Option List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 text-xs text-slate-700">
                <div className="p-3.5 flex justify-between items-center">
                  <span className="flex items-center gap-2">📄 ประวัติประกาศ</span>
                  <span>›</span>
                </div>
                <div className="p-3.5 flex justify-between items-center">
                  <span className="flex items-center gap-2">💙 รายการที่บันทึกไว้ (0)</span>
                  <span>›</span>
                </div>
                <div className="p-3.5 flex justify-between items-center">
                  <span className="flex items-center gap-2">⚙️ ตั้งค่า</span>
                  <span>›</span>
                </div>
                <div className="p-3.5 flex justify-between items-center">
                  <span className="flex items-center gap-2">✅ ยืนยันตัวตน</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px]">ยังไม่ยืนยัน</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCAN (สแกนรูป) */}
          {activeTab === 'scan' && (
            <div className="bg-[#0A1120] min-h-[750px] p-5 text-white flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('home')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">‹</button>
                <h2 className="font-bold text-sm">สแกนรูปเพื่อค้นหา</h2>
              </div>

              <div className="border-2 border-blue-400/40 rounded-3xl h-80 flex flex-col items-center justify-center bg-slate-900/50 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl mb-2">📷</div>
                <p className="text-xs text-slate-400">ถ่ายหรือเลือกรูปสิ่งของ เพื่อดูรายการที่คล้ายกัน</p>
              </div>

              <div className="flex justify-around items-center pb-8">
                <div className="flex flex-col items-center text-[10px] text-slate-400 gap-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg">🖼️</div>
                  <span>แกลเลอรี</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#2563EB] border-4 border-slate-800 flex items-center justify-center shadow-lg"></div>
                <div className="flex flex-col items-center text-[10px] text-slate-400 gap-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg">⚡</div>
                  <span>แฟลช</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS (แจ้งเตือน) */}
          {activeTab === 'notifications' && (
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveTab('home')} className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs">‹</button>
                  <h2 className="font-bold text-slate-800 text-sm">แจ้งเตือน</h2>
                </div>
                <button className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="bg-[#2563EB] text-white px-3 py-1.5 rounded-xl text-xs font-bold">ทั้งหมด</button>
                <button className="bg-white text-slate-600 px-3 py-1.5 rounded-xl text-xs">ของหาย</button>
                <button className="bg-white text-slate-600 px-3 py-1.5 rounded-xl text-xs">ของที่เก็บได้</button>
                <button className="bg-white text-slate-600 px-3 py-1.5 rounded-xl text-xs">ระบบ</button>
              </div>

              <div className="space-y-2.5">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">📍</div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">มีผู้ประกาศของหาย: กล่องดินสอสีเขียว</h4>
                    <p className="text-[10px] text-slate-400">อาคารเรียนรวม (Learning Tower) · 5 พ.ย. 2569</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">🔍</div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">มีผู้เก็บของได้: โทรศัพท์มือถือ</h4>
                    <p className="text-[10px] text-slate-400">โรงอาหาร · 3 พ.ย. 2569</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: POST FORM Modal */}
          {activeTab === 'post' && (
            <div className="p-4">
              <form onSubmit={handlePostSubmit} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-3">
                <h2 className="text-sm font-bold text-slate-800">ลงประกาศใหม่</h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ประเภท</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setType('lost')} className={`py-2 rounded-xl text-xs font-bold ${type === 'lost' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>ของหาย</button>
                    <button type="button" onClick={() => setType('found')} className={`py-2 rounded-xl text-xs font-bold ${type === 'found' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>ของที่เก็บได้</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อสิ่งของ *</label>
                  <input type="text" required placeholder="เช่น กล่องดินสอ, กระเป๋าสตางค์" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">สถานที่พบ / หาย *</label>
                  <input type="text" required placeholder="เช่น สำนักหอสมุดกลาง, อาคารเรียนรวม" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs" />
                </div>
                <button type="submit" className="w-full bg-[#2563EB] text-white py-3 rounded-xl text-xs font-bold shadow-md">เผยแพร่ประกาศ</button>
              </form>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION BAR (ตรงตามรูปภาพต้นแบบ) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 flex justify-between items-center z-20 shadow-lg">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] ${activeTab === 'home' ? 'text-[#2563EB] font-bold' : 'text-slate-400'}`}
          >
            <span className="text-lg">🏠</span>
            <span>หน้าหลัก</span>
          </button>

          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-0.5 text-[10px] ${activeTab === 'map' ? 'text-[#2563EB] font-bold' : 'text-slate-400'}`}
          >
            <span className="text-lg">📍</span>
            <span>แผนที่</span>
          </button>

          {/* Big Plus Floating Button */}
          <button 
            onClick={() => setActiveTab('post')}
            className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl shadow-lg -mt-5 border-4 border-[#F4F8FE]"
          >
            +
          </button>

          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-0.5 text-[10px] ${activeTab === 'calendar' ? 'text-[#2563EB] font-bold' : 'text-slate-400'}`}
          >
            <span className="text-lg">📅</span>
            <span>ปฏิทิน</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 text-[10px] ${activeTab === 'profile' ? 'text-[#2563EB] font-bold' : 'text-slate-400'}`}
          >
            <span className="text-lg">👤</span>
            <span>โปรไฟล์</span>
          </button>
        </div>

      </div>
    </div>
  );
}

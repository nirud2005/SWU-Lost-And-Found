import React, { useState, useEffect } from 'react';
import { 
  Search, Scan, MapPin, Calendar, Bell, User, MessageCircle, 
  PlusCircle, ShieldCheck, ChevronRight, ArrowLeft, Send, 
  Camera, CheckCircle2, AlertTriangle, Phone, Mail, Lock, 
  Eye, EyeOff, FileText, Smartphone, Key, UserCheck, 
  HelpCircle, LogOut, Settings, Filter, Bookmark, Check, X,
  Clock, Navigation, Sparkles, AlertCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
// ดึงค่าจาก Environment Variables ของ Vercel หรือใช้ค่าสำรองหากรันเทส
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  // --- STATES ---
  const [currentScreen, setCurrentScreen] = useState('screen1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State สำหรับสร้างโพสต์ (Screen 3)
  const [postType, setPostType] = useState('lost'); // 'lost' หรือ 'found'
  const [cat, setCat] = useState(1);
  const [title, setTitle] = useState('');
  const [descr, setDescr] = useState('');
  const [place, setPlace] = useState('หอสมุดกลาง มศว');
  const [lat, setLat] = useState(13.7445);
  const [lng, setLng] = useState(100.5635);
  const [contact, setContact] = useState('');
  const [byName, setByName] = useState('นิสิต มศว');
  const [imgUrl, setImgUrl] = useState('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80');
  const [hidePhone, setHidePhone] = useState(true);

  // สำหรับรายละเอียดประกาศ (Screen 4)
  const [selectedItem, setSelectedItem] = useState(null);

  // โหลดข้อมูลจาก Supabase ตาราง items เมื่อเปิดแอป
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        // Fallback ข้อมูลตัวอย่างหากยังไม่ได้เชื่อมต่อ Supabase สำเร็จ
        setItems([
          { id: 1, type: 'lost', cat: 1, title: 'กระเป๋าหนังสีดำ Notebook หาย', descr: 'ลืมไว้ที่โต๊ะอ่านหนังสือชั้น 3 หอสมุดกลาง มีเอกสารสำคัญ', place: 'หอสมุดกลาง', lat: 13.7445, lng: 100.5635, d: Date.now(), contact: '089-123-4567', by_name: 'นิรชา (กศ.บ. คณิตศาสตร์)', st: 'open', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
          { id: 2, type: 'found', cat: 2, title: 'iPhone 13 สีชมพู เคสใส', descr: 'มีคนเก็บได้บริเวณลานไข่ดาว นำมาฝากไว้ที่ประชาสัมพันธ์', place: 'ลานไข่ดาว', lat: 13.7440, lng: 100.5640, d: Date.now(), contact: '098-765-4321', by_name: 'พี่หมิว (สนง.กิจการนิสิต)', st: 'open', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80' }
        ]);
      } else if (data && data.length > 0) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสร้างโพสต์ใหม่ลง Supabase
  const handleCreatePost = async (e) => {
    e.preventDefault();
    const newItem = {
      type: postType,
      cat: parseInt(cat),
      title,
      descr,
      place,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      d: Date.now(),
      contact: hidePhone ? 'ซ่อนเบอร์ (ติดต่อผ่านแชทในระบบ)' : contact,
      by_name: byName,
      st: 'open',
      img: imgUrl
    };

    try {
      const { data, error } = await supabase.from('items').insert([newItem]).select();
      if (error) {
        alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
      } else {
        alert('ประกาศสำเร็จและเผยแพร่ให้ทุกคนเห็นเรียบร้อยแล้ว!');
        fetchItems();
        setCurrentScreen('screen2'); // กลับหน้าหลัก
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans text-slate-800">
      
      {/* 🧭 NAVIGATION BAR จำลองการสลับหน้าจอสำหรับทดสอบ */}
      <div className="w-full max-w-md bg-white border-b px-2 py-2 flex items-center justify-between text-xs overflow-x-auto shadow-sm">
        <span className="font-bold text-[#C8102E] px-1 shrink-0">SWU Lost&Found:</span>
        <div className="flex gap-1">
          {[
            { id: 'screen1', label: '1.Login' },
            { id: 'screen2', label: '2.Home' },
            { id: 'screen3', label: '3.Post' },
            { id: 'screen4', label: '4.Detail' },
            { id: 'screen5', label: '5.Chat' },
            { id: 'screen6', label: '6.Map' },
            { id: 'screen7', label: '7.Cal' },
            { id: 'screen9', label: '9.Scan' },
            { id: 'screen10', label: '10.Profile' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentScreen(s.id)}
              className={`px-2 py-1 rounded transition-colors ${currentScreen === s.id ? 'bg-[#C8102E] text-white font-semibold' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📱 MOBILE APP CONTAINER */}
      <div className="w-full max-w-md bg-white min-h-[850px] shadow-2xl flex flex-col relative overflow-hidden pb-16">
        
        {/* ================= SCREEN 1: LOGIN ================= */}
        {currentScreen === 'screen1' && (
          <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#C8102E]/10 to-white">
            <div className="pt-12 text-center">
              <div className="w-20 h-20 bg-[#C8102E] text-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
                SWU
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Smart Lost & Found</h1>
              <p className="text-sm text-slate-600 mt-1">ระบบติดตามของหาย มศว ประสานมิตร</p>
            </div>

            <div className="space-y-4 my-auto">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700">เข้าสู่ระบบด้วยอีเมลนิสิต (@g.swu.ac.th)</label>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-slate-50">
                  <Mail size={18} className="text-slate-400 mr-2" />
                  <input 
                    type="email" 
                    placeholder="s6512345678@g.swu.ac.th"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                <button 
                  onClick={() => { setIsLoggedIn(true); setCurrentScreen('screen2'); }}
                  className="w-full bg-[#C8102E] hover:bg-[#A60C25] text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-md"
                >
                  เข้าสู่ระบบผ่าน SWU Portal
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400">หรือเข้าสู่ระบบด้วย</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                onClick={() => { setIsLoggedIn(true); setCurrentScreen('screen2'); }}
                className="w-full border border-slate-300 hover:bg-slate-50 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Google Account (@g.swu.ac.th)</span>
              </button>
            </div>

            <div className="text-center text-xs text-slate-400">
              <ShieldCheck size={14} className="inline mr-1 text-emerald-600" />
              ระบบป้องกันข้อมูลส่วนบุคคลตามมาตรฐาน PDPA มศว
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: HOME ================= */}
        {currentScreen === 'screen2' && (
          <div className="flex-1 flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-[#C8102E] text-white px-4 pt-6 pb-4 rounded-b-2xl shadow-md">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-xs opacity-80">มหาวิทยาลัยศรีนครินทรวิโรฒ</span>
                  <h2 className="font-bold text-lg">ยินดีต้อนรับ, นิสิต มศว</h2>
                </div>
                <button onClick={() => setCurrentScreen('screen10')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  <User size={20} />
                </button>
              </div>

              {/* Search Bar & Quick Scan */}
              <div className="flex gap-2">
                <div className="flex-1 bg-white rounded-xl flex items-center px-3 py-2 shadow-inner">
                  <Search size={18} className="text-slate-400 mr-2" />
                  <input type="text" placeholder="ค้นหาสิ่งของ, สถานที่ (เช่น หอสมุด, กุญแจ)..." className="w-full text-sm outline-none bg-transparent" />
                </div>
                <button onClick={() => setCurrentScreen('screen9')} className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl text-white flex items-center justify-center">
                  <Scan size={20} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Urgent Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                  <div>
                    <h4 className="text-xs font-bold text-amber-800">ประกาศตามหาเร่งด่วน</h4>
                    <p className="text-xs text-amber-700">กระเป๋าเงินนิสิต หายบริเวณโรงอาหารกลาง</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded font-semibold">ด่วน</span>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">หมวดหมู่สิ่งของ</h3>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {['กระเป๋า', 'มือถือ', 'กุญแจ', 'บัตรนิสิต', 'เอกสาร', 'เสื้อผ้า', 'อุปกรณ์เรียน', 'อื่นๆ'].map((catName, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1 hover:border-[#C8102E] cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center font-bold text-sm">
                        {catName[0]}
                      </div>
                      <span className="text-[11px] text-slate-600">{catName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Items (Real-time from Supabase) */}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800">รายการประกาศล่าสุด (มศว ประสานมิตร)</h3>
                <span className="text-xs text-[#C8102E] font-medium cursor-pointer" onClick={fetchItems}>รีเฟรช</span>
              </div>

              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400">กำลังโหลดข้อมูลจากฐานข้อมูล...</div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => { setSelectedItem(item); setCurrentScreen('screen4'); }}
                      className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex gap-3 cursor-pointer hover:shadow-md transition-all"
                    >
                      <img src={item.img || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=300&q=80'} alt="item" className="w-20 h-20 rounded-lg object-cover bg-slate-200" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${item.type === 'lost' ? 'bg-red-100 text-[#C8102E]' : 'bg-emerald-100 text-emerald-700'}`}>
                              {item.type === 'lost' ? 'ของหาย' : 'ของที่เก็บได้'}
                            </span>
                            <span className="text-[10px] text-slate-400">พึ่งโพสต์</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mt-1 line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-slate-400" /> {item.place}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400 border-t pt-1 mt-1">
                          <span>โดย: {item.by_name}</span>
                          <span className="text-[#C8102E] font-medium">ดูรายละเอียด →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: CREATE POST (เชื่อมหมุดแผนที่) ================= */}
        {currentScreen === 'screen3' && (
          <div className="flex-1 flex flex-col bg-slate-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentScreen('screen2')} className="text-slate-600"><ArrowLeft size={20} /></button>
              <h2 className="font-bold text-base text-slate-800">สร้างประกาศใหม่</h2>
              <div className="w-5"></div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex bg-slate-200 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setPostType('lost')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${postType === 'lost' ? 'bg-[#C8102E] text-white shadow' : 'text-slate-600'}`}
                >
                  แจ้งของหาย (Lost)
                </button>
                <button 
                  type="button"
                  onClick={() => setPostType('found')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${postType === 'found' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'}`}
                >
                  แจ้งของที่เก็บได้ (Found)
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">หัวข้อสิ่งของ</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น กระเป๋าคาดอก Nike สีดำ" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">หมวดหมู่</label>
                  <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                    <option value={1}>กระเป๋า / เป้</option>
                    <option value={2}>มือถือ / แท็บเล็ต</option>
                    <option value={3}>กุญแจ</option>
                    <option value={4}>บัตรนิสิต</option>
                    <option value={5}>เอกสาร / หนังสือ</option>
                    <option value={6}>อื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">ชื่อผู้ประกาศ</label>
                  <input 
                    type="text" 
                    value={byName} 
                    onChange={(e) => setByName(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">รายละเอียดเพิ่มเติม</label>
                <textarea 
                  rows={3} 
                  required
                  placeholder="ระบุลักษณะเด่น รอยตำหนิ หรือเวลาที่พบ/หาย..." 
                  value={descr}
                  onChange={(e) => setDescr(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-[#C8102E]"
                />
              </div>

              {/* Interactive Map Picker Simulation */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex justify-between">
                  <span>เลือกสถานที่ใน มศว ประสานมิตร (คลิกปักหมุด)</span>
                  <span className="text-[#C8102E] font-bold text-[10px]">Lat: {lat}, Lng: {lng}</span>
                </label>
                <div 
                  onClick={() => {
                    // จำลองการกดเลือกจุดใน มศว
                    const spots = [
                      { name: 'หอสมุดกลาง มศว', lat: 13.7445, lng: 100.5635 },
                      { name: 'อาคารเรียนรวม 2', lat: 13.7452, lng: 100.5642 },
                      { name: 'ลานไข่ดาว', lat: 13.7440, lng: 100.5640 },
                      { name: 'โรงอาหารกลาง (โรงช้าง)', lat: 13.7435, lng: 100.5628 },
                      { name: 'อาคาร 400 ล้าน', lat: 13.7460, lng: 100.5650 }
                    ];
                    const randomSpot = spots[Math.floor(Math.random() * spots.length)];
                    setPlace(randomSpot.name);
                    setLat(randomSpot.lat);
                    setLng(randomSpot.lng);
                  }}
                  className="w-full h-32 bg-slate-200 rounded-lg relative overflow-hidden cursor-pointer flex items-center justify-center border border-dashed border-slate-400 group"
                >
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                    <span className="bg-white/90 text-slate-800 text-xs px-3 py-1.5 rounded-full font-bold shadow flex items-center gap-1">
                      <MapPin size={14} className="text-[#C8102E]" /> คลิกเปลี่ยนตำแหน่ง: {place}
                    </span>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={place} 
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="สถานที่ระบุ" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">ลิงก์รูปภาพสิ่งของ</label>
                <input 
                  type="text" 
                  value={imgUrl} 
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              {/* PDPA Protection Toggle */}
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">ซ่อนเบอร์โทรศัพท์ส่วนบุคคล (PDPA)</h4>
                  <p className="text-[11px] text-slate-500">ให้ติดต่อผ่านระบบแชทในแอปเท่านั้น</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={hidePhone} 
                  onChange={() => setHidePhone(!hidePhone)} 
                  className="w-4 h-4 accent-[#C8102E]" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#C8102E] hover:bg-[#A60C25] text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-all"
              >
                ยืนยันการสร้างประกาศ
              </button>
            </form>
          </div>
        )}

        {/* ================= SCREEN 4: ITEM DETAIL ================= */}
        {currentScreen === 'screen4' && (
          <div className="flex-1 flex flex-col bg-slate-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentScreen('screen2')} className="text-slate-600"><ArrowLeft size={20} /></button>
              <h2 className="font-bold text-base text-slate-800">รายละเอียดประกาศ</h2>
              <Bookmark size={20} className="text-slate-600" />
            </div>

            {selectedItem ? (
              <div className="space-y-4">
                <img src={selectedItem.img} alt="item" className="w-full h-64 rounded-2xl object-cover shadow-sm bg-slate-200" />
                
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${selectedItem.type === 'lost' ? 'bg-red-100 text-[#C8102E]' : 'bg-emerald-100 text-emerald-700'}`}>
                      {selectedItem.type === 'lost' ? 'ประกาศของหาย' : 'ประกาศของที่เก็บได้'}
                    </span>
                    <span className="text-xs text-slate-400">สถานะ: เปิดตามหา</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.title}</h3>
                  <p className="text-sm text-slate-600">{selectedItem.descr}</p>

                  <div className="border-t pt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#C8102E]" />
                      <span>สถานที่: {selectedItem.place}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>วันที่ประกาศ: วันนี้</span>
                    </div>
                  </div>
                </div>

                {/* Owner info */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                      {selectedItem.by_name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{selectedItem.by_name}</h4>
                      <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <ShieldCheck size={12} /> ยืนยันตัวตนนิสิต มศว แล้ว
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentScreen('screen5')} 
                    className="bg-[#C8102E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1"
                  >
                    <MessageCircle size={14} /> แชทติดต่อ
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">ไม่พบข้อมูลประกาศ กรุณากลับไปเลือกจากหน้าหลัก</div>
            )}
          </div>
        )}

        {/* ================= SCREEN 5: CHAT 2 MODES ================= */}
        {currentScreen === 'screen5' && (
          <div className="flex-1 flex flex-col bg-slate-50">
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
              <button onClick={() => setCurrentScreen('screen2')}><ArrowLeft size={20} /></button>
              <div className="text-center">
                <h3 className="text-sm font-bold text-slate-800">แชทกับ AI "น้องนำทาง"</h3>
                <span className="text-[10px] text-emerald-600 font-medium">● ออนไลน์ตลอด 24 ชม.</span>
              </div>
              <div className="w-5"></div>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-700 max-w-[80%] border border-slate-100">
                  สวัสดีค่ะน้องๆ นิสิต มศว! "น้องนำทาง" พร้อมช่วยตอบคำถามจุดรับฝากของหายและระเบียบการรับของคืนใน มศว ประสานมิตรค่ะ สอบถามได้เลยนะคะ ✨
                </div>
              </div>

              <div className="flex gap-2 flex-row-reverse">
                <div className="bg-[#C8102E] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-xs max-w-[80%]">
                  ถ้าเก็บกระเป๋าได้ สามารถนำไปฝากไว้ที่ไหนได้บ้างคะ?
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-700 max-w-[80%] border border-slate-100">
                  หากเก็บสิ่งของได้ สามารถนำมาส่งฝากได้ที่ <b>งานกิจการนิสิต (ชั้น 1 อาคารบริการนิสิต)</b> หรือเคาน์เตอร์ประชาสัมพันธ์ หอสมุดกลาง ได้ตลอดเวลาทำการเลยค่ะ!
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t flex gap-2">
              <input type="text" placeholder="พิมพ์ข้อความสอบถาม..." className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs outline-none" />
              <button className="bg-[#C8102E] text-white p-2 rounded-xl"><Send size={18} /></button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 6: CAMPUS MAP ================= */}
        {currentScreen === 'screen6' && (
          <div className="flex-1 flex flex-col bg-slate-50 relative">
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between z-10">
              <button onClick={() => setCurrentScreen('screen2')}><ArrowLeft size={20} /></button>
              <h3 className="text-sm font-bold text-slate-800">แผนที่ มศว ประสานมิตร</h3>
              <MapPin size={20} className="text-[#C8102E]" />
            </div>

            {/* Simulated Interactive Map */}
            <div className="flex-1 bg-slate-200 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
              
              {/* Map Pins */}
              <div onClick={() => setCurrentScreen('screen4')} className="absolute top-1/3 left-1/4 bg-[#C8102E] text-white p-2 rounded-full shadow-lg cursor-pointer animate-bounce">
                <MapPin size={18} />
              </div>
              <div className="absolute top-1/2 right-1/3 bg-emerald-600 text-white p-2 rounded-full shadow-lg cursor-pointer">
                <MapPin size={18} />
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 text-[#C8102E] rounded-xl flex items-center justify-center font-bold">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800">หอสมุดกลาง มศว</h4>
                  <p className="text-[10px] text-slate-500">พบของหาย 2 รายการในจุดนี้</p>
                </div>
                <button onClick={() => setCurrentScreen('screen4')} className="bg-[#C8102E] text-white text-xs px-3 py-1.5 rounded-lg font-bold">ดู</button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 7 & 8: CALENDAR ================= */}
        {currentScreen === 'screen7' && (
          <div className="flex-1 flex flex-col bg-slate-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentScreen('screen2')}><ArrowLeft size={20} /></button>
              <h3 className="text-sm font-bold text-slate-800">ปฏิทินตามหาของ (ตุลาคม 2568)</h3>
              <Calendar size={20} className="text-[#C8102E]" />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                <span>อา</span><span>จ</span><span>อ</span><span>พ</span><span>พฤ</span><span>ศ</span><span>ส</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const hasEvent = [5, 12, 19, 24].includes(day);
                  return (
                    <div 
                      key={day} 
                      onClick={() => day === 12 && setCurrentScreen('screen8')}
                      className={`h-9 flex flex-col items-center justify-center rounded-xl font-medium cursor-pointer relative ${day === 12 ? 'bg-[#C8102E] text-white font-bold shadow' : 'hover:bg-slate-100'}`}
                    >
                      <span>{day}</span>
                      {hasEvent && day !== 12 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute bottom-1"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">รายการประจำวันที่ 12 ตุลาคม 2568</h4>
              <div onClick={() => setCurrentScreen('screen8')} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">นัดรับมอบกระเป๋าคืนเจ้าของ</h5>
                  <p className="text-[10px] text-slate-500">จุดรับฝากของ อาคาร 2 ชั้น 1</p>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'screen8' && (
          <div className="flex-1 flex flex-col bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentScreen('screen7')}><ArrowLeft size={20} /></button>
              <h3 className="text-sm font-bold text-slate-800">รายละเอียดกำหนดการนัดรับ</h3>
              <div className="w-5"></div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <div className="bg-red-50 text-[#C8102E] text-xs font-bold px-3 py-1.5 rounded-lg inline-block">
                กำหนดการ: 12 ต.ค. 2568 (13:00 - 15:00 น.)
              </div>
              <h4 className="text-base font-bold text-slate-900">นัดส่งมอบสิ่งของคืนเจ้าของตัวจริง</h4>
              <p className="text-xs text-slate-600">กรุณานำบัตรนิสิต มศว ตัวจริงมาแสดงเพื่อยืนยันตัวตนก่อนรับของคืน ณ จุดบริการอาคารเรียนรวม 2</p>
            </div>
          </div>
        )}

        {/* ================= SCREEN 9: SMART VISUAL SCAN ================= */}
        {currentScreen === 'screen9' && (
          <div className="flex-1 flex flex-col bg-black text-white relative">
            <div className="absolute top-4 left-4 z-10">
              <button onClick={() => setCurrentScreen('screen2')} className="bg-white/20 p-2 rounded-full"><ArrowLeft size={20} /></button>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-64 h-64 border-2 border-dashed border-[#C8102E] rounded-3xl flex items-center justify-center relative">
                <span className="text-xs bg-black/60 px-3 py-1 rounded-full text-slate-300">กรอบสแกนสิ่งของ AI</span>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-t-3xl text-center space-y-3">
              <h3 className="text-sm font-bold">สแกนสิ่งของด้วยรูปภาพ</h3>
              <p className="text-xs text-slate-400">ระบบจะวิเคราะห์สี ยี่ห้อ และค้นหาประกาศที่ตรงกันทันที</p>
              <button onClick={() => { alert('สแกนสำเร็จ! พบสิ่งของใกล้เคียงในระบบ 2 รายการ'); setCurrentScreen('screen2'); }} className="w-full bg-[#C8102E] text-white py-3 rounded-xl font-bold text-sm shadow">
                ถ่ายภาพ / ค้นหาทันที
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 10 & 13: PROFILE & SETTINGS ================= */}
        {currentScreen === 'screen10' && (
          <div className="flex-1 flex flex-col bg-slate-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentScreen('screen2')}><ArrowLeft size={20} /></button>
              <h3 className="text-sm font-bold text-slate-800">โปรไฟล์นิสิต มศว</h3>
              <Settings size={20} className="text-slate-600 cursor-pointer" onClick={() => setCurrentScreen('screen13')} />
            </div>

            <div className="bg-[#C8102E] text-white p-6 rounded-2xl text-center shadow-md mb-4">
              <div className="w-20 h-20 bg-white text-[#C8102E] rounded-full mx-auto flex items-center justify-center text-2xl font-bold shadow mb-2">
                นิ
              </div>
              <h3 className="font-bold text-base">นิรชา (นิสิต มศว)</h3>
              <p className="text-xs opacity-80">s6512345678@g.swu.ac.th</p>
              <div className="mt-3 inline-flex items-center gap-1 bg-white/20 text-xs px-3 py-1 rounded-full font-medium">
                <ShieldCheck size={14} /> ยืนยันตัวตนด้วยบัตรนิสิตแล้ว
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <span className="text-lg font-bold text-[#C8102E]">2</span>
                <p className="text-[10px] text-slate-500">ของหาย</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <span className="text-lg font-bold text-emerald-600">1</span>
                <p className="text-[10px] text-slate-500">เก็บได้</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <span className="text-lg font-bold text-blue-600">3</span>
                <p className="text-[10px] text-slate-500">ได้รับคืน</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-xs">
              {[
                { label: 'ประวัติการประกาศของฉัน', icon: FileText },
                { label: 'รายการที่บันทึกไว้', icon: Bookmark },
                { label: 'ตั้งค่าความปลอดภัย & PDPA', icon: ShieldCheck },
                { label: 'ศูนย์ช่วยเหลือ & ติดต่อแอดมิน', icon: HelpCircle },
                { label: 'ออกจากระบบ', icon: LogOut, danger: true }
              ].map((menu, idx) => (
                <div 
                  key={idx} 
                  onClick={() => menu.danger && setCurrentScreen('screen1')}
                  className={`flex items-center justify-between p-3.5 border-b last:border-none hover:bg-slate-50 cursor-pointer ${menu.danger ? 'text-[#C8102E] font-bold' : 'text-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <menu.icon size={16} />
                    <span>{menu.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentScreen === 'screen13' && (
          <div className="flex-1 flex flex-col bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentScreen('screen10')}><ArrowLeft size={20} /></button>
              <h3 className="text-sm font-bold text-slate-800">ตั้งค่าระบบ</h3>
              <div className="w-5"></div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">จัดการข้อมูลส่วนตัว</label>
                <p className="text-[10px] text-slate-400">ควบคุมการแสดงเบอร์โทรศัพท์ตามกฎหมาย PDPA</p>
              </div>
              <button onClick={() => setCurrentScreen('screen1')} className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold">ออกจากระบบอย่างปลอดภัย</button>
            </div>
          </div>
        )}

        {/* 📱 BOTTOM TAB NAVIGATION */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 flex justify-between items-center z-20">
          <button onClick={() => setCurrentScreen('screen2')} className={`flex flex-col items-center gap-0.5 ${currentScreen === 'screen2' ? 'text-[#C8102E]' : 'text-slate-400'}`}>
            <Search size={20} />
            <span className="text-[10px] font-medium">หน้าหลัก</span>
          </button>
          <button onClick={() => setCurrentScreen('screen6')} className={`flex flex-col items-center gap-0.5 ${currentScreen === 'screen6' ? 'text-[#C8102E]' : 'text-slate-400'}`}>
            <MapPin size={20} />
            <span className="text-[10px] font-medium">แผนที่</span>
          </button>
          <button onClick={() => setCurrentScreen('screen3')} className="w-12 h-12 bg-[#C8102E] text-white rounded-full flex items-center justify-center shadow-lg -mt-5 hover:bg-[#A60C25]">
            <PlusCircle size={24} />
          </button>
          <button onClick={() => setCurrentScreen('screen7')} className={`flex flex-col items-center gap-0.5 ${currentScreen === 'screen7' ? 'text-[#C8102E]' : 'text-slate-400'}`}>
            <Calendar size={20} />
            <span className="text-[10px] font-medium">ปฏิทิน</span>
          </button>
          <button onClick={() => setCurrentScreen('screen10')} className={`flex flex-col items-center gap-0.5 ${currentScreen === 'screen10' ? 'text-[#C8102E]' : 'text-slate-400'}`}>
            <User size={20} />
            <span className="text-[10px] font-medium">โปรไฟล์</span>
          </button>
        </div>

      </div>
    </div>
  );
}

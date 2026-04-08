import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, MessageSquare, Calendar, Bell, Search, Clock, Send, Bot, Globe, CheckCircle, Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 실제 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 상담 내역 가져오기
      const { data: consultData } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 방문 로그 가져오기
      const { data: viewData } = await supabase
        .from('page_views')
        .select('*')
        .order('viewed_at', { ascending: false });

      if (consultData) setConsultations(consultData);
      if (viewData) setPageViews(viewData);
      setLoading(false);
    };

    fetchData();

    // 실시간 구독 (New 상담 들어오면 즉시 반영)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'answered' : 'pending';
    const { error } = await supabase
      .from('consultations')
      .update({ status: nextStatus })
      .eq('id', id);
    
    if (error) alert('업데이트 실패');
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('상담 내역을 삭제하시겠습니까?')) {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);
      
      if (error) alert('삭제 실패');
    }
  };

  // 통계 데이터 가공
  const getSourceStats = () => {
    const counts = { naver: 0, google: 0, bot: 0, direct: 0 };
    pageViews.forEach(v => {
      const ref = v.referrer.toLowerCase();
      const ua = v.user_agent.toLowerCase();
      if (ref.includes('naver')) counts.naver++;
      else if (ref.includes('google')) counts.google++;
      else if (ua.includes('bot') || ua.includes('crawl') || ua.includes('chatgpt')) counts.bot++;
      else counts.direct++;
    });

    return [
      { name: '네이버 검색', value: counts.naver, color: '#03C75A' },
      { name: '구글 검색', value: counts.google, color: '#4285F4' },
      { name: 'AI 봇 유입', value: counts.bot, color: '#FF6B6B' },
      { name: '기타/직접', value: counts.direct, color: '#A0A0A0' },
    ].filter(d => d.value > 0);
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>데이터를 불러오는 중...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f6', fontFamily: 'Pretendard' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: '#1a4d2e', color: 'white', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '60px', textAlign: 'center' }}>Admin Panel</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'dashboard', icon: <Users size={20} />, label: '대시보드' },
            { id: 'consultations', icon: <MessageSquare size={20} />, label: '상담 관리' },
            { id: 'analytics', icon: <Globe size={20} />, label: '유입경로 분석' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer',
                textAlign: 'left', fontSize: '16px', fontWeight: '600', transition: '0.3s'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>
            {activeTab === 'dashboard' ? '실시간 현황' : activeTab === 'consultations' ? '상담 요청 내역' : '유입경로 분석'}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={24} color="#666" />
              {consultations.filter(c => c.status === 'pending').length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e53e3e', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>
                  {consultations.filter(c => c.status === 'pending').length}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1a4d2e' }}></div>
              <span style={{ fontWeight: '700' }}>이언호 원장님</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                { label: '전체 방문자', value: pageViews.length, change: 'Total', icon: <Users color="#1a4d2e" /> },
                { label: '미답변 상담', value: consultations.filter(c => c.status === 'pending').length, change: 'Action Required', icon: <MessageSquare color="#d4af37" /> },
                { label: 'AI 유입 수', value: pageViews.filter(v => v.user_agent.toLowerCase().includes('bot')).length, change: 'Bots', icon: <Bot color="#FF6B6B" /> },
                { label: '검색 유입 수', value: pageViews.filter(v => v.referrer.includes('naver') || v.referrer.includes('google')).length, change: 'Search', icon: <Globe color="#4285F4" /> },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ color: '#888', fontSize: '14px', fontWeight: '600' }}>{stat.label}</span>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '5px' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#48bb78', fontWeight: '700' }}>{stat.change}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '25px', fontWeight: '800' }}>최근 상담 신청</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', color: '#888', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>성함</th>
                    <th style={{ padding: '12px' }}>카테고리</th>
                    <th style={{ padding: '12px' }}>시간</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.slice(0, 5).map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>{c.name}</td>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', background: '#f0f4f1', padding: '2px 8px', borderRadius: '4px' }}>{c.category}</span></td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#999' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '25px', fontWeight: '800' }}>방문 유입 경로별 비중 (실시간 DB 분석)</h3>
              <div style={{ height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={getSourceStats()} cx="50%" cy="50%" innerRadius={100} outerRadius={150} paddingAngle={5} dataKey="value" label>
                      {getSourceStats().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7f6', color: '#888', fontSize: '14px' }}>
                  <th style={{ padding: '15px' }}>환자정보</th>
                  <th style={{ padding: '15px' }}>상담항목</th>
                  <th style={{ padding: '15px' }}>상담내용</th>
                  <th style={{ padding: '15px' }}>요청시간</th>
                  <th style={{ padding: '15px' }}>상태</th>
                  <th style={{ padding: '15px' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>아직 신청된 상담이 없습니다.</td></tr>
                ) : (
                  consultations.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f4f7f6' }}>
                      <td style={{ padding: '20px' }}>
                        <div style={{ fontWeight: '700' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{c.phone}</div>
                      </td>
                      <td style={{ padding: '20px' }}><span style={{ background: '#ebf2ed', color: '#1a4d2e', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{c.category}</span></td>
                      <td style={{ padding: '20px', maxWidth: '300px' }}>{c.message}</td>
                      <td style={{ padding: '20px', fontSize: '14px', color: '#666' }}>{new Date(c.created_at).toLocaleString()}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{ 
                          padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                          background: c.status === 'pending' ? '#fffaf0' : '#f0fff4',
                          color: c.status === 'pending' ? '#d69e2e' : '#38a169'
                        }}>
                          {c.status === 'pending' ? '답변대기' : '답변완료'}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleStatusChange(c.id, c.status)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: 'white', cursor: 'pointer' }} title="상태 변경">
                            <CheckCircle size={16} color={c.status === 'pending' ? '#ccc' : '#38a169'} />
                          </button>
                          <button onClick={() => handleDelete(c.id)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee', background: 'white', cursor: 'pointer' }} title="삭제">
                            <Trash2 size={16} color="#e53e3e" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

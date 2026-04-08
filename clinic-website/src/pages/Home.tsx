import React, { useState, useEffect } from 'react';
import '../App.css';
import { Phone, Clock, MapPin, MessageCircle, CheckCircle2, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const IMAGES = {
  profile: '/images/프로필사진.JPG',
  hero: '/images/33970442548_6caa9d5a54_o.jpg',
  diet: '/images/다이어트.jpg',
  skin: '/images/피부.jpg',
  accident: '/images/자보.jpg',
  inpatient: '/images/KakaoTalk_20230131_100623206.jpg',
  pain: '/images/일반침.jpg',
  fallback: {
    hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    doctor: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
  }
};

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: 과목, 2: 내용, 3: 개인정보
  const [formData, setFormData] = useState({ name: '', phone: '', category: '', message: '' });

  useEffect(() => {
    const logVisit = async () => {
      try {
        await supabase.from('page_views').insert([{
          referrer: document.referrer || 'direct',
          user_agent: navigator.userAgent,
          path: window.location.pathname
        }]);
      } catch (e) {
        console.error('Logging failed', e);
      }
    };
    logVisit();
  }, []);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string) => {
    e.currentTarget.src = fallbackUrl;
  };

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('consultations').insert([{
      name: formData.name,
      phone: formData.phone,
      category: formData.category,
      message: formData.message,
      status: 'pending'
    }]);

    if (error) {
      alert(`오류가 발생했습니다: ${error.message}`);
      console.error(error);
    } else {
      alert('상담 신청이 완료되었습니다. 확인 후 연락드리겠습니다.');
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ name: '', phone: '', category: '', message: '' });
  };

  return (
    <div className="main-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">후한의원</div>
          <div className="nav-links">
            <a href="#about">병원소개</a>
            <a href="#treatment">진료안내</a>
            <a href="#inpatient">입원실</a>
            <a href="#contact">오시는길</a>
          </div>
          <button className="btn-cta" onClick={() => window.open('https://hoogumi.imweb.me/', '_blank')}>
            진료 예약하기
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="container fade-up">
          <h1 className="serif-font">진심을 담은 진료, 후한의원</h1>
          <p>
            서울대 출신 이언호 원장이 직접 진료합니다.<br />
            다이어트, 피부, 교통사고 후유증까지<br />
            환자 한 분께 집중하는 최상의 환경을 제공합니다.
          </p>
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
            <button className="btn-cta" style={{padding: '18px 48px', fontSize: '16px'}} onClick={() => setIsModalOpen(true)}>
              실시간 상담하기
            </button>
            <button style={{background: '#fee500', color: '#3c1e1e', border: 'none', padding: '18px 48px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}} 
                    onClick={() => window.open('https://pf.kakao.com/_xgpxaxbxj', '_blank')}>
              <MessageCircle size={20} />
              카톡 상담
            </button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Consultation Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'white', width: '90%', maxWidth: '450px', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={24} color="#999" />
            </button>

            {step > 1 && (
              <button onClick={handlePrevStep} style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#1a4d2e', fontWeight: 'bold', fontSize: '14px' }}>
                <ArrowLeft size={18} style={{ marginRight: '4px' }} /> 이전
              </button>
            )}

            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ flex: 1, height: '4px', background: s <= step ? '#1a4d2e' : '#eee', borderRadius: '2px' }}></div>
                ))}
              </div>

              {step === 1 && (
                <div className="fade-up">
                  <h2 className="serif-font" style={{ fontSize: '24px', marginBottom: '10px', color: '#1a4d2e' }}>어떤 상담을 원하시나요?</h2>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>관심 있는 진료 과목을 선택해 주세요.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {['다이어트', '피부/흉터', '교통사고', '기타'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => { setFormData({...formData, category: cat}); handleNextStep(); }}
                        style={{ padding: '20px', borderRadius: '12px', border: '1px solid #eee', background: '#fcfcfc', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1a4d2e'; e.currentTarget.style.background = '#ebf2ed'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.background = '#fcfcfc'; }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="fade-up">
                  <h2 className="serif-font" style={{ fontSize: '24px', marginBottom: '10px', color: '#1a4d2e' }}>상담 내용을 적어주세요</h2>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>{formData.category}에 대해 궁금하신 점을 알려주세요.</p>
                  <textarea 
                    autoFocus
                    required 
                    rows={5} 
                    placeholder="예: 다이어트 한약 가격이 궁금합니다 / 여드름 흉터 치료 기간이 얼마나 걸릴까요?" 
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                    style={{ width: '100%', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', background: '#f9f9f9', resize: 'none', fontSize: '15px' }}
                  ></textarea>
                  <button 
                    disabled={!formData.message}
                    onClick={handleNextStep}
                    className="btn-cta" 
                    style={{ width: '100%', padding: '18px', marginTop: '20px', opacity: formData.message ? 1 : 0.5 }}
                  >
                    다음으로
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="fade-up">
                  <h2 className="serif-font" style={{ fontSize: '24px', marginBottom: '10px', color: '#1a4d2e' }}>마지막으로 정보를 입력해 주세요</h2>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>정확한 상담을 위해 성함과 연락처가 필요합니다.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input 
                      autoFocus
                      required 
                      type="text" 
                      placeholder="성함" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      style={{ padding: '18px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }} 
                    />
                    <input 
                      required 
                      type="tel" 
                      placeholder="연락처 (010-0000-0000)" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      style={{ padding: '18px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }} 
                    />
                  </div>
                  <button 
                    disabled={!formData.name || !formData.phone}
                    onClick={handleSubmit}
                    className="btn-cta" 
                    style={{ width: '100%', padding: '18px', marginTop: '30px', opacity: (formData.name && formData.phone) ? 1 : 0.5 }}
                  >
                    상담 신청 완료하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section id="about" className="section-story">
        <div className="container">
          <div className="profile-section">
            <div className="profile-image-container">
              <img src={IMAGES.profile} alt="원장님" onError={(e) => handleImgError(e, IMAGES.fallback.doctor)} />
            </div>
            <div className="fade-up">
              <div className="story-header" style={{textAlign: 'left', marginBottom: '40px'}}>
                <span>Representative Director</span>
                <h2 className="serif-font">이언호 대표원장</h2>
              </div>
              <p style={{fontSize: '20px', color: '#1a4d2e', fontWeight: '600', marginBottom: '32px'}}>
                "본질에 집중하여 근본적인 치료를 지향합니다."
              </p>
              <ul className="history-list" style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 size={20} color="#1a4d2e" /> <span>서울대학교 자연과학대학 졸업</span></li>
                <li style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 size={20} color="#1a4d2e" /> <span>대전대학교 한의과대학 졸업</span></li>
                <li style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 size={20} color="#1a4d2e" /> <span>전) 바른손한의원 대표원장</span></li>
                <li style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 size={20} color="#1a4d2e" /> <span>현) 닥톡-네이버 지식iN 상담한의사</span></li>
                <li style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'}}><CheckCircle2 size={20} color="#1a4d2e" /> <span>SBS 생활경제 자문한의사 출연</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="treatment" className="section-story bg-soft">
        <div className="container">
          <div className="story-header">
            <span>Our Expertise</span>
            <h2 className="serif-font">주요 진료 안내</h2>
          </div>
          <div className="grid-3">
            {[
              { title: '다이어트', desc: '체질 분석을 통한 맞춤 한약 솔루션', img: IMAGES.diet },
              { title: '피부 질환', desc: '여드름, 흉터 등 근본적인 재생 치료', img: IMAGES.skin },
              { title: '교통사고', desc: '사고 후유증 최소화를 위한 집중 관리', img: IMAGES.accident },
            ].map((item, idx) => (
              <div key={idx} className="treatment-card">
                <div style={{height: '240px', overflow: 'hidden', borderRadius: '4px', marginBottom: '32px'}}>
                  <img src={item.img} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} onError={(e) => handleImgError(e, IMAGES.fallback.hospital)} />
                </div>
                <h3>{item.title}</h3>
                <p style={{color: '#666'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inpatient" className="container" style={{padding: '80px 0'}}>
        <div className="inpatient-banner">
          <div className="container">
            <h2 className="serif-font" style={{fontSize: '48px', marginBottom: '24px'}}>365일 입원실 운영</h2>
            <p style={{fontSize: '18px', opacity: '0.9', maxWidth: '700px', margin: '0 auto 48px'}}>
              프라이빗한 1인실 위주의 입원 시설에서 오직 회복에만 전념하실 수 있습니다.
            </p>
            <div style={{height: '400px', borderRadius: '8px', overflow: 'hidden'}}>
              <img src={IMAGES.inpatient} alt="입원실" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-story bg-soft">
        <div className="container">
          <div className="story-header">
            <span>Location & Time</span>
            <h2 className="serif-font">오시는 길</h2>
          </div>
          <div className="grid-3">
            <div className="treatment-card">
              <Clock size={28} color="#1a4d2e" style={{marginBottom: '24px'}} />
              <h3 style={{fontSize: '20px'}}>진료 시간</h3>
              <div style={{fontSize: '15px', color: '#444'}}>
                <p style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}><span>평일</span> <strong>10:30 - 20:30</strong></p>
                <p style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}><span>토요일</span> <strong>10:00 - 14:00</strong></p>
                <p style={{display: 'flex', justifyContent: 'space-between', color: '#e53e3e', fontWeight: '700'}}><span>매주 목/일</span> <strong>휴진</strong></p>
              </div>
            </div>
            <div className="treatment-card">
              <MapPin size={28} color="#1a4d2e" style={{marginBottom: '24px'}} />
              <h3 style={{fontSize: '20px'}}>주소 안내</h3>
              <p style={{fontSize: '15px', color: '#444'}}>경북 구미시 인동가산로 9-3 4층</p>
              <div style={{marginTop: '24px', padding: '16px', background: '#f0f4f1', borderRadius: '4px', fontSize: '13px'}}>건물 내 타워 주차장 이용 가능</div>
            </div>
            <div className="treatment-card" style={{background: '#1a4d2e', color: 'white'}}>
              <Phone size={28} style={{marginBottom: '24px'}} />
              <h3 style={{fontSize: '20px', color: 'white'}}>상담 및 예약</h3>
              <div style={{fontSize: '32px', fontWeight: '800', margin: '16px 0'}}>054.474.1075</div>
              <p style={{opacity: 0.8, fontSize: '14px'}}>카카오톡 ID: hoogumi</p>
            </div>
          </div>

          <div style={{ marginTop: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.2386348425175!2d128.4172404764953!3d36.10006717245362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e31718870195%3A0x6b47c61c33c30177!2z7ZuE7ZWc7J2Y7JuQIOq1rOuvuOydkA!5e0!3m2!1sko!2skr!4v1712571243123!5m2!1sko!2skr" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="후한의원 구미점 지도"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h2 className="logo" style={{marginBottom: '32px'}}>후한의원</h2>
              <div style={{fontSize: '14px', color: '#888'}}>
                <p>대표원장: 이언호 | 사업자등록번호: 531-92-00511</p>
                <p>주소: 경북 구미시 인동가산로 9-3 4층 후한의원</p>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{fontSize: '13px', color: '#999'}}>Copyright © 후한의원 구미점. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

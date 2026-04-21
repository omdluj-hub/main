import { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Menu, 
  X,
  Stethoscope,
  Zap,
  Coffee,
  Pill,
  Calendar
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  // 후한의원 구미점 정확한 링크 주소
  const KAKAO_LINK = "https://pf.kakao.com/_JEGuu";
  const NAVER_LINK = "https://m.booking.naver.com/booking/6/bizes/449323";
  const REMOTE_LINK = "https://bbs-ruddy-iota.vercel.app/diet";

  // 최종 누적 처방 사례 계산
  const targetCount = (() => {
    const startDate = new Date('2025-01-01').getTime();
    const today = new Date().getTime();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const baseCount = 15281;
    return baseCount + daysPassed * 10;
  })();

  // 카운팅 애니메이션 로직 (10초마다 반복)
  useEffect(() => {
    const runAnimation = () => {
      let start = 0;
      const end = targetCount;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / 100));
      
      const timer = setInterval(() => {
        start += Math.ceil(end / 100); 
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime);
    };

    runAnimation();
    const repeatInterval = setInterval(() => {
      setCount(0);
      setTimeout(runAnimation, 100);
    }, 10000);

    return () => clearInterval(repeatInterval);
  }, [targetCount]);

  const prescriptionCount = count.toLocaleString();

  const programs = [
    {
      title: "비움탕",
      description: "본격적인 다이어트 전 독소와 노폐물 배출로 몸을 정화합니다.",
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      tag: "1단계: 비우기",
      image: "/images/biumtang.jpg"
    },
    {
      title: "미감탕",
      description: "1:1 맞춤 조제로 식욕 억제, 포만감 형성 및 기초대사량을 증진시킵니다.",
      icon: <Stethoscope className="w-6 h-6 text-emerald-500" />,
      tag: "2단계: 태우기",
      image: "/images/migamtang.jpg"
    },
    {
      title: "다요스틱/다요정",
      description: "쓴 한약이 부담스러운 분들을 위한 간편한 환/알약 형태의 다이어트 한약입니다.",
      icon: <Pill className="w-6 h-6 text-emerald-500" />,
      tag: "간편 복용",
      image: "/images/dayojeong.jpg"
    },
    {
      title: "미감에스",
      description: "시럽 형태로 복용이 간편하며 외출 시에도 휴대하기 좋습니다.",
      icon: <Coffee className="w-6 h-6 text-emerald-500" />,
      tag: "이지 컷",
      image: "/images/migams.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans relative">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-emerald-700">후한의원 구미점</span>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#about" className="text-stone-600 hover:text-emerald-600 transition">프로그램</a>
              <a href="#features" className="text-stone-600 hover:text-emerald-600 transition">특징</a>
              <a href="#info" className="text-stone-600 hover:text-emerald-600 transition">오시는 길</a>
              <a 
                href={REMOTE_LINK}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4" /> 비대면 상담
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 py-4 px-4 space-y-2">
            <a href="#about" className="block px-3 py-2 text-stone-600" onClick={() => setIsMenuOpen(false)}>프로그램</a>
            <a href="#features" className="block px-3 py-2 text-stone-600" onClick={() => setIsMenuOpen(false)}>특징</a>
            <a href="#info" className="block px-3 py-2 text-stone-600" onClick={() => setIsMenuOpen(false)}>오시는 길</a>
            <a 
              href={REMOTE_LINK}
              target="_blank"
              rel="noreferrer"
              className="w-full text-left px-3 py-2 text-emerald-600 font-bold flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" /> 비대면 상담
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-emerald-600 font-bold mb-4">구미 다이어트의 정답</h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-800 leading-tight mb-6">
              건강한 감량,<br />
              <span className="text-emerald-600">요요 없는 유지</span><br />
              후한의원이 함께합니다
            </h1>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              개별 체질 분석부터 1:1 맞춤 한약 처방까지.<br />
              후한의원 구미점에서 당신만을 위한 건강한 다이어트를 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={KAKAO_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-52 flex items-center justify-center bg-emerald-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
              >
                카톡으로 간편 상담 <ChevronRight className="ml-1.5 w-4 h-4" />
              </a>
              <a 
                href={REMOTE_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-52 flex items-center justify-center border-2 border-emerald-600 text-emerald-600 py-3.5 rounded-xl text-base font-bold hover:bg-emerald-50 transition"
              >
                <Stethoscope className="mr-2 w-4 h-4" /> 비대면 상담 <ChevronRight className="ml-1.5 w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative w-full">
            <div 
              className="bg-gradient-to-br from-emerald-100 to-teal-50 rounded-3xl w-full shadow-2xl relative border border-emerald-200 overflow-hidden"
              style={{ aspectRatio: '4 / 3' }}
            >
              <img 
                src="/images/hero-gen.png" 
                alt="후한의원 다이어트" 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   target.style.display = 'none';
                   const fallback = target.nextElementSibling as HTMLElement;
                   if (fallback) fallback.classList.remove('hidden');
                   if (fallback) fallback.classList.add('flex');
                }}
              />
              <div className="hidden absolute inset-0 z-10 flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-50">
                <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="bg-white p-8 rounded-full shadow-lg mb-6 ring-8 ring-emerald-50">
                    <Stethoscope className="w-20 h-20 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <CheckCircle2 className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-medium">누적 처방 사례</p>
                  <p className="text-xl font-bold text-stone-800">{prescriptionCount}건</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="about" className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-emerald-600 font-bold mb-2 text-lg">PROGRAM</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-800">맞춤형 다이어트 솔루션</h3>
            <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
              후한의원은 개인의 생활 습관과 체질을 분석하여 가장 효과적인 다이어트 프로그램을 제안합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="rounded-3xl bg-stone-50 border border-stone-100 overflow-hidden hover:shadow-2xl transition-all group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'; }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm">
                    {program.icon}
                  </div>
                </div>
                <div className="p-6">
                  <span className="block text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wider">{program.tag}</span>
                  <h4 className="text-xl font-bold text-stone-800 mb-3">{program.title}</h4>
                  <p className="text-stone-500 leading-relaxed text-sm">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section id="features" className="py-20 px-4 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/remote.jpg" alt="Clinic Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-emerald-400 font-bold mb-4">SPECIAL</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
                후한의원 구미점만의<br />
                차별화된 포인트
              </h3>
              
              <ul className="space-y-6">
                {[
                  "1:1 맞춤 진찰 및 체성분 인바디 분석",
                  "전국 어디서나 가능한 비대면 전화 처방",
                  "요요 방지를 위한 철저한 유지 관리 프로그램",
                  "바쁜 분들을 위한 평일 야간 진료 (월/화/수/금)"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 w-6 h-6 flex-shrink-0" />
                    <span className="text-emerald-100 text-lg">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               <div className="space-y-4">
                  <div className="bg-emerald-800/80 rounded-2xl p-6 backdrop-blur">
                    <p className="text-4xl font-extrabold mb-1">1:1</p>
                    <p className="text-emerald-300 text-sm">개별 맞춤 처방</p>
                  </div>
                  <div className="bg-emerald-800/80 rounded-2xl p-6 backdrop-blur">
                    <p className="text-4xl font-extrabold mb-1">Care</p>
                    <p className="text-emerald-300 text-sm">유지기 밀착관리</p>
                  </div>
               </div>
               <div className="space-y-4 pt-8">
                  <div className="bg-emerald-800/80 rounded-2xl p-6 backdrop-blur">
                    <p className="text-4xl font-extrabold mb-1">Night</p>
                    <p className="text-emerald-300 text-sm">야간진료 시행</p>
                  </div>
                  <div className="bg-emerald-800/80 rounded-2xl p-6 backdrop-blur">
                    <p className="text-4xl font-extrabold mb-1">{prescriptionCount}</p>
                    <p className="text-emerald-300 text-sm">누적 처방 사례</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info & Map */}
      <section id="info" className="py-20 bg-stone-100 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-stone-800 mb-8 flex items-center gap-2">
            <Clock className="text-emerald-600" /> 진료 안내 및 예약
          </h3>

          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Info Card */}
            <div className="lg:w-1/2 flex">
              <div className="bg-white rounded-3xl p-8 shadow-sm w-full border border-stone-200/50 flex flex-col justify-between">
                <div>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                      <span className="font-medium text-stone-600">월·화·수·금요일</span>
                      <span className="text-emerald-700 font-bold">10:30 ~ 20:30</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                      <span className="font-medium text-stone-600">토요일</span>
                      <span className="text-stone-700">10:00 ~ 14:00</span>
                    </div>
                    <div className="flex justify-between items-center text-red-500 font-medium">
                      <span>목요일·일요일·공휴일</span>
                      <span>휴진</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-lg font-bold text-stone-800 mb-1 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" /> 후한의원 구미점
                      </p>
                      <p className="text-stone-500 text-sm ml-7 leading-relaxed">
                        경상북도 구미시 인동가산로 9-3 노블레스타워 4층<br/>
                        (황상동, 인동 메가박스 맞은편 스타벅스 건물)
                      </p>
                    </div>

                    <div className="flex items-center gap-3 ml-7">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <p className="text-xl font-extrabold text-stone-800 tracking-tight">054-474-1075</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={KAKAO_LINK} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] py-4 rounded-2xl font-bold hover:bg-[#FADA0A] transition shadow-sm active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" /> 카톡 상담
                    </a>
                    <a 
                      href={NAVER_LINK} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-center gap-2 bg-[#03C75A] text-white py-4 rounded-2xl font-bold hover:bg-[#02b351] transition shadow-sm active:scale-95"
                    >
                      <Calendar className="w-5 h-5" /> 네이버 예약
                    </a>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                    <h4 className="font-bold text-stone-800 mb-1 text-sm">주차 안내</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      - 건물 내 타워 주차장 무료 이용 가능 / 만차 시 인근 주차권 제공
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Card */}
            <div className="lg:w-1/2 flex">
              <div className="bg-white rounded-3xl p-3 shadow-sm w-full border border-stone-200/50 overflow-hidden relative min-h-[450px]">
                <iframe 
                  src="https://maps.google.com/maps?q=후한의원+구미점&t=&z=17&ie=UTF8&iwloc=B&output=embed" 
                  className="w-full h-full rounded-2xl"
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                   <span className="text-xs font-bold text-stone-700">정확한 마커 위치</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 py-12 px-4 pb-24 md:pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-white mb-4">후한의원 구미점</p>
          <p className="text-sm leading-relaxed mb-6 text-stone-400">
            경상북도 구미시 인동가산로 9-3 노블레스타워 4층 | 대표번호: 054-474-1075<br />
            사업자등록번호: 328-29-00914 | 원장: 이언호
          </p>
          <div className="flex justify-center gap-6 mb-8 text-stone-400 text-sm">
             <a href={KAKAO_LINK} target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition">카톡 상담</a>
             <a href={NAVER_LINK} target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition">네이버 예약</a>
             <a href={REMOTE_LINK} target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition">비대면 상담</a>
             <a href="tel:054-474-1075" className="hover:text-emerald-500 transition text-stone-400">전화 연결</a>
          </div>
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Hoo Clinic Gumi. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed right-6 bottom-24 md:bottom-12 z-40 flex flex-col gap-3">
        <a 
          href={REMOTE_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all hover:scale-110 group border-4 border-white"
        >
          <Stethoscope className="w-8 h-8 md:w-12 md:h-12 mb-1" />
          <span className="text-xs md:text-sm font-bold leading-tight">비대면<br/>상담</span>
        </a>
      </div>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white/95 backdrop-blur border-t border-stone-200 p-4 grid grid-cols-2 gap-4 z-50">
        <a 
          href="tel:054-474-1075"
          className="flex items-center justify-center bg-stone-100 text-stone-800 py-3 rounded-xl font-bold"
        >
          <Phone className="w-5 h-5 mr-2" /> 전화상담
        </a>
        <a 
          href={REMOTE_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200"
        >
          <Stethoscope className="w-5 h-5 mr-2" /> 비대면상담
        </a>
      </div>
    </div>
  );
}

export default App;

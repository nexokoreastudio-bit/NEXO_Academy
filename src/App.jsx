import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Monitor,
  PenTool,
  Users,
  Clock,
  CheckCircle,
  Phone,
  Wifi,
} from 'lucide-react';

const scrollToPrice = () => {
  document.getElementById('price')?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToBenefit = () => {
  document.getElementById('benefit')?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToOrder = () => {
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
};

const mountOptions = [
  { value: 'stand', label: '이동형 스탠드' },
  { value: 'wall_concrete', label: '벽부착-콘크리트' },
  { value: 'wall_gypsum', label: '벽부착-합판/석고보드' },
  { value: 'wall_etc', label: '벽부착-기타' },
];

const elevatorOptions = [
  { value: 'yes', label: '있음' },
  { value: 'ladder_ok', label: '없음(사다리차 가능)' },
  { value: 'ladder_no', label: '없음(사다리차 불가능)' },
];

const paymentOptions = [
  { value: 'transfer', label: '계좌이체(세금계산서 or 현금영수증)' },
  { value: 'card', label: '카드' },
  { value: 'rental', label: '렌탈(추가 서류 필요)' },
  { value: 'etc', label: '기타' },
];

// 2026.02.28 23:59:59 까지 카운트다운
const END_DATE = new Date('2026-02-28T23:59:59+09:00');

function useCountdown() {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, END_DATE - now);
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

const priceOneTime = [
  { size: '65', wall: 2310000, stand: 2530000 },
  { size: '75', wall: 2750000, stand: 2970000 },
  { size: '86', wall: 3300000, stand: 3630000 },
];

const priceInstallment = [
  {
    size: '65',
    months: [
      { m: 24, wall: 119900, stand: 132000 },
      { m: 36, wall: 84700, stand: 93500 },
      { m: 48, wall: 69300, stand: 75900 },
      { m: 60, wall: 59400, stand: 66000 },
    ],
  },
  {
    size: '75',
    months: [
      { m: 24, wall: 143000, stand: 155100 },
      { m: 36, wall: 101200, stand: 108900 },
      { m: 48, wall: 82500, stand: 89100 },
      { m: 60, wall: 71500, stand: 77000 },
    ],
  },
  {
    size: '86',
    months: [
      { m: 24, wall: 171600, stand: 189200 },
      { m: 36, wall: 121000, stand: 133100 },
      { m: 48, wall: 97900, stand: 107800 },
      { m: 60, wall: 84700, stand: 93500 },
    ],
  },
];

const zeroInterestCards = [
  { name: '삼성', months: '2~3개월', note: '홈쇼핑, 세금, 병원 제외' },
  { name: '롯데', months: '2~5개월', note: '-' },
  { name: '신한', months: '2~3개월', note: '4대보험, 세금(국세/지방세) 제외' },
  { name: 'KB국민', months: '2~3개월', note: '지방세, 차량(신차/중고차 관련) 제외' },
  { name: '현대', months: '2~3개월', note: '결제 금액 1만원 이상 적용 등' },
  { name: '하나', months: '2~4개월', note: '세금, 학원, 가구 등 제외' },
  { name: 'NH농협', months: '2~3개월', note: '홈쇼핑, 스포츠/레저 등 제외' },
  { name: '비씨', months: '2~5개월', note: '국세/지방세, 손해보험 등 제외' },
  { name: '우리', months: '2~5개월', note: '자동차, 국세, 지방세 등 제외' },
  { name: '광주', months: '2~5개월', note: '-' },
  { name: '전북', months: '2~3개월', note: '-' },
];

const App = () => {
  const countdown = useCountdown();
  const [qty65, setQty65] = useState(0);
  const [qty75, setQty75] = useState(0);
  const [qty86, setQty86] = useState(0);
  const [mountType, setMountType] = useState('');
  const [elevator, setElevator] = useState('');
  const [payment, setPayment] = useState('');

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const agree = document.getElementById('privacy-agree');
    if (!agree?.checked) { alert('개인정보 제3자 제공에 동의해주세요.'); return; }
    const form = e.target;
    const formData = new FormData(form);

    const customerName = (formData.get('customer_name') || '').trim();
    const phoneNumber = (formData.get('phone_number') || '').trim();
    const orgName = (formData.get('org_name') || '').trim();
    const address = (formData.get('address') || '').trim();
    const qtyEtc = (formData.get('qty_etc') || '').trim();

    if (!customerName) { alert('성함을 입력해주세요.'); return; }
    if (!phoneNumber) { alert('연락처를 입력해주세요.'); return; }
    if (!orgName) { alert('공부방 / 학원 상호명을 입력해주세요.'); return; }
    if (!address) { alert('설치할 주소를 입력해주세요.'); return; }

    const orderParts = [];
    if (qty65 > 0) orderParts.push(`65인치 ${qty65}대`);
    if (qty75 > 0) orderParts.push(`75인치 ${qty75}대`);
    if (qty86 > 0) orderParts.push(`86인치 ${qty86}대`);
    if (qtyEtc) orderParts.push(`그외 ${qtyEtc}`);

    if (orderParts.length === 0) { alert('전자칠판 주문 수량을 선택해주세요.'); return; }
    if (!mountType) { alert('설치 방법을 선택해주세요.'); return; }
    if (!elevator) { alert('엘리베이터 여부를 선택해주세요.'); return; }
    if (!payment) { alert('결제 방식을 선택해주세요.'); return; }

    const orderSummary = orderParts.join(', ');
    const payload = {
      customer_name: customerName,
      phone_number: phoneNumber,
      org_name: orgName,
      address,
      order_summary: orderSummary,
      mount_type: mountOptions.find(o => o.value === mountType)?.label || mountType,
      elevator: elevatorOptions.find(o => o.value === elevator)?.label || elevator,
      payment: paymentOptions.find(o => o.value === payment)?.label || payment,
    };

    try {
      const res = await fetch('/.netlify/functions/save-to-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.details || data.error || '저장 실패');

      // Netlify Forms에도 제출 (대시보드에서 확인 가능, bot-field는 빈 값으로 스팸 방지)
      const netlifyPayload = new URLSearchParams({
        'form-name': 'academy-nexo-order',
        'bot-field': '',
        customer_name: payload.customer_name,
        phone_number: payload.phone_number,
        org_name: payload.org_name,
        address: payload.address,
        order_summary: payload.order_summary,
        mount_type: payload.mount_type,
        elevator: payload.elevator,
        payment: payload.payment,
      });
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyPayload.toString(),
      }).catch(() => {});

      alert('접수되었습니다. 24시간 내 연락드리겠습니다.');
      form.reset();
      setQty65(0); setQty75(0); setQty86(0);
      setMountType(''); setElevator(''); setPayment('');
    } catch (err) {
      alert(err.message || '오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white overflow-x-hidden font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-navy/95 backdrop-blur z-50 border-b border-navyLight">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-lg">
            <span className="text-gold">NEXO</span>
            <span className="text-white/90"> × 아카데미 美 디자인 공모전</span>
          </span>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#story" className="text-white/70 hover:text-gold text-sm font-medium transition">공모전 스토리</a>
            <a href="#why" className="text-white/70 hover:text-gold text-sm font-medium transition">왜 넥소인가</a>
            <a href="#price" className="text-white/70 hover:text-gold text-sm font-medium transition">특별가</a>
            <a href="#order" className="text-white/70 hover:text-gold text-sm font-medium transition">견적 신청</a>
            <a href="tel:032-569-5771" className="text-gold hover:text-goldLight text-sm flex items-center gap-1 font-semibold">
              <Phone className="w-4 h-4" /> 032.569.5771
            </a>
          </nav>
          <button
            onClick={scrollToPrice}
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition"
          >
            관계자 전용 특별가 확인
          </button>
        </div>
      </header>

      {/* Section 1: Hero */}
      <section className="pt-[4rem] pb-20 md:pt-28 md:pb-28 relative min-h-[85vh] flex items-center">
        {/* 배경 이미지: 골드 트로피 + NEXO 로고 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/50" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
          <p className="text-white font-semibold tracking-widest uppercase text-sm mb-4">
            2025 아카데미 美 디자인 공모전
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            그 뜨거웠던 창의의 순간을
            <br />
            <span className="text-gold">넥소가 함께했습니다.</span>
          </h1>
          <div className="max-w-2xl mx-auto mb-10 px-6 py-5 bg-white/30 border-2 border-white/50 rounded-xl">
            <p className="text-white text-lg md:text-xl text-center" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)' }}>
              대상 수상자에게 전해진 65인치 넥소 전자칠판의 감동,
              <br className="hidden sm:block" />
              이제 관계자 여러분께 <span className="text-gold font-semibold">특별한 혜택</span>으로 찾아갑니다.
            </p>
          </div>
          <button
            onClick={scrollToPrice}
            className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-accent/20 transition"
          >
            관계자 전용 특별가 확인하기
          </button>
          <p className="mt-6 font-bold text-xl md:text-2xl lg:text-3xl tracking-wide">
            <span className="text-gold">NEXO</span>
            <span className="text-white"> × 아카데미 美 디자인 공모전</span>
          </p>
        </div>
      </section>

      {/* Section 2: 공모전 후원 스토리 */}
      <section id="story" className="py-16 md:py-24 bg-navyLight scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div
              className="rounded-2xl overflow-hidden border border-navyMuted/50 aspect-video bg-cover bg-center relative"
              style={{ backgroundImage: 'url(/award-ceremony.png)' }}
            >
              <div className="absolute inset-0 bg-navy/50" />
              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
                <p className="text-white font-semibold text-sm md:text-base drop-shadow-lg text-center w-full">
                  시상식 · 330만원 상당 넥소 전자칠판 전달
                </p>
              </div>
            </div>
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">공모전 후원 스토리</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="block">미래를 디자인하는 인재를 위해,</span>
                <span className="text-gold whitespace-nowrap">넥소가 품격 있는 후원으로 함께했습니다.</span>
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                대상(미상) 수상자 부상으로 330만원 상당의 넥소 전자칠판을 후원 했습니다.
                창의적 디자인의 가치를 믿는 넥소의 약속을, 관계자 여러분께는 특별한 구매 혜택으로 이어갑니다.
              </p>
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">공모전의 권위와 넥소의 신뢰가 만났습니다.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 왜 넥소 전자칠판인가 */}
      <section id="why" className="py-16 md:py-24 bg-navy scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">제품소개</p>
            <h2 className="text-3xl md:text-4xl font-bold">왜 넥소 전자칠판인가?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-navyLight rounded-2xl p-8 border border-navyMuted/50 hover:border-gold/30 transition">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                <Monitor className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">압도적 화질</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                4K UHD 65인치 대화면으로 디자인의 디테일을 완벽하게 구현합니다.
              </p>
            </div>
            <div className="bg-navyLight rounded-2xl p-8 border border-navyMuted/50 hover:border-gold/30 transition">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                <PenTool className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">부드러운 판서</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                실제 종이에 그리는 듯한 제로 갭(Zero-gap) 터치 기술.
              </p>
            </div>
            <div className="bg-navyLight rounded-2xl p-8 border border-navyMuted/50 hover:border-gold/30 transition">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">스마트 협업</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                무선 미러링과 양방향 판서로 디자인 피드백 시간을 단축합니다.
              </p>
            </div>
          </div>

          {/* 모델 사이즈 및 추천 (이미지 & 시연 위) - 원본 이미지, 인치별 크기로 표현 */}
          <div className="mt-14">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 text-center">모델 사이즈 및 추천</p>
            <p className="text-white/80 text-center text-sm mb-8 max-w-2xl mx-auto">공간과 인원에 맞는 인치를 선택하세요. 넥소 전자칠판은 65·75·86인치 세 가지 사이즈로 제공됩니다.</p>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <img src="/nexo-65.png" alt="65인치 넥소 전자칠판" className="w-full max-w-sm mx-auto md:max-w-[280px] md:mx-0 object-contain shrink-0" />
                <div>
                  <h4 className="font-bold text-gold text-xl mb-2">65인치</h4>
                  <p className="text-white/80 text-sm mb-1">추천 공간: 8~10평 미만</p>
                  <p className="text-white/70 text-sm">5~8명 · 소규모 교실, 스터디룸, 디자인 실습실</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <img src="/nexo-75.png" alt="75인치 넥소 전자칠판" className="w-full max-w-sm mx-auto md:max-w-[280px] md:mx-0 object-contain shrink-0" />
                <div>
                  <h4 className="font-bold text-gold text-xl mb-2">75인치</h4>
                  <p className="text-white/80 text-sm mb-1">추천 공간: 10~15평</p>
                  <p className="text-white/70 text-sm">10~15명 · 중규모 강의실, 학원 교실, 회의실</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                <img src="/nexo-86.png" alt="86인치 넥소 전자칠판" className="w-full max-w-sm mx-auto md:max-w-[280px] md:mx-0 object-contain shrink-0" />
                <div>
                  <h4 className="font-bold text-gold text-xl mb-2">86인치</h4>
                  <p className="text-white/80 text-sm mb-1">추천 공간: 15평 이상</p>
                  <p className="text-white/70 text-sm">20명 이상 · 대형 강의실, 세미나실, 대회장</p>
                </div>
              </div>
            </div>
          </div>

          {/* 이미지 & 시연 영상 */}
          <div className="mt-14">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-6 text-center">이미지 & 시연</p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-navyLight rounded-2xl overflow-hidden border border-navyMuted/50">
                <img src="/Eshare_Pro.png" alt="Eshare 무선 미러링" className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-gold mb-1">Eshare · 3초 연결</h4>
                  <p className="text-white/70 text-sm">9대 동시 화면 공유. Windows·Mac·iOS·Android.</p>
                </div>
              </div>
              <div className="bg-navyLight rounded-2xl overflow-hidden border border-navyMuted/50">
                <img src="/nexo-problem-statement.png" alt="UMIND 판서" className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-gold mb-1">UMIND · PDF 위에 판서</h4>
                  <p className="text-white/70 text-sm">2D·3D 그래프, 도형, 자. 디자인 피드백에 최적.</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { id: 'Ci1uy-5eEJg', title: '넥소 전자칠판 시연', desc: '핵심 기능 한눈에' },
                { id: 'hSFAHFgniVU', title: '3초 무선 미러링', desc: '케이블 없이 연결' },
                { id: 'bLcOVmdYWzM', title: '폰 쉐어 1위 기능', desc: '사진 → 칠판 즉시' },
              ].map((v) => (
                <div key={v.id} className="bg-navyLight rounded-2xl overflow-hidden border border-navyMuted/50">
                  <div className="aspect-video bg-black">
                    <iframe src={`https://www.youtube.com/embed/${v.id}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gold mb-1">{v.title}</h4>
                    <p className="text-white/70 text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-md mx-auto">
              <div className="bg-navyLight rounded-2xl overflow-hidden border border-navyMuted/50">
                <img src="/nexo-classroom.png" alt="교실 수업" className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <h4 className="font-bold text-gold mb-1">교실 수업</h4>
                  <p className="text-white/70 text-sm">수학 3D·도형 시각화, 수식 입력과 판서</p>
                  <p className="text-white/40 text-xs mt-2">* 고객의 이해를 돕기 위해 AI 생성 이미지를 사용하였습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 관계자 한정 특별 구매 혜택 */}
      <section id="benefit" className="py-16 md:py-24 bg-navyLight scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">한정 혜택</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">관계자 한정 특별 구매 혜택</h2>
            <p className="text-white/80">
              오직 <strong className="text-gold">2025 아카데미 美 디자인 공모전 관계자</strong>
              (학원장, 강사, 운영진)에게만 제공됩니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-navy rounded-xl p-5 border border-gold/20 text-center">
              <p className="text-gold text-sm font-semibold mb-1">시중가 대비</p>
              <p className="text-2xl font-bold text-gold">파격 할인</p>
            </div>
            <div className="bg-navy rounded-xl p-5 border border-gold/20 text-center">
              <p className="text-gold text-sm font-semibold mb-1">판서앱 무료</p>
              <p className="text-2xl font-bold text-gold">소프트웨어 증정</p>
            </div>
            <div className="bg-navy rounded-xl p-5 border border-gold/20 text-center">
              <p className="text-gold text-sm font-semibold mb-1">무료</p>
              <p className="text-2xl font-bold text-gold">설치 서비스</p>
            </div>
          </div>
          {/* 카운트다운 */}
          <div className="bg-navy rounded-2xl p-6 md:p-8 border border-gold/30">
            <p className="text-center text-gold font-semibold mb-4 flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" /> 종료까지 남은 시간
            </p>
            <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
              {[
                { val: countdown.d, label: '일' },
                { val: countdown.h, label: '시간' },
                { val: countdown.m, label: '분' },
                { val: countdown.s, label: '초' },
              ].map(({ val, label }) => (
                <div key={label} className="bg-navyLight rounded-xl px-4 py-3 min-w-[4rem] text-center border border-navyMuted/50">
                  <span className="text-2xl md:text-3xl font-bold text-gold tabular-nums">{String(val).padStart(2, '0')}</span>
                  <span className="block text-white/60 text-xs mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심기능 요약 */}
      <section className="py-16 md:py-20 bg-navy scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-2">핵심기능</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">넥소 전자칠판, 한눈에 보는 핵심</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-navyLight rounded-xl p-4 md:p-5 border border-navyMuted/50 text-center">
              <Monitor className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-bold text-white text-sm md:text-base mb-0.5">4K UHD 화질</p>
              <p className="text-white/60 text-xs">디테일 완벽 구현</p>
            </div>
            <div className="bg-navyLight rounded-xl p-4 md:p-5 border border-navyMuted/50 text-center">
              <PenTool className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-bold text-white text-sm md:text-base mb-0.5">제로 갭 터치</p>
              <p className="text-white/60 text-xs">종이 같은 필기감</p>
            </div>
            <div className="bg-navyLight rounded-xl p-4 md:p-5 border border-navyMuted/50 text-center">
              <Wifi className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-bold text-white text-sm md:text-base mb-0.5">무선 미러링</p>
              <p className="text-white/60 text-xs">케이블 없이 연결</p>
            </div>
            <div className="bg-navyLight rounded-xl p-4 md:p-5 border border-navyMuted/50 text-center col-span-2 md:col-span-1">
              <Users className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-bold text-white text-sm md:text-base mb-0.5">스마트 협업</p>
              <p className="text-white/60 text-xs">양방향 판서·피드백</p>
            </div>
          </div>
        </div>
      </section>

      {/* 스펙 */}
      <section className="py-16 md:py-20 bg-navyLight scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-2">스펙</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">타협 없는 사양</h2>
          </div>
          {/* 상단 강조: Android · CPU · 저장용량 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Android 13 → 15', sub: '최신 OS' },
              { label: 'Octa-Core · RAM 16GB', sub: '고성능' },
              { label: 'ROM 256GB', sub: '대용량 저장' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-navy rounded-xl px-5 py-4 border-2 border-gold/50 shadow-lg">
                <CheckCircle className="w-6 h-6 text-gold shrink-0" />
                <div>
                  <p className="text-white font-bold text-base md:text-lg">{item.label}</p>
                  <p className="text-gold text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              '무반사 9H 강화유리',
              'ZERO-GAP Bonding',
              '50포인트 멀티터치',
              '48MP AI 카메라',
              '8 어레이 마이크',
              'Wi-Fi 6 · USB Type-C',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-navy rounded-xl px-4 py-3 border border-navyMuted/50">
                <CheckCircle className="w-5 h-5 text-gold shrink-0" />
                <span className="text-white/90 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: 관계자 전용 특별가 (가격표) - 배경: 첨부 다크 네이비 #2A3440 */}
      <section id="price" className="py-16 md:py-24 bg-[#2A3440] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">2026.02.03 아카데미 디자인 공모전</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">넥소 전자칠판 관계자 전용 특별가</h2>
          </div>

          {/* 일시불 */}
          <div className="mb-14">
            <h3 className="text-xl font-bold text-white mb-4">파격적인 일시불 혜택 (현금/신용카드)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {priceOneTime.map((row) => (
                <div key={row.size} className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-sm hover:border-accent/50 hover:shadow-md transition">
                  <p className="text-2xl font-bold text-accent mb-4">{row.size}인치</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between text-neutral-700">
                      <span className="text-neutral-500">벽걸이형</span>
                      <span className="font-semibold text-neutral-800">{row.wall.toLocaleString()}원</span>
                    </p>
                    <p className="flex justify-between text-neutral-700">
                      <span className="text-neutral-500">이동형 스탠드</span>
                      <span className="font-semibold text-neutral-800">{row.stand.toLocaleString()}원</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 장기 할부 */}
          <div className="mb-14">
            <h3 className="text-xl font-bold text-white mb-4">부담 없는 장기 할부 프로그램 (월 납입금)</h3>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[280px]">
                {priceInstallment.map((product) => (
                  <div key={product.size} className="bg-white rounded-xl overflow-hidden border-2 border-orange-200 shadow-sm hover:border-accent/50 hover:shadow-md transition">
                    <div className="bg-orange-50 px-4 py-3 border-b border-orange-200">
                      <p className="text-lg font-bold text-accent">{product.size}인치</p>
                    </div>
                    <div className="px-4 py-2 border-b border-neutral-100 grid grid-cols-3 gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <div>할부기간</div>
                      <div className="text-accent">벽걸이형</div>
                      <div>스탠드형</div>
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {product.months.map((mo) => (
                        <div key={mo.m} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm items-center">
                          <span className="text-neutral-600 font-medium">{mo.m}개월</span>
                          <span className="font-bold text-accent whitespace-nowrap">{mo.wall.toLocaleString()}원</span>
                          <span className="text-neutral-700 whitespace-nowrap">{mo.stand.toLocaleString()}원</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-white/80 text-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>할부 금융 프로그램 진행 시 추가 서류가 필요합니다. 할부 완납 시 소유권이 구매자에게 이전됩니다.</span>
            </p>
          </div>

          {/* 2월 한정 무이자 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-orange-200 shadow-sm">
            <h3 className="text-xl font-bold text-accent mb-4">2월 한정 무이자 할부 혜택</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <p className="text-neutral-500 text-sm mb-1">행사 기간</p>
                <p className="font-semibold text-neutral-800">2026. 02. 01 ~ 2026. 02. 28</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm mb-1">적용 대상</p>
                <p className="font-semibold text-neutral-800">온라인 PG 결제 금액 5만원 이상 시 적용</p>
              </div>
            </div>
            <p className="text-neutral-500 text-sm mb-3">카드사별 무이자 할부 (예시)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-orange-200 rounded-lg overflow-hidden bg-white">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="text-left py-3 px-4 font-semibold text-accent">카드사</th>
                    <th className="text-left py-3 px-4 font-semibold text-accent">할부개월</th>
                    <th className="text-left py-3 px-4 font-semibold text-accent">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {zeroInterestCards.map((c) => (
                    <tr key={c.name} className="border-t border-orange-100">
                      <td className="py-2 px-4 font-medium text-neutral-800">{c.name}</td>
                      <td className="py-2 px-4 text-neutral-700">{c.months}</td>
                      <td className="py-2 px-4 text-neutral-500">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/90 font-semibold">대상 수상자(미상)가 받은 그 제품을, 관계자라면 월 5만원대에 소유할 수 있습니다.</p>
          </div>
        </div>
      </section>

      {/* 주문 접수 폼 */}
      <section id="order" className="py-16 md:py-20 bg-navyLight scroll-mt-20">
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">견적 및 상담 신청</h2>
            <p className="text-white/70 text-sm">관계자 전용 특별가 견적을 받아보세요</p>
          </div>
          <form name="academy-nexo-order" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleOrderSubmit} className="space-y-5 bg-navy rounded-2xl p-6 md:p-8 border border-navyMuted/50">
            <input type="hidden" name="form-name" value="academy-nexo-order" />
            <input type="hidden" name="bot-field" />

            <div><label className="block text-sm font-bold text-white/90 mb-1">1. 성함 *</label><input type="text" name="customer_name" required maxLength={100} placeholder="성함 입력" className="w-full px-4 py-3 rounded-xl border border-navyMuted/50 bg-navyLight text-white placeholder-white/40 focus:ring-2 focus:ring-gold/30" /></div>

            <div><label className="block text-sm font-bold text-white/90 mb-1">2. 연락처 (010-0000-0000) *</label><input type="tel" name="phone_number" required maxLength={100} placeholder="연락처 입력" className="w-full px-4 py-3 rounded-xl border border-navyMuted/50 bg-navyLight text-white placeholder-white/40 focus:ring-2 focus:ring-gold/30" /></div>

            <div><label className="block text-sm font-bold text-white/90 mb-1">3. 학원 / 기관 상호명 *</label><input type="text" name="org_name" required maxLength={2000} placeholder="상호명 입력" className="w-full px-4 py-3 rounded-xl border border-navyMuted/50 bg-navyLight text-white placeholder-white/40 focus:ring-2 focus:ring-gold/30" /></div>

            <div><label className="block text-sm font-bold text-white/90 mb-1">4. 설치할 주소 (정확한 주소) *</label><input type="text" name="address" required maxLength={100} placeholder="주소 입력" className="w-full px-4 py-3 rounded-xl border border-navyMuted/50 bg-navyLight text-white placeholder-white/40 focus:ring-2 focus:ring-gold/30" /></div>

            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">5. 전자칠판 주문 수량 *</label>
              <p className="text-xs text-white/50 mb-2">인치별 대수를 선택하세요.</p>
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="bg-navyLight rounded-xl p-3 border border-navyMuted/50">
                  <span className="block text-xs font-medium text-white/70 mb-1">65인치</span>
                  <select name="qty_65" value={qty65} onChange={(e) => setQty65(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-navyMuted/50 bg-navyLight text-white text-sm">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}대</option>)}
                  </select>
                </div>
                <div className="bg-navyLight rounded-xl p-3 border border-navyMuted/50">
                  <span className="block text-xs font-medium text-white/70 mb-1">75인치</span>
                  <select name="qty_75" value={qty75} onChange={(e) => setQty75(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-navyMuted/50 bg-navyLight text-white text-sm">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}대</option>)}
                  </select>
                </div>
                <div className="bg-navyLight rounded-xl p-3 border border-navyMuted/50">
                  <span className="block text-xs font-medium text-white/70 mb-1">86인치</span>
                  <select name="qty_86" value={qty86} onChange={(e) => setQty86(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-navyMuted/50 bg-navyLight text-white text-sm">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}대</option>)}
                  </select>
                </div>
              </div>
              <input type="text" name="qty_etc" maxLength={200} placeholder="그외 (직접 입력)" className="w-full px-4 py-2 rounded-xl border border-navyMuted/50 bg-navyLight text-white placeholder-white/40 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">6. 설치 방법 *</label>
              <p className="text-xs text-white/50 mb-2">벽부착 시 벽상태 확인이 필요합니다.</p>
              <div className="space-y-2">
                {mountOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-white/90 text-sm">
                    <input type="radio" name="mount_type" value={opt.value} checked={mountType === opt.value} onChange={() => setMountType(opt.value)} className="text-gold accent-gold" />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">7. 엘리베이터 *</label>
              <div className="space-y-2">
                {elevatorOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-white/90 text-sm">
                    <input type="radio" name="elevator" value={opt.value} checked={elevator === opt.value} onChange={() => setElevator(opt.value)} className="text-gold accent-gold" />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">8. 결제 방식 *</label>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-white/90 text-sm">
                    <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => setPayment(opt.value)} className="text-gold accent-gold" />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-navyLight rounded-xl p-4 border border-navyMuted/50">
              <label className="block text-sm font-bold text-white/90 mb-2">9. 개인정보 제3자 제공 동의 *</label>
              <div className="text-xs text-white/60 space-y-1 mb-3">
                <p><strong>제공받는 자:</strong> (주)넥소</p>
                <p><strong>이용 목적:</strong> 마케팅 및 구매안내</p>
                <p><strong>제공 항목:</strong> 이름, 연락처, 상호명, 주소</p>
                <p><strong>보유 및 이용기간:</strong> 접수 후 2년</p>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="privacy-agree" required className="mt-1 accent-gold" />
                <label htmlFor="privacy-agree" className="text-xs text-white/70">위 내용을 확인했으며, 개인정보 제3자 제공에 동의합니다. (필수)</label>
              </div>
            </div>

            <button type="submit" className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent/90 transition">무료 상담 및 견적 신청</button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-navyLight to-navy">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">관계자 전용 특별가, 지금 확인하세요</h2>
          <p className="text-white/80 mb-8">65인치 벽걸이 60개월 할부 시 월 59,400원부터.</p>
          <button
            onClick={scrollToPrice}
            className="bg-accent text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition"
          >
            관계자 전용 특별가 확인하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-navyMuted/50 bg-navy">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-white/60 text-sm">NEXO × 2025 아카데미 美 디자인 공모전</span>
          <div className="flex gap-6 text-sm">
            <a href="https://nexokorea.co.kr" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-gold transition">
              넥소코리아
            </a>
            <a href="tel:032-569-5771" className="text-gold font-semibold">032.569.5771</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

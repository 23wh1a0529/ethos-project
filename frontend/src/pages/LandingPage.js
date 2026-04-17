import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CAROUSEL_ITEMS = [
  { icon: '🔍', title: 'Explainable AI Decisions', desc: 'Every loan or credit decision comes with a plain-language explanation powered by SHAP analysis.' },
  { icon: '⚖️', title: 'Bias & Fairness Monitoring', desc: 'Continuous monitoring detects demographic bias across gender, age, and income groups in real time.' },
  { icon: '🛡️', title: 'Consent Studio', desc: 'Customers control exactly which data categories power their AI decisions — full data sovereignty.' },
  { icon: '📋', title: 'Immutable Audit Trail', desc: 'Every AI decision is logged with timestamp, outcome, fairness score, and consent status for regulators.' },
  { icon: '🎯', title: 'TrustCard Reports', desc: 'Beautiful decision reports with confidence scores, key factors, and actionable improvement suggestions.' },
  { icon: '📊', title: 'Governance Dashboard', desc: 'Admins see model drift, bias alerts, fairness metrics, and consent violations in one unified view.' },
];

const STATS = [
  { value: '99.8%', label: 'Decision Transparency' },
  { value: '<200ms', label: 'Processing Time' },
  { value: '6-Layer', label: 'Governance Checks' },
  { value: 'Zero', label: 'Unexplained Decisions' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Application Submitted', desc: 'Customer submits loan or credit application through the portal.' },
  { step: '02', title: 'AI Model Predicts', desc: 'Bank\'s AI model generates a prediction with probability scores.' },
  { step: '03', title: 'ETHOS Intercepts', desc: 'Governance layer validates consent, runs bias checks, and analyzes features.' },
  { step: '04', title: 'TrustCard Generated', desc: 'Clear explanation delivered to customer with fairness score and suggestions.' },
];

function HeroParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62,146,204,${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(30,80,200,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

function InfiniteCarousel() {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const items = [...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS];

  return (
    <div style={{ overflow: 'hidden', position: 'relative', padding: '8px 0' }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div ref={trackRef} style={{
        display: 'flex', gap: 24,
        animation: paused ? 'none' : 'carouselScroll 28s linear infinite',
        width: 'max-content'
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            width: 300, flexShrink: 0,
            background: 'white', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-100)', padding: '28px 24px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)',
            cursor: 'default'
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 14 }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: 8 }}>{item.title}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes carouselScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

export default function LandingPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #F0F4FA 0%, #E8F0FB 40%, #F0FAF8 100%)'
      }}>
        <HeroParticles />

        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: 'radial-gradient(circle, rgba(0,194,168,0.1) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '3%', width: 400, height: 400, borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%', background: 'radial-gradient(circle, rgba(30,80,200,0.08) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div className="container" style={{ paddingTop: 100, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* Left content */}
            <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,194,168,0.1)', border: '1px solid rgba(0,194,168,0.3)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mint)', animation: 'pulse 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--mint)' }}>AI Governance Platform v2.1</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--navy)', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.03em' }}>
                Trust Every<br />
                <span style={{ color: 'var(--royal)', position: 'relative' }}>
                  AI Decision
                  <svg style={{ position: 'absolute', bottom: -6, left: 0, width: '100%' }} viewBox="0 0 300 12" preserveAspectRatio="none">
                    <path d="M2 10 Q75 2 150 8 Q225 14 298 4" stroke="var(--mint)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span><br />
                <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>You Make.</span>
              </h1>

              <p style={{ fontSize: '1.1rem', color: 'var(--gray-400)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                ETHOS intercepts every AI-driven banking decision, runs 6-layer governance checks, and delivers transparent TrustCard reports — so customers understand, banks comply, and regulators trust.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Start Free Trial
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  View Demo Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--navy)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: TrustCard mockup */}
            <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s' }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', padding: 32, border: '1px solid var(--gray-100)', transform: 'rotate(-2deg)', animation: 'float 6s ease-in-out infinite' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--navy)' }}>TrustCard™ Report</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' }}>ETH-1731234-X9K2</div>
                  </div>
                  <span className="badge badge-approved" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>✓ Approved</span>
                </div>
                {[
                  { label: 'Confidence Score', value: 94, color: 'var(--mint)' },
                  { label: 'Fairness Score', value: 91, color: 'var(--royal)' },
                  { label: 'Credit Score Impact', value: 82, color: 'var(--sky)' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)' }}>{item.label}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--mint)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>Explanation:</span> Approved based on excellent credit score (780), strong income-to-loan ratio (4.2x), and consistent payment history.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {['✓ Consent Validated', '✓ Bias Checked', '✓ Audit Logged'].map(tag => (
                    <span key={tag} style={{ background: 'var(--mint-light)', color: 'var(--mint)', fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 99, fontFamily: 'var(--font-display)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'float 2s ease-in-out infinite' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-300)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* Feature Carousel */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--mint)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Platform Capabilities</div>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--navy)', letterSpacing: '-0.02em' }}>Everything Governance Needs</h2>
          </div>
        </div>
        <InfiniteCarousel />
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--royal)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Workflow</div>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--navy)', letterSpacing: '-0.02em' }}>How ETHOS Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50px', left: '12%', right: '12%', height: 2, background: 'linear-gradient(to right, var(--royal), var(--mint))', opacity: 0.3 }} />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', boxShadow: 'var(--shadow-md)', position: 'relative', zIndex: 1 }}>
                  {step.step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(62,146,204,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,194,168,0.1) 0%, transparent 50%)' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.8rem', color: 'white', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>Ready to Govern Your AI?</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>Join forward-thinking banks using ETHOS to deliver transparent, fair, and auditable AI decisions.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-accent btn-lg">Create Free Account</Link>
            <Link to="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--gray-900)', color: 'white', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="var(--navy-light)" /><path d="M10 18 L18 10 L26 18 L18 26 Z" fill="none" stroke="var(--mint)" strokeWidth="2.5" strokeLinejoin="round"/><circle cx="18" cy="18" r="3" fill="white" /></svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>ETHOS</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>© 2026 ETHOS Platform. Ethical AI Trust Orchestration System.</div>
        </div>
      </footer>
    </div>
  );
}

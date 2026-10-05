import Link from 'next/link';
import { ArrowRight, ShieldCheck, MapPin, Wallet, ArrowUpRight } from 'lucide-react';

export function HowItWorks() {
  return <div className="welcome-page guide-page">
    <div className="page-heading guide-heading">
      <div className="eyebrow">YOUR GUIDE TO EARNAHEAD</div>
      <h1>How EarnAhead works</h1>
      <p>Find paid donor programs, compare the details, and connect directly with providers.</p>
    </div>
    <section className="welcome-process" aria-label="Getting started">
      <div className="welcome-steps">
        {[
          {icon:MapPin,title:'Find programs near you',text:'Search your city or ZIP code and choose plasma, sperm, or egg programs. If your search is empty, we can expand it to 50, then 100 miles.'},
          {icon:Wallet,title:'Compare pay and requirements',text:'See published pay, age requirements, and provider terms. New-donor offers and payments across multiple cycles are clearly labeled. Availability varies by location.'},
          {icon:ArrowUpRight,title:'Apply with the provider',text:'Apply and complete screening on the provider’s website. Save programs and track applications in My activity. Providers handle donations and payments.'},
        ].map(({icon:Icon,...step},i)=><article key={step.title}><div className="guide-step-top"><span className="guide-icon"><Icon size={23}/></span><span className="step-number">STEP 0{i+1}</span></div><h2>{step.title}</h2><p>{step.text}</p></article>)}
      </div>
      <p className="welcome-disclaimer"><ShieldCheck size={17}/>Providers determine final eligibility and compensation. Acceptance and payment are not guaranteed. Review risks and requirements with the provider before participating.</p>
      <div className="guide-next"><div><h2>Ready to explore?</h2><p>Find a program that fits your location and your goals.</p></div><Link className="primary" href="/explore">Explore opportunities <ArrowRight size={18}/></Link></div>
    </section>
  </div>;
}

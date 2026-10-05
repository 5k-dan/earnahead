import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function HowItWorks() {
  return <div className="welcome-page">
    <div className="page-heading">
      <div className="eyebrow">YOUR GUIDE TO EARNAHEAD</div>
      <h1>How EarnAhead works</h1>
      <p>Find paid donor programs, compare the details, and connect directly with providers.</p>
    </div>
    <section className="welcome-process" aria-label="Getting started">
      <div className="welcome-steps">
        {[
          {title:'Find programs near you',text:'Enter your city or ZIP code in Explore. Choose plasma, sperm, or egg programs and set your search radius. Empty searches can expand to 50, then 100 miles.'},
          {title:'Compare pay and requirements',text:'Check published compensation, age requirements, and original provider terms. New-donor promotions and payments across multiple cycles are labeled separately. Local availability varies.'},
          {title:'Apply with the provider',text:'Open the provider website to apply and complete their screening. Save opportunities and track applications in My activity. EarnAhead does not process donations or pay participants.'},
        ].map((step,i)=><article key={step.title}><span className="step-number">0{i+1}</span><h2 style={{fontSize:17,margin:'18px 0 10px'}}>{step.title}</h2><p>{step.text}</p></article>)}
      </div>
      <p className="welcome-disclaimer"><ShieldCheck size={17}/>Providers determine final eligibility and compensation. Acceptance and payment are not guaranteed. Review risks and requirements with the provider before participating.</p>
      <Link className="primary" href="/explore">Explore opportunities <ArrowRight size={16}/></Link>
    </section>
  </div>;
}

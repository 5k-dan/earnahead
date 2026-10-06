import Link from 'next/link';
import {ArrowUpRight,MessageSquare,UserRound,ShieldCheck,Flag} from 'lucide-react';

export function SupportPage(){
 return <section className="support-page">
  <div className="page-heading"><div className="eyebrow">HERE TO HELP</div><h1>Help and support</h1><p>A question, an idea, or something that isn’t working? Find the right place to get help.</p></div>
  <div className="support-feature"><span className="support-icon"><MessageSquare size={25}/></span><div><h2>Help shape EarnAhead</h2><p>Report a bug or share an idea. Tell us what you expected, what happened, and which device or browser you used.</p><a className="primary" href="mailto:danielladipo@gmail.com?subject=EarnAhead%20feedback">Send feedback <ArrowUpRight size={17}/></a><small>Opens your email app. You can also email <a href="mailto:danielladipo@gmail.com">danielladipo@gmail.com</a>.</small></div></div>
  <div className="support-grid">
   <article><UserRound size={23}/><h2>Your account</h2><p>Update your profile, manage your account, or get back in if you’ve forgotten your password.</p><Link href="/profile">Manage your account <ArrowUpRight size={15}/></Link><Link href="/forgot-password">Reset your password <ArrowUpRight size={15}/></Link></article>
   <article><Flag size={23}/><h2>Listing or provider questions</h2><p>Use “Report incorrect information” on an opportunity page to flag a listing. For screening, appointments, or payments, contact the provider through its source link.</p><Link href="/explore">Find your opportunity <ArrowUpRight size={15}/></Link></article>
  </div>
  <div className="support-privacy"><ShieldCheck size={20}/><p>Please leave out passwords, API keys, and health information when contacting us. <Link href="/privacy">Read our privacy notice.</Link></p></div>
  <p className="support-operator">Operated by Daniel Ladipo · Georgia, United States</p>
 </section>;
}

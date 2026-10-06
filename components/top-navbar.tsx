'use client';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight, CircleHelp, Compass, LayoutGrid, Menu, MessageSquare} from 'lucide-react';

const titles:Record<string,string>={landing:'Welcome',explore:'Explore opportunities',dashboard:'My activity',earnings:'Earnings',profile:'My profile',onboarding:'Create your profile',admin:'Provider review',organization:'For organizations','how-it-works':'How it works',login:'Sign in',signup:'Create account',privacy:'Privacy','health-privacy':'Health data privacy',terms:'Terms of use',support:'Support','forgot-password':'Reset password','reset-password':'Reset password'};
export function TopNavbar({page,mobile,onToggle,signedIn,initial}:{page:string;mobile:boolean;onToggle:()=>void;signedIn:boolean;initial:string}){
  return <header className="top-navbar">
    <div className="navbar-context">
      <button className="mobile-menu" onClick={onToggle} aria-label="Toggle menu" aria-expanded={mobile} aria-controls="main-navigation"><Menu size={21}/></button>
      <Link className="mobile-brand" href="/" aria-label="EarnAhead home"><Image src="/branding/earnahead-logo.png" alt="EarnAhead" width={2172} height={724}/></Link>
      <div className="navbar-page"><span className="navbar-page-icon"><Compass size={18}/></span><span>{titles[page]??'EarnAhead'}</span><span className="navbar-access">Early access</span></div>
    </div>
    <nav className="navbar-links" aria-label="Quick links">
      <Link className={'navbar-link'+(page==='how-it-works'?' current':'')} aria-current={page==='how-it-works'?'page':undefined} href="/how-it-works"><CircleHelp size={17}/><span>How it works</span></Link>
      <Link className={'navbar-feedback'+(page==='support'?' current':'')} href="/support"><MessageSquare size={16}/><span>Send feedback</span><ArrowUpRight size={15}/></Link>
    </nav>
    <div className="navbar-account">
      <Link className="navbar-activity" href="/dashboard" aria-label="My activity"><LayoutGrid size={19}/></Link>
      <Link className="header-avatar" href={signedIn?'/profile':'/login'} aria-label={signedIn?'Your profile':'Sign in'}>{initial}</Link>
    </div>
  </header>;
}

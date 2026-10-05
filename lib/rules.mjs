/** @param {number|null} minimum @param {number|null} maximum @param {string|null|undefined} basis */
export function publishedCompensation(minimum,maximum,basis=null){
 if(minimum===null&&maximum===null)return 'Not published';
 const suffix=basis==='PER_MONTH'?' / month':basis==='PER_VISIT'?' / visit':basis==='TOTAL_PROGRAM'?' total':'';
 if(minimum===null)return `Up to $${maximum}${suffix}`;
 if(maximum===null||maximum===minimum)return `$${minimum}${suffix}`;
 return `$${minimum}–$${maximum}${suffix}`;
}
/** @param {string} dob @param {Date} today */
export function ageOn(dob,today=new Date()){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dob))return null;
 const birth=new Date(`${dob}T00:00:00Z`);if(Number.isNaN(birth.valueOf())||birth.toISOString().slice(0,10)!==dob||birth>today)return null;
 let age=today.getUTCFullYear()-birth.getUTCFullYear();
 if(today.getUTCMonth()<birth.getUTCMonth()||(today.getUTCMonth()===birth.getUTCMonth()&&today.getUTCDate()<birth.getUTCDate()))age--;
 return age;
}
/** @param {string|null} dob @param {number} minimum @param {number|null} maximum @param {Date} today */
export function preliminaryAgeMessage(dob,minimum,maximum,today=new Date()){
 const age=dob?ageOn(dob,today):null;
 if(age===null)return 'Add your date of birth in your profile to compare the published age requirements.';
 if(age<minimum)return 'Your age is below the published minimum. You cannot track an application for this listing.';
 if(maximum!==null&&age>maximum)return 'Your age is above the published maximum. Contact the provider about their listed requirements.';
 return 'You may meet the listed preliminary age requirements. Final eligibility is determined by the medical provider.';
}

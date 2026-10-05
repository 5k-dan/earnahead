// Keep production checks from replacing a running development server's cache.
export default function config(phase) {
 return {distDir:phase==='phase-development-server'?'.next-development':'.next-production',poweredByHeader:false,images:{unoptimized:true},async headers(){return [{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(self)'},{key:'Strict-Transport-Security',value:'max-age=31536000'}]}];}};
}

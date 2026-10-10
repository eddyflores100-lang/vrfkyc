import type { NextConfig } from 'next';
const nextConfig: NextConfig = {output:'standalone',reactStrictMode:true,outputFileTracingIncludes:{'/site':['./public/index.html']},async headers(){return [{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'no-referrer'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}]}]}};
export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental : {
    ppr: 'incremental',
  },
  //incremental value allows us adopt PPR for specific routes.
  //Next, add the experimental_ppr segment config option toyou dashboard layout 
  
};

module.exports = nextConfig;

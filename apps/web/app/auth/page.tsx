import React from 'react';
import Auth from '@/components/authentication/auth';
function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <section>
        <h1 className="font-extrabold text-6xl">LOGIN</h1>
        <Auth />
      </section>
    </div>
  );
}

export default page;

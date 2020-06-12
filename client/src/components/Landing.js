import React from 'react';

const Landing = () => {
  return (
    <div className='flex items-center justify-center content-area '>
      <div className='text-center  bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10'>
        <h1 className='text-5xl text-center mb-5'>Social-Alerts</h1>
        <a
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          href='/auth/streamlabs/authorize'
        >
          Login w/ Streamlabs
        </a>
      </div>
    </div>
  );
};

export default Landing;

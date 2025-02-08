import React from 'react';
import SpaceBackground from '../components/space-background';
import Levels from './LevelPage';
const AdminPage = ()=>{
    return(
      <div className="relative">
        <div className="absolute inset-0">

        <SpaceBackground/>
        </div>
        <div className='container mx-auto px-4 py-8 relative '>
          <h1 className='text-4xl font-bold text-white text-center mb-8 ' >Admin Dashboard</h1>
          {/* show all levels */}
          <Levels/>
        </div>
      </div>
    )
}
export default AdminPage;

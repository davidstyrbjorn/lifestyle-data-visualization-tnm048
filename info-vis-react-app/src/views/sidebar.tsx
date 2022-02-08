import React from 'react';

const Sidebar: React.FC<{}> = () => {
    return (
        <div className='sidebar'>
            <div className='top'>
                <p>Top side!</p>
            </div>  
            <div className='bot'>
                <p>Bot side!</p>
            </div>  
        </div>
    );
}

export default Sidebar;
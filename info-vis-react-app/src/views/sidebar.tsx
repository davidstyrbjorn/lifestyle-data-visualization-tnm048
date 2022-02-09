import React from 'react';
import AttributeList from '../components/AttributeList';

const Sidebar: React.FC<{}> = () => {
    return (
        <div className='sidebar'>
            <div className='top'>
                <p>Top side!</p>
                <AttributeList/>
            </div>  
            <div className='bot'>
                <p>Bot side!</p>
            </div>  
        </div>
    );
}

export default Sidebar;
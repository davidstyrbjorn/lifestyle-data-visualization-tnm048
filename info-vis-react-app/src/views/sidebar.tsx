import React from 'react';
import AttributeList from '../components/AttributeList';
import { PersonList } from '../components/PersonList';

const Sidebar: React.FC<{}> = () => {
    return (
        <div className='sidebar'>
            <div className='top'>
                <AttributeList/>
            </div>  
            <div className='bot'>
                <PersonList/>
            </div>  
        </div>
    );
}

export default Sidebar;
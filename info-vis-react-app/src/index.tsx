import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import './index.css';
import Root from './views/root';

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<Root/>
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById('root')
);
import React from 'react';
import { Button } from 'antd';
import { createBrowserHistory, createHashHistory } from 'history';
import { isElectron } from '../utils';

const Header = () => {

    const history = isElectron() ? createHashHistory() : createBrowserHistory();

    const logout = () => {
        localStorage.removeItem('user');
        history.push('/login');
        let pathUrl = window.location.href;
        window.location.href = pathUrl;
    }

    return (
        <div className="header">
            <img src="logo.png" width="100" />
            <p className="header-text">Hello, {localStorage.getItem('user')} !!!</p>
            <Button
                type="text"
                style={{ color: '#0044aa', fontWeight: 'bold' }}
                onClick={logout}
            >
                Log Out
            </Button>
        </div>
    );  

};

export default Header;
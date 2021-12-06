import React from 'react';
import { Button, Space } from 'antd';
import { createBrowserHistory, createHashHistory } from 'history';
import { isElectron } from '../utils';

const Header = () => {

    const history = isElectron() ? createHashHistory() : createBrowserHistory();

    const goHome = () => {
        history.push('/');
        let pathUrl = window.location.href;
        window.location.href = pathUrl;
    }

    const viewLog = () => {
        history.push('/view-log');
        let pathUrl = window.location.href;
        window.location.href = pathUrl;
    }

    const changePassword = () => {
        history.push('/change-password');
        let pathUrl = window.location.href;
        window.location.href = pathUrl;
    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        history.push('/login');
        let pathUrl = window.location.href;
        window.location.href = pathUrl;
    }

    console.log(window.location.href);

    return (
        <div className="header">
            <img src="logo.png" alt="logo" width="100" />
            <p className="header-text">Hello, {localStorage.getItem('user')} !!!</p>
            <Space>
                <Button
                    type="text"
                    style={{ color: '#0044aa', fontWeight: 'bold' }}
                    onClick={goHome}
                >
                    Home
                </Button>
                {
                    localStorage.getItem('admin') === 'true' ?
                        <Button
                            type="text"
                            style={{ color: '#0044aa', fontWeight: 'bold' }}
                            onClick={viewLog}
                        >
                            View Log
                        </Button>
                        : null
                }
                <Button
                    type="text"
                    style={{ color: '#0044aa', fontWeight: 'bold' }}
                    onClick={changePassword}
                >
                    Change password
                </Button>
                <Button
                    type="text"
                    style={{ color: '#0044aa', fontWeight: 'bold' }}
                    onClick={logout}
                >
                    Log Out
                </Button>
            </Space>
        </div>
    );

};

export default Header;

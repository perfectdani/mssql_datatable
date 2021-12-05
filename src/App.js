import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory, createHashHistory } from 'history';
import { isElectron } from './utils';
import Home from './component/home';
import Log from './component/log';
import Password from './component/password';
import Login from './component/login';

function App() {

    const history = isElectron() ? createHashHistory() : createBrowserHistory();

    return (
        <div className="App">
            <Router history={history}>
                <Switch>
                    <Route path='/' exact>
                        <Home />
                    </Route>
                    <Route path='/log' exact>
                        <Log />
                    </Route>
                    <Route path='/password' exact>
                        <Password />
                    </Route>
                    <Route path='/login' exact>
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;

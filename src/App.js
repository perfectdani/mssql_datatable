import React from 'react';
import Tab from './component/tab.js';
import Content from './component/content.js';
import './App.css';

function App() {

    const [nowTab, setNowTab] = React.useState(null);

    const handleTab = (tab) => {
        setNowTab(tab);
    }

    return (
        <div className="App">
            <Tab handleTab={handleTab} nowTab={nowTab} />
            <Content nowTab={nowTab} />
        </div>
    );
}

export default App;

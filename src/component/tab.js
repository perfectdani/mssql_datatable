import React from 'react';

const Tab = (props) => {

    const [tabList, setTabList] = React.useState(null);

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API}/getTables`)
            .then(res => res.json()).then((result) => {
                let arr = result.data.map((item)=>item.TABLE_NAME)
                setTabList(arr);
                props.handleTab(arr[0]);
            },
            (error) => {
                console.log(error);
            }
        );
    },[]);

    return (
        <div className="tabs">
            {
                tabList?.map((tab, index) => {
                    return <div
                        key={index}
                        className={tab === props.nowTab ? 'tab activeTab' : 'tab'}
                        onClick={() => props.handleTab(tab)}
                    >
                        {tab}
                    </div>;
                })
            }
        </div>
    );

};

export default Tab;
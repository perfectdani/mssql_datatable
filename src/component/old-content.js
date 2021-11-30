import React from "react";
import { Table, Space, Popconfirm, Button } from 'antd';

const Content = (props) => {
    
    const [insertFlag, setInsertFlag] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const [content, setContent] = React.useState(null);
    const [header, setHeader] = React.useState(null);
    const [columns, setColumns] = React.useState(null);
    const [pagination, setPagenation] = React.useState({
        current: 1,
        pageSize: 10,
    });

    const getContent = () => {
        fetch(`${process.env.REACT_APP_API}/getContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: props.nowTab })
        }).then(res => res.json()).then((result) => {
            setContent(result.data);
            let arr = {};
            for (const key in result.data[0]) {
                if (key != 'Id') {
                    arr[key] = '';
                }
            }
            arr['Id'] = 0;
            setHeader(arr);
        });
    }

    const insertRow = () => {
        setPagenation({...pagination, current: 1});
        setContent([header, ...content]);
        setInsertFlag(true);
    }

    const createRow = () => {
        let data = {};
        const dom = document.getElementsByTagName('input');
        for (let i = 0; i < dom.length; i++) {
            if (dom[i].name) {
                data[dom[i].name] = dom[i].value;
            }
        }
        fetch(`${process.env.REACT_APP_API}/createRow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: props.nowTab, data })
        }).then(res => res.json()).then((result) => {
            if (result.message == 'Success') {
                getContent();
                setInsertFlag(false);
            }
        });
    }

    const createCancel = () => {
        let arr = [];
        content.map((item)=>{
            if(item.Id) {
                arr = [...arr, item];
            }
        })
        setContent(arr);
        setInsertFlag(false);
    }

    const deleteRow = (id) => {
        fetch(`${process.env.REACT_APP_API}/deleteRow`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: props.nowTab, id })
        }).then(res => res.json()).then((result) => {
            if (result.message == 'Success') {
                getContent();
            }
        });
    }

    const editRow = (id) => {
        setEditId(id);
    }

    const updateRow = () => {
        let data = {};
        const dom = document.getElementsByTagName('input');
        for (let i = 0; i < dom.length; i++) {
            if (dom[i].name) {
                data[dom[i].name] = dom[i].value;
            }
        }
        fetch(`${process.env.REACT_APP_API}/updateRow`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: props.nowTab, editId, data })
        }).then(res => res.json()).then((result) => {
            if (result.message == 'Success') {
                getContent();
                setEditId(null);
            }
        });
    }

    React.useEffect(() => {
        if (props.nowTab) {
            getContent();
        }
    }, [props.nowTab, ]);

    React.useEffect(() => {
        if (content) {
            let arr = [];
            for (const key in content[0]) {
                if (key != 'Id') {
                    arr = [...arr, {
                        title: key,
                        dataIndex: key,
                        /* eslint-disable */
                        render: (_, elm) => (
                            elm.Id ?
                                elm.Id == editId ?
                                    <input type="text" name={key} defaultValue={elm[key]} style={{ textAlign: 'center'}} />
                                : elm[key]
                            : <input type="text" name={key} style={{ textAlign: 'center'}} />
                        ),
                        /* eslint-enable */
                    }];
                }
            }
            arr = [...arr, {
                title: 'Actions',
                dataIndex: 'actions',
                fixed: 'right',
                /* eslint-disable */
                render: (_, elm) => (
                    elm.Id ? 
                        <Space>
                            {
                                elm.Id == editId ? 
                                    <Button size="small" onClick={updateRow}>Update</Button>
                                : <Button type="primary" size="small" onClick={() => { editRow(elm.Id) }}>Edit</Button>
                            }
                            <Popconfirm
                                placement="left"
                                title="Are you deleting this Item?"
                                onConfirm={() => { deleteRow(elm.Id, content) }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger size="small">Delete</Button>
                            </Popconfirm>
                        </Space>
                    :<Space>
                        <Button size="small" onClick={createRow}>Create</Button>
                        <Button danger size="small" onClick={createCancel}>Cancel</Button>
                    </Space>
                ),
                /* eslint-enable */
            }];
            setColumns(arr);
        }
    }, [content, editId]);

    const handleTableChange = (params) => {
        setPagenation(params.pagination);
    };

    return (
        <div className="content">
            <Button type="primary" className="insert" disabled={insertFlag} onClick={insertRow}>Insert</Button>
            <Table
                bordered
                rowKey="Id"
                columns={columns}
                dataSource={content}
                pagination={pagination}
                onChange={handleTableChange}
            />
        </div>
    );

};

export default Content;
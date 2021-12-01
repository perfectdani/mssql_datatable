import React from "react";
import Highlighter from 'react-highlight-words';
import { Table, Space, Popconfirm, Button, Input } from 'antd';
import { blue } from '@ant-design/colors';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const Content = (props) => {

    const [tableWidth, setTableWidth] = React.useState(null);
    const [talbleHeight, setTableHeight] = React.useState(window.innerHeight-230);
    const [insertFlag, setInsertFlag] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const [content, setContent] = React.useState(null);
    const [header, setHeader] = React.useState(null);
    const [columns, setColumns] = React.useState(null);
    const [pagination, setPagenation] = React.useState({
        current: 1,
        pageSize: 10,
        position: ['topLeft', 'none']
    });
    const [filteredInfo, setFilteredInfo] = React.useState({});
    const [sortedInfo, setSortedInfo] = React.useState({});
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');

    const allReset = () => {
        setPagenation({ ...pagination, current: 1 });
        setFilteredInfo({});
        setSearchText('')
        setSortedInfo({});
        setInsertFlag(false);
        setEditId(null);
    }

    const getContent = () => {
        fetch(`${process.env.REACT_APP_API}/getContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: props.nowTab })
        }).then(res => res.json()).then((result) => {
            setContent(result.data);
            let arr = {};
            for (const key in result.data[0]) {
                if (key !== 'Id') {
                    arr[key] = '';
                }
            }
            arr['Id'] = 0;
            setHeader(arr);
        });
    }

    const insertRow = () => {
        allReset();
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
            if (result.message === 'Success') {
                getContent();
                setInsertFlag(false);
            }
        });
    }

    const createCancel = () => {
        let arr = [];
        content.map((item) => {
            if (item.Id) {
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
            if (result.message === 'Success') {
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
            if (result.message === 'Success') {
                getContent();
                setEditId(null);
            }
        });
    }

    const updateCancel = () => {
        setEditId(null);
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagenation(pagination);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const tableSorter = (a, b, key) => {
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
            return a[key] - b[key];
        }
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
            a = a[key].toLowerCase();
            b = b[key].toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        }
        return 0;
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        render: (_, elm) => (
            elm.Id ?
                elm.Id == editId ?
                    <Input type="text" name={dataIndex} defaultValue={elm[dataIndex]} style={{ textAlign: 'center' }} />
                    : searchedColumn === dataIndex ? (
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={elm[dataIndex] ? elm[dataIndex].toString() : ''}
                        />
                    ) : (
                        elm[dataIndex]
                    )
                : <Input type="text" name={dataIndex} style={{ textAlign: 'center' }} />
        ),
        /* eslint-enable */
    });

    React.useEffect(() => {
        if (props.nowTab) {
            allReset();
            getContent();
        }
    }, [props.nowTab,]);

    React.useEffect(() => {
        if (content) {
            let arr = [];
            for (const key in content[0]) {
                if (key !== 'Id') {
                    arr = [...arr, {
                        title: key,
                        dataIndex: key,
                        key: key,
                        filteredValue: filteredInfo[key] || null,
                        sorter: (a, b) => tableSorter(a, b, key),
                        sortOrder: sortedInfo?.columnKey === key && sortedInfo?.order,
                        ...getColumnSearchProps(key)
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
                                    <Space>
                                        <Button type="text" size="small" style={{ color: blue.primary }} icon={<CheckOutlined />} onClick={updateRow} />
                                        <Button danger type="text" size="small" icon={<CloseOutlined />} onClick={updateCancel} />
                                    </Space>
                                    : <Space>
                                        <Button type="text" size="small" style={{ color: blue.primary }} icon={<EditOutlined />} onClick={() => { editRow(elm.Id) }} />
                                        <Popconfirm
                                            placement="left"
                                            title="Are you deleting this row?"
                                            onConfirm={() => { deleteRow(elm.Id, content) }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    </Space>
                            }
                        </Space>
                        : <Space>
                            <Button type="text" size="small" style={{ color: 'green' }} icon={<CheckOutlined />} onClick={createRow} />
                            <Button danger type="text" size="small" icon={<CloseOutlined />} onClick={createCancel} />
                        </Space>
                ),
                /* eslint-enable */
            }];
            setColumns(arr);
            setTableWidth(arr.length*150);
        }
    }, [content, sortedInfo, filteredInfo, editId]);
    
    const handleResize = () => {
        setTableHeight(window.innerHeight-230);
    }
    
    window.addEventListener("resize", handleResize);

    return (
        <React.Fragment>
            {
                props.nowTab &&
                <Button type="primary" className="insert" disabled={insertFlag} onClick={insertRow} icon={<PlusOutlined />}>New</Button>
            }
            <Table
                bordered
                rowKey="Id"
                columns={columns}
                dataSource={content}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: tableWidth, y: talbleHeight }}
            />
        </React.Fragment>
    );
};

export default Content;
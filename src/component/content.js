import React from 'react';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective, RangeDirective, getRangeAddress } from '@syncfusion/ej2-react-spreadsheet';

const Content = (props) => {

    const ssRef = React.useRef();
    const [data, setData] = React.useState([]);

    const dataSave = () => {
        ssRef.current.showSpinner();
        let usedRowIdx = ssRef.current.getActiveSheet().usedRange.rowIndex;
        let usedColIdx = ssRef.current.getActiveSheet().usedRange.colIndex;
        let arr = [];
        let row = [];
        let j = 0;
        ssRef.current.getData(getRangeAddress([0, 0, usedRowIdx, usedColIdx])).then((cells) => {
            cells.forEach((cell, key) => {
                if (j > usedColIdx) {
                    arr = [...arr, row];
                    row = [];
                    j = 0;
                }
                row = [...row, cell.value]; 
                j++;
            })
            fetch(`${process.env.REACT_APP_API}/save-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table: props.nowTab, data: arr })
            }).then(res => res.json()).then((result) => {
                if (result.message === 'success') {
                    ssRef.current.hideSpinner();
                }
            });
        });
    }

    const onCreated = React.useCallback(() => {
        ssRef.current.hideFileMenuItems(["File"], true);
    }, [ssRef]);

    React.useEffect(() => {
        if (props.nowTab) {
            ssRef.current.showSpinner();
            fetch(`${process.env.REACT_APP_API}/get-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table: props.nowTab })
            }).then(res => res.json()).then((result) => {
                if (result.message === 'success') {
                    let activeRowIndex = ssRef.current.getActiveSheet().usedRange.rowIndex;
                    let activeColIndex = ssRef.current.getActiveSheet().usedRange.colIndex;
                    let colSTR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    if (activeRowIndex) {
                        let colID;
                        if (activeColIndex < 26) {
                            colID = colSTR[activeColIndex];
                        } else {
                            let a = parseInt(activeColIndex / 26);
                            let b = (activeColIndex % 26);
                            colID = `${colSTR[a - 1]}${colSTR[b]}`;
                        }
                        ssRef.current.clear({ type: 'Clear All', range: `A1:${colID}${activeRowIndex + 1}` });
                        ssRef.current.selectRange(getRangeAddress([1, 0, 1, 0]));
                    }
                    setData(result.data);
                    let newCols = Object.keys(result.data[0]).length;
                    let nweColID;
                    if (newCols < 26) {
                        nweColID = colSTR[newCols];
                    } else {
                        let c = parseInt(newCols / 26);
                        let d = (newCols % 26);
                        nweColID = `${colSTR[c - 1]}${colSTR[d]}`;
                    }
                    ssRef.current.cellFormat({ fontWeight: 'bold', textAlign:'center' }, `A1:${nweColID}1`);
                    ssRef.current.hideSpinner();
                }
            });
        }
    }, [props.nowTab]);

    return (
        <React.Fragment>
            {
                props.nowTab && <Button type="primary" className="save" onClick={dataSave} icon={<SaveOutlined />}>Save</Button>
            }
            <SpreadsheetComponent showSheetTabs={false} ref={ssRef} created={onCreated}>
                <SheetsDirective>
                    <SheetDirective frozenRows={1}>
                        <RangesDirective>
                            <RangeDirective dataSource={data} showFieldAsHeader={true} />
                        </RangesDirective>
                    </SheetDirective>
                </SheetsDirective>
            </SpreadsheetComponent>
        </React.Fragment>
    );
};

export default Content;

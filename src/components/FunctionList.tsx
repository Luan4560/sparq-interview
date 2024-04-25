import React, { useState } from 'react';
import ABI from '../interfaces/ABIinterface';

interface Props {
    functions: ABI[];
    onFunctionCall: (name: string, type: string, inputs: string[]) => void;
}

const FunctionList: React.FC<Props> = ({ functions, onFunctionCall }) => {

    const [inputValues, setInputValues] = useState<{ [key: string]: string[] }>({});

    function getState(a: any) {
        if (a == 'pure' || a == 'view') {
            return { type: 'read', color: 'btn btn-primary' }
        }
        else if (a == 'nonpayable') {
            return { type: 'write', color: 'btn btn-warning' }
        }
        else {
            return { type: 'write', color: 'btn btn-danger' }
        }
    }

    const changeValue = (event: React.ChangeEvent<HTMLInputElement>, funcName: string, index: number) => {
        const newInputValues = { ...inputValues };
        if (!newInputValues[funcName]) {
            newInputValues[funcName] = [];
        }
        newInputValues[funcName][index] = event.target.value;
        setInputValues(newInputValues);
    }

    return (
        <div>
            <h2>Contract Functions</h2>
            <ul>
                {functions.map((func, index) => (
                    <li key={index} className='mb-3'>
                        {func.type === 'function' && (
                            // @ts-ignore
                            <button className={getState(func.stateMutability)?.color} style={{ padding: '3px' }} onClick={() => onFunctionCall(func.name, getState(func.stateMutability)?.type, inputValues[func.name] || [])}>{func.name}</button>
                        )}
                        {func.inputs?.length !== 0 &&
                            func.inputs?.map((ele, index) => (
                                // @ts-ignore
                                <input className='ms-1' key={index} placeholder={ele.type + ' ' + ele.name} onChange={(e) => changeValue(e, func.name, index)}></input>
                            ))}
                        {' '}({getState(func.stateMutability)?.type})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FunctionList;

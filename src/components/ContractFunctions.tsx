import React from 'react';
import FunctionList from './FunctionList';
import ABI from '../interfaces/ABIinterface';

interface Props {
  handleFunctionCall: (name: string, type: string, inputs: string[]) => void;
  abi: ABI[]
}

const ContractFunctions: React.FC<Props> = ({handleFunctionCall, abi}) => {

  const functions = abi.filter((item) => item.type === 'function' && item.name !== undefined);

  return (
    <>
      <FunctionList functions={functions} onFunctionCall={handleFunctionCall} />
    </>
  );
};

export default ContractFunctions;

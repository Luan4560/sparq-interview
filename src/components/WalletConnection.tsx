// WalletConnection.tsx
import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import ContractFunctions from './ContractFunctions';
import Web3 from 'web3';
import ABI from '../interfaces/ABIinterface';

const WalletConnection: React.FC = () => {
    const web3 = new Web3('https://eth-mainnet.g.alchemy.com/v2/IQkFA7htEIellTFKgMectnMjSyNS_RoV');
    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const { disconnect } = useDisconnect()
    const [contractAddress, setContractAddress] = useState<string>('');
    const [abi, setABI] = useState<ABI[]>([]);
    const [response, setResponse] = useState('');
    let ContractInstance: any;
    web3.eth.defaultAccount = account.address;

    const handleContractABI = () => {
        ContractInstance = new web3.eth.Contract(abi, contractAddress);
    }

    const handleABIChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setABI(JSON.parse(event.target.value));
        handleContractABI();
    };

    const handleContractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContractAddress(event.target.value);
        handleContractABI();
    }

    const handleCall = (name: string, type: string, inputs: string[]) => {
        handleContractABI();
        // @ts-ignore
        const method = ContractInstance.methods[name](...inputs);

        if (type == 'read') {
            method.call()
                .then((result: any) => {
                    console.log('Response:', result);
                    setResponse(result.toString())
                })
                // @ts-ignore
                .catch(err => {
                    console.error('Error:', err);
                });
        }
        else {
            method.send({ from: account.address })
                .then((result: any) => {
                    console.log('Response:', result);
                    setResponse(result.toString())
                })
                // @ts-ignore
                .catch(err => {
                    console.error('Error:', err);
                });
        }
    }

    return (
        <>
            <div>
                <h2>Account</h2>

                <div>
                    status: {account.status}
                    <br />
                    address: {account.address}
                    <br />
                    chainId: {account.chainId}
                </div>

                {account.status === 'connected' && (
                    <button className='btn btn-danger' type="button" onClick={() => disconnect()}>
                        Disconnect
                    </button>
                )}
            </div>

            <div>
                <h2>Connect with:</h2>
                {connectors.map((connector) => (
                    <button
                        className='btn btn-primary mx-2 my-1'
                        key={connector.uid}
                        onClick={() => connect({ connector })}
                        type="button"
                    >
                        {connector.name}
                    </button>
                ))}
                <div className='d-flex'>
                    <p className='me-2'>Transaction status:</p>
                    <div>{status}</div>
                    <div>{error?.message}</div>
                </div>
                <div className='d-flex'>
                    <p className='me-2'>Result:</p>
                    <b>{response}</b>
                </div>
            </div>
            <div className='mb-3'>Contract Address:
                <input className='ms-2' type='text' onChange={handleContractChange}></input>
            </div>
            <div>
                <textarea className='form-control' placeholder="Enter ABI JSON here" onChange={handleABIChange} />
                <button className='btn btn-primary' onClick={handleContractABI}>Load ABI</button>
            </div>

            <ContractFunctions handleFunctionCall={handleCall} abi={abi} />
        </>
    );
};

export default WalletConnection;

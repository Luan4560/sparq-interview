interface ABI {
    type: string;
    name?: string;
    stateMutability?: string;
    anonymous?: boolean;
    inputs?: { indexed?: boolean; internalType: string; name: string; type: string }[];
    outputs?: { internalType: string; name: string; type: string }[];
}

export default ABI;
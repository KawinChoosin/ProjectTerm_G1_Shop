import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface QRGenProps {
    amount: number;  // Accept amount as a prop
}

const QRGen: React.FC<QRGenProps> = ({ amount }) => {
    const [qrImage, setQrImage] = useState<string>('');

    const genQR = async () => {
        try {
            const response = await axios.post('http://localhost:3000/order/generateQR', {
                amount: amount,  // Use the amount passed as a prop
            });
            console.log('good', response.data);
            setQrImage(response.data.Result);
        } catch (error) {
            console.error('bad', error);
        }
    };

    // Generate the QR code as soon as the component mounts or the amount changes
    useEffect(() => {
        if (amount) {
            genQR();
        }
    }, [amount]);  // Re-run when the amount changes

    return (
        <div>
            {qrImage && <img src={qrImage} alt="QR Code" style={{ width: '350px', objectFit: 'contain' }} />}
        </div>
    );
};

export default QRGen;

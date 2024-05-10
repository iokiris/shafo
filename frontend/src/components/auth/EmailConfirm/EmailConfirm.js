import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Exception from '../../exceptions/Exception';
import EmailConfirmedSVG from '../../../media/svg/Email/EmailConfirmedSVG';
import CentralizedBox from '../../box/CentralizedBox/CentralizedBox';

const EmailConfirm = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        axios.get(`/auth/confirm_email/${token}`)
            .then(response => {
                setStatus('success');
            })
            .catch(error => {
                console.error('Ошибка подтверждения Email', error);
                setStatus('error');
            });
    }, [token]);
    
    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <p>Подтверждение Email...</p>;
            case 'success':
                return (
                    <CentralizedBox>
                        {<EmailConfirmedSVG />}
                        <p>Email успешно подтвержден!</p>
                        <a href="/auth">Перейти к авторизации</a>
                    </CentralizedBox>
                );
            case 'error':
                return (
                    <Exception />
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {renderContent()}
        </div>
    );
};

export default EmailConfirm;

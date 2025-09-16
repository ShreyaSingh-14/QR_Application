// qr.tsx
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import QRCodeScreen from '../components/QRCodeScreen'; // Adjust path as needed

const QRRoute: React.FC = () => {
  const params = useLocalSearchParams();
  
  // Extract parameters from URL
  const userId = params.userId as string || 'default_user';
  const businessName = params.businessName as string || 'Default Business';
  const uniqueId = params.uniqueId as string || 'default_id';
  const qrLink = params.qrLink as string || `https://scantowall.com/business/${uniqueId}`;
  const fullName = params.fullName as string;
  const phoneNumber = params.phoneNumber as string;
  const email = params.email as string;

  console.log('QR Page received params:', {
    userId,
    businessName,
    uniqueId,
    qrLink,
    fullName,
    phoneNumber,
    email
  });

  return (
    <QRCodeScreen 
      userId={userId}
      businessName={businessName}
      uniqueId={uniqueId}
      qrLink={qrLink}
      fullName={fullName}
      phoneNumber={phoneNumber}
      email={email}
    />
  );
};

export default QRRoute;
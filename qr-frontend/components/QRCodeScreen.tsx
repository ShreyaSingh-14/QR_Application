import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

interface QRCodeScreenProps {
  userId?: string;
  businessName?: string;
  uniqueId?: string;
  qrLink?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

const QRCodeScreen: React.FC<QRCodeScreenProps> = ({
  userId = 'user123',
  businessName = 'Verma pure veg Elite dine Restaurant',
  uniqueId = 'raj_verma_45',
  qrLink,
  fullName,
  phoneNumber,
  email,
}) => {
  const [qrValue, setQrValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = useRef<View>(null);

  // Generate unique QR code URL for the user
  useEffect(() => {
    const generateQRValue = () => {
      // Use provided qrLink or generate a unique URL
      let generatedQRValue;
      
      if (qrLink) {
        generatedQRValue = qrLink;
      } else {
        const baseUrl = 'https://scantowall.com/business/';
        generatedQRValue = `${baseUrl}${uniqueId}?userId=${userId}`;
      }
      
      console.log('Generated QR Value:', generatedQRValue);
      setQrValue(generatedQRValue);
    };

    generateQRValue();
  }, [userId, uniqueId, qrLink]);

  const requestMediaLibraryPermissions = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Check if QR ref is available
      if (!qrRef.current) {
        throw new Error('QR code reference not available');
      }

      // Capture the QR code as image
      const uri = await captureRef(qrRef.current, {
        format: 'png',
        quality: 1,
        width: 300,
        height: 300,
      });

      // Request permissions for saving to media library
      const hasPermission = await requestMediaLibraryPermissions();
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'We need permission to save images to your photo library. You can also share the QR code instead.',
          [
            { text: 'Share Instead', onPress: handleShare },
            { text: 'OK', style: 'cancel' }
          ]
        );
        return;
      }

      // Create a filename with timestamp
      const fileName = `QR_${uniqueId}_${Date.now()}.png`;
      const fileUri = `${(FileSystem as any)}${fileName}`;

      // Copy the captured image to file system
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      // Save to media library (photo gallery)
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      
      // Optionally create an album
      const album = await MediaLibrary.getAlbumAsync('QR Codes');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert(
        'Success!',
        'QR code has been saved to your photo gallery in the "QR Codes" album.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Failed',
        'Could not save QR code. Try sharing instead.',
        [
          { text: 'Share', onPress: handleShare },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsLoading(true);

      // Check if QR ref is available
      if (!qrRef.current) {
        throw new Error('QR code reference not available');
      }

      // Capture the QR code as image
      const uri = await captureRef(qrRef.current, {
        format: 'png',
        quality: 1,
        width: 600,
        height: 600,
      });

      // Create HTML content for printing
      const htmlContent = `
        <html>
          <head>
            <title>QR Code - ${businessName}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .qr-container {
                margin: 20px auto;
                max-width: 400px;
              }
              .business-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
              }
              .description {
                font-size: 16px;
                margin-bottom: 20px;
                color: #666;
              }
              .qr-image {
                width: 300px;
                height: 300px;
                margin: 20px auto;
                border: 1px solid #ddd;
              }
              .url {
                font-size: 12px;
                color: #999;
                word-break: break-all;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="business-name">${businessName}</div>
              <div class="description">Scan to visit our business page</div>
              <img src="data:image/png;base64,${await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })}" class="qr-image" />
              <div class="url">${qrValue}</div>
            </div>
          </body>
        </html>
      `;

      await Print.printAsync({
        html: htmlContent,
        width: 612,
        height: 792,
      });

    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Print Error', 'Could not print QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);

      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
        return;
      }

      // Check if QR ref is available
      if (!qrRef.current) {
        throw new Error('QR code reference not available');
      }

      // Capture the QR code as image
      const uri = await captureRef(qrRef.current, {
        format: 'png',
        quality: 1,
        width: 600,
        height: 600,
      });

      // Create a temporary file
      const fileName = `QR_${uniqueId}_${Date.now()}.png`;
      const fileUri = `${(FileSystem as any).cacheDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/png',
        dialogTitle: `Share QR Code - ${businessName}`,
      });

    } catch (error) {
      console.error('Share error:', error);
      
      // Fallback to text sharing
      try {
        await Share.share({
          title: 'My Business QR Code',
          message: `Scan this QR code to visit ${businessName}!\n\n${qrValue}`,
        });
      } catch (fallbackError) {
        Alert.alert('Error', 'Failed to share QR code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>QR code</Text>
          <Text style={styles.headerSubtitle}>
            Download, print and share your QR code here
          </Text>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrCardInner}>
            <Text style={styles.scanTitle}>Scan to Visit</Text>
            <Text style={styles.businessDescription}>
              {fullName ? `Welcome to ${fullName}'s business!` : 'Share this QR code with your customers to let them easily visit your business page.'}
            </Text>
            
            {/* QR Code Container */}
            <View 
              style={styles.qrContainer}
              ref={qrRef}
              collapsable={false}
            >
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={180}
                  color="black"
                  backgroundColor="white"
                  logoBackgroundColor="transparent"
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Text>Generating QR Code...</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, isLoading && styles.disabledButton]} 
            onPress={handleDownload}
            disabled={isLoading}
          >
            <Text style={styles.actionIcon}>⬇️</Text>
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, isLoading && styles.disabledButton]} 
            onPress={handlePrint}
            disabled={isLoading}
          >
            <Text style={styles.actionIcon}>🖨️</Text>
            <Text style={styles.actionText}>Print</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, isLoading && styles.disabledButton]} 
            onPress={handleShare}
            disabled={isLoading}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code URL Display */}
        <View style={styles.urlContainer}>
          <Text style={styles.urlLabel}>QR Code Link:</Text>
          <Text style={styles.urlText} numberOfLines={2}>
            {qrValue}
          </Text>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  qrCard: {
    margin: 16,
    backgroundColor: '#1e7a7a',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrCardInner: {
    alignItems: 'center',
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  businessDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e7a7a',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 16,
    color: '#1e7a7a',
    fontWeight: '600',
  },
  urlContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    color: '#1e7a7a',
    fontFamily: 'monospace',
  },
  
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeNavItem: {
    backgroundColor: '#1e7a7a',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  navIcon: {
    fontSize: 16,
    color: '#999',
  },
  activeNavIcon: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
});

export default QRCodeScreen;
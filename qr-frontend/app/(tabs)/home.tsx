import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

export default function Index() {
  const qrRef = useRef<View>(null);
  const predefinedLink = "https://example.com";
  const [qrBase64, setQrBase64] = useState<string>("");

  const generatePDF = async () => {
    try {
      if (!qrBase64) {
        Alert.alert("Error", "QR code is not ready yet. Please wait a moment.");
        return "";
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>QR Code</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; margin: 0; }
            .header { margin-bottom: 30px; }
            .title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .subtitle { font-size: 16px; color: #666; margin-bottom: 40px; }
            .qr-container { background: #008080; border-radius: 20px; padding: 30px; display: inline-block; margin: 20px 0; }
            .qr-title { color: white; font-size: 18px; font-weight: 600; margin-bottom: 10px; }
            .qr-desc { color: white; font-size: 14px; margin-bottom: 20px; opacity: 0.9; }
            .qr-code { background: white; border-radius: 16px; padding: 20px; display: inline-block; }
            .qr-code img { display: block; margin: 0 auto; }
            .footer { margin-top: 40px; font-size: 12px; color: #999; }
            .url { margin-top: 20px; font-size: 14px; color: #008080; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">QR Code</div>
            <div class="subtitle">Scan to visit the link below</div>
          </div>
          <div class="qr-container">
            <div class="qr-title">Scan to Visit</div>
            <div class="qr-desc">easy way to find our page and visit our services</div>
            <div class="qr-code">
              <img src="data:image/png;base64,${qrBase64}" width="200" height="200" />
            </div>
          </div>
          <div class="url">${predefinedLink}</div>
          <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
        </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
      return pdfUri;
    } catch (error) {
      console.error("PDF generation error:", error);
      throw error;
    }
  };

  const saveQr = async (action: "download"| "print") => {
    try {
      if (action === "download") {
        const pdfUri = await generatePDF();
        if (!pdfUri) return;
        await Sharing.shareAsync(pdfUri, {
          mimeType: "application/pdf",
          dialogTitle: "Save QR Code PDF",
          UTI: "com.adobe.pdf",
        });
      } else if (action === "print") {
        const pdfUri = await generatePDF();
        if (!pdfUri) return;
        await Print.printAsync({ uri: pdfUri });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to process QR code");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR code</Text>
      <Text style={styles.subtitle}>Download, print and share your QR code here</Text>

      <View style={styles.qrCard} ref={qrRef}>
        <Text style={styles.qrHeader}>Scan to Visit</Text>
        <Text style={styles.qrDesc}>Easy way to find our page and visit our services .</Text>
        <View style={styles.qrWrapper}>
          <QRCode
            value={predefinedLink}
            size={160}
            getRef={(c) => {
              if (c) {
                c.toDataURL((data: string) => setQrBase64(data));
              }
            }}
          />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn} onPress={() => saveQr("download")}>
          <Text style={styles.btnText}>Download and share PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => saveQr("print")}>
          <Text style={styles.btnText}>Print</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Download creates a PDF file • Print opens system print dialog • Share sends image
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", alignItems: "center", padding: 16 },
  title: { fontSize: 42, fontWeight: "bold", marginTop: 160 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 16 },
  qrCard: { width: "100%", backgroundColor: "#008080", borderRadius: 20, padding: 20, alignItems: "center", marginBottom: 20 },
  qrHeader: { fontSize: 16, fontWeight: "600", color: "white", marginBottom: 6 },
  qrDesc: { fontSize: 12, color: "white", textAlign: "center", marginBottom: 12 },
  qrWrapper: { backgroundColor: "white", borderRadius: 16, padding: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  btn: { flex: 1, margin: 5, backgroundColor: "white", borderRadius: 12, paddingVertical: 12, alignItems: "center", elevation: 2 },
  btnText: { fontSize: 14, fontWeight: "600", color: "#008080" },
  infoText: { fontSize: 11, color: "#999", textAlign: "center", marginTop: 15, paddingHorizontal: 20, lineHeight: 16 },
});

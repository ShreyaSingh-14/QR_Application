import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";


export default function Index() {
  const qrRef = useRef(null);
  const predefinedLink = "https://example.com";

  const saveQr = async (action: "download" | "share" | "print") => {
    try {
      const uri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
      });

      const fileUri = "qrcode.png";
      await FileSystem.copyAsync({ from: uri, to: fileUri });

      if (action === "download") {
        Alert.alert("QR Saved", "QR code saved temporarily.");
      } else if (action === "share") {
        await Sharing.shareAsync(fileUri);
      } else if (action === "print") {
        Alert.alert("Print", "Print from the shared file.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to process QR code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR code</Text>
      <Text style={styles.subtitle}>
        Download, print and share your QR code here
      </Text>

      {/* QR card */}
      <View style={styles.qrCard} ref={qrRef}>
        <Text style={styles.qrHeader}>Scan to Visit</Text>
        <Text style={styles.qrDesc}>
          Massa congue malesuada placerat sed lectus. Amet magna lectus.
        </Text>

        <View style={styles.qrWrapper}>
          <QRCode value={predefinedLink} size={160} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => saveQr("download")}
        >
          <Text style={styles.btnText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => saveQr("print")}>
          <Text style={styles.btnText}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => saveQr("share")}>
          <Text style={styles.btnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    padding: 16,
  },
  title: {
    
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 160,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  qrCard: {
    
    width: "100%",
    backgroundColor: "#008080",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  qrHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 6,
  },
  qrDesc: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  qrWrapper: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  btn: {
    flex: 1,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    elevation: 2,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#008080",
  },
});

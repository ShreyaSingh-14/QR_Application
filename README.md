# QR_Application

# QR Code Generator & Uploader

This module allows users to generate, save, and upload **unique QR codes** for each user. The QR codes can redirect users to a specific company link, and the generated images can be stored locally or in Cloudinary.

## Features

* Generate **unique QR codes** for each user.
* Option to **Download QR code** to device .
* Maintian image in **Cloudinary for future access**.
* Track upload status and provide **link to view uploaded QR code**.
* Handle **media library permissions**.
* Works with **Expo & React Native**.

## Installation

1. Make sure your project is using **Expo**.
2. Install dependencies:

```bash
npm install react-native-qrcode-svg expo-file-system expo-media-library
```

3. If using Cloudinary, replace the placeholders in `CLOUDINARY_URL` and `UPLOAD_PRESET` with your Cloudinary account details.

## Usage

1. Navigate to the QR code screen (e.g., `/app/qr.jsx`).
2. Pass the **link** and **userId** as query parameters:

```jsx
router.push(`/qr?link=${companyLink}&userId=${userId}`);
```

3. The screen will display:

   * The QR code corresponding to the link.
   * Buttons to save or upload the QR code.
   * Link to view uploaded QR code (if uploaded).

4. If the user has not granted permission to access the media library:

   * A **“Grant Permission”** button will appear.
   * Pressing it will request access to save QR codes.

## Code Overview

* `QRCodeScreen` component:

  * Generates the QR code using `react-native-qrcode-svg`.
  * Uses `expo-media-library` to save QR code locally.
  * Uses `fetch` with `FormData` to upload QR code to Cloudinary.
  * Handles permissions with a dedicated state `hasPermission`.

* State Variables:

  * `saved`: Tracks if the QR code is saved locally.
  * `uploaded`: Tracks if the QR code is uploaded to Cloudinary.
  * `cloudUrl`: Stores the Cloudinary URL of the uploaded QR.
  * `hasPermission`: Tracks media library access.

* Functions:

  * `saveQRCode`: Saves QR code to device gallery.
  * `uploadQRCode`: Uploads QR code to Cloudinary.

## Dependencies

* [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg)
* [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)
* [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/)
* [expo-router](https://expo.github.io/router/docs)



* Make sure the device/emulator has **media library permissions**.
* Cloudinary upload requires a valid **cloud name** and **upload preset**.
* This component works best on **Expo-managed React Native projects**.



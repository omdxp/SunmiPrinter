import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native';
import {BLEPrinter, USBPrinter} from 'react-native-thermal-receipt-printer';

export default function App() {
  // states
  const [bluetoothPrinters, setBluetoothPrinters] = useState([]);
  const [currentBluetoothPrinter, setCurrentBluetoothPrinter] = useState();
  const [usbPrinters, setUsbPrinters] = useState([]);
  const [currentUsbPrinter, setCurrentUsbPrinter] = useState();

  // on component did mount
  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setBluetoothPrinters);
    });
    if (Platform.OS == 'android') {
      USBPrinter.init().then(() => {
        USBPrinter.getDeviceList().then(setUsbPrinters);
      });
    }
  }, []);

  // connect to a usb printer
  const connectUsbPrinter = printer => {
    USBPrinter.connectPrinter(printer.vendorID, printer.productId).then(() =>
      setCurrentUsbPrinter(printer),
    );
    ToastAndroid.show('Connected to a usb printer', ToastAndroid.LONG);
  };
  // print sample text from usb printer
  const printUsbTextTest = () => {
    currentUsbPrinter && USBPrinter.printText('<C>Hello, World! text</C>\n');
  };

  // print bill from usb printer
  const printUsbBillTest = () => {
    currentUsbPrinter && USBPrinter.printText('<C>Hello, World! bill</C>');
  };

  // connect to a bluetooth printer
  const connectBluetoothPrinter = printer => {
    BLEPrinter.connectPrinter(
      printer.inner_mac_address,
    ).then(setCurrentBluetoothPrinter, error => console.warn(error));
    ToastAndroid.show('Connected to a bluetooth printer', ToastAndroid.LONG);
  };

  // print sample text from bluetooth printer
  const printBluetoothTextTest = () => {
    currentBluetoothPrinter &&
      BLEPrinter.printText('<C>Hello, World! text</C>\n');
  };

  // print bill from bluetooth printer
  const printBluetoothBillTest = () => {
    currentBluetoothPrinter &&
      BLEPrinter.printBill('<C>Hello, World! bill</C>');
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: '#21edff',
      }}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={{
            flex: 2,
            backgroundColor: 'black',
            margin: 20,
            padding: 10,
            borderRadius: 20,
          }}>
          <View style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 50}}>
              List of bluetooth devices
            </Text>
            {bluetoothPrinters.map(printer => (
              <TouchableOpacity
                style={{
                  backgroundColor: 'blue',
                  borderRadius: 30,
                  padding: 5,
                  margin: 5,
                }}
                key={printer.inner_mac_address}
                onPress={() => connectBluetoothPrinter(printer)}>
                <Text style={{color: 'white', fontSize: 30}}>
                  {`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 50}}>
              List of USB devices
            </Text>
            {usbPrinters.map(printer => (
              <TouchableOpacity
                style={{
                  backgroundColor: 'blue',
                  borderRadius: 30,
                  padding: 5,
                  margin: 5,
                }}
                key={printer.device_id}
                onPress={() => connectUsbPrinter(printer)}>
                <Text style={{color: 'white', fontSize: 30}}>
                  {`device_name: ${printer.device_name}, device_id: ${printer.device_id}, vendore_id: ${printer.vendor_id}, product_id: ${printer.product_id}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'black',
            margin: 20,
            padding: 10,
            borderRadius: 20,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              borderRadius: 30,
              padding: 5,
              margin: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={printBluetoothTextTest}>
            <Text style={{color: 'white', fontSize: 30}}>Print Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              borderRadius: 30,
              padding: 5,
              margin: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={printBluetoothBillTest}>
            <Text style={{color: 'white', fontSize: 30}}>Print Bill Text</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Button,
} from 'react-native';
import {BLEPrinter, USBPrinter} from 'react-native-printer';
import {Picker} from '@react-native-picker/picker';

export default function App() {
  // states
  const [bluetoothPrinters, setBluetoothPrinters] = useState([]);
  const [currentBluetoothPrinter, setCurrentBluetoothPrinter] = useState();
  const [usbPrinters, setUsbPrinters] = useState([]);
  const [currentUsbPrinter, setCurrentUsbPrinter] = useState();
  const [selectedDeviceType, setSelectedDeviceType] = useState('Bluetooth');

  // on component did mount
  useEffect(() => {
    refreshAllDevices();
  }, []);

  // refresh all type of devices
  const refreshAllDevices = () => {
    refreshBluetoothDevices();
    refreshUsbDevices();
  };

  // refresh bluetooth devices
  const refreshBluetoothDevices = () => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setBluetoothPrinters);
    });
  };

  // refresh usb devices
  const refreshUsbDevices = () => {
    // works only for android
    if (Platform.OS == 'android') {
      USBPrinter.init().then(() => {
        USBPrinter.getDeviceList().then(setUsbPrinters);
      });
    }
  };

  // connect to a usb printer
  const connectUsbPrinter = printer => {
    console.log('printer:', printer);
    USBPrinter.connectPrinter(printer.vendor_id, printer.product_id).then(() =>
      setCurrentUsbPrinter(printer),
    );
    ToastAndroid.show('Connected to a usb printer', ToastAndroid.LONG);
  };

  // print sample text from usb printer
  const printUsbTextTest = () => {
    currentUsbPrinter && USBPrinter.printText('<CB>Hello, World!</CB>\n');
  };

  // print bill from usb printer
  const printUsbBillTest = () => {
    currentUsbPrinter && USBPrinter.printBill('<C>Hello, World! bill</C>');
  };

  // print sample bill with custom inputs from usb printer
  const printUsbBillSample = (
    storeName,
    address,
    phoneNumber,
    productsList,
    collectedAmount,
    discount,
    charge,
    total,
    ticketNumber,
    thanks,
    numberOfCopies,
  ) => {
    if (numberOfCopies <= 0) {
      console.warn('numberOfCpise must be over 1!');
      return;
    }
    const line = '<C>--------------------------------------------</C>\n';
    const date = new Date().toLocaleString('fr-fr');
    for (let i = 0; i < numberOfCopies; i++) {
      USBPrinter.printBill(
        `<CB>${storeName}</CB>\n` +
          `<CM>${address}</CM>\n` +
          `<CM>${phoneNumber}</CM>\n` +
          line +
          ',' +
          productsList.map(product => '* ' + product + ' DA\n') +
          line +
          `Collected Amount : ${collectedAmount} DA\n` +
          `Discount : ${discount} DA\n` +
          `Charge : ${charge} DA\n` +
          `<CD>Total : ${total} DA</CD>\n` +
          line +
          `Ticket Number : #${ticketNumber}\n` +
          `${date}\n` +
          `<CM>${thanks}</CM>\n`,
      );
      sleep(1000);
    }
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
      BLEPrinter.printText('<C><B>Hello, World!</B></C>\n');
  };

  // print bill from bluetooth printer
  const printBluetoothBillTest = () => {
    currentBluetoothPrinter &&
      BLEPrinter.printBill('<C>Hello, World! bill</C>');
  };

  // print sample bill with custom inputs from bluetooth printer
  const printBluetoothBillSample = (
    storeName,
    address,
    phoneNumber,
    productsList,
    collectedAmount,
    discount,
    charge,
    total,
    ticketNumber,
    thanks,
    numberOfCopies,
  ) => {
    if (numberOfCopies <= 0) {
      console.warn('numberOfCpise must be over 1!');
      return;
    }
    const line = '<C>--------------------------------------------</C>\n';
    const date = new Date().toLocaleString('fr-fr');
    for (let i = 0; i < numberOfCopies; i++) {
      BLEPrinter.printBill(
        `<CB>${storeName}</CB>\n` +
          `<CM>${address}</CM>\n` +
          `<CM>${phoneNumber}</CM>\n` +
          line +
          ',' +
          productsList.map(product => '* ' + product + ' DA\n') +
          line +
          `Collected Amount : ${collectedAmount} DA\n` +
          `Discount : ${discount} DA\n` +
          `Charge : ${charge} DA\n` +
          `<CD>Total : ${total} DA</CD>\n` +
          line +
          `Ticket Number : #${ticketNumber}\n` +
          `${date}\n` +
          `<CM>${thanks}</CM>\n`,
      );
      sleep(1000);
    }
  };

  // function to sleep for a specefic time
  const sleep = milliseconds => {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
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
          <Button
            title={'refresh'}
            onPress={() => {
              refreshAllDevices();
            }}
          />
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
          {currentUsbPrinter && (
            <Text style={{color: 'green', fontSize: 30}}>
              USB printer connected
            </Text>
          )}
          {currentBluetoothPrinter && (
            <Text style={{color: 'green', fontSize: 30}}>
              Bluetooth printer connected
            </Text>
          )}
          <View
            style={{
              backgroundColor: 'white',
            }}>
            <Picker
              selectedValue={selectedDeviceType}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDeviceType(itemValue)
              }>
              <Picker.Item label="Bluetooth" value="Bluetooth" />
              <Picker.Item label="USB" value="USB" />
            </Picker>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              borderRadius: 30,
              padding: 5,
              margin: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              selectedDeviceType === 'Bluetooth'
                ? printBluetoothTextTest()
                : printUsbTextTest();
            }}>
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
            onPress={() => {
              selectedDeviceType === 'Bluetooth'
                ? printBluetoothBillTest()
                : printUsbBillTest();
            }}>
            <Text style={{color: 'white', fontSize: 30}}>Print Bill Text</Text>
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
            onPress={() => {
              selectedDeviceType === 'Bluetooth'
                ? printBluetoothBillSample(
                    'Omar Store', // storeName
                    'Mesra, Mostaganem', // address
                    '04516564545', // phoneNumber
                    ['Batata : 200.0', 'Khobz : 10.0', 'Dela3 : 300.0'], // productsList
                    '5600', // collectedAmount
                    '0.0', // discount
                    '0.0', // charge
                    '5600', // total
                    '1125', // ticketNumber
                    'Merci pour votre achat', // thanks
                    1, // numberOfCopies
                  )
                : printUsbBillSample(
                    'Omar Store', // storeName
                    'Mesra, Mostaganem', // address
                    '04516564545', // phoneNumber
                    ['Batata : 200.0', 'Khobz : 10.0', 'Dela3 : 300.0'], // productsList
                    '5600', // collectedAmount
                    '0.0', // discount
                    '0.0', // charge
                    '5600', // total
                    '1125', // ticketNumber
                    'Merci pour votre achat', // thanks
                    1, // numberOfCopies
                  );
            }}>
            <Text style={{color: 'white', fontSize: 30}}>
              Print Sample Bill
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

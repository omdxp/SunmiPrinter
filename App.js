import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';

export default function App() {
  // states
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();

  // on component dit mount
  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  // connect to printer
  const connectPrinter = printer => {
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      setCurrentPrinter,
      error => console.warn(error),
    );
  };

  // print sample text
  const printTextTest = () => {
    currentPrinter && BLEPrinter.printText('<C>Hello, World! text</C>\n');
  };

  // print bill
  const printBillTest = () => {
    currentPrinter && BLEPrinter.printBill('<C>Hello, World! bill</C>');
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <Text style={{color: 'white', fontSize: 50}}>List of devices</Text>
      {printers.map(printer => (
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            borderRadius: 30,
            padding: 5,
            margin: 5,
          }}
          key={printer.inner_mac_address}
          onPress={() => connectPrinter(printer)}>
          <Text style={{color: 'white', fontSize: 30}}>
            {`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

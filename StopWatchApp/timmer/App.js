import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const App = () => {
 const [milliseconds, setMilliseconds] = useState(0);

  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [paused, setPaused] = useState(false);
  const [startButtonText, setStartButtonText] = useState('Bắt đầu'); // Thêm state mới
  const scrollViewRef = useRef();

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setMilliseconds(prevTime => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (running) {
      setStartButtonText('Dừng lại');
    } else {
      setStartButtonText('Tiếp tục');
    }
  }, [running]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [laps]);

  const handleStartStop = () => {
    if(running){
      setRunning(false);
      setPaused(true);
    } else {
      setRunning(true);
      setPaused(false);
    }
  };

  const handleLapReset = () => {
    if (running) {
      setLaps([...laps, milliseconds]);
    } else {
      setMilliseconds(0);
      setLaps([]);
      setPaused(false);
      setStartButtonText('Bắt đầu'); // Đặt lại nút thành "Bắt đầu"
    }
  };

  const formatTime = millis => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(2);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(milliseconds)}</Text>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={handleStartStop} style={[styles.button, running ? styles.stopButton : styles.startButton]}>
          <Text style={styles.buttonText}>{running ? 'Dừng lại' : paused ? 'Tiếp tục' : 'Bắt đầu'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLapReset} style={styles.button}>
          <Text style={styles.buttonText}>{running ? 'Vòng' : 'Đặt lại'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollViewRef} style={styles.lapsWrapper} maxHeight={200}>
        {laps.map((lap, index) => (
          <View key={index} style={styles.lap}>
            <Text style={styles.lapText}>0{index + 1}</Text>
                {index > 0 && (
                  <Text style={styles.lapText}>
                    {formatTime(lap - laps[index - 1])}
                  </Text>
                )}  
            <Text style={styles.lapText}>{formatTime(lap)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2C3639', // Dark Gray
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 30,
    color: '#F7CCAC', // Light Orange
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#A27B5C', // Brown
    backgroundColor: '#DCD7C9', // Light Gray
  },
  buttonText: {
    fontSize: 18,
    color: '#black', // Black
  },
  startButton: {
    borderColor: '#9FC088', // Green
  },
  stopButton: {
    borderColor: '#CC704B', // Red
  },
  lapsWrapper: {
    width: '100%',
    maxHeight: 200,
    borderWidth: 3,
    borderRadius:6,
    borderColor: '#3F4E4F', // Dark Green
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius:6,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#3F4E4F', // Dark Green
  },
  lapText: {
    fontSize: 18,
    color: '#FFFFFF', // White
  },
});

export default App;

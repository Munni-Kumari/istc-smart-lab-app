// filepath: services/mqttService.ts
import { NativeModules, Platform } from "react-native";
import { useState, useEffect } from "react";

// MQTT Configuration - Update these to match your Node-RED/MQTT setup
const MQTT_CONFIG = {
  host: "mqtt://192.168.221.66",  // Your MQTT broker address
  port: 1883,                      // Default MQTT port
  clientId: `smartlab_${Math.random().toString(16).substr(2, 8)}`,
  topic: "smartlab/sensor/data",   // Topic where Node-RED publishes sensor data
  username: "",                    // Set if your MQTT requires auth
  password: "",                    // Set if your MQTT requires auth
};

// Valid distance range for ultrasonic sensor (0-400 cm is typical)
const MIN_VALID_DISTANCE = 0;
const MAX_VALID_DISTANCE = 400;

// Minimum valid readings before showing graph (to ensure device is actually connected)
const MIN_VALID_READINGS = 3;

type MessageCallback = (data: { values: number[]; timestamp: number; deviceConnected: boolean }) => void;

// Maximum data points to keep in the rolling window (like your backend graph)
const MAX_DATA_POINTS = 30;

class MQTTServic {
  private client: any = null;
  private isConnected: boolean = false;
  private subscribers: MessageCallback[] = [];
  private accumulatedValues: number[] = [];
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private isPaused: boolean = false;
  private deviceConnected: boolean = false;
  private validReadingsCount: number = 0;

  connect() {
    console.log("📡 Connecting to MQTT broker...", MQTT_CONFIG.host);
    this.accumulatedValues = [];
    this.isPaused = false;
    this.deviceConnected = false;
    this.validReadingsCount = 0;
    this.startPolling();
    return true;
  }

  // Check if device is connected
  isDeviceConnected(): boolean {
    return this.deviceConnected;
  }

  // Pause data fetching (keeps connection but stops polling)
  pause() {
    this.isPaused = true;
    console.log("⏸️ Data fetching paused");
  }

  // Resume data fetching
  resume() {
    this.isPaused = false;
    console.log("▶️ Data fetching resumed");
  }

  // Check if currently paused
  isFetchingPaused(): boolean {
    return this.isPaused;
  }

  // Clear accumulated data
  clearData() {
    this.accumulatedValues = [];
    this.validReadingsCount = 0;
    this.deviceConnected = false;
    console.log("🗑️ Data cleared");
    this.notifySubscribers({
      values: [],
      timestamp: Date.now(),
      deviceConnected: false,
    });
  }

  // Validate if the reading is a valid distance from ESP8266
  private isValidDistance(value: number): boolean {
    return (
      typeof value === 'number' &&
      !isNaN(value) &&
      value >= MIN_VALID_DISTANCE &&
      value <= MAX_VALID_DISTANCE
    );
  }

  private startPolling() {
    this.pollInterval = setInterval(async () => {
      // Skip polling if paused
      if (this.isPaused) {
        return;
      }

      try {
        const response = await fetch("http://192.168.221.66:3000/api/live-update", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          
          let newValue: number | null = null;
          
          // Try different data formats from Node-RED
          if (Array.isArray(data.values) && data.values.length > 0) {
            newValue = data.values[data.values.length - 1];
          } else if (typeof data.value === 'number') {
            newValue = data.value;
          } else if (typeof data.distance === 'number') {
            newValue = data.distance;
          } else if (typeof data === 'number') {
            newValue = data;
          }
          
          // Validate the reading
          if (newValue !== null && this.isValidDistance(newValue)) {
            this.validReadingsCount++;
            
            // Device is considered connected after minimum valid readings
            if (this.validReadingsCount >= MIN_VALID_READINGS) {
              this.deviceConnected = true;
            }
            
            this.accumulatedValues.push(newValue);
            
            if (this.accumulatedValues.length > MAX_DATA_POINTS) {
              this.accumulatedValues = this.accumulatedValues.slice(-MAX_DATA_POINTS);
            }
            
            console.log("📊 New distance:", newValue, "cm | Device:", this.deviceConnected ? "Connected" : "Waiting...");
            
            this.notifySubscribers({
              values: [...this.accumulatedValues],
              timestamp: Date.now(),
              deviceConnected: this.deviceConnected,
            });
          } else {
            // Invalid reading - device might be disconnected
            console.log("⚠️ Invalid reading:", newValue, "- Device may be disconnected");
            
            // Reset device connection if we have accumulated data but now getting invalid readings
            if (this.accumulatedValues.length > 0 && this.validReadingsCount > 0) {
              this.validReadingsCount = 0;
              this.deviceConnected = false;
              
              this.notifySubscribers({
                values: [...this.accumulatedValues],
                timestamp: Date.now(),
                deviceConnected: false,
              });
            }
          }
        }
      } catch (error) {
        console.log("MQTT Poll error:", error);
        // Network error - device disconnected
        if (this.accumulatedValues.length > 0) {
          this.deviceConnected = false;
          this.validReadingsCount = 0;
          this.notifySubscribers({
            values: [...this.accumulatedValues],
            timestamp: Date.now(),
            deviceConnected: false,
          });
        }
      }
    }, 1000);
  }

  subscribe(callback: MessageCallback) {
    this.subscribers.push(callback);
    console.log("📊 Subscribed to sensor data updates");
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notifySubscribers(data: any) {
    this.subscribers.forEach((callback) => {
      try {
        callback({
          values: data.values || [],
          timestamp: Date.now(),
          deviceConnected: data.deviceConnected || false,
        });
      } catch (error) {
        console.error("Subscriber error:", error);
      }
    });
  }

  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.accumulatedValues = [];
    this.subscribers = [];
    this.isConnected = false;
    this.deviceConnected = false;
    this.validReadingsCount = 0;
    console.log("📴 Disconnected from MQTT broker");
  }
}

// Singleton instance
export const mqttService = new MQTTServic();

// Hook for easy use in components
export const useMQTTSensorData = (topic?: string) => {
  const [sensorData, setSensorData] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    mqttService.connect();
    setIsConnected(true);

    const unsubscribe = mqttService.subscribe((data) => {
      setSensorData(data.values);
    });

    return () => {
      unsubscribe();
      mqttService.disconnect();
    };
  }, [topic]);

  return { sensorData, isConnected };
};
// filepath: services/mqttService.ts
import { useState, useEffect } from "react";

const CONFIG = {
  REST_URL: "http://192.168.221.66:3000/api/live-update",
  WS_URL: "ws://192.168.221.66:1880/mqtt-stream", // From .env.local
};

const MAX_DATA_POINTS = 30;

type MessageCallback = (data: { values: number[]; timestamp: number; deviceConnected: boolean; unit?: string }) => void;

class MQTTServic {
  private subscribers: MessageCallback[] = [];
  private accumulatedValues: number[] = [];
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private ws: WebSocket | null = null;
  private isPaused: boolean = false;
  private deviceConnected: boolean = false;
  private currentUnit: string = "cm";

  connect() {
    console.log("🔌 Initializing Multi-Stream Connection...");
    this.isPaused = false;
    
    // 1. Try WebSocket first (Modern/Live)
    this.connectWS();
    
    // 2. Fallback to Polling (Legacy)
    this.startPolling();
    
    return true;
  }

  private connectWS() {
    try {
      if (this.ws) this.ws.close();
      this.ws = new WebSocket(CONFIG.WS_URL);

      this.ws.onopen = () => console.log("🌐 WebSocket Connected to Node-RED");
      this.ws.onmessage = (e) => {
        if (this.isPaused) return;
        try {
          const data = JSON.parse(e.data);
          this.processData(data);
        } catch (err) {
          // console.log("WS Data Error:", err);
        }
      };
      this.ws.onerror = (e) => console.log("🌐 WebSocket Error (Normal if port 1880 is closed)");
      this.ws.onclose = () => {
        // Retry after 5 seconds if not paused
        if (!this.isPaused) setTimeout(() => this.connectWS(), 5000);
      };
    } catch (err) {
      console.log("WS Setup Error:", err);
    }
  }

  private startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      if (this.isPaused) return;
      try {
        const response = await fetch(CONFIG.REST_URL);
        const text = await response.text();
        if (text.startsWith("<!DOCTYPE")) return; // Skip HTML

        const data = JSON.parse(text);
        this.processData(data);
      } catch (error) {
        // Silently fail as WS might be handling it
      }
    }, 2000);
  }

  private processData(data: any) {
    let val: number | null = null;
    const valuesArr = data.values || data.data?.values || [];
    
    if (data.value !== undefined) val = Number(data.value);
    else if (data.distance !== undefined) val = Number(data.distance);
    else if (Array.isArray(valuesArr) && valuesArr.length > 0) {
      val = Number(valuesArr[valuesArr.length - 1]);
    }
    
    if (val !== null && !isNaN(val)) {
      this.deviceConnected = true;
      this.accumulatedValues.push(val);
      
      // If we got a history array, sync it once
      if (Array.isArray(valuesArr) && valuesArr.length > 0 && this.accumulatedValues.length < 5) {
        this.accumulatedValues = valuesArr.map(Number).slice(-MAX_DATA_POINTS);
      }
      
      if (this.accumulatedValues.length > MAX_DATA_POINTS) {
        this.accumulatedValues.shift();
      }
    } else {
      // Only set disconnected if we haven't seen data for a while
      // (Simplified for now)
    }

    if (data.unit) this.currentUnit = data.unit;
    this.notifySubscribers();
  }

  subscribe(callback: MessageCallback) {
    this.subscribers.push(callback);
    callback({
      values: [...this.accumulatedValues],
      timestamp: Date.now(),
      deviceConnected: this.deviceConnected,
      unit: this.currentUnit
    });
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    const data = {
      values: [...this.accumulatedValues],
      timestamp: Date.now(),
      deviceConnected: this.deviceConnected,
      unit: this.currentUnit
    };
    this.subscribers.forEach(cb => cb(data));
  }

  pause() { this.isPaused = true; if (this.ws) this.ws.close(); }
  resume() { this.isPaused = false; this.connectWS(); }
  clearData() { this.accumulatedValues = []; this.notifySubscribers(); }
  disconnect() {
    this.pause();
    if (this.pollInterval) clearInterval(this.pollInterval);
  }
}

export const mqttService = new MQTTServic();
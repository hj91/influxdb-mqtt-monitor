/**

 influxdb-mqtt-monitor/app.js - Copyright 2024 Harshad Joshi and Bufferstack.IO Analytics Technology LLP, Pune

 Licensed under the GNU General Public License, Version 3.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.gnu.org/licenses/gpl-3.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/



const express = require('express');
const Influx = require('influx');
const fs = require('fs');
const mqtt = require('mqtt');

const app = express();

// Load configuration from config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// Initialize InfluxDB client
const influx = new Influx.InfluxDB({
  host: config.influxdb.server,
  port: config.influxdb.port,
  database: config.influxdb.database,
  username: config.influxdb.username,
  password: config.influxdb.password,
});

let lastKnownData = null;
let lastChangeTime = null;
const measurement = config.influxdb.measurement;
const polling = config.influxdb.poll;

// MQTT configuration
const mqttConfig = config.mqtt;
const client = mqtt.connect(mqttConfig.url, mqttConfig.options);

// Function to handle MQTT message publishing
function publishMessage(topic, message) {
  client.publish(topic, JSON.stringify(message));
}

// Load last known data from file or initialize to null
try {
  lastKnownData = JSON.parse(fs.readFileSync('./lastKnownData.json', 'utf-8'));
} catch (error) {
  lastKnownData = null;
}

// Function to save current data to file
function saveDataToFile(data) {
  fs.writeFileSync('./lastKnownData.json', JSON.stringify(data), 'utf-8');
}

// Function to fetch new data from InfluxDB
async function fetchNewData() {
  const query = `SELECT * FROM ${measurement}`;
  
  try {
    const result = await influx.query(query);
    if (result.length > 0) {
      const newData = result[result.length - 1]; // Get the last data point

      if (!lastKnownData || JSON.stringify(lastKnownData) !== JSON.stringify(newData)) {
        // Data has changed
        lastKnownData = newData;
        lastChangeTime = new Date();
        console.log('Data has changed at:', lastChangeTime);
        // Save current data to file
        saveDataToFile(newData);
        // Send response directly to the client
        sendDataResponse({ dataChanged: true, lastChangeTime });
        // Publish MQTT message for data change
        publishMessage(mqttConfig.topic, { dataChanged: true, lastChangeTime, data: newData });
      } else {
        // Data has not changed
        console.log('Data has not changed.');
        // Send response with dataChanged false and lastChangeTime
        sendDataResponse({ dataChanged: false, lastChangeTime });
        // Publish MQTT message for no data change
        publishMessage(mqttConfig.topic, { dataChanged: false, lastChangeTime });
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Function to send data response
function sendDataResponse(data) {
  console.log('Sending data response:', data);
  // Respond to /data endpoint with the data
  app.get('/data', (req, res) => {
    res.json(data);
  });
}

// Start fetching new data immediately
fetchNewData();

// Schedule fetching new data at intervals
setInterval(fetchNewData, polling); // Every polling interval

// Start the MQTT client
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// Graceful exit
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Exiting gracefully...');
  // Close MQTT client
  client.end();
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


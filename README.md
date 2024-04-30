# InfluxDB MQTT Monitor

The **InfluxDB MQTT Monitor** is a Node.js application designed to monitor changes in an InfluxDB database and publish notifications over MQTT (Message Queuing Telemetry Transport) protocol. It provides real-time updates on data changes in the InfluxDB database and supports seamless integration with MQTT-enabled systems.

## Features

- Monitors changes in an InfluxDB database.
- Publishes real-time notifications over MQTT protocol.
- Supports configuration via `config.json` file.
- Persists last known data to a file for enhanced reliability.
- Gracefully handles application shutdowns and restarts.
- Easy integration with existing Node.js applications.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hj91/influxdb-mqtt-monitor.git
   ```

2. Navigate to the project directory:

   ```bash
   cd influxdb-mqtt-monitor
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the application by editing the `config.json` file with your InfluxDB and MQTT server details.

5. Start the application:

   ```bash
   npm start
   ```

## Configuration

The `config.json` file contains configuration parameters such as InfluxDB server details, MQTT server details, database measurement, and polling interval. Edit this file to set up the application according to your InfluxDB and MQTT setup.

```json
{
  "influxdb": {
    "server": "localhost",
    "port": 8086,
    "database": "my_database",
    "username": "admin",
    "password": "password",
    "measurement": "my_measurement",
    "poll": 5000
  },
  "mqtt": {
    "url": "mqtt://mqtt.example.com",
    "topic": "data/changes",
    "options": {}
  }
}
```

## Potential Use Cases

- **Real-time Monitoring**: Monitor critical metrics or sensor data in real-time and trigger alerts or notifications over MQTT when thresholds are exceeded.
- **IoT Applications**: Integrate with IoT devices and systems to monitor and analyze sensor data streams, detect anomalies, and trigger actions based on data changes.
- **Automation Systems**: Integrate with automation systems to trigger workflows, initiate processes, or control devices based on real-time data changes.
- **Alerting Systems**: Create alerting systems that subscribe to MQTT messages and take appropriate actions when data changes occur, such as sending emails or SMS notifications.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for any improvements or features you'd like to see.

## License

This project is licensed under the [GPL-3.0 License](LICENSE).


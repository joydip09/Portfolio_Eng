## **PROJECT REPORT ON** 

# **HOMESAFE** 



HomeSafe | 1 

### **<u>ACKNOWLEDGEMENT</u>** 

We would like to express our sincere gratitude to our course instructor and project supervisor for their guidance, encouragement, and valuable suggestions throughout the development of this project. Their support helped us understand the practical applications of embedded systems, sensors, and local communication technologies. 

We are also thankful to our department and institution for providing the opportunity to undertake this project. Finally, we acknowledge the contributions of all group members whose cooperation and effort made the development of the proposed system possible. 

HomeSafe | 2 

### **<u>ABSTRACT</u>** 

HomeSafe is an embedded smart-home monitoring prototype designed to integrate environmental hazard detection, security monitoring, audio event classification, and local user interaction. Built around the ESP32-S3 microcontroller, the system incorporates temperature and humidity, gasrelated, and flame-related sensors, alongside a passive infrared (PIR) motion sensor and an INMP441 digital microphone. Its modular firmware manages sensor acquisition, safety logic, security functions, output control, audio processing, and network communication. The project explores TinyML-based audio classification using five classes: alarm, glass_break, distress, impact, and normal. The prepared dataset contains 547 entries, including 450 training and 97 testing entries. An earlier baseline experiment achieved 79.3% validation accuracy and 63.13% test accuracy. These results apply only to the baseline model. The proposed communication architecture uses Wi-Fi, JSON-encoded WebSocket messages, and an Android companion application. This report presents the system requirements, hardware and software design, architecture, communication protocol, TinyML principles, and testing methodology. HomeSafe remains experimental and cannot replace certified fire, gas, or security equipment. 

HomeSafe | 3 

### **<u>TABLE OF CONTENTS</u>** 

|1.Introduction……………………………………………………………………………………...5|
|---|
|1.1 Problem Statement………………………………………………………………………..5|
|1.2 Aim………………………………………………………………………………………..5|
|1.3 Objectives…………………………………………………………………………………5|
|1.4 Real-Life Benefits………………………………………………………………………...6|
|2. Literature Review……………………………………………………………………………….6|
|2.1 Smart Home Monitoring Systems………………………………………………………...6|
|2.2 Environmental Hazard Detection…………………………………………………………6|
|2.3 Intrusion Detection and Audio Monitoring……………………………………………….6|
|2.4 Microcontroller-Based Monitoring Systems……………………………………………...7|
|2.5 TinyML-Based Audio Classification……………………………………………………..7|
|2.6 Local Communication and Real-Time Monitoring………………………………………..7|
|3. Table of Components……………………………………………………………………………8|
|4. Project Description……………………………………………………………………………...9|
|4.1 Hardware………………………………………………………………………………….9|
|4.1.1 Sensing Subsystem…………………………………………………………………...9|
|4.1.2 Security Subsystem…………………………………………………………………12|
|4.1.3 Microcontroller and Supporting Hardware…………………………………………13|
|4.2 Software…………………………………………………………………………………16|
|4.2.1 Firmware and Modules……………………………………………………………...16|
|5. Architecture of the Proposed System…………………………………………………………..18|
|5.1 System Architecture……………………………………………………………………..18|
|5.2 Block Diagram…………………………………………………………………………..19|
|5.3 Circuit Diagram………………………………………………………………………….20|
|5.4 Pin Connections………………………………………………………………………….21|
|6. Local Communication Protocol and Networking……………………………………………...21|
|6.1 Networking Architecture………………………………………………………………...21|
|6.2 WebSocket Communication……………………………………………………………..22|
|6.3 JSON Protocol…………………………………………………………………………...22|
|7. TinyML Audio Classification………………………………………………………………….24|
|8. Application Testing……………………………………………………………………………26|
|9. Snapshots from Software………………………………………………………………………31|
|10. Results ……………………………………………………………………………………….35|
|12.Discussion…………………………………………………………………………………….37|
|13.Conclusion……………………………………………………………………………………38|
|11. Limitations, Safety Considerations and Future Work………………………………………...38|
|14.References…………………………………………………………………………………….39|



HomeSafe | 4 

### **<u>1.INTRODUCTION</u>** 

Household environments can contain several types of risk, including abnormal temperature, gasrelated conditions, flame, and unexpected movement. These events require different sensing methods, and a single sensor cannot reliably identify every type of hazard. HomeSafe explores the integration of multiple sensors, local embedded processing, an audio-classification model, and a smartphone interface in one prototype. 

The central controller collects data from connected sensors and evaluates it using firmware modules. Local outputs, including a buzzer and RGB indicator, can provide immediate feedback for supported events. A local network connection is intended to allow a companion application to view device information and issue supported commands. The design emphasizes modularity so that sensing, safety logic, security behavior, audio processing, and networking can be developed and tested separately. 

#### **<u>1.1 Problem Statement</u>** 

Many household monitoring functions are implemented using separate devices. Environmental sensors, motion detectors, and acoustic monitoring systems observe different signals and may provide separate interfaces. The project problem is to investigate how selected environmental and security sensors can be integrated into a compact embedded terminal that processes inputs locally, provides audible or visual alerts, and supports local smartphone interaction. The system must also distinguish between environmental hazard monitoring and security-mode behavior. 

#### **<u>1.2 Aim</u>** 

The aim of HomeSafe is to design and develop an embedded smart-home monitoring prototype that combines environmental sensing, motion-based security monitoring, selected acoustic event classification, local alarm control, and local-network communication. 

#### **<u>1.3 Objectives</u>** 

- 1) Integrate an ESP32-S3 microcontroller with selected environmental and security sensors. 

- 2) Acquire temperature, humidity, gas-related, flame-related, motion, and audio inputs. 

3) Develop modular firmware for sensor processing, safety decisions, security states, and output control. 

- 4) Explore TinyML classification of selected audio categories on an embedded platform. 

- 5) Provide local Wi-Fi communication using WebSocket and structured JSON messages. 

6) Develop or integrate an Android companion interface for supported monitoring and control functions. 

- 7) Evaluate individual components and the integrated system using repeatable test procedures. 

HomeSafe | 5 

#### **<u>1.4 Real-Life Benefits</u>** 

1) Consolidated monitoring: several sensor types can be managed by one embedded platform. 

2) Local response: supported alarm logic can operate on the device without requiring cloud processing. 

3) Security support: PIR-based motion monitoring can be associated with an armed security mode. 

4) Acoustic awareness: audio classification may identify selected sound categories that complement conventional sensors. 

5) Expandable design: modular firmware and a defined communication protocol provide a foundation for future features. 

These are potential benefits of the design. They should not be interpreted as evidence of certified or guaranteed emergency detection. 

### **<u>2. LITERATURE REVIEW</u>** 

#### **<u>2.1 Smart Home Monitoring Systems</u>** 

Smart-home monitoring systems combine sensors, processing units, communication links, and user interfaces to provide information about a building or its occupants. Depending on the design, processing and alerts may occur locally, through a cloud service, or through a combination of both. HomeSafe follows a local-first prototype approach: sensor acquisition and supported alarm decisions are intended to run on the microcontroller, while a phone on the same network can provide a convenient interface. 

#### **<u>2.2 Environmental Hazard Detection</u>** 

Environmental monitoring relies on sensors that respond to physical or chemical conditions. A temperature and humidity sensor provides measurements of ambient conditions. Metal-oxide gas sensors, such as the MQ-series modules, change their electrical characteristics in response to a range of gases; their readings generally require warm-up, calibration, and careful interpretation. A flame sensor detects optical radiation within its sensitivity range. These devices are useful for demonstrations and preliminary monitoring, but their outputs do not by themselves establish the presence, concentration, or safety level of a real-world hazard. 

#### **<u>2.3 Intrusion Detection and Audio Monitoring</u>** 

A passive infrared sensor detects changes in infrared radiation associated with movement in its field of view. It does not identify a person and can be affected by placement, temperature, and movement conditions. A digital microphone captures sound that can be processed to identify selected acoustic patterns. Audio monitoring may complement motion detection, but performance 

HomeSafe | 6 

depends on microphone placement, distance, background noise, and the data used to train the classifier. 

#### **<u>2.4 Microcontroller-Based Monitoring Systems</u>** 

A microcontroller provides an interface between sensors and software. It periodically reads digital or analog inputs, processes values, updates system state, controls outputs, and manages communication. A modular design separates these responsibilities into manageable software components. The ESP32-S3 also provides wireless connectivity and processing resources that make it suitable for a prototype combining conventional sensors with lightweight machine learning. 

#### **<u>2.5 TinyML-Based Audio Classification</u>** 

TinyML refers to machine-learning inference on resource-constrained devices. A typical audioclassification workflow collects labelled sound recordings, converts them into numerical features, trains a model, evaluates its predictions, and deploys a compact version for on-device inference. Quantization can reduce model size and computational requirements. Model quality depends on representative training data, suitable evaluation splits, and testing under conditions similar to actual use. 

#### **<u>2.6 Local Communication and Real-Time Monitoring</u>** 

Wi-Fi allows devices to exchange data over a local network. WebSocket provides a persistent, bidirectional connection after its initial handshake, which can be useful for sending commands and receiving updates without repeatedly opening separate connections. JSON is a text-based format for representing structured messages. The communication protocol must define message types, field names, request identifiers, error responses, and the meaning of each state value so that firmware and application interpret data consistently. 

HomeSafe | 7 

### **<u>3. TABLE OF COMPONENTS</u>** 

Table 3.0:Information of components 

|Component|Category|Purpose|
|---|---|---|
|ESP32-S3-WROOM-1-<br>N16R8 / DevKitC-1|Microcontroller board|Sensor acquisition, embedded<br>processing, Wi-Fi, and<br>subsystem coordination|
|DHT11|Environmental sensor|Temperature and relative-<br>humidity measurement|
|MQ-2 module|Gas/smoke-related sensor|Broad-response sensing for<br>combustible gases and<br>smoke-related condition|
|MQ-135 module|Air-quality-related sensor|Broad-response sensing for<br>selected air contaminants|
|Flame sensor module|Optical sensor|Detection of flame-related<br>optical signals|
|HC-SR501 PIR|Motion sensor|Motion-related input for<br>security monitoring|
|INMP441|Digital microphone|I²S audio capture for sound<br>classification|
|Buzzer|Output device|Audible local alert|
|RGB LED|Output indicator|Visual device or alarm status<br>indication|
|PlatformIO, Arduino<br>framework, C++|Firmware tools|Embedded firmware<br>development and build|
|Edge Impulse inference<br>library|TinyML software|Audio-model inference,<br>subject to deployed model<br>integration|
|React Native and TypeScript|Application tools|Android companion<br>application|
|Wi-Fi, WebSocket, JSON|Communication technologies|Local connection and<br>structured message exchange|



HomeSafe | 8 

### **<u>4. PROJECT DESCRIPTION</u>** 

#### **<u>4.1 Hardware</u>** 

The hardware consists of a microcontroller, environmental sensors, a motion sensor, a digital microphone, and output indicators. Each sensor measures or detects a different aspect of the environment. The microcontroller collects their outputs and applies the software rules used to determine whether a warning should be generated. 

The components must be supplied with compatible voltage levels and connected to suitable input interfaces. Sensor modules should not be assumed to share the same voltage requirements simply because they are used with the same controller. 

#### **<u>4.1.1 Sensing Subsystem</u>** 

#### **DHT11 Temperature and Humidity Sensor** 

The DHT11 is a digital environmental sensor used to measure ambient temperature and relative humidity. It sends its measurement data through a digital communication signal rather than providing a simple analog voltage proportional to temperature. The controller reads the reported values and can display them on the local dashboard or use them as part of the monitoring logic. 

In this project, the DHT11 provides basic environmental context. For example, a change in temperature can be displayed alongside other sensor readings. However, the DHT11 is not a certified fire detector, and its readings alone should not be used as proof that a fire is present or absent. 

The supplied connection diagram assigns the DHT11 data line to GPIO 45. Because GPIO availability and boot-related behaviour depend on the exact ESP32-S3 board, this assignment should be verified against the development board's documentation and tested during startup. 



<!-- Start of picture text -->
s ole<br>32ov ere3e x }<br>ovovers eres<br><td<br>-<br>“ Y<br><!-- End of picture text -->

Figure 4.1.1.1: DHT11 Temperature and Humidity Sensor 

HomeSafe | 9 

#### **MQ-2 Smoke and Combustible-Gas Sensor** 

The MQ-2 module is a gas-sensitive sensor commonly used in educational prototypes to demonstrate detection of smoke and certain combustible gases. Its sensing element changes its electrical resistance in response to the gases present around it. The module's circuitry converts this behaviour into a measurable output. 

The analog output provides a voltage that the controller can sample and interpret as a relative sensor reading. Some modules also provide a digital output generated by an onboard comparator and adjustable threshold. The digital output indicates whether the module's configured threshold has been crossed; it does not provide a precise gas concentration. 

The MQ-2 is assigned to GPIO 9 (ADC1_CH8) in the supplied diagram. The analog reading can be displayed or compared with a threshold established during testing. The sensor generally requires appropriate warm-up and calibration, and its response may be affected by multiple gases, temperature, and humidity. Therefore, raw ADC values must not be presented as accurate partsper-million measurements unless a suitable calibration procedure supports that conversion. 



<!-- Start of picture text -->
@|« )<br>[e)<br><!-- End of picture text -->

Figure 4,1,1,2: MQ-2 smoke and combustible-gas sensor 

#### **MQ-135 Air-Quality Gas Sensor** 

The MQ-135 is a gas-sensitive module used for broad air-quality-related monitoring. It responds to certain gases and gas mixtures, and its output can change as the surrounding air composition changes. It is useful for demonstrating changes in sensor response, but it cannot independently identify every gas or provide a reliable, selective measurement of a particular pollutant without suitable calibration and interpretation. 

The MQ-135 is assigned to GPIO 8 (ADC1_CH7) in the diagram. Its analog output can be sampled by the controller and compared with a baseline or experimentally selected threshold. The system may use this information to flag a potentially abnormal reading for user attention. 

HomeSafe | 10 

The MQ-135 should not be treated as a precise laboratory air-quality instrument. The sensing element and module circuitry may require a warm-up period, calibration, and appropriate power arrangements. Results should be recorded as raw or relative readings unless the sensor has been calibrated for the intended measurement. 



<!-- Start of picture text -->
@ |<br>A>a%<br>)<br><!-- End of picture text -->

Figure 4,1,1,3: MQ-135 Air-Quality Gas Sensor 

#### **Flame Sensor** 

The flame sensor module detects optical radiation associated with a flame within the characteristics of its sensing element. The pictured module provides an analog output and a digital output. The analog output represents a changing electrical signal from the module, while the digital output generally reflects whether an onboard threshold has been crossed. 

The supplied diagram assigns the analog output to GPIO 1 and the digital output to GPIO 2. The analog input may be used to observe changes in sensor response, while the digital input can support simple threshold-based detection. The precise relationship between the analog value and flame intensity depends on the module, its orientation, distance, and surrounding conditions. 

The module can be affected by ambient light, reflections, obstructions, and flame characteristics. Its output should therefore be tested under controlled conditions. It is an educational sensing component and must not be considered a replacement for a certified fire-alarm system. 



<!-- Start of picture text -->
i<br><!-- End of picture text -->

Figure 4.1.1.4: Flame Sensor 

HomeSafe | 11 

#### **<u>4.1.2 Security Subsystem</u>** 

#### **PIR Motion Sensor** 

A passive infrared (PIR) motion sensor detects changes in infrared radiation within its field of view. When a warm object moves relative to the sensor's background, the module may produce a digital output indicating detected motion. PIR sensors are commonly used in occupancy and basic intrusion-monitoring applications. 

The pictured sensor is assigned to GPIO 15. The controller reads its digital output and can use the signal to generate an event or warning when the system is in its armed mode. In an unarmed mode, motion may still be displayed or logged without activating a security alarm, depending on the implemented software. 

A PIR sensor does not identify a person and may not detect stationary occupants. Its performance depends on placement, field of view, environmental conditions, and the module's delay and sensitivity settings. These factors should be considered when testing the security function. 



Figure 4.1.2.1: PIR Motion Sensor 

#### **I²S Digital Microphone** 

The microphone provides an audio input for sound monitoring and possible audio classification. Unlike a basic analog microphone module, an I²S digital microphone sends digital audio samples using a clocked serial interface. This allows the microcontroller to acquire audio data for signal processing. 

The supplied image labels the module INMP4311 and gives the following connections: 

GPIO 4 — BCLK: The bit clock synchronizes the transfer of individual audio-data bits. 

GPIO 5 — WS: The word-select or frame-sync signal identifies the audio channel or word timing. GPIO 6 — SD: The serial-data line carries the digital audio samples. 

HomeSafe | 12 

The model label must be checked against the physical module and its datasheet before finalizing the circuit. The commonly used INMP441 is an I²S microphone, but its name should not be substituted for the label shown in the diagram without verification. 

The microphone can provide samples for further processing, such as detecting selected sound events. The quality of classification depends on the microphone, sampling configuration, background noise, feature extraction, and trained model. The microphone does not automatically recognize sounds merely by being connected. 



<!-- Start of picture text -->
i S he,<br>SS G4 a<br><!-- End of picture text -->

Figure 4.1.2.2: I²S Digital Microphone 

#### **<u>4.1.3 Microcontroller and Supporting Hardware</u>** 

#### **ESP32-S3-WROOM-1-N16R8-based controller** 

The project uses an ESP32-S3-WROOM-1-N16R8-based controller, as identified in the project hardware baseline. The microcontroller coordinates sensor acquisition, executes programmed decision rules, manages the alarm outputs, and can support communication with a local dashboard. 

Its digital GPIO pins can interface with digital sensors, while its analog-to-digital converter (ADC) can sample suitable analog sensor outputs. Its I²S interface supports digital audio acquisition, subject to the selected board's pin routing and firmware configuration. Wireless networking can be used for local monitoring when enabled and configured. 

The controller does not make sensor measurements accurate by itself. Reliable operation depends on appropriate sensor interfaces, compatible voltages, correct pin configuration, stable power, and software that handles the inputs correctly. 

The GPIO assignments in the supplied diagram must be checked against the exact development board and firmware. In particular, the DHT11 assignment to GPIO 45 should be tested because of the pin's board-specific and boot-configuration considerations. 

HomeSafe | 13 



Figure 4.1.3.1: ESP32-S3-WROOM-1-N16R8-based controller 

#### **Buzzer** 

The buzzer serves as the audible warning output. When the software identifies a condition that meets an alert rule, the controller can activate the buzzer directly if the electrical requirements permit, or through a suitable transistor or driver circuit if required. 

Different warning patterns may be assigned to different event types, provided that the firmware implements them. The report should only describe specific patterns—such as separate gas and motion alarm tones—if those patterns are actually programmed and tested. 



Figure 4.1.3.2: Buzzer 

HomeSafe | 14 

#### **Indicator LEDs** 

If an RGB LED or separate indicator LEDs are fitted, they can provide a visual representation of the system state. For example, the firmware could use different colours or blink patterns to represent normal operation, an active warning, or a disarmed state. These meanings must be explicitly defined in the software so that the user can interpret the indicators correctly. 



<!-- Start of picture text -->
©. .<br><!-- End of picture text -->

Figure 4.1.3.3: Indicator LEDs 

#### **Assembly of Hardware** 



<!-- Start of picture text -->
ie<br>ls LCE ok |<br>i]<br>KN 7 greal |<br><!-- End of picture text -->

Figure 4,1,1:Assembly of hardwares 

HomeSafe | 15 



Figure 4.1.2:Final Project 

#### **<u>4.2 Software</u>** 

#### **<u>4.2.1 Firmware Modules</u>** 

#### **app_state.h:** 

Shared Runtime State: Defines the shared runtime state used by different firmware modules. It helps maintain and access information about the current operating condition of the system, allowing components such as sensor processing, security logic, alarm handling, and networking to work with consistent state information. 

#### **audio.cpp/.h** : 

Audio Acquisition and TinyML Inference: Provides the audio subsystem interface and implements I²S microphone data acquisition and continuous TinyML inference using the generated Edge Impulse model. This module captures digital audio samples, processes them through the configured inference pipeline, and makes audio-classification results available to the rest of the firmware. Those results can then be used by the application logic according to the implemented event-handling rules. 

HomeSafe | 16 

#### **config.h:** 

Hardware and System Configuration: Stores centralized configuration values, including GPIO pin assignments, timing intervals, detection thresholds, and network-related constants. Keeping these values in one location makes the firmware easier to configure and maintain, since hardware connections and operating parameters can be adjusted without searching through multiple implementation files. 

#### **models.h:** 

Data Models: Defines the data structures used to represent sensor measurements, security states, alarm conditions, and device information. These models provide a consistent format for passing information between modules and for preparing system status data for communication with the application. 

#### **network.cpp/.h:** 

Network Communication and Protocol Handling: Provides the network interface and implements Wi-Fi connectivity, WebSocket communication, message serialization, and command handling. It allows the firmware to exchange status updates and commands with the application using the project's communication protocol. Sensor readings, alarm states, and other supported information can be converted into structured messages, while incoming commands are processed according to the implemented protocol rules. 

#### **outputs.cpp/.h:** 

Buzzer and RGB LED Control: Provides a centralized interface for controlling the buzzer and RGB LED. It implements output arbitration so that different modules can request an alert or indicator state through a common control mechanism. Centralizing output decisions helps coordinate competing requests and maintain consistent output behaviour when multiple events occur. 

#### **protocol.h:** 

Communication Protocol Definitions: Defines the names, commands, and error codes used by Protocol Version 1. These definitions establish a common vocabulary for communication between the firmware and the application, reducing inconsistencies in message names and command handling. The protocol definitions also provide a standard way to represent recognized commands and communication errors. 

#### **safety.cpp/.h:** 

Environmental Hazard Monitoring and Alarm Logic: Provides the environmental safety interface and implements hazard confirmation, alarm activation, and cooldown behaviour. It evaluates relevant sensor conditions according to the configured safety rules, confirms potential hazards where required, and manages the associated alarm state. Cooldown logic can help prevent repeated triggering during a single continuing event, depending on its implementation. 

HomeSafe | 17 

#### **security.cpp/.h:** 

Security Modes and Scheduling: Provides the security interface and implements armed-mode behaviour, PIR-based motion alarms, time-based scheduling using Network Time Protocol (NTP), and persistent settings through the Preferences storage system. It determines how motion events are handled according to the security state and configured schedule. Preferences allows supported settings to be retained across restarts, while NTP provides network-synchronized time for schedule evaluation. 

### **<u>5. ARCHITECTURE OF THE PROPOSED SYSTEM</u>** 

#### **<u>5.1 System Architecture</u>** 

The proposed architecture consists of four main layers: sensor inputs, embedded processing, local outputs, and local-network/application communication. The environmental sensing layer contains the DHT11, MQ-2, MQ-135, and flame sensor. The security sensing layer contains the PIR sensor and INMP441 microphone. The ESP32-S3 collects the signals and passes them to the appropriate firmware modules. Confirmed conditions can request buzzer or RGB LED responses. The network layer supports communication with an Android application over Wi-Fi and WebSocket. 



<!-- Start of picture text -->
MotionSensor [ ‘YY wsi<br>>= Actuate<br>LOCAL<br>| OUTPUTS<br>DHT22| CREEP >») |<br>Temp/Hum BEET i]<br>Sensor :<br>A ro<br>f e<br>S19sal -6-88-55= ~gt —<br>nse<br>is : = 5©<br>—_ FIRMWARE —_EVENTLOGIC ESTABLISH SEND EVENT<br>yr PROCESSOR _(Alarm Trigger?) INTERNET = DATATO CLOUD<br>PIRSensor Motion ee©.. (Collects@ raw data) CONNECTION(Wi-Fi) (ReactMOBILE Native) APP<br>LOR Photoresistor MEMS 12S<br>Gas Sensor Light Level Microphone<br>ENHANCED ENVIRONMENTAL SENSOR HUB<br>(Temp/Hum, Motion, Gas, Light, Sound)<br>Multiple sensor inputs combined<br><!-- End of picture text -->

Figure 5.1:System Architecture 

HomeSafe | 18 

#### **<u>5.2 Block Diagram</u>** 

The block diagram illustrates the overall architecture of the HomeSafe system and the interaction between its major components. The environmental sensing subsystem consists of the flame, gas, and temperature sensors, while the security subsystem includes the PIR motion sensor and microphone. These components are connected to the ESP32-S3 microcontroller, which processes sensor data, executes the safety and security logic, and controls the buzzer and RGB LED for local alerts. The microcontroller also communicates with the Android application over a local Wi-Fi network using WebSocket and JSON protocols. 



<!-- Start of picture text -->
(Sensingunit  ==————S=~«*S*S« Provcesssingnit =}<br>IH MQ-2 ac}ia| i' egrrpioggmgs| Output Unit crac \<br>i (Gas/Smoke) (raiog) |] | i i H<br>‘ Pome fie: {_GPI0_| rap) ere i i<br>i (AirMQ-135Quality) (rai) tl)| | 4h| ESP32-S3 |H ewnwbigea' harm) ;i<br>{! DHTI1 AOC‘it :(Wi-Fi, Bluetooth} J !7 HH Qae cei 'i<br>i (Temp & Humidity) ‘analogy, «||» Sensor Acquisition H H H<br>1 + TinyML Audio Classification |! See eR<br>Hi (Digital) (ota)GPO _|__i)| 1] . AlarmHazard control& Security Logic i' icinaiaaaaaCommunication unit sali i<br>j} ieee oj}||] ++ DataCommunication Handing (Wi-Fi) H 'H<br>H INMP441 as a ! i if i<br>iH U-ion@7y 4 (Charging‘Mar & Protection) tt DC-DC Buckoy) Converter Castile 33ai V elicit) Rail Hi<br>t }<br><!-- End of picture text -->

Figure 5.1:Block diagram of the system. 

HomeSafe | 19 

#### **<u>5.3 Circuit Diagram</u>** 

The circuit diagram shows the electrical connections between the ESP32-S3 microcontroller and the various hardware components of the HomeSafe system. It illustrates the GPIO connections for the sensors, the I²S interface for the microphone, and the output connections for the buzzer and RGB LED. The diagram also indicates the power supply and common ground connections required for proper operation. These connections enable the microcontroller to collect sensor data, process events, and activate the appropriate outputs. 



<!-- Start of picture text -->
—_ 33 — 5V —— GND —— Digital —— Analog —— Output<br>BMP/IMU441(28 /12c) . { -anm ) Flame sensor<br>3v3<br>Onmaag sv | (igita)<br>voo — [oliiebtaaeld aD | \— | er tTea| — | — eno — vc<br>cNoSCL ————— iaeEinsSoe Pe [—6@ 100Ea || se sonscre EE09 @ | ‘oe |40 ———_ == So<br>°° al<br>PIR 2 102 | wo” @<br>sensor 1 103 | 106 a| RGB LED<br>GNDvec(Digital) ———— 3V3GND104 CeCe@le ee105108 i ‘orsovo2x6sa@| im serailtetors oc—(Common Anode)ff — COM sv<br>our —— |@ 07 mm onal 1013, -<br>a lo@ icc wrmee@)<br>(Analog)ed 3v3 Te1@ 0 onatl@ (emp.DHTI1and Humidity)<br>Lc o> * GND ah jon tow al}<br>onooo —— OaAC JE) 101 lbs1@lS co ceeieetcea|ast @al 1012 ata —— ——we ono By<br>Mae Fri uss Buzzer<br>(Analog) ° ails ae (Active, 5V)<br>oi<br>a» ° oxo —] om on —we<br>cn» — BCOaJE 102 —GO f--ka8 +— — oo<br>12C / Analog Output<br><!-- End of picture text -->

Figure 5.3:Circuit Diagram 

HomeSafe | 20 

#### **<u>5.4 Pin Connections</u>** 

Table 5.4:Table of pin connections 

|Component / Signal|ESP32-S3 GPIO|Interface|
|---|---|---|
|INMP441 SCK/BCLK|GPIO 4|I²S clock|
|INMP441 WS|GPIO 5|I²S word select|
|INMP441 SD|GPIO 6|I²S data|
|DHT11 data|GPIO 45|Digital data|
|MQ-2 analogoutput|GPIO 9|ADC input|
|MQ-135 analogoutput|GPIO 8|ADC input|
|Flame sensor analogoutput|GPIO 1|ADC input|
|Flame sensor digital output|GPIO 2|Digital input|
|PIR output|GPIO 15|Digital input|
|RGB LED red|GPIO 40|Output|
|RGB LEDgreen|GPIO 39|Output|
|RGB LED blue|GPIO 38|Output|
|Buzzer control|GPIO 21|Output|



### **<u>6. LOCAL COMMUNICATION PROTOCOL AND NETWORKING</u>** 

#### **<u>6.1 Networking Architecture</u>** 

The networking subsystem enables the ESP32-S3 controller to communicate sensor readings, device status, and alarm events to the local application. The controller uses Wi-Fi for network connectivity and WebSocket communication for exchanging information with the dashboard. This allows the user to monitor environmental conditions, view security status, and receive updates about detected events from a compatible device connected to the same network. 

The firmware uses WebSocket port 81 for communication. It attempts Wi-Fi reconnection at a configured interval of 5,000 ms and uses a client heartbeat interval of 10,000 ms. These settings support connection management and periodic communication with the application. The firmware also maintains an internal state signature so that updates can be sent when tracked device information changes, rather than repeatedly transmitting identical state data. 

The system is designed around local communication, reducing the need for an external cloud platform for routine monitoring. However, the availability of the dashboard depends on the controller, Wi-Fi network, and application connection. Sensor monitoring and local alarm functions should remain independent of dashboard connectivity wherever supported by the 

HomeSafe | 21 

firmware. The controller's behaviour during network disconnection must be evaluated separately from its normal connected operation. 

#### **<u>6.2 WebSocket</u>** 

WebSocket is a communication protocol that provides a persistent, bidirectional connection between two endpoints. After the connection is established, both endpoints can exchange messages without creating a new HTTP request for every update. This makes WebSocket suitable for applications that need to receive changing sensor readings and event notifications with relatively low communication overhead. 

In this project, WebSocket is used to exchange supported status information and commands between the ESP32-S3 firmware and the local dashboard. The firmware can transmit changes in sensor readings, alarm states, security status, and other tracked device information. The application can send supported commands back to the controller, allowing the user interface to interact with the device according to the implemented command set. 

The firmware configuration specifies port 81 for the WebSocket service, a 5,000 ms Wi-Fi reconnection interval, and a 10,000 ms client heartbeat interval. The network module also maintains a pending-event queue with a capacity of eight events. This queue provides limited storage for events awaiting handling; its behaviour when full depends on the implemented queuemanagement logic. 

WebSocket provides the communication channel, but it does not determine whether sensor readings are accurate or whether an event represents a genuine hazard. Sensor validation, threshold evaluation, security decisions, and alarm activation are handled by the relevant firmware modules. This separation allows the communication subsystem to transmit system information without being responsible for the underlying safety decisions. 

#### **<u>6.3 JSON Protocol</u>** 

JavaScript Object Notation (JSON) is a lightweight text-based data format used to exchange structured information between the firmware and the application. JSON represents information through key-value pairs, arrays, and nested objects. Its readable structure makes it convenient for transmitting sensor measurements, device states, alarm conditions, and event information. 

The project's communication protocol uses defined message names, commands, and error codes, as specified in protocol.h. The network module serializes device information into messages for transmission and processes supported incoming commands. Using consistent field names and data types helps the firmware and dashboard interpret the same message correctly. 

HomeSafe | 22 

A conceptual example of a device-state message is shown below: 



<!-- Start of picture text -->
t<br>"temperature": 28.0,<br>"humidity": 65,<br>“mq2_raw": 450,<br>“mq135_raw": 180,<br>"flame_detected": false,<br>"motion_detected": false,<br>"armed": false,<br>"environmental_alarm_active": false,<br>“security_alarm_active": false<br>}<br><!-- End of picture text -->

This example illustrates how sensor measurements and device states can be represented in JSON. The numerical values are illustrative, not actual measurements from the device, and the field names should be checked against the implemented serialization code before being treated as the exact protocol schema. 

The firmware uses state-change tracking to identify when monitored information has changed. When a tracked value changes, the network module can prepare and transmit an updated state message to connected clients. This approach can reduce unnecessary repeated transmissions while keeping the dashboard informed about relevant changes. The module also handles incoming commands according to the supported protocol definitions. 

JSON makes the exchanged data readable and extensible. Additional fields, such as audioclassification results, sensor-validity indicators, device connectivity status, or event identifiers, can be included when supported by the firmware. Any changes to the message structure must be reflected consistently in both the controller and the application. 

Overall, the combination of Wi-Fi, WebSocket, and JSON provides the communication framework for local monitoring and control. Wi-Fi supplies network connectivity, WebSocket maintains the communication channel, and JSON organizes the exchanged information into structured messages. Together, these components allow the application to present device information and interact with the controller while leaving sensor processing and alarm decisions to the appropriate firmware modules. 

HomeSafe | 23 

### **<u>7.TINYML AND AUDIO CLASSIFICATION</u>** 

#### **<u>7.1 Overview</u>** 

HomeSafe incorporates a TinyML-based audio classification system to recognize selected emergency-related sounds locally on the ESP32-S3. An INMP441 digital microphone captures audio, which is processed by an embedded machine-learning model developed using Edge Impulse. Unlike conventional sensor-based detection, which relies on predefined thresholds, audio classification allows the system to identify sound patterns associated with potential emergencies. 

The classifier recognizes five categories: alarm, distress, glass_break, impact, and normal. These represent alarm sounds, distress-related sounds such as screams or calls for help, breaking glass, forceful impacts, and ordinary environmental audio, respectively. 

#### **<u>7.2 Dataset Preparation</u>** 

An audio dataset was assembled and organized into five class-specific categories. Audio clips were collected and curated to represent the different sound types, with normal environmental sounds included to help the model distinguish potential emergencies from everyday activity. Data Source: ESC50 dataset, Freesound. 

The dataset was divided into training and testing subsets.Total 813 data used for training set and 134 data used for test set. The training subset was used to learn the distinguishing characteristics of each class, while the separate testing subset was reserved for evaluating the trained model on previously unseen samples. 

#### **<u>7.3 Model Development and Training</u>** 

The model was developed using Edge Impulse through a series of processing and learning stages: 

**Audio input:** The model receives audio sampled at 16 kHz. 

**Windowing:** The audio is divided into analysis windows. The configured impulse uses a 2-second window with a 500 ms stride. 

**Feature extraction:** Mel-frequency cepstral coefficients (MFCCs) are extracted to represent important spectral characteristics of the audio signal in a compact feature space. 

**Classification:** A one-dimensional convolutional neural network (1D CNN) learns patterns in the extracted features and assigns the input to one of the five sound categories. 

**Model optimization:** An INT8-quantized model is selected for embedded deployment, reducing numerical precision and supporting more efficient inference on resource-constrained hardware. 

The trained model is exported as an Arduino inference library and integrated into the PlatformIO firmware. During operation, the ESP32-S3 captures microphone audio, performs inference locally, and makes the predicted sound category available to the firmware's event and safety logic. 

HomeSafe | 24 



<!-- Start of picture text -->
5 a<br>-<br><!-- End of picture text -->



<!-- Start of picture text -->
Neural Network settings !<br>Training settings<br>Number of training cycles @ 100<br>Use learned optimizer®<br>Learning rate ® 0.005<br>Training processor@ CPU oa<br>Advanced training settings .<br>Audio training options<br>Data augmentation ®<br>Add noise @ None Low High<br>Mask time bands ® None Low High<br>Mask frequency bands @ None Low High<br>Warp time axis @<br><!-- End of picture text -->

Figure 7.3:Screenshots from model development 

HomeSafe | 25 

### **<u>8. APPLICATION TESTING</u>** 

### **<u>8.1 MQ-2 Gas Sensor</u>** 

The simulated readings show an increase in the ADC value after butane gas is introduced, eventually exceeding the threshold of 900. The firmware confirms a hazard if the reading remains at or above the threshold continuously for 1,000 ms. 

Table 8.1:Data table of MQ-2 gas sensor 

|Time|MQ-2 ADC|Status|
|---|---|---|
|0|450|Normal|
|250|466|Normal|
|500|455|Normal|
|750|670|Gas Introduced|
|1000|890|Below threshold|
|1250|950|Threshold exceeded|
|1500|970|Hazard pending confirmation|
|1750|960|Hazard pending confirmation|
|2000|100|Reading decreased|



#### **<u>8.2 MQ-135 Air Quality Sensor</u>** 

The simulated readings represent a gradual increase in the sensor output as air quality changes, crossing the configured threshold of 400. A hazard is confirmed if the reading stays at or above 400 for 1,000 ms continuously. 

Table 8.2:Data table of MQ-35 air quality sensor 

|Time|MQ-135 Air Quality Sensor|Status|
|---|---|---|
|0|180|Baseline|
|250|195|Normal|
|500|205|Normal|
|750|290|Increased reading|
|1000|350|Below threshold|
|1250|410|Threshold exceeded|
|1500|435|Hazard pending confirmation|
|1750|450|Hazard pending confirmation|
|2000|190|Reading decreased|



HomeSafe | 26 

#### **<u>8.3 DHT11 Temperature and Humidity Sensor</u>** 

The readings illustrate periodic monitoring of indoor temperature and relative humidity at 2,000 ms intervals. These values are informational because the current firmware does not use temperature or humidity thresholds to trigger an alarm. 

Table 8.3:Data table of DHT11 temperature and humidity sensor 

|Time (ms)|Temperature (C)|Humidity (%RH)|Status|
|---|---|---|---|
|0|28.0|65|Valid|
|2000|28.1|64|Valid|
|4000|28.3|64|Valid|
|6000|29.0|63|Valid|
|8000|30.2|62|Valid|
|10000|30.5|62|Valid|
|12000|29.8|63|Valid|
|14000|29.2|64|Valid|



#### **<u>8.4 Flame Sensor</u>** 

The simulated digital output changes from HIGH to LOW when a possible flame is detected and returns to HIGH when detection clears. The firmware confirms a flame hazard if the active LOW signal persists for 1,000 ms. 

Table 8.4:Data table of flame sensor 

|Time (ms)|Digital Output<br>Status|
|---|---|
|0|HIGH<br>No Flame|
|100|HIGH<br>No Flame|
|200|LOW<br>Possible Flame|
|300|LOW<br>Detection active|
|400|LOW<br>Detection active|
|500|LOW<br>Detection active|
|600|LOW<br>Detection active|
|700|LOW<br>Detection active|
|800|LOW<br>Detection active|
|900|LOW<br>Detection active|
|1000|LOW<br>Detection active|
|1200|HIGH<br>Detection cleared|



HomeSafe | 27 

#### **<u>8.5 PIR Motion Sensor</u>** 

The readings demonstrate a transition from no motion to sustained motion while the security system is armed. The security alarm can be triggered if the PIR output remains HIGH continuously for 1,000 ms. 

Table 8.5:Data table of PIR motion sensor 

|Time (ms)|PIR Output|Security Mode|Status|
|---|---|---|---|
|0|LOW|Armed|No motion|
|20|LOW|Armed|No motion|
|40|HIGH|Armed|Motion detected|
|60|HIGH|Armed|Confirmation pending|
|80|HIGH|Armed|Confirmation pending|
|100|HIGH|Armed|Confirmation pending|
|500|HIGH|Armed|Confirmation pending|
|1000|HIGH|Armed|Sustained motion|
|1040|LOW|Armed|Motion signal cleared|



#### **<u>8.6 INMP441 Microphone Testing  and Audio Classifier</u>** 

#### <u>8.6.1 INMP441 Microphone Testing</u> 

**<u>Objective:</u>** <u>To verify the operation of the INMP441 digital microphone, its I²S communication with</u> the ESP32-S3, and its ability to provide audio samples to the embedded classification pipeline. 

**Procedure:** The INMP441 microphone was connected to the ESP32-S3 using the I²S interface. The microphone was powered from 3.3 V, with its clock and data signals connected as follows: 

Table 8.6: Data table of INMP441 microphone 

||INMP441 Pin|ESP32-S3 Pin|
|---|---|---|
|VDD||3.3V|
|GND||GND|
|SCK||BCLK GPIO 4|
|WS||LRCLK GPIO 5|
|SD||DOUT GPIO 6|



The firmware was configured to capture audio at a sampling frequency of 16 kHz. Serial diagnostics were used to monitor the peak amplitude and root mean square (RMS) of the captured PCM samples. 

**Results:** The recorded serial output showed nonzero PCM measurements. Across the supplied samples, the peak amplitude ranged from 167 to 651, while RMS values ranged from 74 to 286. 

HomeSafe | 28 

These nonzero measurements indicate that the audio buffer contains varying sample values, providing evidence that the microphone acquisition pipeline is receiving audio data. However, further controlled tests would be required to characterize microphone sensitivity and signal quality. 

<u>8.6.2 Audio Classifier Testing</u> 

**Objective:** To evaluate the operation of the Edge Impulse audio-classification model deployed on the ESP32-S3 and observe its predictions for the five trained sound categories. 

**Test Configuration:** The model was configured to classify audio into five categories: 

Alarm: Alarm and siren sounds. 

Distress: Screams and other distress-related sounds. 

Glass break: Breaking-glass sounds. 

Impact: Forceful impacts associated with possible forced entry. 

Normal: Ordinary environmental sounds. 

The audio pipeline uses a 16 kHz sampling rate, a two-second analysis window, a 500 ms stride, MFCC feature extraction, and a trained neural network classifier. 

A recognition threshold of 0.80 (80%) was used. A class score at or above this threshold qualifies as a candidate recognition; scores below the threshold do not meet the recognition criterion. 

**Procedure:** The firmware was deployed to the ESP32-S3 with the Edge Impulse inference library. The serial monitor was used to record the predicted class scores, digital signal processing (DSP) time, classification time, and PCM signal measurements. 

Multiple inference outputs were collected during operation. The predicted class scores were examined against the 0.80 recognition threshold to determine whether any class met the configured criterion. Processing times and PCM measurements were also recorded to assess the operation of the inference and audio-acquisition pipeline. 

#### **Results:** 

A representative serial output is shown below: 

```
[Audio] Classification:
  alarm        0.828
  distress     0.020
  glass_break  0.012
  impact       0.133
  normal       0.004
[Audio] DSP: 79 ms | Classification: 4 ms
[Audio] PCM peak=651 RMS=286
```

In this sample, the alarm class received a score of 0.828, exceeding the configured recognition threshold of 0.80. The remaining classes received lower scores. 

HomeSafe | 29 

Across the ten supplied classification outputs, the highest scores observed for each class were: Alarm         0.828   Yes Distress       0.180   No Glass break 0.652   No Impact         0.461   No Normal        0.039   No 

The reported DSP time was consistently 79 ms, and classification time was 4 ms across the supplied samples. The PCM peak and RMS measurements varied between samples, indicating changes in the captured audio signal. 



<!-- Start of picture text -->
| Model woe :<br>Lasttanngpevlormanes ain “<br>AccuRACY Loss t %) 57.54%<br>77.0% 0.65<br>uns. onea “ a * ~<br>lictatacaaicaernie *<br>hun<br>— os<br>Weighted average Precision iat<br>gee average Rcal® on<br>‘Weighted averageF1 score® on<br><!-- End of picture text -->



<!-- Start of picture text -->
fests: iacaeaia<br>t %) 57.54%<br>Metres for Cassiter x<br>Weighted average Recall® 067<br>ALARM DISTRESS GLASS BREAK: imPact WORMAL UNCERTAIN<br>auanw |. seo om om oo see<br>ee<br>oe ” 2 —— ll Cf<br>wont ey * o* I<br>atone “ “= =<br><!-- End of picture text -->

Figure 8.6:Microphone testing result 

HomeSafe | 30 

### **<u>9.SNAPSHOTS FROM SOFTWARE</u>** 

#### **<u>9.1 Home Interface</u>** 



<!-- Start of picture text -->
208 ARAB<br>o = a<br>Allclear<br>nie<br><!-- End of picture text -->



<!-- Start of picture text -->
12985 HEE<br>4 Systemdisarmed<br>is Ad<br>Clear None<br><!-- End of picture text -->



<!-- Start of picture text -->
8 eo)<br>@ Homesate ote<br>1 © )<br>Nee<br>Alarm active<br>en 7<br>5 Systemdisarmed<br>a 3<br><!-- End of picture text -->



<!-- Start of picture text -->
‘a= an<br>ms =<br>31.6 78<br>ie<br>1359mm = 410m<br>ens None<br>ie son<br>- cy es<br><!-- End of picture text -->



<!-- Start of picture text -->
eas ASB<br>F<br>Clear Detected<br>“ a<br>g MormSound Detected gga,<br>cestit =<br>‘Alarm activated 207s am<br>mmazhacard detected 1207-4<br>a) 3 = =<br><!-- End of picture text -->

Figure 9.1:Screenshot from home interface 

HomeSafe | 31 

#### **<u>9.2 Ambience Monitoring</u>** 



<!-- Start of picture text -->
1200 6 aR<br>Sensors<br>31.6<br>79, —_—<br><!-- End of picture text -->



<!-- Start of picture text -->
Chats) NEAR<br>79.<br>490...<br><!-- End of picture text -->



<!-- Start of picture text -->
jams =<<br>486 raw<br>+ ive<br>No flame<br>8<br><!-- End of picture text -->



<!-- Start of picture text -->
“FA caw aici<br>No flame<br>No motion<br>& C<br><!-- End of picture text -->

Figure 9.2:Screenshots from sensors data collection 

HomeSafe | 32 

#### **<u>9.3 Security</u>** 



<!-- Start of picture text -->
Security<br>&a<br>2SS<br><!-- End of picture text -->



<!-- Start of picture text -->
Security<br>1. stone scuty alarm<br>6a<br>apen<br><!-- End of picture text -->

Figure 9.3:Screenshots from security alert 

#### **<u>9.4 Activity</u>** 



<!-- Start of picture text -->
Activity<br><!-- End of picture text -->



<!-- Start of picture text -->
Activity<br><!-- End of picture text -->

Figure 9.4:Screenshots from activity log 

HomeSafe | 33 

#### **<u>9.5 Guidance for Software</u>** 



<!-- Start of picture text -->
12:26 HF<br>About & Guide<br>Welcome to HomeSafe<br>4 Getting Started<br>tings pe<br>. " cs n then<br>a 8 ) = =<br>————<—<br><!-- End of picture text -->



<!-- Start of picture text -->
Lad AFB<br>About & Guide<br>Welcome to HomeSafe<br>4 Getting started<br>=) Activity<br>and Sound History<br>= Personalizing HomeSafe<br>a 8 ) = ie<br>About<br><!-- End of picture text -->

Figure 9.5:Screenshots from about and guide 

HomeSafe | 34 

### **<u>10.RESULT</u>** 

HomeSafe integrates environmental monitoring, motion-based security, embedded audio classification, local alarm outputs, and mobile connectivity into a single ESP32-S3-based prototype. The results obtained during development demonstrate progress in sensor acquisition, firmware processing, and on-device audio inference. 

#### **<u>10.1 Environmental Monitoring</u>** 

The environmental monitoring subsystem is designed to detect changes in temperature, humidity, gas-related sensor readings, and flame-sensor output. The documented test scenarios illustrate how threshold-based detection and confirmation periods can distinguish sustained changes from brief fluctuations. The DHT11 provides environmental readings, while the MQ-2, MQ-135, and flame sensor provide signals for evaluating potential hazards. 

Compared with standalone sensors, HomeSafe combines these inputs within a shared firmware architecture, allowing sensor readings to be evaluated alongside the system's alarm state. In a residential setting, this approach could provide a unified interface for monitoring several environmental conditions. However, the available sensor tables are illustrative rather than verified hardware measurements, so actual detection performance remains to be established through controlled testing. 

#### **<u>10.2 Motion-Based Security</u>** 

The PIR security test scenario demonstrates the intended process of detecting motion while security mode is armed and applying a confirmation period before treating sustained motion as a security event. 

Integrating motion detection with the security state allows HomeSafe to distinguish ordinary sensor activity from motion that occurs while monitoring is enabled. In a practical home environment, this could support basic intrusion alerts without requiring a separate motionmonitoring controller. The effectiveness of this feature depends on sensor placement, the configured confirmation period, and testing under different movement conditions. 

#### **<u>10.3 Audio Classification</u>** 

The INMP441 microphone and Edge Impulse classifier extend HomeSafe beyond conventional threshold-based sensing by processing audio locally on the ESP32-S3. The supplied hardware logs contain nonzero PCM measurements, with reported DSP and classification processing times of approximately 79 ms and 4 ms, respectively. 

The model recognizes five sound categories: alarm, distress, glass break, impact, and normal. Across the ten supplied inference outputs, the alarm class exceeded the configured recognition threshold of 0.80 twice. The Edge Impulse evaluation screenshots report 77.0% validation accuracy and a separate quantized-model result of 57.54%. 

These results show that the embedded inference pipeline produces class predictions and can generate scores above the selected threshold. They also indicate that further evaluation is needed 

HomeSafe | 35 

before reliable real-world recognition can be claimed. In a home environment, background conversations, television audio, overlapping sounds, and differences in recording distance may affect predictions. Controlled tests using known audio samples are therefore necessary to determine how consistently the model distinguishes genuine emergency sounds from ordinary household noise. 

#### **<u>10.4 Software Integration and Practical Application</u>** 

The firmware organizes sensor acquisition, audio inference, safety logic, security controls, alarm outputs, and network communication into separate modules. The companion Android application provides an interface for viewing supported device information, accessing security controls, and reviewing retained events. 

The system's architecture combines local processing with mobile monitoring. Unlike a design that depends entirely on a remote server, HomeSafe performs its core sensing and inference on the ESP32-S3. The mobile connection provides an additional monitoring and control interface, while local alarms can operate independently of remote connectivity when the firmware and hardware are functioning correctly. 

HomeSafe | 36 

### **<u>11.DISCUSSION</u>** 

The Autonomous Smart Home Health & Disaster Prevention Terminal integrates environmental monitoring, security surveillance, audio classification, and local communication into a single microcontroller-based system. Using the ESP32-S3, the system collects information from the DHT11, MQ-2, MQ-135, flame sensor, PIR sensor, and INMP441 microphone to monitor indoor conditions and identify potential hazards or unusual events. 

The firmware processes sensor readings using predefined thresholds, confirmation periods, and security conditions. The MQ-2 and MQ-135 monitor changes in gas-sensing outputs, while the flame sensor detects possible fire-related events. The PIR sensor supports motion-based security monitoring when the system is armed, and the TinyML audio-classification subsystem analyzes microphone input to identify supported sound categories. The buzzer and RGB LED provide audible and visual alerts, while the Wi-Fi and WebSocket communication system allows device information and supported commands to be exchanged with the local application. 

An important feature of the project is its modular design, which separates sensor acquisition, safety logic, security management, audio processing, output control, and network communication. This structure makes the firmware easier to maintain and provides opportunities for future improvements. The use of local communication also supports monitoring without requiring a cloud platform for routine operation, although network availability remains important for dashboard access. 

Despite its potential, the system has limitations. Sensor thresholds require appropriate calibration, TinyML classification depends on the model's training and real-world performance, and hardware or network failures may affect some functions. The simulated readings demonstrate the intended decision-making process but do not establish actual detection accuracy or reliability. Therefore, practical testing under controlled conditions is necessary to evaluate response times, false alarms, sensor performance, and overall system stability. 

Overall, the project demonstrates how multiple sensing technologies, embedded firmware, TinyML, and local networking can be combined to develop a smart-home monitoring prototype. With further calibration, testing, and refinement, the system could provide a useful foundation for more comprehensive environmental monitoring and home-security applications **<u>.</u>** 

HomeSafe | 37 

### **<u>12.CONCLUSION</u>** 

The project successfully brings together different hardware and software components to develop a smart-home safety prototype based on the ESP32-S3. Its combination of environmental monitoring, security features, and audio recognition illustrates how embedded technology can help identify potential household hazards and provide timely alerts. 

Further calibration and real-world testing are necessary to improve the system’s reliability and reduce false alarms. Nevertheless, the project establishes a useful foundation for future improvements in intelligent home safety and automation. 

### **<u>13. LIMITATIONS, SAFETY CONSIDERATIONS AND FUTURE WORK</u>** 

#### **<u>13.1 Limitations Sensor accuracy and calibration</u>** 

MQ-2 and MQ-135 readings are affected by warm-up time, calibration, environmental conditions, and sensor variability. Their raw ADC outputs do not directly provide accurate gas concentrations. Audio-classification performance: The supplied Edge Impulse evaluation results indicate room for improvement, and the ten serial outputs are insufficient to establish real-world detection accuracy. Limited audio categories: The classifier recognizes only its five trained classes. Unseen sounds may be misclassified or assigned low-confidence predictions. Environmental dependence: Flame and PIR detection depend on sensor placement, coverage, sensitivity, and surrounding conditions. Connectivity dependence: Remote monitoring requires a functioning network connection. An optional ngrok tunnel also depends on the host computer and tunnel service remaining available. Prototype validation: The available test evidence does not establish that every sensor, alarm, network message, and app function has passed comprehensive end-to-end testing. 

#### **<u>13.2 Safety Considerations</u>** 

HomeSafe is an experimental prototype and must not replace certified smoke alarms, gas detectors, fire-detection equipment, or professionally installed security systems. MQ sensor outputs should be interpreted as relative sensor signals unless suitable calibration and validated conversion methods are implemented. The ESP32-S3 ADC inputs must be protected from voltages beyond their permitted limits, particularly when analog outputs originate from 5 V-powered sensor modules. The firmware should continue local hazard evaluation and alarm operation if the Wi-Fi connection or mobile application becomes unavailable. Remote access through ngrok exposes a public connection endpoint. Authentication, access restrictions, and appropriate security measures should be implemented before exposing security-control commands. False positives and missed detections remain possible. All alarm logic should be tested under controlled conditions before practical use. 

HomeSafe | 38 

#### **<u>13.3 Future Work Improve audio classification</u>** 

Expand and balance the training dataset, include more varied recording conditions, and investigate class-specific errors using confusion matrices and controlled trials. Conduct systematic sensor calibration: Characterize baseline readings, warm-up behavior, repeatability, and threshold selection using controlled and safely managed test conditions. Validate complete alarm behavior: Test whether each supported hazard or acoustic event correctly produces the intended firmware state, buzzer/LED response, and application update. Strengthen communication security: Add suitable authentication, validate commands, and improve connection recovery and remote-access protection. Improve event logging: Record timestamps, expected test classes, predicted classes, confidence scores, and alarm outcomes to support reproducible evaluation. Evaluate long-term operation: Assess stability, power consumption, sensor drift, network recovery, and resource usage during extended operation. These improvements would help move HomeSafe from a functional prototype toward a more thoroughly evaluated and dependable integrated safety-monitoring system. 

### **<u>14.REFERENCE</u>** 

1.Espressif Systems, ESP32-S3 datasheet and technical reference documentation. 

i.Datasheet: https://cdn-shop.adafruit.com/product-files/5477/esp32-s3_datasheet_en.pdf 

ii.TechnicalReferenceManual:https://cdnlearn.adafruit.com/assets/assets/000/110/710/original/es <u>p32s3_technical_reference_manual_en.pdf</u> 

2.Datasheets for the exact DHT11, MQ-2, MQ-135, INMP441, flame sensor, and HC-SR501 modules used. 

i.DHT11: https://www.waveshare.com/wiki/File:DHT11_datasheet.pdf 

ii.MQ-2: https://cdn.sparkfun.com/assets/3/b/0/6/d/MQ-2.pdf 

iii.MQ-135: https://www.alldatasheet.com/datasheet-pdf/pdf/1132551/HANWEI/MQ-135.html iv.INMP441: https://datasheet4u.com/datasheets/InvenSense/INMP441/1350167 

v.Flame Sensor & HC-SR501: https://learn.adafruit.com/ 

3.Edge impulse documentation for audio feature extraction, model training, evaluation, and embedded deployment. 

i.Audio Processing & Extraction: <u>https://docs.edgeimpulse.com/docs/edge-impulsestudio/learning-blocks/audio-classification</u> 

ii.Model Training & Testing: <u>https://docs.edgeimpulse.com/docs/edge-impulse-studio/modeltesting</u> 

HomeSafe | 39 

iii.Embedded Deployment: <u>https://docs.edgeimpulse.com/docs/deployment/running-yourimpulse-locally</u> 

- 4.PlatformIO and arduino framework documentation. 

i.PlatformIO Documentation: https://docs.platformio.org/ 

ii.Arduino Reference Guide: https://www.arduino.cc/reference/en/ 

- 5.Official react native and TypeScript documentation, plus documentation for the actual WebSocket library used. 

i.React Native Docs: https://reactnative.dev/docs/getting-started 

ii.TypeScript Handbook: https://www.typescriptlang.org/docs/ 

- 6.Primary research papers on TinyML and embedded audio-event classification. 

- i.Speech Commands Dataset (Warden, 2018): https://arxiv.org/abs/1804.03209 

ii.MicroSpeech Performance (Banbury et al., 2021): https://proceedings.mlsys.org/ 

- 7.Documentation and licensing information for the actual audio datasets used, including ESC-50 and freesound where applicable. 

i.ESC-50 Dataset Repository: https://github.com/karolpiczak/ESC-50 

ii.Freesound Audio Database: https://freesound.org/ 

### **THE END** 

HomeSafe | 40 


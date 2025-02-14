const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const courseOutlineAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a study material for Python for Exam and level of difficulty will be EASY with summary of course, list of chapters along with summary for each chapter, topic list in each chapter, all results in json format\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "course_name": "Introduction to Python Programming",\n  "difficulty": "Easy",\n  "course_summary": "This course provides a gentle introduction to Python programming, focusing on fundamental concepts and practical application. It\'s designed for beginners with no prior programming experience, and aims to build a solid foundation for further learning.",\n  "chapters": [\n    {\n      "chapter_number": 1,\n      "chapter_name": "Getting Started with Python",\n      "chapter_summary": "This chapter covers the basics of setting up Python and introduces the Python interactive environment. It also explains fundamental concepts like printing output and using comments.",\n       "topics": [\n        "Installation of Python",\n        "Introduction to the Python Interpreter",\n        "Writing Your First Program: `print()` function",\n        "Comments in Python",\n        "Basic Syntax and Structure",\n         "Running Python Programs"\n\n      ]\n    },\n    {\n      "chapter_number": 2,\n      "chapter_name": "Variables and Data Types",\n      "chapter_summary": "This chapter introduces the concept of variables for storing data, and different basic data types like integers, floats, and strings. It also explains how to perform basic arithmetic operations.",\n      "topics": [\n        "What are Variables?",\n        "Naming Conventions for Variables",\n        "Integer Data Type",\n        "Float Data Type",\n        "String Data Type",\n        "Basic Arithmetic Operations (+, -, *, /, %)",\n         "Type Conversion"\n       ]\n    },\n    {\n      "chapter_number": 3,\n      "chapter_name": "Working with Strings",\n      "chapter_summary": "This chapter focuses on working with strings, exploring various string operations, and introducing string formatting.",\n      "topics": [\n        "String Creation and Manipulation",\n        "String Concatenation",\n        "String Indexing and Slicing",\n        "String Length (`len()` function)",\n        "Common String Methods (e.g., `upper()`, `lower()`)",\n        "String Formatting (f-strings)",\n          "String Immutability"\n      ]\n    },\n     {\n      "chapter_number": 4,\n      "chapter_name": "User Input and Basic Output",\n      "chapter_summary": "This chapter teaches how to get input from the user and display output. It focuses on using input() and print() functions and how to work with strings and variables.",\n      "topics": [\n        "The `input()` function",\n        "Storing User Input in Variables",\n        "Displaying Output with `print()`",\n         "Combining Text and Variables in Output"\n\n      ]\n    },\n    {\n      "chapter_number": 5,\n      "chapter_name": "Making Decisions: Conditional Statements",\n      "chapter_summary": "This chapter covers conditional statements that allow you to make decisions based on certain conditions. It introduces `if`, `elif`, and `else` statements.",\n      "topics": [\n        "Introduction to Conditional Logic",\n        "The `if` statement",\n        "The `else` statement",\n        "The `elif` statement",\n        "Comparison Operators (==, !=, >, <, >=, <=)",\n        "Logical Operators (`and`, `or`, `not`)"\n\n      ]\n    },\n    {\n      "chapter_number": 6,\n      "chapter_name": "Repeating Actions: Loops",\n       "chapter_summary":"This chapter introduces loops for repeating a block of code multiple times. The main focus is on for and while loop with simple examples.",\n       "topics": [\n          "Introduction to Loops",\n          "The `for` loop",\n          "Iterating over a range of numbers",\n          "Iterating over strings",\n           "The `while` loop",\n          "Controlling loops with `break` and `continue`",\n           "Use of counter in loops"\n\n       ]\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const generateNotesAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate exam material detail content for each chapter, Make sure to include all topic point in the content, make sure to give content in HTML format (Do not add html, head, body, title tag). The chapters: {"chapter_title":"Introduction to Atoms", "summary":"This chapter introduces the concept of atoms as the smallest unit of an element, exploring their structure and key components.", "topic":["What are atoms?", "Atoms structure: protons, neutrons, and electrons", "The periodic table and elements", "Atomic number and mass number", "Isotopes"]}',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `
  <h2>Chapter: Introduction to Atoms</h2>
  <p>This chapter introduces the concept of atoms as the smallest unit of an element, exploring their structure and key components.</p>

  <div>
    <h3>What are atoms?</h3>
    <ul>
      <li>Atoms are the basic building blocks of matter, representing the smallest unit of an element that retains its chemical properties.</li>
      <li>They can exist individually or combine to form molecules.</li>
      <li>Historically, the concept of atoms evolved from philosophical ideas to modern scientific understanding.</li>
    </ul>
  </div>

  <div>
    <h3>Atoms structure: protons, neutrons, and electrons</h3>
    <ul>
      <li>Protons are positively charged particles in the nucleus of an atom.</li>
      <li>Neutrons are neutral particles in the nucleus, contributing to atomic stability.</li>
      <li>Electrons are negatively charged particles orbiting the nucleus in energy levels.</li>
      <li>The nucleus contains protons and neutrons, forming the atom's core.</li>
      <li>Electrons occupy areas of probability (orbitals) around the nucleus.</li>
      <li>Relative charges and masses: Protons (+1), neutrons (neutral), electrons (-1); masses differ significantly.</li>
    </ul>
  </div>

  <div>
    <h3>The periodic table and elements</h3>
    <ul>
      <li>An element is a pure substance consisting of only one type of atom.</li>
      <li>The periodic table is organized by atomic number and groups elements with similar properties.</li>
      <li>Groups (columns) contain elements with similar properties, while periods (rows) represent increasing electron shell numbers.</li>
      <li>Element symbols are shorthand representations (e.g., H for hydrogen).</li>
      <li>Elements are classified as metals, nonmetals, and metalloids.</li>
    </ul>
  </div>

  <div>
    <h3>Atomic number and mass number</h3>
    <ul>
      <li>Atomic number (Z) is the number of protons in the nucleus, identifying the element.</li>
      <li>In neutral atoms, the number of protons equals the number of electrons.</li>
      <li>Mass number (A) is the total number of protons and neutrons in the nucleus.</li>
      <li>Neutrons = Mass number - Atomic number.</li>
      <li>Standard notation includes atomic number and mass number (e.g., ₁²H).</li>
    </ul>
  </div>

  <div>
    <h3>Isotopes</h3>
    <ul>
      <li>Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons.</li>
      <li>Isotopes have identical chemical properties due to the same number of protons and electrons.</li>
      <li>Examples include carbon isotopes: C-12, C-13, and C-14.</li>
    </ul>
  </div>
        `,
        },
      ],
    },
  ],
});

export const generateStudyTypeContentAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate the flashcard on topic: React Native Basics in JSON format with front back content, Maximum 15\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "front": "What is React Native?",\n    "back": "A framework for building native mobile apps using JavaScript and React. Uses the same code for iOS and Android."\n  },\n  {\n    "front": "What is JSX?",\n    "back": "A syntax extension to JavaScript that looks like HTML. Used to define UI in React Native."\n  },\n  {\n    "front": "What are Components in React Native?",\n     "back": "Reusable building blocks of the UI. Can be functional or class-based."\n  },\n    {\n    "front": "What is the purpose of `View` in React Native?",\n    "back": "Equivalent of `div` in HTML. Used as a container to hold other components."\n  },\n  {\n    "front": "What is the purpose of `Text` in React Native?",\n    "back": "Used to display text content on the screen."\n  },\n    {\n      "front": "What are `props`?",\n      "back": "Data passed from a parent component to a child component."\n    },\n  {\n    "front": "What is `state`?",\n    "back": "Data that is managed within a component and can change over time. When state changes, the component re-renders."\n  },\n {\n    "front": "What is the purpose of `useState` hook?",\n    "back": "A React Hook for adding state to functional components."\n  },\n  {\n      "front": "How to style components in React Native?",\n      "back": "Using `StyleSheet` or inline styles object. No direct CSS support."\n    },\n    {\n        "front":"What is `Flexbox` in React Native?",\n        "back":"A layout system used in React Native to arrange elements within the parent View."\n    },\n    {\n      "front": "What is the purpose of `Image` in React Native?",\n        "back": "Used to display images, either from local files or network URLs."\n    },\n  {\n    "front": "What is the purpose of `TouchableOpacity`?",\n    "back": "A button component that provides feedback when pressed by lowering opacity."\n  },\n  {\n      "front": "What is the role of React Native CLI?",\n      "back": "The command line interface tool for creating and managing React Native projects."\n  },\n   {\n        "front":"What is hot reloading?",\n        "back":"A feature in React Native where changes to the code are reflected in the app without needing a full restart."\n  },\n    {\n        "front": "What is the purpose of `useEffect` hook?",\n        "back": "A React Hook for performing side effects (e.g., data fetching, subscriptions) in functional components."\n    }\n]\n```\n',
        },
      ],
    },
  ],
});

export const GenerateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Quiz on the topic : Introduction to Computer Networking with Question and Options along with correct answer in json format\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "quizTitle": "Introduction to Computer Networking",\n  "questions": [\n    {\n      "question": "What is the primary purpose of a computer network?",\n      "options": [\n        "To isolate individual computers",\n        "To enable resource sharing and communication between computers",\n        "To slow down data transfer rates",\n        "To make computers more difficult to use"\n      ],\n      "correctAnswer": "To enable resource sharing and communication between computers"\n    },\n    {\n      "question": "Which of the following is NOT a common type of computer network?",\n      "options": [\n        "LAN (Local Area Network)",\n        "WAN (Wide Area Network)",\n        "PAN (Personal Area Network)",\n        "SAN (Social Area Network)"\n      ],\n        "correctAnswer": "SAN (Social Area Network)"\n    },\n      {\n      "question": "A network that covers a small geographical area, like a home or office, is called a:",\n      "options": [\n        "WAN",\n        "MAN",\n        "LAN",\n         "GAN"\n      ],\n        "correctAnswer": "LAN"\n    },\n    {\n      "question": "The Internet is an example of a:",\n      "options": [\n        "LAN",\n         "MAN",\n        "WAN",\n        "PAN"\n      ],\n      "correctAnswer": "WAN"\n    },\n      {\n      "question": "What does the acronym \'IP\' stand for in the context of networking?",\n      "options": [\n        "Internet Protocol",\n        "Internal Processor",\n        "Input Parameter",\n        "Integrated Program"\n      ],\n       "correctAnswer": "Internet Protocol"\n    },\n    {\n      "question": "Which of the following is a unique identifier assigned to a network interface for communication?",\n      "options": [\n        "URL",\n        "MAC Address",\n        "DNS Server",\n        "FTP Protocol"\n      ],\n      "correctAnswer": "MAC Address"\n    },\n    {\n        "question": "Which networking device directs data packets between networks?",\n        "options": [\n          "Hub",\n          "Switch",\n          "Router",\n          "Modem"\n        ],\n        "correctAnswer": "Router"\n      },\n    {\n      "question": "A protocol is a set of rules that governs:",\n      "options": [\n        "How data is stored on a hard drive",\n        "How data is transmitted and received over a network",\n        "How a CPU executes instructions",\n        "How software applications are developed"\n      ],\n       "correctAnswer": "How data is transmitted and received over a network"\n    },\n     {\n        "question": "Which of these physical media is most commonly used in wired Ethernet networks?",\n        "options": [\n          "Fiber Optic Cable",\n          "Coaxial Cable",\n          "Twisted Pair Cable",\n          "Wireless Radio Waves"\n        ],\n        "correctAnswer": "Twisted Pair Cable"\n      },\n    {\n      "question": "What does \'bandwidth\' refer to in networking?",\n      "options": [\n        "The physical size of network cables",\n        "The amount of data that can be transmitted over a network in a given time",\n        "The speed of a computer\'s processor",\n        "The number of computers on a network"\n      ],\n       "correctAnswer": "The amount of data that can be transmitted over a network in a given time"\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const GenerateQAAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate 5-6 question-answer pairs for each subtopic under "Introduction to Computer Networks." The subtopics are:\n\nOverview of Computer Networks 🌐\nNetwork Models and Protocols 📊\nTypes of Networks (LAN, WAN, MAN) 🖧\nNetwork Devices (Routers, Switches, etc.) 📟\nData Transmission Methods 📡\nNetwork Security Basics 🔒',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: 'Okay, here are 5-6 question-answer pairs for each of the subtopics under "Introduction to Computer Networks":\n\n**Overview of Computer Networks 🌐**\n\n1.  **Question:** What is the primary purpose of a computer network?\n    **Answer:** To enable communication and resource sharing between computers and other devices.\n\n2.  **Question:** Give three examples of resources that can be shared via a computer network.\n    **Answer:** Printers, files, internet access, applications, and databases.\n\n3.  **Question:**  What are the two main categories of computer networks based on their structure?\n    **Answer:** Client-server and peer-to-peer networks.\n\n4.  **Question:** What is the role of a "host" in a network?\n    **Answer:** A host is any device that connects to a network and can send or receive data, like a computer, smartphone, or server.\n\n5.  **Question:**  Why are computer networks important in modern society?\n    **Answer:**  They facilitate communication, enable business operations, support education, provide access to information, and drive technological advancement.\n\n6.  **Question:** What is the internet and how does it relate to computer networks?\n    **Answer:** The internet is a global network of interconnected computer networks. It\'s a network of networks.\n\n**Network Models and Protocols 📊**\n\n1.  **Question:** What is a network protocol?\n    **Answer:** A network protocol is a set of rules that governs how data is transmitted over a network, ensuring devices understand each other.\n\n2.  **Question:** Name two widely used network protocols.\n    **Answer:** TCP/IP (Transmission Control Protocol/Internet Protocol) and HTTP (Hypertext Transfer Protocol).\n\n3.  **Question:** What is the purpose of the OSI model?\n    **Answer:** The OSI model is a conceptual framework that divides network communication into seven layers, each with specific functions, to help standardize network designs.\n\n4.  **Question:** What are the four layers in the TCP/IP model?\n    **Answer:** Application, Transport, Internet, and Network Interface (or Link) layers.\n\n5.  **Question:** In the TCP/IP model, which layer is responsible for routing data packets across networks?\n    **Answer:** The Internet layer.\n\n6. **Question:**  What is the role of the transport layer in the TCP/IP model?\n    **Answer:**  The transport layer provides reliable data transfer, ensuring data is delivered in the correct order and without errors, and also handles flow control and congestion.\n\n**Types of Networks (LAN, WAN, MAN) 🖧**\n\n1.  **Question:** What does LAN stand for?\n    **Answer:** Local Area Network.\n\n2.  **Question:** What is a typical geographic scope of a LAN?\n    **Answer:**  A relatively small area, such as a home, office, or building.\n\n3.  **Question:** What is a WAN and how does it differ from a LAN?\n    **Answer:** A WAN (Wide Area Network) covers a large geographic area, such as across cities or countries, unlike a LAN.\n\n4.  **Question:**  What does MAN stand for and give an example of a MAN network?\n    **Answer:** Metropolitan Area Network. An example could be a network spanning a city or a university campus.\n\n5.  **Question:** Which type of network is most likely to be used by a large corporation with offices in multiple countries?\n    **Answer:** A Wide Area Network (WAN).\n\n6.  **Question:** Which type of network would be most suitable for connecting devices within a single home?\n    **Answer:** A Local Area Network (LAN).\n\n**Network Devices (Routers, Switches, etc.) 📟**\n\n1.  **Question:** What is the main function of a router?\n    **Answer:** To forward data packets between networks, choosing the best path for data transmission.\n\n2.  **Question:** What is the function of a switch within a LAN?\n    **Answer:** To connect devices within a network and forward data packets only to the intended recipient, based on MAC addresses.\n\n3.  **Question:** What is a modem, and what does it do?\n    **Answer:** A modem modulates and demodulates signals to allow digital data to be transmitted over analog communication channels, like telephone lines or cable TV lines.\n\n4.  **Question:** What is a network interface card (NIC)?\n    **Answer:** A network interface card (NIC) is hardware that allows a computer to connect to a network.\n\n5.  **Question:** How does a hub differ from a switch?\n     **Answer:** A hub broadcasts data to all connected devices, while a switch forwards data only to the intended recipient, based on its MAC address.\n\n6.  **Question:** What is the role of a firewall in a network?\n    **Answer:** A firewall is a security device that controls network traffic, blocking unauthorized access to a network.\n\n**Data Transmission Methods 📡**\n\n1.  **Question:** What is the difference between wired and wireless data transmission?\n    **Answer:** Wired transmission uses physical cables, while wireless uses radio waves or other forms of electromagnetic radiation to send data.\n\n2.  **Question:**  What are some examples of common wired transmission media?\n    **Answer:** Coaxial cable, twisted-pair cable, and fiber optic cable.\n\n3.  **Question:** What is a common wireless transmission method used in Wi-Fi networks?\n    **Answer:** Radio waves.\n\n4.  **Question:** What are some factors that affect data transmission speed?\n    **Answer:** Bandwidth, latency, interference, and the quality of the transmission medium.\n\n5.  **Question:** What is bandwidth in the context of network transmission?\n    **Answer:** Bandwidth is the maximum amount of data that can be transmitted over a network connection in a given period of time.\n\n6.  **Question:** What is latency?\n    **Answer:** Latency refers to the delay or lag experienced in transmitting data from one point to another over the network.\n\n**Network Security Basics 🔒**\n\n1.  **Question:** Why is network security important?\n    **Answer:** To protect networks and data from unauthorized access, damage, and theft.\n\n2.  **Question:** What is a common method of securing a wireless network?\n    **Answer:** Using strong passwords and encryption protocols such as WPA2 or WPA3.\n\n3.  **Question:** What is a password policy, and why is it important?\n    **Answer:** A password policy defines rules for creating strong passwords, including minimum length and complexity requirements, to improve security.\n\n4.  **Question:** What are common types of network attacks?\n    **Answer:** Malware attacks (viruses, worms), phishing attacks, denial-of-service (DoS) attacks, and man-in-the-middle attacks.\n\n5.  **Question:** What is encryption in the context of network security?\n    **Answer:** Encryption is the process of converting data into an unreadable format (ciphertext) to prevent unauthorized access.\n\n6. **Question:**  What is multi-factor authentication (MFA) and why is it important?\n    **Answer:** MFA is a security system that requires multiple forms of verification (like a password and a code from a phone) to access an account, adding an extra layer of protection against unauthorized access.\n\nI hope these question-answer pairs are helpful! Let me know if you have any other requests.\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());

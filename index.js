import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function getDataAndUpdateButtons() {
    console.log('getDataAndUpdateButtons');
    const devicesRef = ref(database);

    onValue(devicesRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        
        if (data) {
            const buttons = {
                'yard-light': data.yard ? data.yard.light === true : false,
                'hallway-light': data.hallway ? data.hallway.light === true : false,
                'meeting-room-light': data.meetingRoom ? data.meetingRoom.light === true : false,
                'meeting-room-projector': data.meetingRoom ? data.meetingRoom.projector === true : false,
                'dorm-light': data.dorm ? data.dorm.light === true : false,
                'dorm-door': data.dorm ? data.dorm.door === true : false,
            };

            Object.keys(buttons).forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.classList.toggle('on', buttons[buttonId]);
                }
            });
        }
    });
}


function setupButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const deviceId = event.target.id;
            let state = false;

            if (button.classList.contains('on')) {
                state = false;
                button.classList.remove('on');
            } else {
                state = true;
                button.classList.add('on');
            }

            let location;
            let deviceType;

            if (deviceId.startsWith('meeting-room')) {
                location = 'meetingRoom';
                deviceType = deviceId.split('meeting-room-')[1];
            } else {
                [location, deviceType] = deviceId.split('-');
            }

            updateDeviceState(location, deviceType, state);
        });
    });
}

async function updateDeviceState(location, deviceType, state) {
    const deviceRef = ref(database, `${location}/${deviceType}`);
    await set(deviceRef, state);
}



window.addEventListener('DOMContentLoaded', () => {
    setupButtons();
    getDataAndUpdateButtons();
});



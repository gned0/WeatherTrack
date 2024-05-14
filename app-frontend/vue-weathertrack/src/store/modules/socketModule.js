import { io } from "socket.io-client";

const notificationSocket = io("http://localhost:3000/notifications");

const socketModule = {
  state: {
    notificationSocket,
    dataSockets: {},
  },
  mutations: {
    setDataSocket(state, { location, socket }) {
      state.dataSockets[location] = socket;
    },
  },
  actions: {
    async fetchLocations({ commit }) {
      try {
        const response = await fetch("http://localhost:3000/locations");
        const data = JSON.parse(await response.text());
        
        // Check if the response contains a "locations" key
        if (data && data.hasOwnProperty('locations')) {
          const locations = data.locations;
          
          if (Array.isArray(locations)) {
            // If locations is an array, iterate over it
            locations.forEach((location) => {
              const dataSocket = io(`http://localhost:3000/data-${location}`);
              commit("setDataSocket", { location, socket: dataSocket });
            });
          } else if (typeof locations === 'object' && locations !== null) {
            // If locations is an object, iterate over its entries
            Object.entries(locations).forEach(([location, value]) => {
              const dataSocket = io(`http://localhost:3000/data-${location}`);
              commit("setDataSocket", { location, socket: dataSocket });
            });
          } else {
            console.error("Locations data has an unexpected format:", locations);
          }
        } else {
          console.error("Response does not contain a 'locations' key:", data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }
  },
  getters: {
    getNotificationSocket: (state) => state.notificationSocket,
    getDataSockets: (state) => state.dataSockets,
  },
};

export default socketModule;

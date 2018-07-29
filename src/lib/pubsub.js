export default class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe = (name, callback) => {
    if(!this.events.hasOwnProperty(name)) {
      this.events[name] = [];
    }
    return this.events[name].push(callback);
  };

  publish = (name, data = {}) => {
    if(!this.events.hasOwnProperty(name)) {
      return [];
    }
    return this.events[name].map(callback => callback(data));
  };
}
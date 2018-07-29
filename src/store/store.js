import PubSub from '../lib/pubsub';

export default class Store {
  constructor(params) {
    this.actions = params.hasOwnProperty('actions') ? params.actions : {};
    this.mutations = params.hasOwnProperty('mutations') ? params.mutations : {};
    this.state = this.onInitializeState(params);
    this.status = 'resting';
    this.events = new PubSub();
  }


  onInitializeState = (params) => {
    return new Proxy((params.state || {}), {
      set: (state, key, value) => {
        state[key] = value;
        console.log(`stateChange: ${key}: ${value}`);
        this.events.publish('stateChange', this.state);
        if (this.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }
        this.status = 'resting';
        return true;
      }
    });
  };

  dispatch = (actionKey, payload) => {
    if(typeof this.actions[actionKey] !== 'function') {
      console.error(`Action ${actionKey} doesn't exist`);
      return false;
    }
    console.groupCollapsed(`Action: ${actionKey}`);
    this.status = 'action';
    this.actions[actionKey](this, payload);
    console.groupEnd();
    return true;
  };

  commit = (mutationKey, payload) => {
    if(typeof this.mutations[mutationKey] !== 'function') {
      console.error(`Mutation ${mutationKey} doesn't exist`);
      return false;
    }
    this.status = 'mutation';
    const newState = this.mutations[mutationKey](this.state, payload);
    this.state = Object.assign(this.state, newState);
    return true;
  }

}
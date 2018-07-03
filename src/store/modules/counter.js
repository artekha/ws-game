import { TICK_START, TICK_CLEAR, TIME_LEFT_UPDATE } from "../constants";

const state = {
  timeLeft: null,
  tickInterval: null
};

const getters = {
  timeLeft: state => state.timeLeft
};

const actions = {
  startTick({ commit, state }) {
    const interval = setInterval(() => {
      if (state.timeLeft) {
        const newTime = state.timeLeft - 1;
        commit(TIME_LEFT_UPDATE, newTime);
      }
    }, 1000);
    commit(TICK_START, interval);
  },
  clearTick({ commit, state }) {
    clearInterval(state.tickInterval);
    commit(TICK_CLEAR);
  }
};

const mutations = {
  [TICK_START](state, payload) {
    state.tickInterval = payload;
  },
  [TICK_CLEAR](state) {
    state.tickInterval = null;
  },
  [TIME_LEFT_UPDATE](state, newTime) {
    state.timeLeft = newTime;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

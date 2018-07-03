import Vue from "vue";
import Vuex from "vuex";

import { getCurrentGame } from "../api/helpers";
import { GAME_UPDATE, TIME_LEFT_UPDATE } from "./constants";

import counter from "./modules/counter";

Vue.use(Vuex);

const state = {
  colors: null,
  winNum: null
};

const getters = {
  colors: state => state.colors,
  winNumParsed: state => (state.winNum ? Math.floor(state.winNum) : false)
};

const actions = {
  async getGame({ state, commit, dispatch }) {
    const game = await getCurrentGame();
    const time = game.WinNum ? game.TimeLeftNext : game.TimeLeft;
    commit(GAME_UPDATE, game);
    commit(TIME_LEFT_UPDATE, time);
    dispatch("startTick");
  }
};

const mutations = {
  [GAME_UPDATE](state, payload) {
    let splittedColors = payload.Colors.split("");
    let array = splittedColors.map((item, index) => {
      return {
        color: item,
        index: splittedColors.length - index
      };
    });
    state.colors = array;
    state.winNum = payload.WinNum;
  }
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state,
  getters,
  actions,
  mutations,
  modules: {
    counter
  }
});

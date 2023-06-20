import { defineStore } from 'pinia';

export const useIdDetailStore = defineStore({
  id: 'idDetail',
  state: () => ({
    idDetail: null,
  }),
  actions: {
    setIdDetail(id) {
      this.idDetail = id;
    },
  },
});

import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => {
    const startingDate = new Date();
    const leavingDate = new Date(startingDate);
    leavingDate.setDate(startingDate.getDate() + 1);

    return {
      isInOrderProcess: false,
      memberDetails: null,
      roomOrderId: '',
      residentCount: 0,
      totalPayment: 0.0,
      startingDate,
      leavingDate,
      usedPoints: 0,
      totalPaymentBeforeUsedPoints: 0,
      roomCombination: [], // 改為陣列 [{ roomTypeId, roomTypeName, roomCount }]
    };
  },
  actions: {
    setOrderInfo(roomOrderId, memberDetails, residentCount, totalPayment, startingDate, leavingDate, totalPaymentBeforeUsedPoints, roomCombination) {
      this.roomOrderId = roomOrderId;
      this.memberDetails = memberDetails;
      this.residentCount = residentCount;
      this.totalPayment = totalPayment;
      this.totalPaymentBeforeUsedPoints = totalPayment;
      this.startingDate = new Date(startingDate);
      this.leavingDate = new Date(leavingDate);
      this.totalPaymentBeforeUsedPoints = totalPaymentBeforeUsedPoints;
      this.roomCombination = roomCombination;
    },

    resetOrderInfo() {
      this.memberDetails = null;
      this.roomOrderId = '';
      this.residentCount = 0;
      this.totalPayment = 0.0;
      this.startingDate = new Date();
      this.leavingDate = new Date(this.startingDate);
      this.leavingDate.setDate(this.startingDate.getDate() + 1);
      this.roomCombination = [];
    },

    setBookingBar(startingDate, leavingDate, residentCount) {
      this.startingDate = startingDate;
      this.leavingDate = leavingDate;
      this.residentCount = residentCount;
    },
  },
  getters: {
    duration() {
      const diffTime = this.leavingDate - this.startingDate;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
  },
});

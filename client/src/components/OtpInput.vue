<template>
  <h3 class="text-center font-semibold text-xl mb-2">INPUT OTP :</h3>
  <div class="flex w-full justify-center">
    <div id="divOuter">
      <div id="divInner">
        <input
          id="partitioned"
          type="text"
          maxlength="6"
          class="focus:outline-none bg-gray-100 font-bold text-xl text-green-400"
          autocomplete="off"
          v-model="state.userToken"
          @keypress="checkinput($event)"
        />
      </div>
    </div>
  </div>
  <button
    class="block mx-auto px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md mt-3"
    @click="submitOTP"
  >
    SUBMIT OTP
  </button>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "OTPInput",
  emits: ["send"],
  props: ["page"],
  // eslint-disable-next-line no-unused-vars
  setup(props, { emit }) {
    const state = reactive({
      userToken: ""
    });
    function checkinput(e) {
      e = e ? e : window.event;
      var charCode = e.which ? e.which : e.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        e.preventDefault();
      } else {
        return true;
      }
    }

    function submitOTP() {
      emit("send", { token: state.userToken });
    }

    return { checkinput, state, submitOTP };
  }
};
</script>

<style scoped>
#partitioned {
  padding-left: 15px;
  letter-spacing: 37px;
  border: 0;
  background-image: linear-gradient(
    to left,
    green 70%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: 50px 1px;
  background-repeat: repeat-x;
  background-position-x: 35px;
  width: 350px;
  min-width: 350px;
}

#divInner {
  left: 0;
  position: sticky;
}

#divOuter {
  width: 290px;
  overflow: hidden;
}
</style>

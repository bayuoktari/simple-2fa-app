<template>
  <h3 class="text-center font-semibold text-xl mb-2">INPUT OTP :</h3>
  <div class="flex w-full justify-center">
    <div id="divOuter">
      <div id="divInner">
        <input
          id="partitioned"
          type="text"
          maxlength="4"
          class="focus:outline-none bg-gray-100 font-bold text-xl text-green-400"
          autocomplete="off"
          v-model="token"
          @keypress="checkinput($event)"
        />
      </div>
    </div>
  </div>
  <button
    class="block mx-auto px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md mt-3"
  >
    SUBMIT OTP
  </button>
</template>

<script>
export default {
  name: "OTPInput",
  setup() {
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
    return { checkinput };
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
  width: 250px;
  min-width: 250px;
}

#divInner {
  left: 0;
  position: sticky;
}

#divOuter {
  width: 190px;
  overflow: hidden;
}
</style>

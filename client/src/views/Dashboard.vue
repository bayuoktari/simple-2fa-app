<template>
  <div class="w-5/12 mx-auto border-2 border-gray-300 p-5 rounded-lg">
    <div v-if="!state.isFirstTime && state.userData.enable2fa">
      <div class="bg-gray-100 w-full p-4 rounded-md mb-3">
        <OTPInput />
      </div>
    </div>
    <div>
      <div class="bg-gray-200 w-full flex justify-between p-4 rounded-md mb-3">
        <p class="text-gray-600 font-semibold">
          Enable Two Factor Authentication
        </p>
        <div @click="config2FA">
          <div
            class="w-16 h-7 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"
            :class="{ 'bg-green-400': state.userData.enable2fa }"
          >
            <div
              class="bg-white w-8 h-6 rounded-full shadow-md transform duration-300 ease-in-out"
              :class="{ 'translate-x-6': state.userData.enable2fa }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="bg-gray-100 w-full mb-3 p-4"
        v-if="state.isFirstTime && state.userData.enable2fa"
      >
        <h3 class="text-center mb-2">Scan QRCode With Google Authenticator</h3>
        <img :src="state.qrUrl" alt="qrimg" class="block mx-auto mb-3" />
        <OTPInput />
      </div>
    </div>
    <button
      class="bg-red-700 py-2 px-4 rounded-md text-white block mx-auto hover:bg-red-600"
      @click="logout"
    >
      LOGOUT
    </button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, onBeforeMount } from "vue";
import OTPInput from "../components/OtpInput";
import qrcode from "qrcode";
import axios from "axios";

export default {
  name: "Dashboard",
  components: { OTPInput },
  setup() {
    const REST_API_SERVER = "http://localhost:3000/";
    const state = reactive({
      userData: {},
      isFirstTime: false,
      qrUrl: "",
      token: ""
    });
    const router = useRouter();

    onBeforeMount(() => {
      fetchDetail();
    });

    async function fetchDetail() {
      try {
        const { data } = await axios.get(`${REST_API_SERVER}api/user/`, {
          headers: { access_token: localStorage.getItem("access_token") }
        });
        state.userData = data;
        if (!state.userData.enable2fa) {
          state.isFirstTime = true;
        }
      } catch (err) {
        console.log(err.response.data);
      }
    }

    async function config2FA() {
      try {
        await axios.post(
          `${REST_API_SERVER}api/2fa/config`,
          {},
          { headers: { access_token: localStorage.getItem("access_token") } }
        );
        await fetchDetail();
        if (state.userData.secret2fa) {
          const totpUrl = state.userData.secret2fa.otpauth_url || "";
          qrcode.toDataURL(totpUrl, (err, qrdata) => {
            state.qrUrl = qrdata;
          });
        } else {
          state.qrUrl = "";
        }
      } catch (err) {
        console.log(err.response.data);
      }
    }

    function logout() {
      localStorage.removeItem("access_token");
      router.push("/");
    }
    return { logout, state, config2FA };
  }
};
</script>

<style scoped></style>

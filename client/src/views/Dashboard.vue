<template>
  <div class="w-5/12 mx-auto border-2 border-gray-300 p-5 rounded-lg">
    <!-- <div
      v-if="!state.tokenValid && state.userData.enable2fa && !state.isFirstTime"
    >
      <div class="bg-gray-100 w-full p-4 rounded-md mb-3">
        <OTPInput @send="enable2fa" />
      </div>
    </div> -->
    <div>
      <div class="bg-gray-200 w-full flex justify-between p-4 rounded-md mb-3">
        <p class="text-gray-600 font-semibold">
          Enable Two Factor Authentication
        </p>
        <div @click="config2FA">
          <div
            class="w-16 h-7 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"
            :class="{ 'bg-green-400': state.toggleOn }"
          >
            <div
              class="bg-white w-8 h-6 rounded-full shadow-md transform duration-300 ease-in-out"
              :class="{ 'translate-x-6': state.toggleOn }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="bg-gray-100 w-full mb-3 p-4"
        v-if="state.toggleOn && !state.userData.enable2fa"
      >
        <h3 class="text-center mb-2">Scan QRCode With Google Authenticator</h3>
        <img :src="state.qrUrl" alt="qrimg" class="block mx-auto mb-3" />
        <OTPInput @send="enable2fa" />
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
import Swal from "sweetalert2";
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
      secret32: "",
      qrUrl: "",
      toggleOn: false
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
        !state.userData.enable2fa
          ? (state.toggleOn = false)
          : (state.toggleOn = true);
      } catch (err) {
        console.log(err.response.data);
      }
    }

    async function config2FA() {
      if (!state.toggleOn && !state.userData.enable2fa) {
        state.toggleOn = !state.toggleOn;
        try {
          const { data: secret } = await axios.post(
            `${REST_API_SERVER}api/2fa/generate`,
            {},
            { headers: { access_token: localStorage.getItem("access_token") } }
          );
          // console.log(secret);
          // await fetchDetail();
          state.secret32 = secret.base32;
          const qrData = `otpauth://totp/Project%202fa?secret=${state.secret32}`;
          qrcode.toDataURL(qrData, (err, qrdata) => {
            state.qrUrl = qrdata;
          });
        } catch (err) {
          console.log(err.response.data);
        }
      } else if (state.toggleOn && state.userData.enable2fa) {
        // console.log(state.toggleOn);
        const respone = await Swal.fire({
          title: "Disable 2FA ?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          confirmButtonColor: "#10b981",
          confirmButtonText: "Disable"
        });
        if (respone.isConfirmed) {
          try {
            await axios.post(
              `${REST_API_SERVER}api/2fa/disable`,
              {},
              {
                headers: { access_token: localStorage.getItem("access_token") }
              }
            );
            fetchDetail();
          } catch (err) {
            console.log(err.response.data);
          }
          Swal.fire("Success!", "Your 2FA has been disabled.", "success");
        }
      } else {
        state.toggleOn = !state.toggleOn;
      }
    }

    function logout() {
      localStorage.removeItem("access_token");
      router.push("/");
    }

    async function enable2fa({ token }) {
      try {
        const { data } = await axios.post(
          `${REST_API_SERVER}api/2fa/enable`,
          { token: token, secret: state.secret32 },
          {
            headers: {
              access_token: localStorage.getItem("access_token")
            }
          }
        );
        Swal.fire({
          icon: "success",
          title: "Horray!!!",
          text: data.message
        });
        fetchDetail();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Something Wrong",
          text: error.response.data.message
        });
      }
    }

    return { logout, state, config2FA, enable2fa };
  }
};
</script>

<style scoped></style>

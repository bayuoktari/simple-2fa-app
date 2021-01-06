<template>
  <div
    class="w-4/12 mx-auto border-2 border-gray-300 p-5 rounded-lg bg-gray-100"
  >
    <OTPInput @send="verifyOTP" />
  </div>
</template>

<script>
import OTPInput from "../components/OtpInput.vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  components: {
    OTPInput
  },
  emits: ["send"],
  setup() {
    const REST_API_SERVER = "http://localhost:3000/";
    const router = useRouter();
    async function verifyOTP({ token }) {
      try {
        await axios.post(
          `${REST_API_SERVER}api/2fa/verify`,
          { token: token },
          {
            headers: {
              access_token: localStorage.getItem("access_token")
            }
          }
        );
        Swal.fire({
          icon: "success",
          title: "Horray!!!"
        });
        router.push("/dashboard");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Something Wrong",
          text: error.response.data.message
        });
      }
    }
    return { verifyOTP };
  }
};
</script>

<style></style>

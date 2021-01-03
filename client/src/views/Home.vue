<template>
  <div class="w-4/12 mx-auto border-2 border-gray-300 p-5 rounded-lg">
    <h2 class="text-center font-bold mt-3 mb-3 text-2xl text-gray-600">
      {{ state.page.toUpperCase() }} FORM
    </h2>
    <form>
      <div class="form-group" v-if="state.page === 'Register'">
        <label for="name" class="block mb-2 text-gray-700">Full Name :</label>
        <input
          type="text"
          placeholder="Jhon Doe"
          name="name"
          id="name"
          class="mx-auto p-2 w-full border rounded-md border-gray-300 mb-3"
          autocomplete="off"
          v-model="state.fullname"
        />
      </div>
      <div class="form-group">
        <label for="email" class="block mb-2 text-gray-700"
          >Email Address :</label
        >
        <input
          type="email"
          name="email"
          id="email"
          class="mx-auto p-2 w-full border rounded-md border-gray-300 mb-3"
          autocomplete="off"
          v-model="state.email"
          placeholder="email@example.com"
        />
      </div>
      <div class="form-group">
        <label for="password" class="block mb-2 text-gray-700"
          >Password :</label
        >
        <input
          type="password"
          name="password"
          id="password"
          class="mx-auto p-2 w-full border rounded-md border-gray-300 mb-3"
          v-model="state.password"
          placeholder="Your Password"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-green-400 p-3 text-white hover:bg-green-500 mb-2 rounded-lg"
        v-if="state.page === 'Login'"
        @click.prevent="login"
      >
        LOGIN
      </button>
      <button
        type="submit"
        class="w-full bg-green-400 p-3 text-white hover:bg-green-500 mb-2 rounded-lg"
        v-if="state.page === 'Register'"
        @click.prevent="register"
      >
        REGISTER
      </button>
    </form>
    <p class="text-center text-xs text-gray-600" v-if="state.page === 'Login'">
      Don't Have Account ?
      <a href="#" @click.prevent="changePage" class="text-blue-500"
        >Register Here</a
      >
    </p>
    <p
      class="text-center text-xs text-gray-600"
      v-if="state.page === 'Register'"
    >
      Already Have Account ?
      <a href="#" @click.prevent="changePage" class="text-blue-500"
        >Login Here</a
      >
    </p>
  </div>
</template>

<script>
import { reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  name: "Home",
  setup() {
    const REST_API_SERVER = "http://localhost:3000/";
    const state = reactive({
      page: "Login",
      fullname: "",
      email: "",
      password: ""
    });

    onBeforeMount(() => {
      // if (localStorage.getItem("access_token")) {
      //   router.push("/dashboard");
      // }
    });

    const router = useRouter();

    function changePage() {
      if (state.page === "Login") {
        state.page = "Register";
      } else {
        state.page = "Login";
      }
    }

    async function login() {
      try {
        const { data } = await axios.post(`${REST_API_SERVER}api/user/login`, {
          email: state.email,
          password: state.password
        });
        localStorage.setItem("access_token", data.access_token);
        state.email = "";
        state.password = "";
        state.fullname = "";
        router.push("/dashboard");
      } catch (err) {
        console.log(err.response.data.message);
      }
    }

    async function register() {
      try {
        await axios.post(`${REST_API_SERVER}api/user/register`, {
          fullname: state.fullname,
          email: state.email,
          password: state.password
        });
        state.page = "Login";
      } catch (err) {
        console.log(err.response.data.message);
      }
    }

    return { state, changePage, login, register };
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-slate-200 p-4 flex justify-center items-center uppercase text-white"
  >
    <form
      @submit.prevent="changePassword()"
      style="box-shadow: 5px 5px 50px gray"
      class="bg-gray-500 rounded-lg w-[30em] h-[28em] p-4 flex flex-col fade-in"
    >
      <h1 class="text-4xl font-bold text-center">New password</h1>

      <div class="p-4 m-4 flex gap-3 flex-col" style="font-family: Roboto">
        <span class="font-bold text-2xl text-white">Password:</span>
        <input
          type="password"
          class="w-[25em] rounded h-[3em] p-4 text-black font-black hover:bg-slate-200 transition-all focus:bg-slate-200"
          v-model="passwordRef"
          :class="{ disabledMe: submitted }"
        />
      </div>

      <div class="p-4 m-4 justify-center flex mt-auto flex-col">
        <button
          class="rounded-sm bg-white p-4 text-black uppercase text-2xl font-bold hover:bg-slate-200 transition-all focus:bg-slate-200"
          type="submit"
          :class="{ disabledMe: submitted }"
        >
          <span v-if="submitted"> Successfully changed password </span>
          <span v-else>Reset</span>
        </button>
        <div class="pt-4">
          <RouterLink
            class="font-bold text-white hover:text-slate-300 transition-all"
            :to="(name = 'login')"
            >Log in</RouterLink
          >
          <p
            style="font-size: 1em"
            class="justify-center flex text-red-500 font-bold"
          >
            {{ errRef }}
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { useRoute } from "vue-router";

export default {
  name: "PasswordResetView",

  setup() {
    const route = useRoute();

    const passwordRef = ref("");

    const submitted = ref(false);

    const errRef = ref("");

    console.log(route.query.token);

    onMounted(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        duration: 1,
        y: 20,
        ease: "power2.out",
      });
    });

    async function changePassword() {
      if (
        passwordRef.value.length < 8 ||
        !/[A-Z]/.test(passwordRef.value) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(passwordRef.value)
      ) {
        errRef.value =
          "Password must be at least 8 characters, include one uppercase letter and one special character.";
        return;
      } else {
        try {
          const res = await fetch("http://localhost:3000/update-user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: route.query.token,
              password: passwordRef.value,
            }),
          });

          const resJson = await res.json();

          submitted.value = true;

          const newCode = await fetch(
            "http://localhost:3000/create-secret-token",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: resJson.email,
              }),
            }
          );

          const newCodeJson = await newCode.json();

          console.log(newCodeJson);
        } catch (e) {
          console.log(e);
        }
      }
    }
    return {
      passwordRef,
      changePassword,
      errRef,
      submitted,
    };

    // FETCH THE REQUEST TO RESET THE PASSWORD
  },
};
</script>

<style></style>

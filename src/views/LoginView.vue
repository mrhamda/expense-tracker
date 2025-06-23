<template>
  <div
    class="min-h-screen bg-slate-200 p-4 flex justify-center items-center uppercase text-white"
  >
    <form
      @submit.prevent="LogIn()"
      style="box-shadow: 5px 5px 50px gray"
      class="rounded-lg bg-gray-500 w-[30em] h-[35em] p-4 flex flex-col fade-in"
    >
      <h1 class="text-4xl font-bold text-center">Log in</h1>

      <div class="p-4 m-4 flex gap-3 flex-col" style="font-family: Roboto">
        <span class="font-bold text-2xl text-white">Email:</span>
        <input
          type="email"
          class="w-[25em] rounded h-[3em] p-4 text-black font-black hover:bg-slate-200 transition-all focus:bg-slate-200"
          placeholder="Enter your email"
          v-model="emailRef"
          required
        />
      </div>

      <div class="p-4 m-4 flex gap-3 flex-col" style="font-family: Roboto">
        <span class="font-bold text-2xl text-white">Password:</span>
        <input
          type="password"
          class="w-[25em] rounded h-[3em] p-4 text-black font-black hover:bg-slate-200 transition-all focus:bg-slate-200"
          placeholder="Enter your password"
          v-model="passwordRef"
          required
        />
        <a
          class="font-bold text-white hover:text-slate-300 transition-all"
          href="/password"
          >Forgot password?</a
        >
      </div>

      <div class="p-4 m-4 justify-center flex mt-auto flex-col">
        <button
          class="rounded-sm bg-white p-4 text-black uppercase text-2xl font-bold hover:bg-slate-200 transition-all focus:bg-slate-200"
          type="submit"
        >
          Log in
        </button>
        <div class="pt-4">
          <RouterLink
            class="font-bold text-white hover:text-slate-300 transition-all"
            :to="(name = 'signup')"
            >Sign up</RouterLink
          >
          <p class="justify-center flex text-xl text-red-500 font-bold">
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

export default {
  name: "LoginView",

  setup() {
    const emailRef = ref("");
    const passwordRef = ref("");

    const errRef = ref("");

    onMounted(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        duration: 1,
        y: 20,
        ease: "power2.out",
      });
    });

    async function LogIn() {
      console.log("Processing");

      const res = await fetch("http://localhost:3000/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailRef.value,
          password: passwordRef.value,
        }),
      });

      const resJson = await res.json();

      console.log(typeof resJson);
      if (typeof resJson !== "object") {
        errRef.value = resJson;
      } else if (typeof resJson == "object") {
        localStorage.setItem("user", JSON.stringify(resJson));
        window.location.pathname = "/home";
      }

      console.log(resJson);
    }

    return { LogIn, emailRef, passwordRef, errRef };
  },
};
</script>

<style></style>

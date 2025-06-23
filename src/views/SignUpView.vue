<template>
  <div
    class="min-h-screen bg-slate-200 p-4 flex justify-center items-center uppercase text-white"
  >
    <form
      @submit="
        (e) => {
          signup(e);
        }
      "
      class="bg-gray-500 w-[30em] h-[40em] p-4 flex flex-col rounded-lg fade-in"
      style="box-shadow: 5px 5px 50px gray"
    >
      <h1 class="text-4xl font-bold text-center">Sign up</h1>

      <div class="p-4 m-4 flex gap-3 flex-col" style="font-family: Roboto">
        <span class="font-bold text-2xl text-white">Email:</span>
        <input
          type="email"
          required
          class="w-[25em] rounded h-[3em] p-4 text-black font-black hover:bg-slate-200 transition-all focus:bg-slate-200"
          placeholder="Enter your email"
          v-model="emailRef"
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
      </div>

      <div class="p-4 m-4 justify-center flex mt-auto flex-col">
        <button
          class="rounded-sm bg-white p-4 text-black uppercase text-2xl font-bold hover:bg-slate-200 transition-all focus:bg-slate-200"
          type="submit"
        >
          Sign up
        </button>
        <div class="pt-4">
          <RouterLink
            class="font-bold text-white hover:text-slate-300 transition-all"
            :to="(name = 'signin')"
            >Log in</RouterLink
          >

          <p style="font-size: 1em;" class="justify-center flex text-red-500 font-bold">
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
  name: "SignUpView",

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

    async function signup(e) {
      e.preventDefault();

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
          const createdAccountRes = await fetch(
            "http://localhost:3000/sign-up",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: emailRef.value,
                password: passwordRef.value,
              }),
            }
          );

          const createdAccountResJson = await createdAccountRes.json();

          if (createdAccountResJson == "User already exists!") {
            errRef.value = "User already exists!";
          }

          if (typeof createdAccountResJson == "object") {
            window.location.pathname = "/sigin";
          }

          console.log(createdAccountResJson);
        } catch (e) {
          console.log(e);
        }
      }
    }

    return {
      signup,
      emailRef,
      passwordRef,
      errRef,
    };
  },
};
</script>

<style></style>

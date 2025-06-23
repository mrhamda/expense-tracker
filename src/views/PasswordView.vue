<template>
  <div
    class="min-h-screen bg-slate-200 p-4 flex justify-center items-center uppercase text-white"
  >
    <form
      @submit.prevent="sendPasswordResetRequest()"
      style="box-shadow: 5px 5px 50px gray"
      class="fade-in rounded-lg bg-gray-500 w-[30em] h-[25em] p-4 flex flex-col"
    >
      <div>
        <h1 class="text-4xl font-bold text-center">Reset password</h1>

        <div class="p-4 m-4 flex gap-3 flex-col" style="font-family: Roboto">
          <span class="font-bold text-2xl text-white">Email:</span>
          <input
            type="email"
            class="w-[25em] rounded h-[3em] p-4 text-black font-black hover:bg-slate-200 transition-all focus:bg-slate-200"
            v-model="emailRef"
            :class="{ disabledMe: isDisabled }"
          />
        </div>
      </div>
      <div class="p-4 m-4 justify-center flex mt-auto flex-col">
        <button
          class="rounded-sm bg-white p-4 text-black uppercase text-2xl font-bold hover:bg-slate-200 transition-all focus:bg-slate-200"
          type="submit"
          :class="{ disabledMe: isDisabled }"
        >
          <span v-if="isDisabled"> Check your gmail </span>
          <span v-else>Reset</span>
        </button>
        <div class="pt-4">
          <RouterLink
            class="font-bold text-white hover:text-slate-300 transition-all"
            :to="(name = 'login')"
            >Log in</RouterLink
          >
          <p class="justify-center flex text-xl text-red-500 text-bold">
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
// import { v4 as uuidv4 } from "uuid";

export default {
  name: "PasswordView",

  setup() {
    const emailRef = ref("");

    const isDisabled = ref(false);

    const errRef = ref("");

    onMounted(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        duration: 1,
        y: 20,
        ease: "power2.out",
      });
    });

    async function sendPasswordResetRequest() {
      //FIX VERTIFCATION PASSWORD
      try {
        const getToken = await fetch(
          "http://localhost:3000/create-secret-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailRef.value,
            }),
          }
        );

        const getTokenData = await getToken.json();

        console.log("Token", getTokenData.token);

        const html = `
<div style="background-color: #f4f4f5; padding: 2rem; font-family: Arial, sans-serif; display: flex; justify-content: center;">
  <div style="max-width: 400px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

    <div style="background-color: #1e293b; padding: 1.5rem;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Tracker</h1>
    </div>

    <div style="padding: 1.5rem; text-align: center;">
      <p style="font-size: 16px; color: #0f172a; margin-bottom: 1.5rem;">
        You requested a password reset. Click the button below to proceed:
      </p>

      <a href="http://localhost:3001/passwordReset/?token=${getTokenData.token}"
         style="display: inline-block; background-color: #3b82f6; color: white; font-weight: bold; text-transform: uppercase; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 6px; margin-bottom: 1.5rem;">
        Reset your password
      </a>

      <p style="font-size: 14px; color: #475569;">Reset request for:</p>
      <p style="font-weight: bold; color: #0f172a;">${emailRef.value}</p>
    </div>
  </div>
</div>
`;

        const res = await fetch("http://localhost:3000/send-code-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailRef.value,
            html: html,
          }),
        });

        const resJson = await res.json();

        isDisabled.value = true;

        console.log(resJson);
      } catch (e) {
        console.log(e);
        errRef.value = e;
      }
    }

    return {
      emailRef,
      sendPasswordResetRequest,
      isDisabled,
    };
  },
};
</script>

<style></style>

<template>
  <nav
    class="bg-gray-600 p-4 font-bold text-2xl uppercase flex justify-between "
  >
    <div class="">
      <router-link to="/home" class="">Expense Tracker</router-link>
    </div>

    <button
      class="uppercase text-blue-50 hover:text-slate-400 transition-all"
      @click="logout"
    >
      Logout
    </button>
  </nav>
  <div
    class="bg-slate-200 min-h-screen w-full overflow-hidden p-4 font-bold text-xl flex justify-center items-center"
    style="font-family: Roboto"
  >
    <div class="fade-in h-[40em] w-[25em] bg-gray-600 relative">
      <nav class="min-w-full h-[3em] bg-slate-100 flex justify-between">
        <input
          type="number"
          class="p-4 w-24 hover:bg-slate-200 transition-all focus:bg-slate-200"
          placeholder="123"
          v-model="costMonitor"
        />

        <input
          type="text"
          class="p-4 hover:bg-slate-200 transition-all focus:bg-slate-200"
          placeholder="DESCRIPATION"
          v-model="descMonitor"
        />

        <button
          class="bg-white p-4 uppercase text-xl font-bold hover:bg-slate-200 transition-all focus:bg-slate-200"
          @click="addExpense(costMonitor, descMonitor)"
        >
          <img src="../assets/plus.png" alt="" />
        </button>
      </nav>

      <div class="p-4 overflow-y-auto h-[35em]" v-if="expensese">
        <div v-for="(exp, index) in expensese" :key="index">
          <ExpenseItem
            :cost="exp.cost"
            :desc="exp.desc"
            :removeExpense="removeExpense"
            :id="exp._id"
          />
        </div>
      </div>

      <div
        class="bg-white absolute bottom-0 w-full text-center h-[2.5em] p-4 max-h-fit"
      >
        <div class="flex justify-center">
          <span class="mr-2 text-green-400">Incomes:</span>
          <span class="mr-2">{{ expensesePlus }}</span>
          <span class="mr-2 text-red-300">Outcomes:</span>
          <span class="mr-2">{{ expenseseMinus }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExpenseItem from "@/components/ExpenseItem.vue";
import { onMounted, ref, watch } from "vue";

import gsap from 'gsap'


export default {
  name: "HomeView",
  components: { ExpenseItem },

  setup() {
    const expensese = ref([]);

    onMounted(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        duration: 1,
        y: 20,
        ease: "power2.out",
      });
    });

    onMounted(() => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        window.location.pathname = "/login";
        return;
      }

      const user = JSON.parse(storedUser);
      console.log("Items", user);
    });

    const storedUser = localStorage.getItem("user");
    const user = ref();

    if (!storedUser) {
      window.location.pathname = "/login";
      return;
    } else {
      user.value = JSON.parse(storedUser);
    }
    async function grabData() {
      try {
        const res = await fetch("http://localhost:3000/grab-expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: user.value.user }),
        });

        const resJson = await res.json();

        expensese.value = resJson.getExpenses;

        console.log(resJson.getExpenses);
      } catch (e) {
        console.log(e);
      }
    }

    onMounted(async () => {
      await grabData();
    });

    const costMonitor = ref("");
    const descMonitor = ref("");

    const expenseseMinus = ref(0);
    const expensesePlus = ref(0);

    async function addExpense(cost, desc) {
      try {
        const addExp = await fetch("http://localhost:3000/create-expense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            desc: desc,
            cost: cost,
            password: user.value.user.password,
          }),
        });

        const addExpJson = await addExp.json();

        console.log(addExpJson);

        await grabData();
      } catch (e) {
        console.log(e);
      }
    }

    async function removeExpense(id) {
      console.log(id);
      try {
        const res = await fetch("http://localhost:3000/delete-expense", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        });

        const resJson = await res.json();

        await grabData();

        console.log(resJson);
      } catch (e) {
        console.log(e);
      }
    }
    if (expensese.value !== null) {
      watch(
        expensese,
        () => {
          expenseseMinus.value = 0;
          expensesePlus.value = 0;

          expensese.value.forEach((exp) => {
            const convertToNum = parseFloat(exp.cost);

            if (convertToNum < 0) {
              expenseseMinus.value += convertToNum;
            }
          });

          expensese.value.forEach((exp) => {
            const convertToNum = parseFloat(exp.cost);

            if (convertToNum > 0) {
              expensesePlus.value += convertToNum;
            }
          });
        },
        { deep: true }
      );
    }

    function logout() {
      localStorage.setItem("user", "");
      window.location.pathname = "/login";
    }

    return {
      expensese,
      addExpense,
      descMonitor,
      costMonitor,
      removeExpense,
      expenseseMinus,
      expensesePlus,
      logout,
    };
  },
};
</script>

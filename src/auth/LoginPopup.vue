<template>
  <section class="text-center text-lg-start">
    <div class="container py-4">
      <div class="row g-0 align-items-center">
        <div class="col-lg-6 order-lg-last mb-5 mb-lg-0">
          <div
            class="card cascading-left"
            style="
              background: hsla(0, 0%, 100%, 0.55);
              backdrop-filter: blur(30px);
            "
          >
            <div class="card-body p-5 shadow-5 text-center">
              <h2 class="fw-bold mb-5">Sign in now</h2>
              <form>
                <div class="form-outline mb-4">
                  <input
                    type="email"
                    id="form2Example1"
                    class="form-control"
                    v-model="email"
                  />
                  <label class="form-label" for="form2Example1"
                    >Email address</label
                  >
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="password"
                    id="form2Example2"
                    class="form-control"
                    v-model="password"
                  />
                  <label class="form-label" for="form2Example2">Password</label>
                </div>

                <div class="form-check d-flex justify-content-center mb-4">
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example31"
                    v-model="rememberMe"
                  />
                  <label class="form-check-label" for="form2Example31">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  class="btn btn-primary btn-block mb-4"
                  @click="signIn"
                >
                  Sign in
                </button>

                <p class="mb-0 text-muted">
                  Don't have an account?
                  <router-link to="/register" class="ms-2 text-primary fw-bold"
                    >Sign up</router-link
                  >
                </p>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-6 order-lg-first mb-5 mb-lg-0">
          <img
            src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
            class="w-100 rounded-4 shadow-4"
            alt=""
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
import backendServer from "../backendServer";
export default {
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    async signIn() {
      try {
        const { email, password } = this;
        const response = await axios.post(`${backendServer.serverData[1]}`, {
          email: email,
          password: password,
        });

        if (response.data.message === "Logged in successfully") {
          const toast = useToast();
          toast.success("Logged in successfully!");
          if (this.rememberMe) {
            localStorage.setItem("loggedInUser", email);
          } else {
            sessionStorage.setItem("loggedInUser", email);
          }

          this.$router.push({ name: "home" });
        }
      } catch (error) {
        console.error("Error signing in:", error);
        const toast = useToast();
        toast.error("Invalid email or password.");
      }
    },
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";

.cascading-left {
  margin-left: -50px;
}

@media (max-width: 991.98px) {
  .cascading-left {
    margin-left: 0;
  }
}
</style>

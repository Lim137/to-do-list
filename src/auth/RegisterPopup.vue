<template>
  <section class="text-center text-lg-start">
    <div class="container py-4">
      <div class="row g-0 align-items-center">
        <div class="col-lg-6 mb-5 mb-lg-0">
          <div
            class="card cascading-right"
            style="
              background: hsla(0, 0%, 100%, 0.55);
              backdrop-filter: blur(30px);
            "
          >
            <div class="card-body p-5 shadow-5 text-center">
              <h2 class="fw-bold mb-5">Sign up now</h2>
              <form @submit.prevent="registerUser">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="form-outline">
                      <input
                        type="text"
                        id="form3Example1"
                        class="form-control"
                        v-model="firstName"
                      />
                      <label class="form-label" for="form3Example1"
                        >First name</label
                      >
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="form-outline">
                      <input
                        type="text"
                        id="form3Example2"
                        class="form-control"
                        v-model="lastName"
                      />
                      <label class="form-label" for="form3Example2"
                        >Last name</label
                      >
                    </div>
                  </div>
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="email"
                    id="form3Example3"
                    class="form-control"
                    v-model="email"
                  />
                  <label class="form-label" for="form3Example3"
                    >Email address</label
                  >
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="password"
                    id="form3Example4"
                    class="form-control"
                    v-model="password"
                  />
                  <label class="form-label" for="form3Example4">Password</label>
                </div>

                <button type="submit" class="btn btn-primary btn-block mb-4">
                  Sign up
                </button>

                <!-- Ссылка "Already registered? Log in" -->
                <p class="mb-0 text-muted">
                  Already registered?
                  <router-link to="/login" class="ms-2 text-primary fw-bold"
                    >Log in</router-link
                  >
                </p>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-5 mb-lg-0">
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
  },
  server: backendServer.serverData[0],
  methods: {
    async registerUser() {
      try {
        if (!this.isValidForm()) {
          return;
        }
        this.firstName = this.firstName.trim();
        this.lastName = this.lastName.trim();
        const userData = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        };
        const response = await axios.post(
          `${backendServer.serverData[2]}`,
          userData
        );

        if (response.data.message === "User registered successfully") {
          const toast = useToast();
          toast.success("Registration successful!");
          localStorage.setItem("loggedInUser", this.email);
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        console.error("Error registering user:", error);
        const toast = useToast();
        toast.error("Registration failed. Please check the entered data.");
      }
    },
    isValidForm() {
      return (
        this.validateField(this.firstName, 2, 50) &&
        this.validateField(this.lastName, 2, 50) &&
        this.validateEmail(this.email) &&
        this.validatePassword(this.password)
      );
    },
    validateField(value, minLength, maxLength) {
      value = value.trim();
      if (!value || value.length < minLength || value.length > maxLength) {
        const toast = useToast();
        toast.error(
          `Field must be between ${minLength} and ${maxLength} characters.`
        );
        return false;
      }
      return true;
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        const toast = useToast();
        toast.error("Please enter a valid email address.");
        return false;
      }
      return true;
    },
    validatePassword(password) {
      if (!password || password.length < 6) {
        const toast = useToast();
        toast.error("Password must be at least 6 characters long.");
        return false;
      }
      return true;
    },
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";

.cascading-right {
  margin-right: -50px;
}

@media (max-width: 991.98px) {
  .cascading-right {
    margin-right: 0;
  }
}
</style>

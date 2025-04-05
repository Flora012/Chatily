<template>
  <div class="container">
    <v-card class="form-card">
      <v-card-title class="title">Regisztráció</v-card-title>
      <v-card-text class="vcardtext-inputs">
        <v-text-field
          v-model="registrationData.lastname"
          label="Vezetéknév"
          variant="outlined"
          class="input-field"
          :error-messages="lastnameError"
          required
          @blur="validateField('lastname')"
        ></v-text-field>
        <v-text-field
          v-model="registrationData.firstname"
          label="Keresztnév"
          variant="outlined"
          class="input-field"
          :error-messages="firstnameError"
          required
          @blur="validateField('firstname')"
        ></v-text-field>
        <v-text-field
          v-model="registrationData.email"
          label="Email"
          variant="outlined"
          class="input-field"
          :error-messages="emailError"
          required
          @blur="validateField('email')"
        ></v-text-field>
        <v-text-field
          v-model="registrationData.phoneNumber"
          label="Telefonszám"
          variant="outlined"
          class="input-field"
          :error-messages="phoneNumberError"
          required
          @blur="validateField('phoneNumber')"
        ></v-text-field>
        <v-text-field
          v-model="registrationData.password"
          label="Jelszó"
          type="password"
          variant="outlined"
          class="input-field"
          :error-messages="passwordError"
          required
          @blur="validateField('password')"
        ></v-text-field>
        <v-text-field
          v-model="registrationData.confirmPassword"
          label="Jelszó megerősítése"
          type="password"
          variant="outlined"
          class="input-field"
          :error-messages="confirmPasswordError"
          required
          @blur="validateField('confirmPassword')"
        ></v-text-field>
        <v-btn
          color="#8e39ac"
          variant="elevated"
          @click="handleRegistration"
          :loading="isRegistering"
          class="registration-btn"
        >Regisztráció</v-btn>
        <v-alert v-if="message" type="success" variant="outlined">{{
          message
        }}</v-alert>
        <v-alert v-if="error" type="error" variant="outlined">{{
          error
        }}</v-alert>
      </v-card-text>
      <div class="login-link">
        Már van fiókod?
        <span class="link" @click="router.push({ name: 'login' })"
          >Jelentkezz be itt.</span
        >
      </div>
    </v-card>

    <v-dialog v-model="isVerificationModalOpen" max-width="300">
      <v-card>
        <v-card-title>Verifikációs kód</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="verificationCode"
            label="Írd be a 6 jegyű kódot"
            type="number"
            required
            :error-messages="verificationError"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="gray" class="verification-buttons" @click="closeVerificationModal">Mégse</v-btn>
          <v-btn color="#8e39ac"  class="verification-buttons" @click="verifyCode">Megerősítés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRegistration } from '@/api/auth/authQuery';
import axios from 'axios';

const router = useRouter();

const registrationData = reactive({
  email: '',
  lastname: '',
  firstname: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
});

const verificationCode = ref('');
const isVerificationModalOpen = ref(false);
const verificationError = ref<string | null>(null);
const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const confirmPasswordError = ref<string | null>(null);
const firstnameError = ref<string | null>(null);
const lastnameError = ref<string | null>(null);
const phoneNumberError = ref<string | null>(null);
const error = ref<string | null>(null);
const message = ref('');
const isRegistering = ref(false);
const realVerificationCode = ref('');

const { mutate: register } = useRegistration();

const validatePasswords = (
  password: string,
  confirmPassword: string
): boolean => {
  const minLength = /.{8,}/;
  const hasUpperCase = /[A-Z]/;
  const hasSpecialChar = /[.]/;

  if (password !== confirmPassword) {
    passwordError.value = 'A két jelszó nem egyezik!';
    confirmPasswordError.value = 'A két jelszó nem egyezik!';
    return false;
  } else if (!minLength.test(password)) {
    passwordError.value =
      'A jelszónak legalább 8 karakter hosszúnak kell lennie.';
    return false;
  } else if (!hasUpperCase.test(password)) {
    passwordError.value =
      'A jelszónak tartalmaznia kell legalább egy nagybetűt.';
    return false;
  } else if (!hasSpecialChar.test(password)) {
    passwordError.value =
      "A jelszónak tartalmaznia kell legalább egy speciális karaktert, például '.'.";
    return false;
  }
  passwordError.value = null;
  confirmPasswordError.value = null;
  return true;
};

const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const validatePhoneNumber = (phoneNumber: string): boolean => {

  const phoneNumberPattern = /^\+?[\s-]?(\d[\s-]?){9,15}$/;
  return phoneNumberPattern.test(phoneNumber);
};

const validateField = (fieldName: string) => {
  switch (fieldName) {
    case 'lastname':
      lastnameError.value = registrationData.lastname
        ? null
        : 'A vezetéknév kitöltése kötelező!';
      break;
    case 'firstname':
      firstnameError.value = registrationData.firstname
        ? null
        : 'A keresztnév kitöltése kötelező!';
      break;
    case 'email':
      if (!registrationData.email) {
        emailError.value = 'Az email kitöltése kötelező!';
      } else if (!validateEmail(registrationData.email)) {
        emailError.value = 'Érvénytelen e-mail cím!';
      } else {
        emailError.value = null;
      }
      break;
    case 'phoneNumber':
      if (!registrationData.phoneNumber) {
        phoneNumberError.value = 'A telefonszám kitöltése kötelező!';
      } else if (!validatePhoneNumber(registrationData.phoneNumber)) {
        phoneNumberError.value = 'Érvénytelen telefonszám!';
      } else {
        phoneNumberError.value = null;
      }
      break;
    case 'password':
      passwordError.value = registrationData.password
        ? null
        : 'A jelszó kitöltése kötelező!';
      break;
    case 'confirmPassword':
      confirmPasswordError.value = registrationData.confirmPassword
        ? null
        : 'A jelszó megerősítése kötelező!';
      break;
  }
};

const handleRegistration = async () => {
  isRegistering.value = true;
  emailError.value = null;
  passwordError.value = null;
  confirmPasswordError.value = null;
  firstnameError.value = null;
  lastnameError.value = null;
  phoneNumberError.value = null;
  error.value = null;
  verificationError.value = null;

  let isValid = true;
  if (!registrationData.lastname) {
    lastnameError.value = 'A vezetéknév kitöltése kötelező!';
    isValid = false;
  }
  if (!registrationData.firstname) {
    firstnameError.value = 'A keresztnév kitöltése kötelező!';
    isValid = false;
  }
  if (!registrationData.email) {
    emailError.value = 'Az email kitöltése kötelező!';
    isValid = false;
  }
  if (!registrationData.phoneNumber) {
    phoneNumberError.value = 'A telefonszám kitöltése kötelező!';
    isValid = false;
  }
  if (!registrationData.password) {
    passwordError.value = 'A jelszó kitöltése kötelező!';
    isValid = false;
  }
  if (!registrationData.confirmPassword) {
    confirmPasswordError.value = 'A jelszó megerősítése kötelező!';
    isValid = false;
  }

  if (!isValid) {
    isRegistering.value = false;
    return;
  }

  if (!validateEmail(registrationData.email)) {
    emailError.value = 'Érvénytelen e-mail cím!';
    isRegistering.value = false;
    return;
  }

  if (!validatePhoneNumber(registrationData.phoneNumber)) {
    phoneNumberError.value = 'Érvénytelen telefonszám!';
    isRegistering.value = false;
    return;
  }

  if (
    !validatePasswords(
      registrationData.password,
      registrationData.confirmPassword
    )
  ) {
    isRegistering.value = false;
    return;
  }

  isVerificationModalOpen.value = true;
  try {
    const response = await axios.post(
      `http://localhost:3000/user/sendVerificationCode/${registrationData.email}`
    );
    realVerificationCode.value = response.data;
    console.log(realVerificationCode.value)
    isRegistering.value = false;
  } catch (error: any) {
    error.value =
      error.response?.data?.error || 'Hiba történt a kód küldése közben.';
    isRegistering.value = false;
  }
};

const verifyCode = async () => {
  verificationError.value = null;
  isRegistering.value = true;

  if (verificationCode.value.toString().length !== 6) {
    verificationError.value = 'A megerősítő kódnak 6 számjegyből kell állnia.';
    isRegistering.value = false;
    return;
  }

  if (verificationCode.value === realVerificationCode.value) {
    try {
      const response = await register(registrationData);
      message.value = response.message || 'Sikeres regisztráció!';
      isVerificationModalOpen.value = false;
      router.push({ name: 'login' });
    } catch (error: any) {
      isRegistering.value = false;
      error.value =
        error.response?.data?.error || 'Hiba történt a regisztráció során.';
    } finally {
      isRegistering.value = false;
    }
  } else {
    verificationError.value =
      'Nem jó kódot adtál meg. Kérlek nézd át a számok helyességét.';
    isRegistering.value = false;
    return;
  }
};

const closeVerificationModal = () => {
  isVerificationModalOpen.value = false;
  verificationCode.value = '';
  verificationError.value = null;
};
</script>
<style scoped>


body {
  background-color: #f07167;
  align-items: center;
    justify-content: center;
}
.vcardtext-inputs{
    align-items: center;
    justify-content: center;
  }

.v-text-field {
  margin-bottom: 2px;
}

.title {
  font-family: 'Lucida Console', monospace;
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
}

.verification-button {
  border: 1px solid black;
}

.input-field :deep(.v-input__control) {
    background-color: #d8b3e6 !important;
    width: 100%;
    border-radius: 8px;
    border: 1px solid black;
  }

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #e2c6ec;
  width: 30%;
}

.registration-btn {
  border: 1px solid black;
}

.form-card {
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  border-radius: 22px;
  background: #bb79d2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 10px solid #d8b3e6;
  animation: border-animation 6s linear infinite;
}

@keyframes border-animation {
  0% { border-color: #d8b3e6; }
  5% { border-color: #ce9fdf; }
  10% { border-color: #c48cd9; }
  15% { border-color: #b166cc; }
  20% { border-color: #a753c6; }
  25% { border-color: #9d40bf; }
  30% { border-color: #8e39ac; }
  35% { border-color: #7e3399; }
  40%{border-color: #6e2d86;}
  45% { border-color: #5e2673;}
  50%{border-color: #6e2d86;}
  55% { border-color: #7e3399; }
  60% { border-color: #8e39ac; }
  65% { border-color: #9d40bf; }
  70% { border-color: #a753c6; }
  75% { border-color: #b166cc; }
  80% { border-color: #c48cd9; }
  85% { border-color: #ce9fdf; }
  100% { border-color: #d8b3e6; }
  

}
.input-field {
  width: 100%;
  margin-bottom: 2px;
  font-family: 'Lucida Console', monospace;
  font-weight: bold;
}

.login-link {
  margin-top: 10px;
  font-size: 1rem;
  text-align: center;
  font-family: 'Lucida Console', monospace;
  font-weight: bold;
  color: white;
}

.link {
  color: #4f2060;
  cursor: pointer;
  text-decoration: underline;
  font-family: 'Lucida Console', monospace;
  font-weight: bold;
}
@media (max-width: 1200px) {
  .container {
    width: 50%;
  }
}

@media (max-width: 992px) {
  .container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .container {
    width: 80%;
    height: auto;
    padding: 20px;
  }

  .form-card {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .container {
    width: 100%;
    flex-direction: column;
    height: auto;
    padding: 15px;
    justify-content: center;
    align-items: center;
  }

  .form-card {
    width: 100%;
    padding: 10px;
  }

  .title {
    font-size: 1.4rem;
  }

  .input-field {
    max-width: 100%;
  }
  .login-link {
    font-size: 0.9rem;
  }
  .registration-btn {
    width: 60%;
  }
}
</style>

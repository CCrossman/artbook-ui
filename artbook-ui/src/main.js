import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { Amplify } from 'aws-amplify'

const cognitoConfig = {
  region: import.meta.env.VITE_COGNITO_REGION,
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
}

// console.log('Cognito Config Check:', {
//   region: cognitoConfig.region ? '✓ Set' : '✗ Missing',
//   userPoolId: cognitoConfig.userPoolId ? '✓ Set' : '✗ Missing',
//   userPoolClientId: cognitoConfig.userPoolClientId ? '✓ Set' : '✗ Missing',
// })

// if (!cognitoConfig.region || !cognitoConfig.userPoolId || !cognitoConfig.userPoolClientId) {
//   console.warn('⚠️ Cognito not fully configured. Please set environment variables:')
//   console.warn('   VITE_COGNITO_REGION=<your-region>')
//   console.warn('   VITE_COGNITO_USER_POOL_ID=<your-user-pool-id>')
//   console.warn('   VITE_COGNITO_USER_POOL_CLIENT_ID=<your-client-id>')
// }

Amplify.configure({
  Auth: {
    Cognito: {
      region: cognitoConfig.region,
      userPoolId: cognitoConfig.userPoolId,
      userPoolClientId: cognitoConfig.userPoolClientId,
      authenticationFlowType: 'USER_SRP_AUTH',
      mandatorySignIn: false,
      loginWith: {
        email: true,
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.mount('#app')

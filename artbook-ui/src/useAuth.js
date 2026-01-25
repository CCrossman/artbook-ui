async function checkUser() {
  try {
    const { email, sub, signInDetails } = await getCurrentUser()
    console.log('User is signed in: ' + sub + ' ' + email)
  } catch (err) {
    console.error(err)
  }
}
export { checkUser }

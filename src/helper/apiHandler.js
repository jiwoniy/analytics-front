export default function apiHandler (apiCall) {
  return apiCall
    .then(response => {
      const { data } = response
      return { success: data }
    })
    .catch(error => {
      const { data } = error.response
      return { error: data }
    })
}

export default function apiHandler (apiCall) {
  return apiCall
    .then(response => {
      // const { data } = response
      return { success: response.projects }
    })
    .catch(error => {
      const { data } = error.response
      return { error: data }
    })
}

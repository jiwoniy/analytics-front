import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})

export default instance

// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.baseURLbaseURL  ==  'https://api.example.comhttps://api.example.c'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

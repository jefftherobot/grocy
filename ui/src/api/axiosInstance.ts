import axios from 'axios'

// You can load this from environment, user settings, config, etc.
const API_BASE_URL = 'http://localhost:8009/api'

const instance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000, // 10s timeout to avoid hanging
})

// OPTIONAL: If using GROCY-API-KEY authentication
// You can store the key in localStorage or Pinia store.
// Update this dynamically if needed.
instance.interceptors.request.use((config) => {
	const apiKey = localStorage.getItem('GROCY_API_KEY')
	if (apiKey) {
		config.headers['GROCY-API-KEY'] = apiKey
	}
	return config
})

// OPTIONAL: Response error logging
instance.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('API ERROR:', error?.response || error)
		throw error
	},
)

export default instance

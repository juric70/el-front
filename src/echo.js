// src/echo.js

import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws'],
})

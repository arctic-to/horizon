import _axios from 'axios'

export const axios = _axios.create({
  baseURL: process.env.NETEASE_CLOUD_MUSIC_API!,
})

export default axios

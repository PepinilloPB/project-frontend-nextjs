"use server"

import axios from "axios"

export async function verifyCaptcha(token: string | null) {
  const res = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=6LcOjHwpAAAAAHGxgprixY1frOMHUeEGda-NmTck&response=${token}`
  )
  if (res.data.success) {
    return "success!"
  } else {
    throw new Error("Failed Captcha")
  }
}
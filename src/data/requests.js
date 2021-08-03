import { RttRounded } from "@material-ui/icons";
import axios from "axios";
import {API_LINK} from "./apiLink"

const axiosInstance = axios.create({
    baseURL: API_LINK,
    withCredentials: true
})

export async function signInRequest(username, password) {

    try {
        const res = await axiosInstance.post("signIn/", { username, password }, { withCredentials: true })

        if (res.status == 200) {
            console.log(`signed with id ${res.data.username}`)
            localStorage.setItem("currentUserId", res.data.username)
            return res.data.username
        }
    }
    catch (err) {
        console.log(err.message)
    }
}

export async function signUpRequest(name, username, password) {
    try {
        const res = await axiosInstance.post("users/", { name, username, password }, { withCredentials: true })

        if (res.status == 201) {
            console.log(`registered with id ${res.data.username}`)
            localStorage.setItem("currentUserId", res.data.username)
            return res.data.username
        }
    }
    catch (err) {
        console.log(err.message)
    }
}


export async function signOutRequest() {
    try {
        await axiosInstance.post("signOut", { withCredentials: true })
    }
    catch (err) {
        console.log(err.message)
    }
}
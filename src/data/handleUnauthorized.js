require("dotenv").config({ path: "./env" })

export default function handleUnauthorized(error) {

    if (error.response.status == 401) {
        localStorage.removeItem("currentUserId")
        // console.log("Handle" + localStorage.getItem("currentUserId"))
        window.location.reload(true)
    }

}
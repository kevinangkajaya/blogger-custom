import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getOauthToken } from "./login/oauthToken"

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        let oauthToken = getOauthToken()
        if (oauthToken) {
            navigate("/insert-to-mememammum", { replace: true })
        }
        else {
            navigate("/login", { replace: true })
        }
    }, [])

    return null
}
export default Home
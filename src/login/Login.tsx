import { useNavigate } from "react-router-dom"
import getOauthToken from "./getOauthToken"
import { useEffect } from "react"

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        let oauthToken = getOauthToken()
        if (oauthToken) {
            navigate("/insert-to-mememammum", { replace: true })
        }
    }, [])

    return (<div>

    </div>)
}

export default Login
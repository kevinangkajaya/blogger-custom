import { useNavigate } from "react-router-dom"
import { getOauthToken, setOauthToken } from "./oauthToken"
import { useEffect } from "react"
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        let oauthToken = getOauthToken()
        if (oauthToken) {
            navigate("/insert-to-mememammum", { replace: true })
        }
    }, [])

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log(tokenResponse)
            // tokenResponse.expires_in is in seconds
            // set cookie is in day
            setOauthToken(tokenResponse.access_token, tokenResponse.expires_in / 3600 / 24)
            navigate("/insert-to-mememammum")
        },
        onError: (err) => {
            console.error(err);
        },
    });

    return (
        <div>
            <button className="btn btn-primary" onClick={() => login()}>
                Sign in with Google 🚀{' '}
            </button>
        </div>
    )
}

export default Login
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getOauthToken, removeOauthToken } from "./login/oauthToken"
import { googleLogout } from '@react-oauth/google';

/**
 * 
 * @param children html content
 * @returns 
 */
const Template = ({ children }) => {

    const navigate = useNavigate()

    useEffect(() => {
        let oauthToken = getOauthToken()
        if (!oauthToken) {
            navigate("/login", { replace: true })
        }
    }, [])

    const logout = () => {
        removeOauthToken()
        googleLogout();
        navigate("/login")
    }

    return (<div>
        <div className="d-flex justify-content-end mb-3">
            <button type="button" className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
        {children}
    </div>)
}

export default Template
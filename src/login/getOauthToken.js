import Cookies from "js-cookie"

const getOauthToken = () => {
    return Cookies.get('oauth-token')
}

export default getOauthToken
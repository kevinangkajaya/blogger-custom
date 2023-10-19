import Cookies from "js-cookie"

const cookieName = 'oauth-token'

export const getOauthToken = () => {
    return Cookies.get(cookieName)
}

// expires is in days
export const setOauthToken = (token, expires) => {
    Cookies.set(cookieName, token, {
        expires: expires
    })
}
export const removeOauthToken = () => {
    Cookies.remove(cookieName)
}
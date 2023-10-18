import ErrorDiv from "@kevinangkajaya/error-div"
import axios from "axios"
import { useState } from "react"

interface GetSpecificPostInterface {
    onSuccess: (data: Record<string, any>) => void
}

/**
 * 
 * @param onSuccess when get specific post is successful
 * @returns 
 */
const GetSpecificPost = ({ onSuccess }: GetSpecificPostInterface) => {
    const [postID, setPostID] = useState('')

    const [submitting, set_submitting] = useState(false)
    const [errors, set_errors] = useState<Record<string, any>>({})

    const validate = () => {
        let validate = true;
        let errors: Record<string, any> = {}

        if (!postID) {
            validate = false
            errors.postID = "Post ID is required"
        };

        set_errors(errors)
        return validate
    }

    const submit = () => {

        if (!validate()) return;

        let urlParams = new URLSearchParams()
        urlParams.set("key", process.env.REACT_APP_BLOGGER_API)
        urlParams.set("fields", "content,url")

        let blogID = process.env.REACT_APP_MEME_MAM_MUM_BLOG_ID

        let url = `https://www.googleapis.com/blogger/v3/blogs/${blogID}/posts/${postID}?${urlParams.toString()}`

        set_submitting(true)
        axios.get(url, {}).then(function (res) {
            onSuccess(res.data)
        }).catch(function (err) {
            console.error(err)
            let error = ""
            if (err.response?.data?.message) {
                error = err.response.data.message
            }
            if (err.message) {
                error = err.message
            }
            if (error) {
                console.error(error)
                set_errors({
                    submit: error
                })
            }
        }).finally(() => {
            set_submitting(false)
        })

    }

    return (<div>
        <div className="form-group">
            <label htmlFor="postID">Post ID</label>
            <input className="form-control" type="text" id="postID" value={postID} onChange={(e) => setPostID(e.target.value)} />
            <ErrorDiv error={errors.postID} />
        </div>
        <div className="mt-3">
            <ErrorDiv error={errors.submit} />
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>Submit</button>
        </div>

    </div>)
}

export default GetSpecificPost
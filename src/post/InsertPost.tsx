import { createRef, useRef, useState } from "react"
import update from "immutability-helper"
import ErrorDiv from "@kevinangkajaya/error-div"
import axios from "axios"
import { getOauthToken } from "../login/oauthToken"
import delay from "../helper/delay"

interface InsertPostInterface {
    dataProps: Array<Record<string, any>>
    onSuccess: () => void
}

/**
 * 
 * @param dataProps array of data
 * @param onSuccess when data is successfully inserted
 * @returns 
 */
const InsertPost = ({ dataProps, onSuccess }: InsertPostInterface) => {
    const [data, setData] = useState(dataProps)
    const [errors, set_errors] = useState([])
    const [error_submit, set_error_submit] = useState('')
    const [submitting, set_submitting] = useState(false)

    const dataRef = useRef(createDataRef(dataProps))
    const fixedWidth = 540;

    const onInputChange = (index: number, column: string, value: any) => {
        let temp = update(data, {
            [index]: {
                [column]: { $set: value }
            }
        })
        setData(temp)
    }

    const onWidthChange = (index: number, value: string) => {

        if (!value) value = "0"
        let width = parseInt(value)
        if (width > fixedWidth) width = fixedWidth;

        let height = Math.round(width / data[index].ratio)
        let temp = update(data, {
            [index]: {
                "width": { $set: `${width}` },
                "height": { $set: `${height}` },
            }
        })
        setData(temp)
    }

    const onHeightChange = (index: number, value: string) => {
        if (!value) value = "0"
        let height = parseInt(value)
        let width = Math.round(height * data[index].ratio)
        if (width > fixedWidth) return;

        let temp = update(data, {
            [index]: {
                "width": { $set: `${width}` },
                "height": { $set: `${height}` },
            }
        })
        setData(temp)
    }

    const focusErrors = (errors: Record<string, string>[]) => {
        for (let i = 0; i < errors.length; i++) {
            let error = errors[i]
            if (error.title) {
                dataRef.current[i].title.current.focus()
                break
            }
            else if (error.caption) {
                dataRef.current[i].caption.current.focus()
                break
            }
            else if (error.labels) {
                dataRef.current[i].labels.current.focus()
                break
            }
            else if (error.width) {
                dataRef.current[i].width.current.focus()
                break
            }
            else if (error.height) {
                dataRef.current[i].height.current.focus()
                break
            }
        }
    }

    const getSelectedLength = () => {
        return data.filter(x => x.selected === true).length
    }

    const validate = () => {
        let validate = true
        const errors = []

        for (let i = 0; i < data.length; i++) {
            let error: Record<string, string> = {}
            const datum = data[i]

            if (datum.selected) {

                if (!datum.title) {
                    validate = false
                    error.title = "Title is required"
                }
                if (!datum.caption) {
                    validate = false
                    error.caption = "Caption is required"
                }
                if (!datum.labels) {
                    validate = false
                    error.labels = "Labels is required"
                }
                if (!datum.width) {
                    validate = false
                    error.width = "Width is required"
                }
                if (!datum.height) {
                    validate = false
                    error.height = "Height is required"
                }
            }

            errors.push(error)
        }

        focusErrors(errors)
        set_errors(errors)
        return validate
    }
    const submit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        set_error_submit('')

        if (getSelectedLength() === 0) {
            set_error_submit("No items are selected!")
            return
        }

        set_submitting(true)

        let currentIndex = 0
        let grouping = 0
        try {
            for (const datum of data) {
                if (datum.selected) {
                    await insertPost(datum)
                    grouping++
                    if (grouping % 5 === 0) await delay(60 * 1000) // 1 minute
                }
                currentIndex++;
            }
            onSuccess()
        } catch (err) {
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
                set_error_submit(error)
            }

            // remove selected from used
            let temp = data
            for (let i = 0; i < currentIndex; i++) {
                temp = update(temp, {
                    [i]: {
                        "selected": { $set: false }
                    }
                })
            }
            setData(temp)
        } finally {
            set_submitting(false)
        }

    }

    const insertPost = async (datum: Record<any, string>) => {
        let urlParams = new URLSearchParams()
        urlParams.set("key", process.env.REACT_APP_BLOGGER_API)
        urlParams.set("isDraft", "0")

        let blogID = process.env.REACT_APP_MEME_MAM_MUM_BLOG_ID

        let url = `https://www.googleapis.com/blogger/v3/blogs/${blogID}/posts?${urlParams.toString()}`

        let dataPost = {
            title: datum.title,
            content: `<p>&nbsp;</p><table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto;"><tbody><tr><td style="text-align: center;"><a href="${datum.href}" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="${datum.originalHeight}" data-original-width="${datum.originalWidth}" height="${datum.height}" src="${datum.href}" width="${datum.width}" /></a></td></tr><tr><td class="tr-caption" style="text-align: center;"><span style="font-size: medium;">${datum.caption}<br /></span><br /></td></tr></tbody></table>`,
            labels: datum.labels,
        }

        return await axios.post(url, dataPost, {
            headers: {
                Authorization: `Bearer ${getOauthToken()}`
            }
        }).then(function (res) {
            return true
        }).catch(function (err) {

            throw err
        })
    }

    return (<form onSubmit={submit}>
        {data.map((datum, index) => (<div className="mb-3 d-flex justify-content-between" key={index}>
            <div>
                <img width={datum.width} height={datum.height} src={datum.href} />
            </div>
            <div className="ms-3">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id={"selected" + index}
                        checked={datum.selected} onChange={(e) => onInputChange(index, "selected", !datum.selected)}
                    />
                    <label className="form-check-label" htmlFor={"selected" + index}>
                        Selected
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input placeholder="Title" className="form-control" type="text" id="title" ref={dataRef.current[index].title}
                        value={datum.title} onChange={(e) => onInputChange(index, "title", e.target.value)}
                    />
                    <ErrorDiv error={errors[index]?.title} />
                </div>
                <div className="form-group">
                    <label htmlFor="caption">Caption</label>
                    <input placeholder="Caption" className="form-control mt-2" type="text" id="caption" ref={dataRef.current[index].caption}
                        value={datum.caption} onChange={(e) => onInputChange(index, "caption", e.target.value)}
                    />
                    <ErrorDiv error={errors[index]?.caption} />
                </div>
                <div className="form-group">
                    <label htmlFor="labels">Labels</label>
                    <input placeholder="Labels" className="form-control mt-2" type="text" id="labels (use comma to separate)" ref={dataRef.current[index].labels}
                        value={datum.labels} onChange={(e) => onInputChange(index, "labels", e.target.value)}
                    />
                    <ErrorDiv error={errors[index]?.labels} />
                </div>
                <div className="form-group">
                    <label htmlFor="width">Width</label>
                    <input placeholder="Width" className="form-control mt-2" type="number" id="width" step="20" ref={dataRef.current[index].width}
                        value={datum.width} onChange={(e) => onWidthChange(index, e.target.value)}
                    />
                    <ErrorDiv error={errors[index]?.width} />
                </div>
                <div className="form-group">
                    <label htmlFor="height">Height</label>
                    <input placeholder="Height" className="form-control mt-2" type="number" id="height" step="20" ref={dataRef.current[index].height}
                        value={datum.height} onChange={(e) => onHeightChange(index, e.target.value)}
                    />
                    <ErrorDiv error={errors[index]?.height} />
                </div>
                <div className="form-group">
                    <label htmlFor="originalWidth">Original Width</label>
                    <input placeholder="Original Width" className="form-control mt-2" type="number" id="originalWidth"
                        value={datum.originalWidth} disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="originalHeight">Original Height</label>
                    <input placeholder="Original Height" className="form-control mt-2" type="number" id="originalHeight"
                        value={datum.originalHeight} disabled
                    />
                </div>
            </div>
        </div>))}
        <div className="text-center">
            Note: Please wait few minutes as we can only post 5 posts per minute
            Selected item: {getSelectedLength()} / {data.length}
        </div>
        {data.length > 0 && <div className="mt-3 text-center">
            <ErrorDiv error={error_submit} />
            <button type="submit" className="btn btn-primary" disabled={submitting}>Submit</button>
        </div>}
    </form>)
}

const createDataRef = (dataProps) => {
    const refs = []
    for (let i = 0; i < dataProps.length; i++) {
        let temp = {
            title: createRef(),
            caption: createRef(),
            labels: createRef(),
            width: createRef(),
            height: createRef(),
        }
        refs.push(temp)
    }

    return refs
}

export default InsertPost
import { useState } from "react"
import update from "immutability-helper"

interface InsertPostInterface {
    dataProps: Array<Record<string, any>>
}

/**
 * 
 * @param dataProps array of data
 * @returns 
 */
const InsertPost = ({ dataProps }: InsertPostInterface) => {
    const [data, setData] = useState(dataProps)

    const onInputChange = (index: number, column: string, value: string) => {
        let temp = update(data, {
            [index]: {
                [column]: { $set: value }
            }
        })
        setData(temp)
    }

    const submit = () => {
        console.log(data)
    }

    return (<div>
        {data.map((datum, index) => (<div className="mb-3 d-flex" key={index}>
            <div>
                <img width={datum.width} height={datum.height} src={datum.src} />
            </div>
            <div className="ms-3">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input placeholder="Title" className="form-control" type="text" id="title"
                        value={datum.title} onChange={(e) => onInputChange(index, "title", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="caption">Caption</label>
                    <input placeholder="Caption" className="form-control mt-2" type="text" id="caption"
                        value={datum.caption} onChange={(e) => onInputChange(index, "caption", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="labels">Labels</label>
                    <input placeholder="Labels" className="form-control mt-2" type="text" id="labels (use comma to separate)"
                        value={datum.labels} onChange={(e) => onInputChange(index, "labels", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="width">Width</label>
                    <input placeholder="Width" className="form-control mt-2" type="number" id="width"
                        value={datum.width} onChange={(e) => onInputChange(index, "width", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="height">Height</label>
                    <input placeholder="Height" className="form-control mt-2" type="number" id="height"
                        value={datum.height} onChange={(e) => onInputChange(index, "height", e.target.value)}
                    />
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
        {data.length > 0 && <div className="mt-3">
            <button onClick={submit} className="btn btn-primary">Submit</button>
        </div>}
    </div>)
}

export default InsertPost
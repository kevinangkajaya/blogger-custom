import { useState } from "react";
import GetSpecificPost from "../post/GetSpecificPost"
import InsertPost from "../post/InsertPost";

const convertContentToData = (content: string): Record<string, any>[] => {
    let regexp = /<img [A-z0-9 ="'-:]* \/>/g;
    const imageTags = content.match(regexp);

    let extractedData = []
    for (const tag of imageTags) {
        // console.log(tag)
        regexp = / data-original-width="([0-9]*)"/;
        let temp = tag.match(regexp)
        if (temp.length != 2) continue;
        let originalWidth = temp[1]

        regexp = / data-original-height="([0-9]*)"/
        temp = tag.match(regexp)
        if (temp.length != 2) continue;
        let originalHeight = temp[1]

        regexp = / width="([0-9]*)"/
        temp = tag.match(regexp)
        if (temp.length != 2) continue;
        let width = temp[1]

        regexp = / height="([0-9]*)"/
        temp = tag.match(regexp)
        if (temp.length != 2) continue;
        let height = temp[1]

        regexp = / src="([A-z0-9:\/.\-]*)"/
        temp = tag.match(regexp)
        if (temp.length != 2) continue;
        let src = temp[1]

        let result = {
            originalWidth: originalWidth,
            originalHeight: originalHeight,
            width: width,
            height: height,
            src: src,
            title: '',
            caption: '',
            labels: '',
        }
        extractedData.push(result)
    }
    return extractedData
}

const calculateWidthAndHeight = (extractedData: Record<string, any>[]) => {
    let fixedWidth = 540

    for (const datum of extractedData) {
        let originalWidth = parseInt(datum.originalWidth)
        if (originalWidth > fixedWidth) {
            let originalHeight = parseInt(datum.originalHeight)
            datum.height = `${Math.round(fixedWidth / originalWidth * originalHeight)}`
            datum.width = "540"
        }
    }
}

const insertPhase = {
    getSpecificPost: 'getSpecificPost',
    insertPost: 'insertPost',
}

const InsertToMemeMamMum = () => {
    const [extractedData, setExtractedData] = useState([])
    const [phase, setPhase] = useState(insertPhase.getSpecificPost)

    const onGetSpecificPostSuccess = (data: Record<string, any>) => {
        let extractedData = convertContentToData(data.content)
        calculateWidthAndHeight(extractedData)
        setExtractedData(extractedData)
        setPhase(insertPhase.insertPost)
    }

    const goBack = () => {
        return (<div className="my-3">
            <button onClick={() => setPhase(insertPhase.getSpecificPost)} className="btn btn-danger">Go Back</button>
        </div>)
    }

    if (phase === insertPhase.getSpecificPost) return (
        <GetSpecificPost onSuccess={onGetSpecificPostSuccess} />
    )
    else if (phase === insertPhase.insertPost) return (<>
        {goBack()}
        <InsertPost dataProps={extractedData} />
        {goBack()}
    </>)
}

export default InsertToMemeMamMum
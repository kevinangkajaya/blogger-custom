import { useState } from "react";
import GetSpecificPost from "../post/GetSpecificPost"
import InsertPost from "../post/InsertPost";
import Template from "../Template";

const convertContentToData = (content: string): Record<string, any>[] => {
    let regexp = /<a [A-z0-9 ="'-:;%]*><img [A-z0-9 ="'-:%]* \/><\/a>/g;
    const aTags = content.match(regexp);

    let extractedData = []
    for (const aTag of aTags) {
        regexp = / href="([A-z0-9:\/.\-%()]*)"/
        let temp = aTag.match(regexp)
        console.log(aTag, temp)
        if (temp.length != 2) continue;
        let href = temp[1]

        regexp = /<img [A-z0-9 ="'-:%]* \/>/g;
        temp = aTag.match(regexp);
        if (temp.length != 1) continue;
        let imageTag = temp[0]

        // console.log(tag)
        regexp = / data-original-width="([0-9]*)"/;
        temp = imageTag.match(regexp)
        if (temp.length != 2) continue;
        let originalWidth = temp[1]

        regexp = / data-original-height="([0-9]*)"/
        temp = imageTag.match(regexp)
        if (temp.length != 2) continue;
        let originalHeight = temp[1]

        regexp = / width="([0-9]*)"/
        temp = imageTag.match(regexp)
        if (temp.length != 2) continue;
        let width = temp[1]

        regexp = / height="([0-9]*)"/
        temp = imageTag.match(regexp)
        if (temp.length != 2) continue;
        let height = temp[1]

        let result = {
            originalWidth: originalWidth,
            originalHeight: originalHeight,
            width: width,
            height: height,
            ratio: parseInt(originalWidth) / parseInt(originalHeight),
            href: href,
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
            datum.height = `${Math.round(fixedWidth / datum.ratio)}`
            datum.width = `${fixedWidth}`
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

    const onInsertPostSuccess = () => {
        setPhase(insertPhase.getSpecificPost)
    }

    const goBack = () => {
        return (<div className="my-3">
            <button type="button" onClick={() => setPhase(insertPhase.getSpecificPost)} className="btn btn-danger">Go Back</button>
        </div>)
    }

    return (<Template>
        {phase === insertPhase.getSpecificPost ? <>
            <GetSpecificPost onSuccess={onGetSpecificPostSuccess} />
        </> : phase === insertPhase.insertPost ? <>
            {goBack()}
            <InsertPost dataProps={extractedData} onSuccess={onInsertPostSuccess} />
            {goBack()}
        </> : <></>
        }
    </Template>)
}

export default InsertToMemeMamMum
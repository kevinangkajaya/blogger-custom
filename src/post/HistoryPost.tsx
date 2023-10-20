import { useState, useEffect } from "react"

const localStorageHistoryKey = 'history-post'

export const saveLocalStorageHistory = (data: Record<string, any>[]) => {
    let stringifiedData = JSON.stringify(data)
    localStorage.setItem(localStorageHistoryKey, stringifiedData)
    console.log(stringifiedData)
}

const getLocalStorageHistory = () => {
    return JSON.parse(localStorage.getItem(localStorageHistoryKey))
}

interface HistoryPostInterface {
    onGet: (data: Array<Record<string, any>>) => void
}

/**
 * 
 * @param onGet what happen when you click and get the history data
 * @returns 
 */
const HistoryPost = ({ onGet }: HistoryPostInterface) => {
    const [historyData, setHistoryData] = useState([])
    const [shownHistory, setShownHistory] = useState([])

    useEffect(() => {
        let storageItemHistory = getLocalStorageHistory()
        if (storageItemHistory) {
            setHistoryData(storageItemHistory)
            setShownHistory([storageItemHistory[0]])
        }
    }, [])

    const onClickHistory = () => {
        onGet(historyData)
    }

    return (<>
        {shownHistory.map((datum, index) => (
            <div className="mt-3  d-flex" key={index} onClick={onClickHistory} style={{ cursor: 'pointer' }}>
                <div className="border rounded p-3 ">
                    <div className="d-flex">
                        <div>
                            <img width={100} height={100} src={datum.href} />
                        </div>
                        <div className="ms-3">
                            <div>{datum.title}</div>
                            <div>{datum.caption}</div>
                            <div>{datum.labels}</div>
                        </div></div>
                    <hr />
                    <div className="text-center fw-bold">Select History</div>
                </div>
            </div>
        ))}

    </>)
}

export default HistoryPost
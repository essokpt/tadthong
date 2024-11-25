import {ChangeEvent, useCallback, useState} from "react";

import api from '../../config/SetupAxios'

// const endpoint = '/Customer'

//export const getCustomer = (url: string) =>  axios.get(url).then((res) => res.data);

const useThaiAddress = () => {
    const [dataValue, setData] = useState(undefined)
    const [error, setError] = useState(false)

    const userInputCallback = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        try{
            const { data }  = await api.get(`ThaiAddress/Query/${event.target.value}`)
            console.log("get thai data", data);
            
            setData(data)
            setError(false)

        } catch {
            setError(true)
            setData(undefined)
        }
    }, [])


    return {userInputCallback, dataValue, error}
}

export default useThaiAddress
import {ethers} from 'ethers'
import {useState, useEffect, useMemo, useCallback, useRef} from 'react'
import axios from 'axios'

const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s2.binance.org:8545/");


export default function usePrices(edeBotExecutor) {

    // const [value, setValue] = useState<number>(0);
    // const [timers, setTimers] = useState<Array<NodeJS.Timeout>>([]);
    // const saveCallBack: any = useRef();
    // const callBack = () => {
    //     const random: number = (Math.random() * 10) | 0;
    //     setValue(value + random);
    // };
    // useEffect(() => {
    //     saveCallBack.current = callBack;
    //     return () => {
    //     };
    // });
    // useEffect(() => {
    //     const tick = () => {
    //         saveCallBack.current();
    //     };
    //     const timer: NodeJS.Timeout = setInterval(tick, 1000 * 10);
    //     timers.push(timer);
    //     setTimers(timers);
    //     console.log("timer::", timers);
    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    const [all, setAll] = useState([])

    useEffect(() => {
        const fetchMyAPI = async () => {
            try {

                // let allBalance = [];
                // for (var i = 0; i < edeBotExecutor.length; i++) {
                //     let rs = await provider.getBalance(edeBotExecutor[i].address);
                //     let bal = ethers.utils.formatEther(rs);
                //     edeBotExecutor[i].balance = Number(bal).toFixed(3);
                //     edeBotExecutor[i].status = 'active';
                //     allBalance.push(edeBotExecutor[i])
                // }
                // console.log(Date.now())
                // setAll(allBalance);


                await axios.get(`http://35.228.239.221:9480/prices`).then(res => {
                    console.log(res.data)
                    // this.setState({
                    //     filmList:res.data.data
                    // })


                    let myData = res.data
                    // for (let i = 0; i < myData.length; i++) {
                    //     myData[i].id = i;
                    //     myData[i].name = myData[i].taskName;
                    //     myData[i].status = "active";
                    //     myData[i].avatarUrl = `/assets/images/avatars/avatar_${i+1}.jpg`;
                    //
                    // }
                    // console.log("myData:", myData)
                    setAll(myData);


                })

            } catch (error) {
                console.log(error)
            }

        }
        fetchMyAPI();
    })

    return {
        all
    }
}





import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {error, success} from "src/slices/MessagesSlice";
import axios from "axios";


export default function useLiquidity() {
    const dispatch = useDispatch();

    const harvestPost = useCallback(
        async (account, collateralToken, indexToken, isLong) => {
            console.log("useLiquidity::harvestPost", account, collateralToken, indexToken, isLong);
            try {
                const rs = await harvestLiquidity(account, collateralToken, indexToken, isLong);
                console.log("useLiquidity::harvestPost::rs", rs);
                if(rs.code){
                    dispatch(success("Harvest Success!"));
                }else {
                    dispatch(error("Not now!"))
                }
            } catch (e) {
                console.log(e);
                console.log("dispatch error")
                dispatch(error("Harvest error!"))
            }
        },
        [],
    );

    return {harvestPost};
}

async function harvestLiquidity(account, collateralToken, indexToken, isLong) {
    // Default options are marked with *
    const response = await fetch(
        "https://data.ede.finance/harvest",
        {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, *cors, same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'authority': 'proxy-worker-dev.pancake-swap.workers.dev',
                // "origin": "https://pancakeswap.finance",
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                account, collateralToken, indexToken, isLong
                // body data type must match "Content-Type" header
            })
        });

    return response.json(); // parses JSON response into native JavaScript objects
}

import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {error, success} from "src/slices/MessagesSlice";


export default function useMint() {
    const dispatch = useDispatch();


    const harvest = useCallback(
        async (account, collateralToken, indexToken, isLong) => {

            let tx: any;
            try {

                await tx.wait();
                return tx;
            } catch (e: unknown) {
                console.log(e);
                dispatch(error("error msg"))
            } finally {
                if (tx) {
                    dispatch(success("Mint Success!"));
                }
            }
        },
        [],
    );

    return {harvest};
}

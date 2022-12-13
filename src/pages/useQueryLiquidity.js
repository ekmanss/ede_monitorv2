/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {request, gql} from "graphql-request";

const endpoint = "https://graphqlzero.almansi.me/api";

const queryClient = new QueryClient();

function usePosts() {
    return useQuery(["posts"], async () => {
        const {
            posts: {data},
        } = await request(
            endpoint,
            gql`
                query {
                    posts {
                        data {
                            id
                            title
                        }
                    }
                }
            `
        );
        return data;
    });
}

function useGetLiquidity(tokenAddress, isLong) {
    const query = Boolean(isLong)
    return useQuery(["liquidity" + tokenAddress + isLong], async () => {
        const {activePositions: data} = await request(
            "https://api.thegraph.com/subgraphs/name/aaronlux/ede-graph",
            gql`
                query {
                    activePositions
                    (where:{
                        status:1,
                        isLong_in:[true],
                        indexToken:"${tokenAddress}"
                        # liquidationPrice_lt:"1300"
                    }
                        orderBy:liquidationPrice,orderDirection:asc
                    )
                    {
                        status
                        liquidationPrice
                        size
                        averagePrice
                        collateral
                        account
                        indexToken
                        collateralToken
                        isLong
                        timestamp
                    }
                }
            `
        );

        for (let i = 0; i < data.length; i++) {
            data[i].id = i;
            data[i].name = data[i].address;
            data[i].status = "active";
            data[i].avatarUrl = `/assets/images/avatars/avatar_${i + 1}.jpg`;
        }
        return data;
    });
}

function useGetLiquidityShort(tokenAddress, isLong) {
    const query = Boolean(isLong)
    return useQuery(["liquidity" + tokenAddress + isLong], async () => {
        const {activePositions: data} = await request(
            "https://api.thegraph.com/subgraphs/name/aaronlux/ede-graph",
            gql`
                query {
                    activePositions
                    (where:{
                        status:1,
                        isLong_in:[false],
                        indexToken:"${tokenAddress}"
                        # liquidationPrice_lt:"1300"
                    }
                        orderBy:liquidationPrice,orderDirection:desc
                    )
                    {
                        status
                        liquidationPrice
                        size
                        averagePrice
                        collateral
                        account
                        indexToken
                        collateralToken
                        isLong
                        timestamp
                    }
                }
            `
        );

        for (let i = 0; i < data.length; i++) {
            data[i].id = i;
            data[i].name = data[i].address;
            data[i].status = "active";
            data[i].avatarUrl = `/assets/images/avatars/avatar_${i + 1}.jpg`;
        }

        return data;
    });
}


export default function useQueryLiquidity(TokenList) {


    const {data: BTCLong} = useGetLiquidity(TokenList.BTC, true);
    const {data: BTCShort} = useGetLiquidityShort(TokenList.BTC, false);
    const {data: BNBLong} = useGetLiquidity(TokenList.BNB, true);
    const {data: BNBShort} = useGetLiquidityShort(TokenList.BNB, false);
    const {data: ETHLong} = useGetLiquidity(TokenList.ETH, true);
    const {data: ETHShort} = useGetLiquidityShort(TokenList.ETH, false);


    return {
        ETHLong, ETHShort,
        BTCLong, BTCShort,
        BNBLong, BNBShort
    }


}
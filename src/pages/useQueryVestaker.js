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
import {random} from "lodash";
import {ethers} from "ethers";


function useQueryGraph() {

    return useQuery([], async () => {
        const {commonDataStore, accounts} = await request(
            "https://api.thegraph.com/subgraphs/name/metaverseblock/vestaker",
            gql`
                query {
                    accounts(first: 1000,orderBy:lockTimestamp,orderDirection:desc) {
                        address
                        totalStaked
                        lockTimestamp
                    }
                }
            `
        );
        // console.log("!!!useQueryMintedUser::commonDataStore", commonDataStore);
        // console.log("!!!useQueryMintedUser::accounts", accounts);
        // console.log("accounts.length",accounts.length)

        for (let i = 0; i < accounts.length; i++) {
            accounts[i].id = i;
            accounts[i].name = accounts[i].address;
            accounts[i].status = "active";
            accounts[i].avatarUrl = `/assets/images/avatars/avatar_${random(1,8) + 1}.jpg`;
            accounts[i].totalPoints = Number(ethers.utils.formatEther(accounts[i].totalStaked)).toFixed(2)+""
        }
        return {commonDataStore,accounts};
    });
}

export default function useQueryVestaker() {
    const {status, data, error, isFetching} = useQueryGraph();
    console.log("@@useQueryESBT commonDataStore",data);

    return isFetching?{accounts: [],commonDataStore:{}}:data;
}
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


function useQueryMintedUser() {

    return useQuery([], async () => {
        const {commonDataStore, accounts} = await request(
            "https://api.thegraph.com/subgraphs/name/metaverseblock/esbt002",
            gql`
                query {
                    commonDataStore(id: "totalMintedCounter") {
                        value
                    }
                    accounts
                    (where:{invitedTimestamp_gt:"0"},orderBy:invitedTimestamp,orderDirection:desc)
                    {
                        address
                        invitedTimestamp
                        totalPoints
                        parent {
                            address
                        }
                        sons {
                            address
                        }
                    }
                }
            `
        );
        console.log("!!!useQueryMintedUser::commonDataStore", commonDataStore);
        console.log("!!!useQueryMintedUser::accounts", accounts);

        for (let i = 0; i < accounts.length; i++) {
            accounts[i].id = i;
            accounts[i].name = accounts[i].address;
            accounts[i].status = "active";
            accounts[i].avatarUrl = `/assets/images/avatars/avatar_${random(1,8) + 1}.jpg`;
        }
        return {commonDataStore,accounts};
    });
}

export default function useQueryESBT() {
    const {status, data, error, isFetching} = useQueryMintedUser();
    console.log("@@useQueryESBT commonDataStore",data);

    return isFetching?{accounts: [],commonDataStore:{}}:data;
}
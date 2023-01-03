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

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}

function getRank(score) {

    if (score >= 100000) {
        return "SS"
    } else if (score >= 40000) {
        return "S"
    } else if (score >= 15000) {
        return "A"
    } else if (score >= 7500) {
        return "B"
    } else if (score >= 3000) {
        return "C"
    } else if (score >= 1000) {
        return "D"
    } else {
        return "E"
    }
}

function listToString(list) {
    let result = '';
    for (let i = 0; i < list.length; i++) {
        result += list[i].address + ',';
    }
    return result;
}


function useQueryMintedUser() {
    const startTime = 1620000000;
    const endTime = 1620000000;

    return useQuery([], async () => {
        const {commonDataStore, accounts} = await request(
            "https://api.thegraph.com/subgraphs/name/metaverseblock/esbt003",
            gql`
                query {
                    commonDataStore(id: "totalMintedCounter") {
                        value
                    }
                    accounts
                    (first: 1000, where:{invitedTimestamp_gt:"0"},orderBy:invitedTimestamp,orderDirection:desc)
                    {
                        address
                        invitedTimestamp
                        totalPoints
                        invitedScore
                        parent {
                            address
                        }
                        sons {
                            address
                        }
                        pointHistory{
                            typeCode
                            point
                            timestamp
                        }
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
            accounts[i].avatarUrl = `/assets/images/avatars/avatar_${random(1, 8) + 1}.jpg`;
            accounts[i].totalPoints = Number(ethers.utils.formatEther(accounts[i].totalPoints)).toFixed(2) + "";
            accounts[i].invitedScore = Number(ethers.utils.formatEther(accounts[i].invitedScore)).toFixed(2) + "";
            accounts[i].sonsAmount = accounts[i].sons.length;
            accounts[i].formatedTime = timestampToTime(accounts[i].invitedTimestamp);
            accounts[i].parentAddress = accounts[i].parent.address;
            accounts[i].rank = getRank(accounts[i].totalPoints * 1);
            accounts[i].sonsList = listToString(accounts[i].sons);
        }
        return {commonDataStore, accounts};
    });
}

export default function useQueryESBT() {
    const {status, data, error, isFetching} = useQueryMintedUser();
    console.log("@@useQueryESBT commonDataStore", data);

    return isFetching ? {accounts: [], commonDataStore: {}} : data;
}
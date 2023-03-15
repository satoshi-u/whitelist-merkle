#!/bin/bash
dt=$(date '+%d/%m/%Y %H:%M:%S')
echo "$dt" | tee -a ./scripts/logs.txt
echo "\r" | tee -a ./scripts/logs.txt
echo "Deploy a new Test Token ERC721 Contract"

yarn hardhat deploy-test-token --network mumbai | tee -a ./scripts/logs.txt

echo "\r" | tee -a ./scripts/logs.txt
echo '-------------------------------------' | tee -a ./scripts/logs.txt

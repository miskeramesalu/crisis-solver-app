import {
  Client,
  AccountBalanceQuery,
  AccountId,
  PrivateKey
} from "@hashgraph/sdk";

const client = Client.forTestnet();

const accountId =
  AccountId.fromString("0.0.7093641");

const privateKey =
  PrivateKey.fromStringECDSA(
    "e4b6a5d62c0deafd630108a01e987885afebf15457f42171f6493c7124dc726f"
  );

client.setOperator(accountId, privateKey);

const balance =
  await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);

console.log(balance.hbars.toString());
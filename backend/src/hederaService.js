import {
  Client,
  PrivateKey,
  AccountId,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenType,
  TokenSupplyType,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

import dotenv from "dotenv";

dotenv.config();

class HederaService {
  constructor() {
    try {
      const accountId = process.env.HEDERA_ACCOUNT_ID?.trim();

      let privateKey =
        process.env.HEDERA_PRIVATE_KEY?.trim();

      if (!accountId) {
        throw new Error(
          "HEDERA_ACCOUNT_ID missing"
        );
      }

      if (!privateKey) {
        throw new Error(
          "HEDERA_PRIVATE_KEY missing"
        );
      }

      // Remove 0x prefix if present
      if (privateKey.startsWith("0x")) {
        privateKey = privateKey.slice(2);
      }

      this.accountId =
        AccountId.fromString(accountId);

      this.privateKey =
        PrivateKey.fromStringECDSA(
          privateKey
        );

      const network =
        process.env.HEDERA_NETWORK?.toLowerCase() ||
        "testnet";

      this.client =
        network === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      this.client.setOperator(
        this.accountId,
        this.privateKey
      );

      this.client.setDefaultMaxTransactionFee(
        new Hbar(50)
      );

      this.client.setDefaultMaxQueryPayment(
        new Hbar(50)
      );

      this.topicId = null;
      this.tokenId = null;

      console.log(
        `✅ Hedera connected (${network})`
      );

      console.log(
        `✅ Account: ${this.accountId}`
      );
    } catch (error) {
      console.error(
        "❌ Hedera initialization failed:"
      );

      console.error(error.message);

      throw error;
    }
  }

  // =====================================================
  // CREATE TOPIC
  // =====================================================

  async createTopic(
    memo = "Crisis Solver Topic"
  ) {
    try {
      if (this.topicId) {
        return this.topicId;
      }

      const transaction =
        new TopicCreateTransaction()
          .setTopicMemo(memo);

      const txResponse =
        await transaction.execute(
          this.client
        );

      const receipt =
        await txResponse.getReceipt(
          this.client
        );

      this.topicId =
        receipt.topicId.toString();

      console.log(
        "✅ Topic Created:",
        this.topicId
      );

      return this.topicId;
    } catch (error) {
      console.error(
        "Create Topic Error:",
        error.message
      );

      throw error;
    }
  }

  // =====================================================
  // SUBMIT MESSAGE
  // =====================================================

  async submitHcsMessage(message) {
    try {
      if (!this.topicId) {
        await this.createTopic();
      }

      const txResponse =
        await new TopicMessageSubmitTransaction()
          .setTopicId(this.topicId)
          .setMessage(message)
          .execute(this.client);

      const receipt =
        await txResponse.getReceipt(
          this.client
        );

      return {
        topicId: this.topicId,
        status:
          receipt.status.toString(),
      };
    } catch (error) {
      console.error(
        "Submit Message Error:",
        error.message
      );

      throw error;
    }
  }

  // =====================================================
  // CREATE TOKEN
  // =====================================================

  async createRewardToken() {
    try {
      if (this.tokenId) {
        return this.tokenId;
      }

      const txResponse =
        await new TokenCreateTransaction()
          .setTokenName("CrisisToken")
          .setTokenSymbol("CRS")
          .setDecimals(0)
          .setInitialSupply(0)
          .setTreasuryAccountId(
            this.accountId
          )
          .setAdminKey(
            this.privateKey.publicKey
          )
          .setSupplyKey(
            this.privateKey.publicKey
          )
          .setTokenType(
            TokenType.FUNGIBLE_COMMON
          )
          .setSupplyType(
            TokenSupplyType.INFINITE
          )
          .execute(this.client);

      const receipt =
        await txResponse.getReceipt(
          this.client
        );

      this.tokenId =
        receipt.tokenId.toString();

      console.log(
        "✅ Token Created:",
        this.tokenId
      );

      return this.tokenId;
    } catch (error) {
      console.error(
        "Create Token Error:",
        error.message
      );

      throw error;
    }
  }

  // =====================================================
  // MINT TOKEN
  // =====================================================

  async mintToken(amount) {
    try {
      if (!this.tokenId) {
        throw new Error(
          "Token not created"
        );
      }

      const txResponse =
        await new TokenMintTransaction()
          .setTokenId(this.tokenId)
          .setAmount(amount)
          .execute(this.client);

      const receipt =
        await txResponse.getReceipt(
          this.client
        );

      return receipt.status.toString();
    } catch (error) {
      console.error(
        "Mint Error:",
        error.message
      );

      throw error;
    }
  }

  // =====================================================
  // SEND HBAR
  // =====================================================

  async sendHbar(
    toAccountId,
    amountHbar
  ) {
    try {
      const txResponse =
        await new TransferTransaction()
          .addHbarTransfer(
            this.accountId,
            new Hbar(-amountHbar)
          )
          .addHbarTransfer(
            AccountId.fromString(
              toAccountId
            ),
            new Hbar(amountHbar)
          )
          .execute(this.client);

      const receipt =
        await txResponse.getReceipt(
          this.client
        );

      return receipt.status.toString();
    } catch (error) {
      console.error(
        "HBAR Transfer Error:",
        error.message
      );

      throw error;
    }
  }
}

const hederaService =
  new HederaService();

export default hederaService;
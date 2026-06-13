import hederaService from "./hederaService.js";

try {
  const tokenId =
    await hederaService.createRewardToken();

  console.log("Token:", tokenId);
} catch (err) {
  console.error(err);
}
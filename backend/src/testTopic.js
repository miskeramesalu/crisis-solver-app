import hederaService from "./hederaService.js";

try {
  const topicId = await hederaService.createTopic();
  console.log("Topic:", topicId);
} catch (err) {
  console.error(err);
}
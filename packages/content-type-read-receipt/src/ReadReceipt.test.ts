import { Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import { ContentTypeReadReceipt, ReadReceiptCodec } from "./ReadReceipt";
import type { ReadReceipt } from "./ReadReceipt";

describe("ReadReceiptContentType", () => {
  it("has the right content type", () => {
    expect(ContentTypeReadReceipt.authorityId).toBe("xmtp.org");
    expect(ContentTypeReadReceipt.typeId).toBe("readReceipt");
    expect(ContentTypeReadReceipt.versionMajor).toBe(1);
    expect(ContentTypeReadReceipt.versionMinor).toBe(0);
  });

  it("can send a read receipt", async () => {
    const aliceWallet = Wallet.createRandom();
    const aliceClient = await Client.create(aliceWallet, { env: "local" });
    aliceClient.registerCodec(new ReadReceiptCodec());
    await aliceClient.publishUserContact();

    const bobWallet = Wallet.createRandom();
    const bobClient = await Client.create(bobWallet, { env: "local" });
    bobClient.registerCodec(new ReadReceiptCodec());
    await bobClient.publishUserContact();

    const conversation = await aliceClient.conversations.newConversation(
      bobWallet.address,
    );

    const dateString = new Date().toISOString();

    const readReceipt: ReadReceipt = {
      timestamp: dateString,
    };

    await conversation.send(readReceipt, {
      contentType: ContentTypeReadReceipt,
    });

    const bobConversation = await bobClient.conversations.newConversation(
      aliceWallet.address,
    );
    const messages = await bobConversation.messages();

    expect(messages.length).toBe(1);

    const readReceiptMessage = messages[0];
    const messageContent = readReceiptMessage.content as ReadReceipt;
    expect(messageContent.timestamp).toBe(dateString);
  });
});
import Storage from "utils/storage";
import Controller from "utils/controller";
import { constants, ec } from "starknet";
import base64url from "base64url";

const login =
  () =>
  async (
    address: string,
    credentialId: string,
    options: {
      rpId?: string;
      challengeExt?: Buffer;
    },
  ) => {
    const keypair = ec.genKeyPair();
    const controller = new Controller(keypair, address, credentialId, options);
    const { assertion, invoke } = await controller.signAddDeviceKey(
      constants.StarknetChainId.TESTNET,
    );
    Storage.set(
      `@register/${constants.StarknetChainId.TESTNET}/set_device_key`,
      invoke,
    );

    return {
      assertion: {
        id: assertion.id,
        type: assertion.type,
        rawId: base64url(Buffer.from(assertion.rawId)),
        clientExtensionResults: assertion.getClientExtensionResults(),
        response: {
          authenticatorData: base64url(
            Buffer.from(assertion.response.authenticatorData),
          ),
          clientDataJSON: base64url(
            Buffer.from(assertion.response.clientDataJSON),
          ),
          signature: base64url(Buffer.from(assertion.response.signature)),
        },
      },
    };
  };

export default login;

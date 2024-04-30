import {
  JsonRpcSigner,
  TransactionRequest,
  Web3Provider,
} from "@ethersproject/providers"
import { evmChains } from "@galacticcouncil/xcm-sdk"
import { Contract, Signature } from "ethers"
import { splitSignature } from "ethers/lib/utils"
import {
  CALL_PERMIT_ABI,
  CALL_PERMIT_ADDRESS,
  DISPATCH_ADDRESS,
} from "utils/evm"
import { MetaMaskLikeProvider, requestNetworkSwitch } from "utils/metamask"

type PermitMessage = {
  from: string
  to: string
  value: number
  data: string
  gaslimit: number
  nonce: number
  deadline: number
}

export class MetaMaskSigner {
  address: string
  provider: MetaMaskLikeProvider
  signer: JsonRpcSigner

  constructor(address: string, provider: MetaMaskLikeProvider) {
    this.address = address
    this.provider = provider
    this.signer = this.getSigner(provider)
  }

  getSigner(provider: MetaMaskLikeProvider) {
    return new Web3Provider(provider).getSigner()
  }

  setAddress(address: string) {
    this.address = address
  }

  getGasValues(tx: TransactionRequest) {
    return Promise.all([
      this.signer.provider.estimateGas(tx),
      this.signer.provider.getGasPrice(),
    ])
  }

  sendDispatch = async (data: string) => {
    return this.sendTransaction({
      to: DISPATCH_ADDRESS,
      data,
      from: this.address,
    })
  }

  getPermitNonce = async () => {
    const callPermit = new Contract(
      CALL_PERMIT_ADDRESS,
      CALL_PERMIT_ABI,
      this.signer.provider,
    )

    return callPermit.nonces(this.address)
  }

  sendPermitDispatch = async (
    data: string,
  ): Promise<{ signature: Signature; message: PermitMessage }> => {
    if (this.provider && this.address) {
      const nonce = await this.getPermitNonce()
      const tx = {
        from: this.address,
        to: DISPATCH_ADDRESS,
        data,
      }

      const [gas] = await this.getGasValues(tx)

      const createPermitMessageData = () => {
        const message: PermitMessage = {
          ...tx,
          value: 0,
          gaslimit: gas.mul(11).div(10).toNumber(),
          nonce: nonce.toNumber(),
          deadline: Math.floor(Date.now() / 1000 + 3600),
        }

        const typedData = JSON.stringify({
          types: {
            EIP712Domain: [
              {
                name: "name",
                type: "string",
              },
              {
                name: "version",
                type: "string",
              },
              {
                name: "chainId",
                type: "uint256",
              },
              {
                name: "verifyingContract",
                type: "address",
              },
            ],
            CallPermit: [
              {
                name: "from",
                type: "address",
              },
              {
                name: "to",
                type: "address",
              },
              {
                name: "value",
                type: "uint256",
              },
              {
                name: "data",
                type: "bytes",
              },
              {
                name: "gaslimit",
                type: "uint64",
              },
              {
                name: "nonce",
                type: "uint256",
              },
              {
                name: "deadline",
                type: "uint256",
              },
            ],
          },
          primaryType: "CallPermit",
          domain: {
            name: "Call Permit Precompile",
            version: "1",
            chainId: parseInt(import.meta.env.VITE_EVM_CHAIN_ID),
            verifyingContract: CALL_PERMIT_ADDRESS,
          },
          message: message,
        })

        return {
          typedData,
          message,
        }
      }

      const { message, typedData } = createPermitMessageData()

      const method = "eth_signTypedData_v4"
      const params = [this.address, typedData]

      return new Promise((resolve, reject) => {
        this.provider.sendAsync?.(
          {
            method,
            params,
          },
          (err, result) => {
            if (err) {
              return reject(err)
            }

            return resolve({
              message,
              signature: splitSignature(result.result),
            })
          },
        )
      })
    }

    throw new Error("Error signing transaction. Provider not found")
  }

  sendTransaction = async (
    transaction: TransactionRequest & { chain?: string },
  ) => {
    const { chain, ...tx } = transaction
    const from = chain && evmChains[chain] ? chain : "hydradx"
    await requestNetworkSwitch(this.provider, {
      chain: from,
      onSwitch: () => {
        // update signer after network switch
        this.signer = this.getSigner(this.provider)
      },
    })

    if (from === "hydradx") {
      const [gas, gasPrice] = await this.getGasValues(tx)

      const onePrc = gasPrice.div(100)
      const gasPricePlus = gasPrice.add(onePrc)

      return await this.signer.sendTransaction({
        maxPriorityFeePerGas: gasPricePlus,
        maxFeePerGas: gasPricePlus,
        gasLimit: gas.mul(11).div(10), // add 10%
        ...tx,
      })
    } else {
      return await this.signer.sendTransaction({
        ...tx,
      })
    }
  }
}

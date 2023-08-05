import { TContract, convertedBigNumber } from "abi-to-request";
import { Contract } from 'web3-eth-contract';
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { TransactionReceipt } from 'web3-core';
import { ethers } from "ethers";

//nonpayable
export const addition = {
	name: "addition",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			ids: string | number; //uint256
			idList: (string | number)[]; //uint256[]
		}
	) => {
		if (!arg) return
		const { ids, idList } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).addition(ids, idList)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.addition(ids, idList).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const avater = {
	name: "avater",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			addressParams1: string; //address
		}
	) => {
		if (!arg) return
		const { addressParams1 } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).avater(addressParams1)
			return convertedBigNumber(res) as string; //uint256
		} else {
			let res = await (contract as Contract).methods.avater(addressParams1).call()
			return res as string; //uint256
		}
	}
}

//nonpayable
export const compose = {
	name: "compose",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			idList: (string | number)[]; //uint256[]
			name: string; //string
			time: string; //string
			position: string; //string
			zIndex: string; //string
			decode: string; //string
		}
	) => {
		if (!arg) return
		const { idList, name, time, position, zIndex, decode } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).compose(idList, name, time, position, zIndex, decode)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.compose(idList, name, time, position, zIndex, decode).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const dataOwner = {
	name: "dataOwner",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			bytes32Params1: string; //bytes32
		}
	) => {
		if (!arg) return
		const { bytes32Params1 } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).dataOwner(bytes32Params1)
			return convertedBigNumber(res) as string; //address
		} else {
			let res = await (contract as Contract).methods.dataOwner(bytes32Params1).call()
			return res as string; //address
		}
	}
}

//nonpayable
export const handleTransfer = {
	name: "handleTransfer",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			from: string; //address
			to: string; //address
			id: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { from, to, id } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).handleTransfer(from, to, id)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.handleTransfer(from, to, id).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const make = {
	name: "make",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			name: string; //string
			rawData: string; //string
			time: string; //string
			position: string; //string
			zIndex: string; //string
			decode: string; //string
			num: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { name, rawData, time, position, zIndex, decode, num } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).make(name, rawData, time, position, zIndex, decode, num)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.make(name, rawData, time, position, zIndex, decode, num).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const material = {
	name: "material",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			uint256Params1: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { uint256Params1 } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).material(uint256Params1)
			return convertedBigNumber(res) as {
			composed: string; //uint256
			dataBytes: string; //bytes32
			remake: string; //bool
			}
		} else {
			let res = await (contract as Contract).methods.material(uint256Params1).call()
			return res as {
			composed: string; //uint256
			dataBytes: string; //bytes32
			remake: string; //bool
			}
		}
	}
}

//nonpayable
export const reMake = {
	name: "reMake",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			id: string | number; //uint256
			num: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { id, num } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).reMake(id, num)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.reMake(id, num).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const setAvater = {
	name: "setAvater",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			id: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { id } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).setAvater(id)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.setAvater(id).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const setConfig = {
	name: "setConfig",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			id: string | number; //uint256
			name: string; //string
			time: string; //string
			position: string; //string
			zIndex: string; //string
			decode: string; //string
			sort: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { id, name, time, position, zIndex, decode, sort } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).setConfig(id, name, time, position, zIndex, decode, sort)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.setConfig(id, name, time, position, zIndex, decode, sort).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const setDataOwner = {
	name: "setDataOwner",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			dataBytes: string; //bytes32
			to: string; //address
		}
	) => {
		if (!arg) return
		const { dataBytes, to } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).setDataOwner(dataBytes, to)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.setDataOwner(dataBytes, to).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const subtract = {
	name: "subtract",
	contract: "PixelsMetaverse",
	fun: async (
		contract: TContract,
		arg?: {
			ids: string | number; //uint256
			idList: (string | number)[]; //uint256[]
		}
	) => {
		if (!arg) return
		const { ids, idList } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).subtract(ids, idList)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.subtract(ids, idList).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

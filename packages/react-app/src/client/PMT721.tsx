import { TContract, convertedBigNumber } from "abi-to-request";
import { Contract } from 'web3-eth-contract';
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { TransactionReceipt } from 'web3-core';
import { ethers } from "ethers";

//nonpayable
export const approve = {
	name: "approve",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			to: string; //address
			tokenId: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { to, tokenId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).approve(to, tokenId)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.approve(to, tokenId).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const balanceOf = {
	name: "balanceOf",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			owner: string; //address
		}
	) => {
		if (!arg) return
		const { owner } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).balanceOf(owner)
			return convertedBigNumber(res) as string; //uint256
		} else {
			let res = await (contract as Contract).methods.balanceOf(owner).call()
			return res as string; //uint256
		}
	}
}

//nonpayable
export const burn = {
	name: "burn",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			id: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { id } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).burn(id)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.burn(id).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const currentID = {
	name: "currentID",
	contract: "PMT721",
	fun: async (
		contract: TContract,
	) => {
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).currentID()
			return convertedBigNumber(res) as string; //uint256
		} else {
			let res = await (contract as Contract).methods.currentID().call()
			return res as string; //uint256
		}
	}
}

//view
export const exits = {
	name: "exits",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			id: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { id } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).exits(id)
			return convertedBigNumber(res) as string; //bool
		} else {
			let res = await (contract as Contract).methods.exits(id).call()
			return res as string; //bool
		}
	}
}

//view
export const getApproved = {
	name: "getApproved",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			tokenId: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { tokenId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).getApproved(tokenId)
			return convertedBigNumber(res) as string; //address
		} else {
			let res = await (contract as Contract).methods.getApproved(tokenId).call()
			return res as string; //address
		}
	}
}

//view
export const isApprovedForAll = {
	name: "isApprovedForAll",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			owner: string; //address
			operator: string; //address
		}
	) => {
		if (!arg) return
		const { owner, operator } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).isApprovedForAll(owner, operator)
			return convertedBigNumber(res) as string; //bool
		} else {
			let res = await (contract as Contract).methods.isApprovedForAll(owner, operator).call()
			return res as string; //bool
		}
	}
}

//nonpayable
export const mint = {
	name: "mint",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			to: string; //address
		}
	) => {
		if (!arg) return
		const { to } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).mint(to)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.mint(to).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const minter = {
	name: "minter",
	contract: "PMT721",
	fun: async (
		contract: TContract,
	) => {
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).minter()
			return convertedBigNumber(res) as string; //address
		} else {
			let res = await (contract as Contract).methods.minter().call()
			return res as string; //address
		}
	}
}

//view
export const name = {
	name: "name",
	contract: "PMT721",
	fun: async (
		contract: TContract,
	) => {
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).name()
			return convertedBigNumber(res) as string; //string
		} else {
			let res = await (contract as Contract).methods.name().call()
			return res as string; //string
		}
	}
}

//view
export const ownerOf = {
	name: "ownerOf",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			tokenId: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { tokenId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).ownerOf(tokenId)
			return convertedBigNumber(res) as string; //address
		} else {
			let res = await (contract as Contract).methods.ownerOf(tokenId).call()
			return res as string; //address
		}
	}
}

//nonpayable
export const safeTransferFrom = {
	name: "safeTransferFrom",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			from: string; //address
			to: string; //address
			tokenId: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { from, to, tokenId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).safeTransferFrom(from, to, tokenId)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.safeTransferFrom(from, to, tokenId).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const safeTransferFromfromtotokenId_data = {
	name: "safeTransferFromfromtotokenId_data",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			from: string; //address
			to: string; //address
			tokenId: string | number; //uint256
			_data: string; //bytes
		}
	) => {
		if (!arg) return
		const { from, to, tokenId, _data } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).safeTransferFrom(from, to, tokenId, _data)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.safeTransferFrom(from, to, tokenId, _data).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const setApprovalForAll = {
	name: "setApprovalForAll",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			operator: string; //address
			approved: string; //bool
		}
	) => {
		if (!arg) return
		const { operator, approved } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).setApprovalForAll(operator, approved)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.setApprovalForAll(operator, approved).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const setMinter = {
	name: "setMinter",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			_minter: string; //address
		}
	) => {
		if (!arg) return
		const { _minter } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).setMinter(_minter)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.setMinter(_minter).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//nonpayable
export const setOwner = {
	name: "setOwner",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			owner: string; //address
		}
	) => {
		if (!arg) return
		const { owner } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).setOwner(owner)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.setOwner(owner).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

//view
export const supportsInterface = {
	name: "supportsInterface",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			interfaceId: string; //bytes4
		}
	) => {
		if (!arg) return
		const { interfaceId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).supportsInterface(interfaceId)
			return convertedBigNumber(res) as string; //bool
		} else {
			let res = await (contract as Contract).methods.supportsInterface(interfaceId).call()
			return res as string; //bool
		}
	}
}

//view
export const symbol = {
	name: "symbol",
	contract: "PMT721",
	fun: async (
		contract: TContract,
	) => {
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).symbol()
			return convertedBigNumber(res) as string; //string
		} else {
			let res = await (contract as Contract).methods.symbol().call()
			return res as string; //string
		}
	}
}

//view
export const tokenURI = {
	name: "tokenURI",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			tokenId: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { tokenId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).tokenURI(tokenId)
			return convertedBigNumber(res) as string; //string
		} else {
			let res = await (contract as Contract).methods.tokenURI(tokenId).call()
			return res as string; //string
		}
	}
}

//nonpayable
export const transferFrom = {
	name: "transferFrom",
	contract: "PMT721",
	fun: async (
		contract: TContract,
		arg?: {
			from: string; //address
			to: string; //address
			tokenId: string | number; //uint256
		}
	) => {
		if (!arg) return
		const { from, to, tokenId } = arg;
		if ((contract as any)?.address && !(contract as any)?.methods) {
			let res = await (contract as ethers.Contract).transferFrom(from, to, tokenId)
			return res as TransactionResponse
		} else {
			let res = await (contract as Contract).methods.transferFrom(from, to, tokenId).send({ from: contract.sendAccount })
			return res as TransactionReceipt
		}
	}
}

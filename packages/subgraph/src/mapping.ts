import { BigInt } from "@graphprotocol/graph-ts";
import {
  AvaterEvent,
  ComposeEvent,
  ConfigEvent,
  MaterialEvent
} from "../generated/PixelsMetaverse/PixelsMetaverse"
import { Avater, Material, TConfig } from "../generated/schema"

export function handleAvaterEvent(event: AvaterEvent): void {
  let avater = Avater.load(event.params.owner.toHex());
  if (avater == null) {
    avater = new Avater(event.params.owner.toHex());
  }
  avater.avater = event.params.avater.toString();

  avater.save();
}

export function handleMaterialEvent(event: MaterialEvent): void {
  //let zeroAddr = Address.fromHexString("0x0000000000000000000000000000000000000000");
  let material = Material.load(event.params.id.toString());
  if (material == null) {
    material = new Material(event.params.id.toString());
    material.owner = event.params.owner;
    material.rawData = event.params.rawData;
    material.remake = event.params.remake;
    material.config = event.params.configID.toString();
    material.composed = new BigInt(0);
    material.createID = event.params.id;
  } else {
    material.owner = event.params.owner;
    //material.burned = event.params.owner == zeroAddr;

    // fuck: event.params.rawData !== "" is true, but graph query event.params.rawDat is "" ?????
    // fuck: === not supper....... 
    if (event.params.rawData.length > 0) material.rawData = event.params.rawData;
    if (event.params.remake) material.remake = false
    if (!event.params.configID.isZero()) material.config = event.params.configID.toString();
  }

  material.save();
}

export function handleComposeEvent(event: ComposeEvent): void {
  let after = Material.load(event.params.toID.toString());
  if (after == null) {
    after = new Material(event.params.toID.toString());
    after.composes = event.params.id;
  } else {
    after.composes = after.composes.concat(event.params.id);
  }

  for (let i = 0; i < event.params.id.length; i++) {
    let id = event.params.id[i];
    let compose = Material.load(id.toString());
    if (compose == null) {
      compose = new Material(id.toString());
    }
    compose.composed = event.params.toID;
    after.composes = after.composes.concat(compose.composes);
    compose.save()
  }

  let before = Material.load(event.params.fromID.toString());
  if (before == null) {
    before = new Material(event.params.fromID.toString());
  } else {
    let composes = before.composes;
    for (let i = 0; i < event.params.id.length; i++) {
      let id = event.params.id[i];
      let index = composes.indexOf(id);
      composes.splice(index, 1);
    }
    before.composes = composes;
  }

  before.save()
  after.save();
}

export function handleConfigEvent(event: ConfigEvent): void {
  let config = TConfig.load(event.params.id.toString());
  if (config == null) {
    config = new TConfig(event.params.id.toString());
    config.name = event.params.name;
    config.position = event.params.position;
    config.time = event.params.time;
    config.zIndex = event.params.zIndex;
    config.decode = event.params.decode;
    config.sort = event.params.sort;
  } else {
    if (event.params.name.length > 0) config.name = event.params.name;
    if (event.params.position.length > 0) config.position = event.params.position;
    if (event.params.time.length > 0) config.time = event.params.time;
    if (event.params.zIndex.length > 0) config.zIndex = event.params.zIndex;
    if (event.params.decode.length > 0) config.decode = event.params.decode;
    //if (!event.params.sort.isZero()) config.sort = event.params.sort;
  }

  config.save()
}
import {
  BTCInputScriptType,
  BTCOutputScriptType,
} from '@shapeshiftoss/hdwallet-core'

import * as ProtoTypes from '@keepkey/device-protocol/lib/types_pb'

export const SEGMENT_SIZE = 63

export function typeIDFromMessageBuffer(bb: ByteBuffer) {
  let value = 0
  for (let i = bb.offset; i < bb.limit; i++) {
    value += bb.readByte(i)
  }
  return value
}

// Shim until this exists for jspb https://github.com/protocolbuffers/protobuf/issues/1591
export function protoFieldToSetMethod (fieldName: string): string {
  return `set${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
}

// https://gist.github.com/joni/3760795/8f0c1a608b7f0c8b3978db68105c5b1d741d0446
export function toUTF8Array(str: string): Uint8Array {
  var utf8: Array<number> = [];
  for (var i=0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
          i++;
          charcode = ((charcode&0x3ff)<<10)|(str.charCodeAt(i)&0x3ff)
          utf8.push(0xf0 | (charcode >>18),
                    0x80 | ((charcode>>12) & 0x3f),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f))
      }
  }
  return new Uint8Array(utf8)
}

export function translateInputScriptType (scriptType: BTCInputScriptType): ProtoTypes.InputScriptType {
  switch (scriptType) {
  case BTCInputScriptType.CashAddr:
  case BTCInputScriptType.SpendAddress:
    return ProtoTypes.InputScriptType.SPENDADDRESS
  case BTCInputScriptType.SpendMultisig:
    return ProtoTypes.InputScriptType.SPENDMULTISIG
  case BTCInputScriptType.SpendP2SHWitness:
    return ProtoTypes.InputScriptType.SPENDP2SHWITNESS
  case BTCInputScriptType.SpendWitness:
    return ProtoTypes.InputScriptType.SPENDWITNESS
  }
  throw new Error('unhandled InputSriptType enum: ' + scriptType)
}

export function translateOutputScriptType (scriptType: BTCOutputScriptType): ProtoTypes.OutputScriptType {
  switch (scriptType) {
  case BTCOutputScriptType.PayToAddress:
    return ProtoTypes.OutputScriptType.PAYTOADDRESS
  case BTCOutputScriptType.PayToMultisig:
    return ProtoTypes.OutputScriptType.PAYTOMULTISIG
  case BTCOutputScriptType.PayToP2SHWitness:
    return ProtoTypes.OutputScriptType.PAYTOP2SHWITNESS
  case BTCOutputScriptType.PayToWitness:
    return ProtoTypes.OutputScriptType.PAYTOWITNESS
  }
  throw new Error('unhandled OutputSriptType enum: ' + scriptType)
}

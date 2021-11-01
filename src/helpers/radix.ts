
export const char = `0123456789abcdef|ghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ/+)(*&^%$#@!{}><?;:"~=.,[]'·¥`
// char和char1必须严格相等，不然解析后就会出问题
export const cha1 = `0123456789abcdef|ghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ/+)(*&^%$#@!{}><?;:"~=.,[]'·¥`
export const char16 = `0123456789abcdef|`

export const stringRadixDeal = (strNumber: string, beforeRadix: number, afterRadix: number) => {
  let strRadix = ""
  try {
    if (beforeRadix === 10) {
      strRadix = string10ToOtherRadix(strNumber, afterRadix)
      return strRadix
    }
    if (afterRadix === 10) {
      strRadix = String(stringOtherRadixTo10(strNumber, beforeRadix))
      return strRadix
    }
    const get10Radix = String(stringOtherRadixTo10(strNumber, beforeRadix))
    strRadix = string10ToOtherRadix(get10Radix, afterRadix)
  } catch (error) {
    console.error(error)
  }
  return strRadix
}

//将其他进制数转换成10进制
export const stringOtherRadixTo10 = (strNumber: string, beforeRadix: number) => {
  let res = BigInt(0), len = strNumber.length;
  const radixBig = BigInt(beforeRadix)
  const chars = char.slice(0, beforeRadix)

  for (let i = 0; i < len; i++) {
    const count = len - 1 - i
    let pow = eval("(function(a,b){return a**b})")
    Math.pow = pow;
    const miNum = radixBig ** BigInt(i)
    res += BigInt(chars.indexOf(strNumber[count])) * miNum
  }
  return res;
}

//将10进制数转换成其他进制
export function string10ToOtherRadix(strNumber: string, afterRadix: number) {
  if (strNumber.length === 2) return ""
  let chars = char.slice(0, afterRadix).split(""),
    radix = BigInt(chars.length),
    qutient = BigInt(strNumber),
    arr = [];
  do {
    const mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[Number(mod)]);
  } while (qutient);
  return arr.join('');
}

/* //将17进制数转换成10进制
export function string17To10(number: string) {
  let res = BigInt(0), len = number.length;
  const radixBig = BigInt(char16.length)

  for (let i = 0; i < len; i++) {
    const count = len - 1 - i
    let pow = eval("(function(a,b){return a**b})")
    Math.pow = pow;
    const miNum = radixBig ** BigInt(i)
    res += BigInt(char16.indexOf(number[count])) * miNum
  }
  return res;
}

//将10进制数转换成92进制
export function string10to92(number: string) {
  if (number.length === 2) return ""
  let chars = char.split(''),
    radix = BigInt(chars.length),
    qutient = BigInt(number),
    arr = [];
  do {
    const mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[Number(mod)]);
  } while (qutient);
  return arr.join('');
}

//将92进制数转换成10进制
export function string92To10(number: string) { //把一个16进制数按照解析为十进制。
  let res = BigInt(0), len = number.length;
  const radixBig = BigInt(char.length)

  for (let i = 0; i < len; i++) {
    const count = len - 1 - i
    let pow = eval("(function(a,b){return a**b})")
    Math.pow = pow;
    const miNum = radixBig ** BigInt(i)
    res += BigInt(char.indexOf(number[count])) * miNum
  }
  return res;
}

//将10进制数转换成17进制
export function string10To17(number: bigint) {
  let chars = char16.split(''),
    radix = BigInt(chars.length),
    qutient = BigInt(number),
    arr = [];
  do {
    const mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[Number(mod)]);
  } while (qutient);
  return arr.join('');
} */
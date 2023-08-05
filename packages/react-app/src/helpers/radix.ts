
export const char = `0123456789abcdef|ghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ/+)(*&^%$#@!{}><?;:"~=.,[]'·¥`
// char和char1必须严格相等，不然解析后就会出问题
export const cha1 = `0123456789abcdef|ghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ/+)(*&^%$#@!{}><?;:"~=.,[]'·¥`

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
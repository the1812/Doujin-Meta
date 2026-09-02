import { randomBytes } from 'node:crypto'

const alphabet = '0123456789abcdefghjkmnpqrstvwxyz'

const encodeBase32 = (value, length) => {
  let result = ''
  for (let index = 0; index < length; index += 1) {
    result = alphabet.charAt(Number(value & 31n)) + result
    value >>= 5n
  }
  return result
}

const timestamp = encodeBase32(BigInt(Date.now()), 10)
const randomness = encodeBase32(BigInt(`0x${randomBytes(10).toString('hex')}`), 16)

console.log(timestamp + randomness)

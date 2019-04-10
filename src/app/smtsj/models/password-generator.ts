import { DecodedDemon } from '../models';
import PASSWORD_PBOX from '../data/password-pbox.json';

function base2(n: number, b: number): string {
  const suffix = n.toString(2);
  return '0'.repeat(b - suffix.length) + suffix;
}

export function encodeDemon(demon: DecodedDemon): number[] {
  const baseBits = [
    base2(0, 4),                   // Padding
    base2(demon.demonCode, 9),     // Demon
    base2(demon.lvl, 7),           // LVL
    base2(demon.skillCodes[5], 9), // 6th Skill
    base2(demon.skillCodes[4], 9), // 5th Skill
    base2(demon.skillCodes[3], 9), // 4th Skill
    base2(demon.skillCodes[2], 9), // 3rd Skill
    base2(demon.skillCodes[1], 9), // 2nd Skill
    base2(demon.skillCodes[0], 9), // 1st Skill
    base2(demon.exp, 32),          // EXP
    base2(demon.stats[1], 7),      // Max Ma
    base2(demon.stats[4], 7),      // Max Lu
    base2(demon.stats[3], 7),      // Max Ag
    base2(demon.stats[2], 7),      // Max Vi
    base2(demon.stats[0], 7),      // Max St
    base2(demon.stats[1], 7),      // Ma
    base2(demon.stats[4], 7),      // Lu
    base2(demon.stats[3], 7),      // Ag
    base2(demon.stats[2], 7),      // Vi
    base2(demon.stats[0], 7)       // St
  ].join('');

  const prow: Array<number> = PASSWORD_PBOX[demon.maskByte];
  const mixedBytes = Array<number>(22);

  // Mask and mix bytes
  for (let i = 0; i < 22; i++) {
    mixedBytes[prow[i]] = parseInt(baseBits.slice(8 * i, 8 * i + 8), 2) ^ demon.maskByte;
  }

  mixedBytes.push(demon.maskByte); // Mask byte
  mixedBytes.push(mixedBytes.reduce((acc, b) => acc + b, 0) % 256); // Checksum byte

  const mixedBits = mixedBytes.map(b => base2(b, 8)).join('');
  const passBytes = Array<number>(32);

  // Pseudo-base64 encode mixed bits
  for (let i = 0; i < 32; i++) {
    passBytes[i] = parseInt(mixedBits.slice(6 * i, 6 * i + 6), 2);
  }

  return passBytes;
}

export function decodeDemon(passBytes: number[]): DecodedDemon {
  const mixedBits = passBytes.map(b => base2(b, 6)).join('');
  const mixedBytes = Array<number>(24);

  for (let i = 0; i < 24; i++) {
    mixedBytes[i] = parseInt(mixedBits.slice(8 * i, 8 * i + 8), 2);
  }

  const checkSum = mixedBytes.pop();
  const maskByte = mixedBytes.pop();
  const prow: Array<number> = PASSWORD_PBOX[maskByte];

  const unmixedBytes = Array<number>(22);
  for (let i = 0; i < 22; i++) {
    unmixedBytes[i] = mixedBytes[prow[i]] ^ maskByte;
  }

  const bits = unmixedBytes.map(b => base2(b, 8)).join('');
  const demon: DecodedDemon = {
    demonCode: parseInt(bits.slice(4, 13), 2),
    lvl: parseInt(bits.slice(13, 20), 2),
    exp: parseInt(bits.slice(74, 106), 2),
    baseStats: [
      parseInt(bits.slice(134, 141), 2),
      parseInt(bits.slice(106, 113), 2),
      parseInt(bits.slice(127, 134), 2),
      parseInt(bits.slice(120, 127), 2),
      parseInt(bits.slice(113, 120), 2)
    ],
    stats: [
      parseInt(bits.slice(169, 176), 2),
      parseInt(bits.slice(141, 148), 2),
      parseInt(bits.slice(162, 169), 2),
      parseInt(bits.slice(155, 162), 2),
      parseInt(bits.slice(148, 155), 2)
    ],
    skillCodes: [
      parseInt(bits.slice(65, 74), 2),
      parseInt(bits.slice(56, 65), 2),
      parseInt(bits.slice(47, 56), 2),
      parseInt(bits.slice(38, 47), 2),
      parseInt(bits.slice(29, 38), 2),
      parseInt(bits.slice(20, 29), 2)
    ],
    maskByte
  };

  return demon;
}

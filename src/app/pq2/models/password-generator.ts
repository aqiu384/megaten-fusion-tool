import { DecodedDemon } from '../models';

const PLAY_BYTES = Array(24).fill(0);
PLAY_BYTES[0] = 4; // h-flag
PLAY_BYTES[2] = 50; // Play hours
PLAY_BYTES[4] = 50; // Play min
PLAY_BYTES[6] = 50; // Max lvl
PLAY_BYTES[7] = 50; // Comp %
PLAY_BYTES[8] = 50; // enemies
PLAY_BYTES[12] = 50; // steps
PLAY_BYTES[16] = 50; // money
PLAY_BYTES[20] = 50; // books

function strToBytes(str: string, len: number): number[] {
  return str.split('').map(c => c.charCodeAt(0)).concat(Array(len - str.length).fill(0))
}

const PQ_MSG_BYTES = [].concat(
  strToBytes('aqiu384.github.io', 21),
  strToBytes('https://youtu.be/b1KfNEPKncQ', 33)
);

const P3_NAME = 'kitaro';
const P4_NAME = 'bancho';
const P5_NAME = 'renren';
const PP_NAME = 'hamuko';

const PQ1J_NAME_BYTES = [].concat(strToBytes(P3_NAME, 17), strToBytes(P4_NAME, 17));
const PQ1E_NAME_BYTES = [].concat(strToBytes(P3_NAME, 29), strToBytes(P4_NAME, 29));
const PQ2J_NAME_BYTES = [].concat(strToBytes(P3_NAME, 17), strToBytes(P4_NAME, 17), strToBytes(P5_NAME, 17), strToBytes(PP_NAME, 17));

const PQ1_TEAM_BYTES = [].concat([34, 50], Array(36).fill(31), [31, 0, 31, 0, 0, 0, 1, 128]);
const PQ2_TEAM_BYTES = [].concat([34, 50], Array(54).fill(31), [31, 0, 1, 0]);

export function encodeDemon(demon: DecodedDemon, game?: string): number[] {
  return (game && game.includes('2')) ? encodePq2Demon(demon) : encodePqDemon(demon);
}

function encodePqDemon(demon: DecodedDemon): number[] {
  const nameBytes = demon.language === 'jpn' ? PQ1J_NAME_BYTES : PQ1E_NAME_BYTES;
  const passBytes = Array(30).fill(0);

  const xl = demon.lvl;
  const xe = Math.floor((((-0.07600161 * xl + 14.0603287) * xl + -0.02256972) * xl +  0.59031556) * xl + -1.87981906);
  const exp = demon.exp < 0 ? xe : demon.exp;

  passBytes[0] = demon.demonCode;
  passBytes[2] = demon.lvl;

  passBytes[6] = exp % 256;
  passBytes[7] = Math.floor(exp / 256) % 256;
  passBytes[8] = Math.floor(exp / 65536);

  for (let i = 0; i < 6; i++) {
    passBytes[10 + 2*i] = demon.skillCodes[i] % 256;
    passBytes[10 + 2*i + 1] = Math.floor(demon.skillCodes[i] / 256);
  }

  passBytes[26] = demon.hp * 10 % 256;
  passBytes[27] = Math.floor(demon.hp / 25.6);
  passBytes[28] = demon.mp * 10 % 256;
  passBytes[29] = Math.floor(demon.mp / 25.6);

  return [].concat(PLAY_BYTES, PQ_MSG_BYTES, nameBytes, PQ1_TEAM_BYTES, passBytes, Array(40).fill(0));
}

function encodePq2Demon(demon: DecodedDemon): number[] {
  const playBytes = PLAY_BYTES.slice()
  const passBytes = Array(25).fill(0);

  const xl = demon.lvl;
  const xe = Math.floor((((-0.0479755766 * xl + 9.28700353) * xl + 71.9694228) * xl + -81.1026214) * xl + 0.120783542);
  const exp = demon.exp < 0 ? xe : demon.exp;

  playBytes[6] = 256 - playBytes[6];
  passBytes[0] = demon.demonCode % 256;
  passBytes[1] = demon.lvl * 2 + Math.floor(demon.demonCode / 256);

  passBytes[2] = exp % 256;
  passBytes[3] = Math.floor(exp / 256) % 256;
  passBytes[4] = Math.floor(exp / 65536);

  for (let i = 0; i < 6; i++) {
    passBytes[6 + 2*i] = demon.skillCodes[i] % 256;
    passBytes[6 + 2*i + 1] = Math.floor(demon.skillCodes[i] / 256);
  }

  passBytes[22] = demon.hp * 10 % 256;
  passBytes[23] = (demon.mp * 10 % 16) * 16 + Math.floor(demon.hp / 25.6);
  passBytes[24] = Math.floor(demon.mp / 1.6);

  return [].concat(playBytes, PQ_MSG_BYTES, PQ2J_NAME_BYTES, PQ2_TEAM_BYTES, passBytes, Array(21).fill(0));
}

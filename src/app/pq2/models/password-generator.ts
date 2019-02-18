import { DecodedDemon } from '../models';

const PLAY_BYTES = Array(21).fill(0);
PLAY_BYTES[0] = 4; // h-flag
PLAY_BYTES[2] = 50; // Play hours
PLAY_BYTES[4] = 50; // Play min
PLAY_BYTES[6] = 50; // Max lvl
PLAY_BYTES[7] = 50; // Comp %
PLAY_BYTES[8] = 50; // enemies
PLAY_BYTES[12] = 50; // steps
PLAY_BYTES[16] = 50; // money
PLAY_BYTES[20] = 50; // books

const PQ_TEAM = 'aqiu384';
const PQ_MSG = 'https://aqiu384.github.io';
const P3_NAME = 'kitarou';
const P4_NAME = 'narukami';

// PQ1J 21 33 17 17
// PQ2J 24 33 17p3 17p4 17p5 17pp
const PQ1E_MSG_BYTES = [].concat(
  [0, 0, 0],
  PQ_TEAM.split('').map(c => c.charCodeAt(0)),
  Array(21 - PQ_TEAM.length).fill(0),
  PQ_MSG.split('').map(c => c.charCodeAt(0)),
  Array(33 - PQ_MSG.length).fill(0),
  P3_NAME.split('').map(c => c.charCodeAt(0)),
  Array(29 - P3_NAME.length).fill(0),
  P4_NAME.split('').map(c => c.charCodeAt(0)),
  Array(29 - P4_NAME.length).fill(0),
);

// PQ2J 56party 38 1f 00 01 00
const PQ1_TEAM_BYTES = Array(46).fill(0);
PQ1_TEAM_BYTES[0] = 34;
PQ1_TEAM_BYTES[1] = 50;
for (let i = 2; i < 38; i += 2) {
  PQ1_TEAM_BYTES[i] = 31;
}
PQ1_TEAM_BYTES[38] = 31
PQ1_TEAM_BYTES[40] = 31
PQ1_TEAM_BYTES[44] = 1
PQ1_TEAM_BYTES[45] = 128

export function encodeDemon(demon: DecodedDemon): number[] {
  const passBytes = Array(70).fill(0);

  passBytes[0] = demon.demonCode;
  passBytes[2] = demon.lvl;

  passBytes[6] = demon.exp % 256;
  passBytes[7] = Math.floor(demon.exp / 256) % 256;
  passBytes[8] = Math.floor(demon.exp / 65536);

  for (let i = 0; i < 6; i++) {
    passBytes[10 + 2*i] = demon.skillCodes[i] % 256;
    passBytes[10 + 2*i + 1] = Math.floor(demon.skillCodes[i] / 256);
  }

  passBytes[26] = demon.hp * 10 % 256;
  passBytes[27] = Math.floor(demon.hp / 25.6);
  passBytes[28] = demon.mp * 10 % 256;
  passBytes[29] = Math.floor(demon.mp / 25.6);

  return [].concat(PLAY_BYTES, PQ1E_MSG_BYTES, PQ1_TEAM_BYTES, passBytes);
}

export function encodePq2Demon(demon: DecodedDemon): number[] {
  const passBytes = Array(58).fill(0);

  passBytes[0] = demon.lvl * 2 + Math.floor(demon.demonCode / 256);
  passBytes[1] = demon.demonCode % 256;

  passBytes[2] = demon.exp % 256;
  passBytes[3] = Math.floor(demon.exp / 256) % 256;
  passBytes[4] = Math.floor(demon.exp / 65536);

  for (let i = 0; i < 6; i++) {
    passBytes[6 + 2*i] = demon.skillCodes[i] % 256;
    passBytes[6 + 2*i + 1] = Math.floor(demon.skillCodes[i] / 256);
  }

  passBytes[34] = demon.hp * 10 % 256;
  passBytes[35] = (demon.mp % 256) * 256 + Math.floor(demon.hp / 25.6);
  passBytes[36] = Math.floor(demon.mp / 25.6);

  return [].concat(PLAY_BYTES, PQ1E_MSG_BYTES, passBytes);
}

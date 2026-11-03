// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { buildIco } from './generate-icons.mjs';

const fakePng = (n) => Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(n)]);

describe('buildIco', () => {
  const pngs = [16, 32, 256].map((size, i) => ({ size, data: fakePng(10 + i) }));
  const ico = buildIco(pngs);

  it('writes an ICONDIR header with the image count', () => {
    expect(ico.readUInt16LE(0)).toBe(0); // reserved
    expect(ico.readUInt16LE(2)).toBe(1); // type: icon
    expect(ico.readUInt16LE(4)).toBe(3);
  });

  it('writes one directory entry per image with correct size and offset', () => {
    let offset = 6 + 16 * pngs.length;
    pngs.forEach(({ size, data }, i) => {
      const e = 6 + 16 * i;
      expect(ico.readUInt8(e)).toBe(size >= 256 ? 0 : size); // 0 encodes 256
      expect(ico.readUInt16LE(e + 6)).toBe(32);
      expect(ico.readUInt32LE(e + 8)).toBe(data.length);
      expect(ico.readUInt32LE(e + 12)).toBe(offset);
      expect(ico.subarray(offset, offset + data.length).equals(data)).toBe(true);
      offset += data.length;
    });
    expect(ico.length).toBe(offset);
  });
});

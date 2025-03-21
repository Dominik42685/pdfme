import jsQR, { QRCode } from 'jsqr';
import { PNG } from 'pngjs';
import {
  validateBarcodeInput,
  createBarCode,
  barCodeType2Bcid,
  mapHexColorForBwipJsLib,
} from '../src/barcodes/helper.js';

describe('validateBarcodeInput test', () => {
  test('qrcode', () => {
    // Less than 500 characters
    const type = 'qrcode';

    const valid = 'https://www.google.com/';
    const valid2 = '漢字を含む文字列';
    const invalid2 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYIIiVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQ';
    const blank = '';
    expect(validateBarcodeInput(type, valid)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('japanpost', () => {
    // https://barcode-place.azurewebsites.net/Barcode/zip
    // Postal code is numbers (0-9) only, address display numbers can use alphanumeric characters (0-9, A-Z) and hyphens (-).
    const type = 'japanpost';

    const valid1 = '10000131-3-2-503';
    const valid2 = '10000131-3-2-B503';
    const invalid1 = 'invalid';
    const invalid2 = '10000131=3=2-503';
    const invalid3 = '10000131=3=2-503';
    const invalid4 = '10000131-3-2-b503';
    const blank = '';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('ean13', () => {
    // https://barcode-place.azurewebsites.net/Barcode/jan
    // Valid characters are numbers (0-9) only. Standard type is 12 digits without check digit or 13 digits with check digit.
    const type = 'ean13';

    const valid1 = '111111111111';
    const valid2 = '1111111111116';
    const valid3 = '2822224229221';
    const valid4 = '3433333133331';
    const valid5 = '8434244447413';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, valid5)).toEqual(true);

    const invalid1 = '111';
    const invalid2 = '111111111111111111111111';
    const invalid3 = 'invalid';
    const invalid4 = '11111a111111';
    const invalid5 = '1111111111111';
    const blank = '';
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, invalid5)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('ean8', () => {
    // https://barcode-place.azurewebsites.net/Barcode/jan
    // Valid characters are numbers (0-9) only. Short type is 7 digits without check digit or 8 digits with check digit.
    const type = 'ean8';

    const valid1 = '1111111';
    const valid2 = '11111115';
    const valid3 = '22222220';
    const valid4 = '33333335';
    const valid5 = '44444440';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, valid5)).toEqual(true);

    const invalid1 = '111';
    const invalid2 = '11111111111111111111';
    const invalid3 = 'invalid';
    const invalid4 = '111a111';
    const invalid5 = '44444441';
    const blank = '';
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, invalid5)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('code39', () => {
    // https://barcode-place.azurewebsites.net/Barcode/code39
    // CODE39 supports numbers (0-9), uppercase alphabets (A-Z), symbols (-.$/+%), and spaces.
    const type = 'code39';

    const valid1 = '12345';
    const valid2 = 'ABCDE';
    const valid3 = '1A2B3C4D5G';
    const valid4 = '1-A $2/B+3%C4D5G';
    const invalid1 = '123a45';
    const invalid2 = '1-A$2/B+3%C4=D5G';
    const blank = '';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('code128', () => {
    // https://www.keyence.co.jp/ss/products/autoid/codereader/basic_code128.jsp
    // Characters that can be typed from a computer keyboard (except kanji, hiragana, and katakana) are possible.
    const type = 'code128';

    const valid1 = '12345';
    const valid2 = '1-A$2/B+3%C4=D5G';
    const valid3 = '1-A$2/B+3%C4=D5Ga~';
    const invalid1 = '1-A$2/B+3%C4=D5Gひらがな';
    const invalid2 = '1-A$2/B+3%C4=D5G〜';
    const invalid3 = '1ーA$2・B＋3%C4=D5G〜';
    const blank = '';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('nw7', () => {
    // https://barcode-place.azurewebsites.net/Barcode/nw7
    // https://en.wikipedia.org/wiki/Codabar
    // NW-7 supports numbers (0-9) and symbols (-.$:/+).
    // For start code/stop code, use any of the alphabets (A-D) at the beginning and end of the code.
    const type = 'nw7';

    const valid1 = 'A12345D';
    const valid2 = 'A$2/+345D';
    const valid3 = 'a4321D';
    const invalid1 = 'A12345G';
    const invalid2 = 'A12a45D';
    const blank = '';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('itf14', () => {
    // https://barcode-place.azurewebsites.net/Barcode/itf
    // Valid characters are numbers (0-9) only. 13 digits without check digit or 14 digits with check digit.
    const type = 'itf14';

    const valid1 = '1111111111111';
    const valid2 = '11111111111113';
    const valid3 = '22222222222226';
    const valid4 = '33333333333339';
    const valid5 = '44444444444442';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, valid5)).toEqual(true);
    const invalid1 = '111';
    const invalid2 = '11111111111111111111111111111';
    const invalid3 = '11111111111112';
    const blank = '';
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('upca', () => {
    // https://barcode-place.azurewebsites.net/Barcode/upc
    // Valid characters are numbers (0-9) only. 11 digits without check digit or 12 digits with check digit.
    const type = 'upca';

    const valid1 = '12345678901';
    const valid2 = '123456789012';
    const valid3 = '123456789036';
    const valid4 = '126456789013';
    const valid5 = '123456759015';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, valid5)).toEqual(true);
    const invalid1 = '1234567890';
    const invalid2 = '1234567890123';
    const invalid3 = '123456789011';
    const invalid4 = '126456789014';
    const blank = '';
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('upce', () => {
    // https://barcode-place.azurewebsites.net/Barcode/upc
    // Valid characters are numbers (0-9) only. The first digit (number system character) can only be 0.
    // 7 digits without check digit or 8 digits with check digit.
    const type = 'upce';

    const valid1 = '0111111';
    const valid2 = '01111118';
    const valid3 = '01111125';
    const valid4 = '01114126';
    const valid5 = '01101126';
    const blank = '';
    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, valid5)).toEqual(true);
    const invalid1 = '1111111';
    const invalid2 = '011111111';
    const invalid3 = '01111128';
    const invalid4 = '01114125';
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
    expect(validateBarcodeInput(type, invalid2)).toEqual(false);
    expect(validateBarcodeInput(type, invalid3)).toEqual(false);
    expect(validateBarcodeInput(type, invalid4)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
  });
  test('gs1datamatrix', () => {
    // https://www.gs1.org/docs/barcodes/GS1_DataMatrix_Guideline.pdf
    // find the GTIN application identifier, regex for "(01)" and the digits after it until
    // another "(" or end of string
    const type = 'gs1datamatrix';

    let valid = '(01)12244668801011(17)250712(10)22322SSD3';
    let valid_12 = '(01)1224466880108(17)250712(10)22322SSD3';
    let invalid_bad_checkdigit = '(01)12244668801014(17)250712(10)22322SSD3';
    let invalid_input_length = '(01)12244668801011(17)250712(10)22322SSD3(10)22322SSD3';

    const blank = '';
    expect(validateBarcodeInput(type, valid)).toEqual(true);
    expect(validateBarcodeInput(type, valid_12)).toEqual(true);
    expect(validateBarcodeInput(type, invalid_bad_checkdigit)).toEqual(false);
    expect(validateBarcodeInput(type, blank)).toEqual(false);
    expect(validateBarcodeInput(type, invalid_input_length)).toEqual(false);
  });

  test('pdf417', () => {
    const type = 'pdf417';

    const valid1 = '12345ABCDE';
    const valid2 = 'Test PDF417 barcode generation';
    const valid3 = 'ひらがなカタカナ漢字も使えます';
    const valid4 = 'Special characters: !@#$%^&*()-_=+[]{}|;:,.<>?/';

    // PDF417 supports binary data and virtually any character
    // It can encode up to 1.1 kilobytes of binary data

    // Very long string that should still be valid
    const valid5 = 'a'.repeat(1000);

    // Empty string is not valid
    const blank = '';

    expect(validateBarcodeInput(type, valid1)).toEqual(true);
    expect(validateBarcodeInput(type, valid2)).toEqual(true);
    expect(validateBarcodeInput(type, valid3)).toEqual(true);
    expect(validateBarcodeInput(type, valid4)).toEqual(true);
    expect(validateBarcodeInput(type, valid5)).toEqual(true);
    expect(validateBarcodeInput(type, blank)).toEqual(false);

    // PDF417 has a capacity limit, extremely long strings should fail
    const invalid1 = 'a'.repeat(2000);
    expect(validateBarcodeInput(type, invalid1)).toEqual(false);
  });
});

/**
 * Test whether input data can be correctly read from the generated QR code (png) image
 */
describe('createBarCode', () => {
  // テスト名, input, expected
  const tests = [
    ['URL', 'https://www.google.com/', 'https://www.google.com/'],
    ['ひらがな', 'てすとです', 'てすとです'],
    ['ひらがな2', 'あいうえおあいうえお２', 'あいうえおあいうえお２'],
    ['カタカナ', 'テストです', 'テストです'],
    ['漢字', 'お正月', 'お正月'],
    ['中国語', '新年快乐', '新年快乐'],
    ['タイ語', 'สวัสดีปีใหม่', 'สวัสดีปีใหม่'],
  ];

  describe('generate qrcode with default colours', () => {
    for (const t of tests) {
      // eslint-disable-next-line no-loop-func
      test(`${t[0]}: ${t[1]}`, async () => {
        const buffer = await createBarCode({
          type: 'qrcode',
          input: t[1],
          width: 10, // mm
          height: 10, // mm
          backgroundColor: '00000000', // Background color must be specified for jsQR to analyze properly
        });
        const png = PNG.sync.read(buffer);
        const pngData = new Uint8ClampedArray(png.data);
        const qr = jsQR(pngData, png.width, png.height) as QRCode;
        expect(qr).not.toBeNull();
        const dataBuffer = Buffer.from(qr.binaryData);
        expect(dataBuffer.toString('utf8')).toEqual(t[2]);
      });
    }
  });

  describe('generate qrcode with custom colours', () => {
    for (const t of tests) {
      // eslint-disable-next-line no-loop-func
      test(`${t[0]}: ${t[1]}`, async () => {
        const buffer = await createBarCode({
          type: 'qrcode',
          input: t[1],
          width: 10, // mm
          height: 10, // mm
          backgroundColor: 'ffffff',
          barColor: 'f50505',
        });
        const png = PNG.sync.read(buffer);
        const pngData = new Uint8ClampedArray(png.data);
        const qr = jsQR(pngData, png.width, png.height) as QRCode;
        expect(qr).not.toBeNull();
        const dataBuffer = Buffer.from(qr.binaryData);
        expect(dataBuffer.toString('utf8')).toEqual(t[2]);
      });
    }
  });
});

describe('barCodeType2Bcid test', () => {
  test('it maps the nw7 barcode type', () => {
    expect(barCodeType2Bcid('nw7')).toEqual('rationalizedCodabar');
  });
  test('it returns all other types as they are', () => {
    expect(barCodeType2Bcid('qrcode')).toEqual('qrcode');
    expect(barCodeType2Bcid('japanpost')).toEqual('japanpost');
    expect(barCodeType2Bcid('ean8')).toEqual('ean8');
    expect(barCodeType2Bcid('ean13')).toEqual('ean13');
    expect(barCodeType2Bcid('code39')).toEqual('code39');
    expect(barCodeType2Bcid('code128')).toEqual('code128');
    expect(barCodeType2Bcid('itf14')).toEqual('itf14');
    expect(barCodeType2Bcid('upca')).toEqual('upca');
    expect(barCodeType2Bcid('upce')).toEqual('upce');
    expect(barCodeType2Bcid('gs1datamatrix')).toEqual('gs1datamatrix');
    expect(barCodeType2Bcid('pdf417')).toEqual('pdf417');
  });
});

describe('mapHexColorForBwipJsLib text', () => {
  test('it strips a hex if there is one', () => {
    expect(mapHexColorForBwipJsLib('#ffffff')).toEqual('ffffff');
    expect(mapHexColorForBwipJsLib('#eee')).toEqual('eee');
    expect(mapHexColorForBwipJsLib('ffffff')).toEqual('ffffff');
  });
  test('it strips a hex from a fallback color if main color not defined', () => {
    expect(mapHexColorForBwipJsLib(undefined, '#ffffff')).toEqual('ffffff');
    expect(mapHexColorForBwipJsLib(undefined, '#eee')).toEqual('eee');
    expect(mapHexColorForBwipJsLib(undefined, 'ffffff')).toEqual('ffffff');
  });
  test('it defaults to black if neither color nor fallback passed', () => {
    expect(mapHexColorForBwipJsLib(undefined)).toEqual('000000');
  });
});

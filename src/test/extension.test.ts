import * as assert from 'assert';
import { converter } from "../converter";

suite("Convert Text To Base Tests", () => {
    test("Empty input", () => {
        assert.equal(converter.convert_text_to_base('', 10, 2, 0), '');
    });

    test("Invalid input", () => {
        assert.equal(converter.convert_text_to_base('abc', 10, 2, 0), 'abc');
    });

    test("Decimal to Binary", () => {
        assert.equal(converter.convert_text_to_base('0', 10, 2, 0), '0');
        assert.equal(converter.convert_text_to_base('1', 10, 2, 0), '1');
        assert.equal(converter.convert_text_to_base('123', 10, 2, 0), '1111011');
        assert.equal(converter.convert_text_to_base('-123', 10, 2, 0), '-1111011');
    });

    test("Decimal to Hex", () => {
        assert.equal(converter.convert_text_to_base('0', 10, 16, 0), '0');
        assert.equal(converter.convert_text_to_base('1', 10, 16, 0), '1');
        assert.equal(converter.convert_text_to_base('123', 10, 16, 0), '7b');
        assert.equal(converter.convert_text_to_base('-123', 10, 16, 0), '-7b');
    });

    test("Hex to Binary", () => {
        assert.equal(converter.convert_text_to_base('0', 16, 2, 0), '0');
        assert.equal(converter.convert_text_to_base('1', 16, 2, 0), '1');
        assert.equal(converter.convert_text_to_base('7b', 16, 2, 0), '1111011');
        assert.equal(converter.convert_text_to_base('-7b', 16, 2, 0), '-1111011');
    });

    test("Hex to Decimal", () => {
        assert.equal(converter.convert_text_to_base('0', 16, 10, 0), '0');
        assert.equal(converter.convert_text_to_base('1', 16, 10, 0), '1');
        assert.equal(converter.convert_text_to_base('7b', 16, 10, 0), '123');
        assert.equal(converter.convert_text_to_base('-7b', 16, 10, 0), '-123');
    });

    test("Binary to Decimal", () => {
        assert.equal(converter.convert_text_to_base('0', 2, 10, 0), '0');
        assert.equal(converter.convert_text_to_base('1', 2, 10, 0), '1');
        assert.equal(converter.convert_text_to_base('1111011', 2, 10, 0), '123');
        assert.equal(converter.convert_text_to_base('-1111011', 2, 10, 0), '-123');
    });

    test("Binary to Hex", () => {
        assert.equal(converter.convert_text_to_base('0', 2, 16, 0), '0');
        assert.equal(converter.convert_text_to_base('1', 2, 16, 0), '1');
        assert.equal(converter.convert_text_to_base('1111011', 2, 16, 0), '7b');
        assert.equal(converter.convert_text_to_base('-1111011', 2, 16, 0), '-7b');
    });

    test("Add identifier", () => {
        assert.equal(converter.convert_text_to_base('1', 10, 16, 0, '0x', ''), '0x1');
        assert.equal(converter.convert_text_to_base('1', 10, 2, 0,'','0b' ), '0b1');
    });

    test("Add padding", () => {
        assert.equal(converter.convert_text_to_base('10', 10, 16, 4), '000a');
        assert.equal(converter.convert_text_to_base('350', 10, 16, 3), '15e');
    });
});

suite("Unicode and Hex Tests", () => {
    test("Empty input", () => {
        assert.equal(converter.unicode_to_hex(''), '');
        assert.equal(converter.hex_to_unicode(''), '');
    });

    test("Basic string", () => {
        assert.equal(converter.unicode_to_hex('abc'), '\\u61\\u62\\u63');
        assert.equal(converter.hex_to_unicode('\\u61\\u62\\u63'), 'abc');
    });
});
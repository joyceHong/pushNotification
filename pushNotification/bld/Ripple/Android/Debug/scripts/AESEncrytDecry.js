var key = CryptoJS.enc.Utf8.parse('8080808080808080');
var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

var aesEncryDecry = {
    decryptStringAES: function (strEncryptText) {
        var decrypted = CryptoJS.AES.decrypt(strEncryptText, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    },
    encryptStringAES: function (strOrignText) {
        var encrypted = CryptoJS.AES.encrypt(strOrignText, key,{
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }
};

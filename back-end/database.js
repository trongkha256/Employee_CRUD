"use strict"
const sql = require("msnodesqlv8")
const md5 = require('md5')
const sha1 = require('sha1')
var CryptoJS = require("crypto-js");
const keymahoa = '0000'

const connectionString = "server=localhost;Database=QLSV;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

module.exports = {
    sqlLogin,
    Employees,
    addEmployee
}

function sqlLogin(username, password) {
    return new Promise(async (resolve, reject) => {
        const pass_md5 = '0x' + md5(password)
        const pass_sha1 = '0x' + sha1(password)
        const query = `
        select MASV AS MA from SINHVIEN
        where TENDN = ?
        and MATKHAU = CONVERT(varbinary, ?,1)
        union
        select MANV AS MA from NHANVIEN
        where TENDN = ?
        and MATKHAU = CONVERT(varbinary, ?,1)`

        sql.open(connectionString, (err, conn) => {
            if (err) return reject(err)

            conn.prepare(query, (err, ps) => {
                if (err) return reject(err)

                ps.preparedQuery([username,pass_md5,username, pass_sha1], (err, rows) => {
                    if (err) return reject(err)

                    if (rows.length > 0) return resolve(rows[0].MA)

                    return resolve()
                })
            })
        })
    })
}

function Employees() {
    return new Promise(async (resolve, reject) => {
        const query = `
        EXEC SP_SEL_ENCRYPT_NHANVIEN`

        sql.open(connectionString, (err, conn) => {
            if (err) return reject(err)

            conn.prepare(query, (err, ps) => {
                if (err) return reject(err)

                ps.preparedQuery([], (err, rows) => {
                    if (err) return reject(err)

                    if (rows.length > 0) return resolve(rows)

                    return resolve()
                })
            })
        })
    })
}

async function addEmployee(MANV, HOTEN, EMAIL, LUONG, TENDN, MATKHAU) {

    return new Promise((resolve, reject) => {
        
        var ciphertext = CryptoJS.AES.encrypt(LUONG,keymahoa).toString();
        LUONG = '0x'+Buffer.from(ciphertext).toString('hex')
        
        MATKHAU = '0x' + sha1(MATKHAU)
        const query = `
        INSERT INTO NHANVIEN VALUES ('${MANV}','${HOTEN}','${EMAIL}',${LUONG},'${TENDN}',${MATKHAU})
        `

        sql.open(connectionString, (err, conn) => {
            if (err) return reject(err)

            conn.prepare(query, (err, ps) => {
                if (err) return reject(err)

                ps.preparedQuery([], (err, rows) => {
                    if (err) return reject(err)

                    return resolve()
                })
            })
        })
    })
}

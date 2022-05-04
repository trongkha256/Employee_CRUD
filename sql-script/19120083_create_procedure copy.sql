/*----------------------------------------------------------
MASV: 19120083 - 19120120 - 19120455
HO TEN: Nguyen Trong Kha - Pham Huu Phuoc - Huynh Ngoc Bao
LAB: 03 - NHOM
NGAY: 26/4/2022
----------------------------------------------------------*/


USE QLSVNhom
GO

create OR ALTER PROCEDURE SP_INS_PUBLIC_NHANVIEN  
    @manv varchar(20),
    @hoten nvarchar(100),
    @email varchar(20),
    @luongcb INT ,
    @tendn nvarchar(100),
    @mk varchar(10)

as 
	DECLARE @luong VARBINARY(1000)
	SET @luong = CONVERT(VARBINARY(1000), @luongcb)
    DECLARE @C NVARCHAR(MAX) = 
    'create asymmetric key mahoa
        with algorithm = RSA_2048
        encryption by password = '''+@mk+''''
    EXEC(@C)
    insert into nhanvien values (@manv,@hoten,@email,ENCRYPTBYASYMKEY(ASYMKEY_ID('mahoa'),@luong),@tendn,HASHBYTES('SHA1',@mk),@manv)
	drop asymmetric key mahoa

EXEC SP_INS_PUBLIC_NHANVIEN 'NV01', 'NGUYEN VAN A', 'NVA@',3000000, 'NVA', 'abcd12'
go

CREATE OR ALTER PROCEDURE SP_SEL_PUBLIC_NHANVIEN @tendn nvarchar(100), @mk nvarchar(10)
AS
SELECT MANV,HOTEN,EMAIL,CONVERT(INT,DECRYPTBYASYMKEY(ASYMKEY_ID('mahoa'),LUONG,@mk)) AS LUONG
FROM NHANVIEN NV
WHERE NV.TENDN = @tendn
GO
exec SP_SEL_PUBLIC_NHANVIEN 'NVA', N'abcd12'
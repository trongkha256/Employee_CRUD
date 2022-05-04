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
    @mk varchar(100)

as 
	DECLARE @luong VARBINARY(1000)
	SET @luong = CONVERT(VARBINARY(1000), @luongcb)

    DECLARE @C NVARCHAR(MAX)
    SET @C = 'create asymmetric key '+@manv+'
        with algorithm = RSA_2048
        encryption by password = '''+@mk+''''

    EXEC(@C)

    insert into NHANVIEN values (
        @manv,
        @hoten,
        @email,
        ENCRYPTBYASYMKEY(ASYMKEY_ID(@manv),@luong),
        @tendn,
        HASHBYTES('SHA1',@mk),
        @manv
    )
go


CREATE OR ALTER PROCEDURE SP_SEL_PUBLIC_NHANVIEN 
    @tendn nvarchar(100), 
    @mk varchar(100)
AS
    DECLARE @nmk NVARCHAR(100)
    SET @nmk = CONVERT(nvarchar, @mk)
    SELECT MANV, HOTEN, EMAIL, CONVERT(INT,DECRYPTBYASYMKEY(ASYMKEY_ID(MANV),LUONG,@nmk)) AS LUONG
    FROM NHANVIEN NV
    WHERE NV.TENDN = @tendn and NV.MATKHAU =  HASHBYTES('SHA1',@mk)
GO


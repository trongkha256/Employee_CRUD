import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import '../css/employee.css'
const Employee = function Employee() {
    const [mount, setMount] = useState(false)
    const [MANV, setMANV] = useState('')
    const [HOTEN, setHOTEN] = useState('')
    const [EMAIL, setEMAIL] = useState('')
    const [LUONG, setLUONG] = useState('')
    const [TENDN, setTENDN] = useState('')
    const [MATKHAU, setMATKHAU] = useState('')
    var [employeeList, setEmployeeList] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        axios.get('/api/employee')
            .then(response => { setEmployeeList(response.data) })
            .catch(err => {
                if (err.request.status === 401)
                    navigate('/')
            })
    }, [])
    function handleAddEmployee(MANV, HOTEN, EMAIL, LUONG, TENDN, MATKHAU) {
        axios.post('/api/addEmployee/', { MANV, HOTEN, EMAIL, LUONG, TENDN, MATKHAU }, { withCredentials: true })
            .then(res => {

                axios.get('/api/employee')
                    .then(response => { setEmployeeList(response.data) });

            })
    }
    return (
        <div className='container'>
            <div className='lable bg-info'>
                <label for='MANV'>Mã nhân viên</label>
                <input type='text' name='MANV' value={MANV} onChange={(e) => setMANV(e.target.value)} />
                <label for='HOTEN'>Họ tên</label>
                <input type='text' name='HOTEN' value={HOTEN} onChange={(e) => setHOTEN(e.target.value)} />
                <label for='EMAIL'>Email</label>
                <input type='text' name='EMAIL' value={EMAIL} onChange={(e) => setEMAIL(e.target.value)} />
                <label for='LUONG'>Lương</label>
                <input type='text' name='LUONG' value={LUONG} onChange={(e) => setLUONG(e.target.value)} />
                <label for='TENDN'>Tên đăng nhập</label>
                <input type='text' value={TENDN} onChange={(e) => setTENDN(e.target.value)} />
                <label for='MATKHAU'>Mật khẩu</label>
                <input type='password' value={MATKHAU} onChange={(e) => setMATKHAU(e.target.value)} />

            </div>
            <div className='add'>
                {<button onClick={() => handleAddEmployee(MANV, HOTEN, EMAIL, LUONG, TENDN, MATKHAU)}>Thêm</button>}
            </div>

            <button onClick={() => setMount(true)}>Hiện danh sách nhân viên</button>
            <div class="col-8 mx-auto mt-5 bg-light">
                <table class="table">
                    {mount &&
                        <thead>
                            <tr>
                                <th>Mã nhân viên</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Lương</th>
                            </tr>
                        </thead>}

                    {mount && employeeList.map((employee, index) => {
                        return <tbody>
                            <tr key={index}>
                                <td>{employee.MANV}</td>
                                <td>{employee.HOTEN}</td>
                                <td>{employee.EMAIL}</td>
                                <td>{employee.LUONG}</td>
                            </tr>
                        </tbody>

                    })}

                </table>
            </div>



        </div>
    )
}

export default Employee;
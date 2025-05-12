import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import CreateCategoryModal from './CreateCategoryModal'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'

// const fakeListCategory = [
//     { category_id: 1, title: "Áo Nam", level: 1, parent_id: null },
//     { category_id: 2, title: "Quần Nam", level: 1, parent_id: null },
//     { category_id: 3, title: "Áo T-Shirt", level: 2, parent: "Áo Nam" },
//     { category_id: 4, title: "Áo Polo", level: 2, parent: "Áo Nam" },
//     { category_id: 5, title: "Quần Jeans", level: 2, parent: "Quần Nam" },
//     { category_id: 6, title: "Quần Short", level: 2, parent: "Quần Nam" },
// ]

const Category = () => {
    const [categoryList, setCategoryList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}/category/list`)
                setCategoryList(result.data)
            } catch (err) {
                console.log(err)
                // setCategoryList(fakeListCategory)
            }
        }

        getAllCategory()
    }, [])

    const refreshCategoryTable = async () => {
        try {
            const result = await axios.get(homeAPI + '/category/list')
            setCategoryList(result.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateCategoryLevel1 = async () => {
        const { value: newCategory } = await Swal.fire({
            title: 'Nhập tên danh mục mới',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên danh mục mới..',
            showCloseButton: true,
        })
        if (!newCategory) {
            swtoast.fire({
                text: "Thêm danh mục mới không thành công!"
            })
            return
        }
        if (newCategory) {
            try {
                await axios.post(homeAPI + '/category/create-level1',
                    {
                        title: newCategory
                    })
                refreshCategoryTable()
                swtoast.success({
                    text: 'Thêm danh mục mới thành công!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Xảy ra lỗi khi thêm danh mục mới vui lòng thử lại!'
                })
            }
        }
    }

    const handleUpdateCategory = async (category) => {
        const { value: newTitle } = await Swal.fire({
            title: 'Cập nhật tên danh mục',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên danh mục mới..',
            inputValue: category.title,
            showCloseButton: true,
        })
        if (!newTitle) {
            swtoast.fire({
                text: "Cập nhật danh mục không thành công!"
            })
            return
        }
        if (newTitle) {
            try {
                await axios.put(homeAPI + '/category/update',
                    {
                        category_id: category.category_id,
                        title: newTitle
                    })
                refreshCategoryTable()
                swtoast.success({
                    text: 'Cập nhật danh mục thành công!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Xảy ra lỗi khi cập nhật danh mục vui lòng thử lại!'
                })
            }
        }
    }

    const handleDeleteCategory = async (category) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa danh mục "${category.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`${homeAPI}/category/delete/${category.category_id}`)
                refreshCategoryTable()
                swtoast.success({
                    text: 'Xóa danh mục thành công!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: e.response?.data || 'Xảy ra lỗi khi xóa danh mục vui lòng thử lại!'
                })
            }
        }
    }

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả danh mục" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateCategoryLevel1}>Tạo danh mục level 1</button>
                <button className='btn btn-dark btn-sm' onClick={() => setIsModalOpen(true)}>Tạo danh mục level 2</button>
            </div>
            <div className='table-container' style={{ height: "520px" }}>
                <table className='table  table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>
                                Tên danh mục
                            </th>
                            <th>Level</th>
                            <th>
                                Danh mục cha
                            </th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            categoryList.map((category, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{category.title}</td>
                                        <td>{category.level}</td>
                                        <td>{category.parent}</td>
                                        <td className='text-center'>
                                            <button 
                                                className='btn btn-warning btn-sm me-2'
                                                onClick={() => handleUpdateCategory(category)}
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                className='btn btn-danger btn-sm'
                                                onClick={() => handleDeleteCategory(category)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <CreateCategoryModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    )
}

export default Category
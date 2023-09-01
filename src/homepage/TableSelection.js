import React, { useState } from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Styles from './TableSelection.module.css';
import SelectMenu from '../components/SelectMenu'
import { Link } from 'react-router-dom';
import axios from 'axios';

const TableSelection = () => {
    const StyledBox = styled(Box)`
    & button {
        m: 1;
        width: 280px;
        height: 60px;
        font-size: 20px;
        &:focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
        }
        color: black;
    }
`;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [itemData, setItemData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedSubCategory(null);
        // setItemData([]);
        // setIsDataLoaded(false);
    };

    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setItemData([]); // 기존 데이터 초기화
        setIsDataLoaded(false);

        const dataURL = `http://10.125.121.170:8080/list/${selectedCategory}/${subCategory}`;

        if (selectedCategory && subCategory) {
            setIsLoading(true); // 로딩 시작
            fetch(dataURL)
                .then(response => response.json())
                .then(data => {
                    setItemData(data);
                    setIsDataLoaded(true);
                })
                .catch(error => console.error('Fetch Error:', error))
                .finally(() => setIsLoading(false)); // 로딩 종료
        }
    };

    const handleImageClick = (item) => {
        const requestData = item.image_path;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(`http://10.125.121.170:8080/list/${selectedCategory}/${selectedSubCategory}`)
            .then(response => {
                const { product_name, product_code, sale_price } = response.data;
                console.log("Product Name:", product_name);
                console.log("Product Code:", product_code);
                console.log("Sale Price:", sale_price);

                const postData = {
                    image_path: requestData
                };

                axios.post(`http://10.125.121.170:8080/predict`, postData)
                    .then(predictionResponse => {
                        console.log(predictionResponse);
                    })
                    .catch(error => {
                        console.error('Error sending POST request:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching product info:', error);
            });
    };


    const renderCategoryButtons = () => {
        return (
            <StyledBox sx={{ '& button': { m: 1, width: '280px', height: '60px', fontSize: '20px' } }}>
                <Button variant="outlined" size="large" onMouseEnter={() => handleCategorySelect('top')}> 상의 </Button>
                <Button variant="outlined" size="large" onMouseEnter={() => handleCategorySelect('bottom')}> 하의 </Button>
                <Button variant="outlined" size="large" onMouseEnter={() => handleCategorySelect('outer')}> 아우터 </Button>
                <Button variant="outlined" size="large" onMouseEnter={() => handleCategorySelect('onepiece')}> 원피스 </Button>
            </StyledBox>
        );
    };


    const renderSubCategories = () => {
        return (
            <div className={Styles.subcategoryContainer}>
                {selectedCategory === 'top' && (
                    <StyledBox sx={{ '& button': { m: 1, width: '280px', height: '60px', fontSize: '20px', color: 'black' } }} className={Styles.subcategorybtn}>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('tshirt')}>티셔츠</Button>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('tshirtsleeveless')}>티셔츠나시</Button>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('knit')}>니트</Button>
                    </StyledBox>
                )}
                {selectedCategory === 'bottom' && (
                    <StyledBox sx={{ '& button': { m: 1, width: '280px', height: '60px', fontSize: '20px', color: 'black' } }} className={Styles.subcategorybtn}>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('pants')}>바지</Button>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('denim')}>데님</Button>
                    </StyledBox>
                )}
                {selectedCategory === 'outer' && (
                    <StyledBox sx={{ '& button': { m: 1, width: '280px', height: '60px', fontSize: '20px', color: 'black' } }} className={Styles.subcategorybtn}>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('jacket')}>자켓</Button>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('coat')}>코트</Button>
                    </StyledBox>
                )}
                {selectedCategory === 'onepiece' && (
                    <StyledBox sx={{ '& button': { m: 1, width: '280px', height: '60px', fontSize: '20px', color: 'black' } }} className={Styles.subcategorybtn}>
                        <Button variant="outlined" onClick={() => handleSubCategorySelect('onepiece')}>원피스</Button>
                    </StyledBox>
                )}
            </div>
        );
    };


    return (
        <>
            <div className={Styles.mainbutton}>
                <div className={Styles.category_select}>
                    {renderCategoryButtons()}
                </div>
                <div className={Styles.category_select}>
                    {renderSubCategories()}
                    <div className='selectmenu'>
                        <SelectMenu />
                    </div>
                </div>

                {isDataLoaded && (
                    <div className={Styles.imageGroupContainer}>
                        {isLoading ? (
                            <div className={Styles.loadingContainer}>
                                <p>Loading...</p>
                            </div>
                        ) : (
                            itemData.map((item) => (
                                <div key={item.productCode} className={Styles.imageGroupItem}>
                                    <Link to="#" onClick={() => handleImageClick(item)}>
                                        <img src={`http://10.125.121.170:8080/display?imagePath=${encodeURIComponent(item.imagePath)}`}
                                            alt='나인오즈 이미지'
                                            onError={(e) => { e.target.src = process.env.PUBLIC_URL + '/none.png'; }}
                                            className={Styles.nineozimg}
                                        />
                                        <div className={Styles.product_info}>
                                            <p className={Styles.prdname}>제품명: {item.productName}</p>
                                            <p>제품코드: {item.productCode}</p>
                                            <p>가격: {item.salePrice}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default TableSelection;

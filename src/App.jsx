import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coverSize, setCoverSize] = useState('Mid'); // 표지 크기 상태 (기본값: Mid)

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    const ttbKey = 'ttbfbwlgud511619001'; // 당신의 TTB 키로 교체
    const queryType = 'ItemNewAll'; // 최신 책 목록 조회
    const maxResults = 10;
    const start = 1;
    const url = `https://cors-anywhere.herokuapp.com/http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;

    try {
      const response = await axios.get(url);

      // API 응답 데이터 확인을 위한 로그 추가
      console.log(response.data); // 응답 전체 데이터 출력
      console.log(response.data.item); // 책 목록만 출력

      // 응답 데이터에 books 정보가 있는지 확인
      if (response.data && response.data.item) {
        setBooks(response.data.item);
      } else {
        throw new Error('책 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      setError(`Error fetching books: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleImageError = (e) => {
    // 이미지 로딩 오류 발생 시 대체 이미지로 변경
    e.target.src = 'https://via.placeholder.com/150'; // 대체 이미지 URL
  };

  // 표지 크기 설정
  const getCoverSizeStyle = (size) => {
    switch (size) {
      case 'Big':
        return { width: '200px' };
      case 'MidBig':
        return { width: '150px' };
      case 'Mid':
        return { width: '85px' };
      case 'Small':
        return { width: '75px' };
      case 'Mini':
        return { width: '65px' };
      case 'None':
        return { display: 'none' };
      default:
        return { width: '85px' }; // 기본 크기 Mid
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>신간도서 목록</h1>
      {books.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {books.map((book, index) => (
            <div key={index} style={cardStyle}>
              {/* 이미지 로딩 오류 시 대체 이미지 처리 */}
              <img
                src={book.cover || 'https://image.aladin.co.kr/product/36292/22/cover500/8932043566_1.jpg'} // URL 확인 후 대체 이미지
                alt={book.title}
                onError={handleImageError} // 이미지 오류 시 대체 이미지 설정
                style={getCoverSizeStyle(coverSize)} // 선택된 표지 크기 스타일 적용
              />
              <div style={{ padding: '10px' }}>
                <p style={{ fontWeight: 'bold' }}>{book.title}</p>
                <p>{book.author}</p>
                <p>{book.priceStandard}원</p>
                <a href={book.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                  More Info
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books found</p>
      )}
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'transform 0.3s, box-shadow 0.3s',
  textAlign: 'center',
};

export default App;

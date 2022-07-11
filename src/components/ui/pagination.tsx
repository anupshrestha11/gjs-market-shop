import RCPagination, { PaginationProps } from 'rc-pagination';
import React from 'react';
import 'rc-pagination/assets/index.css';

const Pagination: React.FC<PaginationProps> = (props) => {
  const textItemRender = (current, type, element) => {
    if (type === 'prev') {
      return 'Prev';
    }
    if (type === 'next') {
      return 'Next';
    }
    return element;
  };

  return <RCPagination itemRender={textItemRender} {...props} />;
};

export default Pagination;

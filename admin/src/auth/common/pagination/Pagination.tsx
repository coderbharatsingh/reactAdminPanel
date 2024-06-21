import * as React from "react";
import { Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { CustomPaginationStyle } from "./Css";

type propTypes = {
    size?: 'sm' | 'lg';
    alignment?: 'left' | 'center' | 'right';
    activePage?: number;
    items: number;
    limit: number;
    pageAsync?: number;
    disabled?: boolean;
    defaultCss?: boolean;
    onChange?: (page: number) => boolean;
}

const CustomPagination : React.FC<propTypes> = ({ size = '', activePage = 1, alignment = 'center', defaultCss = true, items, limit, pageAsync, disabled, onChange }) =>{
    items = items || 0;
    const [activeItem, setActiveItem] = React.useState(activePage);
    const pageLimit = Math.ceil(items / limit);
    const paginationLimit = 7;

    const clickHandler = (e: any, page: number) => {
        if(e) {
            e.preventDefault();
        }
        page = page < 1 ? 1 : page;
        page = page > pageLimit ? pageLimit : page;
        
        if(onChange) {
            if(onChange(page)) {
                setActiveItem(page);
            }
        } else {
            setActiveItem(page);
        }
    }

    const fieldOptions = (page: number, option?: 'next' | 'prev') => {
        let activeVal = option === 'next' ? pageLimit : page;
        activeVal = option === 'prev' ? 1 : activeVal;
        
        return {
            onClick: (e) => clickHandler(e, page),
            active: activeVal === activeItem,
            ...pageAsync && page > pageAsync || disabled ? { disabled: true } : {}
        }
    }

    React.useEffect(() => {
        if(activePage && activeItem !== activePage) {
            clickHandler(false, activePage);
        }
    }, [activePage]);

    if(pageLimit < 2) {
        return <></>;
    }

    return (<>
        <CustomPaginationStyle as={Pagination} size={size} className={`custom-pagination align-${alignment} ${defaultCss && 'default-css'}`}>
            <Pagination.Prev className="arrow-btns" {...fieldOptions(activeItem - 1, 'prev')}>
                <FontAwesomeIcon icon={faCaretLeft} className="icon" />
            </Pagination.Prev>

            {new Array(paginationLimit).fill('').map((value, key) => {
                let page = pageLimit > paginationLimit && activeItem > 4 ? activeItem + key + (pageLimit - activeItem < 3 ?  pageLimit - activeItem - 6 : - 3) : key + 1;
                if(page > pageLimit) {
                    return;
                }

                if(pageLimit > paginationLimit && activeItem > 4 && [0, 1].indexOf(key) > -1) {
                    if(key === 1) {
                        return <Pagination.Item key={key} {...fieldOptions(2)}>...</Pagination.Item>;
                    }
                    page = 1;
                }else if(pageLimit > paginationLimit && activeItem <= pageLimit - 4 && [5, 6].indexOf(key) > -1) {
                    if(key === 5) {
                        return <Pagination.Item key={key} {...fieldOptions(pageLimit - 1)}>...</Pagination.Item>;
                    }
                    page = pageLimit;
                }

                return (
                    <Pagination.Item key={key} {...fieldOptions(page)}>
                        {page}
                    </Pagination.Item>
                )
            })}

            <Pagination.Next className="arrow-btns" {...fieldOptions(activeItem + 1, 'next')}>
                <FontAwesomeIcon icon={faCaretRight} className="icon" />
            </Pagination.Next>
        </CustomPaginationStyle>
    </>)
}

export default CustomPagination;

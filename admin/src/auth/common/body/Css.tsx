import styled from 'styled-components/macro';
import { createGlobalStyle } from 'styled-components';
import { Variables } from '../Variables';

export const GlobalBodyStyle = createGlobalStyle`
  body {
    background: #fff;
  }
`;

export const BodyCss = styled.div`
  padding: 20px 40px;
  padding-left: 340px;

  &.full-screen {
    padding-left: 20px;
  }
`;

export const FormModal = styled.div`
  .modal-header, .modal-body {
    padding: 25px;
  }

  .modal-header {
    border: 0px solid;
    padding-bottom: 5px;

    .modal-title {
      font-size: 18px;
    }

    .close {
      font-size: 25px;
      padding: 12px;
    }
  }

  .modal-body {
    padding-top: 15px;

    label {
      font-size: 12px;
      font-weight: normal;
    }

    .form-control, .btn {
      height: 42px;
      font-size: 14px;
      padding: 10px 15px;
    }
    
    textarea.form-control {
      height: auto;
      min-height: 42px;
    }

    .form-control {
      background: #fdfdff;
      border-color: #e4e6fc;

      &.form-text {
        height: auto;
        min-height: 42px;
        max-height: 300px;
        overflow: auto;

        img {
          max-width: 100% !important;
          height: auto;
        }
      }
    }

    .form-check {
      label {
        cursor: pointer;
      }
    }

    .auto-height {
      height: auto;
    }

    .btn {
      margin-top: 25px;
      background: #6777ef;
      border-color: #fff;
      box-shadow: 0 2px 6px #acb5f6;
    }

    .select-search {
      width: 100%;

      .select-search__input {
        border-color: #e4e6fc;
        height: 42px;
        box-shadow: none;

        &:hover {
          border-color: #e4e6fc;          
        }
      }

      .select-search__options {
        padding: 0px;
  
        li {
          .select-search__option {
            &.is-selected {
              background: #007bff;
            
              &:hover {
                background: #007bff;
              }
            }
  
            &:hover {
              background: #007bff11;
            }
          }
        }
      }
    }
  }

  .modal-footer {
    padding: 10px;
    border: 0px solid;
  }
`;

export const TableViewCss = styled.div`
  [data-widget=expandable-table] {
    cursor: default;
  }

  .filter {
    display: inline-block;

    .dropdown-menu {
      min-width: 200px;

      .dropdown-item {
        display: inline-block;
        padding: 0px;
        width: auto;
      }
      
      .search-parent {
        border-top: 1px solid #ddd;
        padding: 10px 10px;
        margin-top: 5px;
        padding-bottom: 5px;
        text-align: center;
      }

      .form-group {
        margin: 0px;
        padding: 5px 15px;
        
        .form-check {
          label {
            cursor: pointer;
          }
        }
      }
    }
  }

  .search-input {
    display: flex;
    max-width: 100%;
    margin-bottom: 15px;
    
    input {
      width: 300px;
      margin-right: 10px;
    }

    .btn {
      white-space: nowrap;
    }
  }

  .table {
    max-width: 100%;

    th {
      padding-right: 30px;
      white-space: nowrap;
    }
  }
`;

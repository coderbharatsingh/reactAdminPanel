import * as React from 'react';
import { EduleteApi } from 'api';
import { Row, Image, Button, Dropdown, Spinner, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { NotFoundPage } from 'app/components/NotFoundPage/Loadable';
import { getQueryParams } from 'state/hooks/useAuth';
import ConfirmModal from '../ui/confirm-modal/ConfirmModal';
import FormView from './FormView';
import moment from 'moment';
import EduleteSkeleton from '../ui/skeleton/EduleteSkeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import TableOptions from './TableOptions';
import { TableViewCss } from './Css';
import CustomPagination from '../pagination/Pagination';
import ReactLinks from '../ReactLinks';
import { useNavigationActions } from 'state/hooks/useActions';
const queryString = require('query-string');

interface BodyParam {
  fullScreen?: boolean;
}

interface StateParams {
  entries: any;
  formFields: any;
  createEntry: boolean;
  isEditData: boolean;
  editEntryData: Object;
  isView: boolean;
  confirmModal: boolean;
  loaderAction: Object;
  pageNotFound: boolean;
  isLoading: boolean;
  countLoading: boolean;
  searchLoading: boolean;
  searchText: string;
  tableOptions: '' | 'import' | 'export';
  successHandler: () => void;
}

const TableView: React.FC<BodyParam> = (props) => {
  const actions = useNavigationActions();
  const searchParams = queryString.parse(window.location.search);
  const { page, pageNo } : any = useParams();
  const [getFilters, setFilters] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState<any>({
    page: parseInt(pageNo || 1),
    limit: 15,
    sort: searchParams?.sort || '-_id',
    search: searchParams?.search || ''
  });
  const [state, setState] = React.useState<StateParams>({
    entries: {},
    formFields: {},
    createEntry: false,
    isEditData: false,
    editEntryData: {},
    isView: false,
    confirmModal: false,
    loaderAction: {},
    pageNotFound: false,
    isLoading: false,
    countLoading: false,
    searchLoading: false,
    searchText: searchParams?.search || '',
    tableOptions: '',
    successHandler: () => {}
  });

  const setFormFields = (data: object) => {
    data['fieldValidation'] = data['fieldValidation'] ? data['fieldValidation'] : {};
    let keys = Object.keys(data['fields']);
    for(let i = 0; i < keys.length; i++) {
      if(!data['fieldValidation'][keys[i]]) {
        data['fieldValidation'][keys[i]] = {type: 'text'};
      }
    }
    return data;
  }

  const getEntries = async (ignoreLoading = false) => {
    if(state.isLoading && !ignoreLoading) { return; }    
    const searchQuery = getQueryParams();
    setState((prevState) => ({ ...prevState, isLoading: true, entries: {}}));
    const results = await EduleteApi.getResult(EduleteApi.getEntries(page, { ...query, searchQuery, filters: getFilters }));
    if(results.err && results.code === 404) {
      setState((prevState) => ({ ...prevState, pageNotFound: true }));
    }else if(results && results['success']) {
      setState((prevState) => ({ ...prevState, entries: results.data }));
    }
    setState((prevState) => ({ ...prevState, isLoading: false, searchLoading: false }));
  }

  const getFormFields = async () => {
    setState((prevState) => ({ ...prevState, isLoading: true, entries: {}, formFields: {}}));
    const results = await EduleteApi.getResult(EduleteApi.getFormFields(page));
    if(results.err && results.code === 404) {
      setState((prevState) => ({ ...prevState, pageNotFound: true }));
    }else if(results && results['success']) {
      getEntries(true);
      setState((prevState) => ({ ...prevState, formFields: setFormFields(results.data), pageNotFound: false }));
    }
  }

  const createEntry = (e) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, createEntry: true, isEditData: false, editEntryData: {} }));
  }

  const setTableOptions = (e, option: StateParams["tableOptions"]) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, tableOptions: option }));
  }

  const deleteKey = (key: any) => {
    setState((prevState) => {
      if(prevState.loaderAction[key]) {
        delete prevState.loaderAction[key];
      }
      prevState.entries.entries.splice(key, 1);
      return ({ ...prevState, entries: state.entries, loaderAction: state.loaderAction })
    });
  }

  const deleteEntry = async (key: string) => {
    setState((prevState) => ({ ...prevState, loaderAction: {...prevState.loaderAction, [key]: true }}));
    const id = state.entries.entries[key]['id'] ? state.entries.entries[key]['id'] : state.entries.entries[key]['_id'];
    const results = await EduleteApi.getResult(EduleteApi.deleteEntry(page, id));
    if(results && results['success']) {
      deleteKey(key);
    }
  }

  const handleActions = (e, key: string, action: string = 'view') => {
    e.preventDefault();
    if(action === 'view') {
      setState((prevState) => ({ ...prevState, createEntry: true, isEditData: true, isView: true, editEntryData: { ...state.entries.entries[key], entryKey: key } }));
    } else if(action === 'edit') {
      setState((prevState) => ({ ...prevState, createEntry: true, isEditData: true, editEntryData: { ...state.entries.entries[key], entryKey: key } }));
    }else {
      setState((prevState) => ({ ...prevState, 
        confirmModal: true,
        successHandler: () => {
          deleteEntry(key);
        }
      }));
    }
  }

  const responseHandler = (results: any, key: number = -1) => {
    setState((prevState) => {
      delete prevState.loaderAction[key];
      return ({ ...prevState, loaderAction: prevState.loaderAction })
    });
    
    if(results && results['success']) {
      if(results['data']) {
        if(key > -1) {
          setState((prevState) => { 
            prevState.entries.entries[key] = results['data'];
            return ({ ...prevState, entries: prevState.entries })
          });      
        } else {
          setState((prevState) => ({ ...prevState, entries: {...prevState.entries, entries: [results['data'], ...prevState.entries.entries ]}}));
        }
      } else {
        deleteKey(key);
      }
    }
  }

  const loaderActionHandler = (key: number = -1) => {
    setState((prevState) => ({ ...prevState, loaderAction: {...prevState.loaderAction, [key]: true }}));
  }

  const sortingHandler = (e, key: string) => {
    e.preventDefault();
    setQuery((prevState) => ({ ...prevState, sort: (query.sort === key ? `-${key}` : key) }));
  }

  const sortingClass = (key: string) => {
    const sort = query.sort === key ? 'sorting_asc' : (query.sort === `-${key}` ? 'sorting_desc' : '');
    return {className: `sorting ${sort}`};
  }

  const entryIndex = (key: number) => {
    const total = state.entries?.options?.total;
    const match = query.sort.match(/^-/i);
    let index = query.limit * (query.page - 1);
    index = match ? index : total - index;
    index = (index > total ? total : index) + (match ? key + 1 : -key);
    return index;
  }

  const getFieldValue = (index: string, field: string, isCalled: boolean = false) => {
    const validation = state.formFields?.fieldValidation?.[field];
    const val = state.entries.entries[index][field] || '';
    const isBoolean = validation?.custom?.type === 'boolean';

    if(typeof validation?.custom?.link !== 'undefined' && !isCalled) {
      const { href, target } = getButtonParams(validation?.custom?.link, index);
      return <ReactLinks {...{ to: href, target }}>{getFieldValue(index, field, true)}</ReactLinks>
    } else if(val.length || typeof val === 'boolean' || isBoolean) {
      if(validation?.type === 'date') {
        const format = validation?.dateFormat + (validation?.dateFormat && validation?.timeFormat ? ' ' : '') + (validation?.timeFormat ? validation.timeFormat : '');
        return moment(val).format(format);
      }else if(validation?.type === 'file') {
        const src = `${process.env.REACT_APP_UPLOAD_PATH}${val}`;
        const isMatch = src.match(/[.](png|jpg|jpeg|svg)$/i);
        return <a href={src} target="_blank">{isMatch ? <img src={src} /> : val}</a>;
      }else if(validation?.type === 'select' && validation?.options) {
        const isBoolean = validation?.custom?.type === 'boolean';
        if(isBoolean) {
          return val ? 'True' : 'False';
        }

        return validation.options.map((arrVal, key) => {
          if(arrVal?.value === val) {
            return arrVal?.name;
          }
        }) || val;
      }
    }

    if(typeof val === 'object') {
      if(val?.label && val?.value) {
        return val.label;
      } else if(!Array.isArray(val)) {
        return <>{Object.keys(val).map((index, key) => {
          return <div>{`${index} = ${val[index]}`}</div>;
        })}</>;
      } else if(validation?.custom?.value_type === 'array') {
        const ret_val: any = [];
        const labels = validation?.custom?.label || {};
        val.map((label, key) => {
          const index = Object.values(labels).indexOf(label);
          if(index > -1) {
            const label_val = Object.keys(labels)?.[index];
            if(label_val) {
              ret_val.push(label_val);
            }
          }
        });
        return ret_val.join(', ');
      }
      return val.join(', ');
    }

    return val;
  }

  const filterChange = (e) => {
    const val = e.target.value;
    const isChecked = e.target.checked;
    setFilters((prevState) => {
      if(prevState.indexOf(val) > -1) {
        if(!isChecked) {
          prevState.splice(prevState.indexOf(val), 1);
        }
      } else if(isChecked) {
        prevState.push(val);
      }

      return ([ ...prevState ])
    });
  }

  const searchFilter = (e) => {
    e.preventDefault();
    getEntries();
  }

  const PaginationChangeHandler = (page: number) => {
    setQuery((prevState) => ({ ...prevState, page }));
    return true;
  }

  const searchChangeHandler = (e) => {
    const val = e.target ? e.target.value : e;
    setState((prevState) => ({ ...prevState, searchText: val }));
  }

  const searchInputText = (e) => {
    e.preventDefault();
    setState((prevState) => {
      const text = prevState.searchText;
      setQuery((prevState) => ({ ...prevState, search: text, page: 1 }));
      return { ...prevState, searchLoading: true };
    });
  }

  const handleAxioRequest = async (e: any, url: string, options: object, key: string) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, loaderAction: {...prevState.loaderAction, [key]: true }}));
    const request = (options?.['type'] || '').toLowerCase() === 'post' ? EduleteApi.btnRequestPost(url, options?.['params'] || {}) : EduleteApi.btnRequest(url);
    const results = await EduleteApi.getResult(request);
    if(results && results['success']) {
      if(options?.['delete']) {
        deleteKey(key);
      }
    }
    
    setState((prevState) => {
      if(prevState.loaderAction[key]) {
        delete prevState.loaderAction[key];
      }
      return ({ ...prevState, loaderAction: state.loaderAction })
    });
  }

  const getButtonParams = (label, entryIndex) => {
    const customButtons = state.formFields?.customButtons;
    let labelVal = customButtons?.[label];
    if(!labelVal && customButtons) {
      const labels = Object.values(state.formFields?.customButtons);
      labelVal = labels?.[label];
      if(!labelVal) {
        return { label, target: '_blank' };
      }
    }

    const target = labelVal?.['target'] || '_self';
    const entryVal = state.entries.entries[entryIndex];
    let href = labelVal?.['url'] || labelVal;
    href = href.replace(`:id`, entryVal?.['id'] || entryVal?.['_id']);
    Object.keys(state.formFields?.fields || {}).map(field => {
      let value = entryVal[field] || '';
      value = value?.value || value;
      href = href.replace(`:${field}`, value);
    });

    let visibility = true;
    if(labelVal?.visible) {
      visibility = false;
      Object.keys(labelVal.visible).map(field => {
        if(entryVal?.[field] === labelVal.visible[field]) {
          visibility = true;
        }
      });
    }

    return { href, target, visibility };
  }

  React.useEffect(() => {
    if(Object.keys(state.formFields).length) {
      let newSearchParams = searchParams;
      newSearchParams['search'] = query.search;
      newSearchParams['sort'] = query.sort;
      if(query.search.length < 1) {
        delete newSearchParams['search'];
      }
      if(query.sort === '-_id') {
        delete newSearchParams['sort'];
      }
  
      actions.navigateToPath(`/${page}${query.page > 1 ? `/${query.page}` : ''}${Object.keys(searchParams).length ? `?${queryString.stringify(newSearchParams)}` : ''}`);
      getEntries();
    }
  }, [query.page, query.limit, query.sort, query.search]);

  React.useEffect(() => {
    setFilters([]);
    getFormFields();
  }, [page]);  

  if(state.pageNotFound) {
    return <NotFoundPage />;
  }

  return (
    <>
      {state.createEntry ? (
        <FormView show={state.createEntry} isEditEntry={state.isEditData} hideModel={() => setState((prevState) => ({ ...prevState, createEntry: false, isView: false }))} formFields={state.formFields || {}} editData={state.editEntryData} filters={getFilters} isView={state.isView} responseHandler={responseHandler} loaderAction={loaderActionHandler} />
      ) : ''}
      {state.tableOptions.length ? (
        <TableOptions show={state.tableOptions} entries={{ ...state.entries, formFields: state.formFields }} hideModel={() => setState((prevState) => ({ ...prevState, tableOptions: '' }))} refreshEntries={getEntries} />
      ) : ''}
      <ConfirmModal show={state.confirmModal} hideModel={() => setState((prevState) => ({ ...prevState, confirmModal: false }))} successHandler={state.successHandler}  />

      <TableViewCss className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{state.formFields?.title}</h3>
            </div>
            <div className="card-body">
              {(state.formFields?.searchFields || []).length > 0 && <>
                <Form onSubmit={searchInputText} className="search-input">
                  <Form.Control
                    type="search"
                    placeholder="Please enter search text"
                    onChange={searchChangeHandler}
                    value={state.searchText}
                  />
                  {state.isLoading ? (state.searchLoading && <Spinner animation="border" />) : <Button type='submit' variant="outline-success">Search</Button>}
                </Form>
              </>}
              <div className="d-flex mb-3">
                <div className='entries-data'>
                  <CustomPagination alignment="left" items={state.entries?.options?.total} limit={query.limit} activePage={query.page} onChange={PaginationChangeHandler} />
                  <div>
                      Showing {(query.limit * (query.page - 1)) + 1} to {query.limit * query.page < state.entries?.options?.total ? query.limit * query.page : state.entries?.options?.total} of {state.entries?.options?.total} entries
                  </div>
                </div>

                <div className="ml-auto">
                  {state.loaderAction[-1] ? <>
                    <Spinner animation="border" />
                  </>: <>
                    {state.formFields?.filters && <>
                      <Dropdown className="filter mr-2">
                        <Dropdown.Toggle variant="warning">
                          Filters
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {Object.keys(state.entries.formFields.filters).map(filter =>
                            <Form.Group controlId={`formBasicCheckbox${filter}`}>
                              <Form.Check type="checkbox" onChange={filterChange} value={filter} label={state.entries.formFields.filters[filter]} />
                            </Form.Group>
                          )}

                          <div className="search-parent">
                            {state.isLoading ? <>
                              <Spinner animation="border" />
                            </> : <>
                              <Dropdown.Item>
                                <Button variant="success" onClick={searchFilter}>Search</Button>
                              </Dropdown.Item>
                            </>}
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>}

                    {(state.formFields?.actions || []).indexOf('add') > -1 && <>
                      <Button variant="secondary" className="mr-2" onClick={(e) => setTableOptions(e, 'import')}>
                        <FontAwesomeIcon icon={faFileImport} /> Import
                      </Button>
                    </>}
                    {state.entries?.options?.total ? <>
                      <Button variant="info" className="mr-2" onClick={(e) => setTableOptions(e, 'export')}>
                        <FontAwesomeIcon icon={faFileExport} /> Export
                      </Button>
                    </> : ''}
                    {(state.formFields?.actions || []).indexOf('add') > -1 && <>
                      <Button onClick={createEntry}>Create</Button>
                    </>}
                  </>}
                </div>
              </div>
              
              {state.isLoading ? <>
                <EduleteSkeleton type="content-style-2" />
              </> : (Object.keys(state.entries?.entries || []).length ? <>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th {...sortingClass('_id')} onClick={(e) => sortingHandler(e, '_id')}>Id</th>
                      {Object.keys(state.formFields?.fields || {}).map((val, key) => {
                        const isFieldView = state.formFields?.fieldView;
                        if((!isFieldView && key > 4) || (isFieldView && isFieldView.indexOf(val) === -1)) {
                          return;
                        }

                        return <>
                          <th key={key} {...sortingClass(val)} onClick={(e) => sortingHandler(e, val)}>{state.formFields?.['fields'][val]}</th>
                        </>
                      })}
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(state.entries?.entries || {}).map((val, key) => 
                      <tr key={key} data-widget="expandable-table" aria-expanded="false">                        
                        <td>{entryIndex(key)}</td>
                        
                        {Object.keys(state.formFields?.fields || {}).map((field, index) => {
                          const isFieldView = state.formFields?.fieldView;
                          if((!isFieldView && index > 4) || (isFieldView && isFieldView.indexOf(field) === -1)) {
                            return;
                          }

                          return <>
                            <td key={index}>{getFieldValue(val, field)}</td>
                          </>
                        })}
                        
                        <td>
                          {state.loaderAction[val] ? <>
                            <Spinner animation="border" />
                          </>: <>
                            <Dropdown>
                              <Dropdown.Toggle variant="" className="btn-default">
                                Action
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item href="#" onClick={(e) => handleActions(e, val)}>View</Dropdown.Item>
                                {(state.formFields?.actions || []).indexOf('edit') > -1 && <>
                                  <Dropdown.Divider />
                                  <Dropdown.Item href="#" onClick={(e) => handleActions(e, val, 'edit')}>Edit</Dropdown.Item>
                                </>}
                                {(state.formFields?.actions || []).indexOf('delete') > -1 && <>
                                  <Dropdown.Divider />
                                  <Dropdown.Item href="#" onClick={(e) => handleActions(e, val, 'delete')}>Delete</Dropdown.Item>
                                </>}
                                {Object.keys(state.formFields?.customButtons || {}).map(label => {
                                  const btn_value = state.formFields?.customButtons[label];
                                  const { href, target, visibility } = getButtonParams(label, val);
                                  if(visibility) {
                                    return <>
                                      <Dropdown.Divider />
                                      {btn_value?.axios ? 
                                        <Dropdown.Item href="#" onClick={(e) => handleAxioRequest(e, href, btn_value.axios, val)}>{label}</Dropdown.Item> :
                                        <ReactLinks className="dropdown-item" to={href} target={target}>{label}</ReactLinks>                                
                                      }
                                    </>
                                  }
                                })}
                              </Dropdown.Menu>
                            </Dropdown>
                          </>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </> : <>
                <div className="text-center">
                  <Image src="/images/empty.jpeg" fluid />
                </div>
              </>)}
            </div>

            {Object.keys(state.entries?.entries || []).length ? <>
              <div className="card-body pt-0">
                <Row className="mr-0">
                  <div className="col-sm-12 col-md-5">
                    Showing {(query.limit * (query.page - 1)) + 1} to {query.limit * query.page < state.entries?.options?.total ? query.limit * query.page : state.entries?.options?.total} of {state.entries?.options?.total} entries
                  </div>
                  <div className="ml-md-auto">
                    <CustomPagination items={state.entries?.options?.total} limit={query.limit} activePage={query.page} onChange={PaginationChangeHandler} />
                  </div>
                </Row>
              </div>
            </> : ''}
        </div>
      </div>
      </TableViewCss>
    </>
  );
}

export default TableView;

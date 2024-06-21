import { EduleteApi } from 'api';
import * as React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SelectSearch from 'react-select-search';
import { toast } from 'react-toastify';
import { FormModal } from './Css';
import EduleteSkeleton from '../ui/skeleton/EduleteSkeleton';
import "react-select-search/style.css";
import { getQueryParams } from 'state/hooks/useAuth';
import readXlsxFile from 'read-excel-file';
import exportFromJSON from 'export-from-json'

interface BodyParams {
  fullScreen?: boolean;
  show: string;
  entries: any;
  refreshEntries?: () => void;
  hideModel: () => void;
}

const getSelectedOptions = {};

const TableOptions: React.FC<BodyParams> = ({ fullScreen = false, entries, show, hideModel, ...props }) => {
  const { page }: any = useParams();
  const handleClose = () => {
    hideModel();
  }
  const [state, setState] = React.useState({
    fields: {
      ...(show === 'export' ? {
        maxLimit: '',
        minLimit: '',
        limit: 'all',
      } : {}),
      importType: 'insert',
      file: ''
    },
    uploadCounts: {
      total: 0,
      uploaded: 0
    },
    exportTrigger: false,
    forceUpdate: false,
    isLoading: false,
  });

  const formRef = React.useRef<HTMLFormElement>(null);
  const [, forceUpdate] = React.useState(0);
  const validator = React.useRef(new SimpleReactValidator({
      element: (message, className) => (
        <Form.Control.Feedback className="d-block" type="invalid">
          <div className="invalid-message">{message}</div>
        </Form.Control.Feedback>),
      autoForceUpdate: {forceUpdate: forceUpdate}
  }));

  const fieldValidate = (name, rules?: string | any[], valid_name?: string) => {
    if(rules) {
      return validator.current.message(valid_name ? valid_name : name, name === 'file' && state.fields[name]?.name ? state.fields[name].name : state.fields[name], rules);
    }

    return {
      isInvalid: !validator.current.fieldValid(name),
      onBlur: (e) => {
        e.target.setAttribute('isBlur', true);
        validator.current.showMessageFor(name);
      },
      onChange: (e) => {
        let val = e.target ? e.target.value : e;
        if(name === 'file' && e.target.files) {
          val = e.target.files[0];
          const size = e.target.files[0].size;
          const sizeLimit = 100 * 1024 * 1024;
          if(size <= sizeLimit) {
              val = e.target.files[0];
          } else {
              return toast.error('Image size must less than 100 MB.', {
                  autoClose: 2000
              });
          }
        }

        setState((prevState) => ({ ...prevState, fields: { ...prevState.fields, [name]: val }}));
      }
    }
  }
  
  const clickHandler = async (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      if(show === 'export') {
        setState((prevState) => ({ ...prevState, exportTrigger: true}));
      } else {
        try {
          if(typeof state.fields.file === 'object') {
            setState((prevState) => ({ ...prevState, isLoading: true, uploadCounts: { uploaded: 0, total: 0 }}));
            await readXlsxFile(state.fields.file).then(async (rows) => {
              let errorEntries: any[] = [];
              const jsonLimit = 3000;
              setState((prevState) => ({ ...prevState, uploadCounts: { ...prevState.uploadCounts, total: rows.length }}));

              const uploadData = async (jsonValues, retry = 0) => {
                const params = {
                  ...state.fields,
                  file: {
                    name: state.fields.file?.['name'],
                    type: state.fields.file?.['type'],
                    size: jsonValues.length,
                    contentType: 'json',
                    value: JSON.stringify(jsonValues)                    
                  }
                }

                try {
                  const results = await EduleteApi.importEntries(page, params);
                  if(results && results['success']) {
                    setState((prevState) => ({ ...prevState, uploadCounts: { ...prevState.uploadCounts, uploaded: prevState.uploadCounts.uploaded + jsonLimit }}));
          
                    if(results?.errorEntries) {
                      if(errorEntries.length) {
                        results.errorEntries.shift();
                      }
                      errorEntries = [ ...errorEntries, ...results.errorEntries ];
                    }
                  }
                } catch(err) {
                  if(retry < 3) {
                    await uploadData(jsonValues, ++retry);
                  } else {
                    console.error(err);
                    toast.error('Unable to process this. Might be some network issue at your side.', {
                      autoClose: 2000
                    });          
                  }
                }
              }

              let jsonData: any[] = [];
              let firstRowIndex: any[] = [];
              const commonJson: any[] = [];
              for(let i = 0; i < rows.length; i++) {
                let rowData: any[] = [];
                if(i === 0) {
                  rows[i].map((column, key) => {
                    if(column !== null) {
                      firstRowIndex.push(key);
                    }
                  });
                }
                
                firstRowIndex.map((index) => {
                  rowData.push(rows[i]?.[index] || '');
                })

                if(i < 2) {
                  commonJson.push(rowData);
                  continue;
                }

                if(jsonData.length > jsonLimit) {
                  await uploadData(commonJson.concat(jsonData));
                  jsonData = [];
                }

                jsonData.push(rowData);
              }

              if(jsonData.length > 0) {
                await uploadData(commonJson.concat(jsonData));
              }
  
              if(props?.refreshEntries) {
                props.refreshEntries();
              }

              if(errorEntries.length) {
                exportFromJSON({ data: errorEntries, fileName: `${page}-error-edulete.xlsx`, exportType: exportFromJSON.types.xls })
              }

              hideModel();
              setState((prevState) => ({ ...prevState, isLoading: false}));
            });
          }
        } catch(err) {
          console.error(err);
          setState((prevState) => ({ ...prevState, isLoading: false}));
          toast.error('Something went wrong. Please try again', {
            autoClose: 2000
          });  
        }
      }
    } else {
      validator.current.showMessages();
      setState((prevState) => ({ ...prevState, forceUpdate: true}));
    }
  }

  React.useEffect(() => {
    if(state.exportTrigger && formRef?.current) {
      const exportWindow = window.open('', 'eduleteExportWindow');
      formRef.current.submit();
      
      if(exportWindow) {
        exportWindow.onunload = () => {
          hideModel();
        }
      } else {
        toast.warning('Popup window is disabled.', {
          autoClose: 2000
        });
      }
    }
  }, [state.exportTrigger]);

  return (
    <>
      {state.exportTrigger ? <>
        <form ref={formRef} method="post" action={`${process.env.REACT_APP_SERVER_BASEURL}api/admin/${page}/export`} target="eduleteExportWindow">
          <input type="hidden" name="limit" readOnly value={state.fields.limit} />
          {state.fields.limit === 'custom' ? <>
            <input type="hidden" name="minLimit" readOnly value={state.fields.minLimit} />
            <input type="hidden" name="maxLimit" readOnly value={state.fields.maxLimit} />
          </> : ''}
        </form>
      </> : ''}

      <FormModal as={Modal} show={show.length > 0} className="form-modal" backdrop="static" keyboard={false} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{show === 'import' ? 'Import' : 'Export'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {state.exportTrigger || state.isLoading ? <>
            {state.uploadCounts.total > 0 &&
              <Row className='mb-3'>
                <Col className='text-center'>
                  <h3>
                    <strong>{state.uploadCounts.uploaded}</strong> / {state.uploadCounts.total}
                  </h3>
                </Col>
              </Row>
            }
            <EduleteSkeleton type="content-style-2" />
          </> : <>
            <Form onSubmit={(e) => { e.preventDefault(); clickHandler(e); }}>
              <Row>
                {show === 'import' ? <>
                  <Col xs={12}><a href={`${process.env.REACT_APP_SERVER_BASEURL}api/admin/${page}/sampleFile`} target="_blank">Download Sample File</a></Col>

                  <Form.Group controlId="formBasicImage" className="col-6">
                      <Form.Label></Form.Label>
                      <Form.Control type="file" accept=".xls,.xlsx" {...fieldValidate('file')} />
                      <Form.Text className="text-muted">
                        Image size must less than 100 MB
                      </Form.Text>

                      {fieldValidate('file', ['required', {'regex': '[.]xls|[.]xlsx'}])}
                  </Form.Group>

                  <Form.Group controlId="formBasicImportOption" className="col-6">
                    <Form.Label>Import Action</Form.Label>
                    <SelectSearch
                      search
                      value={state.fields.importType}
                      options={[
                        { value: 'insert', name: 'Insert' },
                        { value: 'update', name: 'Update' },        
                      ]}
                      onChange={(val) => setState((prevState) => ({ ...prevState, fields: { ...prevState.fields, importType: (val?.toString() || '') }}))}
                    ></SelectSearch>
                  </Form.Group>

                  {Object.keys(entries?.formFields?.fields).map((index, key) => {
                    const validation = entries?.formFields?.fieldValidation?.[index] || {};
                    if(validation?.type === 'select' && validation?.custom?.options) {
                      const options = JSON.parse(JSON.stringify(entries?.formFields['fieldValidation'][index]));
                      const custom = options?.custom;
                      if(options?.custom) {
                        delete options.custom;
                      }
                      if(options?.required && state.fields.importType !== 'insert') {
                        delete options.required;
                      }
  
                      return <>
                        <Form.Group key={key} controlId={`formBasic${index}`} className="col-12">
                          <Form.Label>{entries?.formFields['fields'][index]}</Form.Label>
                          <SelectSearch
                            search
                            options={[]}
                            {...custom?.options?.table ? {
                              getOptions: (query) => {
                                const searchQuery = getQueryParams();
                                query = searchQuery?.[index]?.length && query.length < 1 ? searchQuery?.[index] : query; 
                                if(getSelectedOptions?.[index]?.[query]) {
                                  return getSelectedOptions?.[index]?.[query];
                                }

                                getSelectedOptions[index] = getSelectedOptions?.[index] ? getSelectedOptions[index] : {};
                                getSelectedOptions[index][query] = [];
                                return new Promise(async (resolve, reject) => {
                                  const res = await EduleteApi.getResult(EduleteApi.getOptions(page, { name: index, query: query }));
                                  if(res && res['success'] && res['data']) {
                                    getSelectedOptions[index][query] = res['data'];
                                    resolve(res['data']);
                                  }else {
                                    getSelectedOptions[index][query] = undefined;
                                    reject(res.err ? res.err : '');
                                  }
                                });
                              }
                            } : {}}
                            {...options} {...fieldValidate(index)}
                          />

                          {validation?.required ? <>
                            <Form.Control.Feedback className="d-block" type="invalid">
                              {fieldValidate(index, state.fields.importType === 'insert' ? 'required' : [])}
                            </Form.Control.Feedback>
                          </> : ''}
                        </Form.Group>
                      </>
                    }
                  })}
                </> : <>
                  <Form.Group controlId="formBasicType" className="col-12">
                    <Form.Label>Limit</Form.Label>
                    <Form.Control as="select" {...fieldValidate('limit')}>
                      <option value="all">All</option>
                      <option value="custom">Custom</option>
                    </Form.Control>
                  </Form.Group>

                  {state.fields.limit === 'custom' ? <>
                    <Form.Group controlId="formBasicMinLimit" className="col-6">
                        <Form.Label>Minimum Limit</Form.Label>
                        <Form.Control type="text" {...fieldValidate('minLimit')} />

                        {fieldValidate('minLimit', 'required|numeric|min:0,num')}
                    </Form.Group>

                    <Form.Group controlId="formBasicMaxLimit" className="col-6">
                        <Form.Label>Maximum Limit ({entries?.options?.total})</Form.Label>
                        <Form.Control type="text" {...fieldValidate('maxLimit')} />

                        {fieldValidate('maxLimit', `required|numeric|min:0,num|max:${entries?.options?.total},num`)}
                    </Form.Group>
                  </> : ''}
                </>}
              </Row>

              <Button variant="primary" type="submit" onClick={clickHandler} block>
                  Submit
              </Button>

              {show === 'import' ? <>
                <Row className="mt-5">
                  <Col xs={12}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Column Name</th>
                          <th>Mandatory</th>
                          <th>Validation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(entries?.formFields?.fields).map((index, key) => {
                          const validation = entries?.formFields?.fieldValidation?.[index] || {};
                          if(validation?.type === 'file' || (validation?.type === 'select' && validation?.custom?.options)) {
                            return;
                          }

                          let type = validation?.type || '';
                          type = type === 'select' ? 'Choose Values' : type;
                          type = type === 'editor' ? 'HTML Data' : type;

                          return <>
                            <tr key={key}>
                              <td>{entries?.formFields?.fields[index]}</td>
                              <td>{entries?.formFields?.fieldValidation?.[index]?.required ? 'Yes' : 'No'}</td>
                              <td>
                                {validation?.type && <>Type: <strong><span className="text-capitalize">{type}</span></strong><br/></>}
                                {validation?.dateFormat && <>Date Format: <strong>{validation?.dateFormat} {validation?.timeFormat || ''}</strong><br/></>}
                                {validation?.minLength && <>Minimum Length: <strong>{validation?.minLength}</strong><br/></>}
                                {validation?.maxLength && <>Maximum Length: <strong>{validation?.minLength}</strong><br/></>}
                                {validation?.options && <>Field values: <strong>{validation?.options.map((val, key) => val?.name).join(', ')}</strong><br/></>}
                                {validation?.pattern && <>Regex Pattern: <strong>{validation?.pattern}</strong><br/></>}
                              </td>
                            </tr>
                          </>;
                        })}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </> : ''}
            </Form>
          </>}
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </FormModal>
    </>
  );
}

export default TableOptions;

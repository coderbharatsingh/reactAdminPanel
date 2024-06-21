import { EduleteApi } from 'api';
import * as React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { Button, Form, Image, Modal, Row } from 'react-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';
import { toast } from 'react-toastify';
import SelectSearch from 'react-select-search';
import { useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { isMobile } from 'react-device-detect';
import Loader from '../ui/loader/Loader';
import { FormModal } from './Css';
import { TextEditor } from '../editor/TextEditor';
import { TinyEditor } from '../editor/TinyEditor';
import { convertToSlug, getBytes, getQueryParams, htmlDecode } from 'state/hooks/useAuth';
import "react-datetime/css/react-datetime.css";
import "react-select-search/style.css";

interface BodyParams {
  fullScreen?: boolean;
  isEditEntry?: boolean;
  formFields: any;
  show: boolean;
  editData: Object;
  isView?: boolean;
  filters?: string[];
  hideModel: () => void;
  loaderAction: (key: number) => void;
  responseHandler: (results: any, key?: number) => void;
}

const getSelectedOptions = {};

const FormView: React.FC<BodyParams> = ({ fullScreen = false, isEditEntry = false, isView = false, filters = [], show, editData, formFields, hideModel, loaderAction, responseHandler }) => {
  const { page }: any = useParams();
  const handleClose = () => {
    hideModel();
  }
  const [state, setState] = React.useState({
    fields: {},
    forceUpdate: false
  });

  const [, forceUpdate] = React.useState(0);
  const validator = React.useRef(new SimpleReactValidator({
      element: (message, className) => <div className="invalid-message">{message}</div>,
      autoForceUpdate: {forceUpdate: forceUpdate}
  }));

  const setRules = (rules: object) => {
    const rule_arr: any[] = [];
    if(rules['required_not']){
      const values = state.fields?.[rules['required_not']];
      rules['required'] = !values;
    } else if(rules['required_if'] || rules['exist_if']) {
      const key = rules['required_if'] || rules['exist_if'];
      const getArrField = (field) => {
        return field ? typeof field === 'string' ? [ field ] : field : [];
      }
      const field = Object.keys(key)[0];
      const values = state.fields?.[field];
      
      const in_arr = key?.[field]?.['in'];
      const nin_arr = key?.[field]?.['nin'];
      let required = nin_arr ? true : false;
      if(getArrField(in_arr).indexOf(values) > -1) {
        required = true;
      }
      if(getArrField(nin_arr).indexOf(values) > -1) {
        required = false;
      }

      rules['required'] = required;
    }
    
    if(rules['required']) {
      rule_arr.push('required');
    }
    
    if(rules['type'] === 'email') {
      rule_arr.push('email');
    }

    if(rules['min']) {
      rule_arr.push({min: [ rules['min'], 'num' ]});
    }

    if(rules['max']) {
      rule_arr.push({max: [ rules['max'], 'num' ]});
    }

    if(rules['minLength']) {
      rule_arr.push({min: rules['minLength']});
    }

    if(rules['maxLength']) {
      rule_arr.push({max: rules['maxLength']});
    }

    if(rules['accept']) {
      rule_arr.push({regex: rules['accept'].replace(/,/g, '|').replace(/\./g, '[.]')});
    }

    if(rules['pattern']) {
      rule_arr.push({regex: rules['pattern']});
    }

    return rule_arr;
  }

  const fieldValidate = (name, state, rules?: boolean) => {
    let validation = formFields['fieldValidation'][name];
    const isFile = validation['type'] === 'file';
    if(rules) {
      validation = setRules(validation);
      return validator.current.message(name, isFile && state.fields[name]?.name ? state.fields[name].name : state.fields[name], validation);
    }

    return {
      name: name,
      isInvalid: !validator.current.fieldValid(name),
      onBlur: (e) => {
        e.target.setAttribute('isBlur', true);
        validator.current.showMessageFor(name);
      },
      onChange: (e) => { 
        let val = e.target ? e.target.value : e;
        if(validation?.custom?.changeToUrl) {
          const key = validation?.custom?.changeToUrl;
          const field_val = convertToSlug(val);
          state((prevState) => ({ ...prevState, fields: { ...prevState.fields, [key]: field_val }}));
          const el = document.querySelector(`[name="${key}"]`);
          if(el) {
            el['value'] = field_val;
          }
        }

        if(isFile && e.target.files) {
          val = e.target.files?.[0];
          if(val) {
            const size = e.target.files[0].size;
            const fileSize = validation?.custom?.maxSize || '500kb';
            const sizeLimit = getBytes(fileSize);
            if(size <= sizeLimit) {
                val = e.target.files[0];
            } else {
              toast.error(`Image size must less than ${fileSize}.`, {
                  autoClose: 2000
              });
              val = '';
            }
          } else {
            val = '';
          }
        }
        if(validation?.type === 'date') {
          val = typeof val?.toISOString === 'function' ? val.toISOString() : '';
        }

        state((prevState) => ({ ...prevState, fields: { ...prevState.fields, [name]: val }}));
      }
    }
  }
  
  const clickHandler = async (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      hideModel();
      loaderAction(editData['entryKey'] ? editData['entryKey'] : -1);
      const id = editData['_id'] ? editData['_id'] : (editData['id'] ? editData['id'] : false);
      if(id) {
        const res = await EduleteApi.getResult(EduleteApi.updateEntry(page, id, state.fields, filters));
        responseHandler(res, editData['entryKey']);
      }else {
        const res = await EduleteApi.getResult(EduleteApi.createEntry(page, state.fields, filters));
        responseHandler(res);
      }
    } else {
      validator.current.showMessages();
      setState((prevState) => ({ ...prevState, forceUpdate: true}));
    }
  }

  const isFieldEditable = (val: string) => {
    return isEditEntry ? !(formFields?.editFields && formFields.editFields.indexOf(val) < 0) : true;
  }

  const multiValueChangeHandler = (e: any, index, custom: object, label_index) => {
    setState((prevState) => {
      const is_array = custom?.['value_type'] === 'array';
      const value = custom?.['label']?.[label_index];
      if(!prevState.fields?.[index]) {
        prevState.fields[index] = is_array ? [] : '';
      }

      if(is_array) {
        const isExist = prevState.fields[index].indexOf(value);
        if(e.target.checked && isExist < 0) {
          prevState.fields[index].push(value);
        } else if(!e.target.checked && isExist > -1) {
          prevState.fields[index].splice(isExist, 1);
        }
      } else {
        prevState.fields[index] = e.target.checked ? value : '';
      }

      return ({ ...prevState });
    });
  }

  React.useEffect(() => {
    setState((prevState) => ({ ...prevState, fields: {}}));
    Object.keys(editData).map((val, key) => {
      const fieldValidation = formFields.fieldValidation?.[val];
      if(!formFields.fields?.[val]) {
        return;
      }
      
      if(!state.fields[key] && ['id', '_id', 'entryKey', 'createdAt', 'updatedAt', '__v'].indexOf(val) < 0) {
        let value = editData[val];
        if(fieldValidation?.custom?.type === 'boolean' && fieldValidation?.options) {
          value = fieldValidation?.options?.[value ? 0 : 1]?.value;
        } else if(value?.[0]?.value && value?.[0]?.label) {
          value = value.map((item) => item.value);
        } else if(value?.value && value?.label) {
          value = value.value;
        }

        if(isFieldEditable(val) && value !== null) {
          setState((prevState) => ({ ...prevState, fields: {...prevState.fields, [val]: value }}));        
        }
      }
    })

    Object.keys(formFields.fields).map((val, key) => {
      const fieldValidation = formFields.fieldValidation?.[val];
      if(!editData[val] && isFieldEditable(val) && fieldValidation?.custom?.defaultValue) {
        setState((prevState) => ({ ...prevState, fields: {...prevState.fields, [val]: fieldValidation.custom.defaultValue }}));        
      }
    });
  }, [editData]);

  return (
    <>
      <FormModal as={Modal} show={show} enforceFocus={false} className="form-modal" backdrop="static" keyboard={false} onHide={handleClose}>
        {Object.keys(formFields).length ? <>
          <Modal.Header closeButton>
            <Modal.Title>{formFields['title']}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={(e) => { e.preventDefault(); clickHandler(e); }}>
              <Row>
                {formFields['fields'] ? <>
                  {Object.keys(formFields['fields']).map((index, key) => {
                    const isViewMode = isView || !isFieldEditable(index);
                    const options = JSON.parse(JSON.stringify(formFields['fieldValidation'][index]));
                    const custom = options?.custom;
                    if(options?.hide) {
                      return;
                    }
                    const getDefaltValue = () => {
                      if(editData[index]) {
                        if(custom?.type === 'boolean' && options?.type === 'select') {
                          return { defaultValue: options?.options?.[editData[index] ? 0 : 1]?.['value'] };
                        }

                        return options['type'] !== 'file'
                          ? {defaultValue: editData[index]}
                          : (options?.options ? {defaultValue: ''} : {});
                      }

                      return { defaultValue: (custom?.defaultValue || '')};
                    }

                    const defaultValue = getDefaltValue();
                    if(options.custom) {
                      delete options.custom;
                    }
                    if(options?.type === 'date') {
                      if(defaultValue?.defaultValue) {
                        const format = options?.dateFormat + (options?.dateFormat && options?.timeFormat ? ' ' : '') + (options?.timeFormat ? options.timeFormat : '');
                        defaultValue.defaultValue = moment(defaultValue.defaultValue).format(format);                
                      }

                      if(options?.isValidDate) {
                        if(options.isValidDate === 'disablePastDate') {
                          const yesterday = moment().subtract(1, 'day');
                          options.isValidDate = current => {
                            return current.isAfter(yesterday);
                          };
                        }else if(options.isValidDate === 'disableFutureDate') {
                          const today = moment();
                          options.isValidDate = current => {
                            return current.isBefore(today)
                          }
                        }
                      }
                    }

                    const getDefaultVal = () => {
                      if(options['type'] === 'file' && editData?.[index]?.length) {
                        const src = `${process.env.REACT_APP_UPLOAD_PATH}${editData?.[index]}`;
                        const isMatch = src.match(/[.](png|jpg|jpeg|svg)$/i);
                        return isMatch ? <Image src={src} fluid /> : <a href={src} target="_blank">{editData?.[index]}</a>;
                      } else if(['editor', 'advanceEditor'].indexOf(options['type']) > -1) {
                        return <div dangerouslySetInnerHTML={{ __html: htmlDecode(editData?.[index]) || '' }}></div>;
                      } else if(options['type'] === 'select' && options?.options) {
                        let getVal = '';
                        if(custom?.type === 'boolean') {
                          return editData?.[index] ? 'True' : 'False';
                        }

                        options.options.map(item => {
                          if(item?.value === editData?.[index] || (custom?.type === 'boolean' && item?.value == editData?.[index])) {
                            getVal = item.name;
                          }
                        })
                        return getVal;
                      }

                      const defaultVal = defaultValue?.defaultValue;
                      const getString = (val: any) => {
                        if(typeof val === 'object') {
                          if(!Array.isArray(val)) {
                            return <>{Object.keys(val).map((index, key) => {
                              return <div>{`${index} = ${val[index]}`}</div>;
                            })}</>;
                          } else if(options?.multiple && Array.isArray(val)) {
                            return val.map(item => item.label).join(', ');
                          } else if(custom?.value_type === 'array') {
                            const ret_val: any = [];
                            const labels = custom?.label || {};
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

                        return val?.toString().length ? val : options['type'] === 'number' ? 0 : '';
                      }
                      return defaultVal?.label ? defaultVal.label : getString(defaultVal);
                    }

                    const getSelectDefaultValue = (value) => {
                      if(value?.label) {
                        return value.label;
                      } else if(value?.[0]?.label) {
                        return value.map(item => item.label).join(', ');
                      }
                      return '';
                    }

                    return(
                      <>
                        {custom?.groupTitle ? <>
                          <h5 className="col-12 text-bold">{custom.groupTitle} :-</h5>
                        </> : ''}
                        
                        <Form.Group key={key} className={`col-${custom?.col ? custom.col : 12}`} controlId={`formBasic${index}`}>
                            <Form.Label>{formFields['fields'][index]}</Form.Label>
                            {
                              (isViewMode && <>
                                <Form.Text className="form-control">{getDefaultVal()}</Form.Text>
                              </>) ||
                              (options?.type === 'date' && <>
                                <Datetime {...options} {...fieldValidate(index, setState)} renderInput={(props) => {
                                  props.value = props.value.length ? props.value : defaultValue.defaultValue;
                                  
                                  return (
                                    <input value={defaultValue.defaultValue} {...props} onBlur={(e) => {
                                      validator.current.showMessageFor(index);
                                    }} />
                                  )
                                }} />
                              </>) || 
                            
                              (options?.type === 'select' && <>
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
                                    placeholder={getSelectDefaultValue(defaultValue.defaultValue)}
                                    value={defaultValue.defaultValue}
                                    {...options} {...fieldValidate(index, setState)}
                                  />
                              </>) || 
                            
                              (options?.type === 'mask' && <>
                                <InputMask {...options} {...fieldValidate(index, setState)} {...defaultValue}>
                                  { (inputProps) => 
                                    <Form.Control type={isMobile ? "tel" : "text"} {...inputProps} />
                                  }
                                </InputMask>
                              </>) ||
                            
                              (options?.type === 'editor' && <>
                                <TextEditor defaultValue={htmlDecode(defaultValue?.defaultValue) || ''} {...options} {...fieldValidate(index, setState)} />
                              </>) ||
                              
                              (options?.type === 'advanceEditor' && <>
                                <TinyEditor defaultValue={htmlDecode(defaultValue?.defaultValue) || ''} {...options} {...fieldValidate(index, setState)} />
                              </>) ||
                      
                              (options?.type === 'checkbox' ? <> 
                                <Form.Group className='form-control auto-height'>
                                  {Object.keys(custom?.label || {}).map((obj_index, obj_key) => {
                                    const is_array = custom?.['value_type'] === 'array';
                                    const is_checked = is_array ? (defaultValue?.defaultValue || []).indexOf(custom?.label[obj_index]) > -1 : defaultValue?.defaultValue === custom?.label[obj_index];
                                    return (
                                      <Form.Check {...options} {...is_checked ? { checked: true } : {}} id={`checkbox_${index}${obj_index}`} onChange={(e) => multiValueChangeHandler(e, index, custom, obj_index)} label={obj_index} inline key={obj_key} />
                                    )
                                  })}
                                </Form.Group>
                              </> : false) ||
                            
                              (<>
                                <Form.Control {...options} {...fieldValidate(index, setState)} {...defaultValue} />
                              </>)
                            }

                            {!isViewMode && <>
                              <Form.Control.Feedback className="d-block" type="invalid">
                                {fieldValidate(index, state, true)}
                              </Form.Control.Feedback>
                            </>}
                        </Form.Group>
                      </>
                    )
                  } 
                  )}
                </> : ''}
              </Row>

              {isView ? <>
                <Form.Group>
                  <Form.Label>Created At</Form.Label>
                  <Form.Text className="form-control">{moment(editData?.['createdAt']).format('DD MMM, YYYY hh:mm A')}</Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Updated At</Form.Label>
                  <Form.Text className="form-control">{moment(editData?.['updatedAt']).format('DD MMM, YYYY hh:mm A')}</Form.Text>
                </Form.Group>
              </> : <>
                <Button variant="primary" type="submit" onClick={clickHandler} block>
                    Submit
                </Button>
              </>}
            </Form>
          </Modal.Body>

          <Modal.Footer></Modal.Footer>
        </> : <Loader />}
      </FormModal>
    </>
  );
}

export default FormView;

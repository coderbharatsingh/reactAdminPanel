import * as React from 'react';
import { EduleteApi } from 'api';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import Cookies from 'cookies-ts';

const Masquerade: React.FC = () => {
    const [state, setState] = React.useState({
        isLoading: false,
        mobile: ''
    });

    const [, forceUpdate] = React.useState(0);
    const validator = React.useRef(new SimpleReactValidator({
        element: (message, className) => <div className="text-danger">{message}</div>,
        autoForceUpdate: {forceUpdate: forceUpdate}
    }));


    const clickHandler = async (e) => {
        e.preventDefault();
        if (validator.current.allValid()) {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            const results = await EduleteApi.getResult(EduleteApi.masquerade(state.mobile));
            if(results?.['success']) {
                const tokens = results['data']['masqueradeToken'];
                const cookies = new Cookies();
                if(process.env.REACT_APP_TOKEN_NAME && process.env.REACT_APP_REFRESH_TOKEN_NAME) {
                    cookies.set(process.env.REACT_APP_TOKEN_NAME, tokens['token'], { expires: new Date(tokens['expires']) });
                    cookies.set(process.env.REACT_APP_REFRESH_TOKEN_NAME, tokens['token'], { expires: new Date(tokens['expires']) });
                    window.open(process.env.REACT_APP_BASEURL, '_blank');
                }
            }
            setState((prevState) => ({ ...prevState, isLoading: false }));
        } else {
            validator.current.showMessages();
            forceUpdate(1);
        }
    }

    return <>
        <div className="row mt-3">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Masquerade</h3>
                    </div>
                    <div className="card-body">
                        <Row className='justify-content-center'>
                            <Col sm={3}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control value={state.mobile} maxLength={10} onChange={(e) => setState((prevState) => ({ ...prevState, mobile: e.target.value }))} placeholder="Mobile Number" />
                                    {validator.current.message('mobile', state.mobile, 'required|numeric|min:10|max:10')}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                {state.isLoading ? <>
                                <Spinner animation="border" />
                                </> : <>
                                    <Button onClick={clickHandler}>Login</Button>
                                </>}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default Masquerade;

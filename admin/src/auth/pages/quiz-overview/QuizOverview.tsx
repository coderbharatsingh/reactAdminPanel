import * as React from 'react';
import { EduleteApi } from 'api';
import { useSelector } from 'state/hooks/useSelector';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigationActions } from 'state/hooks/useActions';
import { Link } from 'react-router-dom';

const QuizOverview: React.FC = () => {
    const { loadableUser } = useSelector((state) => state);
    const user = loadableUser.isSuccess ? loadableUser.user.data : false;
    const actions = useNavigationActions();
    const [state, setState] = React.useState({
        isLoaded: false,
        refreshBtnLoading: false,
        results: {},
        options: {
            filter: 'weekly',
        }
    });

    const getResults = async () => {
        setState((prevState) => ({ ...prevState, refreshBtnLoading: true }));
        const results = await EduleteApi.getResult(EduleteApi.quizOverview(state.options));
        if(results && results['success']) {
            if(results?.data) {
                setState((prevState) => ({ ...prevState, results: results.data, isLoaded: true, refreshBtnLoading: false }));
            }
        }
    }

    const updateOptions = (e: any) => {
        const val = e.target.value === 0 ? false : e.target.value;
        setState((prevState) => ({ ...prevState, options: { ...prevState.options, filter: val }}));
    }

    React.useEffect(() => {
        if(user) {
            if((user.permission?.dashboard || []).indexOf('r') > -1) {
                getResults();
            } else {
                actions.navigateToPath('/');
            }
        }
    }, [user, state.options]);
      
    return <>
        <div className="row mt-3">
            <div className="col-12">
                <div className="card">
                    <div className="card-header d-flex align-items-center">
                        <h3 className="card-title">Quiz Overview</h3>

                        <div className="ml-auto">
                            <Form.Control as="select" onChange={updateOptions}>
                                <option value="weekly">Weekly</option>
                                <option value="fortnightly">Fortnightly</option>
                                <option value="monthly">Monthly</option>
                            </Form.Control>
                        </div>

                        <div className="ml-3">
                            {state.refreshBtnLoading ? <>
                                <Spinner animation="border" />
                            </> : <>
                                <Button onClick={getResults}>Refresh</Button>
                            </>}
                        </div>
                    </div>
                    <div className="card-body">       
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Days</th>
                                    <th>Total Quizes</th>
                                    <th>Lack of Questions</th>
                                    <th>Invalid End Date</th>
                                    <th>Prize Distributed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(state.results).map((key, index) => {
                                    const total = state.results[key]?.total || 0;
                                    const questionLack = state.results[key]?.questionLack || 0;
                                    const invalidDate = state.results[key]?.invalidDate || 0;
                                    const prize = state.results[key]?.prize || 0;

                                    return <>
                                        <tr>
                                            <td><Link to={`/quiz?startTime=${encodeURI(key)}`}>{index === 0 ? 'Today' : key}</Link></td>
                                            <td className={total < 1 ? 'invalid' : ''}>{total}</td>
                                            <td className={questionLack > 0 ? 'invalid' : ''}>{questionLack}</td>
                                            <td className={invalidDate > 0 ? 'invalid' : ''}>{invalidDate}</td>
                                            <td className={index > 0 && prize > 0 ? 'invalid' : ''}>{prize}</td>
                                        </tr>
                                    </>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default QuizOverview;

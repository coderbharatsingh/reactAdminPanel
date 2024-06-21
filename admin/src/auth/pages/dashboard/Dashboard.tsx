import * as React from 'react';
import { EduleteApi } from 'api';
import EduleteSkeleton from 'auth/common/ui/skeleton/EduleteSkeleton';
import { useSelector } from 'state/hooks/useSelector';
import { Button, Spinner, Form } from 'react-bootstrap';
import { formatNumber } from 'state/hooks/useAuth';
import { DashboardCss } from './Css';

const Dashboard: React.FC = () => {
    const { loadableUser } = useSelector((state) => state);
    const user = loadableUser.isSuccess ? loadableUser.user.data : false;
    const [state, setState] = React.useState({
        isLoaded: false,
        haveAccess: true,
        refreshBtnLoading: false,
        results: {},
        options: {
            year: false,
            month: false
        }
    });

    const getInfoBox = (icon: string, bgColor: string = 'info', title: string, data: string[][], numFormat: boolean = true) => {
        return <>
            <div className={`small-box bg-${bgColor}`}>
                <div className="inner">
                    <h3>{title}</h3>
                    <div className="parent">
                        {data.map((item, key) => 
                            <div className="counter" key={key}>{item?.[0]}: <span>{numFormat ? formatNumber(item?.[1]) : item?.[1]}</span>{key + 1 < data.length && ','}</div>
                        )}
                    </div>
                </div>
                <div className="icon">
                    <i className={`fas fa-${icon}`}></i>
                </div>
            </div>
        </>;
    }

    const getResults = async () => {
        if(user && (user.permission?.dashboard || []).indexOf('r') > -1) {
            setState((prevState) => ({ ...prevState, refreshBtnLoading: true }));
            const results = await EduleteApi.getResult(EduleteApi.dashboard(state.options));
            if(results && results['success']) {
                if(results?.data) {
                    setState((prevState) => ({ ...prevState, results: results.data, isLoaded: true, refreshBtnLoading: false }));
                }
            }
        } else {
            setState((prevState) => ({ ...prevState, haveAccess: false }));
        }
    }

    const updateOptions = (e: any, type: string = 'month') => {
        const val = e.target.value === 0 ? false : e.target.value;
        setState((prevState) => ({ ...prevState, options: { ...prevState.options, [type]: val }}));
    }

    const redemptionParams = [
        ['freeCount', 'Free PDF Users'],
        ['freeBonus', 'Free PDF Bonus', 'gifts'],
        ['paidCount', 'Paid PDF Users'],
        ['paidBonus', 'Paid PDF Bonus', 'gifts'],
        ['paidMoney', 'Paid PDF Cash', 'money'],
        ['depositCount', 'PDF Deposit Users'],
        ['depositMoney', 'PDF Deposit Cash', 'money'],
        ['redeemCount', 'Bonus Redeem Users'],
        ['redeemBonus', 'Bonus Charged', 'gifts'],
        ['redeemDeposit', 'Redeem Deposit Cash', 'money'],
    ];

    React.useEffect(() => {
        if(user) {
            getResults();
        }
    }, [user, state.options]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'];

    return <>
        <DashboardCss className="row mt-3">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Dashboard</h3>
                        
                        <div className="d-flex ml-4">
                            <Form.Control as="select" onChange={(e) => updateOptions(e)}>
                                <option value={0}>Month</option>
                                {months.map((val, key) => 
                                    <option value={key + 1} key={key}>{val}</option>
                                )}
                            </Form.Control>
                            <Form.Control as="select" onChange={(e) => updateOptions(e, 'year')}>
                                <option value={0}>Year</option>
                                {[2021, 2022].map((val, key) => 
                                    <option value={val} key={key}>{val}</option>
                                )}
                            </Form.Control>
                        </div>

                        {!state.haveAccess ? '' : state.refreshBtnLoading ? <>
                            <Spinner animation="border" />
                        </> : <>
                            <Button className="ml-auto" onClick={getResults}>Refresh</Button>
                        </>}
                    </div>
                    <div className="card-body">
                        {state.isLoaded ? <>
                            <h3 className="body-title mt-0">Database Details</h3>
                            <div className="row">
                                <div className="col-sm-4">
                                    {getInfoBox('database', 'warning', `Database Size: ${state.results?.['dbStats']?.['totalSize']}`, [
                                        ['Data Size', state.results?.['dbStats']?.['dataSize']],
                                        ['Free Size', state.results?.['dbStats']?.['freeStorageSize']],
                                        ['Total Free Size', state.results?.['dbStats']?.['totalFreeStorageSize']],
                                        ['Storage Size', state.results?.['dbStats']?.['storageSize']],
                                        ['Disk Used', state.results?.['dbStats']?.['fsUsedSize']],
                                        ['Disk Size', state.results?.['dbStats']?.['fsTotalSize']],
                                    ], false)}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('users', 'light', `Active Users: ${state.results?.['activeUsers']}`, [], false)}
                                </div>
                            </div>

                            <h3 className="body-title">User Details</h3>
                            <div className="row">
                                <div className="col-sm-4">
                                    {getInfoBox('users', 'light', `${formatNumber(state.results?.['user']?.['total'])} Users`, [
                                        ['Today', state.results?.['user']?.['today']],
                                        ['Yesterday', state.results?.['user']?.['yesterday']],
                                        ['This Week', state.results?.['user']?.['thisWeek']],
                                        ['This Month', state.results?.['user']?.['thisMonth']],
                                        ['This Year', state.results?.['user']?.['thisYear']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('users', 'warning', `${formatNumber(state.results?.['payment']?.['total']?.['registerUsers'])} Real Users`, [
                                        ['Today', state.results?.['payment']?.['today']?.['registerUsers']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['registerUsers']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['registerUsers']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['registerUsers']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['registerUsers']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'light', `Registration Cash: ${formatNumber(state.results?.['payment']?.['total']?.['registerMoney'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['registerMoney']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['registerMoney']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['registerMoney']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['registerMoney']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['registerMoney']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'warning', `Registration Bonus: ${formatNumber(state.results?.['payment']?.['total']?.['registerBonus'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['registerBonus']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['registerBonus']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['registerBonus']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['registerBonus']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['registerBonus']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('users', 'light', `Referral Users: ${formatNumber(state.results?.['payment']?.['total']?.['referralUsers'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['referralUsers']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['referralUsers']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['referralUsers']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['referralUsers']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['referralUsers']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'warning', `Referral Cash: ${formatNumber(state.results?.['payment']?.['total']?.['referralMoney'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['referralMoney']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['referralMoney']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['referralMoney']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['referralMoney']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['referralMoney']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'light', `Referral Bonus: ${formatNumber(state.results?.['payment']?.['total']?.['referralBonus'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['referralBonus']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['referralBonus']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['referralBonus']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['referralBonus']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['referralBonus']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'warning', `Rank Share Users: ${formatNumber(state.results?.['payment']?.['total']?.['rankShareUsers'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['rankShareUsers']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['rankShareUsers']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['rankShareUsers']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['rankShareUsers']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['rankShareUsers']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'light', `Rank Share Bonus: ${formatNumber(state.results?.['payment']?.['total']?.['rankShareBonus'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['rankShareBonus']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['rankShareBonus']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['rankShareBonus']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['rankShareBonus']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['rankShareBonus']],
                                    ])}
                                </div>
                            </div>

                            <h3 className="body-title">Redemption Details</h3>
                            <div className="row">
                                {redemptionParams.map((data, key) => 
                                    <div className="col-sm-4" key={key}>
                                        {getInfoBox(data?.[2] || 'users', (key % 2 ? 'light' : 'warning'), `${data?.[1]}: ${formatNumber(state.results?.['redemption']?.['total']?.[data?.[0]])}`, [
                                            ['Today', state.results?.['redemption']?.['today']?.[data?.[0]]],
                                            ['Yesterday', state.results?.['redemption']?.['yesterday']?.[data?.[0]]],
                                            ['This Week', state.results?.['redemption']?.['thisWeek']?.[data?.[0]]],
                                            ['This Month', state.results?.['redemption']?.['thisMonth']?.[data?.[0]]],
                                            ['This Year', state.results?.['redemption']?.['thisYear']?.[data?.[0]]],
                                        ])}
                                    </div>
                                )}
                            </div>

                            <h3 className="body-title">Payment Details</h3>
                            <div className="row">
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'warning', `Deposit Cash: ${formatNumber(state.results?.['payment']?.['total']?.['depositMoney'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['depositMoney']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['depositMoney']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['depositMoney']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['depositMoney']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['depositMoney']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'light', `Winning Cash: ${formatNumber(state.results?.['payment']?.['total']?.['winMoney'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['winMoney']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['winMoney']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['winMoney']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['winMoney']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['winMoney']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'warning', `Bonus Cash: ${formatNumber(state.results?.['payment']?.['total']?.['bonus'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['bonus']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['bonus']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['bonus']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['bonus']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['bonus']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'light', `Winning Bonus Cash: ${formatNumber(state.results?.['payment']?.['total']?.['winBonus'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['winBonus']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['winBonus']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['winBonus']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['winBonus']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['winBonus']],
                                    ])}
                                </div>
                            </div>

                            <h3 className="body-title">Withdrawal Details</h3>
                            <div className="row">
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'warning', `Withdrawal Request: ${formatNumber(state.results?.['payment']?.['total']?.['withdrawalRequest'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['withdrawalRequest']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['withdrawalRequest']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['withdrawalRequest']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['withdrawalRequest']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['withdrawalRequest']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'light', `Withdrawal Amount: ${formatNumber(state.results?.['payment']?.['total']?.['withdrawalMoney'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['withdrawalMoney']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['withdrawalMoney']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['withdrawalMoney']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['withdrawalMoney']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['withdrawalMoney']],
                                    ])}
                                </div>
                            </div>

                            <h3 className="body-title">Quiz Details</h3>
                            <div className="row">
                                <div className="col-sm-4">
                                    {getInfoBox('question-circle', 'light', `${formatNumber(state.results?.['quiz']?.['total']?.['count'])} Quizes`, [
                                        ['Today', state.results?.['quiz']?.['today']?.['count']],
                                        ['Yesterday', state.results?.['quiz']?.['yesterday']?.['count']],
                                        ['This Week', state.results?.['quiz']?.['thisWeek']?.['count']],
                                        ['This Month', state.results?.['quiz']?.['thisMonth']?.['count']],
                                        ['This Year', state.results?.['quiz']?.['thisYear']?.['count']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('users', 'warning', `User Played: ${formatNumber(state.results?.['quiz']?.['total']?.['attempt'])}`, [
                                        ['Today', state.results?.['quiz']?.['today']?.['attempt']],
                                        ['Yesterday', state.results?.['quiz']?.['yesterday']?.['attempt']],
                                        ['This Week', state.results?.['quiz']?.['thisWeek']?.['attempt']],
                                        ['This Month', state.results?.['quiz']?.['thisMonth']?.['attempt']],
                                        ['This Year', state.results?.['quiz']?.['thisYear']?.['attempt']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('money', 'light', `Entry Fees Amount: ${formatNumber(state.results?.['payment']?.['total']?.['entryFeesMoney'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['entryFeesMoney']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['entryFeesMoney']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['entryFeesMoney']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['entryFeesMoney']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['entryFeesMoney']],
                                    ])}
                                </div>
                                <div className="col-sm-4">
                                    {getInfoBox('gifts', 'warning', `Entry Fees Bonus: ${formatNumber(state.results?.['payment']?.['total']?.['entryFeesBonus'])}`, [
                                        ['Today', state.results?.['payment']?.['today']?.['entryFeesBonus']],
                                        ['Yesterday', state.results?.['payment']?.['yesterday']?.['entryFeesBonus']],
                                        ['This Week', state.results?.['payment']?.['thisWeek']?.['entryFeesBonus']],
                                        ['This Month', state.results?.['payment']?.['thisMonth']?.['entryFeesBonus']],
                                        ['This Year', state.results?.['payment']?.['thisYear']?.['entryFeesBonus']],
                                    ])}
                                </div>
                            </div>
                        </> : (state.haveAccess ? <EduleteSkeleton type="content-style-2" /> : <>
                            <h4 className='text-center'>No Result Found</h4>
                        </>)}
                    </div>
                </div>
            </div>
        </DashboardCss>
    </>;
}

export default Dashboard;

import * as React from 'react';
import {Provider} from 'react-redux';
import {getStore} from "state";
import {useEffect, useState} from "react";
import { HelmetProvider } from 'react-helmet-async';
import { App } from 'app';
import init from "state/StateInitializer";

const ReactApp: React.FC = (children) => {
    let [isInit, setIsInit] = useState<boolean>(false);
    useEffect(() => {
        init.initStore();
        setIsInit(true);
    }, []);

    if (!isInit)
        return  <div />;

    return (
        <Provider store={getStore()}>
            <HelmetProvider>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </HelmetProvider>
        </Provider>
    );
}

export default ReactApp;

import * as React from "react";
import { useState, useEffect } from 'react';
import withSizes from 'react-sizes';
import { Container } from "react-bootstrap";
import { Skeleton } from '@material-ui/lab';
import "./EduleteSkeleton.scss";

interface EduleteSkeletonParams {
    type?: string,
    type_sm?: string,
    type_md?: string,
    type_lg?: string,
    type_xl?: string,
    className?: string,
    deviceWidth : number
}

const EduleteSkeleton: React.FC<EduleteSkeletonParams> = ( props ) => {
    const deviceWidth = props.deviceWidth;
    const className = props.className || '';
    const device_resolution = deviceWidth < 576 ? 1 : (deviceWidth < 768 ? 2 : (deviceWidth < 992 ? 3 : (deviceWidth < 1200 ? 4 : 5 )));
    const type_arr = ['type', 'type_sm', 'type_md', 'type_lg', 'type_xl'];
    const [type, setType] = useState("content");

    useEffect(() => {
        for (let x = device_resolution; x > 0; x--) {
            if (props[type_arr[x-1]]) {
                setType(props[type_arr[x-1]]);
                break;
            }
        }
    }, [device_resolution]);

    if (type === "page-loader") {
        return (
            <>
                <Container className={className}>
                    <Skeleton style={{ height: "50vh" }} />
                    <Skeleton height={45} />
                    <Skeleton height={35} style={{ width: "60%" }} />
                </Container>
            </>
        )
    } else if (type === "content") {
        return (
            <>
                <Container className={`${className} skeleton-list`}>
                    <Skeleton height={35} />
                    <Skeleton style={{ width: "90%" }} />
                </Container>
            </>
        );
    } else if (type === "content-style-1") {
        return (
            <>
                <Container className={`${className} skeleton-list`}>
                    <Skeleton height={25} />
                    <Skeleton style={{ width: "30%" }} height={35} />
                    <Skeleton height={35} />
                </Container>
            </>
        )
    } else if (type === "content-style-2") {
        return (
            <>
                <Container className={`${className} skeleton-list`}>
                    <Skeleton />
                    <Skeleton style={{ width: "80%" }} height={50} />
                    <Skeleton style={{ width: "40%" }} />
                    <Skeleton style={{ marginTop: "10px" }} height={50} />    
                </Container>
            </>
        )
    } else if (type === "profile-content") {
        return (
            <>
                <Container className={`${className} skeleton-list`}>
                    <div className="d-flex align-items-center">
                        <Skeleton variant="circle" height={100} width={100} />
                        <div className="flex-fill ml-5">
                            <Skeleton height={25} />
                            <Skeleton height={25} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <Skeleton height={25} />
                        <Skeleton style={{ width: "30%" }} height={35} />
                        <Skeleton height={35} />
                    </div>
                </Container>
            </>
        )
    } else if (type === "card") {
        const arr_length = device_resolution < 4 ? device_resolution : 4;

        return (
            <>
                <div className={`${className} skeleton-list`}>
                    <div className="row m-0">
                        {new Array(arr_length).fill(undefined).map((val, key) =>
                            <div className="col-sm-6 col-md-4 col-lg-3" key={key}>
                                <div className="skeleton-list-media">
                                    {/* <div className="img-list">
                                        <Skeleton variant="circle" />
                                    </div> */}

                                    <div className="skeleton-body">
                                        <Skeleton />
                                        <Skeleton style={{ width: "80%" }} height={50} />
                                        <Skeleton style={{ width: "40%" }} />
                                        <Skeleton style={{ marginTop: "10px" }} height={50} />                                        
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    } else if (type === "card-row") {
        return (
            <>
                <div className={`${className} skeleton-list`}>
                    <div className="row m-0">
                        {new Array(3).fill(undefined).map((val, key) =>
                            <div className="col-sm-12 mb-5" key={key}>
                                <div className="skeleton-list-media row-list">
                                    <div className="img-list">
                                        <Skeleton variant="circle" />
                                    </div>

                                    <div className="skeleton-body">
                                        <Skeleton />
                                        <Skeleton style={{ width: "80%" }} height={50} />
                                        <Skeleton style={{ width: "40%" }} />
                                        <Skeleton style={{ marginTop: "10px" }} height={50} />                                        
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    } else {
        return <div/>;
    }
}

const mapSizesToProps = ({ width }) => ({
    deviceWidth: width
});

export default withSizes(mapSizesToProps)(EduleteSkeleton);

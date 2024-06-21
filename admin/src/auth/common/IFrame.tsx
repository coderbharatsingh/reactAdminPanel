import * as React from 'react';
import { createPortal } from 'react-dom'

interface IframeParams {
    onContentMount?: (body: HTMLElement) => void;
    onError?: () => void;
    className?: string;
}
  
const IFrame: React.FC<IframeParams> = ({ onContentMount, onError, ...props }) => {
    const [state, setState] = React.useState<{
        mountNode: HTMLElement | null
    }>({ mountNode: null });
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useLayoutEffect(() => {
        setState({
          mountNode: iframeRef?.current?.contentWindow?.document?.body || null
        })
    }, []);
    
    React.useEffect(() => {
        if(state.mountNode && onContentMount) {
            if(iframeRef?.current?.contentWindow?.document?.body) {
                onContentMount(iframeRef.current.contentWindow.document.body);
            }
        }
    }, [state.mountNode]);

    const onLoadHandler = (e) => {
        if(onError) {
            onError();
        }
    }

    return <>
        <iframe
            {...props}
            ref={iframeRef}
            onLoad={onLoadHandler}
        >
            {state.mountNode && createPortal(props.children, state.mountNode)}
        </iframe>
    </>;
}

export default IFrame;

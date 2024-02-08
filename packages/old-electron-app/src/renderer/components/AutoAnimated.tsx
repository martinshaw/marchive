import autoAnimate from "@formkit/auto-animate";
import { ReactNode, useEffect, useRef } from "react";

export type AutoAnimatedPropsType = {
    additionalClassNames?: string;
    children: ReactNode;
};

const AutoAnimated = (props: AutoAnimatedPropsType) => {
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (parentRef.current == null) return;

        autoAnimate(parentRef.current)
    }, [parentRef])

    return (
        <div ref={parentRef} className={props.additionalClassNames || ''}>
            {props.children}
        </div>
    )
}

export default AutoAnimated;

import {ImageResponse} from "next/server";

export const size = {
    width: 32,
    height: 32,
}
const Icon = () => {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                W
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
export default Icon

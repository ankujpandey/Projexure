import React from 'react'

type Props = {
    name: string;
    settings?: any;
    description?: any;
    buttonComponent?: any;
    isSmalltext?: boolean;
}

const Header = ({ name, settings='',description='', buttonComponent, isSmalltext = false }: Props) => {
    return (
        <div className="mb-5">
            <div className="flex w-full items-center justify-between">
                <h1
                    className={`${isSmalltext ? "text-lg" : "text-2xl"} font-semibold dark:text-white flex items-center gap-1`}
                >
                    {name} {settings}
                </h1>
                {buttonComponent}
            </div>
            {description}
        </div>
    );
};

export default Header

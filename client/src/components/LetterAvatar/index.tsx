// components/LetterAvatar.tsx
import React from 'react';
import Avatar from '@mui/material/Avatar';
import { stringToColor } from '@/lib/utils';
import { SxProps } from '@mui/material';

type LetterAvatarProps = {
    name: string;
    size?: number;
    sx?: SxProps;
}

const LetterAvatar = ({ name, size = 56, sx }: LetterAvatarProps) => {
    const bgColor = stringToColor(name);
    const initial = name.split(' ')[0].charAt(0).toUpperCase();
    return (
        <Avatar
            sx={{
                bgcolor: bgColor,
                width: size,
                height: size,
                fontSize: `${size * 0.5}px`,
                fontFamily: 'Silkscreen, sans-serif',
                ...sx,
            }}
        >
            <span style={{ fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: "0.1rem" }}>
                {initial}
            </span>
        </Avatar>
    );
};

export default LetterAvatar;

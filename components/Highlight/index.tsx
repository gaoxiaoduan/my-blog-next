import type { NextPage } from 'next';

interface IProps {
    text: string;
    search: string;
}

const Highlight: NextPage<IProps> = ({ text, search }) => {
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
        <>
            {parts.map((part, index) => (
                <span key={index} className={part.toLowerCase() === search.toLowerCase() ? 'highlight' : ''}>
                    {part}
                </span>
            ))}
        </>
    );
};

export default Highlight;

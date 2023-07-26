import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import Icons from './Icons';

interface Props {
    user: Pick<User, 'name' | 'image'>;
}

export default function UserAvatar({ user: { name, image } }: Props) {
    return (
        <Avatar>
            <span className="sr-only">{name}</span>
            {image ? (
                <AvatarImage src={image!} referrerPolicy="no-referrer" />
            ) : (
                <AvatarFallback>
                    <Icons.user className="h-10 w-10" />
                </AvatarFallback>
            )}
        </Avatar>
    );
}

import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import Icons from "./Icons";

interface Props {
    user: Pick<User, "name" | "image">;
    className?: string;
}

export default function UserAvatar({
    user: { name, image },
    className,
}: Props) {
    return (
        <Avatar>
            <span className="sr-only">{name}</span>
            {image ? (
                <AvatarImage src={image!} referrerPolicy="no-referrer" />
            ) : (
                <AvatarFallback>
                    <Icons.user className={className || `h-10 w-10`} />
                </AvatarFallback>
            )}
        </Avatar>
    );
}

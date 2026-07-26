import { Avatar, AvatarFallback } from "../ui/avatar";


export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b px-6">
            <h2 className="text-xl font-semibold">
                FlowDesk
            </h2>

            <Avatar>
                <AvatarFallback>GK</AvatarFallback>
            </Avatar>
        </header>
    );
}